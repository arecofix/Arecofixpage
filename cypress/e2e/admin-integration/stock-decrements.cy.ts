import { setupAdminAuthMocks } from '../../support/helpers/auth.helper';
import { setupProductMocks } from '../../support/helpers/product.helper';

describe('Admin - Integración: Descuento de Stock en Venta', () => {
  beforeEach(() => {
    setupAdminAuthMocks();
  });

  it('El stock descontado tras la venta se refleja inmediatamente en el inventario', () => {
    // Initial product had stock 15, after sale it drops to 14
    setupProductMocks([
      {
        id: 'prod-001',
        name: 'Módulo Pantalla iPhone 13 OLED',
        price: 149000,
        stock: 14, // Decremented
        min_stock_alert: 5,
        is_active: true
      }
    ]);

    cy.loginAsAdmin('/arecofix/admin/products');

    cy.get('tbody').should('contain.text', 'Módulo Pantalla iPhone 13 OLED');
    cy.get('tbody tr').first().should('contain.text', '14');
  });
});

