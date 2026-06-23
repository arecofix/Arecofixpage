describe('Pruebas del Carrito de Compras (Compracarrito)', () => {
  beforeEach(() => {
    // Interceptamos las llamadas a la base de datos para validar los datos enviados
    // sin afectar la base de datos real (Supabase).
    cy.intercept('POST', '**/rest/v1/orders*').as('createOrder');
    
    // Visitar la página de repuestos/productos (donde hay botones de agregar al carrito)
    cy.visit('/repuestos');
  });

  it('Debe permitir agregar productos al carrito y finalizar la compra enviando los datos correctos a la BD', () => {
    // 1. Esperamos a que los productos carguen en pantalla
    // Seleccionamos el primer botón de "Agregar al Carrito"
    cy.get('button').contains('Agregar al Carrito', { matchCase: false }).first().click();

    // Validar notificación de éxito (toast)
    cy.contains('Agregaste un producto al carrito').should('be.visible');

    // 2. Abrimos el carrito
    cy.get('button[aria-label="Carrito"]').click();
    cy.get('h2').contains('Carrito').should('be.visible');

    // Verificamos que no esté vacío
    cy.get('p').contains('Tu carrito está vacío').should('not.exist');

    // Hacemos clic en "Finalizar Compra" o navegamos al checkout
    cy.get('button').contains('Finalizar Compra', { matchCase: false }).click();

    // 3. Completamos el formulario de Checkout
    cy.url().should('include', '/checkout');

    cy.get('input[formControlName="name"]').type('Usuario Test');
    cy.get('input[formControlName="email"]').type('test@arecofix.com');
    cy.get('input[formControlName="phone"]').type('1123456789');
    cy.get('input[formControlName="street"]').type('Calle Falsa');
    cy.get('input[formControlName="number"]').type('123');
    cy.get('input[formControlName="postal_code"]').type('1727');

    // Pasamos al siguiente paso (Método de Pago)
    cy.get('button').contains('Continuar al Pago').click();

    // 4. Seleccionamos método de pago
    cy.get('button').contains('Pago en Efectivo', { matchCase: false }).click();

    // Confirmamos la reserva / compra
    cy.get('button').contains('Confirmar Reserva').click();

    // 5. Validamos la conexión a la base de datos (Validación de Payload)
    cy.wait('@createOrder').then((interception) => {
      // Verificamos que la petición salió correctamente (simulada o real)
      expect(interception.request.method).to.equal('POST');
      
      const payload = interception.request.body;
      
      // Validamos que todos los datos se envíen correctamente a la base de datos
      expect(payload.customer_name).to.equal('Usuario Test');
      expect(payload.customer_email).to.equal('test@arecofix.com');
      expect(payload.customer_phone).to.equal('1123456789');
      expect(payload.status).to.equal('pending_payment');
      expect(payload.payment_method).to.equal('cash');
      expect(payload.items).to.be.an('array').that.is.not.empty;
    });

    // 6. Validamos que la UI muestre el paso final (Ej. Código de Pago)
    cy.contains('Tu reserva está confirmada').should('be.visible');
  });
});
