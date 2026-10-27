import { setupAdminRepairsMocks, buildMockRepair, REPAIR_UUID_2 } from '../../support/helpers/repair.helper';

describe('Repairs E2E — Edición Explícita de Modelo del Equipo', () => {
  const repairId = REPAIR_UUID_2;

  beforeEach(() => {
    setupAdminRepairsMocks([
      buildMockRepair({
        id: repairId,
        tracking_code: 'AF-102',
        repair_number: 102,
        current_status_id: 2,
        customer_name: 'María González',
        device_model: 'iPhone 13 Pro',
        device_type: 'smartphone',
        issue_description: 'Batería inflada y tapa despegada'
      })
    ]);

    cy.loginRealAdmin(`/admin/repairs/${repairId}`);
    cy.get('[data-angular-ready="true"]', { timeout: 15000 }).should('exist');
  });

  it('1. Debe permitir modificar el modelo del equipo y guardar el nuevo valor', () => {
    cy.get('input[name="device_model"]').should('have.value', 'iPhone 13 Pro');

    // Cambiar modelo a iPhone 14 Pro Max
    cy.get('input[name="device_model"]').clear().type('iPhone 14 Pro Max');

    // Guardar
    cy.contains('button', 'GUARDAR ORDEN').scrollIntoView().click({ force: true });

    // Verificar que el servicio y PATCH reciban el nuevo modelo
    cy.wait('@patchRepair').then((interception) => {
      expect(interception.response?.statusCode).to.eq(200);
      expect(interception.request.body.device_id).not.to.equal(null);
    });

    cy.url({ timeout: 10000 }).should('include', '/admin/repairs');

    // Reabrir la orden para verificar persistencia del nuevo modelo
    cy.visit(`/admin/repairs/${repairId}`);
    cy.get('[data-angular-ready="true"]', { timeout: 15000 }).should('exist');

    cy.get('input[name="device_model"]').should('have.value', 'iPhone 14 Pro Max');
  });

  it('2. Debe permitir cambiar marca y modelo de forma coordinada', () => {
    cy.get('select[name="brand_id"]').select('Samsung');
    cy.get('input[name="device_model"]').clear().type('Samsung Galaxy S24 Ultra');

    cy.contains('button', 'GUARDAR ORDEN').scrollIntoView().click({ force: true });

    cy.wait('@patchRepair').then((interception) => {
      expect(interception.response?.statusCode).to.eq(200);
    });

    cy.visit(`/admin/repairs/${repairId}`);
    cy.get('[data-angular-ready="true"]', { timeout: 15000 }).should('exist');

    cy.get('input[name="device_model"]').should('have.value', 'Samsung Galaxy S24 Ultra');
  });
});
