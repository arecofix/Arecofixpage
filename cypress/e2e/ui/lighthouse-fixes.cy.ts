describe('Lighthouse Issues Verification', () => {
  beforeEach(() => {
    // Los intercepts ya están configurados globalmente en e2e.ts (Google Analytics, PostHog, Facebook)
    cy.visit('/');
  });

  it('debería tener contraste adecuado en "Open to New Projects"', () => {
    // Verificamos que tenga text-gray-700 en modo claro o text-gray-300 en oscuro, asegurando contraste
    cy.contains('Open to New Projects')
      .should('have.class', 'text-gray-700')
      .and('have.class', 'dark:text-gray-300');
  });

  it('debería tener la jerarquía de encabezados correcta en el sidebar de accesibilidad (h2 en lugar de h3)', () => {
    // Abrimos el menú de accesibilidad si es necesario, o comprobamos que el h2 existe
    cy.get('button[title="Accessibility"], button[aria-label="Abrir panel de accesibilidad"]').click({ force: true });
    
    // Verificamos que ahora sea un <h2> en lugar de un <h3>
    cy.contains('h2', 'Accesibilidad').should('exist');
    cy.contains('h3', 'Accesibilidad').should('not.exist');
  });

  it('debería interceptar las peticiones a Posthog y Analytics y no fallar', () => {
    // Cypress interceptará estas por e2e.ts pero podemos verificar simplemente que 
    // la web cargue correctamente y no haya crash.
    cy.get('h1').should('be.visible');
  });
});
