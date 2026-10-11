describe('Flujo de Instructor en Academia', () => {
    Cypress.on('uncaught:exception', (err, runnable) => {
        return false; // Prevent Cypress from failing the test on app errors
    });

    beforeEach(() => {
        const mockSession = { user: { id: 'instructor-123', role: 'authenticated', email: 'instructor@arecofix.com' } };
        const mockProfile = { id: 'instructor-123', email: 'instructor@arecofix.com', first_name: 'Profe', last_name: 'Test', role: 'instructor', tenant_id: 'bba26ccd-59ce-471c-aac0-4c1f5513de3b', branch_id: 'branch-1', is_active: true };

        cy.loginAsUser('/instructor/builder/11111111-1111-1111-1111-111111111111', mockSession, mockProfile);

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

        // Mock storage upload
        cy.intercept('POST', '**/api/get-upload-url*', {
            statusCode: 200,
            body: { uploadUrl: 'http://localhost:4200/mock-upload' }
        }).as('getUploadUrl');

        cy.intercept('PUT', '**/mock-upload*', {
            statusCode: 200,
            body: {}
        }).as('uploadR2');

        cy.intercept('POST', '**/storage/v1/object/**', {
            statusCode: 200,
            body: { Key: 'test/path.mp4' }
        }).as('uploadFile');
    });

    it('1. El instructor ingresa a la vista de creación/edición de contenido', () => {
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
        
        // Al subirlo, el componente local mostrará el archivo en el input de título de contenido
        cy.get('input[placeholder="Titulo del contenido"]', { timeout: 15000 })
            .should('have.value', 'test-video.mp4');
    });
});
