import { Routes } from '@angular/router';

export const ADMIN_ACCOUNTS_ROUTES: Routes = [
  {
    path: '',
    title: 'Cuentas Corrientes',
    loadComponent: () => import('./pages/list/admin-accounts-list.page').then((m) => m.AdminAccountsListPage),
  }
];
