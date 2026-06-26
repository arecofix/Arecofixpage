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
        cy.contains('Laboratorio real equipado con microscopios y estaciones.').should('exist');
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
        cy.contains('Clases 100% prácticas y dinámicas.').should('exist');

        // Verify cellphone specific content is NOT present
        cy.contains('Ya reparás celulares pero querés subir de nivel.').should('not.exist');
        cy.contains('Laboratorio real equipado con microscopios y estaciones.').should('not.exist');
        cy.contains('Cambio de Módulo').should('not.exist');
    });
});
