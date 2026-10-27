import { setupAdminRepairsMocks, buildMockRepair, REPAIR_UUID_1 } from '../../support/helpers/repair.helper';

describe('Repairs Adversarial — Validación de Campos Vacíos y Obligatorios', () => {
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

  it('1. Debe bloquear el guardado si el operador borra el modelo del equipo (campo obligatorio)', () => {
    cy.get('input[name="device_model"]').should('have.value', 'Samsung Galaxy S21');

    // Vaciar el campo
    cy.get('input[name="device_model"]').clear();

    // Intentar guardar
    cy.contains('button', 'GUARDAR ORDEN').scrollIntoView().click({ force: true });

    // Mensaje de error de validación visible
    cy.contains('El modelo es obligatorio.').should('be.visible');

    // No debe haberse disparado la petición PATCH
    cy.get('@patchRepair.all').should('have.length', 0);
  });

  it('2. Debe permitir guardar con campos opcionales vacíos sin degradar device_model', () => {
    // Vaciar campos opcionales
    cy.get('input[name="customer_email"]').clear();
    cy.get('input[name="customer_dni"]').clear();
    cy.get('input[name="imei"]').clear();

    cy.get('#timeline-status-2').scrollIntoView().click({ force: true });
    cy.contains('button', 'GUARDAR ORDEN').scrollIntoView().click({ force: true });

    cy.wait('@patchRepair').then((interception) => {
      expect(interception.response?.statusCode).to.eq(200);
      expect(interception.request.body.device_id).not.to.equal(null);
    });

    cy.visit(`/admin/repairs/${repairId}`);
    cy.get('[data-angular-ready="true"]', { timeout: 15000 }).should('exist');

    cy.get('input[name="device_model"]').should('have.value', 'Samsung Galaxy S21');
  });
});
