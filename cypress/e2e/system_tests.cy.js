function getTable(n) {
  return cy.get('.orders-table').eq(n).find('tbody').find('tr');
}

describe('Testes de sistema', () => {
  beforeEach(() => {
    cy.visit('localhost:3000');
  });

  it('Valores da criação de uma nova ordem de compra são corretos', () => {
    const price = '10'; 
    const quantity = '20'; 

    cy.get('input[name=price]').type(price, { force: true })
    cy.get('input[name=quantity]').type(quantity, { force: true })
    cy.get('#side').select('Buy', { force: true }); 
    cy.get('input[type=submit]').click({ force: true })

    getTable(0).children().eq(1).should('have.text', price)
    getTable(0).children().eq(2).should('have.text', quantity)
  });

  it('Valores da criação de uma nova ordem de venda são corretos', () => {
    const price = '10'; 
    const quantity = '20'; 

    cy.get('input[name=price]').type(price, { force: true })
    cy.get('input[name=quantity]').type(quantity, { force: true })
    cy.get('#side').select('Sell', { force: true }); 
    cy.get('input[type=submit]').click({ force: true })

    getTable(1).children().eq(1).should('have.text', price)
    getTable(1).children().eq(2).should('have.text', quantity)
  });

  it('Compras e vendas de mesmo valor e quantidade se anulam', () => {
    const price = '10'; 
    const quantity = '20'; 

    cy.get('input[name="price"]').type(price, { force: true }); 
    cy.get('input[name="quantity"]').type(quantity, { force: true }); 
    cy.get('#side').select('Buy', { force: true }); 
    cy.get('input[type=submit]').click({ force: true }); 

    cy.get('input[name="price"]').clear({ force: true }).type(price, { force: true }); 
    cy.get('input[name="quantity"]').clear({ force: true }).type(quantity, { force: true }); 
    cy.get('#side').select('Sell', { force: true }); 
    cy.get('input[type=submit]').click({ force: true }); 

    getTable(0).should('have.length', 0);
    getTable(1).should('have.length', 0);
    getTable(2).should('have.length', 2);
  });

  it('Vendas mais baratas são consumidas', () => {
    const priceSell = '10'
    const quantitySell = '10'
    const priceBuy = '20';
    const quantityBuy = '20'

    cy.get('input[name=price]').type(priceSell, { force: true })
    cy.get('input[name=quantity]').type(quantitySell, { force: true })
    cy.get('#side').select('Sell', { force: true })
    cy.get('input[type=submit]').click({ force: true })

    cy.get('input[name=price]').clear({ force: true }).type(priceBuy, { force: true })
    cy.get('input[name=quantity]').clear({ force: true }).type(quantityBuy, { force: true })
    cy.get('#side').select('Buy', { force: true })
    cy.get('input[type=submit]').click({ force: true })

    getTable(0).children().eq(3).should('have.text', quantityBuy - quantitySell)
    getTable(2).children().eq(3).should('have.text', '0')
  });

  it('Vendas mais caras não são consumidas', () => {
    const priceSell = '21'
    const quantitySell = '100'
    const priceBuy = '20';
    const quantityBuy = '20'

    cy.get('input[name=price]').type(priceSell, { force: true })
    cy.get('input[name=quantity]').type(quantitySell, { force: true })
    cy.get('#side').select('Sell', { force: true })
    cy.get('input[type=submit]').click({ force: true })

    cy.get('input[name=price]').clear({ force: true }).type(priceBuy, { force: true })
    cy.get('input[name=quantity]').clear({ force: true }).type(quantityBuy, { force: true })
    cy.get('#side').select('Buy', { force: true })
    cy.get('input[type=submit]').click({ force: true })

    getTable(0).children().eq(3).should('have.text', quantityBuy)
    getTable(1).children().eq(3).should('have.text', quantitySell)
  });
});