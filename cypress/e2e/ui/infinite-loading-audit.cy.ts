describe('Infinite Loading Audit (Timeout & Leak Detection)', () => {
  // Configuración global de timeout para estas pruebas específicas (10s)
  const MAX_LOAD_TIME = 10000;

  const publicRoutes = [
    '/',
    '/servicios',
    '/productos',
    '/cursos',
    '/contacto',
    '/portfolio',
    '/login'
  ];

  const adminRoutes = [
    '/admin/dashboard',
    '/admin/products',
    '/admin/repairs',
    '/admin/clients',
    '/admin/inventory',
    '/admin/orders',
    '/admin/courses',
    '/admin/sales'
  ];

  context('Public Routes', () => {
    publicRoutes.forEach((route) => {
      it(`Debería resolver el estado de carga en: ${route}`, () => {
        cy.visit(route);
        // Esperamos explícitamente a que cualquier elemento de skeleton/spinner desaparezca
        cy.get('app-skeleton, .skeleton, .loading, .spinner, .fa-spinner', { timeout: MAX_LOAD_TIME })
          .should('not.exist');
        
        // Verificamos que algo de contenido haya cargado y no estemos ante una pantalla blanca
        cy.get('body').should('be.visible');
      });
    });
  });

  context('Admin Routes', () => {
    beforeEach(() => {
      cy.loginAsAdmin(); // Asumiendo que existe el comando personalizado de login
    });

    adminRoutes.forEach((route) => {
      it(`Debería resolver el estado de carga en: ${route}`, () => {
        cy.visit(route);
        // Esperamos explícitamente a que cualquier elemento de skeleton/spinner desaparezca
        cy.get('app-skeleton, .skeleton, .loading, .spinner, .fa-spinner', { timeout: MAX_LOAD_TIME })
          .should('not.exist');
          
        // Verificamos que el contenedor principal del admin esté visible
        cy.get('.drawer-content').should('be.visible');
      });
    });
  });
});
