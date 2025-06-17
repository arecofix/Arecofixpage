import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './header.html',
  styleUrls: ['./header.scss']
})
export class Header {
  mobileMenuOpen = false;
  profileMenuOpen = false;
  searchText: string = '';

  // Simulación de carrito (en producción lo obtendrías de un servicio)
  cartItemCount: number = 3;

  constructor(private router: Router) {}

  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  toggleProfileMenu(): void {
    this.profileMenuOpen = !this.profileMenuOpen;
  }

  // Si querés hacer una búsqueda programática
  search(): void {
    if (this.searchText.trim()) {
      // Redireccionar a una página de resultados con el texto de búsqueda
      this.router.navigate(['/buscar'], { queryParams: { q: this.searchText.trim() } });
    }
  }
}
