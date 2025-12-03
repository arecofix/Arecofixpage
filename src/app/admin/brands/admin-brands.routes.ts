import { Routes } from '@angular/router';

export const ADMIN_BRANDS_ROUTES: Routes = [
  {
    path: '',
    title: 'Marcas',
    loadComponent: () => import('./admin-brands-page').then(m => m.AdminBrandsPage)
  },
  {
    path: 'new',
    title: 'Nueva Marca',
    loadComponent: () => import('./admin-brand-form-page').then(m => m.AdminBrandFormPage)
  },
  {
    path: ':id',
    title: 'Editar Marca',
    loadComponent: () => import('./admin-brand-form-page').then(m => m.AdminBrandFormPage)
  }
];
