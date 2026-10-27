import { setupPublicTrackingMocks } from '../../support/helpers/repair.helper';

describe('Public Tracking — Consulta Pública y Búsqueda de Ficha', () => {
  beforeEach(() => {
    // Intercept tenant check
    cy.intercept('GET', '**/rest/v1/tenants*', {
      statusCode: 200,
      body: [{ id: 'bba26ccd-59ce-471c-aac0-4c1f5513de3b', name: 'Arecofix', is_active: true, custom_domain: 'localhost' }]
    }).as('tenantCheck');
  });

  it('1. Debe mostrar el formulario de consulta pública en /tracking', () => {
    cy.visit('/tracking');
    cy.get('h2').contains('Seguimiento de Reparación').should('be.visible');

    // Campo de entrada y botón de consulta
    cy.get('input[aria-label="Código de seguimiento"]').should('be.visible');
    cy.get('button[aria-label="Consultar el estado de reparación"]').should('be.disabled');
  });

  it('2. Debe permitir escribir el código y redirigir automáticamente a /tracking/:code', () => {
    setupPublicTrackingMocks('AF-101');
    cy.visit('/tracking');
    cy.wait('@tenantCheck');

    cy.get('input[aria-label="Código de seguimiento"]').should('be.visible').clear().type('AF-101', { delay: 30 });
    cy.get('button[aria-label="Consultar el estado de reparación"]').should('not.be.disabled').click();

    cy.url().should('include', '/tracking/AF-101');
  });

  it('3. Debe mostrar mensaje de error y botón de WhatsApp si el código no existe', () => {
    setupPublicTrackingMocks('AF-101');
    cy.visit('/tracking/AF-NONEXISTENT');

    cy.wait('@getRepairTrackingRpc');
    cy.contains('No se encontró ninguna reparación con este código').should('be.visible');
    cy.contains('Soporte Directo').should('be.visible');
  });
});
