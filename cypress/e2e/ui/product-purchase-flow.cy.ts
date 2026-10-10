describe('Verificación Crítica: Flujo de Compra de Producto post-Login', () => {
  const PRODUCT_URL = '/productos/detalle/modulo-ejemplo-123';

  const MOCK_TENANT_ID = 'bba26ccd-59ce-471c-aac0-4c1f5513de3b';

  const mockTenant = {
    id: MOCK_TENANT_ID,
    name: 'Arecofix',
    slug: 'arecofix',
    custom_domain: 'localhost',
    is_active: true,
    features: {
      hasProducts: true,
      hasServices: true,
      hasCourses: true,
      hasRepairs: true,
      hasBlog: true
    }
  };

  const mockProduct = {
    id: 'mock-product-123',
    name: 'Módulo Ejemplo 123',
    slug: 'modulo-ejemplo-123',
    price: 15000,
    stock: 10,
    is_active: true,
    category_id: 'cat-1',
    brand_id: 'brand-1',
    tenant_id: MOCK_TENANT_ID,
    description: 'Descripción de prueba para módulo'
  };

  beforeEach(() => {
    cy.intercept('GET', '**/rest/v1/**', { statusCode: 200, body: [] }).as('catchAllSupabase');

    cy.intercept('GET', '**/rest/v1/tenants*', (req) => {
      const isSingle = String(req.headers['accept'])?.includes('application/vnd.pgrst.object');
      req.reply({ statusCode: 200, body: isSingle ? mockTenant : [mockTenant] });
    }).as('getTenants');

    cy.intercept('GET', '**/rest/v1/products*', (req) => {
      const isSingle = String(req.headers['accept'])?.includes('application/vnd.pgrst.object');
      req.reply({ statusCode: 200, body: isSingle ? mockProduct : [mockProduct] });
    }).as('getProduct');
    
    // Limpiar estado
    cy.clearCookies();
    cy.clearLocalStorage();

    cy.on('window:before:load', (win) => {
      win.localStorage.setItem('arecofix_tenant_id', MOCK_TENANT_ID);
      win.localStorage.setItem('cypress-test', 'true');
    });
  });

  it('Demuestra el nuevo flujo UX: Captura de Lead y Compra Autónoma', () => {
    // 1. Visitamos como invitado
    cy.visit(PRODUCT_URL);

    // Vemos el Call to Action para loguearse (Captura de Lead) o precio según configuración
    cy.get('body').should('be.visible');

    // 2. Iniciamos sesión con un usuario común
    cy.setupCheckoutSession();

    // 3. Volvemos al producto
    cy.visit(PRODUCT_URL);
    
    // El usuario está logueado, por lo que debería ver directamente el producto y botón de comprar
    cy.contains('Módulo Ejemplo 123', { timeout: 10000 }).should('be.visible');
    cy.contains(/agregar al carrito|comprar/i, { timeout: 10000 }).should('be.visible');
  });
});
