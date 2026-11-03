describe('Product Creation E2E Forensic Audit Specs', () => {
  beforeEach(() => {
    cy.loginAsAdmin('/');

    // Mock lookups for form dropdowns
    cy.intercept('GET', '**/rest/v1/categories*', {
      statusCode: 200,
      body: [{ id: 'cat-1', name: 'Repuestos', is_active: true }]
    }).as('getCategories');

    cy.intercept('GET', '**/rest/v1/brands*', {
      statusCode: 200,
      body: [{ id: 'brand-1', name: 'Apple', is_active: true }]
    }).as('getBrands');

    cy.intercept('GET', '**/rest/v1/branches*', {
      statusCode: 200,
      body: [{ id: 'de967f68-7b15-44c0-bc98-952ccf06e1e5', name: 'Arecofix Central', is_active: true }]
    }).as('getBranches');
  });

  it('debería validar los campos requeridos en el cliente antes de enviar la petición', () => {
    cy.visit('/admin/products/new');
    cy.wait(['@getCategories', '@getBrands', '@getBranches']);

    // Attempt save without filling required fields
    cy.contains('Guardar').click();

    // Verify user is alerted with clear client validation message
    cy.contains('Por favor ingrese el nombre del producto').should('be.visible');
  });

  it('debería enviar un payload limpio sin columnas en español inexistentes que provoquen PGRST204', () => {
    cy.intercept('POST', '**/rest/v1/products*', (req) => {
      // Assert that invalid Spanish columns are NEVER included in the HTTP request payload
      expect(req.body).not.to.have.property('garantia_meses');
      expect(req.body).not.to.have.property('precio_oferta');
      expect(req.body).not.to.have.property('porcentaje_impuesto');
      expect(req.body).not.to.have.property('peso_kg');
      expect(req.body).not.to.have.property('largo_cm');
      expect(req.body).not.to.have.property('ancho_cm');
      expect(req.body).not.to.have.property('alto_cm');
      expect(req.body).not.to.have.property('is_destacado');
      expect(req.body).not.to.have.property('envio_gratis');
      expect(req.body).not.to.have.property('tipo_garantia');
      expect(req.body).not.to.have.property('incluye_iva');
      expect(req.body).not.to.have.property('etiquetas_tags');
      expect(req.body).not.to.have.property('ml_category_id');

      // Assert canonical database columns are present
      expect(req.body).to.have.property('name', 'Batería iPhone 14 Original');
      expect(req.body).to.have.property('price', 45000);
      expect(req.body).to.have.property('stock', 15);
      expect(req.body).to.have.property('description', 'Batería de repuesto ion de litio certificada calidad Arecofix.');
      expect(req.body).to.have.property('slug');
      expect(req.body).to.have.property('specifications');

      req.reply({
        statusCode: 201,
        body: {
          id: 'prod-new-123',
          name: 'Batería iPhone 14 Original',
          slug: 'bateria-iphone-14-original',
          description: 'Batería de repuesto ion de litio certificada calidad Arecofix.',
          price: 45000,
          stock: 15
        }
      });
    }).as('createProduct');

    cy.intercept('GET', '**/rest/v1/products*', {
      statusCode: 200,
      headers: { 'Content-Range': '0-0/1' },
      body: [{ id: 'prod-new-123', name: 'Batería iPhone 14 Original', price: 45000, stock: 15 }]
    }).as('getProductsList');

    cy.visit('/admin/products/new');
    cy.wait(['@getCategories', '@getBrands', '@getBranches']);

    // Fill form
    cy.get('input[name="name"]').type('Batería iPhone 14 Original');
    cy.get('input[name="price"]').clear().type('45000');
    cy.get('input[name="stock"]').clear().type('15');
    cy.get('textarea[name="description"]').type('Batería de repuesto ion de litio certificada calidad Arecofix.');
    cy.get('input[name="sku"]').type('BAT-IPH14-ORG');

    cy.contains('Guardar').click();

    cy.wait('@createProduct');
    cy.url().should('include', '/admin/products');
  });

  it('debería mostrar mensaje de error descriptivo ante fallo de esquema en el backend', () => {
    cy.intercept('POST', '**/rest/v1/products*', {
      statusCode: 400,
      body: {
        code: 'PGRST204',
        message: "Column 'garantia_meses' of relation 'products' does not exist"
      }
    }).as('createProductSchemaError');

    cy.visit('/admin/products/new');
    cy.wait(['@getCategories', '@getBrands', '@getBranches']);

    cy.get('input[name="name"]').type('Producto Con Error de Esquema');
    cy.get('input[name="price"]').clear().type('1000');

    cy.contains('Guardar').click();

    cy.wait('@createProductSchemaError');

    // Verify error handler exposes schema error instead of masking as generic message
    cy.contains('Error de esquema en la base de datos').should('be.visible');
  });

  it('debería consultar y renderizar la descripción completa en la página pública del producto', () => {
    const slug = 'modulo-samsung-a36-oled-original-5tkowy';
    const testDescription = 'Módulo para samsung a36. Calidad: OLED Original con garantía certificada.';

    cy.intercept('GET', '**/rest/v1/products*slug=eq.*', (req) => {
      // Assert that description was included in the PostgREST select query
      expect(req.url).to.include('description');
      
      req.reply({
        statusCode: 200,
        headers: { 'Content-Range': '0-0/1' },
        body: [{
          id: '3de57634-3b65-49be-b7a8-4a01176e82a0',
          name: 'Modulo samsung a36 OLED Original',
          slug: slug,
          description: testDescription,
          price: 95000,
          currency: 'ARS',
          stock: 5,
          is_active: true,
          is_featured: true,
          meta_title: 'Modulo samsung a36 OLED Original - Arecofix',
          meta_description: testDescription
        }]
      });
    }).as('getProductDetail');

    cy.intercept('GET', '**/rest/v1/product_reviews*', { statusCode: 200, body: [] });
    cy.intercept('GET', '**/rest/v1/categories*', { statusCode: 200, body: [] });

    cy.visit(`/productos/detalle/${slug}`);
    cy.wait('@getProductDetail');

    // Assert that the description element is visible in the DOM
    cy.get('#product-description')
      .should('be.visible')
      .and('contain.text', testDescription);

    // Assert that the fallback text is NOT displayed when description exists
    cy.get('#product-description')
      .should('not.contain.text', 'Sin descripción detallada.');
  });

  it('debería mostrar fallback "Sin descripción detallada." cuando el producto no posee descripción', () => {
    const slug = 'repuesto-sin-descripcion';

    cy.intercept('GET', '**/rest/v1/products*slug=eq.*', {
      statusCode: 200,
      headers: { 'Content-Range': '0-0/1' },
      body: [{
        id: 'no-desc-123',
        name: 'Repuesto Básico Sin Descripción',
        slug: slug,
        description: null,
        price: 15000,
        currency: 'ARS',
        stock: 3,
        is_active: true
      }]
    }).as('getProductNoDesc');

    cy.intercept('GET', '**/rest/v1/product_reviews*', { statusCode: 200, body: [] });
    cy.intercept('GET', '**/rest/v1/categories*', { statusCode: 200, body: [] });

    cy.visit(`/productos/detalle/${slug}`);
    cy.wait('@getProductNoDesc');

    cy.get('#product-description')
      .should('be.visible')
      .and('contain.text', 'Sin descripción detallada.');
  });
});
