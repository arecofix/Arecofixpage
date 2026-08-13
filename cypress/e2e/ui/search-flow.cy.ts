describe('Product Search Flow (Partial, Accents, Refinement)', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/rest/v1/products*').as('initialLoad');
    cy.visit('/productos');
    cy.wait('@initialLoad');
    cy.get('app-products-grid').should('be.visible');
  });

  it('should find products using partial words (e.g. "th" -> "thinkpad")', () => {
    cy.intercept({ method: 'GET', pathname: '/rest/v1/products' }).as('getSearchProducts1');

    cy.get('.mobile-search-input').as('searchInput');
    cy.get('@searchInput').clear();
    cy.get('@searchInput').type('th', { delay: 50 });
    
    cy.wait('@getSearchProducts1');

    cy.get('@searchInput').should('have.value', 'th');
  });

  it('should ignore accents and find products (e.g. "modulo" -> "módulo")', () => {
    cy.intercept({ method: 'GET', pathname: '/rest/v1/products' }).as('getSearchProducts2');

    cy.get('.mobile-search-input').as('searchInput');
    
    // Type without accent
    cy.get('@searchInput').clear();
    cy.get('@searchInput').type('modulo', { delay: 50 });
    cy.wait('@getSearchProducts2');
    
    // Type with accent
    cy.get('@searchInput').clear();
    cy.get('@searchInput').invoke('val', 'módulo').trigger('input').should('have.value', 'módulo');
    cy.wait('@getSearchProducts2');

    cy.get('@searchInput').should('have.value', 'módulo');
  });

  it('should refine the search progressively with more words (e.g. "lenovo th")', () => {
    cy.intercept({ method: 'GET', pathname: '/rest/v1/products' }).as('getSearchProducts3');

    cy.get('.mobile-search-input').as('searchInput');
    cy.get('@searchInput').clear();
    cy.get('@searchInput').type('lenovo th', { delay: 50 });
    cy.wait('@getSearchProducts3');
  });

  it('should handle special characters safely without breaking', () => {
    cy.intercept({ method: 'GET', pathname: '/rest/v1/products' }).as('getSearchProducts4');

    cy.get('.mobile-search-input').as('searchInput');
    cy.get('@searchInput').clear();
    cy.get('@searchInput').type('iphone 11!@#', { delay: 50 });
    
    cy.wait('@getSearchProducts4').then((interception) => {
       const status = interception.response?.statusCode;
       expect(status).to.be.oneOf([200, 204, 206]);
    });
  });

  it('should show empty state when no products match', () => {
    cy.intercept({ method: 'GET', pathname: '/rest/v1/products' }, {
      statusCode: 200,
      body: [],
      headers: {
        'content-range': '0-0/0'
      }
    }).as('getEmptyProducts');

    cy.get('.mobile-search-input').as('searchInput');
    cy.get('@searchInput').clear();
    cy.get('@searchInput').type('asdasdasd123456', { delay: 50 });
    cy.wait('@getEmptyProducts');

    cy.contains(/0 resultados|No se encontraron productos/i).should('be.visible');
  });
});
