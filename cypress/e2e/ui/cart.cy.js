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
    // Seleccionamos el primer botón de "Añadir al Carrito"
    cy.get('button').contains('Añadir al Carrito', { matchCase: false }).first().click();

    // Validar notificación de éxito (toast)
    cy.contains('Agregaste un producto al carrito').should('be.visible');

    // 2. Abrimos el carrito
    cy.get('button[aria-label="Carrito"]').click();
    cy.get('h2').contains('Carrito').should('be.visible');

    // Verificamos que no esté vacío
    cy.get('p').contains('Tu carrito está vacío').should('not.exist');

    // Hacemos clic en "Finalizar Compra" o navegamos al checkout
    cy.contains('Finalizar Compra', { matchCase: false }).click();

    // 3. Completamos el formulario de Checkout
    cy.url().should('include', '/checkout');

    // Esperamos un segundo para que Angular termine de inicializar y cargar los recomendados
    cy.wait(1000);

    // Usamos los IDs reales del HTML y delay: 50 para darle tiempo a Angular a registrar
    // cada tecla, evitando que se "coma" letras (el bug del 'Us').
    cy.get('#checkout-name').clear().type('Usuario Test', { delay: 50 });
    cy.get('#checkout-email').clear().type('test@arecofix.com', { delay: 50 });
    cy.get('#checkout-phone').clear().type('1123456789', { delay: 50 });
    cy.get('#checkout-street').clear().type('Calle Falsa', { delay: 50 });
    cy.get('#checkout-number').clear().type('123', { delay: 50 });
    
    // Rellenamos explícitamente la ciudad por si se limpió el valor por defecto
    cy.get('#checkout-city').clear().type('Marcos Paz', { delay: 50 });
    
    cy.get('#checkout-cp').clear().type('1727', { delay: 50 });

    // Verificamos que los inputs realmente tengan los valores (para evitar bugs de Angular re-renders)
    cy.get('#checkout-name').should('have.value', 'Usuario Test');
    cy.get('#checkout-email').should('have.value', 'test@arecofix.com');
    cy.get('#checkout-cp').should('have.value', '1727');

    // Esperamos a que pase el debounceTime(800) del código postal
    cy.wait(1000);
    
    // Verificamos explícitamente que el carrito no se haya vaciado mágicamente
    cy.get('.toast').should('not.exist'); 

    // Forzamos el submit del formulario en lugar de solo hacer clic en el botón
    // para evitar cualquier problema de eventos capturados.
    cy.get('#btn-go-payment').should('not.be.disabled').click();

    // Verificamos que no haya saltado el error de validación de formulario
    cy.contains('Por favor, completá todos los campos requeridos.').should('not.exist');
    cy.contains('Tu carrito está vacío.').should('not.exist');

    // 4. Seleccionamos método de pago
    // Verificamos que hayamos cambiado de paso correctamente
    cy.contains('¿Cómo querés pagar?').should('be.visible');
    cy.contains('Efectivo (Puntos de Cobro)', { matchCase: false }).click();

    // Confirmamos la reserva / compra
    cy.contains('Confirmar Pedido Seguro', { matchCase: false }).click();

    // 5. Validamos la conexión a la base de datos (Validación de Payload)
    cy.get('@createOrder.all').then((interceptions) => {
      // El primer POST fue para crear el carrito. El segundo (o subsiguiente) es el checkout.
      // Buscamos la petición que tenga los datos del cliente.
      const checkoutIntercept = interceptions.find(i => i.request.body.customer_name === 'Usuario Test');
      expect(checkoutIntercept, 'Petición POST de checkout encontrada').to.not.be.undefined;
      
      const payload = checkoutIntercept.request.body;
      
      // Validamos que todos los datos se envíen correctamente a la base de datos
      expect(payload.customer_name).to.equal('Usuario Test');
      expect(payload.customer_email).to.equal('test@arecofix.com');
      expect(payload.customer_phone).to.equal('1123456789');
      expect(payload.status).to.equal('pending_payment');
      expect(payload.payment_method).to.equal('cash');
      // En Supabase, los items no se envían en la tabla principal (orders)
      expect(payload.items).to.be.undefined;
    });

    // Validamos que los items se envían a la tabla order_items
    cy.wait('@createOrderItems').then((interception) => {
      const itemsPayload = interception.request.body;
      expect(itemsPayload).to.be.an('array').that.is.not.empty;
      expect(itemsPayload[0]).to.have.property('product_name');
      expect(itemsPayload[0]).to.have.property('quantity');
    });

    // 6. Validamos que la UI muestre el paso final (Ej. Código de Pago)
    cy.contains('¡Pedido Registrado!').should('be.visible');
  });
});
