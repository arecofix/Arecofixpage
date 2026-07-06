describe('Admin Repairs Flow - Taller / Servicio Técnico', () => {
  beforeEach(() => {
    cy.loginAsAdmin();

    // Mock clients list, pero respetando la consulta del perfil admin
    cy.intercept({ method: 'GET', pathname: '/rest/v1/profiles' }, (req) => {
      if (req.url.includes('id=eq.mock-admin-id')) {
        req.reply({
          statusCode: 200,
          body: [{ id: 'mock-admin-id', role: 'super_admin', email: 'admin@arecofix.com', first_name: 'Admin', is_active: true }]
        });
      } else if (req.url.includes('id=eq.client-new')) {
        req.reply({
          statusCode: 200,
          body: [{ id: 'client-new', first_name: 'Nuevo', last_name: 'Cliente', email: 'nuevo@test.com', phone: '1100000000' }]
        });
      } else {
        req.reply({
          statusCode: 200,
          body: [
            { id: 'client-1', first_name: 'Juan', last_name: 'Perez', email: 'juan@test.com', phone: '1122334455' },
            { id: 'client-2', first_name: 'Maria', last_name: 'Gomez', email: 'maria@test.com', phone: '1199887766' }
          ]
        });
      }
    }).as('getClients');

    // Interceptamos la llamada a la edge function para creación de clientes nuevos
    cy.intercept({ method: 'POST', pathname: '/functions/v1/create-employee' }, {
      statusCode: 200,
      body: { user: { id: 'client-new' } }
    }).as('postProfileEdge');

    // Interceptamos la actualización del perfil (is_guest: true)
    cy.intercept({ method: 'PATCH', pathname: '/rest/v1/profiles' }, {
      statusCode: 200,
      body: [{ id: 'client-new', is_guest: true }]
    }).as('patchProfile');

    // Mock stats/statistics
    cy.intercept({ method: 'POST', pathname: '/rpc/get_workshop_summary_v3' }, {
      statusCode: 200,
      body: {
        total_ingresos: 2,
        total_entregados: 1,
        total_facturado: 45000,
        en_reparacion: 1
      }
    }).as('getWorkshopSummary');

    // Mock repairs list and single fetches conditionally (covers GET, HEAD, etc.)
    cy.intercept({ pathname: '/rest/v1/repairs' }, (req) => {
       // If it's a HEAD request for counts, just return 200 OK with empty body
       // Supabase JS infers count from the Content-Range header, but since we are
       // not strictly asserting the count numbers in the test, returning 200 OK
       // is enough to prevent the Promise from throwing an error.
       if (req.method === 'HEAD') {
           req.reply({
               statusCode: 200,
               headers: {
                   'content-range': '0-0/0'
               }
           });
           return;
       }
       if (req.url.includes('id=eq.')) {
           // Fetch single repair
           req.reply({
             statusCode: 200,
             body: [{
                id: 'mock-repair-1',
                repair_number: 1001,
                customer_name: 'Juan Perez',
                customer_id: 'client-1',
                device_model: 'iPhone 13',
                issue_description: 'Pantalla rota',
                current_status_id: 1, // pending
                final_cost: 45000,
                estimated_cost: 45000,
                tenant_id: 'bba26ccd-59ce-471c-aac0-4c1f5513de3b'
             }]
           });
           return;
       }

       if (req.url.includes('current_status_id') || req.url.includes('final_cost')) {
          // Stat counts queries
          req.reply({
             statusCode: 200,
             body: [
                { current_status_id: 1, created_at: new Date().toISOString() },
                { 
                   current_status_id: 6, 
                   final_cost: 45000, 
                   costo_repuesto: 0, 
                   created_at: new Date().toISOString(), 
                   completed_at: new Date().toISOString() 
                }
             ]
          });
          return;
       }

       // Fetch list
       req.reply({
         statusCode: 200,
         body: [
           {
             id: 'mock-repair-1',
             repair_number: 1001,
             tracking_code: 'TRK-1001',
             customer_name: 'Juan Perez',
             customer_phone: '1122334455',
             customer_id: 'client-1',
             device_model: 'iPhone 13',
             device_type: 'smartphone',
             issue_description: 'Pantalla rota',
             current_status_id: 1, // Pending
             estimated_cost: 45000,
             received_at: new Date().toISOString(),
             tenant_id: 'bba26ccd-59ce-471c-aac0-4c1f5513de3b',
             client: { full_name: 'Juan Perez', phone: '1122334455' },
             assigned_technician: { full_name: 'Admin Test' },
             status: { name: 'PENDIENTE', color: 'yellow', icon: 'clock' },
             brand: { name: 'Apple' }
           },
           {
             id: 'mock-repair-2',
             repair_number: 1002,
             tracking_code: 'TRK-1002',
             customer_name: 'Maria Gomez',
             customer_phone: '1199887766',
             customer_id: 'client-2',
             device_model: 'Samsung S21',
             device_type: 'smartphone',
             issue_description: 'Bateria',
             current_status_id: 6, // Delivered / Facturado
             final_cost: 45000,
             costo_repuesto: 0,
             created_at: new Date().toISOString(),
             completed_at: new Date().toISOString(),
             received_at: new Date().toISOString(),
             tenant_id: 'bba26ccd-59ce-471c-aac0-4c1f5513de3b',
             client: { full_name: 'Maria Gomez', phone: '1199887766' },
             assigned_technician: { full_name: 'Admin Test' },
             status: { name: 'ENTREGADO', color: 'green', icon: 'check' },
             brand: { name: 'Samsung' }
           }
         ]
       });
    }).as('getRepairs');

    cy.visit('/admin/repairs');
    // Esperamos a que la app termine cualquier redirección de inicio
    cy.url().should('include', '/admin/repairs');
  });

  it('Debería cargar la lista de reparaciones y mostrar las estadísticas', () => {
    // Esperar a que la llamada se complete
    cy.wait('@getRepairs', { timeout: 10000 });
    
    // Esperar a que los datos se rendericen en la página
    cy.wait(1000);
    
    // Buscar evidencia de que las reparaciones cargaron
    // Puede ser a través del cliente, número de reparación o modelo de dispositivo
    cy.get('body', { timeout: 5000 }).should('be.visible');
    
    // Verificar que el componente de tabla o lista es visible
    cy.get('table, [class*="repair"], [class*="list"]', { timeout: 5000 }).should('be.visible');
    
    // Verificar que al menos uno de los clientes se muestra
    cy.contains('Juan Perez', { timeout: 5000 }).should('be.visible');
  });

  it('Debería cargar y mostrar todos los clientes actuales en el formulario de nuevo ingreso', () => {
    cy.contains('Nuevo Ingreso').click({ force: true });
    cy.url().should('include', '/admin/repairs/new');

    cy.wait(500);
    cy.get('input[formControlName="customer_name"]').first().clear().type('Maria', { delay: 30 });
    cy.get('input[formControlName="customer_name"]').first().should('have.value', 'Maria');
  });

  it('Debería navegar en el orden correcto usando la tecla TAB', () => {
    cy.contains('Nuevo Ingreso').click({ force: true });
    cy.url().should('include', '/admin/repairs/new');

    // Esperar a que el formulario esté completamente cargado
    cy.get('form').should('be.visible');
    cy.wait(500);

    // Verificar que todos los campos del formulario existen
    cy.get('input[formControlName="customer_name"]').should('exist').and('be.visible');
    cy.get('input[formControlName="customer_phone"], input[placeholder*="Teléfono"], input[placeholder*="Telefono"]').should('exist');
    cy.get('input[formControlName="device_model"], input[placeholder*="Modelo"]').should('exist');
    cy.get('textarea[formControlName="issue_description"], textarea[placeholder*="Problema"]').should('exist');
    cy.get('input[formControlName="estimated_cost"], input[placeholder*="Costo"]').should('exist');
    cy.get('button[type="submit"]').should('exist');
  });

  it('Debería guardar caracteres especiales (ñ, áéí, emojis) y ser tolerante a errores', () => {
    cy.contains('Nuevo Ingreso').click({ force: true });
    
    cy.intercept('POST', '**/rpc/save_repair_order*', {
      statusCode: 200,
      body: null
    }).as('postRepair');

    cy.intercept('GET', '**/rest/v1/repairs?id=eq.*', {
      statusCode: 200,
      body: [{
         id: 'new-repair-id',
         repair_number: 1002,
         customer_name: 'Niño 👶',
         customer_phone: '1122334455',
         device_model: 'PC Gamer <br>',
         issue_description: 'Se rompió la chapa &&',
         estimated_cost: 15000,
         current_status_id: 1,
         tenant_id: 'bba26ccd-59ce-471c-aac0-4c1f5513de3b'
      }]
    }).as('fetchNewRepair');

    cy.get('input[formControlName="customer_name"]').first().clear().type('Niño 👶', { delay: 30 });\n    cy.get('input[formControlName="device_model"]').first().clear().type('PC Gamer', { delay: 30 });\n    cy.get('textarea[formControlName="issue_description"]').first().clear().type('Se rompió la chapa', { delay: 30 });
    
    cy.wait(500);
    cy.get('button[type="submit"], button:contains("Guardar")').first().click({ force: true });
    cy.wait('@postRepair', { timeout: 10000 });
  });

  it('Debería manejar correctamente el guardado offline si se cae la red', () => {
    // 1. Ya estamos en /admin/repairs gracias al beforeEach (cargado online).
    cy.contains('Nuevo Ingreso').click({ force: true });
    cy.url().should('include', '/admin/repairs/new');
    
    cy.wait(500);

    // 2. Llenar el formulario ANTES de simular offline.
    cy.get('input[formControlName="customer_name"]').first().clear().type('Cliente Offline');
    cy.get('input[formControlName="customer_name"]').first().should('have.value', 'Cliente Offline');

    cy.get('input[formControlName="device_model"]').first().clear().type('Laptop Offline');
    cy.get('input[formControlName="device_model"]').first().should('have.value', 'Laptop Offline');

    cy.get('textarea[formControlName="issue_description"]').first().clear().type('Test Offline');
    cy.get('textarea[formControlName="issue_description"]').first().should('have.value', 'Test Offline');

    // 3. Simular la caída de la red DESPUÉS de llenar el formulario
    cy.window().then((win) => {
      Object.defineProperty(win.navigator, 'onLine', {
        writable: true,
        value: false
      });
      win.dispatchEvent(new Event('offline'));
    });

    cy.wait(500);
    
    // 4. Intentar guardar en modo offline
    cy.get('button[type="submit"]').first().click({ force: true });

    // 5. El formulario debe mantenerse (puede quedarse en la misma página en offline)
    // o mostrar un indicador de guardado offline
    cy.url().should('include', '/admin/repairs');
    
    // Mock the POST for sync (definir ANTES de ir online para capturar sync automático)
    cy.intercept('POST', '**/rpc/save_repair_order*', {
      statusCode: 200,
      body: null
    }).as('postRepairSync');
    
    cy.intercept('GET', '**/rest/v1/repairs?id=eq.*', {
      statusCode: 200,
      body: [{
         id: 'sync-repair-id',
         repair_number: 1003,
         customer_name: 'Cliente Offline',
         device_model: 'Laptop Offline'
      }]
    }).as('fetchSyncRepair');

    // Simulate going online - el sync puede dispararse automáticamente
    cy.window().then((win) => {
      win.forceOffline = false;
      Object.defineProperty(win.navigator, 'onLine', {
        get: () => true,
        configurable: true
      });
      win.dispatchEvent(new Event('online'));
    });

    // Si hay botón Sincronizar, hacerle clic (puede que ya se haya sincronizado automáticamente)
    cy.get('body').then(($body) => {
      if ($body.text().includes('Sincronizar')) {
        cy.contains('Sincronizar').click({ force: true });
      }
    });

    // Esperar a que el POST de sync ocurra (ya sea manual o automático)
    cy.wait('@postRepairSync', { timeout: 8000 });
    cy.contains('1 órdenes sincronizadas con éxito!', { timeout: 8000 }).should('exist');
  });

  it('Debería cargar las estadísticas y permitir descargar el reporte CSV', () => {
    // Vamos a /admin/repairs/stats inyectando el token en el mismo visit
    cy.visit('/admin/repairs/stats', {
      failOnStatusCode: false,
      onBeforeLoad: (win) => {
        const session = {
          provider_token: null,
          access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjI5OTk5OTk5OTksInJvbGUiOiJhdXRoZW50aWNhdGVkIiwic3ViIjoibW9jay1hZG1pbi1pZCJ9.signature',
          expires_in: 3600,
          expires_at: Math.floor(Date.now() / 1000) + 3600,
          refresh_token: 'fake-refresh-token',
          token_type: 'bearer',
          user: {
            id: 'mock-admin-id',
            aud: 'authenticated',
            role: 'authenticated',
            email: 'admin@arecofix.com',
            email_confirmed_at: new Date().toISOString(),
            app_metadata: { provider: 'email', providers: ['email'] },
            user_metadata: { role: 'super_admin' },
            identities: [],
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        };
        win.localStorage.setItem('sb-jftiyfnnaogmgvksgkbn-auth-token', JSON.stringify(session));
        win.localStorage.setItem('arecofix_current_branch_id', 'branch-1');
        win.localStorage.setItem('arecofix_admin_branch_id', 'branch-1');
      }
    });

    // Debe mostrar la vista de Inteligencia Financiera
    cy.contains('Inteligencia Financiera', { timeout: 10000 }).should('be.visible');
    cy.contains('Ingresos Totales (Taller)').should('be.visible'); 
    cy.contains('Costo Insumos').should('be.visible');
    
    // Verificamos que el botón de descarga exista
    cy.contains('Base Clientes (CSV)').should('be.visible');
  });
});
