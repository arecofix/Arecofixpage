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
});
