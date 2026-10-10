describe('Checkout Flow (End-to-End)', () => {
  before(() => {
    // Purgar DB para asegurar un entorno de prueba aislado 
    // en caso de que alguna petición real se filtre o para preparar futuras pruebas E2E sin mocks
    cy.task('seedDatabase').then(() => {
      cy.log('Database seeded successfully for Checkout Flow');
    });
  });

  beforeEach(() => {
    // Intercept Supabase API calls to avoid polluting the DB during tests
    cy.intercept('GET', '**/rest/v1/products*', (req) => {
      req.reply({
        statusCode: 200,
        headers: {
          'Content-Range': '0-1/2',
          'Content-Type': 'application/json'
        },
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
      });
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
      const isCheckout = req.body.status === 'pending_payment';
      req.reply({
        statusCode: 201,
        body: [{
          id: isCheckout ? 'order-checkout-1234' : 'order-1234',
          order_number: 'AF-TEST-1234',
          ...req.body
        }]
      });
    }).as('createOrder');

    cy.intercept('PATCH', '**/rest/v1/orders*', (req) => {
      req.reply({
        statusCode: 200,
        body: [{
          id: 'order-1234',
          ...req.body
        }]
      });
    }).as('updateOrder');

    cy.intercept('POST', '**/rest/v1/order_items*', {
      statusCode: 201,
      body: []
    }).as('createOrderItems');

    cy.intercept('POST', '**/rest/v1/contact_messages*', {
      statusCode: 201,
      body: []
    }).as('contactMessages');

    // Mock MercadoPago Edge Function
    cy.intercept('POST', '**/functions/v1/mercadopago-preferences', {
      statusCode: 200,
      body: { init_point: 'https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id=test_123' }
    }).as('mercadopagoWebhook');

    // Go to products page
    cy.visit('/productos');
    cy.wait('@getProducts');
  });

  it('debería calcular el carrito y el checkout con la conversión de USD a ARS', () => {
    // 1. Verificar que el precio se muestre convertido en la lista de productos
    // El iPhone (1000 USD) debe mostrarse como $1.000.000 ARS
    cy.contains('iPhone 15 Pro (Test)')
      .closest('.group') // Ajustar según el selector real
      .should('contain', '1.000.000') // Verifica formato de precio
      .contains('Añadir') // Botón de agregar
      .click({ force: true });

    // 2. Abrir el carrito y verificar que el subtotal sea 1.000.000 ARS
    cy.get('button[aria-label="Carrito"]').click({ force: true });
    cy.get('[aria-label="Carrito de compras"]').should('be.visible').contains('1.000.000');

    // 3. Ir al checkout
    cy.get('[aria-label="Carrito de compras"]').contains('Finalizar Compra').click({ force: true });
    cy.url().should('include', '/checkout');

    // 4. Llenar formulario de checkout (Guest User)
    cy.wait(1000);
    cy.get('input[name="name"]').clear().invoke('val', 'Cypress Tester').trigger('input');
    cy.get('input[name="email"]').clear().invoke('val', 'cypress@test.com').trigger('input');
    cy.get('input[name="phone"]').clear().invoke('val', '1122334455').trigger('input');
    cy.get('input[name="street"]').clear().invoke('val', 'Av. Falsa').trigger('input');
    cy.get('input[name="number"]').clear().invoke('val', '123').trigger('input');
    cy.get('input[name="city"]').clear().invoke('val', 'Marcos Paz').trigger('input');
    cy.get('input[name="postal_code"]').clear().invoke('val', '1234').trigger('input').trigger('blur');
    
    // El total debe ser $1.000.000
    cy.contains('1.000.000');

    // 5. Ir a método de pago
    cy.contains('Calculando envío...', { timeout: 2000 }).should('not.exist');
    cy.get('#btn-go-payment').should('not.be.disabled').click({ force: true });
    cy.contains(/c.mo quer.s pagar/i).should('be.visible');

    // 6. Seleccionar Mercado Pago
    cy.contains('Mercado Pago').click();
    cy.contains(/Confirmar Pedido/i).click();

    // 7. Validar creación de orden y redirección
    cy.wait('@createOrder').then((interception) => {
      if (interception.request.body.status !== 'pending_payment') {
        cy.wait('@createOrder').then((secondInterception) => {
          const order = secondInterception.request.body;
          expect(order.total).to.eq(1000000);
          expect(order.subtotal).to.eq(1000000);
        });
      } else {
        const order = interception.request.body;
        expect(order.total).to.eq(1000000);
        expect(order.subtotal).to.eq(1000000);
      }
    });

    cy.wait('@mercadopagoWebhook').then((interception) => {
      const mpBody = interception.request.body;
      expect(mpBody.items[0].unit_price).to.eq(1000000); // 1.000.000 ARS
      expect(mpBody.items[0].subtotal).to.eq(1000000);
    });
  });

  it('debería calcular correctamente al seleccionar Efectivo', () => {
    // Add product to cart
    cy.contains('iPhone 15 Pro (Test)').closest('.group').contains('Añadir').click({ force: true });
    cy.get('button[aria-label="Carrito"]').click({ force: true });
    cy.get('[aria-label="Carrito de compras"]').should('be.visible');
    cy.get('[aria-label="Carrito de compras"]').contains('Finalizar Compra').click({ force: true });

    // Fill form
    cy.wait(1000);
    cy.get('input[name="name"]').clear().invoke('val', 'Cypress Tester').trigger('input');
    cy.get('input[name="email"]').clear().invoke('val', 'cypress@test.com').trigger('input');
    cy.get('input[name="phone"]').clear().invoke('val', '1122334455').trigger('input');
    cy.get('input[name="street"]').clear().invoke('val', 'Av. Falsa').trigger('input');
    cy.get('input[name="number"]').clear().invoke('val', '123').trigger('input');
    cy.get('input[name="city"]').clear().invoke('val', 'Marcos Paz').trigger('input');
    cy.get('input[name="postal_code"]').clear().invoke('val', '1234').trigger('input').trigger('blur');
    
    cy.contains('Calculando envío...', { timeout: 2000 }).should('not.exist');
    cy.get('#btn-go-payment').should('not.be.disabled').click({ force: true });
    cy.contains(/c.mo quer.s pagar/i).should('be.visible');

    // Select Efectivo
    cy.contains('Efectivo').click();
    cy.contains(/Confirmar Pedido/i).click();

    // Verify ticket creation
    cy.contains(/¡Pedido Registrado!/i).should('be.visible');
    cy.contains(/ORD-/i).should('exist');
    cy.contains('1.000.000');
  });
});
