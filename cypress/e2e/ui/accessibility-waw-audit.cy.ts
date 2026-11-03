describe('Auditoría Exhaustiva de Accesibilidad y Widget WAW', () => {
  beforeEach(() => {
    // Interceptamos llamadas a endpoints de backend para evitar interferencias de red
    cy.intercept('GET', '**/rest/v1/**', { statusCode: 200, body: [] }).as('supabaseMock');
    cy.visit('/');
    cy.get('app-accessibility-sidebar').should('exist');
  });

  describe('1. Verificación de Botones de Activación y Layout', () => {
    it('Debe mostrar el botón flotante de accesibilidad anclado a la derecha', () => {
      cy.get('app-accessibility-sidebar > button')
        .should('be.visible')
        .and('have.class', 'fixed')
        .and('have.class', 'right-0');
    });

    it('Debe incluir un acceso directo de accesibilidad en el Footer', () => {
      cy.scrollTo('bottom');
      cy.contains('button', 'Accesibilidad')
        .should('exist')
        .and('be.visible');
    });

    it('Debe abrir el panel lateral de accesibilidad al hacer clic en el botón flotante', () => {
      cy.get('app-accessibility-sidebar > button').click();
      cy.get('app-accessibility-sidebar .fixed.right-0.top-0')
        .should('not.have.class', 'translate-x-full');
      cy.contains('h2', 'Accesibilidad').should('be.visible');
    });
  });

  describe('2. Auditoría Anti-Solapamiento (Zero-Overlap Guarantee)', () => {
    it('El botón flotante y el chatbot no deben solapar el panel cuando está abierto', () => {
      // Abrir panel lateral nativo
      cy.get('app-accessibility-sidebar > button').click();

      // El botón flotante debe estar oculto
      cy.get('app-accessibility-sidebar > button').should('not.be.visible');

      // El chatbot debe tener visibilidad suprimida y no ser visible
      cy.get('app-ai-chatbot').should('not.be.visible');

      // Cerrar panel
      cy.get('app-accessibility-sidebar button[aria-label="Cerrar"]').click();

      // Al cerrar, el botón flotante y el chatbot recuperan su estado normal
      cy.get('app-accessibility-sidebar > button').should('be.visible');
    });

    it('Al abrir el panel WAW completo, el botón flotante y el chatbot deben ocultarse para no taparlo', () => {
      cy.get('app-accessibility-sidebar > button').click();
      cy.get('#btn-open-full-waw').click();

      // El panel WAW debe estar abierto
      cy.get('#waw-widget', { timeout: 8000 }).should('have.class', 'open');

      // El botón flotante de accesibilidad NO debe ser visible
      cy.get('app-accessibility-sidebar > button').should('not.be.visible');

      // El chatbot debe estar oculto
      cy.get('app-ai-chatbot').should('not.be.visible');

      // El backdrop seguro de WAW debe estar activo
      cy.get('#waw-backdrop-overlay').should('have.class', 'visible');

      // Cerrar WAW presionando Esc
      cy.get('body').type('{esc}');
      cy.get('#waw-widget').should('not.have.class', 'open');
    });
  });

  describe('3. Funcionalidad de Accesos Directos Rápidos (WAW Toggles)', () => {
    beforeEach(() => {
      cy.get('app-accessibility-sidebar > button').click();
    });

    it('Debe activar y desactivar el Modo Dislexia con feedback visual (ON/OFF)', () => {
      cy.get('#btn-quick-dyslexia').as('dyslexiaBtn');

      // Estado inicial
      cy.get('@dyslexiaBtn').contains('OFF').should('exist');
      cy.get('html').should('not.have.class', 'WAWDyslexicFont');

      // Activar
      cy.get('@dyslexiaBtn').click();
      cy.get('html').should('have.class', 'WAWDyslexicFont');
      cy.get('@dyslexiaBtn').contains('ON').should('exist');

      // Desactivar
      cy.get('@dyslexiaBtn').click();
      cy.get('html').should('not.have.class', 'WAWDyslexicFont');
      cy.get('@dyslexiaBtn').contains('OFF').should('exist');
    });

    it('Debe activar y desactivar el Cursor Grande', () => {
      cy.get('#btn-quick-big-cursor').as('cursorBtn');

      cy.get('@cursorBtn').click();
      cy.get('html').should('have.class', 'WAWBigCursor');
      cy.get('@cursorBtn').contains('ON').should('exist');

      cy.get('@cursorBtn').click();
      cy.get('html').should('not.have.class', 'WAWBigCursor');
      cy.get('@cursorBtn').contains('OFF').should('exist');
    });

    it('Debe activar y desactivar Pausar Animaciones', () => {
      cy.get('#btn-quick-stop-animations').as('animBtn');

      cy.get('@animBtn').click();
      cy.get('html').should('have.class', 'WAWNoAnimations');
      cy.get('@animBtn').contains('ON').should('exist');

      cy.get('@animBtn').click();
      cy.get('html').should('not.have.class', 'WAWNoAnimations');
      cy.get('@animBtn').contains('OFF').should('exist');
    });

    it('Debe mostrar y ocultar la Guía de Lectura y Máscara sin solapamientos', () => {
      // Por defecto deben estar ocultas
      cy.get('#waw-reading-line').should('have.class', 'hidden');
      cy.get('#waw-reading-mask').should('have.class', 'hidden');

      // Activar Guía de Lectura
      cy.get('#btn-quick-reading-line').click();
      cy.get('#waw-reading-line').should('not.have.class', 'hidden');

      // Desactivar Guía de Lectura
      cy.get('#btn-quick-reading-line').click();
      cy.get('#waw-reading-line').should('have.class', 'hidden');
    });
  });

  describe('4. Auditoría de Restablecimiento Completo', () => {
    it('Debe restablecer todas las preferencias tanto nativas como de WAW simultáneamente', () => {
      cy.get('app-accessibility-sidebar > button').click();

      // Activar Dislexia y Cursor Grande
      cy.get('#btn-quick-dyslexia').click();
      cy.get('#btn-quick-big-cursor').click();
      cy.get('html').should('have.class', 'WAWDyslexicFont');
      cy.get('html').should('have.class', 'WAWBigCursor');

      // Clic en restablecer todo
      cy.get('#btn-reset-all-accessibility').click();

      // Verificar que se limpiaron las clases de accesibilidad
      cy.get('html').should('not.have.class', 'WAWDyslexicFont');
      cy.get('html').should('not.have.class', 'WAWBigCursor');
      cy.get('#btn-quick-dyslexia').contains('OFF').should('exist');
      cy.get('#btn-quick-big-cursor').contains('OFF').should('exist');
    });
  });
});
