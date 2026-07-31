import { PublicRepairDto } from '../../../src/app/features/repairs/domain/dtos/public-repair.dto';

describe('Repair Tracking Flow', () => {
  beforeEach(() => {
    // Intercept Supabase tenant checks
    cy.intercept('GET', '**/rest/v1/tenants*', {
      statusCode: 200,
      body: [{ id: 'mock-tenant-id', name: 'Arecofix', is_active: true }]
    }).as('tenantCheck');

    // Intercept RPC call for tracking
    cy.intercept('POST', '**/rest/v1/rpc/get_repair_tracking', (req) => {
      const code = req.body?.p_code;
      if (code === 'TEST1234') {
        req.reply({
          statusCode: 200,
          body: [{
            tracking_code: 'TEST1234',
            device_model: 'iPhone 13 Pro',
            current_status_id: 3,
            received_at: new Date().toISOString(),
            created_at: new Date().toISOString(),
            issue_description: 'Pantalla rota',
            estimated_cost: 50000,
            final_cost: 50000,
            deposit_amount: 10000,
            repair_number: 1001,
            customer_name: 'Juan Perez',
            technical_report: 'Se cambió módulo completo.',
            technician_notes: null,
            glass_upsell: true,
            imei: '358910000000000',
            checklist: {}
          }]
        });
      } else {
        req.reply({
          statusCode: 200,
          body: []
        });
      }
    }).as('getTracking');
  });

  it('Debería mostrar error si el código de seguimiento no existe', () => {
    cy.visit('/tracking/INVALIDO');
    cy.wait('@getTracking');
    
    cy.get('h2').contains('No se encontró ninguna reparación con este código.').should('be.visible');
  });

  it('Debería mostrar la información de la reparación si el código es válido', () => {
    cy.visit('/tracking/TEST1234');
    cy.wait('@getTracking');
    
    // Validar nombre del cliente y equipo asegurando que existan en el DOM (puede haber duplicados por diseño mobile/desktop)
    cy.contains('Juan Perez').should('exist');
    cy.contains('iPhone 13 Pro').should('exist');
    
    // Validar el estado
    cy.contains('En Reparación').should('exist');
    
    // Validar costos (40000 es el balance_to_pay)
    cy.contains('40000').should('exist');
  });
});
