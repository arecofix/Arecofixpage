import { Component, ChangeDetectionStrategy, signal, inject, model, output, computed, input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminProductService } from '../../services/admin-product.service';
import { Category } from '@app/features/products/domain/entities/category.entity';
import { Brand } from '@app/features/products/domain/entities/brand.entity';

type ActiveTab = 'edit' | 'delete';

@Component({
  selector: 'app-bulk-edit-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './bulk-edit-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BulkEditModalComponent implements OnChanges {
  private productService = inject(AdminProductService);

  isOpen = model<boolean>(false);
  selectedIds = model<string[]>([]);
  brands = model<Brand[]>([]);
  categories = model<Category[]>([]);
  initialTab = input<'edit' | 'delete'>('edit');
  onSuccess = output<void>();

  ngOnChanges(changes: SimpleChanges) {
    // When the modal is opened, apply the requested initial tab
    if (changes['isOpen'] && this.isOpen()) {
      this.activeTab.set(this.initialTab());
      this.showConfirmation.set(false);
      this.error.set(null);
    }
  }

  isProcessing = signal(false);
  showConfirmation = signal(false);
  error = signal<string | null>(null);
  activeTab = signal<ActiveTab>('edit');

  // ── Edit Form State ─────────────────────────────────────────────────────
  stockMode = signal<'none' | 'fixed' | 'increase' | 'decrease'>('none');
  stockValue = signal<number | null>(null);

  priceMode = signal<'none' | 'fixed' | 'percentage'>('none');
  priceValue = signal<number | null>(null);

  targetCategoryId = signal<string>('');
  targetBrandId = signal<string>('');
  targetStatus = signal<'none' | 'active' | 'inactive'>('none');

  hasEditChanges = computed(() =>
    this.stockMode() !== 'none' ||
    this.priceMode() !== 'none' ||
    this.targetCategoryId() !== '' ||
    this.targetBrandId() !== '' ||
    this.targetStatus() !== 'none'
  );

  // ── Summary for confirmation screen ────────────────────────────────────
  confirmSummary = computed(() => {
    const lines: string[] = [];
    if (this.priceMode() === 'fixed') lines.push(`Precio → $${this.priceValue()}`);
    if (this.priceMode() === 'percentage') lines.push(`Precio ${this.priceValue()! > 0 ? '+' : ''}${this.priceValue()}%`);
    if (this.stockMode() === 'fixed') lines.push(`Existencias → ${this.stockValue()}`);
    if (this.stockMode() === 'increase') lines.push(`Existencias +${this.stockValue()}`);
    if (this.stockMode() === 'decrease') lines.push(`Existencias -${this.stockValue()}`);
    if (this.targetCategoryId()) lines.push(`Categoría cambiada`);
    if (this.targetBrandId()) lines.push(`Marca cambiada`);
    if (this.targetStatus() === 'active') lines.push(`Estado → Activo`);
    if (this.targetStatus() === 'inactive') lines.push(`Estado → Inactivo`);
    return lines;
  });

  // ── Validation & Execution ───────────────────────────────────────────────
  prepareExecute() {
    this.error.set(null);

    if (this.activeTab() === 'delete') {
      this.showConfirmation.set(true);
      return;
    }

    if (this.stockMode() !== 'none' && (this.stockValue() === null || this.stockValue()! < 0)) {
      this.error.set('El valor de stock debe ser un número positivo.');
      return;
    }
    if (this.priceMode() === 'fixed' && (this.priceValue() === null || this.priceValue()! < 0)) {
      this.error.set('El precio debe ser un número positivo.');
      return;
    }
    if (!this.hasEditChanges()) {
      this.error.set('No has seleccionado ningún cambio para aplicar.');
      return;
    }

    this.showConfirmation.set(true);
  }

  async execute() {
    this.isProcessing.set(true);
    this.showConfirmation.set(false);

    try {
      if (this.activeTab() === 'delete') {
        await this.productService.bulkDelete(this.selectedIds());
      } else {
        await this._executeEdit();
      }
      this.onSuccess.emit();
      this.close();
    } catch (err: any) {
      this.error.set(err.message || 'Error al procesar la operación masiva');
    } finally {
      this.isProcessing.set(false);
    }
  }

  private async _executeEdit() {
    const ids = this.selectedIds();

    // Only need to fetch current prices/stocks when doing relative changes
    const needsFetch = this.priceMode() === 'percentage' || this.stockMode() === 'increase' || this.stockMode() === 'decrease';
    let stockByIdMap = new Map<string, number>();
    let priceByIdMap = new Map<string, number>();

    if (needsFetch) {
      const products = await this.productService.getProducts();
      const relevant = products.filter(p => ids.includes(p.id));
      relevant.forEach(p => {
        stockByIdMap.set(p.id, p.stock ?? 0);
        priceByIdMap.set(p.id, p.price ?? 0);
      });
    }

    // Build one clean payload per product with ONLY the fields that changed
    const updates: Array<{ id: string; payload: Record<string, any> }> = ids.map(id => {
      const payload: Record<string, any> = {};

      // Price
      if (this.priceMode() === 'fixed') {
        payload['price'] = this.priceValue();
      } else if (this.priceMode() === 'percentage') {
        const current = priceByIdMap.get(id) ?? 0;
        payload['price'] = Math.round(current * (1 + (this.priceValue() ?? 0) / 100));
      }

      // Stock (maps to product_stock_per_branch but products table also has it)
      if (this.stockMode() === 'fixed') {
        payload['stock'] = this.stockValue();
      } else if (this.stockMode() === 'increase') {
        payload['stock'] = (stockByIdMap.get(id) ?? 0) + (this.stockValue() ?? 0);
      } else if (this.stockMode() === 'decrease') {
        payload['stock'] = Math.max(0, (stockByIdMap.get(id) ?? 0) - (this.stockValue() ?? 0));
      }

      // Category
      if (this.targetCategoryId()) payload['category_id'] = this.targetCategoryId();

      // Brand
      if (this.targetBrandId()) payload['brand_id'] = this.targetBrandId();

      // Status
      if (this.targetStatus() === 'active') payload['is_active'] = true;
      if (this.targetStatus() === 'inactive') payload['is_active'] = false;

      return { id, payload };
    });

    await this.productService.bulkCustomUpdate(updates);
  }

  setTab(tab: ActiveTab) {
    this.activeTab.set(tab);
    this.error.set(null);
    this.showConfirmation.set(false);
  }

  close() {
    if (this.isProcessing()) return;
    this.isOpen.set(false);
    this.resetForm();
  }

  resetForm() {
    this.stockMode.set('none');
    this.stockValue.set(null);
    this.priceMode.set('none');
    this.priceValue.set(null);
    this.targetCategoryId.set('');
    this.targetBrandId.set('');
    this.targetStatus.set('none');
    this.showConfirmation.set(false);
    this.error.set(null);
    this.activeTab.set('edit');
  }
}
