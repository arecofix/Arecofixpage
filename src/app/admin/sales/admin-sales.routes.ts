import { Routes } from '@angular/router';

export const ADMIN_SALES_ROUTES: Routes = [
  {
    path: '',
    title: 'Ventas',
    loadComponent: () => import('./admin-sales-page').then(m => m.AdminSalesPage)
  },
  {
    path: 'invoices',
    title: 'Facturación',
    loadComponent: () => import('./admin-invoices-page').then(m => m.AdminInvoicesPage)
  },
  {
    path: 'invoices/:id',
    title: 'Ver Factura',
    loadComponent: () => import('./admin-invoice-detail-page').then(m => m.AdminInvoiceDetailPage)
  }
];
