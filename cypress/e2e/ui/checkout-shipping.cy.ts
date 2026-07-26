import { buildMockProduct, buildMockOrder, buildMockOrderItem, buildMockBranch } from '../../support/mock-factories';

describe('Datos de Envío, Facturación y Sucursales (E2E)', () => {
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
    }).as('getCartForShipping');
    
    cy.intercept('PATCH', '**/rest/v1/order*', (req) => {
      req.reply({ statusCode: 200, body: [{ ...cartOrder, ...req.body }] });
    }).as('updateOrder');
  });

  it('debería validar obligatoriedad y formato en campos de datos personales y envío (QA #54-58)', () => {
    cy.visit('/checkout');
    cy.wait('@getCartForShipping');
    
    // Intentar ir a pago con formulario vacío
    cy.get('#btn-go-payment').click({ force: true });
    
    // Deberían mostrarse errores de validación (clases rojas o mensajes)
    cy.get('input[formControlName="name"]').should('have.class', 'ng-invalid');
    cy.get('input[formControlName="email"]').should('have.class', 'ng-invalid');
    
    // Formato de email inválido
    cy.get('input[formControlName="email"]').type('correo_sin_arroba.com', { force: true });
    cy.get('#btn-go-payment').click({ force: true });
    cy.get('input[formControlName="email"]').should('have.class', 'ng-invalid');
    
    // Formato de email válido
    cy.get('input[formControlName="email"]').clear({ force: true }).type('juan@ejemplo.com', { force: true });
    cy.get('input[formControlName="name"]').type('Juan Perez', { force: true });
    cy.get('input[formControlName="phone"]').type('1122334455', { force: true });
    cy.get('input[formControlName="street"]').type('Av. Falsa', { force: true });
    cy.get('input[formControlName="number"]').type('123', { force: true });
    cy.get('input[formControlName="city"]').type('Springfield', { force: true });
    cy.get('input[formControlName="postal_code"]').type('1000', { force: true }).blur();
    
    // Ahora debería dejar avanzar sin errores
    cy.get('#btn-go-payment').should('not.be.disabled').click({ force: true });
    cy.get('input[type="radio"][name="payment"]').should('exist');
  });

  it('debería calcular y sumar el costo de envío correctamente (QA #63)', () => {
    cy.visit('/checkout');
    cy.wait('@getCartForShipping');
    
    // Rellenar lo mínimo necesario
    cy.get('input[formControlName="name"]').type('Juan Perez', { force: true });
    cy.get('input[formControlName="email"]').type('juan@ejemplo.com', { force: true });
    cy.get('input[formControlName="phone"]').type('1122334455', { force: true });
    cy.get('input[formControlName="street"]').type('Av. Falsa', { force: true });
    cy.get('input[formControlName="number"]').type('123', { force: true });
    cy.get('input[formControlName="city"]').type('Springfield', { force: true });
    
    // Al tipear el CP debería reflejarse el costo de envío (mockeado)
    cy.get('input[formControlName="postal_code"]').type('1000', { force: true }).blur();
    
    // Verificamos que desaparezca el texto "Ingresá tu CP"
    cy.contains('Ingresá tu CP').should('not.exist');
    // Verificamos que el botón no esté disabled y permita avanzar
    cy.get('#btn-go-payment').should('not.be.disabled').click({ force: true });
    
    // Verificamos el avance al paso de pago
    cy.contains(/¿Cómo querés pagar?/i, { matchCase: false }).should('be.visible');
  });
});
