describe('End-to-End Repair & Tracking Flow', () => {
    let trackingCode = '';
    let repairId = '';
    const customerName = 'E2E Tester Completo';
    const deviceModel = 'iPhone 15 Pro Max';
    const issueDescription = 'Pantalla astillada y puerto de carga flojo';

    before(() => {
        // We will not mock products/brands to ensure real E2E.
    });

    it('1. Admin creates a new repair', () => {
        cy.loginRealAdmin('/admin/repairs');
        cy.wait(1500); // Give time for auth token to stabilize
        
        // Guard retry
        cy.url().then(url => {
            if (url.includes('/login') || !url.includes('/admin/repairs')) {
                cy.visit('/admin/repairs');
                cy.wait(1500);
            }
        });
        
        cy.contains('Nuevo Ingreso').click({ force: true });
        cy.url().should('include', '/admin/repairs/new');

        // Fill out the form using invoke and blur to trigger Angular validators reliably
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

    it('2. Client tracks the repair via URL', () => {
        expect(trackingCode).to.exist;
        
        cy.visit(`/tracking/${trackingCode}`);
        cy.get('#tracking-status-card', { timeout: 15000 }).should('be.visible');
        cy.get('#tracking-status-label').should('exist');
    });

    it('3. Tracking page displays correct data', () => {
        // Assuming it's already on the page from the previous test
        cy.get('#tracking-device-info').within(() => {
            cy.contains(deviceModel).should('be.visible');
            cy.contains(customerName).should('be.visible');
            cy.contains('Pantalla astillada').should('be.visible');
        });

        // Verify Progress Steps
        cy.get('#tracking-progress-steps').should('be.visible');
        cy.get('#tracking-step-1').should('have.class', 'bg-primary');

        // Verify Print Talon
        cy.get('#btn-imprimir-talon').should('be.visible').and('not.be.disabled');
        
        // Verify Whatsapp button
        cy.get('#btn-chat-whatsapp').should('be.visible');
    });

    after(() => {
        // Cleanup the created repair
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
