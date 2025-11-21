import { Routes } from '@angular/router';
import { authGuard } from '@app/guards/auth.guard';

export const adminRoutes: Routes = [
  {
    title: 'Admin',
    path: '',
    canActivate: [authGuard],
    loadComponent: () => import('@app/admin/layout/admin-layout').then(m => m.AdminLayout),
    children: [
      { path: '', redirectTo: 'products', pathMatch: 'full' },

      // Products
      {
        title: 'Productos',
        path: 'products',
        loadComponent: () => import('@app/admin/products/admin-products-page').then(m => m.AdminProductsPage)
      },
      {
        title: 'Nuevo Producto',
        path: 'products/new',
        loadComponent: () => import('@app/admin/products/admin-product-form-page').then(m => m.AdminProductFormPage)
      },
      {
        title: 'Editar Producto',
        path: 'products/:id',
        loadComponent: () => import('@app/admin/products/admin-product-form-page').then(m => m.AdminProductFormPage)
      },

      // Courses
      {
        title: 'Cursos',
        path: 'courses',
        loadComponent: () => import('@app/admin/courses/admin-courses-page').then(m => m.AdminCoursesPage)
      },
      {
        title: 'Nuevo Curso',
        path: 'courses/new',
        loadComponent: () => import('@app/admin/courses/admin-course-form-page').then(m => m.AdminCourseFormPage)
      },
      {
        title: 'Editar Curso',
        path: 'courses/:id',
        loadComponent: () => import('@app/admin/courses/admin-course-form-page').then(m => m.AdminCourseFormPage)
      }
    ]
  }
];

export default adminRoutes;