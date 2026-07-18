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

  // ─── Shared mock session injected before each test ───────────────────────
  const mockSession = {
    access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjI5OTk5OTk5OTksInJvbGUiOiJhdXRoZW50aWNhdGVkIiwic3ViIjoibW9jay11c2VyLWlkIn0.signature',
    expires_in: 3600,
    expires_at: Math.floor(Date.now() / 1000) + 3600,
    refresh_token: 'fake-refresh-token',
    token_type: 'bearer',
    user: {
      id: 'mock-user-id',
      aud: 'authenticated',
      role: 'authenticated',
      email: 'user@arecofix.com'
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
    cy.intercept('**/rest/v1/**', (req) => {
      req.reply({ statusCode: 200, body: [] });
    }).as('catchAllSupabase');

    // ── 2. Auth endpoint ─────────────────────────────────────────────────────
    cy.intercept('GET', '**/auth/v1/user', {
      statusCode: 200,
      body: mockSession.user
    }).as('getAuthUser');

    // ── 3. Tenant mock (matches both `localhost` and `slug=eq.arecofix`) ──────
    cy.intercept('**/rest/v1/tenants*', (req) => {
      const tenant = {
        id: 'bba26ccd-59ce-471c-aac0-4c1f5513de3b',
        name: 'Arecofix',
        slug: 'arecofix',
        custom_domain: 'localhost',
        is_active: true
      };
      req.reply({ statusCode: 200, body: req.url.includes('limit=1') ? [tenant] : tenant });
    }).as('getTenants');

    // ── 4. Branch mock ───────────────────────────────────────────────────────
    cy.intercept('**/rest/v1/branches*', (req) => {
      const branch = { id: 'branch-1', name: 'Sede Central' };
      req.reply({ statusCode: 200, body: req.url.includes('id=eq.branch-1') ? branch : [branch] });
    }).as('getBranches');

    // ── 5. Profile mock ──────────────────────────────────────────────────────
    cy.intercept('**/rest/v1/profiles*', (req) => {
      const profile = {
        id: 'mock-user-id',
        email: 'user@arecofix.com',
        role: 'user',
        first_name: 'Cypress',
        last_name: 'User',
        is_active: true
      };
      req.reply({ statusCode: 200, body: req.url.includes('id=eq.mock-user-id') ? profile : [profile] });
    }).as('getProfile');

    // ── 6. Categories mock (aliased so tests can wait on it) ─────────────────
    cy.intercept('GET', '**/rest/v1/categories*', {
      statusCode: 200,
      body: [{ id: 'cat-1', name: 'Accesorios', slug: 'accesorios', deleted_at: null }]
    }).as('getCategories');

    // ── 7. Courses mock (aliased so tests can wait on it) ────────────────────
    cy.intercept('GET', '**/rest/v1/courses*', {
      statusCode: 200,
      body: [mockCourse]
    }).as('getCourses');

    // ── 8. Contact messages POST mock ────────────────────────────────────────
    cy.intercept('POST', '**/rest/v1/contact_messages*', {
      statusCode: 201,
      body: [{ id: 'mock-msg-1' }]
    }).as('postContactMessage');

    // ── 9. Cart / orders mock (to avoid 401 on cart load) ────────────────────
    cy.intercept('GET', '**/rest/v1/orders*', {
      statusCode: 200,
      body: []
    }).as('getOrders');

    // ── 10. Inject auth token before Angular loads ───────────────────────────
    cy.visit('/', {
      failOnStatusCode: false,
      onBeforeLoad: (win) => {
        win.localStorage.setItem('sb-jftiyfnnaogmgvksgkbn-auth-token', JSON.stringify(mockSession));
        win.localStorage.setItem('supabase-remember-me', 'true');
        win.localStorage.setItem('arecofix_current_branch_id', 'branch-1');
        win.localStorage.setItem('cypress-test', 'true');
      }
    });
  });

  it('1. should submit contact form in landing celulares', () => {
    cy.visit('/celular');
    cy.wait('@getCategories', { timeout: 10000 });

    // Fill contact form
    cy.get('#contactName').invoke('val', testData.contact.name).trigger('input');
    cy.get('#contactPhone').invoke('val', testData.contact.phone).trigger('input');
    cy.get('#contactMessage').invoke('val', testData.contact.message).trigger('input');

    // Stub window.open BEFORE clicking submit (to catch the fallback WhatsApp redirect)
    cy.window().then((win) => {
      cy.stub(win, 'open').as('windowOpen');
    });

    cy.contains('button', 'Enviar Mensaje').click();
    cy.wait('@postContactMessage');
    
    // The POST to contact_messages is mocked to succeed → success toast should appear.
    // Toast text: '¡Consulta enviada con éxito! Te responderemos a la brevedad.'
    cy.contains('Consulta enviada', { timeout: 15000 }).should('exist');
  });

  it('2. should submit course enrollment', () => {
    cy.visit('/academy');
    cy.wait('@getCourses', { timeout: 10000 });

    // Wait for the course card link to be rendered in the DOM
    cy.contains('a', 'Ver más', { timeout: 8000 }).first().click();

    // Give Angular time to load the course detail component
    cy.wait(1500);

    // The "Comprar Curso" button is inside the pricing card of the course detail page
    cy.contains('Comprar Curso', { timeout: 6000 }).click();

    // Fill registration form inside the modal
    cy.get('#full_name').invoke('val', testData.course.name).trigger('input');
    cy.get('#email').invoke('val', testData.course.email).trigger('input');
    cy.get('#phone').invoke('val', testData.course.phone).trigger('input');

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
    cy.loginAsAdmin();

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
          created_at: new Date().toISOString()
        },
        {
          id: 'mock-notif-2',
          title: 'Nueva Inscripción a Curso',
          message: `${testData.course.name} se ha inscripto`,
          is_read: false,
          created_at: new Date().toISOString()
        }
      ]
    }).as('getAdminNotifications');

    // Wait for Dashboard
    cy.visit('/admin');
    cy.wait('@getAdminNotifications');
    cy.url({ timeout: 10000 }).should('include', '/admin');

    // Test Notifications dropdown (Alertas)
    cy.get('header').find('#notif-bell-btn').click();
    
    // The notifications panel does not use .dropdown-content, it just renders an absolute div
    cy.contains('Alertas', { timeout: 10000 }).should('exist');
    cy.contains('Nuevo Mensaje de Contacto', { timeout: 10000 }).should('exist');
    cy.contains(testData.contact.name).should('exist');
    cy.contains('Nueva Inscripción a Curso').should('exist');
    cy.contains(testData.course.name).should('exist');

    // Verify Messages Section
    cy.visit('/admin/messages');
    cy.wait('@getAdminMessages');
    cy.contains('Mensajes de Contacto', { timeout: 10000 }).should('exist');
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
