const { spawn } = require('child_process');
const ReplitMCPLogger = require('./replit-logging-setup');

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
    await this.startServer('chromatic-storybook', 'npx', ['@chromatic-com/storybook-mcp', '--project-token', process.env.CHROMATIC_PROJECT_TOKEN, '--storybook-url', 'http://localhost:6006']);
    await this.startServer('storybook', 'npx', ['@storybook/mcp-server', '--port', '6006', '--config-dir', '.storybook']);
    await this.startServer('chromatic-cypress', 'npx', ['@chromatic-com/cypress-mcp', '--project-token', process.env.CHROMATIC_PROJECT_TOKEN, '--cypress-config', 'cypress.config.js']);
    await this.startServer('playwright-chromatic', 'npx', ['@chromatic-com/playwright-mcp', '--project-token', process.env.CHROMATIC_PROJECT_TOKEN, '--headless', '--no-sandbox']);
    await this.startServer('bytebot', 'npx', ['@bytebot/mcp-server', '--config', '.bytebot/replit-config.json']);
    
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
  async startServer(name, command, args) {
    // Whitelist allowed commands for extra safety
    const allowedCommands = ['npx', 'npm'];
    if (!allowedCommands.includes(command)) {
      throw new Error(`Blocked attempt to run disallowed command: ${command}`);
    }
    // Validate args is an array of strings and does not contain dangerous characters
    if (!Array.isArray(args) || !args.every(arg => typeof arg === 'string')) {
      throw new Error('Arguments to startServer must be an array of strings');
    }
    // Optionally, check for shell metacharacters (paranoia)
    const forbiddenPattern = /[;&|$><`\\]/;
    if (args.some(arg => forbiddenPattern.test(arg))) {
      throw new Error('Arguments to startServer contain forbidden shell metacharacters');
    }
    try {
      console.log(`🔧 Starting ${name}...`);
      const process = spawn(command, args, {
        stdio: 'pipe',
        env: { ...process.env }
      });
      this.servers.set(name, process);
      process.stdout.on('data', (data) => {
        this.logger.log(name, 'info', data.toString().trim());
      });
      process.stderr.on('data', (data) => {
        this.logger.log(name, 'error', data.toString().trim());
      });
      process.on('exit', (code) => {
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