describe('Pruebas del Carrito de Compras (Compracarrito)', () => {
  beforeEach(() => {
    // Simulamos la creación y actualización del carrito para no afectar la BD real
    // y evitar errores 401 de RLS para usuarios no autenticados en el test.
    cy.intercept('POST', '**/rest/v1/orders*', (req) => {
      req.reply({
        statusCode: 201,
        body: { 
          id: 'mock-order-123', 
          order_number: '123456', 
          status: req.body.status || 'cart', 
          items: req.body.items || [] 
        }
      });
    }).as('createOrder');

    cy.intercept('PATCH', '**/rest/v1/orders*', (req) => {
      req.reply({
        statusCode: 200,
        body: { 
          id: 'mock-order-123', 
          status: req.body.status || 'cart', 
          items: req.body.items || [] 
        }
      });
    }).as('updateOrder');

    // Mockeamos la gestión de los items de la orden para que tampoco de 401
    cy.intercept('DELETE', '**/rest/v1/order_items*', {
      statusCode: 204, // Supabase delete returns 204 No Content typically
      body: null
    }).as('deleteOrderItems');

    cy.intercept('POST', '**/rest/v1/order_items*', {
      statusCode: 201,
      body: [{ id: 'mock-item-123' }]
    }).as('createOrderItems');
    
    // Visitar la página de repuestos/productos (donde hay botones de agregar al carrito)
    cy.visit('/repuestos');
  });

  it('Debe permitir agregar productos al carrito y finalizar la compra enviando los datos correctos a la BD', () => {
    // 1. Esperamos a que los productos carguen en pantalla
    cy.get('.products-container, [class*="product"]', { timeout: 10000 }).should('be.visible');
    cy.wait(1000);
    
    // Seleccionamos el primer botón de "Añadir al Carrito"
    cy.get('button').contains(/Añadir|Agregar/i, { matchCase: false }).first().click();

    // Validar notificación de éxito (toast) - con timeout más largo
    cy.contains(/Agregaste|Producto añadido/i, { timeout: 5000 }).should('be.visible');

    // 2. Abrimos el carrito
    cy.wait(500);
    cy.get('button[aria-label="Carrito"], button:contains("Carrito")').click();
    cy.wait(500);
    
    // Verificamos que el carrito esté visible y no vacío
    cy.contains(/Carrito|Compra/i, { timeout: 5000 }).should('be.visible');
    cy.get('p').contains('Tu carrito está vacío').should('not.exist');

    // Hacemos clic en "Finalizar Compra" o navegamos al checkout
    cy.contains(/Finalizar|Continuar|Checkout/i, { matchCase: false }).click();

    // 3. Completamos el formulario de Checkout
    cy.url({ timeout: 10000 }).should('include', '/checkout');
    cy.wait(1000);

    // Rellenar el formulario de checkout
    cy.get('#checkout-name').clear({ force: true }).type('Usuario Test', { delay: 30 });
    cy.get('#checkout-email').clear({ force: true }).type('test@arecofix.com', { delay: 30 });
    cy.get('#checkout-phone').clear({ force: true }).type('1123456789', { delay: 30 });
    cy.get('#checkout-street').clear({ force: true }).type('Calle Falsa', { delay: 30 });
    cy.get('#checkout-number').clear({ force: true }).type('123', { delay: 30 });
    cy.get('#checkout-city').clear({ force: true }).type('Marcos Paz', { delay: 30 });
    cy.get('#checkout-cp').clear({ force: true }).type('1727', { delay: 30 });

    // Verificar los valores
    cy.get('#checkout-name').should('have.value', 'Usuario Test');
    cy.get('#checkout-email').should('have.value', 'test@arecofix.com');
    cy.get('#checkout-cp').should('have.value', '1727');

    // Esperar debounce
    cy.wait(1500);
    
    // Click al botón de pago
    cy.get('#btn-go-payment').should('exist').and('not.be.disabled').click({ force: true });

    // 4. Seleccionar método de pago
    cy.wait(1000);
    cy.contains(/Cómo|Como|Método|Metodo/i, { timeout: 5000 }).should('be.visible');
    cy.contains(/Efectivo|Tarjeta|Cash/i, { timeout: 5000 }).click();

    // Re-declarar el intercept para asegurarnos de capturar el de checkout
    cy.intercept('POST', '**/rest/v1/orders*').as('finalCheckoutOrder');

    // Confirmamos la compra
    cy.contains(/Confirmar|Comprar|Procesar/i, { matchCase: false }).click();

    // 5. Validar que la orden se envió
    cy.wait('@finalCheckoutOrder', { timeout: 15000 }).then((interception) => {
      expect(interception.response.statusCode).to.equal(201);
      const payload = interception.request.body;
      expect(payload).to.have.property('customer_name');
    });

    // 6. Verificar confirmación en la UI
    cy.contains(/Pedido|Registrado|Éxito|Exito|Confirmado/i, { timeout: 10000 }).should('be.visible');
  });
});
