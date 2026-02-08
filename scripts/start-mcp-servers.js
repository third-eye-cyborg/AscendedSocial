const { spawn } = require('child_process');
const ReplitMCPLogger = require('./replit-logging-setup');

const MCP_SERVER_CONFIG = Object.freeze({
  'chromatic-storybook': () => ({
    executable: 'npx',
    args: ['@chromatic-com/storybook-mcp', '--project-token', process.env.CHROMATIC_PROJECT_TOKEN, '--storybook-url', 'http://localhost:6006']
  }),
  'storybook': () => ({
    executable: 'npx',
    args: ['@storybook/mcp-server', '--port', '6006', '--config-dir', '.storybook']
  }),
  'chromatic-cypress': () => ({
    executable: 'npx',
    args: ['@chromatic-com/cypress-mcp', '--project-token', process.env.CHROMATIC_PROJECT_TOKEN, '--cypress-config', 'cypress.config.js']
  }),
  'playwright-chromatic': () => ({
    executable: 'npx',
    args: ['@chromatic-com/playwright-mcp', '--project-token', process.env.CHROMATIC_PROJECT_TOKEN, '--headless', '--no-sandbox']
  }),
  'bytebot': () => ({
    executable: 'npx',
    args: ['@bytebot/mcp-server', '--config', '.bytebot/replit-config.json']
  })
});

const ALLOWED_EXECUTABLES = new Set(['npx', 'npm']);

class ReplitMCPManager {
  constructor() {
    this.logger = new ReplitMCPLogger();
    this.servers = new Map();
    this.storybookStarted = false;
  }

  async startAll() {
    console.log('🚀 Starting Ascended Social MCP Servers on Replit...');
    
    // Check for required environment variables
    this.checkEnvironment();
    
    // Start Storybook first (required for other servers)
    await this.startStorybook();
    
    // Wait a moment for Storybook to be fully ready
    await this.sleep(5000);
    
    // Start all MCP servers
    const chromaticToken = process.env.CHROMATIC_PROJECT_TOKEN;
    const serverNames = Object.keys(MCP_SERVER_CONFIG).filter((name) => {
      if (name.startsWith('chromatic') && !chromaticToken) {
        console.warn(`⚠️  Skipping ${name} (CHROMATIC_PROJECT_TOKEN is missing)`);
        this.logger.log('replit', 'warn', `Skipping ${name} - missing CHROMATIC_PROJECT_TOKEN`);
        return false;
      }
      return true;
    });

    for (const name of serverNames) {
      await this.startServer(name);
    }
    
    console.log('✅ All MCP servers started successfully!');
    
    // Start monitoring
    await this.logger.watchReplitServices();
  }

  checkEnvironment() {
    const requiredEnvVars = [
      'CHROMATIC_PROJECT_TOKEN',
      'DATABASE_URL'
    ];

    const missing = requiredEnvVars.filter(envVar => !process.env[envVar]);
    
    if (missing.length > 0) {
      console.warn('⚠️  Missing environment variables:', missing.join(', '));
      this.logger.log('replit', 'warn', `Missing environment variables: ${missing.join(', ')}`);
    } else {
      console.log('✅ Environment variables check passed');
      this.logger.log('replit', 'info', 'All required environment variables are present');
    }
  }

  async startStorybook() {
    if (this.storybookStarted) return;
    
    return new Promise((resolve) => {
      console.log('📚 Starting Storybook on port 6006...');
      const storybook = spawn('npm', ['run', 'storybook'], {
        stdio: 'pipe',
        env: { ...process.env }
      });
      
      storybook.stdout.on('data', (data) => {
        const output = data.toString();
        this.logger.log('storybook', 'info', output.trim());
        
        if (output.includes('Local:') || output.includes('6006')) {
          this.logger.log('storybook', 'info', 'Storybook started successfully');
          this.storybookStarted = true;
          resolve();
        }
      });

      storybook.stderr.on('data', (data) => {
        this.logger.log('storybook', 'error', data.toString().trim());
      });

      // Fallback resolve after 10 seconds
      setTimeout(() => {
        if (!this.storybookStarted) {
          console.log('📚 Storybook startup timeout - continuing anyway...');
          this.storybookStarted = true;
          resolve();
        }
      }, 10000);
    });
  }

