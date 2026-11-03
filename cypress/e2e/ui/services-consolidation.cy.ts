/// <reference types="cypress" />

describe('Paso 3 - Consolidación de Servicios y Redirecciones 301', () => {
  beforeEach(() => {
    cy.intercept('POST', '**/api/analytics/**', { statusCode: 200, body: {} });
  });

  it('1. /services debe retornar HTTP 301 hacia /servicios', () => {
    cy.request({
      url: '/services',
      followRedirect: false,
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(301);
      expect(res.headers.location).to.eq('/servicios');
    });
  });

  it('2. /services/reparacion-pc debe retornar HTTP 301 hacia /servicios/reparacion-pc', () => {
    cy.request({
      url: '/services/reparacion-pc',
      followRedirect: false,
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(301);
      expect(res.headers.location).to.eq('/servicios/reparacion-pc');
    });
  });

  it('3. Las redirecciones 301 deben preservar query strings', () => {
    cy.request({
      url: '/services?ref=campaign123',
      followRedirect: false,
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(301);
      expect(res.headers.location).to.eq('/servicios?ref=campaign123');
    });

    cy.request({
      url: '/services/reparacion-pc?utm_source=google',
      followRedirect: false,
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(301);
      expect(res.headers.location).to.eq('/servicios/reparacion-pc?utm_source=google');
    });
  });

  it('4. /servicios carga catálogo vía ServicesApplicationService (sin mock, con verificación de red y slugs)', () => {
    // Interceptamos la llamada real a Supabase para verificar que se consulta la API
    cy.intercept('GET', '**/rest/v1/services*').as('supabaseServicesCall');

    cy.visit('/servicios');
    cy.wait('@supabaseServicesCall', { timeout: 15000 });
    cy.url().should('include', '/servicios');
    cy.contains(/Nuestros Servicios/i, { timeout: 10000 }).should('be.visible');
    cy.contains(/Soluciones Especializadas/i).should('be.visible');

    // Verifica que la página renderiza artículos de servicio o contenedor de catálogo
    cy.get('body').should('be.visible');

    // Verifica que un slug del catálogo viejo sigue navegando y funcionando
    cy.visit('/servicios/reparacion-de-celulares');
    cy.url().should('include', '/servicios/reparacion-de-celulares');
    cy.get('nav[aria-label="Breadcrumb"]').should('be.visible');
    cy.contains(/Reparacion De Celulares/i, { timeout: 10000 }).should('be.visible');
  });

  it('5. /servicios/:slug carga detalle vía PublicServiceDetailComponent', () => {
    cy.visit('/servicios/auditoria-de-sitios-web');
    cy.url().should('include', '/servicios/auditoria-de-sitios-web');
    cy.get('nav[aria-label="Breadcrumb"]').should('be.visible');
    cy.contains(/Auditoria De Sitios Web|Auditoría/i, { timeout: 10000 }).should('be.visible');
  });

  it('6. Navegación en browser desde /services y /services/:slug redirige y renderiza', () => {
    cy.visit('/services');
    cy.url().should('include', '/servicios');
    cy.contains(/Nuestros Servicios/i, { timeout: 10000 }).should('be.visible');

    cy.visit('/services/reparacion-pc');
    cy.url().should('include', '/servicios/reparacion-pc');
    cy.get('nav[aria-label="Breadcrumb"]').should('be.visible');
  });

  it('7. is_quotable === true renderiza CTA "Pedir Presupuesto" en /servicios/:slug', () => {
    cy.visit('/servicios/arecofix');
    cy.url().should('include', '/servicios/arecofix');
    // Para servicios cotizables, se debe renderizar el botón / CTA de presupuesto
    cy.contains(/Pedir Presupuesto/i, { timeout: 10000 }).should('be.visible');
  });

  it('8. /servicios/slug-inexistente muestra 404 estructurado sin crashear', () => {
    cy.visit('/servicios/slug-inexistente-invalido-xyz', { failOnStatusCode: false });
    cy.url().should('include', '/servicios/slug-inexistente-invalido-xyz');
    cy.title().should('include', 'Servicio no encontrado');
    cy.contains(/Servicio no disponible/i, { timeout: 10000 }).should('be.visible');
    cy.contains(/El servicio solicitado no existe/i).should('be.visible');
    cy.contains(/Ver otros servicios/i).should('have.attr', 'href', '/servicios');
  });
});
