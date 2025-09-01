// Custom commands for Ascended Social component testing

// Command to test spiritual theme variations
Cypress.Commands.add('testChakraVariants', (componentSelector) => {
  const chakras = ['root', 'sacral', 'solar-plexus', 'heart', 'throat', 'third-eye', 'crown'];
  
  chakras.forEach(chakra => {
    cy.get(`${componentSelector}[data-chakra="${chakra}"]`)
      .should('be.visible')
      .and('have.class', `chakra-${chakra}`);
  });
});

// Command to test energy level interactions
Cypress.Commands.add('testEnergyInteraction', (buttonSelector) => {
  cy.get(buttonSelector)
    .click()
    .should('have.attr', 'data-energy-active', 'true');
});

// Command to test mystical animations
Cypress.Commands.add('testMysticalAnimation', (elementSelector) => {
  cy.get(elementSelector)
    .should('have.class', 'animate-mystical')
    .wait(1000) // Wait for animation
    .should('be.visible');
});

// Command to test responsive spiritual design
Cypress.Commands.add('testSpiritualResponsive', (componentSelector) => {
  // Test mobile view
  cy.viewport(375, 667);
  cy.get(componentSelector).should('be.visible');
  
  // Test tablet view
  cy.viewport(768, 1024);
  cy.get(componentSelector).should('be.visible');
  
  // Test desktop view
  cy.viewport(1280, 720);
  cy.get(componentSelector).should('be.visible');
});

// Command to verify spiritual color scheme
Cypress.Commands.add('verifyMysticalColors', (elementSelector) => {
  cy.get(elementSelector)
    .should('have.css', 'color')
    .and('match', /rgb\(\d+,\s*\d+,\s*\d+\)/);
});