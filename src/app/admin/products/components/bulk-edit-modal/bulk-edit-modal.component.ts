import { Component, ChangeDetectionStrategy, signal, inject, model, output } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { AdminProductService } from '../../services/admin-product.service';

@Component({
  selector: 'app-bulk-edit-modal',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './bulk-edit-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BulkEditModalComponent {
  private productService = inject(AdminProductService);
  
  isOpen = model<boolean>(false);
  selectedIds = model<string[]>([]);
  brands = model<any[]>([]); // Pass brands from parent
  onSuccess = output<void>();

  mode = signal<'price_inflation' | 'currency_change' | 'brand_change' | 'status_change'>('price_inflation');
  isProcessing = signal(false);

  // Form Values
  inflationPercentage = signal<number>(0);
  targetCurrency = signal<'ARS' | 'USD'>('ARS');
  targetBrandId = signal<string>('');
  targetStatus = signal<boolean>(true);

  async execute() {
    if (this.selectedIds().length === 0) return;
    this.isProcessing.set(true);

    try {
      const ids = this.selectedIds();

      switch (this.mode()) {
        case 'price_inflation':
          await this.productService.bulkIncreasePrice(ids, this.inflationPercentage());
          break;
        case 'currency_change':
          await this.productService.bulkUpdate(ids, { currency: this.targetCurrency() });
          break;
        case 'brand_change':
          await this.productService.bulkUpdate(ids, { brand_id: this.targetBrandId() });
          break;
        case 'status_change':
          await this.productService.bulkUpdate(ids, { is_active: this.targetStatus() });
          break;
      }

      this.onSuccess.emit();
      this.close();
    } catch (err) {
      console.error(err);
      alert('Error al procesar edición masiva');
    } finally {
      this.isProcessing.set(false);
    }
  }

  close() {
    this.isOpen.set(false);
    // Reset forms
    this.inflationPercentage.set(0);
  }
}
