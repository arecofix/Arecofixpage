import { buildMockProduct, buildMockOrder, buildMockOrderItem } from '../../support/mock-factories';

describe('Pasarela de Pago, Procesamiento y Orden Final (E2E)', () => {
  const product = buildMockProduct();
  const cartOrder = buildMockOrder([buildMockOrderItem(product, 1)]);

  beforeEach(() => {
    cy.setupCheckoutSession();
    
    cy.on('window:before:load', (win) => {
      // Allow logs for debugging
    });

    cy.intercept({ method: 'GET', url: '**/rest/v1/orders*', query: { status: 'eq.cart' } }, {
      statusCode: 200,
      body: cartOrder
    }).as('getCartForPayment');
  });

  const fillShippingForm = () => {
    // Wait for Angular SSR hydration to complete before typing!
    cy.wait(1500);
    cy.get('input[formControlName="name"]').clear().invoke('val', 'Juan Perez').trigger('input');
    cy.get('input[formControlName="email"]').clear().invoke('val', 'juan@ejemplo.com').trigger('input');
    cy.get('input[formControlName="phone"]').clear().invoke('val', '1122334455').trigger('input');
    cy.get('input[formControlName="street"]').clear().invoke('val', 'Av. Siempreviva').trigger('input');
    cy.get('input[formControlName="number"]').clear().invoke('val', '742').trigger('input');
    cy.get('input[formControlName="city"]').clear().invoke('val', 'Springfield').trigger('input');
    cy.get('input[formControlName="postal_code"]').clear().invoke('val', '1000').trigger('input').trigger('blur');
    
    cy.window().then((win: any) => {
      win.captchaResolved = true; 
    });

    // Wait for shipping calculation to complete
    cy.contains('Calculando envío...', { timeout: 2000 }).should('not.exist');
    
    // Instead of cy.get('form').submit(), click the button
    cy.get('button[type="submit"]').click();
    
    // Check if error toast appears
    cy.get('body').then($body => {
      if ($body.find('app-toast:contains("requeridos")').length > 0) {
        throw new Error('FORM IS INVALID! Toast appeared.');
      }
      if ($body.find('app-toast:contains("vacío")').length > 0) {
        throw new Error('CART IS EMPTY! Toast appeared.');
      }
    });

    // Wait for the payment method step to appear
    cy.contains(/c.mo quer.s pagar/i).should('be.visible');
  };

  it('debería procesar orden exitosa y generar ID único (QA #84-85)', () => {
    cy.visit('/checkout');
    cy.wait('@getCartForPayment');
    
    fillShippingForm();

    cy.contains('h4', 'Mercado Pago').click({ force: true });
    
    // Mockear la creación de orden como Completada o Pendiente de Pago
    cy.intercept('POST', '**/rest/v1/orders*', (req) => {
      req.reply({
        statusCode: 200,
        body: [{ ...cartOrder, ...req.body, status: 'pending', order_number: 'ORD-TEST999' }]
      });
    }).as('processOrder');
    
    // Mockear la inserción de order_items
    cy.intercept('POST', '**/rest/v1/order_items*', {
      statusCode: 200,
      body: []
    }).as('processOrderItems');

    // Mockear Mercado Pago Preference creation
    cy.intercept('POST', '**/functions/v1/mercadopago-preferences*', {
      statusCode: 200,
      body: { init_point: 'https://sandbox.mercadopago.com.ar/checkout/v1/redirect?pref_id=123' }
    }).as('createPreference');

    cy.get('button').contains(/confirmar pedido/i, { matchCase: false }).click({ force: true });
    
    cy.wait('@processOrder');
    cy.wait('@processOrderItems');
    cy.wait('@createPreference');
    
    // Al finalizar debería ir a Mercado Pago o a la Thank You page
    cy.contains(/Redirigiendo|Gracias por tu compra/i, { timeout: 8000 }).should('be.visible');
  });

  it('debería manejar rechazos de red o servidor amigablemente (QA #78)', () => {
    cy.visit('/checkout');
    cy.wait('@getCartForPayment');
    
    fillShippingForm();

    cy.contains('h4', 'Efectivo').click({ force: true });
    
    // Mock error de red o de base de datos
    cy.intercept('POST', '**/rest/v1/orders*', {
      statusCode: 500,
      body: { message: 'Internal Server Error' }
    }).as('processOrderFail');

    cy.get('button').contains(/confirmar pedido/i, { matchCase: false }).click({ force: true });
    
    cy.wait('@processOrderFail');
    
    // Debe mostrar error y no redirigir
    cy.get('app-toast').contains(/error|procesar/i, { timeout: 8000 }).should('be.visible');
    cy.url().should('include', '/checkout');
  });
});
