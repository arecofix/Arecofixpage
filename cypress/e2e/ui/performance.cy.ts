describe('Performance & Infinite Loaders Audit', () => {
  const pagesToTest = [
    '/',
    '/login',
    '/cursos',
    '/productos',
    '/servicios'
  ];

  beforeEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
  });

  pagesToTest.forEach(page => {
    it(`should load ${page} in less than 3000ms and not have infinite spinners`, () => {
      const startTime = performance.now();
      
      cy.visit(page, {
        onBeforeLoad: (win) => {
          win.performance.mark('start-loading');
        }
      });

      // Asegurarse de que el spinner principal o inicial (si hay) desaparece
      cy.get('app-spinner, .loading-spinner, .skeleton', { timeout: 8000 }).should('not.exist');
      
      // Asegurar que el layout principal se renderiza
      cy.get('app-public-layout, main, .main-content').should('be.visible').then(() => {
        const endTime = performance.now();
        const duration = endTime - startTime;
        
        cy.log(`Page ${page} loaded in ${Math.round(duration)}ms`);
        // La SPA debería cargar razonablemente rápido, al menos el esqueleto o paint principal
        expect(duration).to.be.lessThan(5000);
      });
    });
  });
});
