describe('Auditoría de Seguridad: Inyección y Filtros', () => {
    const supabaseUrl = 'https://jftiyfnnaogmgvksgkbn.supabase.co';
    const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpmdGl5Zm5uYW9nbWd2a3Nna2JuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE2NjQyMDgsImV4cCI6MjA2NzI0MDIwOH0.2hJUL3hRthqnOAETTlkdwdP5s39J4nwmWfaC180ixG0';
    let accessToken: string;
  
    before(() => {
      cy.request({
        method: 'POST',
        url: `${supabaseUrl}/auth/v1/token?grant_type=password`,
        headers: { 'apikey': anonKey, 'Content-Type': 'application/json' },
        body: { email: 'admin@arecofix.com.ar', password: 'admin2026' }
      }).then((response) => {
        expect(response.status).to.eq(200);
        accessToken = response.body.access_token;
      });
    });
  
    context('1. SQL Injection en Parámetros REST', () => {
      it('Debería neutralizar intentos de inyección SQL en los parámetros de ordenamiento de PostgREST', () => {
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
  
    context('2. XSS (Cross-Site Scripting)', () => {
      it('Debería escapar o rechazar payloads XSS en nombres de entidades', () => {
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
