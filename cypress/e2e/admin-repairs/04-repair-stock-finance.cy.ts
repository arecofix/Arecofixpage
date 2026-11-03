import { setupAdminRepairsMocks, buildMockRepair, REPAIR_UUID_1 } from '../../support/helpers/repair.helper';

describe('Admin Repairs — Finanzas, Repuestos y Eventos de Facturación', () => {
  const repairId = REPAIR_UUID_1;

  beforeEach(() => {
    setupAdminRepairsMocks([
      buildMockRepair({
        id: repairId,
        tracking_code: 'AF-201',
        repair_number: 201,
        current_status_id: 3,
        estimated_cost: 60000,
        final_cost: 60000,
        deposit_amount: 20000,
        technical_labor_cost: 30000
      })
    ]);
    cy.loginRealAdmin(`/admin/repairs/${repairId}`);
    cy.get('[data-angular-ready="true"]', { timeout: 15000 }).should('exist');
  });

  it('1. Debe calcular automáticamente el saldo pendiente (Total - Seña)', () => {
    // Presupuesto 60000, Seña 20000 -> Saldo debe ser 40000
    cy.contains('$ 40000').should('exist');

    // Cambiar seña a 30000
    cy.get('input[name="deposit_amount"]').first().clear().type('30000');
    cy.wait(300);

    // Saldo debe actualizarse a 30000
    cy.contains('$ 30000').should('exist');
  });

  it('2. Al pasar a Listo para Retirar (5) debe habilitar el botón de facturación', () => {
    cy.get('#timeline-status-5').scrollIntoView().click({ force: true });

    // Botón de generar factura
    cy.get('app-generate-invoice-button', { timeout: 5000 }).should('exist');
  });
});
