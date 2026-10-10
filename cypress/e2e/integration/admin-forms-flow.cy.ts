describe('Admin Forms Integration Flow', () => {
  const timestamp = Date.now();
  const testData = {
    contact: {
      name: `Test Contact ${timestamp}`,
      phone: '1122334455',
      message: 'Este es un mensaje de prueba para contacto'
    },
    course: {
      name: `Test Student ${timestamp}`,
      email: `test${timestamp}@example.com`,
      phone: '1122334455'
    },
    reservation: {
      name: `Test Turno ${timestamp}`,
      phone: '1122334455'
    }
  };

  const MOCK_TENANT_ID = 'bba26ccd-59ce-471c-aac0-4c1f5513de3b';

  const mockTenant = {
    id: MOCK_TENANT_ID,
    name: 'Arecofix',
    slug: 'arecofix',
    custom_domain: 'localhost',
    is_active: true,
    features: {
      hasCourses: true,
      hasProducts: true,
      hasServices: true,
      hasRepairs: true,
      hasBlog: true
    }
  };

  const mockProfile = {
    id: 'mock-admin-id',
    email: 'admin@arecofix.com.ar',
    role: 'super_admin',
    tenant_id: MOCK_TENANT_ID,
    branch_id: 'branch-1',
    first_name: 'Cypress',
    last_name: 'Admin',
    is_active: true
  };

  // ─── Shared mock session injected before each test ───────────────────────
  const mockSession = {
    access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoyMDY3MjQwMjA4LCJzdWIiOiJtb2NrLWFkbWluLWlkIiwiZW1haWwiOiJhZG1pbkBhcmVjb2ZpeC5jb20uYXIiLCJyb2xlIjoiYXV0aGVudGljYXRlZCIsInRlbmFudF9pZCI6ImJiYTI2Y2NkLTU5Y2UtNDcxYy1hYWMwLTRjMWY1NTEzZGUzYiIsImFwcF9tZXRhZGF0YSI6eyJwcm92aWRlciI6ImVtYWlsIiwicHJvdmlkZXJzIjpbImVtYWlsIl19LCJ1c2VyX21ldGFkYXRhIjp7InJvbGUiOiJzdXBlcl9hZG1pbiJ9fQ.bF2zng6HYDH92h7zFQV5UpXp1Ii0BNIIDBpBy5agUsk',
    expires_in: 3600,
    expires_at: Math.floor(Date.now() / 1000) + 3600,
    refresh_token: 'fake-refresh-token',
    token_type: 'bearer',
    user: {
      id: 'mock-admin-id',
      aud: 'authenticated',
      role: 'authenticated',
      email: 'admin@arecofix.com.ar',
      user_metadata: { role: 'super_admin' }
    }
  };

  const mockCourse = {
    id: 'mock-course-id',
    title: 'Curso de Reparación de Celulares',
    slug: 'reparacion-celulares',
    description: 'Aprende a reparar celulares desde cero',
    short_description: 'Reparación profesional de celulares',
    price: 15000,
    level: 'basic',
    duration: '3 meses',
    schedule: 'Lunes y Miércoles',
    is_active: true,
    is_featured: true,
    image_url: 'https://arecofix.com.ar/assets/img/branding/og-academy.jpg',
    created_at: new Date().toISOString()
  };

  beforeEach(() => {
    // ── 1. Catch-all: prevent any unmatched REST call from leaking 401 ───────
    cy.intercept('GET', '**/rest/v1/**', (req) => {
      req.reply({ statusCode: 200, body: [] });
    }).as('catchAllSupabase');

    // ── 2. Auth endpoint ─────────────────────────────────────────────────────
    cy.intercept('GET', '**/auth/v1/user', {
      statusCode: 200,
      body: mockSession.user
    }).as('getAuthUser');

    // ── 3. Tenant mock (explicitly GET) ──────────────────────────────────────
    cy.intercept('GET', '**/rest/v1/tenants*', (req) => {
      if (req.url.includes('slug=eq.celular')) {
        req.reply({ statusCode: 200, body: [] });
      } else {
        const isSingle = String(req.headers['accept'])?.includes('application/vnd.pgrst.object');
        req.reply({ statusCode: 200, body: isSingle ? mockTenant : [mockTenant] });
      }
    }).as('getTenants');

    // ── 4. Branch mock (explicitly GET) ──────────────────────────────────────
    cy.intercept('GET', '**/rest/v1/branches*', (req) => {
      const branch = { id: 'branch-1', name: 'Sede Central', tenant_id: MOCK_TENANT_ID, is_active: true };
      const isSingle = String(req.headers['accept'])?.includes('application/vnd.pgrst.object');
      req.reply({ statusCode: 200, body: isSingle ? branch : [branch] });
    }).as('getBranches');

    // ── 5. Profile mock (explicitly GET) ─────────────────────────────────────
    cy.intercept('GET', '**/rest/v1/profiles*', (req) => {
      const isSingle = String(req.headers['accept'])?.includes('application/vnd.pgrst.object');
      req.reply({ statusCode: 200, body: isSingle ? mockProfile : [mockProfile] });
    }).as('getProfile');

    // ── 6. Categories mock ───────────────────────────────────────────────────
    cy.intercept('GET', '**/rest/v1/categories*', {
      statusCode: 200,
      body: [{ id: 'cat-1', name: 'Accesorios', slug: 'accesorios', deleted_at: null }]
    }).as('getCategories');

    // ── 7. Courses mock ──────────────────────────────────────────────────────
    cy.intercept('GET', '**/rest/v1/courses*', (req) => {
      const isSingle = String(req.headers['accept'])?.includes('application/vnd.pgrst.object');
      req.reply({
        statusCode: 200,
        body: isSingle ? mockCourse : [mockCourse]
      });
    }).as('getCourses');

    // ── 8. Contact messages POST mock ────────────────────────────────────────
    cy.intercept('POST', '**/rest/v1/contact_messages*', {
      statusCode: 201,
      body: [{ id: 'mock-msg-1' }]
    }).as('postContactMessage');

    // ── 9. Cart / orders mock ────────────────────────────────────────────────
    cy.intercept('GET', '**/rest/v1/orders*', {
      statusCode: 200,
      body: []
    }).as('getOrders');

    // ── 10. Inject auth token and tenant before Angular loads ────────────────
    cy.on('window:before:load', (win) => {
      win.localStorage.setItem('sb-db-auth-token', JSON.stringify(mockSession));
      win.localStorage.setItem('sb-db.arecofix.com.ar-auth-token', JSON.stringify(mockSession));
      win.localStorage.setItem('supabase-remember-me', 'true');
      win.localStorage.setItem('arecofix_tenant_id', MOCK_TENANT_ID);
      win.localStorage.setItem('arecofix_current_branch_id', 'branch-1');
      win.localStorage.setItem('arecofix_admin_branch_id', 'branch-1');
      win.localStorage.setItem(`arecofix_profile_${mockSession.user.id}`, JSON.stringify(mockProfile));
      win.localStorage.setItem('cypress-test', 'true');
    });
  });

  it('1. should submit contact form in landing celulares', () => {
    cy.visit('/celular');

    // Wait for the contact form to be fully hydrated before interacting
    cy.get('#contactName', { timeout: 10000 }).should('be.visible');

    cy.get('#contactName').clear().type(testData.contact.name);
    cy.get('#contactPhone').clear().type(testData.contact.phone);
    cy.get('#contactMessage').clear().type(testData.contact.message);

    // Stub window.open BEFORE clicking submit (to catch the fallback WhatsApp redirect)
    cy.window().then((win) => {
      cy.stub(win, 'open').as('windowOpen');
    });

    cy.contains('button', 'Enviar Mensaje').click();
    cy.wait('@postContactMessage', { timeout: 10000 });
    
    // The POST to contact_messages is mocked to succeed → success toast should appear.
    cy.contains('Consulta enviada', { timeout: 15000 }).should('exist');
  });

  it('2. should submit course enrollment', () => {
    cy.visit('/academy');

    // Wait for the course card link to be rendered in the DOM
    cy.contains('a', 'Ver más', { timeout: 12000 }).first().click();

    // Give Angular time to load the course detail component
    cy.wait(1500);

    // The "Comprar Curso" button is inside the pricing card of the course detail page
    cy.contains('Comprar Curso', { timeout: 8000 }).click();

    // Fill registration form inside the modal
    cy.get('#full_name').clear().type(testData.course.name);
    cy.get('#email').clear().type(testData.course.email);
    cy.get('#phone').clear().type(testData.course.phone);

    // Intercept POST to course_enrollments to bypass missing anon GRANT in Supabase
    cy.intercept('POST', '**/rest/v1/course_enrollments*', (req) => {
      req.reply({
        statusCode: 201,
        body: {
          id: 'mock-id',
          course_id: mockCourse.id,
          full_name: testData.course.name,
          email: testData.course.email,
          phone: testData.course.phone,
          status: 'pending'
        }
      });
    }).as('postEnrollment');

    cy.intercept('POST', '**/rest/v1/notifications*', {
      statusCode: 201,
      body: [{ id: 'mock-notif' }]
    }).as('postNotification');

    cy.get('.modal-box').contains('button', 'Confirmar Inscripción').click();

    cy.wait('@postEnrollment');
    cy.contains('¡Pre-inscripción realizada!', { timeout: 10000 }).should('exist');
  });

  it('3. should verify data in Admin Dashboard', () => {
    // Override catchAllSupabase for the endpoints we want to test
    cy.intercept('GET', '**/rest/v1/contact_messages*', {
      statusCode: 200,
      body: [
        {
          id: 'mock-msg',
          name: testData.contact.name,
          email: 'test@contact.com',
          message: testData.contact.message,
          created_at: new Date().toISOString()
        }
      ]
    }).as('getAdminMessages');

    cy.intercept('GET', '**/rest/v1/course_enrollments*', {
      statusCode: 200,
      body: [
        {
          id: 'mock-id',
          course_id: 'mock-course',
          full_name: testData.course.name,
          email: testData.course.email,
          phone: testData.course.phone,
          status: 'pending',
          course: { title: 'Mock Course' },
          created_at: new Date().toISOString()
        }
      ]
    }).as('getAdminEnrollments');

    cy.intercept('GET', '**/rest/v1/notifications*', {
      statusCode: 200,
      body: [
        {
          id: 'mock-notif-1',
          title: 'Nuevo Mensaje de Contacto',
          message: `Mensaje de ${testData.contact.name}`,
          is_read: false,
          scope: 'admin',
          created_at: new Date().toISOString()
        },
        {
          id: 'mock-notif-2',
          title: 'Nueva Inscripción a Curso',
          message: `${testData.course.name} se ha inscripto`,
          is_read: false,
          scope: 'admin',
          created_at: new Date().toISOString()
        }
      ]
    }).as('getAdminNotifications');

    cy.intercept('POST', '**/rest/v1/rpc/get_dashboard_stats_v2*', {
      statusCode: 200,
      body: {
        users: 15,
        products: 120,
        sales: 45,
        devices_fixed: 89,
        products_chart: [],
        category_chart: []
      }
    }).as('getDashboardStats');

    cy.intercept('POST', '**/rest/v1/rpc/get_financial_analytics_v3*', {
      statusCode: 200,
      body: {
        total_gross_revenue: 1500000,
        total_cost: 400000,
        current_month_gross: 250000,
        current_month_cost: 60000,
        monthly_breakdown: []
      }
    }).as('getFinanceStats');

    // Wait for Dashboard
    cy.visit('/admin');
    cy.url({ timeout: 10000 }).should('include', '/admin');

    // Test Notifications dropdown (Alertas)
    cy.get('header', { timeout: 10000 }).should('be.visible');
    cy.get('#notif-bell-btn').click();
    
    // The notifications panel does not use .dropdown-content, it just renders an absolute div
    cy.contains('Alertas', { timeout: 10000 }).should('exist');
    cy.contains('Nuevo Mensaje de Contacto', { timeout: 10000 }).should('exist');
    cy.contains(testData.contact.name).should('exist');
    cy.contains('Nueva Inscripción a Curso').should('exist');
    cy.contains(testData.course.name).should('exist');

    // Verify Messages Section
    cy.visit('/admin/messages');
    cy.wait('@getAdminMessages');
    cy.contains('Buzón de Mensajes & Turnos', { timeout: 10000 }).should('exist');
    cy.contains(testData.contact.name).should('exist');
    cy.contains(testData.contact.message.substring(0, 20)).should('exist');

    // Verify Course Enrollments Section
    cy.visit('/admin/courses/solicitudes');
    cy.wait('@getAdminEnrollments');
    cy.contains('Solicitudes de Inscripción', { timeout: 10000 }).should('exist');
    cy.contains(testData.course.name).should('exist');
    cy.contains(testData.course.email).should('exist');
  });
});
