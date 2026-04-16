import { Component, inject, OnInit, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { Repair } from '@app/features/repairs/domain/entities/repair.entity';
import { AdminRepairService } from '@app/features/repairs/application/services/admin-repair.service';
import { RepairStatusUtils } from '@app/features/repairs/domain/utils/repair-status.utils';
import { BranchContextService } from '@app/core/services/branch-context.service';



@Component({
  selector: 'app-admin-repairs-page',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, ScrollingModule],
  templateUrl: './admin-repairs-page.html',
})
export class AdminRepairsPage implements OnInit {
  private repairService = inject(AdminRepairService);
  private branchContextService = inject(BranchContextService);

  constructor() {
    // React to branch changes globally
    effect(() => {
      const branchId = this.branchContextService.currentBranchId();
      this.loadRepairs();
      this.loadSummary();
    });
  }
  repairs = signal<Repair[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);
  
  // Statistics and Summary
  summary = signal<any>({ inWorkshop: 0, readyToPickup: 0, pendingParts: 0, thisMonthProfit: 0 });
  
  // Search and Filter signals
  searchTerm = signal('');
  filterType = signal('all');
  
  // Pagination
  pageOffset = signal(0);
  pageSize = signal(25);
  hasMore = signal(true);
  loadingMore = signal(false);
  
  private searchTimeout?: any;

  // Mapped repairs with precalculated UI properties to avoid template function calls
  mappedRepairs = computed(() => {
    const term = this.searchTerm().toLowerCase();
    const type = this.filterType();
    
    return this.repairs()
      .filter(repair => {
        // Basic type filtering still in-memory for immediate UX if needed, 
        // but search is now server-side
        const type = this.filterType();
        const matchesType = type === 'all' || 
          (repair.device_type?.toLowerCase()?.includes(type.toLowerCase())) ||
          (type === 'smartphone' && (!repair.device_type || 
                                     repair.device_type.toLowerCase().includes('celular') || 
                                     repair.device_type.toLowerCase().includes('phone') ||
                                     repair.device_type.toLowerCase().includes('móvil')));
          
        return matchesType;
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

  // Derived statistics from Global Summary
  inWorkshopCount = computed(() => this.summary().inWorkshop);
  readyToPickupCount = computed(() => this.summary().readyToPickup);
  pendingPartsCount = computed(() => this.summary().pendingParts);

  // Profit Statistics from Global Summary
  thisMonthProfitGlobal = computed(() => this.summary().thisMonthProfit);

  date = new Date();

  async ngOnInit() {
    await Promise.all([
      this.loadRepairs(),
      this.loadSummary()
    ]);
  }

  async loadSummary() {
    try {
      const summary = await this.repairService.getWorkshopSummary();
      this.summary.set(summary);
    } catch (e) {
      console.error('Error loading workshop summary', e);
    }
  }

  async loadRepairs(append = false) {
    if (append) {
      this.loadingMore.set(true);
    } else {
      this.loading.set(true);
      this.pageOffset.set(0);
      this.hasMore.set(true);
    }
    
    this.error.set(null);
    try {
      const data = await this.repairService.getAdminList(
        this.pageSize(), 
        this.pageOffset(), 
        this.searchTerm()
      );
      
      if (append) {
        this.repairs.set([...this.repairs(), ...data]);
      } else {
        this.repairs.set(data);
      }
      
      this.hasMore.set(data.length === this.pageSize());
    } catch (e: any) {
      this.error.set('Error al cargar las reparaciones: ' + e.message);
    } finally {
      this.loading.set(false);
      this.loadingMore.set(false);
    }
  }

  loadMore() {
    if (this.loading() || this.loadingMore() || !this.hasMore()) return;
    this.pageOffset.update(v => v + this.pageSize());
    this.loadRepairs(true);
  }

  onSearch(term: string) {
    this.searchTerm.set(term);
    if (this.searchTimeout) clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => {
      this.loadRepairs();
    }, 400);
  }

  async deleteRepair(id: string) {
    if (!confirm('¿Estás seguro de eliminar este registro de reparación?')) return;

    const previousRepairs = this.repairs();
    
    // 1. Optimistic Update
    this.repairs.update(current => current.filter(r => r.id !== id));

    try {
      // 2. Server call
      await this.repairService.delete(id);
      // Optional: updated summary after deletion
      this.loadSummary();
    } catch (e: any) {
      // 3. Rollback
      this.repairs.set(previousRepairs);
      alert('Error al eliminar la reparación: ' + e.message);
    }
  }

  onScroll(index: number) {
    const total = this.mappedRepairs().length;
    // Trigger load more when we are 5 items away from current end
    if (index >= total - 5 && this.hasMore() && !this.loadingMore() && !this.loading()) {
      this.loadMore();
    }
  }
}
