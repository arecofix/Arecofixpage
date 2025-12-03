import { Routes } from '@angular/router';

export const ADMIN_CATEGORIES_ROUTES: Routes = [
  {
    path: '',
    title: 'Categorías',
    loadComponent: () => import('./admin-categories-page').then(m => m.AdminCategoriesPage)
  },
  {
    path: 'new',
    title: 'Nueva Categoría',
    loadComponent: () => import('./admin-category-form-page').then(m => m.AdminCategoryFormPage)
  },
  {
    path: ':id',
    title: 'Editar Categoría',
    loadComponent: () => import('./admin-category-form-page').then(m => m.AdminCategoryFormPage)
  }
];
