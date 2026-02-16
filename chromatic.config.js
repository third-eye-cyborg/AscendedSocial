module.exports = {
  projectToken: process.env.CHROMATIC_PROJECT_TOKEN,
  
  // Storybook configuration
  buildScriptName: 'build-storybook',
  storybookBuildDir: 'storybook-static',
  
  // Cypress integration
  cypress: {
    configFile: 'cypress.config.js',
    specPattern: 'cypress/component/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: 'cypress/support/component.js'
  },
  
  // Playwright integration
  playwright: {
    configFile: 'playwright.config.js',
    testDir: 'tests/playwright',
    browserType: 'chromium'
  },
  
  // Replit-specific settings
  replit: {
    host: '0.0.0.0',
    port: 3000,
    storybookPort: 6006
  },
  
  // MCP integration
  mcp: {
    enabled: true,
    servers: ['chromatic-storybook', 'chromatic-cypress', 'playwright-chromatic'],
    logging: './logs/chromatic-mcp.log'
  },
  
  // Enhanced options
  exitZeroOnChanges: true,
  diagnostics: true,
  debug: true,
  autoAcceptChanges: false
};