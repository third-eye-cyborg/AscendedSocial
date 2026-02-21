// Import commands.js using ES2015 syntax:
import './commands';

// Cypress Storybook addon commands
import 'cypress-storybook/cypress';

// Custom commands for spiritual component testing
Cypress.Commands.add('visitStory', (storyId) => {
  cy.visit(`/iframe.html?id=${storyId}&viewMode=story`);
});

Cypress.Commands.add('getByTestId', (testId) => {
  return cy.get(`[data-testid="${testId}"]`);
});

Cypress.Commands.add('checkChakraTheming', (expectedChakra) => {
  cy.get('[data-chakra]').should('have.attr', 'data-chakra', expectedChakra);
});

Cypress.Commands.add('verifyAccessibility', () => {
  cy.injectAxe();
  cy.checkA11y();
});

// Setup for visual regression testing
Cypress.Commands.add('compareSnapshot', (name) => {
  cy.screenshot(name, { capture: 'viewport' });
});