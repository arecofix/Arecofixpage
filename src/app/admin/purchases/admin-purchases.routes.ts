import { Routes } from '@angular/router';

export const ADMIN_PURCHASES_ROUTES: Routes = [
  {
    path: '',
    title: 'Compras',
    loadComponent: () => import('./admin-purchases-page').then(m => m.AdminPurchasesPage)
  },
  {
    path: 'new',
    title: 'Nueva Compra',
    loadComponent: () => import('./admin-purchase-form-page').then(m => m.AdminPurchaseFormPage)
  }
];
