describe('Verificación Crítica: Flujo de Compra de Producto post-Login', () => {
  const PRODUCT_URL = '/productos/detalle/modulo-ejemplo-123'; // Ajustar a un slug real o interceptar

  beforeEach(() => {
    // Interceptar peticiones para aislar el flujo
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
    
    // El usuario está logueado, por lo que debería ver directamente el precio y el botón de comprar.
    // Ya no debe ver el mensaje de iniciar sesión.
    cy.contains('Iniciá sesión para ver precios', { matchCase: false }).should('not.exist');
    cy.contains('INICIA SESIÓN O REGÍSTRATE', { matchCase: false }).should('not.exist');
    
    // La prueba pasará si el bloque de precios y botón de comprar están visibles
    cy.contains('Precio Web Autogestionado', { matchCase: false }).should('be.visible');
    cy.contains('AGREGAR AL CARRITO', { matchCase: false }).should('be.visible');
  });
});
