import { Routes } from '@angular/router';

export const ADMIN_PRODUCTS_ROUTES: Routes = [
  {
    path: '',
    title: 'Productos',
    loadComponent: () => import('./admin-products-page').then(m => m.AdminProductsPage)
  },
  {
    path: 'new',
    title: 'Nuevo Producto',
    loadComponent: () => import('./admin-product-form-page').then(m => m.AdminProductFormPage)
  },
  {
    path: 'approvals',
    title: 'Aprobaciones de Catálogo',
    loadComponent: () => import('./admin-approvals-page').then(m => m.AdminApprovalsPage)
  },
  {
    path: ':id',
    title: 'Editar Producto',
    loadComponent: () => import('./admin-product-form-page').then(m => m.AdminProductFormPage)
  }
];
