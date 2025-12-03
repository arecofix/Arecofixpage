import { Routes } from '@angular/router';

export const ADMIN_REPAIRS_ROUTES: Routes = [
  {
    path: '',
    title: 'Taller',
    loadComponent: () => import('./admin-repairs-page').then(m => m.AdminRepairsPage)
  },
  {
    path: 'new',
    title: 'Nueva Reparación',
    loadComponent: () => import('./admin-repair-form-page').then(m => m.AdminRepairFormPage)
  },
  {
    path: ':id',
    title: 'Editar Reparación',
    loadComponent: () => import('./admin-repair-form-page').then(m => m.AdminRepairFormPage)
  }
];
