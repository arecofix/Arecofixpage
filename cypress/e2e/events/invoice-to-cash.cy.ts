import { InvoiceIssuedEvent } from '../../../src/app/domain/events/invoice-issued.event';

describe('Event-Driven: Factura -> Caja (InvoiceIssuedEvent -> CashMovements)', () => {
  beforeEach(() => {
    cy.loginRealAdmin('/admin/finance/cash-movements');
    cy.get('body[data-angular-ready="true"]', { timeout: 15000 }).should('exist');
  });

  it('Factura manual crea ingreso en caja', () => {
    cy.intercept('POST', '**/rest/v1/cash_movements*').as('postCash');

    cy.window().then((win: any) => {
      const eventBus = win.__EVENT_BUS__;
      expect(eventBus).to.exist;

      const event = new InvoiceIssuedEvent(
        'inv-man-1',
        '0001-00000055',
        'B',
        'manual', // origin manual
        {
          id: 'cust-001',
          name: 'Juan Pérez',
          taxId: '20301234567',
          taxCondition: 'CONSUMIDOR_FINAL',
          address: 'Calle 1',
          email: 'juan@test.com',
          phone: '123',
        },
        50000,
        'cash',
        new Date()
      );

      eventBus.publish(event);
    });

    cy.wait('@postCash').then((interception) => {
      expect(interception.request.body.type.toLowerCase()).to.equal('income');
      expect(interception.request.body.amount).to.equal(50000);
      expect(interception.request.body.notes || interception.request.body.concept).to.equal('Factura #0001-00000055');
      expect(interception.request.body.reference_id || interception.request.body.sourceEventId).to.equal('inv-man-1');
    });
  });

  it('Factura originada en venta/orden/reparación NO crea ingreso (previene doble contabilización)', () => {
    let callOccurred = false;
    cy.intercept('POST', '**/rest/v1/cash_movements*', () => {
      callOccurred = true;
    });

    cy.window().then((win: any) => {
      const eventBus = win.__EVENT_BUS__;
      const origins: Array<'sale' | 'order' | 'repair'> = ['sale', 'order', 'repair'];

      origins.forEach((origin, idx) => {
        const event = new InvoiceIssuedEvent(
          `inv-nodouble-${idx}`,
          `0001-000000${60 + idx}`,
          'B',
          origin,
          {
            id: 'cust-001',
            name: 'Juan Pérez',
            taxId: '20301234567',
            taxCondition: 'CONSUMIDOR_FINAL',
            address: 'Calle 1',
            email: 'juan@test.com',
            phone: '123',
          },
          30000,
          'cash',
          new Date()
        );
        eventBus.publish(event);
      });
    });

    cy.wait(500).then(() => {
      expect(callOccurred).to.be.false;
    });
  });

  it('Idempotencia: emitir el mismo evento de factura dos veces no duplica el ingreso', () => {
    let calls = 0;
    cy.intercept('POST', '**/rest/v1/cash_movements*', () => {
      calls++;
    }).as('postCash');

    cy.window().then((win: any) => {
      const eventBus = win.__EVENT_BUS__;
      const event = new InvoiceIssuedEvent(
        'inv-idemp-1',
        '0001-00000070',
        'B',
        'manual',
        {
          id: 'cust-001',
          name: 'Juan Pérez',
          taxId: '20301234567',
          taxCondition: 'CONSUMIDOR_FINAL',
          address: 'Calle 1',
          email: 'juan@test.com',
          phone: '123',
        },
        20000,
        'cash',
        new Date()
      );

      eventBus.publish(event);
      eventBus.publish(event);
    });

    cy.wait('@postCash').then(() => {
      cy.wait(400).then(() => {
        expect(calls).to.equal(1);
      });
    });
  });
});
