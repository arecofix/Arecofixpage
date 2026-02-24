import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Repair } from '@app/features/repairs/domain/entities/repair.entity';
import { AdminRepairService } from '@app/features/repairs/application/services/admin-repair.service';
import { RepairStatusUtils } from '@app/features/repairs/domain/utils/repair-status.utils';

@Component({
  selector: 'app-admin-repairs-page',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './admin-repairs-page.html',
})
export class AdminRepairsPage implements OnInit {
  private repairService = inject(AdminRepairService);
  
  repairs = signal<Repair[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);
  
  // Search and Filter signals
  searchTerm = signal('');
  filterType = signal('all');

  // Computed signal for filtered list
  filteredRepairs = computed(() => {
    const term = this.searchTerm().toLowerCase();
    const type = this.filterType();
    
    return this.repairs().filter(repair => {
      const matchesSearch = 
        repair.customer_name?.toLowerCase().includes(term) ||
        repair.customer_phone?.toLowerCase().includes(term) ||
        repair.device_model?.toLowerCase().includes(term) ||
        repair.tracking_code?.toLowerCase().includes(term);
        
      const matchesType = type === 'all' || 
        repair.device_model?.toLowerCase().includes(type.toLowerCase());
        
      return matchesSearch && matchesType;
    });
  });

  date = new Date();

  async ngOnInit() {
    await this.loadRepairs();
  }

  async loadRepairs() {
    this.loading.set(true);
    this.error.set(null);
    try {
      const data = await this.repairService.getAdminList();
      this.repairs.set(data);
    } catch (e: any) {
      this.error.set('Error al cargar las reparaciones: ' + e.message);
    } finally {
      this.loading.set(false);
    }
  }

  async deleteRepair(id: string) {
    if (!confirm('¿Estás seguro de eliminar este registro de reparación?')) return;

    try {
      this.loading.set(true);
      await this.repairService.delete(id);
      await this.loadRepairs();
    } catch (e: any) {
      alert('Error al eliminar la reparación: ' + e.message);
      this.loading.set(false);
    }
  }

  getWarrantyStatus(dateStr: string | undefined): { label: string, class: string } {
    if (!dateStr) return { label: 'N/A', class: 'badge-ghost opacity-50' };
    
    const receivedDate = new Date(dateStr);
    const diffTime = Math.abs(this.date.getTime() - receivedDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 30) {
      return { label: 'EN GARANTÍA', class: 'badge-success' };
    } else {
      return { label: 'VENCIDA', class: 'badge-ghost opacity-50' };
    }
  }

  getStatusBadgeClass(statusId: number): string {
    return RepairStatusUtils.getAdminBadgeClass(statusId);
  }

  getStatusLabel(statusId: number): string {
    return RepairStatusUtils.getStatusUI(statusId).label;
  }
}
