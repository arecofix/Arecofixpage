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

  menuItems: any[] = [
    { title: 'Dashboard', path: '/admin/dashboard', icon: 'fa-chart-line' },
    {
      title: 'Productos',
      path: '/admin/products',
      icon: 'fa-box',
      expanded: false,
      children: [
        { title: 'Categorías', path: '/admin/categories', icon: 'fa-tags' },
        { title: 'Marcas', path: '/admin/brands', icon: 'fa-copyright' },
        { title: 'Inventario', path: '/admin/inventory', icon: 'fa-warehouse' },
        { title: 'Ventas', path: '/admin/sales', icon: 'fa-cash-register' },
        { title: 'Compras', path: '/admin/purchases', icon: 'fa-shopping-bag' },
        { title: 'Pedidos', path: '/admin/orders', icon: 'fa-shopping-cart' },
        { title: 'Clientes', path: '/admin/clients', icon: 'fa-users' },
      ]
    },
    {
      title: 'Empresa',
      path: '/admin/company',
      icon: 'fa-building',
      expanded: false,
      children: [
        { title: 'Empleados', path: '/admin/employees', icon: 'fa-id-card' },
        { title: 'Proveedores', path: '/admin/suppliers', icon: 'fa-truck' },
        { title: 'Facturación', path: '/admin/invoices', icon: 'fa-file-invoice-dollar' },
      ]
    },
    { title: 'Cursos', path: '/admin/courses', icon: 'fa-graduation-cap' },
    { title: 'Servicios', path: '/admin/services', icon: 'fa-tools' },
    { title: 'Taller', path: '/admin/repairs', icon: 'fa-wrench' },
    { title: 'Usuarios', path: '/admin/users', icon: 'fa-user-cog' },
    { title: 'Mensajes', path: '/admin/messages', icon: 'fa-envelope' },
    { title: 'Entradas', path: '/admin/posts', icon: 'fa-newspaper' },
  ];

  toggleMenu(item: any) {
    if (item.children) {
      item.expanded = !item.expanded;
    }
  }

  async logout() {
    await this.authService.signOut();
    this.router.navigate(['/login']);
  }
}