describe('Ascended Social Spiritual Components', () => {
  beforeEach(() => {
    cy.visit('http://localhost:6006');
  });

  it('should display chakra-themed buttons correctly', () => {
    cy.visitStory('components-button--all-variants');
    
    // Test each chakra variant
    const chakras = ['root', 'sacral', 'solar-plexus', 'heart', 'throat', 'third-eye', 'crown'];
    
    chakras.forEach(chakra => {
      cy.getByTestId(`button-${chakra}`)
        .should('be.visible')
        .and('have.attr', 'data-chakra', chakra)
        .compareSnapshot(`button-${chakra}`);
    });
  });

  it('should handle mystical card interactions', () => {
    cy.visitStory('components-card--spiritual-post');
    
    cy.getByTestId('card-spiritual-post')
      .should('be.visible')
      .testMysticalAnimation()
      .compareSnapshot('card-spiritual-post-initial');
    
    // Test hover effects
    cy.getByTestId('card-spiritual-post')
      .trigger('mouseover')
      .compareSnapshot('card-spiritual-post-hover');
  });

  it('should validate oracle component accessibility', () => {
    cy.visitStory('components-oracle--daily-reading');
    
    cy.verifyAccessibility();
    
    cy.getByTestId('oracle-daily-reading')
      .should('have.attr', 'aria-label')
      .and('be.visible');
    
    cy.getByTestId('button-reveal-reading')
      .should('have.attr', 'aria-describedby')
      .click();
    
    cy.getByTestId('oracle-content')
      .should('be.visible')
      .and('have.attr', 'role', 'main');
  });

  it('should test responsive spiritual design', () => {
    cy.visitStory('components-navigation--main-nav');
    
    cy.getByTestId('navigation-main')
      .testSpiritualResponsive();
    
    // Test mobile navigation
    cy.viewport(375, 667);
    cy.getByTestId('button-mobile-menu')
      .should('be.visible')
      .click();
    
    cy.getByTestId('mobile-nav-drawer')
      .should('be.visible')
      .verifyMysticalColors();
  });

  it('should validate chakra color theming', () => {
    cy.visitStory('components-button--all-variants');
    
    const chakraColors = {
      'root': 'rgb(139, 69, 19)',
      'sacral': 'rgb(255, 140, 0)',
      'solar-plexus': 'rgb(255, 215, 0)',
      'heart': 'rgb(0, 128, 0)',
      'throat': 'rgb(0, 191, 255)',
      'third-eye': 'rgb(75, 0, 130)',
      'crown': 'rgb(148, 0, 211)'
    };
    
    Object.entries(chakraColors).forEach(([chakra, expectedColor]) => {
      cy.getByTestId(`button-${chakra}`)
        .should('have.css', 'background-color')
        .and('contain', expectedColor.replace(/\s/g, ''));
    });
  });

  it('should test energy interaction mechanics', () => {
    cy.visitStory('components-energy-button--interactive');
    
    cy.getByTestId('button-energy-share')
      .testEnergyInteraction()
      .should('have.class', 'energy-active');
    
    cy.getByTestId('energy-meter')
      .should('be.visible')
      .and('have.attr', 'data-energy-level')
      .then(($el) => {
        const energyLevel = parseInt($el.attr('data-energy-level'));
        expect(energyLevel).to.be.greaterThan(0);
      });
  });
});