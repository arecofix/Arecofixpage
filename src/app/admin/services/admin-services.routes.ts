import { Routes } from '@angular/router';

export const ADMIN_SERVICES_ROUTES: Routes = [
  {
    path: '',
    title: 'Servicios',
    loadComponent: () => import('./admin-services-page').then(m => m.AdminServicesPage)
  },
  {
    path: 'new',
    title: 'Nuevo Servicio',
    loadComponent: () => import('./admin-service-form-page').then(m => m.AdminServiceFormPage)
  },
  {
    path: ':id',
    title: 'Editar Servicio',
    loadComponent: () => import('./admin-service-form-page').then(m => m.AdminServiceFormPage)
  }
];
