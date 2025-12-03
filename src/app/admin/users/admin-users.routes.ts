import { Routes } from '@angular/router';

export const ADMIN_USERS_ROUTES: Routes = [
  {
    path: '',
    title: 'Usuarios',
    loadComponent: () => import('./admin-users-page').then(m => m.AdminUsersPage)
  }
];
