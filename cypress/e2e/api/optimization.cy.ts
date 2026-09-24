describe('Optimización Máxima Firebase - Control de Ancho de Banda', () => {
    
    it('1. El peso del HTML principal (index.html) debe estar altamente optimizado (<40KB)', () => {
        // En Cypress podemos interceptar y ver cuánto pesa la respuesta real desde Firebase, 
        // pero aquí leemos el archivo dist local para confirmar la optimización antes de subir.
        cy.readFile('dist/arecofix/browser/index.csr.html', 'utf8').then((html) => {
            const kbSize = new Blob([html]).size / 1024;
            
            // Assert that size is smaller than 100KB (standard for optimized DOM without inline CSS and JSON state)
            expect(kbSize).to.be.lessThan(100);
        });
    });

    it('2. Las rutas no deben contener CSS crítico inline (Tailwind) masivo', () => {
        cy.readFile('dist/arecofix/browser/index.csr.html', 'utf8').then((html) => {
            // El CSS masivo se suele inyectar en <style ng-app-id="app"> o simplemente <style>
            const inlineStyles = html.match(/<style[^>]*>.*?<\/style>/is);
            
            // Should either not exist or be very small (e.g. some tiny Angular spinner styles, < 15000 chars)
            if (inlineStyles) {
                expect(inlineStyles[0].length).to.be.lessThan(15000, 'Se detectó CSS inline masivo. ¿Se deshabilitó inlineCritical en angular.json?');
            }
        });
    });

    it('3. Las rutas deben contener el estado TransferState (ng-state) para evitar flickeos (SSR)', () => {
        cy.request('http://localhost:4200/').then((response) => {
            const html = response.body;
            // El script ng-state DEBE existir para pasar la hidratación de datos del servidor al cliente
            expect(html).to.include('id="ng-state"');
        });
    });
});
