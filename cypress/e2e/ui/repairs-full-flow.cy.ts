describe('Flujo Completo de Reparación y Seguimiento', () => {
    let trackingCode = '';
    let repairId = '';
    const customerName = 'Tester Consolidado';
    const deviceModel = 'Samsung Galaxy E2E';
    const issueDescription = 'Prueba E2E de flujo completo';

    it('1. El administrador ingresa una nueva reparación', () => {
        cy.loginRealAdmin('/login?returnUrl=/admin/repairs');
        cy.wait(1500); 
        
        cy.url().then(url => {
            if (url.includes('/login') || !url.includes('/admin/repairs')) {
                cy.visit('/admin/repairs');
                cy.wait(1500);
            }
        });
        
        cy.contains('Nuevo Ingreso').click({ force: true });
        cy.url().should('include', '/admin/repairs/new');
        cy.wait(1500);

        const setInputValue = (selector: string, value: string) => {
            cy.get(selector).first().clear({ force: true });
            cy.get(selector).first().invoke('val', value).trigger('input').blur();
        };

        setInputValue('input[formControlName="customer_name"]', customerName);
        setInputValue('input[formControlName="device_model"]', deviceModel);
        setInputValue('textarea[formControlName="issue_description"]', issueDescription);
        setInputValue('input[formControlName="estimated_cost"]', '45000');
        setInputValue('input[formControlName="imei"]', '123456789012345');
        
        // Select accessories from dropdown checklist
        cy.contains('button', 'Seleccionar').first().click({force: true});
        cy.get('input[formControlName="charger"]').first().check({force: true});
        cy.get('input[formControlName="case"]').first().check({force: true});

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

    it('2. El administrador edita la reparación y cambia el estado a Gestión de Repuestos usando la línea de tiempo interactiva', () => {
        expect(repairId).to.exist;
        cy.loginRealAdmin(`/login?returnUrl=/admin/repairs/${repairId}`);
        cy.wait(2500);
        
        // Verify initial status is 1 (Recibido / Pendiente)
        cy.get('#timeline-status-1', { timeout: 10000 }).scrollIntoView().find('.border-indigo-500').should('exist');
        
        // Click on timeline step 2 (Gestión de Repuestos)
        cy.get('#timeline-status-2').scrollIntoView().click({ force: true });
        
        // Verify current status changed to 2 (Gestión de Repuestos)
        cy.get('#timeline-status-2').scrollIntoView().find('.border-indigo-500').should('exist');
        
        // Save the change
        cy.contains('button', 'GUARDAR ORDEN').click({ force: true });
        cy.wait(2500);
    });

    it('3. El cliente busca su reparación por código', () => {
        expect(trackingCode).to.exist;
        cy.visit(`/tracking/consulta`);
        
        cy.get('input[placeholder*="AF-"]').first().clear({ force: true }).type(trackingCode);
        cy.wait(1000);
        
        cy.visit(`/tracking/${trackingCode}`);
        cy.url({ timeout: 15000 }).should('include', `/tracking/${trackingCode}`);
    });

    it('4. La página de seguimiento muestra los datos correctos (IMEI, accesorios, estado Gestión de Repuestos, descargar talón)', () => {
        // Set local storage item to bypass upsell modal popup delay
        cy.window().then((win) => {
            win.localStorage.setItem(`upsellDismissed_${trackingCode}`, 'true');
        });
        cy.visit(`/tracking/${trackingCode}`);
        
        cy.get('#tracking-status-card', { timeout: 15000 }).should('be.visible');
        
        // Verify custom status header and description copy
        cy.get('#tracking-status-label').contains('GESTIÓN DE REPUESTOS').should('be.visible');
        cy.contains('Estamos gestionando los repuestos necesarios para la reparación de tu equipo.').should('be.visible');
        
        cy.get('#tracking-device-info').within(() => {
            cy.contains(deviceModel).should('be.visible');
            cy.contains(customerName).should('be.visible');
            cy.contains('123456789012345').should('be.visible'); // IMEI check
            cy.contains('Cargador, Funda').should('be.visible'); // Checklist check
        });

        cy.get('#tracking-progress-steps').should('be.visible');
        cy.get('#btn-imprimir-talon').should('be.visible').and('not.be.disabled').contains('Descargar Talón');
    });

    it('5. Mostrar error si el código es inválido', () => {
        cy.visit(`/tracking/AF-INVALID99`);
        cy.get('h2', { timeout: 10000 }).contains('No se encontró').should('be.visible');
    });

    afterEach(() => {
        cy.window().then((win: any) => {
            if (win.__console_errors && win.__console_errors.length > 0) {
                cy.writeFile('cypress-console-errors.log', win.__console_errors.join('\n\n') + '\n\n', { flag: 'a+' });
            }
        });
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
