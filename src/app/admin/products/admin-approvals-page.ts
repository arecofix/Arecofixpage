import { Component, inject, OnInit, signal, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '@app/core/services/auth.service';
import { TenantService } from '@app/core/services/tenant.service';
import { Product } from '@app/features/products/domain/entities/product.entity';
import { BranchService } from '@app/core/services/branch.service';
import { NotificationService } from '@app/core/services/notification.service';
import { ProductRepository } from '@app/features/products/domain/repositories/product.repository';

@Component({
  selector: 'app-admin-approvals-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './admin-approvals-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminApprovalsPage implements OnInit {
  private auth = inject(AuthService);
  private tenantService = inject(TenantService);
  private productRepo = inject(ProductRepository);
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
      const supabase = this.auth.getSupabaseClient();
      const tenantId = this.tenantService.getTenantId();

      // Buscamos productos inactivos, que tengan un branch_id (creados por staff de sucursal)
      const { data, error } = await supabase
        .from('products')
        .select(`*, branches(name)`)
        .eq('is_active', false)
        .eq('tenant_id', tenantId)
        .not('branch_id', 'is', null)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      this.pendingProducts.set(data as any[]);
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
      const supabase = this.auth.getSupabaseClient();
      
      // Aprueba, lo hace activo y lo hace global también para que la central lo ofrezca
      const { error } = await supabase
        .from('products')
        .update({ is_active: true, is_global: true })
        .eq('id', product.id);

      if (error) throw error;
      
      this.notificationService.showSuccess(`Producto ${product.name} aprobado existosamente.`);
      await this.loadPending();
    } catch (err: any) {
      this.notificationService.showError('Error al aprobar: ' + err.message);
    }
  }

  async reject(product: any) {
    if(!confirm(`¿Rechazar (eliminar) la solicitud del producto ${product.name}?`)) return;

    try {
      const supabase = this.auth.getSupabaseClient();
      
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', product.id);

      if (error) throw error;
      
      this.notificationService.showInfo(`Producto ${product.name} rechazado.`);
      await this.loadPending();
    } catch (err: any) {
      this.notificationService.showError('Error al rechazar: ' + err.message);
    }
  }
}
