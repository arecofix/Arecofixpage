import { Routes } from '@angular/router';

export default [
  {
    path: '',
    loadComponent: () => import('./dashboard/instructor-dashboard.component').then(m => m.InstructorDashboardComponent),
    title: 'Portal de Instructor'
  },
  {
    path: 'builder',
    loadComponent: () => import('./builder/course-builder.component').then(m => m.CourseBuilderComponent),
    title: 'Constructor de Curso'
  },
  {
    path: 'builder/:id',
    loadComponent: () => import('./builder/course-builder.component').then(m => m.CourseBuilderComponent),
    title: 'Editar Curso'
  }
] as Routes;
