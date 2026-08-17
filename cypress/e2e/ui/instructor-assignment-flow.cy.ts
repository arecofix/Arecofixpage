describe('Instructor Assignment Flow', () => {
  beforeEach(() => {
    cy.clearLocalStorage();
    cy.clearCookies();

    cy.intercept('GET', '**/rest/v1/courses*', {
      statusCode: 200,
      body: [
        {
          id: 'test-course-id',
          title: 'Curso de Prueba E2E',
          slug: 'curso-de-prueba-e2e',
          description: 'Descripción del curso',
          price: 15000,
          author_id: 'instructor-123'
        }
      ]
    }).as('getCourses');
  });

  it('allows an admin to assign an instructor to a course', () => {
    cy.loginAsAdmin('/admin/courses/new');

    // Add intercept specifically for instructors
    cy.intercept('GET', '**/rest/v1/profiles?*role=eq.instructor*', {
      statusCode: 200,
      body: [
        {
          id: 'instructor-123',
          first_name: 'Instructor',
          last_name: 'Test',
          email: 'instructor@test.com',
          role: 'instructor'
        }
      ]
    }).as('getInstructors');

    // The courses page makes an API call
    cy.wait('@getInstructors', { timeout: 10000 });

    cy.get('select[formControlName="author_id"]', { timeout: 10000 }).should('exist');
    cy.get('select[formControlName="author_id"]').find('option[value="instructor-123"]').should('exist');
    
    cy.get('select[formControlName="author_id"]').select('instructor-123');
    cy.get('select[formControlName="author_id"]').should('have.value', 'instructor-123');
  });

  it('shows Mis Cursos in the dropdown when student is logged in', () => {
    const session = {
      provider_token: null,
      access_token: 'fake-token',
      expires_in: 3600,
      expires_at: Math.floor(Date.now() / 1000) + 3600,
      refresh_token: 'fake-refresh-token',
      token_type: 'bearer',
      user: {
        id: 'student-123',
        aud: 'authenticated',
        role: 'authenticated',
        email: 'student@test.com',
        user_metadata: { role: 'user' },
        app_metadata: { provider: 'email', providers: ['email'] },
        created_at: new Date().toISOString(),
      }
    };
    
    const mockProfile = {
      id: 'student-123',
      email: 'student@test.com',
      role: 'user',
      first_name: 'Student',
      last_name: 'Test'
    };

    cy.intercept('GET', '**/rest/v1/profiles*', (req) => {
      req.reply({
        statusCode: 200,
        body: String(req.headers['accept'])?.includes('application/vnd.pgrst.object') ? mockProfile : [mockProfile]
      });
    }).as('getStudentProfile');

    cy.intercept('GET', '**/auth/v1/user', {
      statusCode: 200,
      body: session.user
    }).as('getUser');

    cy.visit('/', {
      onBeforeLoad: (win) => {
        win.localStorage.setItem('sb-jftiyfnnaogmgvksgkbn-auth-token', JSON.stringify(session));
        win.localStorage.setItem('arecofix_profile_student-123', JSON.stringify(mockProfile));
      }
    });
    
    cy.get('[aria-label="Menú de usuario"]').click();
    cy.get('a[routerLink="/academy/mis-cursos"]').should('be.visible').and('contain', 'Mis Cursos');
  });
});
