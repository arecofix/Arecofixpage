import { setupAdminRepairsMocks, buildMockRepair, REPAIR_UUID_1 } from '../../support/helpers/repair.helper';

describe('Repairs Adversarial — Edición Repetida Múltiples Veces', () => {
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

  it('Debe mantener device_model a lo largo de 5 ciclos consecutivos de edición y guardado', () => {
    const statuses = [2, 3, 4, 5, 6];

    statuses.forEach((statusId, index) => {
      // 1. Verificar que device_model sigue presente
      cy.get('input[name="device_model"]').should('have.value', 'Samsung Galaxy S21');

      // 2. Modificar notas técnicas para este ciclo
      cy.get('textarea[name="technician_notes"]').clear().type(`Ciclo ${index + 1}: Actualización de estado a ${statusId}`);

      // 3. Cambiar estado
      cy.get(`#timeline-status-${statusId}`).scrollIntoView().click({ force: true });

      // 4. Guardar
      cy.contains('button', 'GUARDAR ORDEN').scrollIntoView().click({ force: true });

      // 5. Esperar PATCH y verificar que device_id nunca sea null
      cy.wait('@patchRepair').then((interception) => {
        expect(interception.response?.statusCode).to.eq(200);
        expect(interception.request.body.device_id).not.to.equal(null);
      });

      // 6. Recargar/Revisitar orden para el siguiente ciclo
      cy.visit(`/admin/repairs/${repairId}`);
      cy.get('[data-angular-ready="true"]', { timeout: 15000 }).should('exist');

      // 7. Re-verificar device_model
      cy.get('input[name="device_model"]').should('have.value', 'Samsung Galaxy S21');
    });
  });
});
