import { Routes } from '@angular/router';

export const ADMIN_COURSES_ROUTES: Routes = [
  {
    path: '',
    title: 'Cursos',
    loadComponent: () => import('./admin-courses-page').then(m => m.AdminCoursesPage)
  },
  {
    path: 'new',
    title: 'Nuevo Curso',
    loadComponent: () => import('./admin-course-form-page').then(m => m.AdminCourseFormPage)
  },
  {
    path: ':id',
    title: 'Editar Curso',
    loadComponent: () => import('./admin-course-form-page').then(m => m.AdminCourseFormPage)
  }
];
