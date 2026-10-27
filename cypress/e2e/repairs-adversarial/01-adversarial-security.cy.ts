import { setupPublicTrackingMocks } from '../../support/helpers/repair.helper';

describe('Repairs Adversarial — Seguridad y Control de Acceso', () => {
  it('1. Debe denegar el acceso a /admin/repairs a usuarios no autenticados', () => {
    // Visitar sin sesión activa
    cy.visit('/admin/repairs');
    cy.url({ timeout: 10000 }).should('include', '/login');
  });

  it('2. Debe denegar el acceso a /admin/repairs/new a usuarios no autenticados', () => {
    cy.visit('/admin/repairs/new');
    cy.url({ timeout: 10000 }).should('include', '/login');
  });

  it('3. Debe sanitizar códigos con espacios y minúsculas en el buscador de seguimiento', () => {
    cy.intercept('GET', '**/rest/v1/tenants*', {
      statusCode: 200,
      body: [{ id: 'bba26ccd-59ce-471c-aac0-4c1f5513de3b', name: 'Arecofix', is_active: true, custom_domain: 'localhost' }]
    }).as('tenantCheck');

    setupPublicTrackingMocks('AF-101');
    cy.visit('/tracking');

    // Escribir con espacios y minúsculas
    cy.get('input[aria-label="Código de seguimiento"]').type('   af-101   ');
    cy.get('button[aria-label="Consultar el estado de reparación"]').click();

    // La URL debe estar limpia en mayúsculas
    cy.url().should('include', '/tracking/AF-101');
  });
});
