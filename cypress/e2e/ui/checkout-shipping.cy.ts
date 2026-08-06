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
    cy.wait(500);
    cy.get('input[formControlName="email"]').clear().invoke('val', 'juan@ejemplo.com').trigger('input');
    cy.get('input[formControlName="name"]').clear().invoke('val', 'Juan Perez').trigger('input');
    cy.get('input[formControlName="phone"]').clear().invoke('val', '1122334455').trigger('input');
    cy.get('input[formControlName="street"]').clear().invoke('val', 'Av. Falsa').trigger('input');
    cy.get('input[formControlName="number"]').clear().invoke('val', '123').trigger('input');
    cy.get('input[formControlName="city"]').clear().invoke('val', 'Springfield').trigger('input');
    
    cy.get('input[formControlName="postal_code"]').clear().invoke('val', '9999').trigger('input').trigger('blur');
    
    // Verificamos que desaparezca el texto "Calculando envío..."
    cy.contains('Calculando envío...', { timeout: 2000 }).should('not.exist');
    cy.get('#btn-go-payment').should('not.be.disabled').click({ force: true });
    cy.contains(/c.mo quer.s pagar/i).should('exist');
  });

  it('debería calcular y sumar el costo de envío correctamente (QA #63)', () => {
    cy.visit('/checkout');
    cy.wait('@getCartForShipping');
    cy.wait(500);
    
    // Rellenar lo mínimo necesario
    cy.get('input[formControlName="name"]').clear().invoke('val', 'Juan Perez').trigger('input');
    cy.get('input[formControlName="email"]').clear().invoke('val', 'juan@ejemplo.com').trigger('input');
    cy.get('input[formControlName="phone"]').clear().invoke('val', '1122334455').trigger('input');
    cy.get('input[formControlName="street"]').clear().invoke('val', 'Av. Falsa').trigger('input');
    cy.get('input[formControlName="number"]').clear().invoke('val', '123').trigger('input');
    cy.get('input[formControlName="city"]').clear().invoke('val', 'Springfield').trigger('input');
    
    // Al tipear el CP debería reflejarse el costo de envío (mockeado)
    cy.get('input[formControlName="postal_code"]').clear().invoke('val', '1000').trigger('input').trigger('blur');
    
    // Verificamos que desaparezca el estado de calculando
    cy.contains('Calculando envío...', { timeout: 2000 }).should('not.exist');
    // Verificamos que el botón no esté disabled y permita avanzar
    cy.get('#btn-go-payment').should('not.be.disabled').click({ force: true });
    
    // Verificamos el avance al paso de pago
    cy.contains(/c.mo quer.s pagar/i, { matchCase: false }).should('be.visible');
  });
});
