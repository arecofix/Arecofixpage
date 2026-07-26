import { buildMockProduct, buildMockOrder, buildMockOrderItem } from '../../support/mock-factories';

describe('Carrito y Checkout (E2E) - Happy Path Modularizado', () => {
  beforeEach(() => {
    // 1. Inicializar sesión base (auth, tenant, branch, profile) usando el nuevo comando
    cy.setupCheckoutSession();

    const product = buildMockProduct();
    const cartOrder = buildMockOrder([buildMockOrderItem(product, 1)]);

    // 2. Mocks de catálogo
    cy.intercept('GET', '**/rest/v1/products*', (req) => {
      req.reply({
        statusCode: 200,
        headers: {
          'Content-Range': '0-0/1',
          'Content-Type': 'application/json'
        },
        body: [product]
      });
    }).as('getProducts');

    // 3. Mocks de cotización de envío
    cy.intercept('GET', '**/rest/v1/shipping_rates*', {
      statusCode: 200,
      body: [{ provider: 'Correo Argentino', cost: 1500 }]
    }).as('getShippingRates');

    // 4. Mocks de Carrito / Orden (Supabase)
    cy.intercept('DELETE', '**/rest/v1/order*', { statusCode: 204 });
    cy.intercept('DELETE', '**/rest/v1/order_items*', { statusCode: 200, body: [] }).as('deleteOrderItems');

    cy.intercept({ method: 'GET', url: '**/rest/v1/orders*', query: { status: 'eq.cart' } }, {
      statusCode: 200,
      body: cartOrder
    }).as('getActiveCart');

    cy.intercept('POST', '**/rest/v1/order*', {
      statusCode: 201,
      body: [cartOrder]
    }).as('saveOrder');
    
    cy.intercept('PATCH', '**/rest/v1/order*', (req) => {
      req.reply({
        statusCode: 200,
        body: [{
          ...cartOrder,
          ...req.body
        }]
      });
    }).as('updateOrder');
    
    cy.intercept('POST', '**/rest/v1/order_items*', {
      statusCode: 201,
      body: []
    }).as('saveOrderItems');

    // Suprimir logs de consola durante el test
    cy.on('window:before:load', (win) => {
      cy.stub(win.console, 'error').callsFake(() => {});
      cy.stub(win.console, 'warn').callsFake(() => {});
    });
  });

  it('debería agregar un producto al carrito y completar el checkout correctamente', () => {
    cy.visit('/productos');
    cy.wait('@getProducts');
    
    // Agregar al carrito
    cy.get('product-card button').contains(/Añadir al Carrito/i, { matchCase: false }).first().click({ force: true });
    cy.get('app-toast', { timeout: 8000 }).should('exist');

    // Navegar a checkout
    cy.get('button[aria-label="Carrito"]').click({ force: true });
    cy.get('a[href="/checkout"]').click({ force: true });
    cy.url().should('include', '/checkout');
    
    // Formularios (Datos de contacto y envío)
    cy.get('input[formControlName="name"]').clear({ force: true }).type('Juan Perez', { delay: 0, force: true });
    cy.get('input[formControlName="email"]').clear({ force: true }).type('juan@ejemplo.com', { delay: 0, force: true });
    cy.get('input[formControlName="phone"]').clear({ force: true }).type('1122334455', { delay: 0, force: true });
    
    cy.get('input[formControlName="street"]').clear({ force: true }).type('Av. Siempreviva', { delay: 0, force: true });
    cy.get('input[formControlName="number"]').clear({ force: true }).type('742', { delay: 0, force: true });
    cy.get('input[formControlName="city"]').clear({ force: true }).type('Springfield', { delay: 0, force: true });
    cy.get('input[formControlName="postal_code"]').clear({ force: true }).type('1000', { delay: 0, force: true }).blur();
    
    // Esperar a que el formulario debounce actualice el costo de envío
    cy.wait(1000);

    // Ir a pago y confirmar
    cy.get('#btn-go-payment').should('not.be.disabled').click({ force: true });
    cy.get('input[type="radio"][name="payment"]').first().check({ force: true });
    cy.get('button').contains(/confirmar pedido/i, { matchCase: false }).click({ force: true });
    
    // Validaciones
    cy.wait('@updateOrder');
    cy.contains(/Redirigiendo a Pago Seguro/i, { timeout: 8000 }).should('be.visible');
  });

  it('debería mostrar mensaje de error claro si falla por permisos en checkout', () => {
    // Forzar fallo de RLS
    cy.intercept('POST', '**/rest/v1/order*', {
      statusCode: 403,
      body: {
        code: '42501',
        message: 'new row violates row-level security policy for table "orders"',
        details: 'No tienes permisos'
      }
    }).as('createOrderFail');
    
    cy.visit('/productos');
    cy.wait('@getProducts');
    
    cy.get('product-card button').contains(/añadir al carrito/i, { matchCase: false }).first().click({ force: true });
    cy.get('button[aria-label="Carrito"]').click({ force: true });
    cy.get('a[href="/checkout"]').click({ force: true });
    
    cy.get('input[formControlName="name"]').type('Maria Lopez', { delay: 0, force: true });
    cy.get('input[formControlName="email"]').type('maria@ejemplo.com', { delay: 0, force: true });
    cy.get('input[formControlName="phone"]').type('1122334455', { delay: 0, force: true });
    cy.get('input[formControlName="street"]').type('Calle Falsa', { delay: 0, force: true });
    cy.get('input[formControlName="number"]').type('123', { delay: 0, force: true });
    cy.get('input[formControlName="city"]').type('Springfield', { delay: 0, force: true });
    cy.get('input[formControlName="postal_code"]').type('1000', { delay: 0, force: true }).blur();
    
    cy.wait(1000);

    cy.get('#btn-go-payment').click({ force: true });
    cy.get('input[type="radio"][name="payment"]').first().check({ force: true });
    cy.get('button').contains(/confirmar pedido/i, { matchCase: false }).click({ force: true });
    
    cy.wait('@createOrderFail');
    
    cy.get('app-toast span').contains(/permisos|Error al procesar/i, { timeout: 8000 }).should('exist');
  });
});
