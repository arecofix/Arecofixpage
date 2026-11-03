import {
  Component,
  inject,
  OnInit,
  signal,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Purchase } from '@app/features/sales/domain/entities/purchase.entity';
import { AdminPurchaseService } from './services/admin-purchase.service';
import { AdminPurchaseModalComponent } from './components/admin-purchase-modal/admin-purchase-modal.component';

@Component({
  selector: 'app-admin-purchases-page',
  standalone: true,
  imports: [CommonModule, AdminPurchaseModalComponent],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './admin-purchases-page.html',
})
export class AdminPurchasesPage implements OnInit {
  private purchaseService = inject(AdminPurchaseService);
  purchases = signal<Purchase[]>([]);
  loading = signal(true);
  isModalOpen = signal(false);

  async ngOnInit() {
    await this.loadPurchases();
  }

  async loadPurchases() {
    this.loading.set(true);
    try {
      const data = await this.purchaseService.getPurchases();
      this.purchases.set(data);
    } catch (error) {
      console.error('Error loading purchases:', error);
    } finally {
      this.loading.set(false);
    }
  }
}
