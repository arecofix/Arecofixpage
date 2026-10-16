describe('Product Description Forensic Audit E2E', () => {
  const mockTenantId = 'de967f68-7b15-44c0-bc98-952ccf06e1e5';

  beforeEach(() => {
    // Intercept standard auxiliary API calls
    cy.intercept('GET', '**/rest/v1/product_reviews*', { statusCode: 200, body: [] });
    cy.intercept('GET', '**/rest/v1/categories*', {
      statusCode: 200,
      body: [{ id: 'cat-1', name: 'Repuestos', slug: 'repuestos' }]
    });
    cy.intercept('GET', 'https://dolarapi.com/v1/dolares/cripto', {
      statusCode: 200,
      body: { venta: 1250 }
    });
  });

  it('debería solicitar el campo description en la query de Supabase y renderizarlo en el DOM público', () => {
    const testSlug = 'modulo-samsung-a36-oled-original-5tkowy';
    const expectedDescription = 'Modulo para samsung a36. Calidad: OLED Original con garantía certificada Arecofix.';

    // Intercept the product detail request
    cy.intercept('GET', '**/rest/v1/products*', (req) => {
      if (req.url.includes(testSlug)) {
        // ASSERT: PostgREST select query MUST contain 'description' (Bug Root Cause Check)
        expect(req.url).to.include('description');
        expect(req.url).to.include('specifications');
        expect(req.url).to.include('gallery_urls');

        req.reply({
          statusCode: 200,
          headers: { 'Content-Range': '0-0/1' },
          body: [{
            id: '3de57634-3b65-49be-b7a8-4a01176e82a0',
            name: 'Modulo samsung a36 OLED Original',
            slug: testSlug,
            description: expectedDescription,
            price: 95000,
            currency: 'ARS',
            stock: 10,
            is_active: true,
            is_featured: true,
            sku: 'MOD-A36-OLED',
            meta_title: 'Modulo samsung a36 OLED Original - Arecofix',
            meta_description: expectedDescription,
            specifications: { quality: 'Original' },
            branch_stock: [{ branch_id: mockTenantId, quantity: 10 }]
          }]
        });
      }
    }).as('getProductBySlug');

    // Visit public product detail page
    cy.visit(`/productos/detalle/${testSlug}`);
    cy.wait('@getProductBySlug');

    // ASSERT: Description element exists and contains the expected text
    cy.get('#product-description')
      .should('be.visible')
      .and('contain.text', expectedDescription);

    // ASSERT: Fallback placeholder text is NOT visible
    cy.get('#product-description')
      .should('not.contain.text', 'Sin descripción detallada.');
  });

  it('debería preservar saltos de línea (multiline) en la descripción del producto', () => {
    const testSlug = 'pantalla-iphone-13-pro-multiline';
    const multilineDescription = 'Pantalla Super Retina XDR.\n- 120Hz ProMotion.\n- Vidrio Ceramic Shield.\n- Garantía de 3 meses.';

    cy.intercept('GET', '**/rest/v1/products*', (req) => {
      if (req.url.includes(testSlug)) {
        req.reply({
          statusCode: 200,
          headers: { 'Content-Range': '0-0/1' },
          body: [{
            id: 'uuid-multiline-1',
            name: 'Pantalla iPhone 13 Pro',
            slug: testSlug,
            description: multilineDescription,
            price: 180000,
            currency: 'ARS',
            stock: 3,
            is_active: true
          }]
        });
      }
    }).as('getMultilineProduct');

    cy.visit(`/productos/detalle/${testSlug}`);
    cy.wait('@getMultilineProduct');

    cy.get('#product-description')
      .should('be.visible')
      .and('contain.text', '120Hz ProMotion')
      .and('contain.text', 'Garantía de 3 meses');

    // Verify whitespace-pre-line class is applied
    cy.get('#product-description').should('have.class', 'whitespace-pre-line');
  });

  it('debería mostrar fallback "Sin descripción detallada." con estilo adecuado si el producto no tiene descripción', () => {
    const testSlug = 'producto-sin-descripcion';

    cy.intercept('GET', '**/rest/v1/products*', (req) => {
      if (req.url.includes(testSlug)) {
        req.reply({
          statusCode: 200,
          headers: { 'Content-Range': '0-0/1' },
          body: [{
            id: 'uuid-nodesc-1',
            name: 'Herramienta Básica',
            slug: testSlug,
            description: null,
            price: 5000,
            currency: 'ARS',
            stock: 20,
            is_active: true
          }]
        });
      }
    }).as('getNoDescProduct');

    cy.visit(`/productos/detalle/${testSlug}`);
    cy.wait('@getNoDescProduct');

    cy.get('#product-description')
      .should('be.visible')
      .and('contain.text', 'Sin descripción detallada.');
  });
});
