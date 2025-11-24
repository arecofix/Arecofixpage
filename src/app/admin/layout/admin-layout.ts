import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '@app/services/auth.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './admin-layout.html',
})
export class AdminLayout {
  private authService = inject(AuthService);
  private router = inject(Router);

  menuItems = [
    { title: 'Dashboard', path: '/admin/dashboard', icon: 'fa-chart-line' },
    { title: 'Ventas', path: '/admin/sales', icon: 'fa-cash-register' },
    { title: 'Facturación', path: '/admin/invoices', icon: 'fa-file-invoice-dollar' },
    { title: 'Productos', path: '/admin/products', icon: 'fa-box' },
    { title: 'Categorías', path: '/admin/categories', icon: 'fa-tags' },
    { title: 'Marcas', path: '/admin/brands', icon: 'fa-copyright' },
    { title: 'Inventario', path: '/admin/inventory', icon: 'fa-warehouse' },
    { title: 'Compras', path: '/admin/purchases', icon: 'fa-shopping-bag' },
    { title: 'Clientes', path: '/admin/clients', icon: 'fa-users' },
    { title: 'Proveedores', path: '/admin/suppliers', icon: 'fa-truck' },
    { title: 'Empleados', path: '/admin/employees', icon: 'fa-id-card' },
    { title: 'Empresa', path: '/admin/company', icon: 'fa-building' },
    { title: 'Cursos', path: '/admin/courses', icon: 'fa-graduation-cap' },
    { title: 'Pedidos', path: '/admin/orders', icon: 'fa-shopping-cart' },
    { title: 'Servicios', path: '/admin/services', icon: 'fa-tools' },
    { title: 'Taller', path: '/admin/repairs', icon: 'fa-wrench' },
    { title: 'Usuarios', path: '/admin/users', icon: 'fa-user-cog' },
    { title: 'Mensajes', path: '/admin/messages', icon: 'fa-envelope' },
  ];

  async logout() {
    await this.authService.signOut();
    this.router.navigate(['/auth/login']);
  }
}