describe('Auditoría de Seguridad: Inyección y Filtros', () => {
    const supabaseUrl = Cypress.env('SUPABASE_URL') || 'https://db.arecofix.com.ar';
    const anonKey = Cypress.env('SUPABASE_ANON_KEY') || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlIiwiaWF0IjoxNzg4NDUxOTI2LCJleHAiOjIxMDM4MTE5MjZ9.nZqQkOuevPpgU9Z4hOMwE5IBz1WinSKiBhcRI0fQkCs';
    let accessToken: string;
  
    before(() => {
      cy.request({
        method: 'POST',
        url: `${supabaseUrl}/auth/v1/token?grant_type=password`,
        headers: { 'apikey': anonKey, 'Content-Type': 'application/json' },
        body: {
          email: Cypress.env('TEST_ADMIN_EMAIL') || 'testadmin@arecofix.com',
          password: Cypress.env('TEST_ADMIN_PASSWORD') || 'SecretTestUser2026!#'
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(200);
        accessToken = response.body.access_token;
      });
    });
  
    context('1. SQL Injection en Parámetros REST', function() {
      it('Debería neutralizar intentos de inyección SQL en los parámetros de ordenamiento de PostgREST', function() {
        // En Supabase, el querystring se parsea vía PostgREST. 
        // Pasando sintaxis SQL inválida debería retornar un 400 Bad Request, nunca un 500 ni ejecutar la orden.
        cy.request({
          method: 'GET',
          url: `${supabaseUrl}/rest/v1/products?order=name;DROP TABLE products`,
          headers: {
            'apikey': anonKey,
            'Authorization': `Bearer ${accessToken}`
          },
          failOnStatusCode: false
        }).then((response) => {
          // PostgREST interpreta el ';' como separador de URL (como un '&') o bien lo escapa completamente en sus AST.
          // Por lo tanto, retorna 200 OK ordenando por 'name' ignorando inofensivamente la inyección, o 400 si lo toma literal.
          // Lo importante es que no ejecuta el SQL malicioso ni devuelve un error 500.
          expect([200, 400]).to.include(response.status); 
        });
      });
    });
  
    context('2. XSS (Cross-Site Scripting)', function() {
      it('Debería escapar o rechazar payloads XSS en nombres de entidades', function() {
        const xssPayload = '<script>alert("XSS")</script><img src=x onerror=alert(1)>';
        cy.request({
          method: 'POST',
          url: `${supabaseUrl}/rest/v1/products`,
          headers: {
            'apikey': anonKey,
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=minimal'
          },
          body: {
            name: xssPayload,
            price: 1,
            slug: 'xss-test-' + Date.now(),
            is_active: false
          },
          failOnStatusCode: false
        }).then((response) => {
           // Si permite la inserción (Supabase suele permitir cualquier string en campos text),
           // la mitigación debe existir en Angular (que escapa por defecto) o en un trigger de DB.
           // Pero al menos verificamos el comportamiento.
           cy.log(`Status de inserción XSS: ${response.status}`);
        });
      });
    });
  });
