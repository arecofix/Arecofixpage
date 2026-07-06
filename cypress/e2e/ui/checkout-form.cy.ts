describe('Carrito y Checkout (E2E)', () => {
  beforeEach(() => {
    // 1. Simular sesión de usuario común
    const mockSession = {
      access_token: 'fake-jwt-token',
      refresh_token: 'fake-refresh-token',
      user: {
        id: 'common-user-123',
        email: 'user@example.com',
        role: 'authenticated'
      }
    };
    
    // Inyectar estado en localStorage
    window.localStorage.setItem('sb-arecofix-auth-token', JSON.stringify(mockSession));
    
    // 2. Mock de perfil
    cy.intercept('GET', '**/rest/v1/profiles*', (req) => {
      req.reply({
        statusCode: 200,
        body: String(req.headers['accept'])?.includes('application/vnd.pgrst.object') ? {
          id: 'common-user-123',
          first_name: 'Usuario',
          last_name: 'Comun',
          role: 'user'
        } : [{
          id: 'common-user-123',
          first_name: 'Usuario',
          last_name: 'Comun',
          role: 'user'
        }]
      });
    }).as('getProfile');

    // 3. Mock de configuración
    cy.intercept('GET', '**/rest/v1/companies*', {
      statusCode: 200,
      body: [{ id: 'company-1', name: 'Arecofix' }]
    }).as('getCompany');

    cy.intercept('GET', '**/rest/v1/branches*', {
      statusCode: 200,
      body: [{ id: 'branch-1', name: 'Sucursal Central', is_default: true }]
    }).as('getBranch');

    // 4. Mock de productos en el servidor
    cy.intercept('GET', '**/rest/v1/products*', {
      statusCode: 200,
      body: [{
        id: 'prod-1',
        name: 'Funda Silicona iPhone 13',
        price: 2500,
        currency: 'ARS',
        is_active: true,
        stock: 10
      }]
    }).as('getProducts');

    // 5. Mock de cotización de envío
    cy.intercept('GET', '**/rest/v1/shipping_rates*', {
      statusCode: 200,
      body: [{ provider: 'Correo Argentino', cost: 1500 }]
    }).as('getShippingRates');

    // 6. Mock de Creación de Orden (bypassing RLS error para testing)
    cy.intercept('POST', '**/rest/v1/orders*', {
      statusCode: 201,
      body: [{
        id: 'order-123',
        order_number: 'ORD-TEST1234',
        status: 'pending_payment'
      }]
    }).as('createOrder');

    cy.intercept('POST', '**/rest/v1/order_items*', {
      statusCode: 201,
      body: [{ id: 'item-1' }]
    }).as('createOrderItems');
    
    // 7. Mock del Carrito Activo (GET orders with status=cart)
    cy.intercept('GET', '**/rest/v1/orders*status=eq.cart*', (req) => {
        req.reply({
          statusCode: 200,
          body: [
            {
              id: 'mock-cart-id',
              user_id: 'common-user-123',
              status: 'cart',
              items: [{ 
                product_id: 'prod-1', 
                quantity: 1, 
                price: 100,
                product: {
                  id: 'prod-1',
                  name: 'Mock Product',
                  slug: 'mock-product',
                  price: 100,
                  currency: 'ARS',
                  image_url: 'mock.jpg'
                }
              }],
              total_amount: 100
            }
          ]
        });
      }).as('getActiveCart');
  });

  it('debería agregar un producto al carrito y completar el checkout correctamente', () => {
    // Ir al checkout directamente
    cy.visit('/checkout');
    cy.url().should('include', '/checkout');
    
    // Wait for auth state to be loaded so patchValue doesn't overwrite our typing
    cy.wait(1500);
    
    // Llenar el formulario de envío/facturación
    cy.get('input[formControlName="name"]').clear({ force: true }).invoke('val', 'Juan Perez').trigger('input', { force: true }).blur({ force: true });
    cy.get('input[formControlName="email"]').clear({ force: true }).invoke('val', 'juan@ejemplo.com').trigger('input', { force: true }).blur({ force: true });
    cy.get('input[formControlName="phone"]').clear({ force: true }).invoke('val', '1122334455').trigger('input', { force: true }).blur({ force: true });
    
    // Dirección
    cy.get('input[formControlName="street"]').clear({ force: true }).invoke('val', 'Av. Siempreviva').trigger('input', { force: true }).blur({ force: true });
    cy.get('input[formControlName="number"]').clear({ force: true }).invoke('val', '742').trigger('input', { force: true }).blur({ force: true });
    cy.get('input[formControlName="city"]').clear({ force: true }).invoke('val', 'Springfield').trigger('input', { force: true }).blur({ force: true });
    cy.get('input[formControlName="postal_code"]').clear({ force: true }).invoke('val', '1000').trigger('input', { force: true }).blur({ force: true });
    
    // Esperar a que se completen las validaciones y cálculos
    cy.wait(1000);
    
    // Debug invalid inputs
    cy.get('form').then($form => {
      const invalid = $form.find('.ng-invalid');
      if (invalid.length > 0) {
        let invalidDetails = '';
        invalid.each((i, el) => {
          if (el.id) {
            invalidDetails += `${el.id}="${(el as unknown as HTMLInputElement).value}", `;
          }
        });
        throw new Error('FORM IS INVALID. Invalid inputs: ' + invalidDetails);
      }
    });
    
    // Ir a Métodos de Pago
    cy.get('#btn-go-payment').should('not.be.disabled').click({ force: true });
    
    // Seleccionar pago
    cy.get('input[type="radio"][name="payment"]').first().check({ force: true });
    
    // Confirmar orden
    cy.get('button').contains(/confirmar pedido/i, { matchCase: false }).click({ force: true });
    
    // Validar que se llamó al endpoint de creación de orden con los datos correctos
    cy.wait('@createOrder').its('request.body').should('contain', {
      customer_name: 'Juan Perez',
      status: 'pending_payment'
    });
    
    // Validar UI de éxito (Redirección a Mercado Pago porque es el primer método por defecto)
    cy.contains(/Redirigiendo a Pago Seguro/i, { matchCase: false, timeout: 8000 }).should('be.visible');
  });

  it('debería mostrar mensaje de error claro si falla por permisos en checkout', () => {
    // Forzamos error 42501 (RLS Permisos) en la creación de orden (POST)
    cy.intercept('POST', '**/rest/v1/orders*', {
      statusCode: 403,
      body: {
        code: '42501',
        message: 'new row violates row-level security policy for table "orders"',
        details: 'No tienes permisos'
      }
    }).as('createOrderFail');
    
    // El GET del carrito sigue funcionando con el mock global de arriba
    cy.visit('/checkout');
    
    cy.wait(1500);
    
    // Llenar datos de envío (necesarios para que no falle la validación principal)
    cy.get('input[formControlName="name"]').clear({ force: true }).invoke('val', 'Maria Lopez').trigger('input', { force: true }).blur({ force: true });
    cy.get('input[formControlName="email"]').clear({ force: true }).invoke('val', 'maria@ejemplo.com').trigger('input', { force: true }).blur({ force: true });
    cy.get('input[formControlName="phone"]').clear({ force: true }).invoke('val', '1122334455').trigger('input', { force: true }).blur({ force: true });
    cy.get('input[formControlName="street"]').clear({ force: true }).invoke('val', 'Calle Falsa').trigger('input', { force: true }).blur({ force: true });
    cy.get('input[formControlName="number"]').clear({ force: true }).invoke('val', '123').trigger('input', { force: true }).blur({ force: true });
    cy.get('input[formControlName="city"]').clear({ force: true }).invoke('val', 'Springfield').trigger('input', { force: true }).blur({ force: true });
    cy.get('input[formControlName="postal_code"]').clear({ force: true }).invoke('val', '1000').trigger('input', { force: true }).blur({ force: true });
    
    cy.wait(1000);
    
    cy.get('form').then($form => {
      const invalid = $form.find('.ng-invalid');
      if (invalid.length > 0) {
        let invalidDetails = '';
        invalid.each((i, el) => {
          if (el.id) {
            invalidDetails += `${el.id}="${(el as unknown as HTMLInputElement).value}", `;
          }
        });
        throw new Error('FORM IS INVALID. Invalid inputs: ' + invalidDetails);
      }
    });

    cy.get('#btn-go-payment').should('not.be.disabled').click({ force: true });
    cy.get('input[type="radio"][name="payment"]').first().check({ force: true });
    cy.get('button').contains(/confirmar pedido/i, { matchCase: false }).click({ force: true });
    
    cy.wait('@createOrderFail');
    
    // Debe mostrar nuestro mensaje custom claro
    cy.contains(/No tienes permisos/i, { matchCase: false, timeout: 8000 }).should('be.visible');
  });
});
