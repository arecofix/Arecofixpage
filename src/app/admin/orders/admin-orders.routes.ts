import { Routes } from '@angular/router';

export const ADMIN_ORDERS_ROUTES: Routes = [
  {
    path: '',
    title: 'Pedidos',
    loadComponent: () => import('./admin-orders-page').then(m => m.AdminOrdersPage)
  },
  {
    path: 'new',
    title: 'Nuevo Pedido',
    loadComponent: () => import('./admin-order-form-page').then(m => m.AdminOrderFormPage)
  },
  {
    path: ':id',
    title: 'Ver Pedido',
    loadComponent: () => import('./admin-order-form-page').then(m => m.AdminOrderFormPage)
  },
  {
    path: ':id/edit',
    title: 'Editar Pedido',
    loadComponent: () => import('./admin-order-form-page').then(m => m.AdminOrderFormPage)
  }
];
