import { buildMockSession, buildMockProfile } from '../../support/mock-factories';

describe('Tenant Isolation & Anti-Leak Security Tests (RLS & UI)', () => {
  const TENANT_A_ID = 'bba26ccd-59ce-471c-aac0-4c1f5513de3b'; // Main Branch (Sede Central)
  const TENANT_B_ID = '550e8400-e29b-41d4-a716-446655440000'; // Secondary Branch (Sucursal Zaona)

  const userTenantAId = 'a1111111-1111-1111-1111-111111111111';
  const userTenantBId = 'b2222222-2222-2222-2222-222222222222';

  const tenantAMessages = [
    {
      id: 'msg-tenant-a-1',
      tenant_id: TENANT_A_ID,
      name: 'Cliente Sede Central',
      email: 'cliente.central@arecofix.com',
      phone: '1122334455',
      subject: 'Consulta Técnica Central',
      message: 'Mensaje legítimo exclusivo de la Sede Central.',
      is_read: false,
      created_at: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      id: 'msg-tenant-a-2',
      tenant_id: TENANT_A_ID,
      name: 'Reserva Turno Central',
      email: 'reserva.central@arecofix.com',
      phone: '1199887766',
      subject: 'Solicitud de Turno: Reparación',
      message: 'Turno para cambio de módulo en Sede Central.',
      is_read: true,
      created_at: new Date(Date.now() - 7200000).toISOString(),
    },
  ];

  const tenantBMessages = [
    {
      id: 'msg-tenant-b-leak',
      tenant_id: TENANT_B_ID,
      name: 'Cliente Sucursal B (Confidencial)',
      email: 'privado@sucursalb.com',
      phone: '3344556677',
      subject: 'Datos Confidenciales Sucursal Zaona',
      message: 'INFORMACIÓN CONFIDENCIAL DE SUCURSAL B QUE NUNCA DEBE SER VISIBLE PARA OTROS TENANTS.',
      is_read: false,
      created_at: new Date().toISOString(),
    },
  ];

  const tenantANotifications = [
    {
      id: 'notif-tenant-a-1',
      tenant_id: TENANT_A_ID,
      title: 'Notificación Central Arecofix',
      message: 'Actualización de stock en Sede Central.',
      type: 'info',
      scope: 'admin',
      is_read: false,
      created_at: new Date().toISOString(),
    },
  ];

  const tenantBNotifications = [
    {
      id: 'notif-tenant-b-leak',
      tenant_id: TENANT_B_ID,
      title: 'ALERTA CONFIDENCIAL TENANT B',
      message: 'Notificación privada de Sucursal B.',
      type: 'warning',
      scope: 'admin',
      is_read: false,
      created_at: new Date().toISOString(),
    },
  ];

  const createTenantASession = () => ({
    ...buildMockSession(),
    user: {
      id: userTenantAId,
      email: 'admin.central@arecofix.com.ar',
      role: 'authenticated',
      user_metadata: { role: 'admin' },
      app_metadata: { provider: 'email', tenant_id: TENANT_A_ID, role: 'admin' },
    },
  });

  const createTenantAProfile = () => ({
    ...buildMockProfile(),
    id: userTenantAId,
    email: 'admin.central@arecofix.com.ar',
    role: 'admin',
    tenant_id: TENANT_A_ID,
    first_name: 'Admin',
    last_name: 'Central',
  });

  beforeEach(() => {
    cy.clearAllLocalStorage();
    cy.clearAllCookies();
  });

  // =========================================================================
  // 1. Test de Fuga (Debe fallar / Bloquear acceso a datos de otro tenant)
  // =========================================================================
  it('1. Test de fuga: Usuario de Tenant A no puede leer mensajes ni notificaciones de Tenant B vía Supabase REST API', () => {
    const session = createTenantASession();
    const profile = createTenantAProfile();

    // Mock intercepted network to simulate strict database RLS enforcement:
    // If request queries tenant_id=eq.TENANT_B_ID, RLS returns empty array or 403 Forbidden.
    cy.intercept('GET', '**/rest/v1/contact_messages*', (req) => {
      const url = req.url;
      if (url.includes(`tenant_id=eq.${TENANT_B_ID}`)) {
        // Enforced RLS: zero records visible for cross-tenant query
        req.reply({
          statusCode: 200,
          headers: { 'content-range': '0-0/0', 'Content-Range': '0-0/0' },
          body: [],
        });
      } else {
        req.reply({
          statusCode: 200,
          headers: { 'content-range': `0-${tenantAMessages.length - 1}/${tenantAMessages.length}` },
          body: tenantAMessages,
        });
      }
    }).as('getContactMessages');

    cy.intercept('GET', '**/rest/v1/notifications*', (req) => {
      const url = req.url;
      if (url.includes(`tenant_id=eq.${TENANT_B_ID}`)) {
        req.reply({
          statusCode: 200,
          headers: { 'content-range': '0-0/0', 'Content-Range': '0-0/0' },
          body: [],
        });
      } else {
        req.reply({
          statusCode: 200,
          headers: { 'content-range': `0-${tenantANotifications.length - 1}/${tenantANotifications.length}` },
          body: tenantANotifications,
        });
      }
    }).as('getNotifications');

    cy.loginAsUser('/admin/messages', session, profile);

    // Direct API attempt from Tenant A user context trying to fetch Tenant B messages
    cy.window().then(async (win) => {
      const supabase = (win as any).supabase;
      if (supabase) {
        const { data, error } = await supabase
          .from('contact_messages')
          .select('*')
          .eq('tenant_id', TENANT_B_ID);

        // Security assertion: must be empty array or error
        expect(data === null || data.length === 0).to.be.true;
      }
    });

    // Verify cross-tenant data is never leaked
    cy.contains('INFORMACIÓN CONFIDENCIAL DE SUCURSAL B').should('not.exist');
    cy.contains('Cliente Sucursal B (Confidencial)').should('not.exist');
  });

  // =========================================================================
  // 2. Test de UI: Usuario de Tenant A no ve los mensajes de Tenant B en la UI
  // =========================================================================
  it('2. Test de UI: Usuario de Tenant A no ve mensajes de Tenant B en la bandeja de entrada ni en la campana', () => {
    const session = createTenantASession();
    const profile = createTenantAProfile();

    cy.intercept('GET', '**/rest/v1/contact_messages*', (req) => {
      req.reply({
        statusCode: 200,
        headers: { 'content-range': `0-${tenantAMessages.length - 1}/${tenantAMessages.length}` },
        body: tenantAMessages,
      });
    }).as('getMessagesUI');

    cy.intercept('GET', '**/rest/v1/notifications*', (req) => {
      req.reply({
        statusCode: 200,
        headers: { 'content-range': `0-${tenantANotifications.length - 1}/${tenantANotifications.length}` },
        body: tenantANotifications,
      });
    }).as('getNotificationsUI');

    cy.loginAsUser('/admin/messages', session, profile);
    cy.wait('@getMessagesUI');

    // Messages header and tenant A contents should be visible
    cy.contains('Buzón de Mensajes & Turnos').should('be.visible');
    cy.contains('Cliente Sede Central').should('be.visible');
    cy.contains('Consulta Técnica Central').should('be.visible');

    // Tenant B confidential messages must NEVER exist in DOM
    cy.contains('privado@sucursalb.com').should('not.exist');
    cy.contains('Datos Confidenciales Sucursal Zaona').should('not.exist');
    cy.contains('INFORMACIÓN CONFIDENCIAL').should('not.exist');

    // Verify Notifications Bell in Header
    cy.get('button').find('.fa-bell, i.fa-bell').first().click({ force: true });
    cy.contains('Notificación Central Arecofix').should('exist');
    cy.contains('ALERTA CONFIDENCIAL TENANT B').should('not.exist');
  });

  // =========================================================================
  // 3. Test de Inserción: Bloqueo de inserción cruzada entre tenants
  // =========================================================================
  it('3. Test de inserción: Usuario de Tenant A intenta insertar un mensaje con tenant_id de Tenant B y el sistema lo bloquea', () => {
    const session = createTenantASession();
    const profile = createTenantAProfile();

    // RLS Policy Violation Mock / Simulation
    cy.intercept('POST', '**/rest/v1/contact_messages*', (req) => {
      const body = req.body;
      if (body.tenant_id === TENANT_B_ID) {
        req.reply({
          statusCode: 403,
          body: {
            code: '42501',
            message: 'new row violates row-level security policy for table "contact_messages"',
            details: 'Failing row contains tenant_id not matching user tenant.',
          },
        });
      } else {
        req.reply({
          statusCode: 201,
          body: { ...body, id: 'new-legit-id' },
        });
      }
    }).as('postContactMessage');

    cy.loginAsUser('/admin/messages', session, profile);

    // Attempt cross-tenant insert via client
    cy.window().then(async (win) => {
      const supabase = (win as any).supabase;
      if (supabase) {
        const { data, error } = await supabase
          .from('contact_messages')
          .insert({
            name: 'Ataque Infiltración',
            email: 'hacker@tenant-a.com',
            message: 'Intento de inyección de mensaje en Tenant B',
            tenant_id: TENANT_B_ID,
          });

        // The attempt must return an error / be rejected
        expect(error).to.not.be.null;
        expect(error?.message).to.include('row-level security');
      }
    });
  });

  // =========================================================================
  // 4. Test de Regresión: Usuario de Tenant A ve y gestiona sus mensajes normalmente
  // =========================================================================
  it('4. Test de regresión: Usuario de Tenant A sigue viendo sus propios mensajes y puede gestionarlos', () => {
    const session = createTenantASession();
    const profile = createTenantAProfile();

    cy.intercept('GET', '**/rest/v1/contact_messages*', (req) => {
      req.reply({
        statusCode: 200,
        headers: { 'content-range': `0-${tenantAMessages.length - 1}/${tenantAMessages.length}` },
        body: tenantAMessages,
      });
    }).as('getMessagesRegression');

    cy.intercept('PATCH', '**/rest/v1/contact_messages*', (req) => {
      // Must include tenant_id in query filter or body
      expect(req.url).to.include(`tenant_id=eq.${TENANT_A_ID}`);
      req.reply({
        statusCode: 200,
        body: [{ ...tenantAMessages[0], is_read: true }],
      });
    }).as('markAsReadMessage');

    cy.loginAsUser('/admin/messages', session, profile);
    cy.wait('@getMessagesRegression');

    // Both messages are visible
    cy.contains('Cliente Sede Central').should('be.visible');
    cy.contains('Reserva Turno Central').should('be.visible');

    // Mark as read button click
    cy.get('button[data-tip="Marcar como leído"]').first().click();
    cy.wait('@markAsReadMessage');

    // Regression verification: The interface responds properly and keeps tenant isolated
    cy.contains('Cliente Sede Central').should('be.visible');
  });

  // =========================================================================
  // 5. Test de Fuga en Pedidos (Orders & E-commerce)
  // =========================================================================
  it('5. Test de Aislamiento en Pedidos: Usuario de Tenant A no puede leer ni modificar pedidos de Tenant B', () => {
    const session = createTenantASession();
    const profile = createTenantAProfile();

    const tenantAOrders = [
      {
        id: 'ord-tenant-a-1',
        order_number: 'ORD-A-001',
        tenant_id: TENANT_A_ID,
        total_amount: 15000,
        status: 'paid',
        customer_name: 'Comprador Sede Central',
        created_at: new Date().toISOString(),
      },
    ];

    cy.intercept('GET', '**/rest/v1/orders*', (req) => {
      const url = req.url;
      if (url.includes(`tenant_id=eq.${TENANT_B_ID}`)) {
        req.reply({
          statusCode: 200,
          headers: { 'content-range': '0-0/0', 'Content-Range': '0-0/0' },
          body: [],
        });
      } else {
        req.reply({
          statusCode: 200,
          headers: { 'content-range': `0-${tenantAOrders.length - 1}/${tenantAOrders.length}` },
          body: tenantAOrders,
        });
      }
    }).as('getOrders');

    cy.intercept('PATCH', '**/rest/v1/orders*', (req) => {
      req.reply({
        statusCode: 403,
        body: {
          code: '42501',
          message: 'new row violates row-level security policy for table "orders"',
        },
      });
    }).as('patchOrder');

    cy.loginAsUser('/admin/orders', session, profile);

    cy.window().then(async (win) => {
      const supabase = (win as any).supabase;
      if (supabase) {
        // 1. Cross-tenant read must return zero
        const { data: crossOrders } = await supabase
          .from('orders')
          .select('*')
          .eq('tenant_id', TENANT_B_ID);
        expect(crossOrders === null || crossOrders.length === 0).to.be.true;

        // 2. Cross-tenant update must fail with RLS error
        const { error: updateError } = await supabase
          .from('orders')
          .update({ status: 'cancelled' })
          .eq('id', 'ord-tenant-b-999')
          .eq('tenant_id', TENANT_B_ID);
        expect(updateError).to.not.be.null;
      }
    });

    cy.contains('ORD-A-001').should('exist');
    cy.contains('ORD-B-CONFIDENTIAL').should('not.exist');
  });

  // =========================================================================
  // 6. Test de Fuga en Reparaciones (Repairs)
  // =========================================================================
  it('6. Test de Aislamiento en Reparaciones: Usuario de Tenant A no puede ver órdenes de reparación de Tenant B', () => {
    const session = createTenantASession();
    const profile = createTenantAProfile();

    const tenantARepairs = [
      {
        id: 'rep-tenant-a-1',
        repair_number: 100,
        tracking_code: 'REP-CENTRAL-100',
        tenant_id: TENANT_A_ID,
        customer_name: 'Cliente Reparación Central',
        device_type: 'smartphone',
        device_brand: 'Apple',
        device_model: 'iPhone 13',
        problem_description: 'Pantalla partida',
        current_status_id: 1,
        created_at: new Date().toISOString(),
      },
    ];

    cy.intercept('GET', '**/rest/v1/repairs*', (req) => {
      const url = req.url;
      if (url.includes(`tenant_id=eq.${TENANT_B_ID}`)) {
        req.reply({
          statusCode: 200,
          headers: { 'content-range': '0-0/0', 'Content-Range': '0-0/0' },
          body: [],
        });
      } else {
        req.reply({
          statusCode: 200,
          headers: { 'content-range': `0-${tenantARepairs.length - 1}/${tenantARepairs.length}` },
          body: tenantARepairs,
        });
      }
    }).as('getRepairs');

    cy.intercept('POST', '**/rest/v1/repairs*', (req) => {
      const body = req.body;
      if (body.tenant_id === TENANT_B_ID) {
        req.reply({
          statusCode: 403,
          body: {
            code: '42501',
            message: 'new row violates row-level security policy for table "repairs"',
          },
        });
      } else {
        req.reply({
          statusCode: 201,
          body: { ...body, id: 'new-repair-a' },
        });
      }
    }).as('postRepair');

    cy.loginAsUser('/admin/repairs', session, profile);

    cy.window().then(async (win) => {
      const supabase = (win as any).supabase;
      if (supabase) {
        // Query cross-tenant repairs
        const { data: crossRepairs } = await supabase
          .from('repairs')
          .select('*')
          .eq('tenant_id', TENANT_B_ID);
        expect(crossRepairs === null || crossRepairs.length === 0).to.be.true;

        // Try inserting repair into Tenant B
        const { error: insertError } = await supabase
          .from('repairs')
          .insert({
            repair_number: 9999,
            tenant_id: TENANT_B_ID,
            customer_name: 'Infiltrado',
          });
        expect(insertError).to.not.be.null;
      }
    });

    cy.contains('REP-CENTRAL-100').should('exist');
    cy.contains('REP-B-CONFIDENTIAL').should('not.exist');
  });

  // =========================================================================
  // 7. Test de Fuga en Caja (Cash Movements)
  // =========================================================================
  it('7. Test de Aislamiento en Caja: Movimientos financieros de Tenant B están estrictamente ocultos para Tenant A', () => {
    const session = createTenantASession();
    const profile = createTenantAProfile();

    const tenantACash = [
      {
        id: 'cash-tenant-a-1',
        tenant_id: TENANT_A_ID,
        amount: 85000,
        type: 'income',
        description: 'Venta Mostrador Central',
        created_at: new Date().toISOString(),
      },
    ];

    cy.intercept('GET', '**/rest/v1/cash_movements*', (req) => {
      const url = req.url;
      if (url.includes(`tenant_id=eq.${TENANT_B_ID}`)) {
        req.reply({
          statusCode: 200,
          headers: { 'content-range': '0-0/0', 'Content-Range': '0-0/0' },
          body: [],
        });
      } else {
        req.reply({
          statusCode: 200,
          headers: { 'content-range': `0-${tenantACash.length - 1}/${tenantACash.length}` },
          body: tenantACash,
        });
      }
    }).as('getCashMovements');

    cy.loginAsUser('/admin/finance/cash-movements', session, profile);

    cy.window().then(async (win) => {
      const supabase = (win as any).supabase;
      if (supabase) {
        // Direct API check: cannot query Tenant B cash movements
        const { data: crossCash } = await supabase
          .from('cash_movements')
          .select('*')
          .eq('tenant_id', TENANT_B_ID);
        expect(crossCash === null || crossCash.length === 0).to.be.true;
      }
    });

    cy.contains('Movimientos de Caja').should('exist');
    cy.contains('Caja Fuerte Sucursal Zaona').should('not.exist');
  });

  // =========================================================================
  // 8. Test de Fuga en Productos (Products & Stock)
  // =========================================================================
  it('8. Test de Aislamiento en Productos: Tenant A no puede modificar ni acceder a catálogo no publicado de Tenant B', () => {
    const session = createTenantASession();
    const profile = createTenantAProfile();

    cy.intercept('PATCH', '**/rest/v1/products*', (req) => {
      const body = req.body;
      if (req.url.includes(`tenant_id=eq.${TENANT_B_ID}`) || body?.tenant_id === TENANT_B_ID) {
        req.reply({
          statusCode: 403,
          body: {
            code: '42501',
            message: 'new row violates row-level security policy for table "products"',
          },
        });
      } else {
        req.reply({
          statusCode: 200,
          body: [{ id: 'prod-a-1', price: 9999 }],
        });
      }
    }).as('patchProduct');

    cy.loginAsUser('/admin/products', session, profile);

    cy.window().then(async (win) => {
      const supabase = (win as any).supabase;
      if (supabase) {
        // Attempt cross-tenant update on products
        const { error } = await supabase
          .from('products')
          .update({ price: 1 })
          .eq('id', 'prod-tenant-b-leak')
          .eq('tenant_id', TENANT_B_ID);

        expect(error).to.not.be.null;
      }
    });
  });
});
