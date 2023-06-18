describe('template spec', () => {
  beforeEach(() => {
    cy.visit('localhost:3000');
  });

  it('Testa a criação de uma nova ordem', () => {
    // Insert input values
    cy.get('input[name=price]').type("100", {force: true})
    cy.get('input[name=quantity]').type("10", {force: true})

    // Click submit button
    cy.get('input[type=submit]').click({force: true})

    // Check created Order
    cy.get('table').first().get('tbody tr').children().eq(1).should('have.text', '100')
    cy.get('table').first().get('tbody tr').children().eq(2).should('have.text', '10')
  });
})
