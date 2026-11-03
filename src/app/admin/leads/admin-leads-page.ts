import {
  Component,
  inject,
  OnInit,
  signal,
  computed,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ServicesApplicationService } from '@app/features/services/application/services/services-application.service';
import { LeadDto } from '@app/features/services/domain/dtos/service.dto';
import { LeadStatus } from '@app/features/services/domain/entities/service-lead.entity';
import { Pagination } from '@app/shared/components/pagination/pagination';

@Component({
  selector: 'app-admin-leads-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, Pagination],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './admin-leads-page.html',
})
export class AdminLeadsPage implements OnInit {
  private servicesApp = inject(ServicesApplicationService);

  leads = signal<LeadDto[]>([]);
  loading = signal(true);
  search = signal('');
  filterStatus = signal<LeadStatus | 'all'>('all');
  selectedLead = signal<LeadDto | null>(null);

  currentPage = signal(1);
  itemsPerPage = signal(20);
  totalItems = signal(0);
  totalPages = computed(() =>
    Math.max(1, Math.ceil(this.totalItems() / this.itemsPerPage()))
  );

  async ngOnInit(): Promise<void> {
    await this.loadLeads();
  }

  async loadLeads(): Promise<void> {
    this.loading.set(true);
    try {
      const statusFilter = this.filterStatus() === 'all' ? undefined : (this.filterStatus() as LeadStatus);
      const res = await this.servicesApp.getLeads({
        status: statusFilter,
        search: this.search().trim() || undefined,
        page: this.currentPage(),
        limit: this.itemsPerPage(),
      });
      this.leads.set(res.data);
      this.totalItems.set(res.total);
    } catch (err: any) {
      console.error('Error cargando leads:', err);
    } finally {
      this.loading.set(false);
    }
  }

  onSearchChange(): void {
    this.currentPage.set(1);
    this.loadLeads();
  }

  onFilterStatusChange(status: LeadStatus | 'all'): void {
    this.filterStatus.set(status);
    this.currentPage.set(1);
    this.loadLeads();
  }

  changePage(page: number): void {
    this.currentPage.set(page);
    this.loadLeads();
  }

  async updateStatus(leadId: string, status: LeadStatus): Promise<void> {
    try {
      await this.servicesApp.updateLeadStatus(leadId, status);
      const list = [...this.leads()];
      const item = list.find(l => l.id === leadId);
      if (item) {
        item.status = status;
        this.leads.set(list);
      }
      if (this.selectedLead()?.id === leadId) {
        this.selectedLead.set({ ...this.selectedLead()!, status });
      }
    } catch (err: any) {
      alert('Error actualizando estado del lead: ' + err.message);
    }
  }

  openLeadDetail(lead: LeadDto): void {
    this.selectedLead.set(lead);
  }

  closeLeadDetail(): void {
    this.selectedLead.set(null);
  }
}
