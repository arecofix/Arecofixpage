import { Component, ChangeDetectionStrategy, signal, inject, model, output, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminProductService } from '../../services/admin-product.service';
import { Category } from '@app/features/products/domain/entities/category.entity';
import { Brand } from '@app/features/products/domain/entities/brand.entity';

@Component({
  selector: 'app-bulk-edit-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './bulk-edit-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BulkEditModalComponent {
  private productService = inject(AdminProductService);
  
  isOpen = model<boolean>(false);
  selectedIds = model<string[]>([]);
  brands = model<Brand[]>([]);
  categories = model<Category[]>([]);
  onSuccess = output<void>();

  isProcessing = signal(false);
  showConfirmation = signal(false);
  error = signal<string | null>(null);

  // Form State
  stockMode = signal<'none' | 'fixed' | 'increase' | 'decrease'>('none');
  stockValue = signal<number | null>(null);

  priceMode = signal<'none' | 'fixed' | 'percentage'>('none');
  priceValue = signal<number | null>(null);

  targetCategoryId = signal<string>('');
  targetBrandId = signal<string>('');
  targetStatus = signal<'none' | 'active' | 'inactive'>('none');

  hasChanges = computed(() => {
    return this.stockMode() !== 'none' || 
           this.priceMode() !== 'none' || 
           this.targetCategoryId() !== '' || 
           this.targetBrandId() !== '' || 
           this.targetStatus() !== 'none';
  });

  async prepareExecute() {
    this.error.set(null);
    
    // Validation
    if (this.stockMode() !== 'none' && (this.stockValue() === null || this.stockValue()! < 0)) {
        this.error.set('El valor de stock debe ser un número positivo.');
        return;
    }
    if (this.priceMode() === 'fixed' && (this.priceValue() === null || this.priceValue()! < 0)) {
        this.error.set('El precio debe ser un número positivo.');
        return;
    }

    if (!this.hasChanges()) {
        this.error.set('No has seleccionado ningún cambio para aplicar.');
        return;
    }

    this.showConfirmation.set(true);
  }

  async execute() {
    this.isProcessing.set(true);
    this.showConfirmation.set(false);

    try {
      const ids = this.selectedIds();
      
      // Step 1: Fetch current products to apply relative changes if needed
      const allProducts = await this.productService.getProducts();
      const productsToUpdate = allProducts.filter(p => ids.includes(p.id));

      const updates = productsToUpdate.map(p => {
        // Start with a copy of the existing product to preserve all fields
        const update: any = { ...p };

        // Apply Stock changes (Note: Local property 'stock' is virtual in some contexts, but 'upsertMany' expects it as a column if it maps directly or use specialized logic)
        if (this.stockMode() === 'fixed') {
            update.stock = this.stockValue();
        } else if (this.stockMode() === 'increase') {
            update.stock = (p.stock || 0) + (this.stockValue() || 0);
        } else if (this.stockMode() === 'decrease') {
            update.stock = Math.max(0, (p.stock || 0) - (this.stockValue() || 0));
        }

        // Apply Price changes
        if (this.priceMode() === 'fixed') {
            update.price = this.priceValue();
        } else if (this.priceMode() === 'percentage') {
            const factor = 1 + (this.priceValue() || 0) / 100;
            update.price = Math.round(p.price * factor);
        }

        // Apply Category
        if (this.targetCategoryId()) {
            update.category_id = this.targetCategoryId();
        }

        // Apply Brand
        if (this.targetBrandId()) {
            update.brand_id = this.targetBrandId();
        }

        // Apply Status
        if (this.targetStatus() === 'active') {
            update.is_active = true;
        } else if (this.targetStatus() === 'inactive') {
            update.is_active = false;
        }

        // Remove virtual/joined properties that Supabase might reject in a direct upsert
        delete update.branch_stock;
        
        return update;
      });

      // Step 2: Send all updates in a single call
      // Note: Supabase updateMany will fire multiple requests if not using a specific RPC,
      // but upsertMany can do it in one if we have all fields or if the table allows partial upserts.
      // Since our upsertMany in repository uses .upsert() which works as update if ID matches:
      await this.productService.bulkCustomUpdate(updates);

      this.onSuccess.emit();
      this.close();
    } catch (err: any) {
      this.error.set(err.message || 'Error al procesar la actualización masiva');
    } finally {
      this.isProcessing.set(false);
    }
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
  }
}
