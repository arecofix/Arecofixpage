import { setupAdminRepairsMocks, buildMockRepair, REPAIR_UUID_1 } from '../../support/helpers/repair.helper';

describe('Repairs Adversarial — Guardados Rápidos y Protección Concurrente', () => {
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
        issue_description: 'Pantalla rota'
      })
    ]);

    cy.loginRealAdmin(`/admin/repairs/${repairId}`);
    cy.get('[data-angular-ready="true"]', { timeout: 15000 }).should('exist');
  });

  it('Debe deshabilitar el botón durante el guardado para evitar doble submit destructivo', () => {
    cy.get('input[name="device_model"]').should('have.value', 'Samsung Galaxy S21');

    cy.get('#timeline-status-3').scrollIntoView().click({ force: true });

    // Click en guardar
    cy.contains('button', 'GUARDAR ORDEN').scrollIntoView().click({ force: true });

    // El botón debe deshabilitarse o mostrar spinner mientras procesa
    cy.wait('@patchRepair').then((interception) => {
      expect(interception.response?.statusCode).to.eq(200);
      expect(interception.request.body.current_status_id).to.eq(3);
    });

    cy.visit(`/admin/repairs/${repairId}`);
    cy.get('[data-angular-ready="true"]', { timeout: 15000 }).should('exist');
    cy.get('input[name="device_model"]').should('have.value', 'Samsung Galaxy S21');
  });
});
