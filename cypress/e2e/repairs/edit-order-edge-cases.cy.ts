import { setupAdminRepairsMocks, buildMockRepair, REPAIR_UUID_3 } from '../../support/helpers/repair.helper';

describe('Repairs E2E — Casos Borde y Reglas de Negocio en Edición', () => {
  const repairId = REPAIR_UUID_3;

  beforeEach(() => {
    setupAdminRepairsMocks([
      buildMockRepair({
        id: repairId,
        tracking_code: 'AF-103',
        repair_number: 103,
        current_status_id: 1,
        customer_name: 'Roberto Gómez',
        device_model: 'Motorola Moto G52',
        device_type: 'smartphone',
        issue_description: 'No carga la batería'
      })
    ]);

    cy.loginRealAdmin(`/admin/repairs/${repairId}`);
    cy.get('[data-angular-ready="true"]', { timeout: 15000 }).should('exist');
  });

  it('1. Debe preservar device_model al guardar notas con caracteres especiales y saltos de línea', () => {
    cy.get('input[name="device_model"]').should('have.value', 'Motorola Moto G52');

    const specialNotes = 'Pin de carga tipo C sulfatado.\nLínea VBUS en corto (0.02V).\n¿Repuesto disponible? Sí, stock OK!';
    cy.get('textarea[name="technician_notes"]').clear().type(specialNotes);

    cy.contains('button', 'GUARDAR ORDEN').scrollIntoView().click({ force: true });

    cy.wait('@patchRepair').then((interception) => {
      expect(interception.response?.statusCode).to.eq(200);
      expect(interception.request.body.device_id).not.to.equal(null);
    });

    cy.visit(`/admin/repairs/${repairId}`);
    cy.get('[data-angular-ready="true"]', { timeout: 15000 }).should('exist');

    cy.get('input[name="device_model"]').should('have.value', 'Motorola Moto G52');
    cy.get('textarea[name="technician_notes"]').should('contain.value', 'Pin de carga tipo C');
  });

  it('2. Al cancelar la orden (Paso 7), debe limpiar garantía y preservar device_model', () => {
    // Click en cancelar (Paso 7)
    cy.get('#timeline-status-7').scrollIntoView().click({ force: true });

    cy.contains('button', 'GUARDAR ORDEN').scrollIntoView().click({ force: true });

    cy.wait('@patchRepair').then((interception) => {
      expect(interception.response?.statusCode).to.eq(200);
      expect(interception.request.body.current_status_id).to.eq(7);
      expect(interception.request.body.warranty).to.be.oneOf(['', null]);
    });

    cy.visit(`/admin/repairs/${repairId}`);
    cy.get('[data-angular-ready="true"]', { timeout: 15000 }).should('exist');

    cy.get('input[name="device_model"]').should('have.value', 'Motorola Moto G52');
    cy.get('#timeline-status-7').find('.border-indigo-600, .border-indigo-500').should('exist');
  });
});
