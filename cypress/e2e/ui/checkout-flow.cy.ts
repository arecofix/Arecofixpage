describe('Checkout Flow (End-to-End)', () => {
  beforeEach(() => {
    // Intercept Supabase API calls to avoid polluting the DB during tests
    cy.intercept('GET', '**/rest/v1/products*', {
      statusCode: 200,
      body: [
        {
          id: 'test-usd-product',
          name: 'iPhone 15 Pro (Test)',
          price: 1000,
          currency: 'USD',
          stock: 10,
          is_active: true,
          slug: 'iphone-15-pro-test',
          image_url: 'https://via.placeholder.com/150'
        },
        {
          id: 'test-ars-product',
          name: 'Funda (Test)',
          price: 5000,
          currency: 'ARS',
          stock: 50,
          is_active: true,
          slug: 'funda-test',
          image_url: 'https://via.placeholder.com/150'
        }
      ]
    }).as('getProducts');

    cy.intercept('GET', 'https://dolarapi.com/v1/dolares/cripto', {
      statusCode: 200,
      body: { compra: 1000 } // Mock USD rate to 1000 ARS
    }).as('getUsdRate');

    // Mock active cart fetch (initially empty or not existing)
    cy.intercept('GET', '**/rest/v1/orders?select=*status=eq.cart*', {
      statusCode: 200,
      body: []
    }).as('getCart');

    // Mock order creation (for the cart and checkout)
    cy.intercept('POST', '**/rest/v1/orders*', (req) => {
      req.reply({
        statusCode: 201,
        body: [{
          id: 'order-1234',
          order_number: 'AF-TEST-1234',
          ...req.body
        }]
      });
    }).as('createOrder');

    cy.intercept('POST', '**/rest/v1/order_items*', {
      statusCode: 201,
      body: []
    }).as('createOrderItems');

    // Mock MercadoPago Edge Function
    cy.intercept('POST', '**/functions/v1/mercadopago-preferences', {
      statusCode: 200,
      body: { init_point: 'https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id=test_123' }
    }).as('mercadopagoWebhook');

    // Go to products page
    cy.visit('/productos');
    cy.wait(['@getProducts', '@getUsdRate']);
  });

  it('debería calcular el carrito y el checkout con la conversión de USD a ARS', () => {
    // 1. Verificar que el precio se muestre convertido en la lista de productos
    // El iPhone (1000 USD) debe mostrarse como $1.000.000 ARS
    cy.contains('iPhone 15 Pro (Test)')
      .parents('.card') // Ajustar según el selector real
      .should('contain', '1,000,000') // Verifica formato de precio
      .contains('Añadir') // Botón de agregar
      .click();

    // 2. Verificar que se abra el carrito y el subtotal sea 1.000.000 ARS
    cy.get('.drawer-side').should('be.visible');
    cy.contains('1,000,000'); // Verifica subtotal en el carrito

    // 3. Ir al checkout
    cy.contains('Finalizar Compra').click();
    cy.url().should('include', '/checkout');

    // 4. Llenar formulario de checkout (Guest User)
    cy.get('input[formControlName="name"]').type('Cypress Tester');
    cy.get('input[formControlName="email"]').type('cypress@test.com');
    cy.get('input[formControlName="phone"]').type('1122334455');
    cy.get('input[formControlName="street"]').type('Av. Falsa');
    cy.get('input[formControlName="number"]').type('123');
    cy.get('input[formControlName="postal_code"]').type('1234');
    
    // El total debe ser $1,000,000
    cy.contains('1,000,000');

    // 5. Ir a método de pago
    cy.contains('Continuar').click();

    // 6. Seleccionar Mercado Pago
    cy.contains('Mercado Pago').click();
    cy.contains('Pagar').click();

    // 7. Validar creación de orden y redirección
    cy.wait('@createOrder').then((interception) => {
      const order = interception.request.body;
      expect(order.total).to.eq(1000000);
      expect(order.subtotal).to.eq(1000000);
    });

    cy.wait('@mercadopagoWebhook').then((interception) => {
      const mpBody = interception.request.body;
      expect(mpBody.items[0].unit_price).to.eq(1000000); // 1,000,000 ARS
      expect(mpBody.items[0].subtotal).to.eq(1000000);
    });
  });

  it('debería calcular correctamente al seleccionar Efectivo', () => {
    // Add product to cart
    cy.contains('iPhone 15 Pro (Test)').parents('.card').contains('Añadir').click();
    cy.contains('Finalizar Compra').click();

    // Fill form
    cy.get('input[formControlName="name"]').type('Cypress Tester');
    cy.get('input[formControlName="email"]').type('cypress@test.com');
    cy.get('input[formControlName="phone"]').type('1122334455');
    cy.get('input[formControlName="street"]').type('Av. Falsa');
    cy.get('input[formControlName="number"]').type('123');
    cy.get('input[formControlName="postal_code"]').type('1234');
    
    cy.contains('Continuar').click();

    // Select Efectivo
    cy.contains('Efectivo').click();
    cy.contains('Pagar').click();

    // Verify ticket creation
    cy.contains('AF-TEST-1234');
    cy.contains('1,000,000');
  });
});
