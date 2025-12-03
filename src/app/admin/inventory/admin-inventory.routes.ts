import { Routes } from '@angular/router';

export const ADMIN_INVENTORY_ROUTES: Routes = [
  {
    path: '',
    title: 'Inventario',
    loadComponent: () => import('./admin-inventory-page').then(m => m.AdminInventoryPage)
  }
];
