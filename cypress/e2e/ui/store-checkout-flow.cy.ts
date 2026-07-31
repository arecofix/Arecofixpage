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

    // Abrir carrito y chequear item
    cy.get('button[aria-label="Carrito"]').click({ force: true });
    
    // Check that item is in the cart
    cy.contains(/Servicio de Reparación|Repuesto/i).should('be.visible');
    
    // Ir a checkout mediante el botón (preserva estado de Angular)
    cy.contains('a', /Finalizar Compra/i).click({ force: true });
    
    cy.url().should('include', '/checkout');
    
    // Formularios (Datos de contacto y envío)
    cy.get('input[formControlName="name"]').clear().type('Juan Perez', { delay: 50 }).blur();
    cy.get('input[formControlName="email"]').clear().type('juan@ejemplo.com', { delay: 50 }).blur();
    cy.get('input[formControlName="phone"]').clear().type('1122334455', { delay: 50 }).blur();
    
    cy.get('input[formControlName="street"]').clear().type('Av. Siempreviva', { delay: 50 }).blur();
    cy.get('input[formControlName="number"]').clear().type('742', { delay: 50 }).blur();
    cy.get('input[formControlName="city"]').clear().type('Springfield', { delay: 50 }).blur();
    cy.get('input[formControlName="postal_code"]').clear().type('1000', { delay: 50 }).blur();
    
    // Esperar a que el formulario debounce actualice el costo de envío
    cy.wait(1000);

    // Assert the form is valid (button should not be disabled)
    cy.get('button[type="submit"]').should('not.be.disabled');

    cy.get('button[type="submit"]').click();
    
    // Si la validación falla, markAllAsTouched muestra errores. Veamos cuáles son:
    cy.document().then(doc => {
      const errors = doc.querySelectorAll('.text-red-500');
      if (errors.length > 0) {
        throw new Error('Form validation failed: ' + Array.from(errors).map(e => e.textContent).join(', '));
      }
    });

    // El step debe cambiar y mostrar opciones de pago
    cy.contains('h4', 'Mercado Pago', { timeout: 10000 }).click({ force: true });
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
    
    cy.get('input[formControlName="name"]').clear().type('Maria Gomez', { delay: 50 }).blur();
    cy.get('input[formControlName="email"]').clear().type('maria@ejemplo.com', { delay: 50 }).blur();
    cy.get('input[formControlName="phone"]').clear().type('1133445566', { delay: 50 }).blur();
    
    cy.get('input[formControlName="street"]').clear().type('Calle Falsa', { delay: 50 }).blur();
    cy.get('input[formControlName="number"]').clear().type('123', { delay: 50 }).blur();
    cy.get('input[formControlName="city"]').clear().type('Springfield', { delay: 50 }).blur();
    cy.get('input[formControlName="postal_code"]').clear().type('1000', { delay: 50 }).blur();
    
    cy.wait(1000);

    // Assert the form is valid (button should not be disabled)
    cy.get('button[type="submit"]').should('not.be.disabled');

    cy.get('button[type="submit"]').click();
    
    // Si la validación falla, markAllAsTouched muestra errores. Veamos cuáles son:
    cy.document().then(doc => {
      const errors = doc.querySelectorAll('.text-red-500');
      if (errors.length > 0) {
        throw new Error('Form validation failed: ' + Array.from(errors).map(e => e.textContent).join(', '));
      }
    });

    cy.get('input[type="radio"][name="payment"]').first().check({ force: true });
    cy.get('button').contains(/confirmar pedido/i, { matchCase: false }).click({ force: true });
    
    cy.wait('@createOrderFail');
    
    cy.get('app-toast span').contains(/permisos|Error al procesar/i, { timeout: 8000 }).should('exist');
  });
});
