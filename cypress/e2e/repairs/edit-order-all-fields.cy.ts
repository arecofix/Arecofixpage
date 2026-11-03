import { setupAdminRepairsMocks, buildMockRepair, REPAIR_UUID_1 } from '../../support/helpers/repair.helper';

describe('Repairs E2E — Edición de Todos los Campos Simultáneamente', () => {
  const repairId = REPAIR_UUID_1;

  beforeEach(() => {
    setupAdminRepairsMocks([
      buildMockRepair({
        id: repairId,
        tracking_code: 'AF-101',
        repair_number: 101,
        current_status_id: 1,
        customer_name: 'Juan Pérez',
        customer_phone: '+54 11 2233-4455',
        device_model: 'Samsung Galaxy S21',
        issue_description: 'Pantalla rota sin imagen'
      })
    ]);

    cy.loginRealAdmin(`/admin/repairs/${repairId}`);
    cy.get('[data-angular-ready="true"]', { timeout: 15000 }).should('exist');
  });

  it('1. Debe guardar cambios en múltiples campos y mantener device_model intacto', () => {
    // Verificar estado inicial
    cy.get('input[name="device_model"]').should('have.value', 'Samsung Galaxy S21');

    // Modificar falla declarada (issue_description)
    cy.get('textarea[name="issue_description"]').clear().type('Falla intermitente en táctil y pantalla - Reemplazo urgente');

    // Modificar costo estimado
    cy.get('input[name="estimated_cost"]').first().clear().type('52000');

    // Modificar notas técnicas
    cy.get('textarea[name="technician_notes"]').clear().type('Módulo instalado y sellado con pegamento T7000');

    // Modificar informe técnico
    cy.get('textarea[name="technical_report"]').clear().type('Equipo testeado 24hs en banco de pruebas');

    // Cambiar estado a Listo para retirar (Paso 5)
    cy.get('#timeline-status-5').scrollIntoView().click({ force: true });

    // Guardar
    cy.contains('button', 'GUARDAR ORDEN').scrollIntoView().click({ force: true });

    // Verificar llamada PATCH
    cy.wait('@patchRepair').then((interception) => {
      expect(interception.response?.statusCode).to.eq(200);
      expect(interception.request.body.current_status_id).to.eq(5);
      expect(interception.request.body.technician_notes).to.contain('Módulo instalado');
      expect(interception.request.body.technical_report).to.contain('Equipo testeado');
      expect(interception.request.body.device_id).not.to.equal(null);
    });

    cy.url({ timeout: 10000 }).should('include', '/admin/repairs');

    // Reabrir orden y verificar que TODOS los campos persisten correctamente
    cy.visit(`/admin/repairs/${repairId}`);
    cy.get('[data-angular-ready="true"]', { timeout: 15000 }).should('exist');

    cy.get('input[name="device_model"]').should('have.value', 'Samsung Galaxy S21');
    cy.get('textarea[name="issue_description"]').should('contain.value', 'Falla intermitente en táctil');
    cy.get('textarea[name="technician_notes"]').should('contain.value', 'Módulo instalado');
    cy.get('textarea[name="technical_report"]').should('contain.value', 'Equipo testeado');
    cy.get('#timeline-status-5').find('.border-indigo-600, .border-indigo-500').should('exist');
  });
});
