import { Routes } from '@angular/router';

export const ADMIN_FINANCE_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    title: 'Gestión Contable',
    data: { reuse: true, tabName: 'Contabilidad' },
    loadComponent: () => import('./pages/finance-dashboard/finance-dashboard.component').then(m => m.FinanceDashboardComponent)
  },
  {
    path: 'cash-movements',
    title: 'Movimientos de Caja',
    data: { reuse: true, tabName: 'Caja' },
    loadComponent: () => import('./pages/cash-movements/cash-movements.component').then(m => m.CashMovementsComponent)
  }
];
