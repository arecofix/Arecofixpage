import { setupAdminRepairsMocks, buildMockRepair, REPAIR_UUID_1, REPAIR_UUID_2, REPAIR_UUID_3, REPAIR_UUID_4 } from '../../support/helpers/repair.helper';

describe('Admin Repairs — Listado y Visualización de Taller', () => {
  beforeEach(() => {
    setupAdminRepairsMocks([
      buildMockRepair({ id: REPAIR_UUID_1, tracking_code: 'AF-101', repair_number: 101, current_status_id: 1, device_model: 'Samsung Galaxy S21' }),
      buildMockRepair({ id: REPAIR_UUID_2, tracking_code: 'AF-102', repair_number: 102, current_status_id: 2, device_model: 'iPhone 13 Pro', device_type: 'smartphone' }),
      buildMockRepair({ id: REPAIR_UUID_3, tracking_code: 'AF-103', repair_number: 103, current_status_id: 5, device_model: 'Motorola G52' }),
      buildMockRepair({ id: REPAIR_UUID_4, tracking_code: 'AF-104', repair_number: 104, current_status_id: 7, device_model: 'Notebook Lenovo ThinkPad', device_type: 'notebook' })
    ]);
    cy.loginRealAdmin('/admin/repairs');
    cy.get('[data-angular-ready="true"]', { timeout: 15000 }).should('exist');
  });

  it('1. Debe cargar la página del panel de taller con métricas y tabla virtual', () => {
    cy.url().should('include', '/admin/repairs');
    cy.get('h1').should('be.visible').and('contain', 'Taller');

    // Botones de acción principales
    cy.get('a[href="/admin/repairs/new"], a[routerLink="/admin/repairs/new"]')
      .first()
      .should('be.visible');

    cy.get('a[href="/admin/repairs/protocol"], a[routerLink="/admin/repairs/protocol"]')
      .first()
      .should('be.visible');

    // Dashboard BI entry point
    cy.contains(/rentabilidad/i).should('exist');

    // Verificar órdenes en el taller
    cy.contains('AF-101').should('be.visible');
    cy.contains('Samsung Galaxy S21').should('be.visible');
  });

  it('2. Debe filtrar reparaciones por término de búsqueda (código de seguimiento o cliente)', () => {
    cy.get('input[placeholder*="Buscar"]').first().clear().type('AF-102');
    cy.wait(800);

    // Debe mostrar la orden correspondiente
    cy.contains('AF-102').should('be.visible');
    cy.contains('iPhone 13 Pro').should('be.visible');
  });

  it('3. Debe filtrar por tipo de dispositivo en el selector de categorías', () => {
    cy.get('select').first().select('notebook');
    cy.wait(400);

    cy.contains('Notebook Lenovo ThinkPad').should('be.visible');
  });

  it('4. Debe mostrar el badge de estado correspondiente en la grilla', () => {
    cy.contains('#101').should('be.visible');
    cy.contains('AF-101').should('be.visible');
    cy.contains('PENDIENTE DE DIAGNÓSTICO').should('be.visible');
  });
});
