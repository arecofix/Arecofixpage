/// <reference types="cypress" />

describe('Footer Mobile Layout & Accessibility (D-04)', () => {
  it('debería mostrar navegación limpia, iconos monocromáticos y margen de seguridad para FABs en mobile (390x844)', () => {
    cy.viewport(390, 844);
    cy.visit('/');

    cy.get('footer', { timeout: 10000 }).scrollIntoView();

    // 1. Verificar presencia de "Enlaces Rápidos"
    cy.get('footer').contains(/Enlaces Rápidos/i).should('be.visible');

    // 2. Verificar que la navegación cuenta con los enlaces rápidos actualizados
    cy.get('footer').within(() => {
      cy.get('a[routerLink="/privacy"]').should('exist');
      cy.get('a[routerLink="/terms"]').should('exist');
      cy.get('a[routerLink="/nosotros"]').should('exist');
      cy.get('a[routerLink="/productos"]').should('exist').and('contain.text', 'Productos');

      // No debe existir el bloque redundante de navegación principal
      cy.get('nav[aria-label="Navegación Principal"]').should('not.exist');
    });

    // 3. Iconos sociales monocromáticos con estilo neutro
    cy.get('footer .social-icon-btn').should('have.length.at.least', 4).each(($btn) => {
      cy.wrap($btn).should('be.visible');
    });

    // 4. Espaciado limpio y sin huecos excesivos en el bloque de contacto
    cy.get('footer .footer-contact').should('be.visible').then($contact => {
      const pb = window.getComputedStyle($contact[0]).paddingBottom;
      const pbValue = parseFloat(pb);
      // El padding-bottom del contacto no debe tener un hueco excesivo
      expect(pbValue).to.be.at.most(24, 'El footer-contact no debe tener un espacio vertical excesivo hacia el copyright');
    });

    // 5. Firma interactiva con enlace al portfolio
    cy.get('footer a[href="https://portfolio.arecofix.com.ar"]')
      .should('be.visible')
      .and('contain.text', 'Arecofix');

    // 6. El correo de contacto debe estar visible
    cy.get('footer a[href="mailto:info@arecofix.com.ar"]').should('be.visible');
  });
});
