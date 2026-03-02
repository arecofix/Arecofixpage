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

  // Mapped repairs with precalculated UI properties to avoid template function calls
  mappedRepairs = computed(() => {
    const term = this.searchTerm().toLowerCase();
    const type = this.filterType();
    
    return this.repairs()
      .filter(repair => {
        const matchesSearch = 
          repair.customer_name?.toLowerCase().includes(term) ||
          repair.customer_phone?.toLowerCase().includes(term) ||
          repair.device_model?.toLowerCase().includes(term) ||
          repair.tracking_code?.toLowerCase().includes(term);
          
        const matchesType = type === 'all' || 
          repair.device_model?.toLowerCase().includes(type.toLowerCase());
          
        return matchesSearch && matchesType;
      })
      .map(repair => {
        // Pre-calculate warranty status
        let warrantyLabel = 'N/A';
        let warrantyClass = 'badge-ghost opacity-50';
        if (repair.received_at) {
          const receivedDate = new Date(repair.received_at);
          const diffTime = Math.abs(this.date.getTime() - receivedDate.getTime());
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          if (diffDays <= 30) {
            warrantyLabel = 'EN GARANTÍA';
            warrantyClass = 'badge-success';
          } else {
            warrantyLabel = 'VENCIDA';
            warrantyClass = 'badge-ghost opacity-50';
          }
        }

        return {
          ...repair,
          ui: {
            statusClass: RepairStatusUtils.getAdminBadgeClass(repair.current_status_id),
            statusLabel: RepairStatusUtils.getStatusUI(repair.current_status_id).label,
            warrantyLabel,
            warrantyClass
          }
        };
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
}
