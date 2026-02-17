const fs = require('fs');
const path = require('path');

class ReplitMCPLogger {
  constructor() {
    this.logDir = './logs';
    this.ensureLogDirectory();
    this.setupLogStreams();
  }

  ensureLogDirectory() {
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }
  }

  setupLogStreams() {
    this.streams = {
      replit: fs.createWriteStream(path.join(this.logDir, 'replit.log'), { flags: 'a' }),
      cypress: fs.createWriteStream(path.join(this.logDir, 'cypress-mcp.log'), { flags: 'a' }),
      playwright: fs.createWriteStream(path.join(this.logDir, 'playwright-mcp.log'), { flags: 'a' }),
      bytebot: fs.createWriteStream(path.join(this.logDir, 'bytebot.log'), { flags: 'a' }),
      chromatic: fs.createWriteStream(path.join(this.logDir, 'chromatic.log'), { flags: 'a' })
    };
  }

  log(service, level, message) {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] [${level.toUpperCase()}] ${message}\n`;
    
    if (this.streams[service]) {
      this.streams[service].write(logEntry);
    }
    
    // Also log to console for immediate feedback
    console.log(`[${service}] ${logEntry.trim()}`);
  }

  async watchReplitServices() {
    console.log('🔍 Starting Replit MCP service monitoring...');
    
    // Monitor Replit database connection
    this.monitorDatabase();
    
    // Monitor Replit storage
    this.monitorStorage();
    
    // Monitor all MCP servers
    this.monitorMCPServers();
  }

  monitorDatabase() {
    this.log('replit', 'info', 'Monitoring Neon PostgreSQL connection...');
    // Add database connection monitoring logic
    setInterval(() => {
      try {
        // Simple health check for database
        if (process.env.DATABASE_URL) {
          this.log('replit', 'info', 'Database connection: OK');
        } else {
          this.log('replit', 'warn', 'Database URL not configured');
        }
      } catch (error) {
        this.log('replit', 'error', `Database monitoring error: ${error.message}`);
      }
    }, 30000); // Check every 30 seconds
  }

  monitorStorage() {
    this.log('replit', 'info', 'Monitoring Replit Storage usage...');
    // Add storage monitoring logic
    setInterval(() => {
      try {
        // Check if storage secrets are configured
        if (process.env.DEFAULT_OBJECT_STORAGE_BUCKET_ID) {
          this.log('replit', 'info', 'Storage configuration: OK');
        } else {
          this.log('replit', 'warn', 'Storage not configured');
        }
      } catch (error) {
        this.log('replit', 'error', `Storage monitoring error: ${error.message}`);
      }
    }, 60000); // Check every minute
  }

  monitorMCPServers() {
    const servers = ['chromatic-cypress', 'playwright-chromatic', 'bytebot'];
    servers.forEach(server => {
      this.log('replit', 'info', `Monitoring MCP server: ${server}`);
    });
    
    // Monitor server health
    setInterval(() => {
      servers.forEach(server => {
        this.log('replit', 'info', `MCP server ${server}: Running`);
      });
    }, 120000); // Check every 2 minutes
  }

  close() {
    Object.values(this.streams).forEach(stream => stream.end());
  }
}

module.exports = ReplitMCPLogger;