/**
 * E2E Test Suite: Repair Tracking Flow
 *
 * Validates the complete tracking UI/UX flow:
 * 1. Lookup page renders correctly
 * 2. Search input navigates to the tracking code URL
 * 3. Invalid code shows error state
 * 4. Valid repair shows device details, progress steps, tech report, payment card
 * 5. Cancelled repair shows the cancelled banner
 * 6. Print ticket (talon) button is present
 * 7. Admin notify modal: button appears, opens modal with statuses, sends notification
 */

const TRACKING_URL = '/tracking';
const MOCK_TRACKING_CODE = 'AF-TEST01';
const MOCK_CANCELLED_CODE = 'AF-CANCEL';

function buildRepairMock(overrides = {}) {
    return {
        id: 'mock-repair-id-001',
        tracking_code: MOCK_TRACKING_CODE,
        repair_number: 1042,
        customer_name: 'Juan Perez',
        customer_phone: '1155667788',
        device_model: 'Samsung Galaxy A54',
        device_type: 'smartphone',
        issue_description: 'Pantalla rota y no enciende',
        technical_report: 'Se reemplazó el módulo de pantalla completo.',
        current_status_id: 3,
        status_label: 'EN REPARACIÓN',
        status_color: 'bg-blue-100 text-blue-800 border-blue-200',
        estimated_cost: 25000,
        final_cost: 22000,
        deposit_amount: 5000,
        balance_to_pay: 17000,
        received_at: new Date().toISOString(),
        images: [],
        upsell_vidrio: false,
        ...overrides
    };
}

function interceptRepairLookup(code, mockData) {
    cy.intercept('POST', '**/rpc/get_repair_tracking*', {
        statusCode: 200,
        body: [mockData]
    }).as('getRepairByCode');
}

function interceptInventory() {
    cy.intercept('GET', '**/rest/v1/inventory*', { statusCode: 200, body: [] }).as('getInventory');
}

