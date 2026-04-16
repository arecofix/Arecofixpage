import { Component, inject, OnInit, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { SkeletonComponent } from '@app/shared/components/skeleton/skeleton.component';
import { CustomerService } from '@app/features/customers/application/services/customer.service';
import { TenantService } from '@app/core/services/tenant.service';
import { SUPABASE_CLIENT } from '@app/core/di/supabase-token';
import { inject as ngInject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Pagination } from '@app/shared/components/pagination/pagination';
import { map } from 'rxjs';

export interface ClientRow {
  id: string;
  first_name: string;
  last_name: string;
  full_name?: string;
  email: string;
  phone: string;
  address?: string;
  dni?: string;
  source: 'profile' | 'repair' | 'order';
  repair_count?: number;
  order_count?: number;
  created_at?: string;
}

@Component({
  selector: 'app-admin-clients-page',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, SkeletonComponent, Pagination],
  templateUrl: './admin-clients-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminClientsPage implements OnInit {
  private customerService = inject(CustomerService);
  private tenantService = inject(TenantService);
  private supabase = ngInject(SUPABASE_CLIENT);
  private route = inject(ActivatedRoute);

  clients = signal<ClientRow[]>([]);
  loading = signal(true);
  searchTerm = signal('');

  // Pagination
  pageSize = signal(15);
  currentPage = signal(1);

  filteredClients = computed(() => {
    const term = this.searchTerm().toLowerCase().trim();
    if (!term) return this.clients();
    return this.clients().filter(c =>
      (c.first_name + ' ' + c.last_name).toLowerCase().includes(term) ||
      (c.full_name || '').toLowerCase().includes(term) ||
      (c.email || '').toLowerCase().includes(term) ||
      (c.phone || '').toLowerCase().includes(term) ||
      (c.dni || '').toLowerCase().includes(term)
    );
  });

  totalPages = computed(() => Math.ceil(this.filteredClients().length / this.pageSize()));

  paginatedClients = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize();
    return this.filteredClients().slice(start, start + this.pageSize());
  });

  async ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const page = Number(params['_page']) || 1;
      this.currentPage.set(page);
    });
    await this.loadClients();
  }

  async loadClients() {
    this.loading.set(true);
    try {
      const unifiedData = await this.customerService.getUnifiedClients();
      
      this.clients.set(
        unifiedData.map((c: any) => ({
          id: c.id,
          first_name: c.first_name || '',
          last_name: c.last_name || '',
          full_name: c.full_name || '',
          email: c.email || '',
          phone: c.phone || '',
          address: c.address,
          dni: c.dni,
          source: c.source as any,
          repair_count: c.repair_count || 0,
          order_count: c.order_count || 0,
          created_at: c.created_at
        }))
      );
    } catch (error) {
      console.error('Error loading unified clients:', error);
    } finally {
      this.loading.set(false);
    }
  }

  downloadCSV(): void {
    const rows = this.filteredClients();
    const header = ['Nombre', 'Apellido', 'Email', 'Teléfono', 'Dirección', 'DNI', 'Fuente', 'Reparaciones', 'Pedidos'];
    const csvRows = rows.map(c => [
      this.csvEscape(c.first_name),
      this.csvEscape(c.last_name),
      this.csvEscape(c.email),
      this.csvEscape(c.phone),
      this.csvEscape(c.address ?? ''),
      this.csvEscape(c.dni ?? ''),
      this.translateSource(c.source),
      c.repair_count ?? 0,
      c.order_count ?? 0
    ]);

    const content = [
      'Arecofix - Listado de Clientes Centralizado',
      `Exportado: ${new Date().toLocaleDateString('es-AR')}`,
      '',
      header.join(';'),
      ...csvRows.map(r => r.join(';'))
    ].join('\n');

    const blob = new Blob(['\uFEFF' + content], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `arecofix-clientes-completo-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  private translateSource(source: string): string {
    switch(source) {
      case 'profile': return 'Sistema';
      case 'repair': return 'Taller';
      case 'order': return 'Tienda';
      default: return source;
    }
  }

  private csvEscape(value: string): string {
    if (!value) return '';
    const str = String(value).replace(/"/g, '""');
    return str.includes(';') || str.includes('"') || str.includes('\n') ? `"${str}"` : str;
  }
}
