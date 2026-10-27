import { setupAdminRepairsMocks, buildMockRepair, REPAIR_UUID_1 } from '../../support/helpers/repair.helper';

describe('Repairs E2E — Transición de Estados Preserva device_model', () => {
  const repairId = REPAIR_UUID_1;

  beforeEach(() => {
    setupAdminRepairsMocks([
      buildMockRepair({
        id: repairId,
        tracking_code: 'AF-101',
        repair_number: 101,
        current_status_id: 1,
        customer_name: 'Juan Pérez',
        device_model: 'Samsung Galaxy S21',
        issue_description: 'Pantalla rota sin imagen'
      })
    ]);

    cy.loginRealAdmin(`/admin/repairs/${repairId}`);
    cy.get('[data-angular-ready="true"]', { timeout: 15000 }).should('exist');
  });

  it('1. Debe transicionar a En Presupuesto (Paso 2) y conservar device_model', () => {
    cy.get('input[name="device_model"]').should('have.value', 'Samsung Galaxy S21');

    cy.get('#timeline-status-2').scrollIntoView().click({ force: true });
    cy.contains('button', 'GUARDAR ORDEN').scrollIntoView().click({ force: true });

    cy.wait('@patchRepair').then((interception) => {
      expect(interception.request.body.current_status_id).to.eq(2);
    });

    cy.visit(`/admin/repairs/${repairId}`);
    cy.get('[data-angular-ready="true"]', { timeout: 15000 }).should('exist');
    cy.get('input[name="device_model"]').should('have.value', 'Samsung Galaxy S21');
  });

  it('2. Debe transicionar a Control de Calidad (Paso 4) y conservar device_model', () => {
    cy.get('#timeline-status-4').scrollIntoView().click({ force: true });
    cy.contains('button', 'GUARDAR ORDEN').scrollIntoView().click({ force: true });

    cy.wait('@patchRepair').then((interception) => {
      expect(interception.request.body.current_status_id).to.eq(4);
    });

    cy.visit(`/admin/repairs/${repairId}`);
    cy.get('[data-angular-ready="true"]', { timeout: 15000 }).should('exist');
    cy.get('input[name="device_model"]').should('have.value', 'Samsung Galaxy S21');
  });

  it('3. Debe transicionar a Listo para Entregar (Paso 5) y conservar device_model', () => {
    cy.get('#timeline-status-5').scrollIntoView().click({ force: true });
    cy.contains('button', 'GUARDAR ORDEN').scrollIntoView().click({ force: true });

    cy.wait('@patchRepair').then((interception) => {
      expect(interception.request.body.current_status_id).to.eq(5);
    });

    cy.visit(`/admin/repairs/${repairId}`);
    cy.get('[data-angular-ready="true"]', { timeout: 15000 }).should('exist');
    cy.get('input[name="device_model"]').should('have.value', 'Samsung Galaxy S21');
  });
});
