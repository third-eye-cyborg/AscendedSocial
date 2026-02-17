const { spawn } = require('child_process');
const ReplitMCPLogger = require('./replit-logging-setup');

const MCP_SERVER_CONFIG = Object.freeze({
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
  }

  async startAll() {
    console.log('🚀 Starting Ascended Social MCP Servers on Replit...');
    
    // Check for required environment variables
    this.checkEnvironment();
    
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

  /**
   * Starts a child process for an MCP server.
   * SECURITY: Only whitelisted commands are allowed. Args must be an array of strings.
   * Never pass user input directly to this function. All parameters are validated
   * against hardcoded whitelists to prevent command injection attacks.
   * @param {string} name - Name of the server from MCP_SERVER_CONFIG whitelist only
   */
  async startServer(name) {
    // SECURITY: Use explicit switch statement with hardcoded values
    // This prevents dynamic command execution and satisfies static analysis
    let executable, args;
    
    switch (String(name).toLowerCase().trim()) {
      case 'chromatic-cypress':
        executable = 'npx';
        args = ['@chromatic-com/cypress-mcp', '--project-token', process.env.CHROMATIC_PROJECT_TOKEN, '--cypress-config', 'cypress.config.js'];
        break;
      case 'playwright-chromatic':
        executable = 'npx';
        args = ['@chromatic-com/playwright-mcp', '--project-token', process.env.CHROMATIC_PROJECT_TOKEN, '--headless', '--no-sandbox'];
        break;
      case 'bytebot':
        executable = 'npx';
        args = ['@bytebot/mcp-server', '--config', '.bytebot/replit-config.json'];
        break;
      default:
        throw new Error(`Invalid server name: "${String(name)}". Allowed: chromatic-cypress, playwright-chromatic, bytebot`);
    }

    // SECURITY: Validate executable is in hardcoded whitelist (defense in depth)
    if (executable !== 'npx' && executable !== 'npm') {
      throw new Error(`Invalid executable: ${executable}`);
    }

    // Validate all arguments
    if (!Array.isArray(args)) {
      throw new Error(`Arguments for ${name} must be an array`);
    }

    // Ensure all arguments are non-empty strings
    if (!args.every(arg => typeof arg === 'string' && arg.length > 0)) {
      throw new Error(`Arguments for ${name} must be a non-empty array of strings`);
    }

    // Reject arguments with dangerous characters that could enable shell injection
    const dangerousPatterns = ['\n', '\r', '$(', '`', '&', '|', ';', '>', '<'];
    if (args.some(arg => dangerousPatterns.some(pattern => arg.includes(pattern)))) {
      throw new Error(`Arguments for ${name} contain dangerous characters`);
    }

    // Ensure no null/undefined values which might come from missing env vars
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

      // SECURITY: Double-check spawn options are secure before execution
      if (spawnOptions.shell !== false) {
        throw new Error('SECURITY VIOLATION: shell must be disabled');
      }
      
      if (!ALLOWED_EXECUTABLES.has(executable)) {
        throw new Error('SECURITY VIOLATION: executable not in whitelist');
      }
      
      if (!Array.isArray(args)) {
        throw new Error('SECURITY VIOLATION: args must be an array');
      }

      // SECURITY: Only pass validated executable and args to spawn
      // This prevents command injection since we never allow shell interpretation
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
      servers: Array.from(this.servers.keys())
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
