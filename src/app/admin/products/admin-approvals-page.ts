import { Component, inject, OnInit, signal, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Product } from '@app/features/products/domain/entities/product.entity';
import { NotificationService } from '@app/core/services/notification.service';
import { AdminProductService } from './services/admin-product.service';

@Component({
  selector: 'app-admin-approvals-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './admin-approvals-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminApprovalsPage implements OnInit {
  private productService = inject(AdminProductService);
  private notificationService = inject(NotificationService);
  private cdr = inject(ChangeDetectorRef);

  pendingProducts = signal<Product[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);

  async ngOnInit() {
    await this.loadPending();
  }

  async loadPending() {
    this.loading.set(true);
    try {
      const data = await this.productService.getPendingApprovals();
      this.pendingProducts.set(data);
    } catch (err: any) {
      this.error.set(err.message);
    } finally {
      this.loading.set(false);
      this.cdr.markForCheck();
    }
  }

  async approve(product: any) {
    if(!confirm(`¿Aprobar el producto ${product.name} y agregarlo al catálogo activo?`)) return;

    try {
      await this.productService.approveProduct(product.id);
      this.notificationService.showSuccess(`Producto ${product.name} aprobado existosamente.`);
      await this.loadPending();
    } catch (err: any) {
      this.notificationService.showError('Error al aprobar: ' + err.message);
    }
  }

  async reject(product: any) {
    if(!confirm(`¿Rechazar (eliminar) la solicitud del producto ${product.name}?`)) return;

    try {
      await this.productService.rejectProduct(product.id);
      this.notificationService.showInfo(`Producto ${product.name} rechazado.`);
      await this.loadPending();
    } catch (err: any) {
      this.notificationService.showError('Error al rechazar: ' + err.message);
    }
  }
}
