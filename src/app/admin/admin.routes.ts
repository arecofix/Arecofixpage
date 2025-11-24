import { Routes } from '@angular/router';
import { authGuard } from '@app/guards/auth.guard';

export const adminRoutes: Routes = [
  {
    title: 'Admin',
    path: '',
    canActivate: [authGuard],
    loadComponent: () => import('@app/admin/layout/admin-layout').then(m => m.AdminLayout),
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        title: 'Dashboard',
        path: 'dashboard',
        loadComponent: () => import('@app/admin/dashboard/admin-dashboard-page').then(m => m.AdminDashboardPage)
      },

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

      // Categories
      {
        title: 'Categorías',
        path: 'categories',
        loadComponent: () => import('@app/admin/categories/admin-categories-page').then(m => m.AdminCategoriesPage)
      },
      {
        title: 'Nueva Categoría',
        path: 'categories/new',
        loadComponent: () => import('@app/admin/categories/admin-category-form-page').then(m => m.AdminCategoryFormPage)
      },
      {
        title: 'Editar Categoría',
        path: 'categories/:id',
        loadComponent: () => import('@app/admin/categories/admin-category-form-page').then(m => m.AdminCategoryFormPage)
      },

      // Brands
      {
        title: 'Marcas',
        path: 'brands',
        loadComponent: () => import('@app/admin/brands/admin-brands-page').then(m => m.AdminBrandsPage)
      },
      {
        title: 'Nueva Marca',
        path: 'brands/new',
        loadComponent: () => import('@app/admin/brands/admin-brand-form-page').then(m => m.AdminBrandFormPage)
      },
      {
        title: 'Editar Marca',
        path: 'brands/:id',
        loadComponent: () => import('@app/admin/brands/admin-brand-form-page').then(m => m.AdminBrandFormPage)
      },

      // Clients
      {
        title: 'Clientes',
        path: 'clients',
        loadComponent: () => import('@app/admin/clients/admin-clients-page').then(m => m.AdminClientsPage)
      },
      {
        title: 'Nuevo Cliente',
        path: 'clients/new',
        loadComponent: () => import('@app/admin/clients/admin-client-form-page').then(m => m.AdminClientFormPage)
      },
      {
        title: 'Editar Cliente',
        path: 'clients/:id',
        loadComponent: () => import('@app/admin/clients/admin-client-form-page').then(m => m.AdminClientFormPage)
      },

      // Suppliers
      {
        title: 'Proveedores',
        path: 'suppliers',
        loadComponent: () => import('@app/admin/suppliers/admin-suppliers-page').then(m => m.AdminSuppliersPage)
      },
      {
        title: 'Nuevo Proveedor',
        path: 'suppliers/new',
        loadComponent: () => import('@app/admin/suppliers/admin-supplier-form-page').then(m => m.AdminSupplierFormPage)
      },
      {
        title: 'Editar Proveedor',
        path: 'suppliers/:id',
        loadComponent: () => import('@app/admin/suppliers/admin-supplier-form-page').then(m => m.AdminSupplierFormPage)
      },

      // Company
      {
        title: 'Empresa',
        path: 'company',
        loadComponent: () => import('@app/admin/company/admin-company-settings-page').then(m => m.AdminCompanySettingsPage)
      },

      // Employees
      {
        title: 'Empleados',
        path: 'employees',
        loadComponent: () => import('@app/admin/employees/admin-employees-page').then(m => m.AdminEmployeesPage)
      },
      {
        title: 'Nuevo Empleado',
        path: 'employees/new',
        loadComponent: () => import('@app/admin/employees/admin-employee-form-page').then(m => m.AdminEmployeeFormPage)
      },
      {
        title: 'Editar Empleado',
        path: 'employees/:id',
        loadComponent: () => import('@app/admin/employees/admin-employee-form-page').then(m => m.AdminEmployeeFormPage)
      },

      // Sales
      {
        title: 'Ventas',
        path: 'sales',
        loadComponent: () => import('@app/admin/sales/admin-sales-page').then(m => m.AdminSalesPage)
      },
      {
        title: 'Facturación',
        path: 'invoices',
        loadComponent: () => import('@app/admin/sales/admin-invoices-page').then(m => m.AdminInvoicesPage)
      },
      {
        title: 'Ver Factura',
        path: 'invoices/:id',
        loadComponent: () => import('@app/admin/sales/admin-invoice-detail-page').then(m => m.AdminInvoiceDetailPage)
      },

      // Inventory & Purchases
      {
        title: 'Inventario',
        path: 'inventory',
        loadComponent: () => import('@app/admin/inventory/admin-inventory-page').then(m => m.AdminInventoryPage)
      },
      {
        title: 'Compras',
        path: 'purchases',
        loadComponent: () => import('@app/admin/purchases/admin-purchases-page').then(m => m.AdminPurchasesPage)
      },
      {
        title: 'Nueva Compra',
        path: 'purchases/new',
        loadComponent: () => import('@app/admin/purchases/admin-purchase-form-page').then(m => m.AdminPurchaseFormPage)
      },

      // Users
      {
        title: 'Usuarios',
        path: 'users',
        loadComponent: () => import('@app/admin/users/admin-users-page').then(m => m.AdminUsersPage)
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
      },

      // Orders
      {
        title: 'Pedidos',
        path: 'orders',
        loadComponent: () => import('@app/admin/orders/admin-orders-page').then(m => m.AdminOrdersPage)
      },
      {
        title: 'Nuevo Pedido',
        path: 'orders/new',
        loadComponent: () => import('@app/admin/orders/admin-order-form-page').then(m => m.AdminOrderFormPage)
      },
      {
        title: 'Ver Pedido',
        path: 'orders/:id',
        loadComponent: () => import('@app/admin/orders/admin-order-form-page').then(m => m.AdminOrderFormPage)
      },
      // Services
      {
        title: 'Servicios',
        path: 'services',
        loadComponent: () => import('@app/admin/services/admin-services-page').then(m => m.AdminServicesPage)
      },
      {
        title: 'Dashboard',
        path: 'dashboard',
        loadComponent: () => import('@app/admin/dashboard/admin-dashboard-page').then(m => m.AdminDashboardPage)
      },

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

      // Categories
      {
        title: 'Categorías',
        path: 'categories',
        loadComponent: () => import('@app/admin/categories/admin-categories-page').then(m => m.AdminCategoriesPage)
      },
      {
        title: 'Nueva Categoría',
        path: 'categories/new',
        loadComponent: () => import('@app/admin/categories/admin-category-form-page').then(m => m.AdminCategoryFormPage)
      },
      {
        title: 'Editar Categoría',
        path: 'categories/:id',
        loadComponent: () => import('@app/admin/categories/admin-category-form-page').then(m => m.AdminCategoryFormPage)
      },

      // Brands
      {
        title: 'Marcas',
        path: 'brands',
        loadComponent: () => import('@app/admin/brands/admin-brands-page').then(m => m.AdminBrandsPage)
      },
      {
        title: 'Nueva Marca',
        path: 'brands/new',
        loadComponent: () => import('@app/admin/brands/admin-brand-form-page').then(m => m.AdminBrandFormPage)
      },
      {
        title: 'Editar Marca',
        path: 'brands/:id',
        loadComponent: () => import('@app/admin/brands/admin-brand-form-page').then(m => m.AdminBrandFormPage)
      },

      // Clients
      {
        title: 'Clientes',
        path: 'clients',
        loadComponent: () => import('@app/admin/clients/admin-clients-page').then(m => m.AdminClientsPage)
      },
      {
        title: 'Nuevo Cliente',
        path: 'clients/new',
        loadComponent: () => import('@app/admin/clients/admin-client-form-page').then(m => m.AdminClientFormPage)
      },
      {
        title: 'Editar Cliente',
        path: 'clients/:id',
        loadComponent: () => import('@app/admin/clients/admin-client-form-page').then(m => m.AdminClientFormPage)
      },

      // Suppliers
      {
        title: 'Proveedores',
        path: 'suppliers',
        loadComponent: () => import('@app/admin/suppliers/admin-suppliers-page').then(m => m.AdminSuppliersPage)
      },
      {
        title: 'Nuevo Proveedor',
        path: 'suppliers/new',
        loadComponent: () => import('@app/admin/suppliers/admin-supplier-form-page').then(m => m.AdminSupplierFormPage)
      },
      {
        title: 'Editar Proveedor',
        path: 'suppliers/:id',
        loadComponent: () => import('@app/admin/suppliers/admin-supplier-form-page').then(m => m.AdminSupplierFormPage)
      },

      // Company
      {
        title: 'Empresa',
        path: 'company',
        loadComponent: () => import('@app/admin/company/admin-company-settings-page').then(m => m.AdminCompanySettingsPage)
      },

      // Employees
      {
        title: 'Empleados',
        path: 'employees',
        loadComponent: () => import('@app/admin/employees/admin-employees-page').then(m => m.AdminEmployeesPage)
      },
      {
        title: 'Nuevo Empleado',
        path: 'employees/new',
        loadComponent: () => import('@app/admin/employees/admin-employee-form-page').then(m => m.AdminEmployeeFormPage)
      },
      {
        title: 'Editar Empleado',
        path: 'employees/:id',
        loadComponent: () => import('@app/admin/employees/admin-employee-form-page').then(m => m.AdminEmployeeFormPage)
      },

      // Sales
      {
        title: 'Ventas',
        path: 'sales',
        loadComponent: () => import('@app/admin/sales/admin-sales-page').then(m => m.AdminSalesPage)
      },
      {
        title: 'Facturación',
        path: 'invoices',
        loadComponent: () => import('@app/admin/sales/admin-invoices-page').then(m => m.AdminInvoicesPage)
      },
      {
        title: 'Ver Factura',
        path: 'invoices/:id',
        loadComponent: () => import('@app/admin/sales/admin-invoice-detail-page').then(m => m.AdminInvoiceDetailPage)
      },

      // Inventory & Purchases
      {
        title: 'Inventario',
        path: 'inventory',
        loadComponent: () => import('@app/admin/inventory/admin-inventory-page').then(m => m.AdminInventoryPage)
      },
      {
        title: 'Compras',
        path: 'purchases',
        loadComponent: () => import('@app/admin/purchases/admin-purchases-page').then(m => m.AdminPurchasesPage)
      },
      {
        title: 'Nueva Compra',
        path: 'purchases/new',
        loadComponent: () => import('@app/admin/purchases/admin-purchase-form-page').then(m => m.AdminPurchaseFormPage)
      },

      // Users
      {
        title: 'Usuarios',
        path: 'users',
        loadComponent: () => import('@app/admin/users/admin-users-page').then(m => m.AdminUsersPage)
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
      },

      // Orders
      {
        title: 'Pedidos',
        path: 'orders',
        loadComponent: () => import('@app/admin/orders/admin-orders-page').then(m => m.AdminOrdersPage)
      },
      {
        title: 'Nuevo Pedido',
        path: 'orders/new',
        loadComponent: () => import('@app/admin/orders/admin-order-form-page').then(m => m.AdminOrderFormPage)
      },
      {
        title: 'Ver Pedido',
        path: 'orders/:id',
        loadComponent: () => import('@app/admin/orders/admin-order-form-page').then(m => m.AdminOrderFormPage)
      },
      // Services
      {
        title: 'Servicios',
        path: 'services',
        loadComponent: () => import('@app/admin/services/admin-services-page').then(m => m.AdminServicesPage)
      },
      {
        title: 'Nuevo Servicio',
        path: 'services/new',
        loadComponent: () => import('@app/admin/services/admin-service-form-page').then(m => m.AdminServiceFormPage)
      },
      {
        title: 'Editar Servicio',
        path: 'services/:id',
        loadComponent: () => import('@app/admin/services/admin-service-form-page').then(m => m.AdminServiceFormPage)
      },
      // Repairs
      {
        title: 'Taller',
        path: 'repairs',
        loadComponent: () => import('@app/admin/repairs/admin-repairs-page').then(m => m.AdminRepairsPage)
      },
      {
        title: 'Nueva Reparación',
        path: 'repairs/new',
        loadComponent: () => import('@app/admin/repairs/admin-repair-form-page').then(m => m.AdminRepairFormPage)
      },
      {
        title: 'Editar Reparación',
        path: 'repairs/:id',
        loadComponent: () => import('@app/admin/repairs/admin-repair-form-page').then(m => m.AdminRepairFormPage)
      },
      // Messages
      {
        title: 'Mensajes',
        path: 'messages',
        loadComponent: () => import('@app/admin/messages/admin-messages-page').then(m => m.AdminMessagesPage)
      }
    ]
  }
];

export default adminRoutes;