describe('Admin Products Flow', () => {
  beforeEach(() => {
    cy.loginAsAdmin();

    // Interceptamos la llamada GET a la tabla products
    cy.intercept('GET', '**/rest/v1/products*', {
      statusCode: 200,
      body: [
        {
          id: 'mock-prod-1',
          name: 'Pantalla iPhone 13 Original',
          sku: 'PANT-IPH13-ORG',
          price: 45000,
          currency: 'ARS',
          stock: 10,
          is_active: true,
          category_id: 'cat-1',
          tenant_id: 'bba26ccd-59ce-471c-aac0-4c1f5513de3b',
          created_at: new Date().toISOString()
        },
        {
          id: 'mock-prod-2',
          name: 'Batería Samsung S22',
          sku: 'BAT-S22',
          price: 15000,
          currency: 'ARS',
          stock: 0,
          is_active: false,
          category_id: 'cat-1',
          tenant_id: 'bba26ccd-59ce-471c-aac0-4c1f5513de3b',
          created_at: new Date().toISOString()
        }
      ]
    }).as('getProducts');

    // Interceptamos categorías para los selectores
    cy.intercept('GET', '**/rest/v1/categories*', {
      statusCode: 200,
      body: [
        { id: 'cat-1', name: 'Repuestos' }
      ]
    }).as('getCategories');

    // Interceptamos marcas para los selectores
    cy.intercept('GET', '**/rest/v1/brands*', {
      statusCode: 200,
      body: [
        { id: 'brand-1', name: 'Apple' }
      ]
    }).as('getBrands');

    cy.visit('/admin/products');
  });

  it('Debería cargar la lista de productos correctamente', () => {
    cy.wait('@getProducts');
    
    // Verificamos que los datos mockeados se muestren en la tabla o en tarjetas
    cy.contains('Pantalla iPhone 13 Original').should('exist');
    cy.contains('PANT-IPH13-ORG').should('exist');
    cy.contains(/45[.,]000/).should('exist'); // El formato puede variar por locale
    
    cy.contains('Batería Samsung S22').should('exist');
  });

  it('Debería permitir navegar a la creación de un nuevo producto', () => {
    cy.get('a[routerLink="/admin/products/new"]').click();
    cy.url().should('include', '/admin/products/new');
    cy.contains('Información General').should('be.visible');
  });

  it('Debería crear un producto exitosamente', () => {
    // Interceptamos el POST
    cy.intercept('POST', '**/rest/v1/products*', {
      statusCode: 201,
      body: { id: 'new-prod-id', name: 'Nuevo Producto Test' }
    }).as('createProduct');

    cy.visit('/admin/products/new');
    cy.wait('@getCategories');

    // Completamos el formulario básico
    cy.get('input[name="name"]').type('Nuevo Producto Test', { delay: 50 });
    cy.get('input[name="price"]').type('5000', { delay: 50 });
    cy.get('input[name="stock"]').clear().type('5', { delay: 50 });
    
    // Suponemos que hay un botón Guardar
    cy.contains('Guardar').click();

    cy.wait('@createProduct').then((interception) => {
      expect(interception.request.body.name).to.equal('Nuevo Producto Test');
      expect(interception.request.body.price).to.equal(5000);
      expect(interception.request.body.stock).to.equal(5);
    });
  });
});
