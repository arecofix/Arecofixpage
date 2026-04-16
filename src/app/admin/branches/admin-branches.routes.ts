import { Routes } from '@angular/router';

export const ADMIN_BRANCHES_ROUTES: Routes = [
  {
    path: '',
    title: 'Sucursales',
    loadComponent: () => import('@app/admin/branches/admin-branches-page').then(m => m.AdminBranchesPage)
  }
];
