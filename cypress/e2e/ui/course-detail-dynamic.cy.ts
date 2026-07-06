describe('Course Detail - Dynamic Content', () => {
    beforeEach(() => {
        // Intercept API calls to mock courses if needed, or rely on mock fallback in the app
        cy.intercept('GET', '**/rest/v1/courses*', (req) => {
            // We'll let it pass or return a mock for the non-existent 'curso-de-barberia'
            // Since the app falls back to an error or mock, we will intercept specifically
            // for our test cases to ensure the UI behaves properly based on the slug/title.
        });
    });

    it('should display cellphone repair specific info for "reparacion-celulares-basico"', () => {
        // Mock the API response to return a cell phone course
        cy.intercept('GET', '**/rest/v1/courses*', {
            statusCode: 200,
            body: [{
                id: '1',
                title: 'Técnico en Reparación de Celulares',
                slug: 'reparacion-celulares-basico',
                description: 'Curso completo de reparación de celulares.',
                price: 45000,
                duration: '4 Meses',
                schedule: 'Lunes y Miércoles',
                image_url: 'assets/img/cursos/pro.webp',
                level: 'basic',
                status: 'published',
                is_active: true
            }]
        }).as('getCourseCelular');

        cy.visit('/academy/reparacion-celulares-basico');
        
        // Wait for the API to resolve
        cy.wait('@getCourseCelular');

        // Check for cell phone specific content
        cy.contains('Ya reparás celulares pero querés subir de nivel.').should('exist');
        cy.contains('Querés practicar en un laboratorio real equipado con microscopios y estaciones.').should('exist');
        cy.contains('Cambio de Módulo').should('exist'); // ROI specific
    });

    it('should display generic info and hide cellphone info for "curso-de-barberia"', () => {
        // Mock the API response to return a non-cell phone course
        cy.intercept('GET', '**/rest/v1/courses*', {
            statusCode: 200,
            body: [{
                id: '2',
                title: 'Curso de Barbería Profesional',
                slug: 'curso-de-barberia',
                description: 'Aprende las mejores técnicas de barbería.',
                price: 35000,
                duration: '3 Meses',
                schedule: 'Martes y Jueves',
                image_url: 'assets/img/cursos/barber.webp',
                level: 'basic',
                status: 'published',
                is_active: true
            }]
        }).as('getCourseBarberia');

        cy.visit('/academy/curso-de-barberia');
        
        // Wait for the API to resolve
        cy.wait('@getCourseBarberia');

        // Check for generic content
        cy.contains('Buscás una salida laboral rápida y rentable.').should('exist');
        cy.contains('Querés emprender tu propio negocio.').should('exist');

        // Verify cellphone specific content is NOT present
        cy.contains('Ya reparás celulares pero querés subir de nivel.').should('not.exist');
        cy.contains('Querés practicar en un laboratorio real equipado con microscopios y estaciones.').should('not.exist');
        cy.contains('Cambio de Módulo').should('not.exist');
    });

    it('should successfully submit the registration form and send data to admin', () => {
        // Mock the API response to return a course so the page loads
        cy.intercept('GET', '**/rest/v1/courses*', {
            statusCode: 200,
            body: [{
                id: 'course-test-id',
                title: 'Curso de Prueba de Inscripción',
                slug: 'curso-inscripcion-test',
                description: 'Prueba de inscripciones.',
                price: 1000,
                duration: '1 Mes',
                schedule: 'Lunes',
                image_url: 'assets/img/branding/og-academy.jpg',
                level: 'basic',
                status: 'published',
                is_active: true
            }]
        }).as('getCourseForRegistration');

        // Intercept the insert to course_enrollments
        cy.intercept('POST', '**/rest/v1/course_enrollments*', (req) => {
            req.reply({
                statusCode: 201,
                body: {
                    id: 'enrollment-123',
                    course_id: 'course-test-id',
                    full_name: 'Usuario Prueba',
                    email: 'test@arecofix.com.ar',
                    phone: '1122334455',
                    status: 'pending'
                }
            });
        }).as('createEnrollment');

        // Intercept the insert to contact_messages
        cy.intercept('POST', '**/rest/v1/contact_messages*', (req) => {
            req.reply({
                statusCode: 201,
                body: [{ id: 'message-123' }]
            });
        }).as('createContactMessage');

        // Intercept the modules call to wait for it before interacting with UI
        cy.intercept('GET', '**/rest/v1/course_modules*').as('getModules');
        // Intercept global background calls to wait for them
        cy.intercept('GET', '**/rest/v1/categories*').as('getCategories');
        cy.intercept('GET', '**/rest/v1/orders*').as('getOrders');

        cy.visit('/academy/curso-inscripcion-test');
        cy.wait('@getCourseForRegistration');
        cy.wait('@getModules'); // Wait for modules to finish loading to prevent DOM re-renders during typing
        cy.wait('@getCategories'); // Wait for global layout data
        cy.wait('@getOrders'); // Wait for global cart data

        // Open the registration modal
        cy.contains('button', 'Empieza ya').click();

        // Wait for modal animation to complete
        cy.wait(500);

        // Fill out the form
        cy.get('#full_name').invoke('val', 'Usuario Prueba').trigger('input').should('have.value', 'Usuario Prueba');
        cy.get('#email').invoke('val', 'test@arecofix.com.ar').trigger('input').should('have.value', 'test@arecofix.com.ar');
        cy.get('#phone').invoke('val', '1122334455').trigger('input').should('have.value', '1122334455');

        // Submit the form
        cy.contains('button', 'Confirmar Inscripción').click();

        // Wait for the API calls to complete
        cy.wait('@createEnrollment').then((interception) => {
            const reqBody = interception.request.body;
            const body = Array.isArray(reqBody) ? reqBody[0] : reqBody;
            expect(body.course_id).to.equal('course-test-id');
            expect(body.full_name).to.equal('Usuario Prueba');
            expect(body.email).to.equal('test@arecofix.com.ar');
            expect(body.phone).to.equal('1122334455');
            expect(body.status).to.equal('pending');
        });

        cy.wait('@createContactMessage').then((interception) => {
            const reqBody = interception.request.body;
            const body = Array.isArray(reqBody) ? reqBody[0] : reqBody;
            expect(body.name).to.equal('Usuario Prueba');
            expect(body.email).to.equal('test@arecofix.com.ar');
            expect(body.subject).to.equal('Nueva Inscripción a Curso');
            expect(body.message).to.include('Curso de Prueba de Inscripción');
        });

        // Verify the success UI is shown
        cy.contains('¡Pre-inscripción realizada!').should('be.visible');
        cy.contains('Datos Bancarios:').should('be.visible');
    });
});
