import { setupAdminRepairsMocks } from '../../support/helpers/repair.helper';

describe('Repairs Adversarial — Integridad y Resiliencia de Datos', () => {
  beforeEach(() => {
    setupAdminRepairsMocks();
    cy.loginRealAdmin('/admin/repairs/new');
    cy.get('[data-angular-ready="true"]', { timeout: 15000 }).should('exist');
  });

  it('1. Debe rechazar nombres de clientes inválidos por longitud mínima o vacíos', () => {
    // 1. Menos de 3 caracteres viola minLength(3)
    cy.get('input[name="customer_name"]').type('ab').blur();
    cy.get('input[name="customer_name"]').should('have.class', 'border-red-500');

    // 2. Vacío viola required
    cy.get('input[name="customer_name"]').clear().blur();
    cy.get('input[name="customer_name"]').should('have.class', 'border-red-500');
  });

  it('2. Debe procesar de forma segura descripciones con caracteres especiales y payloads HTML', () => {
    const maliciousPayload = '<script>alert("xss")</script> & <div class="evil">Falla</div>';

    cy.get('input[name="customer_name"]').type('Cliente Seguro');
    cy.get('input[name="device_model"]').type('Equipo Test');
    cy.get('textarea[name="issue_description"]').type(maliciousPayload);

    cy.contains('button', 'GUARDAR ORDEN').scrollIntoView().click({ force: true });

    cy.wait('@rpcSaveRepairOrder').then((interception) => {
      expect(interception.response?.statusCode).to.eq(200);
      expect(interception.request.body.p_payload.issue_description).to.include('alert("xss")');
    });

    cy.url({ timeout: 10000 }).should('include', '/admin/repairs');
  });
});
