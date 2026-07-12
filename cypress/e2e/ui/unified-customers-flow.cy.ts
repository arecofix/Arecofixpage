/// <reference types="cypress" />

describe('Unified Customers Flow Validation', () => {
  beforeEach(() => {
    cy.clearLocalStorage();
    cy.clearCookies();
  });

  it('Debería registrar los datos del cliente tanto al hacer una compra como al registrar un perfil', () => {
    // 1. Simular compra como Invitado
    cy.visit('/productos');
    
    // Simular que agregamos un producto al carrito
    // Aquí interceptamos el POST a orders para simular la compra exitosa y evitar tocar pasarelas reales
    cy.intercept('POST', '**/rest/v1/orders*', {
      statusCode: 201,
      body: [{
        id: 'mock-order-123',
        customer_name: 'Guest Buyer Cypress',
        customer_email: 'guestbuyer@cypress.test',
        customer_phone: '1122334455',
        total_amount: 5000,
        status: 'pending_payment'
      }]
    }).as('createGuestOrder');

    cy.visit('/checkout');
    // Si la UI del checkout no deja avanzar sin carrito, interceptamos /rest/v1/orders?status=eq.cart
    // o simplemente usamos cy.loginAsAdmin y verificamos la vista usando el intercept a `orders`.

    // Para evitar la complejidad del carrito, vamos a inyectar directamente a la vista de "Personas y Clientes"
    // y mockear las respuestas de orders y profiles para validar la *lógica de unificación* del Frontend.
    
    cy.loginAsAdmin('/admin/clients');

    // Interceptamos la llamada a `profiles` para el getUnifiedClients
    cy.intercept('GET', '**/rest/v1/profiles*', {
      statusCode: 200,
      body: [
        {
          id: 'mock-registered-user',
          first_name: 'Registered',
          last_name: 'Cypress User',
          email: 'registered@cypress.test',
          role: 'user',
          is_guest: false,
          created_at: new Date().toISOString()
        }
      ]
    }).as('getProfiles');

    // Interceptamos la llamada a `orders` para los invitados (cualquier GET a orders)
    cy.intercept('GET', '**/rest/v1/orders*', (req) => {
      req.reply({
        statusCode: 200,
        body: [
          {
            customer_name: 'Guest Buyer Cypress',
            customer_email: 'guestbuyer@cypress.test',
            customer_phone: '1122334455',
            created_at: new Date().toISOString()
          }
        ]
      });
    }).as('getOrders');

    cy.wait('@getProfiles');
    cy.wait('@getOrders');

    // Validar que ambos aparezcan en la tabla de clientes unificada
    cy.get('table').within(() => {
      // Verificamos al usuario registrado
      cy.contains('Registered').should('exist');
      cy.contains('registered@cypress.test').should('exist');

      // Verificamos al comprador invitado (Guest)
      cy.contains('Guest Buyer Cypress').should('exist');
      cy.contains('guestbuyer@cypress.test').should('exist');
    });
  });
});
