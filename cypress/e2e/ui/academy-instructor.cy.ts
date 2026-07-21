describe('Flujo de Instructor en Academia', () => {
    beforeEach(() => {
        const mockSession = {
            access_token: 'fake-jwt',
            expires_in: 3600,
            expires_at: Math.floor(Date.now() / 1000) + 3600,
            refresh_token: 'fake-refresh',
            token_type: 'bearer',
            user: {
                id: 'instructor-123',
                role: 'authenticated',
                email: 'instructor@arecofix.com'
            }
        };
        
        window.localStorage.setItem('sb-jftiyfnnaogmgvksgkbn-auth-token', JSON.stringify(mockSession));
        
        cy.intercept('GET', '**/rest/v1/profiles*', {
            statusCode: 200,
            body: [{
                id: 'instructor-123',
                first_name: 'Profe',
                last_name: 'Test',
                role: 'instructor'
            }]
        }).as('getProfile');

        cy.intercept('GET', '**/rest/v1/course_instructors*', {
            statusCode: 200,
            body: [{
                course_id: 'curso-test-1',
                instructor_id: 'instructor-123'
            }]
        }).as('getAssignments');
        
        // Mocking the get courses where the user is assigned
        cy.intercept('GET', '**/rest/v1/courses*', {
            statusCode: 200,
            body: [{
                id: 'curso-test-1',
                title: 'Curso de Prueba (Instructor)',
                slug: 'curso-test',
                is_active: true
            }]
        }).as('getCourses');
    });

    it('1. El instructor ingresa a la vista de creación/edición de contenido', () => {
        // En una app real navegaria a su panel y luego a builder/curso-test-1
        cy.visit('/instructor/builder/curso-test-1');
        cy.url().should('include', '/instructor/builder');
        
        // Agregar un módulo
        cy.contains('Agregar Módulo').click();
        cy.get('input[placeholder="Título del Módulo"]').type('Módulo 1: Introducción');
        
        // Verificar existencia del Dropzone
        cy.contains('Arrastra archivos aquí o haz clic para subir').should('exist');
    });

    it('2. El instructor simula la subida de un archivo al módulo', () => {
        cy.visit('/instructor/builder/curso-test-1');
        cy.contains('Agregar Módulo').click();
        cy.get('input[placeholder="Título del Módulo"]').type('Módulo 1: Introducción');
        
        // Simulamos elegir un archivo. En cypress se puede usar selectFile si el input[type=file] existe
        cy.get('input[type="file"]').selectFile({
            contents: Cypress.Buffer.from('file contents'),
            fileName: 'test-video.mp4',
            mimeType: 'video/mp4'
        }, { force: true });
        
        // Al subirlo, el componente local (simulado) mostrará el archivo en la lista
        cy.contains('test-video.mp4').should('exist');
        cy.contains('Subiendo').should('exist');
        
        // Después de 2 segundos (simulados en handleFiles), la barra de progreso finaliza y desaparece
        cy.wait(2500);
        cy.get('progress').should('not.exist');
    });
});
