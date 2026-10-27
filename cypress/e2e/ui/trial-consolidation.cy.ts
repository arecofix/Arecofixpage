/// <reference types="cypress" />

describe('Trial Consolidation: /prueba-gratis con redirects desde /prueba y /free-trial', () => {
  beforeEach(() => {
    cy.intercept('POST', '**/api/analytics/**', { statusCode: 200, body: {} });
  });

  it('1. /prueba-gratis debe cargar el formulario consolidado con ChangeDetection OnPush', () => {
    cy.visit('/prueba-gratis');
    cy.url().should('include', '/prueba-gratis');
    cy.contains(/Comienza tu Prueba Gratuita/i, { timeout: 10000 }).should('be.visible');
    // Wait for SSR hydration before interacting with Reactive Form controls
    cy.wait(3000);
    cy.get('#input-businessName').should('be.visible').clear().type('Taller Demo', { delay: 30 }).should('have.value', 'Taller Demo');
    cy.get('#input-userName').should('be.visible').clear().type('Técnico Demo', { delay: 30 }).should('have.value', 'Técnico Demo');
  });

  it('2. /prueba debe redirigir limpiamente a /prueba-gratis', () => {
    cy.visit('/prueba');
    cy.url().should('include', '/prueba-gratis');
    cy.contains(/Comienza tu Prueba Gratuita/i, { timeout: 10000 }).should('be.visible');
    cy.get('#input-businessName').should('be.visible');
  });

  it('3. /free-trial debe redirigir limpiamente a /prueba-gratis', () => {
    cy.visit('/free-trial');
    cy.url().should('include', '/prueba-gratis');
    cy.contains(/Comienza tu Prueba Gratuita/i, { timeout: 10000 }).should('be.visible');
    cy.get('#input-businessName').should('be.visible');
  });

  it('4. Debe retornar HTTP 301 real en el servidor para /prueba y /free-trial hacia /prueba-gratis', () => {
    cy.request({
      url: '/prueba',
      followRedirect: false,
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(301);
      expect(res.headers.location).to.include('/prueba-gratis');
    });

    cy.request({
      url: '/free-trial',
      followRedirect: false,
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(301);
      expect(res.headers.location).to.include('/prueba-gratis');
    });
  });

  it('5. /prueba?ref=test debe redirigir con 301 a /prueba-gratis?ref=test y cargar en browser', () => {
    cy.request({
      url: '/prueba?ref=test',
      followRedirect: false,
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(301);
      expect(res.headers.location).to.include('/prueba-gratis?ref=test');
    });

    cy.visit('/prueba?ref=test');
    cy.url().should('include', '/prueba-gratis');
    cy.contains(/Comienza tu Prueba Gratuita/i, { timeout: 10000 }).should('be.visible');
  });
});
