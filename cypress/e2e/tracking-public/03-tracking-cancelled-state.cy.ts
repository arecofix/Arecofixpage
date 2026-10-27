import { setupPublicTrackingMocks, buildMockPublicTracking } from '../../support/helpers/repair.helper';

describe('Public Tracking — Estado Cancelado / Rechazado', () => {
  const trackingCode = 'AF-CANCELLED';

  beforeEach(() => {
    cy.intercept('GET', '**/rest/v1/tenants*', {
      statusCode: 200,
      body: [{ id: 'bba26ccd-59ce-471c-aac0-4c1f5513de3b', name: 'Arecofix', is_active: true, custom_domain: 'localhost' }]
    }).as('tenantCheck');

    const mockDto = buildMockPublicTracking(trackingCode, {
      current_status_id: 7, // CANCELADO
      device_model: 'Moto G32',
      issue_description: 'Placa con cortocircuito irreparable'
    });

    setupPublicTrackingMocks(trackingCode, mockDto);
    cy.visit(`/tracking/${trackingCode}`);
    cy.wait('@getRepairTrackingRpc');
  });

  it('1. Debe mostrar el banner destacado de cancelación de reparación', () => {
    cy.get('#tracking-cancelled-banner').should('be.visible');
    cy.contains('Reparación Cancelada').should('be.visible');
    cy.contains('retiro de tu equipo').should('be.visible');
  });

  it('2. No debe mostrar la barra de progreso técnico cuando la orden fue cancelada', () => {
    cy.get('#tracking-progress-steps').should('not.exist');
  });
});
