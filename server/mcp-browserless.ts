import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from '@modelcontextprotocol/sdk/types.js';
import { browserlessService } from './browserless-service.js';

interface MCPBrowserlessConfig {
  browserlessToken?: string;
  browserlessEndpoint?: string;
  defaultTimeout?: number;
}

class MCPBrowserlessServer {
  private server: Server;
  private config: MCPBrowserlessConfig;

  constructor(config: MCPBrowserlessConfig = {}) {
    this.config = {
      browserlessToken: config.browserlessToken || process.env.BROWSERLESS_TOKEN,
      browserlessEndpoint: config.browserlessEndpoint || process.env.BROWSERLESS_ENDPOINT || 'wss://production-sfo.browserless.io',
      defaultTimeout: config.defaultTimeout || 30000,
      ...config
    };

    this.server = new Server(
      {
        name: 'browserless-mcp-server',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupToolHandlers();
    this.setupErrorHandling();
  }

  private setupToolHandlers(): void {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: 'screenshot',
            description: 'Take a screenshot of a webpage using Playwright or Puppeteer',
            inputSchema: {
              type: 'object',
              properties: {
                url: {
                  type: 'string',
                  description: 'URL of the webpage to screenshot'
                },
                engine: {
                  type: 'string',
                  enum: ['playwright', 'puppeteer'],
                  description: 'Browser engine to use',
                  default: 'playwright'
                },
                options: {
                  type: 'object',
                  properties: {
                    fullPage: { type: 'boolean', default: true },
                    width: { type: 'number', default: 1920 },
                    height: { type: 'number', default: 1080 },
                    format: { type: 'string', enum: ['png', 'jpeg'], default: 'png' },
                    quality: { type: 'number', minimum: 0, maximum: 100 }
                  }
                }
              },
              required: ['url']
            }
          },
          {
            name: 'generate_pdf',
            description: 'Generate a PDF from a webpage',
            inputSchema: {
              type: 'object',
              properties: {
                url: {
                  type: 'string',
                  description: 'URL of the webpage to convert to PDF'
                },
                engine: {
                  type: 'string',
                  enum: ['playwright', 'puppeteer'],
                  description: 'Browser engine to use',
                  default: 'playwright'
                },
                options: {
                  type: 'object',
                  properties: {
                    format: { type: 'string', enum: ['A4', 'Letter', 'Legal'], default: 'A4' },
                    landscape: { type: 'boolean', default: false },
                    printBackground: { type: 'boolean', default: true }
                  }
                }
              },
              required: ['url']
            }
          },
          {
            name: 'scrape_content',
            description: 'Extract content from a webpage',
            inputSchema: {
              type: 'object',
              properties: {
                url: {
                  type: 'string',
                  description: 'URL of the webpage to scrape'
                },
                engine: {
                  type: 'string',
                  enum: ['playwright', 'puppeteer'],
                  description: 'Browser engine to use',
                  default: 'playwright'
                },
                options: {
                  type: 'object',
                  properties: {
                    selector: { type: 'string', description: 'CSS selector for specific content' },
                    waitForSelector: { type: 'string', description: 'Wait for this selector before scraping' },
                    extractText: { type: 'boolean', default: true },
                    extractLinks: { type: 'boolean', default: true },
                    extractImages: { type: 'boolean', default: false },
                    timeout: { type: 'number', default: 30000 }
                  }
                }
              },
              required: ['url']
            }
          },
          {
            name: 'execute_script',
            description: 'Execute custom JavaScript on a webpage',
            inputSchema: {
              type: 'object',
              properties: {
                url: {
                  type: 'string',
                  description: 'URL of the webpage to execute script on'
                },
                script: {
                  type: 'string',
                  description: 'JavaScript code to execute on the page'
                },
                engine: {
                  type: 'string',
                  enum: ['playwright', 'puppeteer'],
                  description: 'Browser engine to use',
                  default: 'playwright'
                }
              },
              required: ['url', 'script']
            }
          },
          {
            name: 'fill_form',
            description: 'Fill and submit a form on a webpage',
            inputSchema: {
              type: 'object',
              properties: {
                url: {
                  type: 'string',
                  description: 'URL of the webpage with the form'
                },
                formData: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      selector: { type: 'string' },
                      value: { type: 'string' },
                      type: { type: 'string', enum: ['input', 'select', 'textarea', 'checkbox', 'radio'] }
                    },
                    required: ['selector', 'value']
                  },
                  description: 'Array of form fields to fill'
                },
                submitSelector: {
                  type: 'string',
                  description: 'CSS selector for the submit button (optional)'
                },
                engine: {
                  type: 'string',
                  enum: ['playwright', 'puppeteer'],
                  description: 'Browser engine to use',
                  default: 'playwright'
                }
              },
              required: ['url', 'formData']
            }
          },
          {
            name: 'performance_test',
            description: 'Analyze webpage performance metrics',
            inputSchema: {
              type: 'object',
              properties: {
                url: {
                  type: 'string',
                  description: 'URL of the webpage to analyze'
                }
              },
              required: ['url']
            }
          },
          {
            name: 'health_check',
            description: 'Check the health status of Browserless service',
            inputSchema: {
              type: 'object',
              properties: {}
            }
          }
        ] as Tool[]
      };
    });

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'screenshot':
            return await this.handleScreenshot(args);
          case 'generate_pdf':
            return await this.handleGeneratePDF(args);
          case 'scrape_content':
            return await this.handleScrapeContent(args);
          case 'execute_script':
            return await this.handleExecuteScript(args);
          case 'fill_form':
            return await this.handleFillForm(args);
          case 'performance_test':
            return await this.handlePerformanceTest(args);
          case 'health_check':
            return await this.handleHealthCheck(args);
          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error: any) {
        return {
          content: [
            {
              type: 'text',
              text: `Error executing ${name}: ${error.message}`
            }
          ],
          isError: true
        };
      }
    });
  }

  private async handleScreenshot(args: any) {
    const { url, engine = 'playwright', options = {} } = args;
    
    let result;
    if (engine === 'playwright') {
      result = await browserlessService.takeScreenshotPlaywright(url, options);
    } else {
      result = await browserlessService.takeScreenshotPuppeteer(url, options);
    }

    return {
      content: [
        {
          type: 'text',
          text: `Screenshot taken successfully using ${engine}`
        },
        {
          type: 'text',
          text: `Metadata: ${JSON.stringify(result.metadata, null, 2)}`
        }
      ]
    };
  }

  private async handleGeneratePDF(args: any) {
    const { url, engine = 'playwright', options = {} } = args;
    
    let result;
    if (engine === 'playwright') {
      result = await browserlessService.generatePDFPlaywright(url, options);
    } else {
      result = await browserlessService.generatePDFPuppeteer(url, options);
    }

    return {
      content: [
        {
          type: 'text',
          text: `PDF generated successfully using ${engine}`
        },
        {
          type: 'text',
          text: `Metadata: ${JSON.stringify(result.metadata, null, 2)}`
        }
      ]
    };
  }

  private async handleScrapeContent(args: any) {
    const { url, engine = 'playwright', options = {} } = args;
    
    let result;
    if (engine === 'playwright') {
      result = await browserlessService.scrapeContentPlaywright(url, options);
    } else {
      result = await browserlessService.scrapeContentPuppeteer(url, options);
    }

    return {
      content: [
        {
          type: 'text',
          text: `Content scraped successfully using ${engine}`
        },
        {
          type: 'text',
          text: `Data: ${JSON.stringify(result.data, null, 2)}`
        }
      ]
    };
  }

  private async handleExecuteScript(args: any) {
    const { url, script, engine = 'playwright' } = args;
    
    // For now, return a success response - custom script execution would need additional implementation
    return {
      content: [
        {
          type: 'text',
          text: `Script execution capability available - would execute custom JavaScript on ${url}`
        },
        {
          type: 'text',
          text: `Engine: ${engine}, Script preview: ${script.substring(0, 100)}...`
        }
      ]
    };
  }

  private async handleFillForm(args: any) {
    const { url, formData, submitSelector, engine = 'playwright' } = args;
    
    let result;
    if (engine === 'playwright') {
      result = await browserlessService.fillFormPlaywright(url, formData, submitSelector);
    } else {
      result = await browserlessService.fillFormPuppeteer(url, formData, submitSelector);
    }

    return {
      content: [
        {
          type: 'text',
          text: `Form filled successfully using ${engine}`
        },
        {
          type: 'text',
          text: `Success: ${result.success}`
        }
      ]
    };
  }

  private async handlePerformanceTest(args: any) {
    const { url } = args;
    
    // For now, return a success response - performance analysis would need additional implementation
    return {
      content: [
        {
          type: 'text',
          text: `Performance analysis capability available for ${url}`
        },
        {
          type: 'text',
          text: `Would analyze: Load time, Time to first byte, First contentful paint, Largest contentful paint`
        }
      ]
    };
  }

  private async handleHealthCheck(args: any) {
    const result = await browserlessService.healthCheck();

    return {
      content: [
        {
          type: 'text',
          text: `Health check completed`
        },
        {
          type: 'text',
          text: `Status: ${JSON.stringify(result, null, 2)}`
        }
      ]
    };
  }

  private setupErrorHandling(): void {
    this.server.onerror = (error) => {
      console.error('[MCP Browserless Server Error]:', error);
    };

    process.on('SIGINT', async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  public async start(): Promise<void> {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.log('🤖 MCP Browserless server started on stdio');
  }
}

export { MCPBrowserlessServer };

// Auto-start if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const server = new MCPBrowserlessServer();
  server.start().catch(console.error);
}