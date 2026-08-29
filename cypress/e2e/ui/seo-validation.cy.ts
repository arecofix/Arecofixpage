describe('SEO Meta Tags & Full Validation', () => {
  let skip_tests = false;
before(function() {
    cy.request({
        method: 'GET',
        url: 'https://jftiyfnnaogmgvksgkbn.supabase.co/rest/v1/tenants?limit=1',
        headers: { apikey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpmdGl5Zm5uYW9nbWd2a3Nna2JuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE2NjQyMDgsImV4cCI6MjA2NzI0MDIwOH0.2hJUL3hRthqnOAETTlkdwdP5s39J4nwmWfaC180ixG0' },
        failOnStatusCode: false
    }).then((res) => {
        if (res.status === 402) {
            skip_tests = true;
        }
    });
});
beforeEach(function() {
    if (skip_tests) this.skip();
});


  beforeEach(() => {
    cy.clearLocalStorage();
    cy.clearCookies();
  });
  const genericImage = 'assets/img/branding/inicio.jpg';

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

  it('Verifica el SEO de la página de Inicio (Genérico)', function() {
    cy.visit('/');
    checkSeoTags('Arecofix', 'Especialistas en desarrollo de software', genericImage, 'arecofix.com.ar', false);
  });

  it('Verifica el SEO de la Landing de Celulares (Específico)', function() {
    cy.visit('/celular');
    checkSeoTags('Reparación de Celulares', 'Servicio técnico especializado en la reparación de celulares', 'assets/img/repair/cel.png', '/celular', true);
  });

  it('Verifica el SEO de Cursos Dinámicos (Curso de Barbería)', function() {
    cy.intercept('GET', '**/rest/v1/courses?**slug=eq.curso-de-barberia**', {
      statusCode: 200,
      body: [{
        id: '12345678-1234-1234-1234-123456789012',
        title: 'Curso de Barbería',
        slug: 'curso-de-barberia',
        is_active: true,
        image_url: 'xcxsrn0.webp'
      }]
    }).as('getBarberiaCourse');

    cy.intercept('GET', '**/rest/v1/course_modules*', {
      statusCode: 200,
      body: []
    }).as('getModules');
    cy.visit('/academy/curso-de-barberia');
    cy.wait('@getBarberiaCourse', { timeout: 15000 });
    cy.get('h1', { timeout: 10000 }).should('exist');
    checkSeoTags('Barber', 'curso', 'xcxsrn0.webp', '/academy/curso-de-barberia', true);
  });

  it('Verifica el SEO de Cursos Dinámicos (Reparación de Notebooks y PC)', function() {
    // Mock the course
    cy.intercept('GET', '**/rest/v1/courses?**slug=eq.reparacion-pc**', {
      statusCode: 200,
      body: [{
        id: 'c72580b2-4152-4f5e-a36a-bafaee324745',
        title: 'Curso de Reparación de Notebooks y PC',
        slug: 'reparacion-pc',
        is_active: true
      }]
    }).as('getCourse');

    cy.intercept('GET', '**/rest/v1/course_modules*', {
      statusCode: 200,
      body: []
    }).as('getModules');

    cy.visit('/academy/reparacion-pc');
    cy.wait('@getCourse', { timeout: 15000 });
    cy.get('h1', { timeout: 10000 }).should('exist');
    checkSeoTags('Reparación', null, null, '/academy/reparacion-pc', false);
  });

  it('Verifica el SEO de un Producto Dinámico (Usando Fallback)', function() {
    // Usamos el producto joystick-play-station-4 que existe en la DB y en FallbackService
    cy.visit('/productos/detalle/joystick-play-station-4');
    
    // Validamos que el producto use sus propios datos
    checkSeoTags('Joystick Play Station 4', 'Comprá Joystick Play Station 4 al mejor precio', '1000028937.jpg', '/productos/detalle/joystick-play-station-4', true);
  });

  it('Verifica el SEO de la ruta Tracking Dinámica (AF-155)', function() {
    cy.intercept('POST', '**/rpc/get_repair_tracking*', { statusCode: 200, body: [{ id: 'mock-123', device_model: 'Mock Phone', status_label: 'En Reparación', tracking_code: 'AF-155', repair_number: 155 }] }).as('getRepairTracking');
      cy.intercept('GET', '**/rest/v1/repairs?**').as('getRepair');
    cy.visit('/tracking/AF-155');
    // We wait for the mock repair or backend to answer
    cy.get('h2').should('exist'); // Just wait for something on page load

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
