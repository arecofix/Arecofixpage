import { CreateInvoiceDraftFromRepairOrderUseCase } from './create-invoice-draft-from-repair-order.usecase';
import { InvoiceRepository } from '../repositories/invoice.repository';
import { Invoice } from '../entities/invoice.entity';
import { ArcaEmitterData } from '../entities/arca.entity';
import {
  RepairOrderReadyForInvoicingPayload,
  RepairOrderCancelledPayload,
  RepairOrderRolledBackPayload,
} from '@app/features/repairs/domain/events/repair-order-ready-for-invoicing.event';
import { ValidateArcaInvoiceUseCase } from './validate-arca-invoice.usecase';

describe('CreateInvoiceDraftFromRepairOrderUseCase & ARCA Integration', () => {
  let useCase: CreateInvoiceDraftFromRepairOrderUseCase;
  let mockInvoiceRepo: jest.Mocked<InvoiceRepository>;

  const defaultEmitterMonotributo: ArcaEmitterData = {
    businessName: 'ARECOFIX TALLER MONOTRIBUTO',
    cuit: '20-33445566-7',
    commercialAddress: 'San Antonio de Areco, Buenos Aires',
    vatCondition: 'monotributo',
    iibb: '20-33445566-7',
    activityStartDate: '01/01/2022',
    pointOfSale: '00001',
  };

  const defaultEmitterRI: ArcaEmitterData = {
    businessName: 'ARECOFIX SA RESPONSABLE INSCRIPTO',
    cuit: '30-71649281-9',
    commercialAddress: 'San Antonio de Areco, Buenos Aires',
    vatCondition: 'responsable_inscripto',
    iibb: '30-71649281-9',
    activityStartDate: '01/01/2020',
    pointOfSale: '00004',
  };

  const samplePayload: RepairOrderReadyForInvoicingPayload = {
    repairOrderId: 'rep-101',
    trackingCode: 'TRACK-101',
    customerSnapshot: {
      customerId: 'cust-1',
      name: 'Juan Perez',
      taxId: '20-12345678-9',
      email: 'juan@example.com',
      phone: '1122334455',
      address: 'Calle Falsa 123',
    },
    itemsSnapshot: [
      {
        type: 'labor',
        description: 'Mano de obra cambio de módulo',
        quantity: 1,
        unitPrice: 15000,
        taxRate: 0.21,
        subtotal: 15000,
        isLabor: true,
      },
      {
        id: 'part-1',
        productId: 'prod-screen',
        type: 'part',
        description: 'Pantalla OLED iPhone 11',
        quantity: 1,
        unitPrice: 45000,
        taxRate: 0.21,
        subtotal: 45000,
        isLabor: false,
      },
    ],
    totalsSnapshot: {
      technicalLaborCost: 15000,
      sparePartsCost: 45000,
      surchargePercentage: 10,
      surchargeAmount: 6000,
      depositAmount: 20000,
      totalAmount: 66000,
      balanceDue: 46000,
    },
    issuedAt: '2026-10-12T10:00:00.000Z',
    warranty: '90 días sobre repuesto y mano de obra',
    paymentMethod: 'transferencia',
    notes: 'Detalles menores en carcasa',
    technicalReport: 'Módulo cambiado exitosamente y testeado',
    tenantId: 'tenant-arecofix',
  };

  beforeEach(() => {
    mockInvoiceRepo = {
      getAll: jest.fn(),
      getCount: jest.fn(),
      getById: jest.fn(),
      getByOrderId: jest.fn(),
      getByRepairId: jest.fn(),
      getDraftCount: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      getLineItems: jest.fn(),
    } as unknown as jest.Mocked<InvoiceRepository>;

    useCase = new CreateInvoiceDraftFromRepairOrderUseCase(mockInvoiceRepo);
  });

  // ── 1. Happy Path ───────────────────────────────────────────────────────────
  it('1. Caso feliz: debe crear un borrador de factura (status: "draft") precargado cuando no existe factura previa', async () => {
    mockInvoiceRepo.getByRepairId.mockResolvedValue(null);
    mockInvoiceRepo.create.mockImplementation(async (data: any) => ({
      data: { id: 'inv-draft-1', ...data } as Invoice,
      error: null,
    }));

    const result = await useCase.execute(samplePayload, defaultEmitterMonotributo);

    expect(result.isNew).toBe(true);
    expect(result.updated).toBe(false);
    expect(result.unchanged).toBe(false);
    expect(mockInvoiceRepo.getByRepairId).toHaveBeenCalledWith('rep-101', 'tenant-arecofix');
    expect(mockInvoiceRepo.create).toHaveBeenCalled();

    const created = result.invoice;
    expect(created.status).toBe('draft');
    expect(created.repair_id).toBe('rep-101');
    expect(created.customer_name).toBe('Juan Perez');
    expect(created.notes).toContain('Garantía otorgada: 90 días');
    expect(created.items?.length).toBeGreaterThanOrEqual(3); // Labor + Part + Surcharge
  });

  // ── 2. Idempotency & Duplicate Prevention ───────────────────────────────────
  it('2. Idempotencia: no debe duplicar la factura si el evento se emite dos veces; debe actualizar el borrador existente', async () => {
    const existingDraft: Invoice = {
      id: 'inv-existing-1',
      type: 'C',
      origin: 'repair',
      status: 'draft',
      subtotal: 50000,
      tax_amount: 0,
      discount: 0,
      total_amount: 50000,
      repair_id: 'rep-101',
      issued_at: '2026-10-12T09:00:00Z',
      created_at: '2026-10-12T09:00:00Z',
    };

    mockInvoiceRepo.getByRepairId.mockResolvedValue(existingDraft);
    mockInvoiceRepo.update.mockImplementation(async (id: string, partial: any) => ({
      data: { ...existingDraft, ...partial } as Invoice,
      error: null,
    }));

    const result = await useCase.execute(samplePayload, defaultEmitterMonotributo);

    expect(result.isNew).toBe(false);
    expect(result.updated).toBe(true);
    expect(result.unchanged).toBe(false);
    expect(mockInvoiceRepo.create).not.toHaveBeenCalled();
    expect(mockInvoiceRepo.update).toHaveBeenCalledWith('inv-existing-1', expect.objectContaining({
      status: 'draft',
      repair_order_id: 'rep-101',
    }));
  });

  // ── 3. Confirmed/Issued Invoices Immutability ────────────────────────────────
  it('3. Inmutabilidad: si la factura ya está "confirmed" o "issued", no debe modificarse', async () => {
    const confirmedInvoice: Invoice = {
      id: 'inv-confirmed-1',
      type: 'C',
      origin: 'repair',
      status: 'confirmed',
      subtotal: 60000,
      tax_amount: 0,
      discount: 0,
      total_amount: 60000,
      repair_id: 'rep-101',
      issued_at: '2026-10-12T09:00:00Z',
      created_at: '2026-10-12T09:00:00Z',
    };

    mockInvoiceRepo.getByRepairId.mockResolvedValue(confirmedInvoice);

    const result = await useCase.execute(samplePayload, defaultEmitterMonotributo);

    expect(result.isNew).toBe(false);
    expect(result.updated).toBe(false);
    expect(result.unchanged).toBe(true);
    expect(mockInvoiceRepo.create).not.toHaveBeenCalled();
    expect(mockInvoiceRepo.update).not.toHaveBeenCalled();
    expect(result.invoice.id).toBe('inv-confirmed-1');
  });

  // ── 4. Order Cancelled (Void draft) ─────────────────────────────────────────
  it('4. Orden Cancelada: debe marcar el borrador como "voided" automáticamente', async () => {
    const existingDraft: Invoice = {
      id: 'inv-to-void',
      type: 'C',
      origin: 'repair',
      status: 'draft',
      subtotal: 50000,
      tax_amount: 0,
      discount: 0,
      total_amount: 50000,
      repair_id: 'rep-101',
      issued_at: '2026-10-12T09:00:00Z',
      created_at: '2026-10-12T09:00:00Z',
    };

    mockInvoiceRepo.getByRepairId.mockResolvedValue(existingDraft);
    mockInvoiceRepo.update.mockResolvedValue({ data: null, error: null });

    const cancelPayload: RepairOrderCancelledPayload = {
      repairOrderId: 'rep-101',
      cancelledAt: '2026-10-12T11:00:00Z',
      reason: 'Cliente rechazó presupuesto',
      tenantId: 'tenant-arecofix',
    };

    const voidResult = await useCase.handleOrderCancelled(cancelPayload);

    expect(voidResult.voided).toBe(true);
    expect(mockInvoiceRepo.update).toHaveBeenCalledWith('inv-to-void', expect.objectContaining({
      status: 'voided',
    }));
  });

  // ── 5. Order Rollback (Mark draft stale) ────────────────────────────────────
  it('5. Retroceso de estado: debe marcar el borrador como "stale" si la orden retrocede de LISTO_PARA_ENTREGAR', async () => {
    const existingDraft: Invoice = {
      id: 'inv-to-stale',
      type: 'C',
      origin: 'repair',
      status: 'draft',
      subtotal: 50000,
      tax_amount: 0,
      discount: 0,
      total_amount: 50000,
      repair_id: 'rep-101',
      issued_at: '2026-10-12T09:00:00Z',
      created_at: '2026-10-12T09:00:00Z',
    };

    mockInvoiceRepo.getByRepairId.mockResolvedValue(existingDraft);
    mockInvoiceRepo.update.mockResolvedValue({ data: null, error: null });

    const rollbackPayload: RepairOrderRolledBackPayload = {
      repairOrderId: 'rep-101',
      previousStatusId: 5, // READY_FOR_PICKUP
      newStatusId: 3,      // IN_PROGRESS
      rolledBackAt: '2026-10-12T11:30:00Z',
      tenantId: 'tenant-arecofix',
    };

    const staleResult = await useCase.handleOrderRolledBack(rollbackPayload);

    expect(staleResult.stale).toBe(true);
    expect(mockInvoiceRepo.update).toHaveBeenCalledWith('inv-to-stale', {
      status: 'stale',
    });
  });

  // ── 6. Fiscal Rule: Monotributista -> Factura C ─────────────────────────────
  it('6. Regla fiscal Monotributo: si el emisor es Monotributista, fuerza Factura C e IVA no discriminado (0)', async () => {
    mockInvoiceRepo.getByRepairId.mockResolvedValue(null);
    mockInvoiceRepo.create.mockImplementation(async (data: any) => ({
      data: { id: 'inv-mono-1', ...data } as Invoice,
      error: null,
    }));

    const result = await useCase.execute(samplePayload, defaultEmitterMonotributo);

    expect(result.invoice.type).toBe('C');
    expect(result.invoice.tax_amount).toBe(0);
    expect(result.invoice.items?.every((i) => i.tax_rate === 0)).toBe(true);
  });

  // ── 7. Fiscal Rule: Resp Inscripto + CUIT -> Factura A ──────────────────────
  it('7. Regla fiscal RI + CUIT: si el emisor es RI y el cliente tiene CUIT (11 dígitos), genera Factura A', async () => {
    mockInvoiceRepo.getByRepairId.mockResolvedValue(null);
    mockInvoiceRepo.create.mockImplementation(async (data: any) => ({
      data: { id: 'inv-ri-a', ...data } as Invoice,
      error: null,
    }));

    // Customer with 11-digit CUIT
    const payloadWithCuit: RepairOrderReadyForInvoicingPayload = {
      ...samplePayload,
      customerSnapshot: {
        ...samplePayload.customerSnapshot,
        taxId: '30-71122334-4',
        vatCondition: 'responsable_inscripto',
      },
    };

    const result = await useCase.execute(payloadWithCuit, defaultEmitterRI);

    expect(result.invoice.type).toBe('A');
    expect(result.invoice.tax_amount).toBeGreaterThan(0);
  });

  // ── 8. Fiscal Rule: Resp Inscripto + Consumidor Final -> Factura B ──────────
  it('8. Regla fiscal RI + Consumidor Final: si el cliente es Consumidor Final (DNI), genera Factura B', async () => {
    mockInvoiceRepo.getByRepairId.mockResolvedValue(null);
    mockInvoiceRepo.create.mockImplementation(async (data: any) => ({
      data: { id: 'inv-ri-b', ...data } as Invoice,
      error: null,
    }));

    // Customer with 8-digit DNI (Consumidor Final)
    const payloadWithDni: RepairOrderReadyForInvoicingPayload = {
      ...samplePayload,
      customerSnapshot: {
        ...samplePayload.customerSnapshot,
        taxId: '38123456',
        vatCondition: 'consumidor_final',
      },
    };

    const result = await useCase.execute(payloadWithDni, defaultEmitterRI);

    expect(result.invoice.type).toBe('B');
  });

  // ── 9. Advance Payment & Balance Due Handling ────────────────────────────────
  it('9. Seña/Cobrado: se registra como advance_payment y se descuenta del saldo a cobrar; NO es un ítem de factura', async () => {
    mockInvoiceRepo.getByRepairId.mockResolvedValue(null);
    mockInvoiceRepo.create.mockImplementation(async (data: any) => ({
      data: { id: 'inv-advance-1', ...data } as Invoice,
      error: null,
    }));

    const result = await useCase.execute(samplePayload, defaultEmitterMonotributo);

    // advance_payment is $20,000; total is $66,000; balance_due is $46,000
    expect(result.invoice.advance_payment).toBe(20000);
    expect(result.invoice.balance_due).toBe(46000);

    // Verify seña is NOT added as a line item
    const hasAdvanceLineItem = result.invoice.items?.some((i) =>
      i.description.toLowerCase().includes('seña') || i.description.toLowerCase().includes('anticipo')
    );
    expect(hasAdvanceLineItem).toBe(false);
  });

  // ── 10. ARCA Threshold Validation at Confirmation ───────────────────────────
  it('10. Validación de umbrales ARCA: un cliente Consumidor Final sin DNI/CUIT superando $208.644 en efectivo es rechazado al confirmar', () => {
    // RG 5616 Threshold: $208.644 for un-identified cash customers
    const validationResult = ValidateArcaInvoiceUseCase.execute({
      type: 'B',
      customer: {
        docType: 'DNI',
        docNumber: '', // Unidentified
        name: '',
        address: '',
        vatCondition: 'Consumidor Final',
      },
      items: [
        {
          description: 'Servicio técnico avanzado',
          quantity: 1,
          unit_price: 250000,
          tax_rate: 0.21,
        },
      ],
      paymentMethod: 'cash',
      grandTotal: 250000,
    });

    expect(validationResult.isValid).toBe(false);
    expect(validationResult.errors.length).toBeGreaterThan(0);
    expect(validationResult.errors[0]).toContain('208.644');
  });
});
