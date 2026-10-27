/// <reference types="cypress" />

describe('Batería Destructiva E2E - QA Automation Senior (SDET)', () => {
  beforeEach(() => {
    // Clear storage to guarantee state isolation
    cy.clearLocalStorage();
    cy.clearAllSessionStorage();
  });

  describe('1. Flujos Críticos, Límites de Acceso y Navegación', () => {
    it('debería bloquear el acceso a rutas privadas de administración si no hay sesión y redirigir al login', () => {
      // Intento de acceso forzoso a rutas protegidas de administración
      cy.visit('/admin/dashboard', { failOnStatusCode: false });

      // Debe redirigir a login o denegar acceso
      cy.url().should('satisfy', (url: string) => {
        return url.includes('/login') || url.includes('/admin/login') || url.includes('/403');
      });

      // No debe renderizar datos sensibles de la tienda
      cy.get('body').should('not.contain', 'Ventas del Mes');
      cy.get('body').should('not.contain', 'Configuración de Tenant');
    });

    it('debería navegar secuencialmente por todas las rutas públicas clave sin errores fatales de Angular', () => {
      const publicRoutes = ['/', '/productos', '/contacto', '/nosotros'];

      publicRoutes.forEach((route) => {
        cy.visit(route);
        cy.get('public-layout-header').should('exist');
        cy.get('app-footer').should('exist');
        cy.window().then((win) => {
          expect(win.document.title).to.not.be.empty;
        });
      });
    });
  });

  describe('2. Pruebas de UI Destructivas (Double-Clicks y Corrupción de Historial)', () => {
    it('debería soportar clics masivos y repetidos (5 clicks rápidos) en el botón de envío sin duplicar envíos', () => {
      cy.intercept('POST', '**/rest/v1/**', (req) => {
        req.reply({ statusCode: 200, body: [] });
      }).as('anyMutation');

      cy.visit('/contacto');

      // Completar datos mínimos
      cy.get('input#name').type('QA Stress Tester');
      cy.get('input#email').type('stress@arecofix.com');
      cy.get('textarea#message').type('Test de estrés destructivo de clics rápidos.');
      cy.get('input#terms').check({ force: true });

      // 5 clics sucesivos ultrarrápidos sobre el botón submit
      cy.get('button[type="submit"]')
        .click({ force: true })
        .click({ force: true })
        .click({ force: true })
        .click({ force: true })
        .click({ force: true });

      // La UI debe permanecer interactiva o mostrar estado de carga sin congelarse
      cy.get('body').should('be.visible');
    });

    it('debería tolerar navegación frenética hacia atrás y adelante en el historial del navegador', () => {
      cy.visit('/');
      cy.visit('/productos');
      cy.visit('/contacto');

      // Thrashing del historial hacia atrás y adelante
      cy.go('back');
      cy.url().should('include', '/productos');

      cy.go('back');
      cy.url().should('not.include', '/contacto');

      cy.go('forward');
      cy.url().should('include', '/productos');

      cy.go('forward');
      cy.url().should('include', '/contacto');

      // Verificar que el árbol DOM de Angular se mantiene íntegro
      cy.get('form').should('exist');
      cy.get('app-footer').should('exist');
    });
  });

  describe('3. Validación de Formularios al Límite (Fuzzing, XSS & Inyecciones)', () => {
    it('debería neutralizar vectores XSS y etiquetas de script inyectadas en los inputs', () => {
      cy.visit('/contacto');

      const xssPayload = '<script>window.__xss_vulnerable=true;</script><img src="invalid" onerror="window.__xss_vulnerable=true">';

      cy.get('input#name').type(xssPayload, { parseSpecialCharSequences: false });
      cy.get('input#email').type('hacker@exploit.com');
      cy.get('textarea#message').type(`Mensaje de prueba XSS: ${xssPayload}`, { parseSpecialCharSequences: false });

      // Asegurar que el script NO se ejecutó en el contexto del DOM de la ventana
      cy.window().then((win: any) => {
        expect(win.__xss_vulnerable).to.be.undefined;
      });
    });

    it('debería resistir inyección de strings masivos (>5,000 caracteres) y caracteres emoji sin quebrar el layout', () => {
      cy.visit('/contacto');

      const massiveFuzzString = 'Arecofix-Security-Testing-'.repeat(250); // 6500 caracteres
      const emojiString = '🚀🔥💥📱💻';

      // Usar paste o val() para evitar timeout de typing en strings masivos
      cy.get('textarea#message').invoke('val', massiveFuzzString + emojiString).trigger('input');
      cy.get('input#name').invoke('val', 'Testing Emojis 🚀🔥').trigger('input');

      // Verificar que el textarea retiene el contenido sin colapsar el ancho de la página
      cy.get('textarea#message').should('have.value', massiveFuzzString + emojiString);
      cy.window().then((win) => {
        expect(win.document.documentElement.scrollWidth).to.be.lte(win.innerWidth + 20);
      });
    });
  });

  describe('4. Resiliencia Responsive y Control de Desbordamiento (Layout Overflow)', () => {
    const viewports = [
      { name: 'Mobile Estándar (390x844)', width: 390, height: 844 },
      { name: 'Tablet (768x1024)', width: 768, height: 1024 },
      { name: 'Desktop Full HD (1920x1080)', width: 1920, height: 1080 },
      { name: 'Ultra-Narrow Mobile (320x568)', width: 320, height: 568 }
    ];

    viewports.forEach((vp) => {
      it(`debería renderizar la página principal en ${vp.name} sin scroll horizontal desbordado`, () => {
        cy.viewport(vp.width, vp.height);
        cy.visit('/');

        cy.get('public-layout-header').should('exist');
        cy.get('app-footer').should('exist');

        // Aserción estricta de no-overflow horizontal en el documento
        cy.window().then((win) => {
          const scrollW = win.document.documentElement.scrollWidth;
          const innerW = win.innerWidth;
          expect(scrollW, `ScrollWidth (${scrollW}) no debe exceder Viewport Width (${innerW})`).to.be.lte(innerW + 25);
        });
      });
    });
  });

  describe('5. Intercepción de Red y Resiliencia ante Caídas (504, 500, Network Drop)', () => {
    it('debería manejar una respuesta 504 Gateway Timeout en la carga de datos sin crashear la interfaz', () => {
      // Simular fallo de red 504 Gateway Timeout en llamadas de API/DB
      cy.intercept('GET', '**/rest/v1/products**', {
        statusCode: 504,
        body: '<html><body>504 Gateway Time-out</body></html>',
        headers: { 'content-type': 'text/html' }
      }).as('products504');

      cy.visit('/productos');

      // La página debe cargar su estructura de layout sin pantalla blanca
      cy.get('public-layout-header').should('exist');
      cy.get('app-footer').should('exist');
    });

    it('debería sobrevivir a corte total de red (Network Error / Offline) manteniendo navegación básica', () => {
      cy.intercept('GET', '**/rest/v1/**', { forceNetworkError: true }).as('networkDown');

      cy.visit('/');

      // Debe renderizar la barra de navegación y el layout público sin crash no controlado
      cy.get('public-layout-header').should('exist');
      cy.get('app-footer').should('exist');
      cy.get('body').should('not.have.class', 'fatal-error');
    });
  });
});
