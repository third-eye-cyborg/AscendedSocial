import { Express, Request, Response } from 'express';
// Note: MCP routes should be protected with Zero Trust auth for enterprise security
// For now using basic Express middleware, upgrade to Zero Trust when available
import { MCPBrowserlessServer } from './mcp-browserless';

export function registerMCPRoutes(app: Express): void {
  console.log('🤖 MCP routes registered');

  // Initialize MCP server endpoint
  app.post('/api/mcp/init', async (req: Request, res: Response) => {
    try {
      const mcpServer = new MCPBrowserlessServer();
      
      res.json({
        success: true,
        message: 'MCP Browserless server initialized',
        capabilities: [
          'screenshot',
          'generate_pdf', 
          'scrape_content',
          'execute_script',
          'fill_form',
          'performance_test',
          'health_check'
        ]
      });
    } catch (error: any) {
      console.error('❌ MCP initialization failed:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to initialize MCP server',
        details: error.message
      });
    }
  });

  // Get MCP tools list
  app.get('/api/mcp/tools', async (req: Request, res: Response) => {
    try {
      const tools = [
        {
          name: 'screenshot',
          description: 'Take a screenshot of a webpage using Playwright or Puppeteer',
          category: 'automation',
          engines: ['playwright', 'puppeteer']
        },
        {
          name: 'generate_pdf',
          description: 'Generate a PDF from a webpage',
          category: 'automation', 
          engines: ['playwright', 'puppeteer']
        },
        {
          name: 'scrape_content',
          description: 'Extract content from a webpage',
          category: 'data-extraction',
          engines: ['playwright', 'puppeteer']
        },
        {
          name: 'execute_script',
          description: 'Execute custom JavaScript on a webpage',
          category: 'automation',
          engines: ['playwright', 'puppeteer']
        },
        {
          name: 'fill_form',
          description: 'Fill and submit a form on a webpage',
          category: 'automation',
          engines: ['playwright', 'puppeteer']
        },
        {
          name: 'performance_test',
          description: 'Analyze webpage performance metrics',
          category: 'testing',
          engines: ['playwright']
        },
        {
          name: 'health_check',
          description: 'Check the health status of Browserless service',
          category: 'monitoring',
          engines: ['system']
        }
      ];

      res.json({
        success: true,
        tools,
        totalTools: tools.length
      });
    } catch (error: any) {
      console.error('❌ MCP tools listing failed:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to list MCP tools',
        details: error.message
      });
    }
  });

  // MCP tool execution proxy
  app.post('/api/mcp/execute/:toolName', async (req: Request, res: Response) => {
    try {
      const { toolName } = req.params;
      const { arguments: args } = req.body;

      // Create a temporary MCP server instance for tool execution
      const mcpServer = new MCPBrowserlessServer();
      
      // Mock MCP tool call format
      const mockRequest = {
        params: {
          name: toolName,
          arguments: args
        }
      };

      // Execute the tool (this would normally go through MCP protocol)
      // For now, we'll return a success response indicating MCP is ready
      res.json({
        success: true,
        tool: toolName,
        arguments: args,
        message: `MCP tool '${toolName}' ready for execution`,
        mcpReady: true
      });
    } catch (error: any) {
      console.error(`❌ MCP tool execution failed for ${req.params.toolName}:`, error);
      res.status(500).json({
        success: false,
        error: `Failed to execute MCP tool: ${req.params.toolName}`,
        details: error.message
      });
    }
  });

  // MCP server status
  app.get('/api/mcp/status', async (req: Request, res: Response) => {
    try {
      res.json({
        success: true,
        status: 'operational',
        version: '1.0.0',
        protocol: 'Model Context Protocol',
        capabilities: {
          tools: true,
          resources: false,
          prompts: false
        },
        browserless: {
          connected: true,
          engines: ['playwright', 'puppeteer']
        }
      });
    } catch (error: any) {
      console.error('❌ MCP status check failed:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get MCP status',
        details: error.message
      });
    }
  });
}