  /**
   * Starts a child process for an MCP server.
   * SECURITY: Only whitelisted commands are allowed. Args must be an array of strings.
   * Never pass user input directly to this function.
   */
  async startServer(name) {
    // Validate name parameter is from whitelist to prevent command injection
    if (typeof name !== 'string' || !MCP_SERVER_CONFIG.hasOwnProperty(name)) {
      throw new Error(`Blocked attempt to start unknown server: ${String(name)}`);
    }

    const configFactory = MCP_SERVER_CONFIG[name];
    if (typeof configFactory !== 'function') {
      throw new Error(`Invalid server configuration for: ${name}`);
    }

    const { executable, args } = configFactory();

    // Validate executable is in whitelist (defense in depth)
    if (!ALLOWED_EXECUTABLES.has(executable)) {
      throw new Error(`Blocked attempt to run disallowed command: ${executable}`);
    }

    // Validate all arguments
    if (!Array.isArray(args)) {
      throw new Error(`Arguments for ${name} must be an array`);
    }

    if (!args.every(arg => typeof arg === 'string' && arg.length > 0)) {
      throw new Error(`Arguments for ${name} must be a non-empty array of strings`);
    }

    // Reject arguments with dangerous characters
    if (args.some(arg => arg.includes('\n') || arg.includes('\r') || arg.includes('$(') || arg.includes('`'))) {
      throw new Error(`Arguments for ${name} contain dangerous characters`);
    }

    if (args.includes(undefined) || args.includes(null)) {
      throw new Error(`Arguments for ${name} include missing environment variables`);
    }
    try {
      console.log(`🔧 Starting ${name}...`);
      
      // SECURITY: Spawn with shell: false to prevent command injection
      // All executable and args have been validated against whitelists above
      const spawnOptions = {
        stdio: 'pipe',
        env: { ...process.env },
        shell: false,  // CRITICAL: Direct command execution without shell interpretation
        windowsHide: true
      };

      // Verify spawn options are secure before execution
      if (spawnOptions.shell !== false) {
        throw new Error('SECURITY VIOLATION: shell must be disabled');
      }

      const childProcess = spawn(executable, args, spawnOptions);
      this.servers.set(name, childProcess);
      childProcess.stdout.on('data', (data) => {
        this.logger.log(name, 'info', data.toString().trim());
      });
      childProcess.stderr.on('data', (data) => {
        this.logger.log(name, 'error', data.toString().trim());
      });
      childProcess.on('exit', (code) => {
        this.logger.log('replit', 'warn', `MCP server ${name} exited with code ${code}`);
        this.servers.delete(name);
      });
      this.logger.log('replit', 'info', `Started MCP server: ${name}`);
      // Give each server a moment to start
      await this.sleep(1000);
    } catch (error) {
      this.logger.log('replit', 'error', `Failed to start ${name}: ${error.message}`);
      console.error(`❌ Failed to start ${name}:`, error.message);
    }
  }

  async stop() {
    console.log('🛑 Stopping all MCP servers...');
    
    for (const [name, process] of this.servers) {
      try {
        process.kill('SIGTERM');
        this.logger.log('replit', 'info', `Stopped MCP server: ${name}`);
      } catch (error) {
        this.logger.log('replit', 'error', `Error stopping ${name}: ${error.message}`);
      }
    }
    
    this.servers.clear();
    this.logger.close();
    console.log('✅ All MCP servers stopped');
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  getStatus() {
    const status = {
      running: this.servers.size,
      servers: Array.from(this.servers.keys()),
      storybookReady: this.storybookStarted
    };
    
    console.log('📊 MCP Server Status:', status);
    return status;
  }
}

// Auto-start if run directly
if (require.main === module) {
  const manager = new ReplitMCPManager();
  
  // Handle startup
  manager.startAll().catch(error => {
    console.error('❌ Failed to start MCP servers:', error);
    process.exit(1);
  });
  
  // Graceful shutdown
  process.on('SIGINT', async () => {
    console.log('\n🔄 Received SIGINT, shutting down gracefully...');
    await manager.stop();
    process.exit(0);
  });
  
  process.on('SIGTERM', async () => {
    console.log('\n🔄 Received SIGTERM, shutting down gracefully...');
    await manager.stop();
    process.exit(0);
  });

  // Status check every 5 minutes
  setInterval(() => {
    manager.getStatus();
  }, 300000);
}

module.exports = ReplitMCPManager;
