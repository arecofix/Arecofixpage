import { Routes } from '@angular/router';

export const ADMIN_SUPPLIERS_ROUTES: Routes = [
  {
    path: '',
    title: 'Proveedores',
    loadComponent: () => import('./admin-suppliers-page').then(m => m.AdminSuppliersPage)
  },
  {
    path: 'new',
    title: 'Nuevo Proveedor',
    loadComponent: () => import('./admin-supplier-form-page').then(m => m.AdminSupplierFormPage)
  },
  {
    path: ':id',
    title: 'Editar Proveedor',
    loadComponent: () => import('./admin-supplier-form-page').then(m => m.AdminSupplierFormPage)
  }
];
