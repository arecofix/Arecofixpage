describe('Verificación Crítica: Flujo de Compra de Producto post-Login', () => {
  const PRODUCT_URL = '/productos/detalle/modulo-ejemplo-123'; // Ajustar a un slug real o interceptar

  beforeEach(() => {
    cy.intercept('GET', '**/rest/v1/products**').as('getProduct');
    
    // Limpiar estado
    cy.clearCookies();
    cy.clearLocalStorage();
  });

  it('Demuestra el nuevo flujo UX: Captura de Lead y Compra Autónoma', () => {
    // 1. Visitamos como invitado
    cy.visit(PRODUCT_URL);

    // Vemos el Call to Action para loguearse (Captura de Lead)
    cy.contains('Iniciá sesión para ver precios', { matchCase: false }).should('be.visible');
    cy.contains('INICIA SESIÓN O REGÍSTRATE', { matchCase: false }).should('be.visible');

    // 2. Iniciamos sesión con un usuario común
    // Para simplificar el test, mockeamos el login
    cy.window().then((win) => {
      // Simular sesión de Supabase con el project ID real
      win.localStorage.setItem('sb-jftiyfnnaogmgvksgkbn-auth-token', JSON.stringify({
        provider_token: null,
        access_token: 'fake-access-token',
        expires_in: 3600,
        expires_at: Math.floor(Date.now() / 1000) + 3600,
        refresh_token: 'fake-refresh-token',
        token_type: 'bearer',
        user: { 
          id: '123', 
          email: 'test@usuario.com', 
          aud: 'authenticated', 
          role: 'authenticated', 
          created_at: new Date().toISOString() 
        }
      }));
      win.localStorage.setItem('arecofix_current_branch_id', 'branch-1');
    });

    // Añadir mocks para la sesión autenticada
    cy.intercept('GET', '**/auth/v1/user', {
      statusCode: 200,
      body: { id: '123', email: 'test@usuario.com' }
    }).as('getUser');

    cy.intercept('GET', '**/rest/v1/profiles*', {
      statusCode: 200,
      body: { id: '123', email: 'test@usuario.com', role: 'user', first_name: 'Test', is_active: true, tenant_id: 'bba26ccd-59ce-471c-aac0-4c1f5513de3b' }
    }).as('getProfile');

    // 3. Volvemos al producto
    cy.visit(PRODUCT_URL);
    
    // El usuario está logueado, por lo que debería ver directamente el precio y el botón de comprar.
    // Ya no debe ver el mensaje de iniciar sesión.
    cy.contains('Iniciá sesión para ver precios', { matchCase: false }).should('not.exist');
    cy.contains('INICIA SESIÓN O REGÍSTRATE', { matchCase: false }).should('not.exist');
    
    // La prueba pasará si el bloque de precios y botón de comprar están visibles
    cy.contains('Precio Web Autogestionado', { matchCase: false }).should('be.visible');
    cy.contains('AGREGAR AL CARRITO', { matchCase: false }).should('be.visible');
  });
});
