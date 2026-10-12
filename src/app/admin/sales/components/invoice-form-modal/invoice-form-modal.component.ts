import {
  Component,
  inject,
  signal,
  computed,
  OnInit,
  output,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CompanyService, CompanySettings } from '@app/core/services/company.service';
import { ProductRepository } from '@app/features/products/domain/repositories/product.repository';
import { Product } from '@app/features/products/domain/entities/product.entity';
import {
  ARCA_CONSTANTS,
  ARCA_ITEM_TYPES,
  ARCA_PAYMENT_METHODS,
  ArcaCustomerData,
  ArcaDocType,
  ArcaEmitterData,
  ArcaInvoiceItem,
  ArcaInvoiceType,
  ArcaItemType,
  ArcaPaymentMethod,
  ArcaSaleCondition,
  ArcaVatCondition,
  ArcaVatRate,
} from '@app/features/sales/domain/entities/arca.entity';
import { CalculateArcaTotalsUseCase } from '@app/features/sales/domain/usecases/calculate-arca-totals.usecase';
import { ValidateArcaInvoiceUseCase } from '@app/features/sales/domain/usecases/validate-arca-invoice.usecase';
import { CreateInvoiceDto, InvoiceItem } from '@app/features/sales/domain/entities/invoice.entity';
import { NotificationService } from '@app/core/services/notification.service';
import { LoggerService } from '@app/core/services/logger.service';

export interface InvoiceFormItemRow {
  productId?: string;
  description: string;
  itemType: ArcaItemType;
  quantity: number;
  unitPrice: number;
  taxRate: ArcaVatRate;
}

const DEFAULT_ROW: InvoiceFormItemRow = {
  description: '',
  itemType: 'service',
  quantity: 1,
  unitPrice: 0,
  taxRate: 0.21,
};

