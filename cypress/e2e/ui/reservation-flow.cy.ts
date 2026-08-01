/// <reference types="cypress" />

describe('Flujo de Reserva de Turno (Reservation Calendar)', () => {
  beforeEach(() => {
    cy.clearLocalStorage();
    cy.clearCookies();
    
    // Mock the window.open to prevent actually opening WhatsApp in the browser
    cy.on('window:before:load', (win) => {
      cy.stub(win, 'open').as('windowOpen');
    });
  });

  it('Debería permitir seleccionar un turno y confirmar exitosamente', () => {
    // 1. Visit the landing page where the calendar is present
    cy.visit('/celular');

    // 2. Intercept the database insertions
    cy.intercept('POST', '**/rest/v1/contact_messages', {
      statusCode: 201,
      body: []
    }).as('postContactMessage');

    cy.intercept('POST', '**/rest/v1/notifications', {
      statusCode: 201,
      body: []
    }).as('postNotification');

    // Ensure the calendar is visible
    cy.get('app-reservation-calendar').should('be.visible').scrollIntoView();

    // 3. Step 1: Select a valid future or current date
    // Para no tener problemas de fechas pasadas al final del mes, avanzamos al siguiente mes
    cy.get('app-reservation-calendar button').filter(':has(svg path[d="M9 5l7 7-7 7"])').click({ force: true });
    
    // Y elegimos el día 15
    cy.get('app-reservation-calendar .grid.grid-cols-7 button')
      .not('[disabled]')
      .contains('15')
      .click({ force: true });

    // 4. Step 2: Select a time slot
    cy.get('app-reservation-calendar').contains('Selecciona tu Horario').should('be.visible');
    cy.get('app-reservation-calendar button').contains(':00').first().click(); // click on a time like "10:00"

    // 5. Step 3: Fill the form
    cy.get('app-reservation-calendar').contains('Completa tus Datos y Confirma').should('be.visible');
    
    cy.get('app-reservation-calendar input[name="name"]').clear().type('Juan Perez', { delay: 50 }).should('have.value', 'Juan Perez');
    cy.get('app-reservation-calendar input[name="phone"]').clear().type('1122334455', { delay: 50 }).should('have.value', '1122334455');
    cy.get('app-reservation-calendar input[name="deviceModel"]').clear().type('iPhone 13 Pro', { delay: 50 }).should('have.value', 'iPhone 13 Pro');
    cy.get('app-reservation-calendar input[name="issueDescription"]').clear().type('Pantalla rota', { delay: 50 }).should('have.value', 'Pantalla rota');

    // Accept terms
    cy.get('app-reservation-calendar input[type="checkbox"]').check({ force: true });

    // 6. Submit the reservation
    cy.get('app-reservation-calendar button').contains('Confirmar Turno').click();

    // 7. Verify API calls
    cy.wait('@postContactMessage').its('request.body').should('include', {
      name: 'Juan Perez',
      phone: '1122334455',
      subject: 'Solicitud de Turno: Reparación'
    });

    cy.wait('@postNotification');

    // 8. Verify WhatsApp redirect
    cy.get('@windowOpen').should('have.been.calledWithMatch', /wa\.me\/.*text=.*iPhone%2013%20Pro/);

    // 9. Verify success toast
    cy.contains('¡Turno reservado!').should('be.visible');
  });
});
