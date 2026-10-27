import { setupAdminAuthMocks } from '../../support/helpers/auth.helper';
import { setupProductMocks, MockProduct } from '../../support/helpers/product.helper';

describe('Admin - Adversarial: Resiliencia de Productos', () => {
  beforeEach(() => {
    setupAdminAuthMocks();
  });

  it('No rompe el layout con nombres extremadamente largos o caracteres especiales', () => {
    const longName = '📱 Super Pantalla Ultra Retina 4K HDR Plus Pro Max '.repeat(10);
    const mockProducts: MockProduct[] = [
      {
        id: 'prod-adv-1',
        name: longName,
        price: 999999,
        stock: 50,
        is_active: true
      }
    ];

    setupProductMocks(mockProducts);
    cy.loginAsAdmin('/arecofix/admin/products');

    cy.get('table').should('be.visible');
    cy.get('tbody tr').should('have.length', 1);
    cy.get('tbody').should('contain.text', 'Super Pantalla');
  });

  it('Sanitiza inputs con intentos de XSS en la búsqueda sin ejecutar scripts', () => {
    setupProductMocks();
    cy.loginAsAdmin('/arecofix/admin/products');

    const xssPayload = '<script>window.__xss_executed=true</script>';
    cy.get('input[placeholder*="Buscar"]').type(xssPayload);

    cy.window().then((win: any) => {
      expect(win.__xss_executed).to.be.undefined;
    });
  });

  it('Maneja 100 productos en lista sin desbordar ni congelar la interfaz', () => {
    const heavyList: MockProduct[] = Array.from({ length: 100 }, (_, i) => ({
      id: `prod-heavy-${i}`,
      name: `Producto Heavy #${i}`,
      price: 1000 + i * 10,
      stock: 10 + i,
      is_active: true
    }));

    setupProductMocks(heavyList);
    cy.loginAsAdmin('/arecofix/admin/products');

    cy.get('table').should('be.visible');
    cy.get('tbody tr').should('have.length.at.least', 10);
  });
});
