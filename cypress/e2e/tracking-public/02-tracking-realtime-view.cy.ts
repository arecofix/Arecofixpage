import { setupPublicTrackingMocks, buildMockPublicTracking } from '../../support/helpers/repair.helper';

describe('Public Tracking — Visualización en Tiempo Real para el Cliente', () => {
  const trackingCode = 'AF-555';

  beforeEach(() => {
    cy.intercept('GET', '**/rest/v1/tenants*', {
      statusCode: 200,
      body: [{ id: 'bba26ccd-59ce-471c-aac0-4c1f5513de3b', name: 'Arecofix', is_active: true, custom_domain: 'localhost' }]
    }).as('tenantCheck');

    const mockDto = buildMockPublicTracking(trackingCode, {
      current_status_id: 3, // En Reparación
      device_model: 'iPhone 13 Pro Max',
      brand_name: 'Apple',
      customer_name: 'Sofía Martínez',
      issue_description: 'Batería inflada y pantalla levantada',
      final_cost: 55000,
      deposit_amount: 15000,
      imei: '358765432109876',
      checklist: { charger: true, battery: false, chip: false, sd: false, case: true },
      technical_report: 'Desarme preventivo realizado. Batería reemplazada por módulo original.'
    });

    setupPublicTrackingMocks(trackingCode, mockDto);
    cy.visit(`/tracking/${trackingCode}`, {
      onBeforeLoad(win) {
        win.localStorage.setItem(`upsellDismissed_${trackingCode}`, 'true');
      }
    });
    cy.wait('@getRepairTrackingRpc');
  });

  it('1. Debe mostrar el estado técnico activo y la barra de progreso en 5 fases', () => {
    cy.get('#tracking-status-card').should('be.visible');
    cy.get('#tracking-status-label').should('contain', 'EN REPARACIÓN');

    // Barra de progreso y pasos
    cy.get('#tracking-progress-steps').should('be.visible');
    cy.get('#tracking-step-1').should('exist');
    cy.get('#tracking-step-2').should('exist');
    cy.get('#tracking-step-3').should('exist');
  });

  it('2. Debe mostrar la información del dispositivo, IMEI y accesorios dejados', () => {
    cy.get('#tracking-device-info').within(() => {
      cy.contains('iPhone 13 Pro Max').should('be.visible');
      cy.contains('Sofía Martínez').should('be.visible');
      cy.contains('358765432109876').should('be.visible');
    });

    // Fila de accesorios
    cy.get('#tracking-checklist-row').should('be.visible');
  });

  it('3. Debe proteger la privacidad de claves mostrando "Registrada en sistema"', () => {
    cy.contains('Registrada en sistema').should('be.visible');
    cy.get('.fa-lock').should('be.visible');
  });

  it('4. Debe mostrar el reporte técnico emitido por el laboratorio', () => {
    cy.get('#tracking-tech-report').should('be.visible');
    cy.contains('Desarme preventivo realizado').should('be.visible');
  });

  it('5. Debe calcular el saldo pendiente y tener botones de descarga de talón y WhatsApp', () => {
    // 55000 total - 15000 seña = 40000 saldo
    cy.get('#tracking-payment-card').should('be.visible').within(() => {
      cy.contains('$40000').should('be.visible');
    });

    // Botones funcionales
    cy.get('#btn-imprimir-talon').should('be.visible').and('contain', 'Descargar Talón');
    cy.get('#btn-chat-whatsapp').should('be.visible');
  });
});
