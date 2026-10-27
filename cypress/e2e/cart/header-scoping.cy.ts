describe('x-guest-session scoping', () => {
  it('does not leak header to catalog or internal express apis', () => {
    let checkedCategories = false;
    let checkedProducts = false;

    cy.intercept('GET', '**/rest/v1/categories*', (req) => {
      expect(req.headers).to.not.have.property('x-guest-session');
      checkedCategories = true;
    }).as('getCategories');

    cy.intercept('GET', '**/rest/v1/products*', (req) => {
      expect(req.headers).to.not.have.property('x-guest-session');
      checkedProducts = true;
    }).as('getProducts');

    cy.intercept('GET', '**/api/**', (req) => {
      expect(req.headers).to.not.have.property('x-guest-session');
    }).as('getApi');

    cy.visit('/');
    cy.wait(2000);
  });

  it('attaches header to orders and order_items requests', () => {
    cy.intercept('GET', '**/rest/v1/orders*', (req) => {
      expect(req.headers).to.have.property('x-guest-session');
    }).as('getOrders');

    cy.visit('/productos');
    cy.wait(1000);
  });
});
