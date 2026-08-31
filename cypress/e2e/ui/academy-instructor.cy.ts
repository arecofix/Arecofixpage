describe('Flujo de Instructor en Academia', () => {
    Cypress.on('uncaught:exception', (err, runnable) => {
        return false; // Prevent Cypress from failing the test on app errors
    });

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
        
        window.localStorage.setItem('sb-127.0.0.1-auth-token', JSON.stringify(mockSession));
        
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
                course_id: '11111111-1111-1111-1111-111111111111',
                instructor_id: 'instructor-123'
            }]
        }).as('getAssignments');
        
        // Mocking the get courses where the user is assigned
        cy.intercept('GET', '**/rest/v1/courses*', {
            statusCode: 200,
            body: [{
                id: '11111111-1111-1111-1111-111111111111',
                title: 'Curso de Prueba (Instructor)',
                slug: 'curso-test',
                is_active: true
            }]
        }).as('getCourses');

        // Mocking course_modules to prevent permission denied errors in UI
        cy.intercept('GET', '**/rest/v1/course_modules*', {
            statusCode: 200,
            body: []
        }).as('getModules');

        // Mock storage upload with delay to ensure 'Subiendo' state is visible
        cy.intercept('POST', '**/storage/v1/object/**', {
            delay: 3000,
            statusCode: 200,
            body: { Key: 'test/path.mp4' }
        }).as('uploadFile');
    });

    it('1. El instructor ingresa a la vista de creación/edición de contenido', () => {
        // En una app real navegaria a su panel y luego a builder/curso-test-1
        cy.visit('/instructor/builder/11111111-1111-1111-1111-111111111111');
        cy.url().should('include', '/instructor/builder');
        
        // Ir a la pestaña de Módulos
        cy.contains('Modulos y Clases').click();

        // Agregar un módulo
        cy.contains(/Crear primer modulo|Nuevo Modulo/i).click();
        cy.get('input[placeholder*="Ej: Modulo"]').first().type('Modulo 1: Introducción');
        
        // Verificar existencia del Dropzone
        cy.contains(/Arrastra archivos abajo o usa|Arrastra videos, PDFs o imagenes aqui/i).should('exist');
    });

    it('2. El instructor simula la subida de un archivo al módulo', () => {
        cy.visit('/instructor/builder/11111111-1111-1111-1111-111111111111');
        
        // Ir a la pestaña de Módulos
        cy.contains('Modulos y Clases').click();

        cy.contains(/Crear primer modulo|Nuevo Modulo/i).click();
        cy.get('input[placeholder*="Ej: Modulo"]').first().type('Modulo 1: Introducción');
        
        // Simulamos elegir un archivo. En cypress se puede usar selectFile si el input[type=file] existe
        cy.get('input[type="file"]').first().selectFile({
            contents: Cypress.Buffer.from('file contents'),
            fileName: 'test-video.mp4',
            mimeType: 'video/mp4'
        }, { force: true });
        
        // Al subirlo, el componente local (simulado) mostrará el archivo en la lista
        cy.contains('test-video.mp4', { timeout: 15000 }).should('exist');
        
        // Después de 2 segundos (simulados en handleFiles), la barra de progreso finaliza y desaparece
        cy.wait(2500);
        cy.get('progress').should('not.exist');
    });
});