describe('Repair Tracking Flow', () => {

    describe('1. Lookup Mode (no code in URL)', () => {
        beforeEach(() => {
            cy.visit(`${TRACKING_URL}/consulta`);
        });

        it('should display the search form', () => {
            cy.get('h2').contains('Seguimiento de Reparación', { timeout: 15000 }).should('be.visible');
            cy.get('input[placeholder*="AF-"]').first().should('be.visible');
            cy.contains('button', 'Consultar Estado').should('be.visible');
        });

        it('should disable submit button when input is empty', () => {
            cy.contains('button', 'Consultar Estado').should('be.disabled');
        });

        it('should enable submit button when code is typed', () => {
            cy.get('input[placeholder*="AF-"]').first().clear().wait(100).type('AF-999');
            cy.contains('button', 'Consultar Estado').should('not.be.disabled');
        });

        it('should navigate to /tracking/:code on submit', () => {
            cy.intercept('POST', '**/rpc/get_repair_tracking*', { statusCode: 200, body: [] });
            cy.get('input[placeholder*="AF-"]').first().type('{selectall}{backspace}AF-DEMO', { delay: 10 });
            cy.wait(500);
            cy.contains('button', 'Consultar Estado', { timeout: 10000 }).should('not.be.disabled').click({ force: true });
            cy.url({ timeout: 15000 }).should('include', '/tracking/');
            cy.url().should('include', 'AF-DEMO');
        });
    });

    describe('2. Error State (code not found)', () => {
        it('should show error message for invalid code', () => {
            cy.intercept('POST', '**/rpc/get_repair_tracking*', { statusCode: 200, body: [] }).as('repairEmpty');
            cy.visit(`${TRACKING_URL}/AF-INVALID99`);
            cy.wait('@repairEmpty', { timeout: 10000 });
            cy.get('h2').contains('No se encontró ninguna reparación').should('be.visible');
        });

        it('should show WhatsApp support link in error state', () => {
            cy.intercept('POST', '**/rpc/get_repair_tracking*', { statusCode: 200, body: [] });
            cy.visit(`${TRACKING_URL}/AF-INVALID99`);
            cy.contains('Soporte Directo').should('exist');
        });
    });

    describe('3. Valid Repair - In Progress (status 3)', () => {
        const mockRepair = buildRepairMock();

        beforeEach(() => {
            interceptRepairLookup(MOCK_TRACKING_CODE, mockRepair);
            interceptInventory();
            cy.intercept('GET', '**/rest/v1/products**', { statusCode: 200, body: [] });
            cy.visit(`${TRACKING_URL}/consulta`);
            // Add a wait to ensure the component is fully loaded before typing, avoiding early submission issues
            cy.get('input[placeholder*="AF-"]').first().should('be.visible').clear().type(MOCK_TRACKING_CODE, { delay: 50 }).trigger('input').trigger('change');
            cy.contains('button', 'Consultar Estado').click({ force: true });
            cy.wait('@getRepairByCode', { timeout: 12000 });
        });

        it('should display status card with correct label', () => {
            cy.get('#tracking-status-card').should('be.visible');
            cy.get('#tracking-status-label').should('contain.text', 'EN REPARACIÓN');
        });

        it('should render 5 named progress steps', () => {
            cy.get('#tracking-progress-steps').should('be.visible');
            cy.get('#tracking-step-1').should('exist');
            cy.get('#tracking-step-2').should('exist');
            cy.get('#tracking-step-3').should('exist');
            cy.get('#tracking-step-4').should('exist');
            cy.get('#tracking-step-5').should('exist');
        });

        it('should highlight completed steps (status 3)', () => {
            cy.get('#tracking-step-1').should('have.class', 'bg-primary');
            cy.get('#tracking-step-2').should('have.class', 'bg-primary');
            cy.get('#tracking-step-3').should('have.class', 'bg-primary');
            cy.get('#tracking-step-4').should('not.have.class', 'bg-primary');
        });

        it('should display device info correctly', () => {
            cy.get('#tracking-device-info').within(() => {
                cy.contains('Samsung Galaxy A54').should('be.visible');
                cy.contains('Juan Perez').should('be.visible');
                cy.contains('1042').should('be.visible');
                cy.contains(MOCK_TRACKING_CODE).should('be.visible');
                cy.contains('Pantalla rota').should('be.visible');
            });
        });

        it('should display the technician report', () => {
            cy.get('#tracking-tech-report').should('be.visible');
            cy.contains('reemplazó el módulo').should('be.visible');
        });

        it('should show payment card with balance', () => {
            cy.get('#tracking-payment-card').should('be.visible');
            cy.contains('17000').should('be.visible');
        });

        it('should have the print talon button', () => {
            cy.get('#btn-imprimir-talon').should('be.visible').and('not.be.disabled');
        });

        it('should have the WhatsApp chat button', () => {
            cy.get('#btn-chat-whatsapp')
                .should('be.visible')
                .and('have.attr', 'href')
                .and('include', 'wa.me');
        });
    });

    describe('4. Cancelled Repair (status 7)', () => {
        const cancelledRepair = buildRepairMock({
            tracking_code: MOCK_CANCELLED_CODE,
            current_status_id: 7,
            status_label: 'CANCELADO',
            status_color: 'bg-rose-100 text-rose-800 border-rose-200'
        });

        beforeEach(() => {
            interceptRepairLookup(MOCK_CANCELLED_CODE, cancelledRepair);
            interceptInventory();
            cy.intercept('GET', '**/rest/v1/products**', { statusCode: 200, body: [] });
            cy.visit(`${TRACKING_URL}/consulta`);
            cy.get('input[placeholder*="AF-"]').first().type('{selectall}{backspace}' + MOCK_CANCELLED_CODE, { delay: 10 });
            cy.wait(500);
            cy.contains('button', 'Consultar Estado').should('not.be.disabled').click({ force: true });
            cy.wait('@getRepairByCode', { timeout: 12000 });
        });

        it('should display the cancelled banner', () => {
            cy.get('#tracking-cancelled-banner').should('be.visible');
            cy.contains('Reparación Cancelada').should('be.visible');
            cy.contains('coordinar el retiro').should('be.visible');
        });

        it('should NOT render progress steps for cancelled repairs', () => {
            cy.get('#tracking-progress-steps').should('not.exist');
        });

        it('should still show device info and payment card', () => {
            cy.get('#tracking-device-info').should('be.visible');
            cy.get('#tracking-payment-card').should('be.visible');
        });

        it('should still have print talon button', () => {
            cy.get('#btn-imprimir-talon').should('be.visible');
        });
    });

    describe('5. Admin - Notify Client Modal', () => {
        const MOCK_REPAIR_ID = 'mock-repair-admin-001';

        beforeEach(() => {
            cy.intercept('GET', '**/rest/v1/repairs*id=eq.*', {
                statusCode: 200,
                body: [{
                    id: MOCK_REPAIR_ID,
                    tracking_code: 'AF-ADMIN01',
                    repair_number: 555,
                    customer_name: 'Maria Garcia',
                    customer_phone: '1188990011',
                    customer_email: 'maria@test.com',
                    device_model: 'iPhone 13',
                    device_type: 'smartphone',
                    issue_description: 'Bateria agotada',
                    current_status_id: 1,
                    estimated_cost: 15000,
                    final_cost: 0,
                    deposit_amount: 0,
                    branch_id: 'mock-branch',
                    technician_notes: '',
                    technical_report: '',
                    images: [],
                    parts: [],
                    checklist: { charger: false, battery: false, chip: false, sd: false, case: false },
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                }]
            }).as('getRepairForm');

            cy.intercept('GET', '**/rest/v1/products**', { statusCode: 200, body: [] });
            cy.intercept('GET', '**/rest/v1/brands**', { statusCode: 200, body: [] });
            cy.intercept('GET', '**/rest/v1/profiles**', { statusCode: 200, body: [] });
            cy.intercept('GET', '**/rest/v1/customers**', { statusCode: 200, body: [] });
            cy.intercept('GET', '**/rest/v1/clients**', { statusCode: 200, body: [] });
            cy.intercept('GET', '**/rest/v1/company_settings**', { statusCode: 200, body: [{ id: 1 }] });
            cy.intercept('POST', '**/rpc/get_recent_clients*', { statusCode: 200, body: [] });
            cy.intercept('POST', '**/rpc/get_recent_customers*', { statusCode: 200, body: [] });
            cy.intercept('GET', '**/rest/v1/branches**', {
                statusCode: 200,
                body: [{ id: 'mock-branch', name: 'Eco Cell Central', modules_config: {} }]
            });

            // NOW visit (loginRealAdmin) AFTER intercepts are registered
            cy.loginRealAdmin(`/admin/repairs/${MOCK_REPAIR_ID}`);
            cy.wait('@getRepairForm', { timeout: 15000 });
        });

        it('should show the Notificar Cliente button in the header', () => {
            cy.get('#btn-notificar-cliente', { timeout: 10000 }).should('be.visible');
        });

        it('should open the notify modal when clicking the button', () => {
            cy.wait(500);
            cy.get('#btn-notificar-cliente').scrollIntoView().should('be.visible').click();
            cy.get('h3.font-bold').contains('Notificar Estado al Cliente').should('exist');
            cy.get('#notify-status-list').should('exist');
            cy.get('#btn-cerrar-notify-modal').click({ force: true });
        });

        it('should display the available status options in the modal', () => {
            cy.wait(500);
            cy.get('#btn-notificar-cliente').should('be.visible').click();
            cy.get('#notify-modal').should('be.visible');
            cy.get('#notify-status-5').should('contain.text', 'Listo');
            cy.get('#notify-status-6').should('contain.text', 'Entregado');
            cy.get('#notify-status-2').should('contain.text', 'En Presupuesto');
        });

        it('should show message preview when a status is selected', () => {
            cy.wait(500);
            cy.get('#btn-notificar-cliente').should('be.visible').click();
            cy.get('#notify-modal').should('be.visible');
            cy.get('#notify-status-5').should('be.visible').click();
            cy.get('#notify-message-preview').should('be.visible');
            cy.get('#notify-message-preview').should('contain.text', 'listo para retirar');
        });

        it('should send WhatsApp notification when clicking Enviar', () => {
            cy.wait(500);
            cy.get('#btn-notificar-cliente').should('be.visible').click();
            cy.get('#notify-modal').should('be.visible');
            cy.get('#notify-status-5').should('be.visible').click();

            cy.window().then((win) => {
                cy.stub(win, 'open').as('waOpen');
            });

            cy.get('#btn-enviar-notificacion').should('not.be.disabled').scrollIntoView().click({ force: true });
            cy.get('@waOpen').should('have.been.calledOnce');
        });

        it('should close modal after sending notification', () => {
            cy.wait(500);
            cy.get('#btn-notificar-cliente').should('be.visible').click();
            cy.get('#notify-modal').should('be.visible');
            cy.get('#notify-status-5').should('be.visible').click();

            cy.window().then((win) => {
                cy.stub(win, 'open').as('waOpen');
            });

            cy.get('#btn-enviar-notificacion').scrollIntoView().click({ force: true });
            cy.get('#notify-modal').should('not.exist');
        });

        it('should close modal when clicking X button', () => {
            cy.wait(500);
            cy.get('#btn-notificar-cliente').should('be.visible').click();
            cy.get('#notify-modal').should('be.visible');
            cy.get('#btn-cerrar-notify-modal').should('be.visible').click({ force: true });
            cy.get('#notify-modal').should('not.exist');
        });
    });
});
