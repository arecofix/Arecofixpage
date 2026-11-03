/// <reference types="cypress" />

describe('Home Hero CTA & Mobile Layout E2E', () => {
  it('debería centrar verticalmente el botón secundario en la vista mobile (390x844)', () => {
    cy.viewport(390, 844);
    cy.visit('/');

    // 1. Validar el botón secundario del Hero
    cy.contains('a', /Descubrir cómo pueden ayudarme/i)
      .should('be.visible')
      .should('have.attr', 'href', '/portfolio')
      .then(($btn) => {
        const height = $btn.outerHeight();
        // Debe tener una altura consistente mayor a 50px
        expect(height).to.be.at.least(50);
        // Debe tener flex centering
        expect($btn).to.have.class('flex');
        expect($btn).to.have.class('items-center');
        expect($btn).to.have.class('justify-center');
      });

    // 2. Validar que el botón primario también esté presente y alineado
    cy.contains('a', /Agendar una asesoría gratuita/i)
      .should('be.visible')
      .should('have.attr', 'href', '/contacto');
  });

  it('debería interactuar con el enlace y navegar correctamente', () => {
    cy.viewport(1280, 720);
    cy.visit('/');

    cy.contains('a', /Descubrir cómo pueden ayudarme/i).click();
    cy.url().should('include', '/portfolio');
  });

  it('debería mostrar el botón flotante para compartir y responder al teclado (Escape)', () => {
    cy.viewport(1280, 720);
    cy.visit('/');

    // 1. Debe existir el componente flotante
    cy.get('app-share-buttons').should('exist');
    cy.get('app-share-buttons button[aria-label="Abrir opciones para compartir"]').should('be.visible').as('fabTrigger');

    // 2. Al hacer clic, debe desplegar las opciones de redes
    cy.get('@fabTrigger').click();
    cy.get('app-share-buttons button[aria-label="Compartir en WhatsApp"]').should('be.visible');
    cy.get('app-share-buttons button[aria-label="Copiar enlace al portapapeles"]').should('be.visible');

    // 3. Al presionar Escape, debe cerrarse
    cy.get('body').type('{esc}');
    cy.get('app-share-buttons button[aria-label="Compartir en WhatsApp"]').should('not.exist');
  });
});
