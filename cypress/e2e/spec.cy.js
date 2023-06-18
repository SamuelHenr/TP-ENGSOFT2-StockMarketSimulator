describe('Verificar opções do select "side"', () => {
  beforeEach(() => {
    cy.visit('localhost:3000');
  });

  it('Deve conter as opções "BUY" e "SELL"', () => {
    cy.get('#side').should('exist');
    cy.get('#side').should('have.prop', 'tagName', 'SELECT');

    cy.get('#side').find('option').should('have.length', 2);

    cy.get('#side').should('contain', 'Buy');
    cy.get('#side').should('contain', 'Sell');
  });
});