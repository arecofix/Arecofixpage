import { setupAdminRepairsMocks, buildMockRepair, REPAIR_UUID_1 } from '../../support/helpers/repair.helper';

describe('Repairs E2E — Edición de Orden Preserva Campos (Bug Principal)', () => {
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
        device_model: 'iPhone 13',
        device_type: 'smartphone',
        issue_description: 'Pantalla rota sin imagen tras golpe'
      })
    ]);

    cy.loginRealAdmin(`/admin/repairs/${repairId}`);
    cy.get('[data-angular-ready="true"]', { timeout: 15000 }).should('exist');
  });

  it('1. Debe mantener device_model intacto al cambiar únicamente el estado de la orden', () => {
    // Verificar que el modelo del equipo cargue con su valor original
    cy.get('input[name="device_model"]').should('have.value', 'iPhone 13');
    cy.get('input[name="customer_name"]').should('have.value', 'Juan Pérez');

    // Cambiar únicamente el estado técnico en la línea de tiempo (Paso 3: En Reparación)
    cy.get('#timeline-status-3').scrollIntoView().click({ force: true });
    cy.wait(200);

    // Guardar cambios
    cy.contains('button', 'GUARDAR ORDEN').scrollIntoView().click({ force: true });

    // Verificar que la petición PATCH NO envie device_id como null ni borre campos
    cy.wait('@patchRepair').then((interception) => {
      expect(interception.response?.statusCode).to.eq(200);
      expect(interception.request.body.current_status_id).to.eq(3);
      expect(interception.request.body.device_id).not.to.equal(null);
    });

    // Navega de regreso al listado
    cy.url({ timeout: 10000 }).should('include', '/admin/repairs');

    // Reabrir la orden para verificar persistencia real
    cy.visit(`/admin/repairs/${repairId}`);
    cy.get('[data-angular-ready="true"]', { timeout: 15000 }).should('exist');

    // CRITICAL ASSERTION: device_model debe permanecer intacto ("iPhone 13")
    cy.get('input[name="device_model"]').should('have.value', 'iPhone 13');
    cy.get('input[name="customer_name"]').should('have.value', 'Juan Pérez');
    cy.get('#timeline-status-3').find('.border-indigo-600, .border-indigo-500').should('exist');
  });

  it('2. Debe mantener device_model al editar solo las notas del técnico', () => {
    cy.get('input[name="device_model"]').should('have.value', 'iPhone 13');

    // Modificar notas técnicas
    cy.get('textarea[name="technician_notes"]').clear().type('Revisión en microscopio: pistas de flex intactas.');

    cy.contains('button', 'GUARDAR ORDEN').scrollIntoView().click({ force: true });

    cy.wait('@patchRepair').then((interception) => {
      expect(interception.response?.statusCode).to.eq(200);
      expect(interception.request.body.technician_notes).to.contain('Revisión en microscopio');
      expect(interception.request.body.device_id).not.to.equal(null);
    });

    // Reabrir orden y verificar que device_model sigue intacto
    cy.visit(`/admin/repairs/${repairId}`);
    cy.get('[data-angular-ready="true"]', { timeout: 15000 }).should('exist');

    cy.get('input[name="device_model"]').should('have.value', 'iPhone 13');
    cy.get('textarea[name="technician_notes"]').should('contain.value', 'Revisión en microscopio');
  });

  it('3. Debe mantener device_model al editar solo el diagnóstico o informe técnico', () => {
    cy.get('input[name="device_model"]').should('have.value', 'iPhone 13');

    cy.get('textarea[name="technical_report"]').clear().type('Prueba de consumo en fuente: 0.15A normal.');

    cy.contains('button', 'GUARDAR ORDEN').scrollIntoView().click({ force: true });

    cy.wait('@patchRepair').then((interception) => {
      expect(interception.response?.statusCode).to.eq(200);
      expect(interception.request.body.technical_report).to.contain('Prueba de consumo');
    });

    cy.visit(`/admin/repairs/${repairId}`);
    cy.get('[data-angular-ready="true"]', { timeout: 15000 }).should('exist');

    cy.get('input[name="device_model"]').should('have.value', 'iPhone 13');
    cy.get('textarea[name="technical_report"]').should('contain.value', 'Prueba de consumo');
  });
});
