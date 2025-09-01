describe('Ascended Social Basic Test', () => {
  it('should load the homepage', () => {
    cy.visit('http://localhost:5000')
    cy.contains('Ascended Social')
  })

  it('should have spiritual elements visible', () => {
    cy.visit('http://localhost:5000')
    cy.get('[data-testid="chakra-filter"]').should('be.visible')
    cy.get('[data-testid="energy-display"]').should('be.visible')
  })
})