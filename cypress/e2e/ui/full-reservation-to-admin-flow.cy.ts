describe('Full Reservation to Admin Flow', () => {
  beforeEach(() => {
    cy.clearLocalStorage();
    cy.clearCookies();
    
    // Mock the window.open to prevent actually opening WhatsApp in the browser
    cy.on('window:before:load', (win) => {
      cy.stub(win, 'open').as('windowOpen');
    });
  });

  it('Debería crear una reserva y visualizarla en el panel de admin', () => {
    const mockReservation = {
      id: 'mock-reservation-123',
      name: 'Carlos Test',
      phone: '1122334455',
      subject: 'Solicitud de Turno: Reparación',
      message: 'Equipo: iPhone 13 Pro\nFalla: Pantalla rota\nFecha: 2026-08-15\nHora: 10:00\n\nReserva de turno generada desde el calendario.',
      is_read: false,
      created_at: new Date().toISOString(),
      tenant_id: 'bba26ccd-59ce-471c-aac0-4c1f5513de3b'
    };

    // --- STEP 1: PUBLIC FLOW ---
    cy.visit('/celular');

    cy.intercept('POST', '**/rest/v1/contact_messages', {
      statusCode: 201,
      body: [mockReservation]
    }).as('postContactMessage');

    cy.intercept('POST', '**/rest/v1/notifications', {
      statusCode: 201,
      body: []
    }).as('postNotification');

    cy.get('app-reservation-calendar').should('be.visible').scrollIntoView();

    // Select next month, 15th (to avoid issues if it's the end of the month)
    cy.get('app-reservation-calendar button').filter(':has(svg path[d="M9 5l7 7-7 7"])').click({ force: true });
    cy.get('app-reservation-calendar .grid.grid-cols-7 button')
      .not('[disabled]')
      .contains('15')
      .click({ force: true });

    cy.get('app-reservation-calendar button').contains(':00').first().click(); // click on a time like "10:00"

    // Fill form
    cy.get('app-reservation-calendar input[name="name"]').clear().type('Carlos Test', { delay: 50 });
    cy.get('app-reservation-calendar input[name="phone"]').clear().type('1122334455', { delay: 50 });
    cy.get('app-reservation-calendar input[name="deviceModel"]').clear().type('iPhone 13 Pro', { delay: 50 });
    cy.get('app-reservation-calendar input[name="issueDescription"]').clear().type('Pantalla rota', { delay: 50 });

    cy.get('app-reservation-calendar input[type="checkbox"]').check({ force: true });

    cy.get('app-reservation-calendar button').contains('Confirmar Turno').click();

    cy.wait('@postContactMessage').its('request.body').should('include', {
      name: 'Carlos Test',
      phone: '1122334455',
      subject: 'Solicitud de Turno: Reparación'
    });
    
    cy.contains('¡Turno reservado!').should('be.visible');

    // --- STEP 2: ADMIN FLOW ---
    cy.loginAsAdmin();
    
    cy.intercept('GET', '**/rest/v1/contact_messages*', {
      statusCode: 200,
      body: [mockReservation]
    }).as('getContactMessages');

    cy.visit('/admin/reservations');
    
    cy.wait('@getContactMessages');
    
    // Check if the reservation is displayed in the UI
    cy.contains('Carlos Test').should('be.visible');
    cy.contains('Pantalla rota').should('be.visible');
    cy.contains('iPhone 13 Pro').should('be.visible');
  });
});
