import { Routes } from '@angular/router';

export const ADMIN_COURSES_ROUTES: Routes = [
  {
    path: '',
    title: 'Cursos',
    loadComponent: () => import('./admin-courses-page').then(m => m.AdminCoursesPage)
  },
  {
    path: 'solicitudes',
    title: 'Solicitudes de Cursos',
    loadComponent: () => import('./enrollments/admin-course-enrollments-page').then(m => m.AdminCourseEnrollmentsPage)
  },
  {
    path: 'review',
    title: 'Revisión de Propuestas',
    loadComponent: () => import('./review/admin-course-review.component').then(m => m.AdminCourseReviewComponent)
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
