describe('Flujo Completo de Reparación y Seguimiento', () => {
    let trackingCode = '';
    let repairId = '';
    const customerName = 'Tester Consolidado';
    const deviceModel = 'Samsung Galaxy E2E';
    const issueDescription = 'Prueba E2E de flujo completo';

    it('1. El administrador ingresa una nueva reparación', () => {
        cy.loginRealAdmin('/admin/repairs');
        cy.wait(1500); 
        
        cy.url().then(url => {
            if (url.includes('/login') || !url.includes('/admin/repairs')) {
                cy.visit('/admin/repairs');
                cy.wait(1500);
            }
        });
        
        cy.contains('Nuevo Ingreso').click({ force: true });
        cy.url().should('include', '/admin/repairs/new');

        cy.get('input[formControlName="customer_name"]').first().clear({force:true}).invoke('val', customerName).trigger('input').blur();
        cy.get('input[formControlName="device_model"]').first().clear({force:true}).invoke('val', deviceModel).trigger('input').blur();
        cy.get('textarea[formControlName="issue_description"]').first().clear({force:true}).invoke('val', issueDescription).trigger('input').blur();
        cy.get('input[formControlName="estimated_cost"]').first().clear({force:true}).invoke('val', '45000').trigger('input').blur();

        cy.intercept('POST', '**/rpc/save_repair_order*').as('postRepair');
        
        cy.get('form').first().should('have.class', 'ng-valid');
        cy.contains('button', 'GUARDAR ORDEN').click({ force: true });
        
        cy.wait('@postRepair', { timeout: 15000 }).then((interception) => {
            expect(interception.response?.statusCode).to.eq(200);
            const body = Array.isArray(interception.response?.body) ? interception.response?.body[0] : interception.response?.body;
            repairId = typeof body === 'string' ? body : body?.id;
            trackingCode = body?.tracking_code;
            
            expect(repairId).to.exist;
            expect(trackingCode).to.exist;
        });
    });

    it('2. El cliente busca su reparación por código', () => {
        expect(trackingCode).to.exist;
        cy.visit(`/tracking/consulta`);
        
        cy.get('input[placeholder*="AF-"]').first().clear().type(trackingCode);
        cy.contains('button', 'Consultar Estado').click({ force: true });
        
        cy.url({ timeout: 15000 }).should('include', `/tracking/${trackingCode}`);
    });

    it('3. La página de seguimiento muestra los datos correctos', () => {
        cy.get('#tracking-status-card', { timeout: 15000 }).should('be.visible');
        cy.get('#tracking-status-label').should('exist');
        
        cy.get('#tracking-device-info').within(() => {
            cy.contains(deviceModel).should('be.visible');
            cy.contains(customerName).should('be.visible');
        });

        cy.get('#tracking-progress-steps').should('be.visible');
        cy.get('#btn-imprimir-talon').should('be.visible').and('not.be.disabled');
    });

    it('4. Mostrar error si el código es inválido', () => {
        cy.visit(`/tracking/AF-INVALID99`);
        cy.get('h2', { timeout: 10000 }).contains('No se encontró').should('be.visible');
    });

    after(() => {
        if (repairId) {
            const supabaseUrl = 'https://jftiyfnnaogmgvksgkbn.supabase.co';
            const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpmdGl5Zm5uYW9nbWd2a3Nna2JuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE2NjQyMDgsImV4cCI6MjA2NzI0MDIwOH0.2hJUL3hRthqnOAETTlkdwdP5s39J4nwmWfaC180ixG0';
            const storageKey = Object.keys(window.localStorage).find(key => key.startsWith('sb-') && key.endsWith('-auth-token')) || 'sb-local-auth-token';
            const sessionStr = window.localStorage.getItem(storageKey);
            if (sessionStr && supabaseUrl) {
                try {
                    const session = JSON.parse(sessionStr);
                    cy.request({
                        method: 'DELETE',
                        url: `${supabaseUrl}/rest/v1/repairs?id=eq.${repairId}`,
                        headers: {
                            'apikey': anonKey,
                            'Authorization': `Bearer ${session.access_token}`
                        },
                        failOnStatusCode: false
                    });
                } catch (e) {}
            }
        }
    });
});
