/// <reference types="cypress" />

describe('Home Methodology Section Mobile UX & Layout Test', () => {
  it('debería mostrar la cabecera de metodología como static en mobile (390x844) evitando que flote y tape los pasos al scrollear', () => {
    cy.viewport(390, 844);
    cy.visit('/');

    // Scrollear progresivamente para que el IntersectionObserver de Angular active los bloques @defer (on viewport)
    cy.scrollTo(0, 1000, { duration: 300 });
    cy.wait(200);
    cy.scrollTo(0, 2000, { duration: 300 });
    cy.wait(200);
    cy.scrollTo(0, 3000, { duration: 300 });
    cy.wait(200);

    // Comprobar que el elemento diferido ya se renderizó
    cy.get('app-home-methodology', { timeout: 15000 }).scrollIntoView();

    // Comprobar que el título está visible
    cy.contains(/Metodología de Trabajo/i).should('be.visible');

    // Verificar que en mobile el contenedor del título es static (NO sticky)
    cy.contains(/Metodología de Trabajo/i).parent().then($header => {
      const position = window.getComputedStyle($header[0]).position;
      expect(position).to.satisfy((pos: string) => pos === 'static' || pos === '' || pos === 'relative', 
        'En mobile el encabezado debe ser estático para no flotar ni superponerse');
      expect(position).not.to.eq('sticky', 'No debe ser sticky en mobile');
    });

    // Comprobar que todos los pasos están visibles y en flujo natural
    cy.contains(/01/i).should('be.visible');
    cy.contains(/Consultoría & Estrategia/i).should('be.visible');

    // Scroll hacia el final de los pasos
    cy.contains(/05/i).scrollIntoView().should('be.visible');
    cy.contains(/Despliegue Cloud/i).should('be.visible');

    // Verificar que el paso 01 sigue existiendo en el DOM y visible en su flujo
    cy.contains(/Consultoría & Estrategia/i).should('exist');
  });

  it('debería mantener el layout sticky únicamente en vista desktop (1280x800)', () => {
    cy.viewport(1280, 800);
    cy.visit('/');

    // Scrollear progresivamente para activar @defer
    cy.scrollTo(0, 1000, { duration: 300 });
    cy.wait(200);
    cy.scrollTo(0, 2200, { duration: 300 });
    cy.wait(200);

    cy.get('app-home-methodology', { timeout: 15000 }).scrollIntoView();
    cy.contains(/Metodología de Trabajo/i).should('be.visible');

    // En desktop (>= lg), la clase lg:sticky activa position: sticky
    cy.contains(/Metodología de Trabajo/i).parent().then($header => {
      const position = window.getComputedStyle($header[0]).position;
      expect(position).to.eq('sticky', 'En desktop debe ser sticky');
    });
  });
});
