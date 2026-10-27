import { setupAdminRepairsMocks, buildMockRepair, REPAIR_UUID_1 } from '../../support/helpers/repair.helper';

describe('Admin Repairs — Edición y Línea de Tiempo de Taller', () => {
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

  it('1. Debe cargar los datos existentes de la orden en el formulario', () => {
    cy.url().should('include', `/admin/repairs/${repairId}`);

    // Verificar que los campos vengan poblados
    cy.get('input[name="customer_name"]').should('have.value', 'Juan Pérez');
    cy.get('input[name="device_model"]').should('have.value', 'Samsung Galaxy S21');

    // Estado inicial en la línea de tiempo: 1 activo
    cy.get('#timeline-status-1').find('.border-indigo-600, .border-indigo-500').should('exist');
  });

  it('2. Debe transicionar el estado técnico usando la línea de tiempo interactiva', () => {
    // Click en paso 3: En Reparación
    cy.get('#timeline-status-3').scrollIntoView().click({ force: true });
    cy.wait(300);

    // El paso 3 debe quedar activo
    cy.get('#timeline-status-3').find('.border-indigo-600, .border-indigo-500').should('exist');

    // Guardar cambios
    cy.contains('button', 'GUARDAR ORDEN').scrollIntoView().click({ force: true });

    // Verificar petición PATCH
    cy.wait('@patchRepair').then((interception) => {
      expect(interception.response?.statusCode).to.eq(200);
      expect(interception.request.body.current_status_id).to.eq(3);
    });

    cy.url({ timeout: 10000 }).should('include', '/admin/repairs');
  });

  it('3. Debe permitir actualizar el informe técnico y costos finales', () => {
    // Modificar presupuesto estimado (el cual calcula dinámicamente final_cost)
    cy.get('input[name="estimated_cost"]').first().clear().type('48000');

    // Click en paso 5: Listo para entregar
    cy.get('#timeline-status-5').scrollIntoView().click({ force: true });

    cy.contains('button', 'GUARDAR ORDEN').scrollIntoView().click({ force: true });

    cy.wait('@patchRepair').then((interception) => {
      expect(interception.response?.statusCode).to.eq(200);
      expect(Number(interception.request.body.final_cost)).to.eq(48000);
      expect(interception.request.body.current_status_id).to.eq(5);
    });
  });
});
