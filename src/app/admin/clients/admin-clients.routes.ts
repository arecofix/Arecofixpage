import { Routes } from '@angular/router';

export const ADMIN_CLIENTS_ROUTES: Routes = [
  {
    path: '',
    title: 'Clientes',
    loadComponent: () => import('./admin-clients-page').then(m => m.AdminClientsPage)
  },
  {
    path: 'new',
    title: 'Nuevo Cliente',
    loadComponent: () => import('./admin-client-form-page').then(m => m.AdminClientFormPage)
  },
  {
    path: ':id',
    title: 'Editar Cliente',
    loadComponent: () => import('./admin-client-form-page').then(m => m.AdminClientFormPage)
  }
];
