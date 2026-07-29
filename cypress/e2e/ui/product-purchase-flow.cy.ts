describe('Verificación Crítica: Flujo de Compra de Producto post-Login', () => {
  const PRODUCT_URL = '/productos/detalle/modulo-ejemplo-123'; // Ajustar a un slug real o interceptar
  const LOGIN_URL = '/login';

  beforeEach(() => {
    // Interceptar peticiones para aislar el flujo
    cy.intercept('GET', '**/rest/v1/products**').as('getProduct');
    
    // Limpiar estado
    cy.clearCookies();
    cy.clearLocalStorage();
  });

  it('Demuestra el bug del Bucle de Login para usuarios sin rol técnico', () => {
    // 1. Visitamos como invitado
    cy.visit(PRODUCT_URL);

    // Vemos el gate de Gremio
    cy.contains('¿Sos técnico?').should('be.visible');
    cy.contains('INGRESAR / REGISTRARSE').should('be.visible');

    // 2. Iniciamos sesión con un usuario común (no gremio)
    // Para simplificar el test, mockeamos el login
    cy.window().then((win) => {
      win.localStorage.setItem('arecofix_profile_mock', JSON.stringify({
        id: '123',
        role: 'user', // ROL NO TÉCNICO
        email: 'test@usuario.com'
      }));
      // Simular sesión de Supabase
      win.localStorage.setItem('sb-mock-auth-token', JSON.stringify({
        session: { user: { id: '123', email: 'test@usuario.com' } }
      }));
    });

    // 3. Volvemos al producto
    cy.visit(PRODUCT_URL);
    
    // El usuario está logueado pero NO es gremio.
    // BUG ACTUAL: Ve el botón de "INGRESAR / REGISTRARSE" otra vez, lo que causa el loop.
    cy.contains('¿Sos técnico?').should('be.visible');
    
    // La prueba pasará si el botón de login sigue ahí a pesar de estar logueado, demostrando el error de UX.
    cy.contains('INGRESAR / REGISTRARSE').should('be.visible');
  });
});
