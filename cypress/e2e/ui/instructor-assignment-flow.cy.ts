describe('Instructor Assignment Flow', () => {
  beforeEach(() => {
    // Standard UI intercept pattern from Cypress conventions
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

    cy.intercept('GET', '**/rest/v1/profiles*', {
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
    }).as('getProfiles');
  });

  it('allows an admin to assign an instructor to a course', () => {
    // 1. Simulate admin session
    cy.on('window:before:load', (win) => {
      win.localStorage.setItem('supabase.auth.token', JSON.stringify({
        currentSession: {
          user: { id: 'admin-123', email: 'admin@arecofix.com' },
          access_token: 'fake-jwt-token'
        }
      }));
      win.localStorage.setItem('user_profile', JSON.stringify({
        id: 'admin-123',
        role: 'super_admin'
      }));
    });

    // 2. Visit Course Form directly to test assignment
    cy.visit('/admin/courses/new');

    // 3. Check for instructor select
    cy.get('select[formControlName="author_id"]').should('exist');
    
    // Select the instructor (we mocked the profiles to return instructor-123)
    cy.get('select[formControlName="author_id"]').select('instructor-123');
    cy.get('select[formControlName="author_id"]').should('have.value', 'instructor-123');
  });

  it('shows Mis Cursos in the dropdown when student is logged in', () => {
    // Simulate student session
    cy.on('window:before:load', (win) => {
      win.localStorage.setItem('supabase.auth.token', JSON.stringify({
        currentSession: {
          user: { id: 'student-123', email: 'student@test.com' },
          access_token: 'fake-jwt-token'
        }
      }));
      win.localStorage.setItem('user_profile', JSON.stringify({
        id: 'student-123',
        role: 'user'
      }));
    });

    cy.visit('/');
    
    // User dropdown should be visible, open it
    cy.get('.dropdown-end').click();
    
    // Mis Cursos should be in the menu
    cy.get('a[routerLink="/academy/mis-cursos"]').should('be.visible').and('contain', 'Mis Cursos');
  });
});
