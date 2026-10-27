import { setupAdminAuthMocks } from '../../support/helpers/auth.helper';
import { setupProductMocks, MockProduct } from '../../support/helpers/product.helper';

describe('Data Integrity - Tests Adversariales de Persistencia', () => {
  const initialProduct: MockProduct = {
    id: 'prod-001',
    name: 'Módulo Pantalla iPhone 13 OLED',
    slug: 'modulo-pantalla-iphone-13-oled',
    description: 'Pantalla OLED de alta definición para iPhone 13',
    price: 149000,
    cost: 95000,
    stock: 15,
    min_stock_alert: 5,
    sku: 'MOD-IP13-OLED',
    category_id: 'cat-001',
    category_name: 'Repuestos',
    is_active: true,
    tenant_id: 'bba26ccd-59ce-471c-aac0-4c1f5513de3b',
    branch_id: 'branch-1'
  };

  beforeEach(() => {
    setupAdminAuthMocks();
    setupProductMocks([initialProduct]);
  });

  it('Adversarial 1: Intentar un update parcial con un payload vacío ({}) no debe mutar ni destruir la base de datos', () => {
    cy.loginAsAdmin('/arecofix/admin/products/prod-001');

    cy.window().then(async () => {
      const res = await fetch('/rest/v1/products?id=eq.prod-001', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      });
      expect(res.status).to.be.oneOf([200, 204]);
    });

    cy.wait('@updateProduct').then((interception) => {
      const body = typeof interception.request.body === 'string'
        ? JSON.parse(interception.request.body)
        : interception.request.body;

      // El payload resultante no debe tener keys que contengan null
      const nullKeys = Object.keys(body).filter(k => body[k] === null);
      expect(nullKeys.length).to.equal(0);
    });

    // Verificar que los datos en la UI siguen intactos
    cy.visit('/arecofix/admin/products/prod-001');
    cy.get('input[name="name"]').should('have.value', 'Módulo Pantalla iPhone 13 OLED');
    cy.get('input[name="price"]').should('have.value', '149000');
    cy.get('input[name="stock"]').should('have.value', '15');
  });

  it('Adversarial 2: Intentar un update con null explícito en un campo obligatorio debe fallar por validación', () => {
    cy.loginAsAdmin('/arecofix/admin/products/prod-001');

    // Intentar vaciar el nombre (campo requerido NOT NULL en DB y requerido en el formulario)
    cy.get('input[name="name"]').clear();
    cy.contains('button', 'Guardar').click({ force: true });

    // La validación del navegador o formulario debe marcar el campo como inválido
    cy.get('input[name="name"]').then(($input) => {
      const el = $input[0] as HTMLInputElement;
      expect(el.checkValidity()).to.be.false;
    });
  });

  it('Adversarial 3: Realizar 10 updates parciales seguidos sobre el mismo registro: todos los cambios deben coexistir', () => {
    cy.loginAsAdmin('/arecofix/admin/products/prod-001');

    const mutations = [
      { price: 151000 },
      { stock: 16 },
      { cost: 96000 },
      { min_stock_alert: 6 },
      { sku: 'MOD-IP13-OLED-V2' },
      { is_active: false },
      { is_active: true },
      { stock: 25 },
      { cost: 99000 },
      { price: 159000 }
    ];

    mutations.forEach((mutation) => {
      cy.window().then(async () => {
        await fetch('/rest/v1/products?id=eq.prod-001', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(mutation)
        });
      });
      cy.wait('@updateProduct');
    });

    // Al final de todos los updates parciales, los últimos valores deben coexistir sin haber borrado el nombre ni descripción
    cy.visit('/arecofix/admin/products/prod-001');
    cy.get('input[name="name"]').should('have.value', 'Módulo Pantalla iPhone 13 OLED');
    cy.get('input[name="price"]').should('have.value', '159000');
    cy.get('input[name="stock"]').should('have.value', '25');
  });
});
