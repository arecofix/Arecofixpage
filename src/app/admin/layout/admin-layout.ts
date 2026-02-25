import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '@app/core/services/auth.service';
import { NotificationService, AppNotification } from '@app/core/services/notification.service';
import { AccessibilitySidebarComponent } from '@app/shared/components/accessibility-sidebar/accessibility-sidebar.component';
import { PreferencesService } from '@app/shared/services/preferences.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, AccessibilitySidebarComponent],
  templateUrl: './admin-layout.html',
})
export class AdminLayout implements OnInit, OnDestroy {
  private authService = inject(AuthService);
  private router = inject(Router);
  public preferencesService = inject(PreferencesService);
  public notificationService = inject(NotificationService);

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
        { title: 'Facturación', path: '/admin/sales/invoices', icon: 'fa-file-invoice-dollar' },
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

  async ngOnInit() {
    await this.notificationService.loadNotifications();
    this.notificationService.subscribeToRealtime();
  }

  ngOnDestroy() {
    this.notificationService.unsubscribe();
  }

  handleNotificationClick(notif: AppNotification) {
    if (!notif.is_read) {
      this.notificationService.markAsRead(notif.id);
    }
    if (notif.link) {
      this.router.navigateByUrl(notif.link);
    }
  }

  async logout() {
    await this.authService.signOut();
    this.router.navigate(['/login']);
  }
}