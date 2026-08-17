describe('Admin Core Operations Flow (Products & Orders)', () => {
  beforeEach(() => {
    cy.loginAsAdmin();
  });

  describe('Products Module', () => {
    beforeEach(() => {
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

      // Interceptamos sucursales
      cy.intercept('GET', '**/rest/v1/branches*', {
        statusCode: 200,
        body: [
          { id: 'branch-1', name: 'Central' }
        ]
      }).as('getBranches');

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

    it('Debería crear un producto exitosamente', () => {
      // Interceptamos el POST
      cy.intercept('POST', '**/rest/v1/products*', {
        statusCode: 201,
        body: { id: 'new-prod-id', name: 'Nuevo Producto Test' }
      }).as('createProduct');

      cy.visit('/admin/products/new');
      cy.wait(['@getCategories', '@getBrands', '@getBranches']);

      // Wait for Angular to hydrate completely before typing
      cy.wait(500);
      cy.get('input[name="name"]').as('nameInput');
      cy.get('@nameInput').should('be.visible').invoke('val', 'Nuevo Producto Test').trigger('input');
      cy.get('@nameInput').should('have.value', 'Nuevo Producto Test');

      cy.get('input[name="price"]').as('priceInput');
      cy.get('@priceInput').should('be.visible').invoke('val', '5000').trigger('input');
      cy.get('@priceInput').should('have.value', '5000');

      cy.get('input[name="stock"]').as('stockInput');
      cy.get('@stockInput').should('be.visible').invoke('val', '5').trigger('input');
      cy.get('@stockInput').should('have.value', '5');
      
      // Suponemos que hay un botón Guardar
      cy.contains('Guardar').click();

      cy.wait('@createProduct').then((interception) => {
        expect(interception.request.body.name).to.equal('Nuevo Producto Test');
        expect(interception.request.body.price).to.equal(5000);
        expect(interception.request.body.stock).to.equal(5);
      });
    });
  });

  describe('Orders Module', () => {
    beforeEach(() => {
      // Interceptamos la llamada GET a la tabla orders
      cy.intercept('GET', '**/rest/v1/orders*', {
        statusCode: 200,
        body: [
          {
            id: 'mock-order-1',
            order_number: 'ORD-12345',
            customer_name: 'Carlos Ruiz',
            customer_email: 'carlos@ruiz.com',
            status: 'pending_payment',
            total: 60000,
            payment_method: 'credit_card',
            created_at: new Date().toISOString(),
            tenant_id: 'bba26ccd-59ce-471c-aac0-4c1f5513de3b'
          },
          {
            id: 'mock-order-2',
            order_number: 'ORD-67890',
            customer_name: 'Ana Lopez',
            customer_email: 'ana@lopez.com',
            status: 'paid',
            total: 12000,
            payment_method: 'cash',
            created_at: new Date().toISOString(),
            tenant_id: 'bba26ccd-59ce-471c-aac0-4c1f5513de3b'
          }
        ]
      }).as('getOrders');

      cy.visit('/admin/orders');
    });

    it('Debería cargar la lista de órdenes/ventas correctamente', () => {
      cy.wait('@getOrders');
      
      // Verificamos que las órdenes mockeadas se muestren en la tabla
      cy.contains('Carlos Ruiz').should('exist');
      cy.contains('ORD-12345').should('exist');
      
      cy.contains('Ana Lopez').should('exist');
      cy.contains('ORD-67890').should('exist');
    });
  });
});
