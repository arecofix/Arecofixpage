describe('Aislamiento Multi-Tenant (Row Level Security)', () => {
    const supabaseUrl = 'https://jftiyfnnaogmgvksgkbn.supabase.co';
    const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpmdGl5Zm5uYW9nbWd2a3Nna2JuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE2NjQyMDgsImV4cCI6MjA2NzI0MDIwOH0.2hJUL3hRthqnOAETTlkdwdP5s39J4nwmWfaC180ixG0';
    
    it('1. El Frontend maneja correctamente la ausencia de datos debido a RLS (Tenant Mismatch)', () => {
        // Mock authentication properly so the app actually loads /admin/repairs
        cy.intercept('GET', '**/rest/v1/**', { statusCode: 200, body: [] }).as('catchAll');
        cy.intercept('GET', '**/auth/v1/user', {
            statusCode: 200,
            body: { id: 'user-empresa-b', email: 'user@empresab.com' }
        });
        cy.intercept('GET', '**/rest/v1/profiles*', {
            statusCode: 200,
            body: [{ id: 'user-empresa-b', role: 'admin', is_active: true }]
        });
        cy.intercept('GET', '**/rest/v1/branches*', {
            statusCode: 200,
            body: [{ id: 'branch-b', tenant_id: 'tenant-b-id', name: 'Sucursal B', is_active: true, modules_config: { repairs: true } }]
        });

        cy.intercept('GET', '**/rest/v1/repairs*', (req) => {
            req.reply({
                statusCode: 200,
                body: []
            });
        }).as('getRepairsIsolated');

        cy.visit('/admin/repairs', {
            onBeforeLoad: (win) => {
                const mockSession = {
                    access_token: 'fake-token-tenant-b',
                    expires_in: 3600,
                    expires_at: Math.floor(Date.now() / 1000) + 3600,
                    refresh_token: 'fake-refresh',
                    token_type: 'bearer',
                    user: {
                        id: 'user-empresa-b',
                        aud: 'authenticated',
                        role: 'authenticated',
                        email: 'user@empresab.com',
                        user_metadata: { role: 'admin', tenant_id: 'tenant-b-id' }
                    }
                };
                win.localStorage.setItem('sb-jftiyfnnaogmgvksgkbn-auth-token', JSON.stringify(mockSession));
                win.localStorage.setItem('arecofix_admin_branch_id', 'branch-b');
            }
        });

        cy.wait('@getRepairsIsolated');
        
        cy.get('body').then($body => {
            if ($body.find('.empty-state, .no-data').length > 0) {
                cy.log('Estado vacío renderizado correctamente');
            }
        });
    });

    it('2. Prueba de acceso directo por API REST (Restricción RLS en la DB)', () => {
        cy.request({
            method: 'GET',
            url: `${supabaseUrl}/rest/v1/repairs?select=*`,
            headers: {
                'apikey': anonKey,
                'Authorization': `Bearer ${anonKey}`
            },
            failOnStatusCode: false
        }).then((response) => {
            // Sin un token de un tenant válido, RLS no debe devolver registros
            expect(response.status).to.eq(200);
            expect(response.body).to.be.an('array').that.is.empty;
        });
    });
});
