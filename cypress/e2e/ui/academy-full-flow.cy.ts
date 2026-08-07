describe('Flujo Completo de la Academia (Cursos)', () => {
    beforeEach(() => {
        const mockSession = {
            access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjI5OTk5OTk5OTksInJvbGUiOiJhdXRoZW50aWNhdGVkIiwic3ViIjoiYWRtaW4tdXNlci0xMjMifQ.signature',
            expires_in: 3600,
            expires_at: Math.floor(Date.now() / 1000) + 3600,
            refresh_token: 'fake-refresh-token',
            token_type: 'bearer',
            user: {
                id: 'admin-user-123',
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
        
        window.localStorage.setItem('sb-jftiyfnnaogmgvksgkbn-auth-token', JSON.stringify(mockSession));
        
        cy.intercept('GET', '**/rest/v1/profiles*', {
            statusCode: 200,
            body: [{
                id: 'admin-user-123',
                first_name: 'Admin',
                last_name: 'User',
                role: 'super_admin'
            }]
        }).as('getProfile');

        cy.intercept('GET', '**/rest/v1/courses*', {
            statusCode: 200,
            body: [{
                id: 'mock-course-1',
                title: 'Curso Mock 1',
                slug: 'curso-mock-1',
                description: 'Test course',
                duration: '4 weeks',
                schedule: 'Mondays',
                instructor_name: 'Test Instructor',
                students: 42,
                price: 10000,
                image_url: 'https://via.placeholder.com/150',
                is_active: true
            }]
        }).as('getCourses');

        cy.intercept('POST', '**/rest/v1/courses*', {
            statusCode: 201,
            body: [{
                id: 'mock-course-new',
                title: 'Nuevo Curso E2E',
                slug: 'nuevo-curso-e2e'
            }]
        }).as('postCourse');

        // Force angular state removal
        cy.intercept('GET', '/academy', (req) => {
            req.continue((res) => {
                if (typeof res.body === 'string') {
                    res.body = res.body.replace(/<script id="(angular|ng)-state" type="application\/json">[\s\S]*?<\/script>/, '');
                }
            });
        }).as('academyHtml');
    });

    it('1. El administrador ingresa a la lista de cursos', () => {
        cy.visit('/admin/courses');
        cy.url().should('include', '/admin/courses');
        cy.contains('Curso Mock 1', { timeout: 10000 }).should('be.visible');
    });

    it('2. El administrador crea un nuevo curso', () => {
        cy.visit('/admin/courses/new');
        cy.url().should('include', '/admin/courses/new');
        
        cy.wait(1000); // Allow Angular to hydrate and valueChanges to initialize

        cy.get('input[formControlName="title"]').clear().type('Nuevo Curso E2E');
        cy.wait(500); // Allow auto-slug generation
        cy.get('textarea[formControlName="description"]').clear().type('Descripción E2E');
        cy.get('input[formControlName="duration"]').clear().type('4 weeks');
        cy.get('input[formControlName="schedule"]').clear().type('Mondays');
        cy.get('input[formControlName="instructor_name"]').clear().type('Instructor E2E');
        cy.get('input[formControlName="students"]').clear().type('42');
        cy.get('input[formControlName="price"]').clear().type('10000');
        cy.get('input[formControlName="image_url"]').clear().type('https://via.placeholder.com/150');
        
        cy.get('button[type="submit"]').should('not.be.disabled').click({ force: true });
        cy.wait('@postCourse', { timeout: 10000 });
        cy.contains('guardado correctamente', { timeout: 5000 }).should('exist');
    });

    it('3. El alumno visualiza el curso público', () => {
        cy.visit('/academy');
        cy.get('app-cursos', { timeout: 10000 }).should('be.visible');
        
        cy.get('#cursos-list').within(() => {
            cy.contains('Curso Mock 1').should('exist');
            cy.contains('4 weeks').should('exist');
            cy.contains('Mondays').should('exist');
        });

        // Visitar detalle
        cy.visit('/academy/curso-mock-1');
        cy.get('app-course-detail', { timeout: 10000 }).should('be.visible');
        cy.contains('Curso Mock 1').should('exist');
        cy.contains('Test course').should('exist');
    });
});
