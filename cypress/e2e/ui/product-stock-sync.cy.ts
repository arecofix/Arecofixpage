describe('Product Stock Sync (Global vs Branch)', () => {
  const uniqueId = Date.now();
  const globalProductId = 'global-test-prod-' + uniqueId;
  const globalSlug = 'test-global-product-' + uniqueId;
  
  beforeEach(() => {
    // Intercept API calls to mock data instead of using actual backend since this is UI logic validation
    cy.intercept('GET', '**/rest/v1/products*', (req) => {
      if (req.url.includes(globalProductId) || req.url.includes(globalSlug)) {
        req.reply({
          statusCode: 200,
          body: [
            {
              id: globalProductId,
              name: 'Test Global Product without Branch',
              slug: globalSlug,
              price: 1500,
              stock: 25, // Fallback legacy stock
              is_global: false, // The buggy condition (not global)
              branch_id: null,  // The buggy condition (no specific branch)
              is_active: true,
              branch_stock: []  // Empty branch stock table
            }
          ]
        });
      }
    }).as('getProducts');

    cy.visit(`/productos/${globalSlug}`);
  });

  it('should display the legacy stock when branch_id is null and branch_stock is empty', () => {
    cy.wait('@getProducts');
    // Ensure product loads and check stock UI
    cy.get('h1').contains('Test Global Product without Branch', { timeout: 10000 }).should('be.visible');
    
    // According to our mapper fix, it should fallback to p.stock = 25
    cy.get('body').then($body => {
      // The UI usually says "X disponibles" or allows adding up to X
      // Let's test the "add to cart" functionality availability which relies on isInStock
      const isOutOfStock = $body.find('.badge-error:contains("Agotado")').length > 0;
      expect(isOutOfStock).to.be.false;
      
      // Stock should be rendered somewhere or the button should be enabled
      cy.get('button').contains(/Agregar al carrito/i).should('not.be.disabled');
    });
  });
});
