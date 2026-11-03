import { setupAdminRepairsMocks } from '../../support/helpers/repair.helper';

describe('Admin Repairs — Creación y Registro de Orden de Servicio', () => {
  beforeEach(() => {
    setupAdminRepairsMocks();
    cy.loginRealAdmin('/admin/repairs/new');
    cy.get('[data-angular-ready="true"]', { timeout: 15000 }).should('exist');
  });

  it('1. Debe validar campos requeridos y no permitir guardar con formulario vacío', () => {
    cy.contains('button', 'GUARDAR ORDEN').scrollIntoView().click({ force: true });

    // Debe mostrar error de validación
    cy.get('input[name="customer_name"]').should('have.class', 'border-red-500');
  });

  it('2. Debe registrar una nueva orden de servicio completa con accesorios y seguridad', () => {
    const customerName = 'Carlos Gómez';
    const phone = '1123456789';
    const deviceModel = 'Xiaomi Redmi Note 11';
    const issue = 'Cambio de módulo display y limpieza';

    // 1. Datos del cliente
    cy.get('input[name="customer_name"]').first().clear().type(customerName, { delay: 20 });
    cy.get('input[name="customer_phone"]').first().clear().type(phone);
    cy.get('input[name="customer_email"]').first().clear().type('carlos@example.com');

    // 2. Datos del equipo y falla
    cy.get('input[name="device_model"]').first().clear().type(deviceModel);
    cy.get('input[name="imei"]').first().clear().type('865432109876543');
    cy.get('textarea[name="issue_description"]').first().clear().type(issue);

    // 3. Accesorios dejados (Dropdown)
    cy.get('#btn-accesorios-toggle').first().click({ force: true });
    cy.wait(200);
    cy.get('input[name="charger"]').first().check({ force: true });
    cy.get('input[name="case"]').first().check({ force: true });
    cy.get('body').click(0, 0);

    // 4. Seguridad (PIN)
    cy.get('input[name="security_pin"]').first().clear().type('4321');

    // 5. Costos y seña inicial
    cy.get('input[name="estimated_cost"]').first().clear().type('35000');
    cy.get('input[name="deposit_amount"]').first().clear().type('15000');

    // 6. Enviar orden
    cy.contains('button', 'GUARDAR ORDEN').scrollIntoView().click({ force: true });

    // Verificar llamada al RPC
    cy.wait('@rpcSaveRepairOrder').then((interception) => {
      expect(interception.response?.statusCode).to.eq(200);
      const payload = interception.request.body?.p_payload;
      expect(payload).to.exist;
      expect(payload.issue_description).to.eq(issue);
      expect(Number(payload.estimated_cost)).to.eq(35000);
      expect(Number(payload.deposit_amount)).to.eq(15000);
      expect(payload.security_pin).to.eq('4321');
    });

    // Debe redirigir al listado del taller
    cy.url({ timeout: 10000 }).should('include', '/admin/repairs');
  });
});
