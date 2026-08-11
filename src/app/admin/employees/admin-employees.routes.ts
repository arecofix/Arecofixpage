import { Routes } from '@angular/router';

export const ADMIN_EMPLOYEES_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/admin/users'
  },
  {
    path: 'new',
    title: 'Nuevo Empleado',
    loadComponent: () => import('./admin-employee-form-page').then(m => m.AdminEmployeeFormPage)
  },
  {
    path: ':id',
    title: 'Editar Empleado',
    loadComponent: () => import('./admin-employee-form-page').then(m => m.AdminEmployeeFormPage)
  }
];
