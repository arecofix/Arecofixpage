import { Component, OnInit, inject, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AccountRepository } from '@app/features/accounts/domain/repositories/account.repository';
import { CustomerAccount } from '@app/features/accounts/domain/entities/customer-account.entity';
import { ToastService } from '@app/shared/services/toast.service';
import { rxResource } from '@angular/core/rxjs-interop';

@Component({
  selector: 'admin-accounts-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './admin-accounts-list.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminAccountsListPage {
  private accountRepo = inject(AccountRepository);
  private toast = inject(ToastService);

  public searchQuery = signal('');

  // Utilizamos rxResource (Angular 19+) para manejar la carga de datos de forma declarativa
  public accountsResource = rxResource({
    stream: () => this.accountRepo.getAllAccounts()
  });

  public filteredAccounts = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    const accounts = (this.accountsResource.value() as CustomerAccount[]) || [];
    
    if (!query) return accounts;
    
    return accounts.filter(acc => {
      const name = `${acc.customer?.first_name || ''} ${acc.customer?.last_name || ''}`.toLowerCase();
      const email = acc.customer?.email?.toLowerCase() || '';
      return name.includes(query) || email.includes(query);
    });
  });

  public totalBalance = computed(() => {
    const accounts = (this.accountsResource.value() as CustomerAccount[]) || [];
    return accounts.reduce((acc: number, current: any) => acc + Number(current.balance), 0);
  });
  
  public totalDebt = computed(() => {
    const accounts = (this.accountsResource.value() as CustomerAccount[]) || [];
    return accounts.filter((a: any) => Number(a.balance) < 0).reduce((acc: number, current: any) => acc + Math.abs(Number(current.balance)), 0);
  });
  
  public totalCredit = computed(() => {
    const accounts = (this.accountsResource.value() as CustomerAccount[]) || [];
    return accounts.filter((a: any) => Number(a.balance) > 0).reduce((acc: number, current: any) => acc + Number(current.balance), 0);
  });

  public refresh() {
    this.accountsResource.reload();
  }
}