@Component({
  selector: 'app-invoice-form-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './invoice-form-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InvoiceFormModalComponent implements OnInit {
  private companyService = inject(CompanyService);
  private productRepository = inject(ProductRepository);
  private notificationService = inject(NotificationService);
  private logger = inject(LoggerService);

  // Events
  closed = output<void>();
  invoiceCreated = output<CreateInvoiceDto>();

  // ── Emisor (Empresa) ────────────────────────────────────────────────────────
  emitter = signal<ArcaEmitterData>({
    businessName: 'ARECOFIX SERVICIOS INTEGRALES',
    cuit: '30-71649281-9',
    commercialAddress: 'Av. San Martín 450, San Antonio de Areco',
    vatCondition: 'IVA Responsable Inscripto',
    iibb: '30-71649281-9 (Conv. Multilateral)',
    activityStartDate: '01/03/2021',
    pointOfSale: '00004',
    phone: '',
    email: '',
    logoUrl: '',
  });

  // ── Form State ──────────────────────────────────────────────────────────────
  invoiceType = signal<ArcaInvoiceType>('B');
  issueDate = signal<string>(new Date().toISOString().substring(0, 10));
  saleCondition = signal<ArcaSaleCondition>('Contado');
  paymentMethod = signal<ArcaPaymentMethod>('cash');
  internalNotes = signal<string>('');
  fiscalNotes = signal<string>('');
  discount = signal<number>(0);

  // ── Customer State ──────────────────────────────────────────────────────────
  customer = signal<ArcaCustomerData>({
    name: 'Consumidor Final',
    docType: 'DNI',
    docNumber: '',
    vatCondition: 'Consumidor Final',
    address: '',
    email: '',
  });

  // ── Items State ─────────────────────────────────────────────────────────────
  items = signal<InvoiceFormItemRow[]>([{ ...DEFAULT_ROW }]);

  // ── Product Catalog Picker State ────────────────────────────────────────────
  isCatalogOpen = signal<boolean>(false);
  catalogProducts = signal<Product[]>([]);
  catalogSearch = signal<string>('');
  catalogLoading = signal<boolean>(false);

  // ── Options Metadata ────────────────────────────────────────────────────────
  itemTypes = Object.entries(ARCA_ITEM_TYPES).map(([id, meta]) => ({
    id: id as ArcaItemType,
    label: meta.label,
    icon: meta.icon,
  }));

  vatRates: Array<{ rate: ArcaVatRate; label: string }> = [
    { rate: 0.21, label: '21% (General)' },
    { rate: 0.105, label: '10.5% (Reducido)' },
    { rate: 0.27, label: '27% (Servicios/Eléctrico)' },
    { rate: 0, label: '0% (Exento)' },
  ];

  vatConditions: ArcaVatCondition[] = [
    'Consumidor Final',
    'IVA Responsable Inscripto',
    'Responsable Monotributo',
    'IVA Exento',
    'Sujeto No Categorizado',
  ];

  docTypes: ArcaDocType[] = ['DNI', 'CUIT', 'CUIL', 'Pasaporte', 'Sin Identificar'];

  paymentMethods = Object.values(ARCA_PAYMENT_METHODS);

  saleConditions: ArcaSaleCondition[] = [
    'Contado',
    'Cuenta Corriente',
    '15 Días',
    '30 Días',
    'Anticipado',
  ];

  // ── Computed Totals (Ley 27.743 y RG 5614/2024) ─────────────────────────────
  taxBreakdown = computed(() => {
    const list = this.items().map((i) => ({
      quantity: i.quantity,
      unit_price: i.unitPrice,
      tax_rate: i.taxRate,
    }));
    return CalculateArcaTotalsUseCase.execute(list, this.discount(), this.invoiceType());
  });

  // ── Computed ARCA Compliance Validation ─────────────────────────────────────
  arcaValidation = computed(() => {
    const totals = this.taxBreakdown();
    const cust = this.customer();
    const rows = this.items().map((i) => ({
      description: i.description,
      quantity: i.quantity,
      unit_price: i.unitPrice,
      tax_rate: i.taxRate,
    }));

    return ValidateArcaInvoiceUseCase.execute({
      type: this.invoiceType(),
      customer: cust,
      items: rows,
      paymentMethod: this.paymentMethod(),
      grandTotal: totals.grandTotal,
      emitterVatCondition: this.emitter().vatCondition,
    });
  });

  // Filtered Catalog List
  filteredProducts = computed(() => {
    const term = this.catalogSearch().toLowerCase().trim();
    if (!term) return this.catalogProducts().slice(0, 30);
    return this.catalogProducts()
      .filter(
        (p) =>
          p.name.toLowerCase().includes(term) ||
          (p.sku && p.sku.toLowerCase().includes(term))
      )
      .slice(0, 30);
  });

  async ngOnInit(): Promise<void> {
    await this.syncEmitterData();
    this.loadCatalogProducts();
  }

  /**
   * Sincroniza datos del emisor desde CompanyService / Tenant / Sucursal
   */
  async syncEmitterData(): Promise<void> {
    try {
      const company = await this.companyService.getSettings();
      if (company) {
        this.emitter.update((prev) => ({
          ...prev,
          businessName: company.name || prev.businessName,
          cuit: company.tax_id || prev.cuit,
          commercialAddress: company.address || company.location || prev.commercialAddress,
          vatCondition:
            (company as any).vat_condition || 'IVA Responsable Inscripto',
          iibb: (company as any).iibb || company.tax_id || prev.iibb,
          activityStartDate:
            (company as any).activity_start_date || prev.activityStartDate,
          pointOfSale: (company as any).point_of_sale || '00004',
          phone: company.phone || company.contact_phone || '',
          email: company.email || company.contact_email || '',
          logoUrl: company.logo_url || '',
        }));
      }
    } catch (e) {
      this.logger.warn('[InvoiceFormModal] Could not sync company settings', e);
    }
  }

  /**
   * Carga el catálogo de productos disponibles en el sistema
   */
  loadCatalogProducts(): void {
    this.catalogLoading.set(true);
    this.productRepository.findAvailable().subscribe({
      next: (products) => {
        this.catalogProducts.set(products || []);
        this.catalogLoading.set(false);
      },
      error: (e) => {
        this.logger.error('[InvoiceFormModal] Failed to load catalog products', e);
        this.catalogLoading.set(false);
      },
    });
  }

  // ── Customer Field Helpers ──────────────────────────────────────────────────
  updateCustomerField<K extends keyof ArcaCustomerData>(
    field: K,
    value: ArcaCustomerData[K]
  ): void {
    this.customer.update((c) => ({ ...c, [field]: value }));
  }

  onInvoiceTypeChange(newType: ArcaInvoiceType): void {
    this.invoiceType.set(newType);
    if (newType === 'A') {
      this.customer.update((c) => ({
        ...c,
        docType: 'CUIT',
        vatCondition: 'IVA Responsable Inscripto',
      }));
    } else if (newType === 'B' || newType === 'C') {
      if (this.customer().vatCondition === 'IVA Responsable Inscripto') {
        this.customer.update((c) => ({ ...c, vatCondition: 'Consumidor Final' }));
      }
    }
  }

  // ── Items Management ────────────────────────────────────────────────────────
  addItem(): void {
    this.items.update((list) => [...list, { ...DEFAULT_ROW }]);
  }

  removeItem(index: number): void {
    this.items.update((list) => list.filter((_, i) => i !== index));
  }

  updateItem<K extends keyof InvoiceFormItemRow>(
    index: number,
    field: K,
    val: InvoiceFormItemRow[K]
  ): void {
    this.items.update((list) =>
      list.map((item, i) => (i === index ? { ...item, [field]: val } : item))
    );
  }

  onTaxRateChange(index: number, val: unknown): void {
    const rate = Number(val) as ArcaVatRate;
    this.updateItem(index, 'taxRate', rate);
  }

  // ── Catalog Integration ─────────────────────────────────────────────────────
  openCatalog(): void {
    this.catalogSearch.set('');
    this.isCatalogOpen.set(true);
  }

  closeCatalog(): void {
    this.isCatalogOpen.set(false);
  }

  selectProductFromCatalog(prod: Product): void {
    const isRepuesto =
      prod.name.toLowerCase().includes('repuesto') ||
      prod.name.toLowerCase().includes('pantalla') ||
      prod.name.toLowerCase().includes('bater') ||
      prod.name.toLowerCase().includes('disyuntor') ||
      prod.name.toLowerCase().includes('cable');

    const determinedType: ArcaItemType = isRepuesto ? 'part' : 'product';

    // Si el último ítem está vacío, lo reemplazamos; si no, añadimos uno nuevo
    const currentList = this.items();
    const lastItem = currentList[currentList.length - 1];

    const newRow: InvoiceFormItemRow = {
      productId: prod.id,
      description: prod.name + (prod.sku ? ` (${prod.sku})` : ''),
      itemType: determinedType,
      quantity: 1,
      unitPrice: prod.price || 0,
      taxRate: 0.21,
    };

    if (currentList.length === 1 && !lastItem.description.trim() && lastItem.unitPrice === 0) {
      this.items.set([newRow]);
    } else {
      this.items.set([...currentList, newRow]);
    }

    this.closeCatalog();
    this.notificationService.showSuccess(`Producto agregado: ${prod.name}`);
  }

  // ── Submit Action ───────────────────────────────────────────────────────────
  submitInvoice(): void {
    const validation = this.arcaValidation();

    if (!validation.isValid) {
      this.notificationService.showError(validation.errors[0] || 'Verificá los datos del comprobante.');
      return;
    }

    const totals = this.taxBreakdown();
    const cust = this.customer();

    // Map to InvoiceItem entity structure
    const invoiceItems: InvoiceItem[] = this.items().map((row) => {
      const netSubtotal = row.quantity * row.unitPrice;
      const taxAmt = netSubtotal * row.taxRate;
      return {
        product_id: row.productId,
        description: row.description.trim(),
        item_type: row.itemType,
        quantity: Number(row.quantity),
        unit_price: Number(row.unitPrice),
        tax_rate: Number(row.taxRate),
        subtotal: Math.round((netSubtotal + Number.EPSILON) * 100) / 100,
        tax_amount: Math.round((taxAmt + Number.EPSILON) * 100) / 100,
        total: Math.round(((netSubtotal + taxAmt) + Number.EPSILON) * 100) / 100,
      };
    });

    const dto: CreateInvoiceDto = {
      customer_name: cust.name || 'Consumidor Final',
      customer_tax_id: cust.docNumber || undefined,
      customer_doc_type: cust.docType,
      customer_vat_condition: cust.vatCondition,
      customer_address: cust.address || undefined,
      customer_email: cust.email || undefined,
      type: this.invoiceType(),
      origin: 'manual',
      subtotal: totals.totalNet,
      tax_amount: totals.totalVat,
      discount: totals.discount,
      total_amount: totals.grandTotal,
      items: invoiceItems,
      notes: this.fiscalNotes() || undefined,
      internal_notes: this.internalNotes() || undefined,
      payment_method: this.paymentMethod(),
      sale_condition: this.saleCondition(),
      emitter_snapshot: this.emitter(),
      issued_at: new Date(this.issueDate()).toISOString(),
    };

    this.invoiceCreated.emit(dto);
  }

  closeModal(): void {
    this.closed.emit();
  }
}
