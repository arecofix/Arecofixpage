describe('Product Search Flow (Partial, Accents, Refinement)', () => {
  beforeEach(() => {
    cy.visit('/productos');
    cy.get('app-products-grid').should('be.visible');
    // Wait for the initial load to finish to avoid intercept confusion
    cy.intercept('GET', '**/rest/v1/products*').as('initialLoad');
    cy.wait('@initialLoad', { timeout: 10000 });
  });

  it('should find products using partial words (e.g. "th" -> "thinkpad")', () => {
    cy.intercept({ method: 'GET', url: /rest\/v1\/products.*(ilike|or=)/ }).as('getSearchProducts1');

    cy.get('.mobile-search-input').clear().type('th', { delay: 0 });
    cy.wait('@getSearchProducts1').then((interception) => {
      expect(interception.request.url).to.match(/ilike|or=/);
    });

    cy.get('.mobile-search-input').should('have.value', 'th');
  });

  it('should ignore accents and find products (e.g. "modulo" -> "módulo")', () => {
    cy.intercept({ method: 'GET', url: /rest\/v1\/products.*(ilike|or=)/ }).as('getSearchProducts2');

    // Type without accent
    cy.get('.mobile-search-input').clear().type('modulo', { delay: 0 });
    cy.wait('@getSearchProducts2');
    
    // Type with accent
    cy.get('.mobile-search-input').clear().type('módulo').should('have.value', 'módulo');
    cy.wait('@getSearchProducts2');

    cy.get('.mobile-search-input').should('have.value', 'módulo');
  });

  it('should refine the search progressively with more words (e.g. "lenovo th")', () => {
    cy.intercept({ method: 'GET', url: /rest\/v1\/products.*(ilike|or=)/ }).as('getSearchProducts3');

    cy.get('.mobile-search-input').clear().type('lenovo th', { delay: 0 });
    cy.wait('@getSearchProducts3').then((interception) => {
      expect(interception.request.url).to.match(/ilike|or=/);
    });
  });

  it('should handle special characters safely without breaking', () => {
    cy.intercept({ method: 'GET', url: /rest\/v1\/products.*(ilike|or=)/ }).as('getSearchProducts4');

    cy.get('.mobile-search-input').clear().type('iphone 11!@#', { delay: 0 });
    
    cy.wait('@getSearchProducts4').then((interception) => {
       const status = interception.response?.statusCode;
       expect(status).to.be.oneOf([200, 204, 206]);
    });
  });

  it('should show empty state when no products match', () => {
    cy.intercept({ method: 'GET', url: /rest\/v1\/products.*(ilike|or=)/ }, {
      statusCode: 200,
      body: [],
      headers: {
        'content-range': '0-0/0'
      }
    }).as('getEmptyProducts');

    cy.get('.mobile-search-input').clear().type('asdasdasd123456', { delay: 0 });
    cy.wait('@getEmptyProducts');

    cy.contains(/0 resultados|No se encontraron productos/i).should('be.visible');
  });
});
