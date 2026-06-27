describe('SEO Meta Tags Validation (Open Graph)', () => {
  const genericImage = 'assets/img/branding/og-services.jpg';

  const checkSeoTags = (expectedTitle, expectedDescSnippet, expectedImageUrl, expectedUrlSnippet, shouldNotBeGeneric = false) => {
    if (expectedTitle) {
      cy.get('meta[property="og:title"]').should('have.attr', 'content').and('include', expectedTitle);
    }
    
    if (expectedDescSnippet) {
      cy.get('meta[property="og:description"]').should('have.attr', 'content').and('include', expectedDescSnippet);
    }
    
    if (expectedImageUrl) {
      cy.get('meta[property="og:image"]').should('have.attr', 'content').and('include', expectedImageUrl);
    }

    if (shouldNotBeGeneric) {
      cy.get('meta[property="og:image"]').should('have.attr', 'content').and('not.include', genericImage);
    }

    if (expectedUrlSnippet) {
      cy.get('meta[property="og:url"]').should('have.attr', 'content').and('include', expectedUrlSnippet);
    }
  };

  it('Verifica el SEO de la página de Inicio (Genérico)', () => {
    cy.visit('/');
    checkSeoTags('Arecofix - Servicio Técnico', 'Especialistas en reparación', genericImage, 'arecofix.com.ar', false);
  });

  it('Verifica el SEO de la Landing de Celulares (Específico)', () => {
    cy.visit('/celular');
    checkSeoTags('Reparación de Celulares', 'Especialistas en arreglo de celulares', 'assets/img/repair/cel.png', '/celular', true);
  });

  it('Verifica el SEO de Cursos Dinámicos (Curso de Barbería)', () => {
    cy.visit('/academy/curso-de-barberia');
    checkSeoTags('Barberia', 'curso de Barberia inicial', 'xcxsrn0.webp', '/academy/curso-de-barberia', true);
  });

  it('Verifica el SEO de Cursos Dinámicos (Reparación de Notebooks y PC)', () => {
    cy.visit('/academy/reparacion-pc');
    checkSeoTags('Reparación de Notebooks', 'diagnosticar, reparar y optimizar', 'assets/img/cursos/pc-repair.jpg', '/academy/reparacion-pc', true);
  });

  it('Verifica el SEO de un Producto Dinámico (Usando Fallback)', () => {
    // Usamos el producto joystick-play-station-4 que existe en la DB y en FallbackService
    // para que el SSR no falle y no redireccione a la página de inicio (302)
    cy.visit('/productos/detalle/joystick-play-station-4');
    
    // Validamos que el producto use sus propios datos
    checkSeoTags('Joystick Play Station 4', 'Comprá Joystick Play Station 4 al mejor precio', '1000028937.jpg', '/productos/detalle/joystick-play-station-4', true);
  });
});
