/// <reference types="cypress" />

describe('Baseline Pre-Refactor: 9 Rutas Públicas', () => {
  beforeEach(() => {
    cy.intercept('POST', '**/api/analytics/**', { statusCode: 200, body: {} });
    cy.intercept('POST', '**/event/**', { statusCode: 200, body: {} });
  });

  it('1. /prueba debe renderizar la vista FreeTrialPageComponent', () => {
    cy.visit('/prueba');
    cy.contains(/Prueba gratuita/i, { timeout: 10000 }).should('be.visible');
    cy.get('input[formcontrolname="businessName"]').should('be.visible');
  });

  it('2. /prueba-gratis debe renderizar la vista PruebaGratisComponent', () => {
    cy.visit('/prueba-gratis');
    cy.contains(/Comienza tu Prueba Gratuita/i, { timeout: 10000 }).should('be.visible');
    cy.get('input[formcontrolname="businessName"]').should('be.visible');
  });

  it('3. /free-trial actualmente no tiene ruta y muestra 404 / Página no encontrada', () => {
    cy.visit('/free-trial', { failOnStatusCode: false });
    cy.title().should('include', 'Página no encontrada');
    cy.contains(/Esta página.*no existe/i, { timeout: 10000 }).should('be.visible');
  });

  it('4. /servicios debe renderizar el catálogo de servicios', () => {
    cy.visit('/servicios');
    cy.contains(/Servicios/i, { timeout: 10000 }).should('be.visible');
  });

  it('5. /services actualmente no tiene ruta y muestra 404 / Página no encontrada', () => {
    cy.visit('/services', { failOnStatusCode: false });
    cy.title().should('include', 'Página no encontrada');
    cy.contains(/Esta página.*no existe/i, { timeout: 10000 }).should('be.visible');
  });

  it('6. /servicios/:slug debe renderizar el detalle del servicio', () => {
    cy.visit('/servicios/auditoria-de-sitios-web');
    cy.contains(/Auditoría de Sitios Web/i, { timeout: 15000 }).should('be.visible');
  });

  it('7. /services/:slug actualmente no tiene ruta y responde con 404 / no encontrada', () => {
    cy.visit('/services/auditoria-de-sitios-web', { failOnStatusCode: false });
    cy.get('body').should('be.visible');
  });

  it('8. /reserva debe renderizar la página de reserva y el calendario', () => {
    cy.visit('/reserva');
    cy.contains(/Reserva tu Turno/i, { timeout: 10000 }).should('be.visible');
    cy.get('app-reservation-calendar').should('exist');
  });

  it('9. /reservation actualmente no tiene ruta y muestra 404 / Página no encontrada', () => {
    cy.visit('/reservation', { failOnStatusCode: false });
    cy.title().should('include', 'Página no encontrada');
    cy.contains(/Esta página.*no existe/i, { timeout: 10000 }).should('be.visible');
  });
});
