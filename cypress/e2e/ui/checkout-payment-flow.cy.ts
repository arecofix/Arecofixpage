import { buildMockProduct, buildMockOrder, buildMockOrderItem } from '../../support/mock-factories';

describe('Pasarela de Pago, Procesamiento y Orden Final (E2E)', () => {
  const product = buildMockProduct();
  const cartOrder = buildMockOrder([buildMockOrderItem(product, 1)]);

  beforeEach(() => {
    cy.setupCheckoutSession();
    
    cy.on('window:before:load', (win) => {
      cy.stub(win.console, 'error').callsFake(() => {});
      cy.stub(win.console, 'warn').callsFake(() => {});
    });

    cy.intercept({ method: 'GET', url: '**/rest/v1/orders*', query: { status: 'eq.cart' } }, {
      statusCode: 200,
      body: cartOrder
    }).as('getCartForPayment');
  });

  const fillShippingForm = () => {
    cy.get('input[formControlName="name"]').type('Juan Perez', { force: true });
    cy.get('input[formControlName="email"]').type('juan@ejemplo.com', { force: true });
    cy.get('input[formControlName="phone"]').type('1122334455', { force: true });
    cy.get('input[formControlName="street"]').type('Av. Siempreviva', { force: true });
    cy.get('input[formControlName="number"]').type('742', { force: true });
    cy.get('input[formControlName="city"]').type('Springfield', { force: true });
    cy.get('input[formControlName="postal_code"]').type('1000', { force: true }).blur();
    
    // Wait for the UI to update the shipping cost instead of waiting for a network request
    cy.contains('Calculando envío...', { timeout: 2000 }).should('not.exist');
    
    cy.get('#btn-go-payment').should('not.be.disabled').click({ force: true });
    
    // Wait for the payment method step to appear
    cy.contains(/c.mo quer.s pagar/i).should('be.visible');
  };

  it('debería procesar orden exitosa y generar ID único (QA #84-85)', () => {
    cy.visit('/checkout');
    cy.wait('@getCartForPayment');
    
    fillShippingForm();

    cy.contains('h4', 'Mercado Pago').click({ force: true });
    
    // Mockear la creación de orden como Completada o Pendiente de Pago
    cy.intercept('PATCH', '**/rest/v1/order*', (req) => {
      req.reply({
        statusCode: 200,
        body: [{ ...cartOrder, ...req.body, status: 'pending', order_number: 'ORD-TEST999' }]
      });
    }).as('processOrder');

    cy.get('button').contains(/confirmar pedido/i, { matchCase: false }).click({ force: true });
    
    cy.wait('@processOrder');
    
    // Al finalizar debería ir a Mercado Pago o a la Thank You page
    cy.contains(/Redirigiendo|Gracias por tu compra/i, { timeout: 8000 }).should('be.visible');
  });

  it('debería manejar rechazos de red o servidor amigablemente (QA #78)', () => {
    cy.visit('/checkout');
    cy.wait('@getCartForPayment');
    
    fillShippingForm();

    cy.contains('h4', 'Mercado Pago').click({ force: true });
    
    // Mockear un fallo de red o servidor 500
    cy.intercept('PATCH', '**/rest/v1/order*', {
      statusCode: 500,
      body: { message: 'Error interno procesando pago' }
    }).as('processOrderFail');

    cy.get('button').contains(/confirmar pedido/i, { matchCase: false }).click({ force: true });
    
    cy.wait('@processOrderFail');
    
    // Debe mostrar error y no redirigir
    cy.get('app-toast').contains(/error|procesar/i, { timeout: 8000 }).should('be.visible');
    cy.url().should('include', '/checkout');
  });
});
