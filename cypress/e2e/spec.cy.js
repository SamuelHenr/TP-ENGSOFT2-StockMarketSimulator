function getTable(n) {
  return cy.get('.orders-table').eq(n).find('tbody').find('tr');
}

describe('Testes de sistema', () => {
  beforeEach(() => {
    cy.visit('localhost:3000');
  });

  it(' "select #side" Deve conter as opções "Buy" e "Sell"', () => {
    cy.get('#side').should('exist');
    cy.get('#side').should('have.prop', 'tagName', 'SELECT');

    cy.get('#side').find('option').should('have.length', 2);

    cy.get('#side').should('contain', 'Buy');
    cy.get('#side').should('contain', 'Sell');
  });

  it('Compra gera uma nova linha na tabela de compras', () => {
    const price = '10'; // Valor para o campo "price"
    const quantity = '20'; // Valor para o campo "quantity"

    cy.get('input[name="price"]').type(price); // Insere o valor no campo "price"
    cy.get('input[name="quantity"]').type(quantity); // Insere o valor no campo "quantity"
    cy.get('#side').select('Buy'); // Seleciona a opção "BUY" no select com id "side"
    cy.get('form').submit(); // Envia o formulário 

    getTable(0).should('have.length', 1);
  });

  it('Venda gera uma nova linha na tabela de vendas', () => {
    const price = '10'; // Valor para o campo "price"
    const quantity = '20'; // Valor para o campo "quantity"

    cy.get('input[name="price"]').type(price); // Insere o valor no campo "price"
    cy.get('input[name="quantity"]').type(quantity); // Insere o valor no campo "quantity"
    cy.get('#side').select('Sell'); // Seleciona a opção "BUY" no select com id "side"
    cy.get('form').submit(); // Envia o formulário 

    getTable(1).should('have.length', 1);
  });


  it('Compras e vendas de mesmo valor e quantidade se anulam', () => {
    const price = '10'; // Valor para o campo "price"
    const quantity = '20'; // Valor para o campo "quantity"

    cy.get('input[name="price"]').type(price); // Insere o valor no campo "price"
    cy.get('input[name="quantity"]').type(quantity); // Insere o valor no campo "quantity"
    cy.get('#side').select('Buy'); // Seleciona a opção "BUY" no select com id "side"
    cy.get('form').submit(); // Envia o formulário  

    cy.get('input[name="price"]').clear().type(price); // Insere o valor no campo "price"
    cy.get('input[name="quantity"]').clear().type(quantity); // Insere o valor no campo "quantity"
    cy.get('#side').select('Sell'); // Seleciona a opção "BUY" no select com id "side"
    cy.get('form').submit(); // Envia o formulário

    getTable(0).should('have.length', 0);
    getTable(1).should('have.length', 0);
    getTable(2).should('have.length', 2);
  });

});