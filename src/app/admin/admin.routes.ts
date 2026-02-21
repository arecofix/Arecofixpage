import { Routes } from '@angular/router';
import { authGuard } from '@app/guards/auth.guard';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';

export const adminRoutes: Routes = [
  {
    title: 'Admin',
    path: '',
    canActivate: [authGuard],
    loadComponent: () => import('@app/admin/layout/admin-layout').then(m => m.AdminLayout),
    providers: [
      // Charts are only needed in admin — keep them out of the public bundle
      provideCharts(withDefaultRegisterables()),
    ],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        title: 'Dashboard',
        path: 'dashboard',
        loadComponent: () => import('@app/admin/dashboard/admin-dashboard-page').then(m => m.AdminDashboardPage)
      },
      {
        path: 'products',
        loadChildren: () => import('@app/admin/products/admin-products.routes').then(m => m.ADMIN_PRODUCTS_ROUTES)
      },
      {
        path: 'categories',
        loadChildren: () => import('@app/admin/categories/admin-categories.routes').then(m => m.ADMIN_CATEGORIES_ROUTES)
      },
      {
        path: 'brands',
        loadChildren: () => import('@app/admin/brands/admin-brands.routes').then(m => m.ADMIN_BRANDS_ROUTES)
      },
      {
        path: 'clients',
        loadChildren: () => import('@app/admin/clients/admin-clients.routes').then(m => m.ADMIN_CLIENTS_ROUTES)
      },
      {
        path: 'suppliers',
        loadChildren: () => import('@app/admin/suppliers/admin-suppliers.routes').then(m => m.ADMIN_SUPPLIERS_ROUTES)
      },
      {
        path: 'company',
        loadChildren: () => import('@app/admin/company/admin-company.routes').then(m => m.ADMIN_COMPANY_ROUTES)
      },
      {
        path: 'employees',
        loadChildren: () => import('@app/admin/employees/admin-employees.routes').then(m => m.ADMIN_EMPLOYEES_ROUTES)
      },
      {
        path: 'sales',
        loadChildren: () => import('@app/admin/sales/admin-sales.routes').then(m => m.ADMIN_SALES_ROUTES)
      },
      {
        path: 'inventory',
        loadChildren: () => import('@app/admin/inventory/admin-inventory.routes').then(m => m.ADMIN_INVENTORY_ROUTES)
      },
      {
        path: 'purchases',
        loadChildren: () => import('@app/admin/purchases/admin-purchases.routes').then(m => m.ADMIN_PURCHASES_ROUTES)
      },
      {
        path: 'users',
        loadChildren: () => import('@app/admin/users/admin-users.routes').then(m => m.ADMIN_USERS_ROUTES)
      },
      {
        path: 'courses',
        loadChildren: () => import('@app/admin/courses/admin-courses.routes').then(m => m.ADMIN_COURSES_ROUTES)
      },
      {
        path: 'orders',
        loadChildren: () => import('@app/admin/orders/admin-orders.routes').then(m => m.ADMIN_ORDERS_ROUTES)
      },
      {
        path: 'services',
        loadChildren: () => import('@app/admin/services/admin-services.routes').then(m => m.ADMIN_SERVICES_ROUTES)
      },
      {
        path: 'repairs',
        loadChildren: () => import('@app/admin/repairs/admin-repairs.routes').then(m => m.ADMIN_REPAIRS_ROUTES)
      },
      {
        path: 'messages',
        loadChildren: () => import('@app/admin/messages/admin-messages.routes').then(m => m.ADMIN_MESSAGES_ROUTES)
      },
      {
        path: 'posts',
        loadChildren: () => import('@app/admin/posts/admin-posts.routes').then(m => m.ADMIN_POSTS_ROUTES)
      }
    ]
  }
];

export default adminRoutes;