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
    { title: 'Productos', path: '/admin/products', icon: 'fa-box' },
    { title: 'Cursos', path: '/admin/courses', icon: 'fa-graduation-cap' },
    { title: 'Servicios', path: '/admin/services', icon: 'fa-tools' },
    { title: 'Taller', path: '/admin/repairs', icon: 'fa-wrench' },
    { title: 'Pedidos', path: '/admin/orders', icon: 'fa-shopping-cart' },
    { title: 'Mensajes', path: '/admin/messages', icon: 'fa-envelope' },
  ];

  async logout() {
    await this.authService.signOut();
    this.router.navigate(['/auth/login']);
  }
}