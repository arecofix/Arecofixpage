import { RxjsEventBusService } from '../../infrastructure/events/rxjs-event-bus.service';
import { SupplierRepository, SupplierPaymentDto } from '../../domain/repositories/supplier.repository';
import { OnPurchaseRegisteredSupplierHandler } from './handlers/on-purchase-registered.handler';
import { OnSupplierPaymentMadeSupplierHandler } from './handlers/on-supplier-payment-made.handler';
import { PurchaseRegisteredEvent } from '../../domain/events/purchase-registered.event';
import { SupplierPaymentMadeEvent } from '../../domain/events/supplier-payment-made.event';
import { SaleCompletedEvent } from '../../domain/events/sale-completed.event';

class MockSupplierRepository extends SupplierRepository {
  public suppliers: Record<string, { id: string; name: string; balance: number }> = {
    'supp-1': { id: 'supp-1', name: 'Proveedor Uno', balance: 0 },
    'supp-2': { id: 'supp-2', name: 'Proveedor Dos', balance: 50000 },
  };

  public registeredPayments: SupplierPaymentDto[] = [];
  public updatedAccountStatuses: any[] = [];

  async registerPayment(supplierId: string, payment: SupplierPaymentDto): Promise<void> {
    this.registeredPayments.push(payment);
    if (this.suppliers[supplierId]) {
      this.suppliers[supplierId].balance -= payment.amount;
    }
  }

  async updateBalance(supplierId: string, deltaAmount: number): Promise<void> {
    if (this.suppliers[supplierId]) {
      this.suppliers[supplierId].balance += deltaAmount;
    }
  }

  async updateAccountStatus(
    supplierId: string,
    purchaseId: string,
    amount: number,
    paymentStatus: 'pending' | 'paid'
  ): Promise<void> {
    this.updatedAccountStatuses.push({ supplierId, purchaseId, amount, paymentStatus });
    if (paymentStatus === 'pending' && this.suppliers[supplierId]) {
      this.suppliers[supplierId].balance += amount;
    }
  }

  async getById(id: string): Promise<unknown> {
    return this.suppliers[id] || null;
  }
}

describe('5.5 Flujo Compra → Proveedores', () => {
  let eventBus: RxjsEventBusService;
  let supplierRepo: MockSupplierRepository;
  let purchaseHandler: OnPurchaseRegisteredSupplierHandler;
  let paymentHandler: OnSupplierPaymentMadeSupplierHandler;

  beforeEach(() => {
    eventBus = new RxjsEventBusService();
    supplierRepo = new MockSupplierRepository();

    purchaseHandler = new OnPurchaseRegisteredSupplierHandler(supplierRepo, eventBus);
    paymentHandler = new OnSupplierPaymentMadeSupplierHandler(supplierRepo, eventBus);

    purchaseHandler.register();
    paymentHandler.register();
  });

  it('PurchaseRegisteredEvent actualiza el saldo del proveedor (aumenta saldo pendiente si pending)', async () => {
    const event = new PurchaseRegisteredEvent(
      'purch-1',
      'supp-1',
      'Proveedor Uno',
      [],
      40000,
      8400,
      48400,
      'transfer',
      'pending',
      new Date(),
    );

    eventBus.publish(event);
    await Promise.resolve();

    expect(supplierRepo.updatedAccountStatuses.length).toBe(1);
    expect(supplierRepo.updatedAccountStatuses[0].amount).toBe(48400);
    expect(supplierRepo.updatedAccountStatuses[0].paymentStatus).toBe('pending');
    expect(supplierRepo.suppliers['supp-1'].balance).toBe(48400);
  });

  it('SupplierPaymentMadeEvent reduce el saldo pendiente del proveedor', async () => {
    // Initial balance is 50000
    expect(supplierRepo.suppliers['supp-2'].balance).toBe(50000);

    const event = new SupplierPaymentMadeEvent(
      'supp-2',
      'purch-old',
      20000,
      'transfer',
      new Date(),
    );

    eventBus.publish(event);
    await Promise.resolve();

    expect(supplierRepo.registeredPayments.length).toBe(1);
    expect(supplierRepo.registeredPayments[0].amount).toBe(20000);
    expect(supplierRepo.suppliers['supp-2'].balance).toBe(30000);
  });

  it('Regla: El proveedor no se actualiza por SaleCompletedEvent ni por eventos de ventas', async () => {
    const initialBalanceSupp1 = supplierRepo.suppliers['supp-1'].balance;
    const initialBalanceSupp2 = supplierRepo.suppliers['supp-2'].balance;

    const saleEvent = new SaleCompletedEvent(
      'sale-xyz',
      [],
      100000,
      0,
      100000,
      'cash',
      null,
      false,
      new Date(),
    );

    eventBus.publish(saleEvent);
    await Promise.resolve();

    expect(supplierRepo.registeredPayments.length).toBe(0);
    expect(supplierRepo.updatedAccountStatuses.length).toBe(0);
    expect(supplierRepo.suppliers['supp-1'].balance).toBe(initialBalanceSupp1);
    expect(supplierRepo.suppliers['supp-2'].balance).toBe(initialBalanceSupp2);
  });
});
