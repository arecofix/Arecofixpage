describe('Optimización Máxima Firebase - Control de Ancho de Banda', () => {
    
    it('1. El peso del HTML principal (index.html) debe estar altamente optimizado (<40KB)', () => {
        // En Cypress podemos interceptar y ver cuánto pesa la respuesta real desde Firebase, 
        // pero aquí leemos el archivo dist local para confirmar la optimización antes de subir.
        cy.readFile('dist/arecofix/browser/index.html', 'utf8').then((html) => {
            const kbSize = new Blob([html]).size / 1024;
            
            // Assert that size is smaller than 40KB (standard for optimized DOM without inline CSS and JSON state)
            expect(kbSize).to.be.lessThan(40);
        });
    });

    it('2. Las rutas no deben contener CSS crítico inline (Tailwind) masivo', () => {
        cy.readFile('dist/arecofix/browser/index.html', 'utf8').then((html) => {
            // El CSS masivo se suele inyectar en <style ng-app-id="app"> o simplemente <style>
            const inlineStyles = html.match(/<style[^>]*>.*?<\/style>/is);
            
            // Should either not exist or be very small (e.g. some tiny Angular spinner styles, < 2000 chars)
            if (inlineStyles) {
                expect(inlineStyles[0].length).to.be.lessThan(2000, 'Se detectó CSS inline masivo. ¿Se deshabilitó inlineCritical en angular.json?');
            }
        });
    });

    it('3. Las rutas no deben contener el estado TransferState (ng-state) bloqueante de ancho de banda', () => {
        cy.readFile('dist/arecofix/browser/index.html', 'utf8').then((html) => {
            // No debe existir el script ng-state
            expect(html).not.to.include('id="ng-state"');
        });
    });
});
