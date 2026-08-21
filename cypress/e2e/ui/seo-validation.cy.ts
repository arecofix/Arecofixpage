describe('SEO Meta Tags & Full Validation', () => {
  beforeEach(() => {
    cy.clearLocalStorage();
    cy.clearCookies();
  });
  const genericImage = 'assets/img/branding/og-services.png';

  const checkSeoTags = (
    expectedTitle,
    expectedDescSnippet,
    expectedImageUrl,
    expectedUrlSnippet,
    shouldNotBeGeneric = false
  ) => {
    // 1. Title Tag
    if (expectedTitle) {
      cy.title().should('include', expectedTitle);
      cy.get('meta[property="og:title"]').should('have.attr', 'content').and('include', expectedTitle);
      cy.get('meta[name="twitter:title"]').should('have.attr', 'content').and('include', expectedTitle);
    }
    
    // 2. Meta Description
    if (expectedDescSnippet) {
      cy.get('meta[name="description"]').should('have.attr', 'content').and('include', expectedDescSnippet);
      cy.get('meta[property="og:description"]').should('have.attr', 'content').and('include', expectedDescSnippet);
      cy.get('meta[name="twitter:description"]').should('have.attr', 'content').and('include', expectedDescSnippet);
    }
    
    // 3. Images (OG & Twitter)
    if (expectedImageUrl) {
      cy.get('meta[property="og:image"]').should('have.attr', 'content').and('include', expectedImageUrl);
      cy.get('meta[property="og:image:secure_url"]').should('have.attr', 'content').and('include', expectedImageUrl);
      cy.get('meta[name="twitter:image"]').should('have.attr', 'content').and('include', expectedImageUrl);
    }

    if (shouldNotBeGeneric) {
      cy.get('meta[property="og:image"]').should('have.attr', 'content').and('not.include', genericImage);
    }

    // 4. URL & Canonical
    if (expectedUrlSnippet) {
      cy.get('meta[property="og:url"]').should('have.attr', 'content').and('include', expectedUrlSnippet);
      cy.get('link[rel="canonical"]').should('have.attr', 'href').and('include', expectedUrlSnippet);
    }

    // 5. General required SEO elements
    cy.get('meta[property="og:site_name"]').should('have.attr', 'content', 'Arecofix');
    cy.get('meta[name="twitter:card"]').should('exist');
    cy.get('meta[property="og:type"]').should('exist');
    
    // 6. Check for H1 presence
    cy.get('h1').should('exist');
  };

  it('Verifica el SEO de la página de Inicio (Genérico)', () => {
    cy.visit('/');
    checkSeoTags('Arecofix', 'Especialistas en reparación', genericImage, 'arecofix.com.ar', false);
  });

  it('Verifica el SEO de la Landing de Celulares (Específico)', () => {
    cy.visit('/celular');
    checkSeoTags('Reparación de Celulares', 'Especialistas en arreglo de celulares', 'assets/img/repair/cel.png', '/celular', true);
  });

  it('Verifica el SEO de Cursos Dinámicos (Curso de Barbería)', () => {
    cy.intercept('GET', '**/rest/v1/courses?**slug=eq.curso-de-barberia**').as('getBarberiaCourse');
    cy.visit('/academy/curso-de-barberia');
    cy.wait('@getBarberiaCourse', { timeout: 15000 });
    cy.get('h1', { timeout: 10000 }).should('exist');
    checkSeoTags('Barber', 'curso', 'xcxsrn0.webp', '/academy/curso-de-barberia', true);
  });

  it('Verifica el SEO de Cursos Dinámicos (Reparación de Notebooks y PC)', () => {
    // Intercept the Supabase courses request so we can wait for it
    cy.intercept('GET', '**/rest/v1/courses?**slug=eq.reparacion-pc**').as('getCourse');
    cy.visit('/academy/reparacion-pc');
    // Wait for the API response before asserting dynamic SEO tags
    cy.wait('@getCourse', { timeout: 15000 });
    // Give Angular time to update the DOM after the API response
    cy.get('h1', { timeout: 10000 }).should('exist');
    checkSeoTags('Reparación', null, null, '/academy/reparacion-pc', false);
  });

  it('Verifica el SEO de un Producto Dinámico (Usando Fallback)', () => {
    // Usamos el producto joystick-play-station-4 que existe en la DB y en FallbackService
    cy.visit('/productos/detalle/joystick-play-station-4');
    
    // Validamos que el producto use sus propios datos
    checkSeoTags('Joystick Play Station 4', 'Comprá Joystick Play Station 4 al mejor precio', '1000028937.jpg', '/productos/detalle/joystick-play-station-4', true);
  });

  it('Verifica el SEO de la ruta Tracking Dinámica (AF-155)', () => {
    cy.intercept('GET', '**/rest/v1/repairs?**').as('getRepair');
    cy.visit('/tracking/AF-155');
    // We wait for the mock repair or backend to answer
    cy.wait('@getRepair', { timeout: 15000 });
    cy.get('h3').contains('Maximiza').should('exist'); // Just wait for something on page load

    // Based on the resolver logic, if AF-155 exists, we check SEO tags.
    // Assuming the test hits a mocked or seeded database, we verify it doesn't use the generic tracking tags.
    // Title should contain 'Seguimiento' and 'AF-155'
    cy.title().should('include', 'AF-155');
    cy.get('meta[property="og:title"]').should('have.attr', 'content').and('include', 'AF-155');
    
    // Fallback image test (og-tracking.png) or custom image
    cy.get('meta[property="og:image"]').should('have.attr', 'content').and('not.include', genericImage);
  });

  it.skip('Debería retornar las etiquetas Open Graph dinámicas desde el servidor (SSR/Prerender)', () => {
    // Al usar cy.request evitamos que Angular inicie en el cliente.
    // Simula exactamente lo que ve Meta Debugger en Producción.
    cy.request('https://areco-fix.web.app/academy/curso-de-barberia').then((response) => {
      expect(response.status).to.eq(200);
      
      const html = response.body as string;

      // Verificamos que NO tenga la URL canónica genérica
      expect(html).not.to.include('og:url" content="https://arecofix.com.ar/"');
      
      // Verificamos que contenga la URL correcta del curso
      expect(html).to.include('og:url" content="https://arecofix.com.ar/academy/curso-de-barberia"');
      
      // Verificamos que tenga la imagen de Supabase u otra propia, no la genérica
      expect(html).not.to.include('og:image" content="https://arecofix.com.ar/assets/img/branding/og-services.jpg"');
      
      // El título no debería ser el estático 'Arecofix - Sistemas...'
      expect(html).to.match(/og:title" content=".*Curso de Barberia.*/i);
    });
  });
});
