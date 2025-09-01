const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:6006', // Storybook URL
    supportFile: '.storybook/cypress/support/e2e.js',
    specPattern: '.storybook/cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    viewportWidth: 1280,
    viewportHeight: 720,
    video: true,
    screenshotOnRunFailure: true,
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
  component: {
    devServer: {
      framework: 'react',
      bundler: 'vite',
    },
    specPattern: 'client/src/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: '.storybook/cypress/support/component.js',
  },
});