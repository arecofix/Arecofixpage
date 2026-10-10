import { Component, EventEmitter, Output, ChangeDetectionStrategy, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SupplierService } from '@app/features/customers/application/services/supplier.service';
import { BranchService, Branch } from '@app/core/services/branch.service';
import { Supplier } from '@app/features/customers/domain/entities/supplier.entity';

@Component({
  selector: 'app-admin-purchase-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './admin-purchase-modal.component.html',
})
export class AdminPurchaseModalComponent implements OnInit {
  @Output() close = new EventEmitter<void>();

  private supplierService = inject(SupplierService);
  private branchService = inject(BranchService);

  suppliers = signal<Supplier[]>([]);
  branches = signal<Branch[]>([]);

  // Form fields
  formData = {
    proveedor: '',
    sucursal: '',
    fechaCarga: new Date().toISOString().split('T')[0],
    estado: 'pendiente',
    metodoPago: 'efectivo',
    searchQuery: ''
  };

  mappedItems: any[] = [];
  
  async ngOnInit() {
    try {
      const [suppliersData, branchesData] = await Promise.all([
        this.supplierService.getAll(),
        this.branchService.getAllAdminBranches()
      ]);
      this.suppliers.set(suppliersData);
      this.branches.set(branchesData);
      
      // Auto-select current branch
      const currentBranchId = this.branchService.getCurrentBranchId();
      if (currentBranchId) {
        this.formData.sucursal = currentBranchId;
      }
    } catch (error) {
      console.error('Error loading data for purchase modal:', error);
    }
  }

  get totalItems() {
    return this.mappedItems.length;
  }

  get preTaxCost() {
    return 0; // Visual mockup placeholder
  }

  get totalAmount() {
    return 0; // Visual mockup placeholder
  }

  closeModal() {
    this.close.emit();
  }
}
