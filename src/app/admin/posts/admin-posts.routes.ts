import { Routes } from '@angular/router';

export const ADMIN_POSTS_ROUTES: Routes = [
  {
    path: '',
    title: 'Entradas',
    loadComponent: () => import('./admin-posts-page').then(m => m.AdminPostsPage)
  },
  {
    path: 'new',
    title: 'Nueva Entrada',
    loadComponent: () => import('./admin-post-form-page').then(m => m.AdminPostFormPage)
  },
  {
    path: ':id',
    title: 'Editar Entrada',
    loadComponent: () => import('./admin-post-form-page').then(m => m.AdminPostFormPage)
  }
];
