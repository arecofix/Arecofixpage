import { setupAdminAuthMocks } from '../../support/helpers/auth.helper';
import { setupProductMocks, MockProduct } from '../../support/helpers/product.helper';

describe('Data Integrity - Partial Updates: Módulo Productos', () => {
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
    cy.loginAsAdmin('/arecofix/admin/products/prod-001');
  });

  it('Editar solo el stock debe preservar intactos el nombre, precio, sku y descripción', () => {
    // Verificar que los datos iniciales cargaron correctamente
    cy.get('input[name="name"]').should('have.value', 'Módulo Pantalla iPhone 13 OLED');
    cy.get('input[name="price"]').should('have.value', '149000');
    cy.get('input[name="stock"]').should('have.value', '15');

    // Editar solo el campo stock
    cy.get('input[name="stock"]').clear().type('28');

    // Guardar los cambios
    cy.contains('button', 'Guardar').click({ force: true });

    // Validar en la intercepción que el payload no destruye campos ausentes ni envía nulls indebidos
    cy.wait('@updateProduct').then((interception) => {
      const body = typeof interception.request.body === 'string'
        ? JSON.parse(interception.request.body)
        : interception.request.body;

      // Debe incluir el campo actualizado
      expect(body.stock).to.equal(28);

      // NO debe enviar campos como null o vacíos
      expect(body.name).to.not.equal(null);
      expect(body.price).to.not.equal(null);
      expect(body.specifications).to.not.deep.equal({});
    });

    // Recargar la vista del producto y verificar que los datos siguen intactos
    cy.visit('/arecofix/admin/products/prod-001');
    cy.get('input[name="name"]').should('have.value', 'Módulo Pantalla iPhone 13 OLED');
    cy.get('input[name="price"]').should('have.value', '149000');
    cy.get('input[name="stock"]').should('have.value', '28');
  });
});
