import { Routes } from '@angular/router';

export const ADMIN_SERVICES_ROUTES: Routes = [
  {
    path: '',
    title: 'Catálogo de Servicios | Admin Arecofix',
    loadComponent: () => import('./admin-services-page').then(m => m.AdminServicesPage),
  },
  {
    path: 'new',
    title: 'Nuevo Servicio | Admin Arecofix',
    loadComponent: () => import('./service-editor/service-editor.component').then(m => m.ServiceEditorComponent),
  },
  {
    path: ':id/edit',
    title: 'Editar Servicio | Admin Arecofix',
    loadComponent: () => import('./service-editor/service-editor.component').then(m => m.ServiceEditorComponent),
  },
  {
    path: ':id',
    title: 'Editar Servicio | Admin Arecofix',
    loadComponent: () => import('./service-editor/service-editor.component').then(m => m.ServiceEditorComponent),
  },
];
