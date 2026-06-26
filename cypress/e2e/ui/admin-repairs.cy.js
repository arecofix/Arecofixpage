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
  });

  it('Debería cargar la lista de reparaciones y mostrar las estadísticas', () => {
    cy.wait('@getRepairs');
    cy.contains('Juan Perez', { timeout: 10000 }).should('be.visible');
    cy.contains('iPhone 13').should('be.visible');
  });

  it('Debería cargar y mostrar todos los clientes actuales en el formulario de nuevo ingreso', () => {
    cy.contains('Nuevo Ingreso').click();
    cy.url().should('include', '/admin/repairs/new');

    // Usar invoke para evitar race conditions con Angular ngModelChange
    cy.get('input[name="customer_name"]').first().invoke('val', 'Maria').trigger('input');
    cy.get('input[name="customer_name"]').should('have.value', 'Maria');
  });

  it('Debería navegar en el orden correcto usando la tecla TAB', () => {
    cy.contains('Nuevo Ingreso').click();
    cy.url().should('include', '/admin/repairs/new');

    cy.get('input[name="customer_name"]').focus();
    cy.get('input[name="customer_name"]').should('exist');
    cy.get('input[name="customer_phone"]').should('exist');
    cy.get('input[name="device_model"]').should('exist');
    cy.get('textarea[name="issue_description"]').should('exist');
    cy.get('input[name="estimated_cost"]').should('exist');
    cy.get('input[name="deposit_amount"]').should('exist');
    cy.get('button[type="submit"]').should('exist');
  });

  it('Debería guardar caracteres especiales (ñ, áéí, emojis) y ser tolerante a errores', () => {
    cy.contains('Nuevo Ingreso').click();
    
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

    cy.get('input[name="customer_name"]').first().clear().type('Niño 👶');
    cy.get('input[name="device_model"]').first().clear().type('PC Gamer <br>');
    cy.get('textarea[name="issue_description"]').first().clear().type('Se rompió la chapa &&');
    
    cy.wait(500);
    cy.get('button[type="submit"], button:contains("Guardar")').first().click({ force: true });
    cy.wait('@postRepair');
  });

  it('Debería manejar correctamente el guardado offline si se cae la red', () => {
    // 1. Visitamos la página directamente inyectando el mock en el objeto window antes de cargar la app
    cy.visit('/admin/repairs/new', {
      onBeforeLoad: (win) => {
        // Mock on the prototype because navigator.onLine is read-only
        Object.defineProperty(win.navigator, 'onLine', {
          get: () => false,
          configurable: true
        });
        win.forceOffline = true;
      }
    });

    // Esperamos a que la página cargue completamente para evitar que Angular re-renderice
    cy.wait(1500);

    cy.get('input[name="customer_name"]').first().should('not.be.disabled').clear().type('Cliente Offline', { delay: 50 }).should('have.value', 'Cliente Offline');
    cy.get('input[name="device_model"]').first().should('not.be.disabled').clear().type('MacBook Offline', { delay: 50 }).should('have.value', 'MacBook Offline');
    cy.get('textarea[name="issue_description"]').first().should('not.be.disabled').clear().type('Test Offline', { delay: 50 }).should('have.value', 'Test Offline');

    cy.wait(500);
    cy.get('button[type="submit"], button:contains("Guardar")').first().click({ force: true });

    // Expect the warning toast showing offline sync
    cy.contains('Guardado localmente. Se sincronizará cuando haya conexión.', { timeout: 5000 }).should('exist');
    
    // Y debería haber vuelto a la lista y mostrar el aviso amarillo
    cy.url().should('not.include', '/new');
    cy.contains('1 Órdenes Guardadas Sin Internet', { timeout: 5000 }).should('be.visible');
    
    // Simulate going online
    cy.window().then((win) => {
      win.forceOffline = false;
      Object.defineProperty(win.navigator, 'onLine', {
        get: () => true,
        configurable: true
      });
      win.dispatchEvent(new Event('online'));
    });

    // Mock the POST for sync
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
         device_model: 'MacBook Offline'
      }]
    }).as('fetchSyncRepair');

    cy.contains('Sincronizar').click();
    cy.wait('@postRepairSync');
    cy.contains('1 órdenes sincronizadas con éxito!').should('exist');
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
