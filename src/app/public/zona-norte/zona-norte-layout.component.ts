import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-zona-norte-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './zona-norte-layout.component.html',
  styleUrls: ['./zona-norte-layout.component.scss']
})
export class ZonaNorteLayoutComponent {
  
  // Datos de la sucursal Zona Norte
  sucursal = {
    nombre: 'Sudamericana Enlozados',
    subtitulo: 'Especialistas en Plomería y Restauración',
    telefono: '(011) 15-6304-9494',
    email: 'enlosud@hotmail.com',
    direccion: 'Beazley 3735 - Pompeya CABA',
    whatsapp: '5491563049494',
    logo: 'assets/img/branches/zona-norte/logo.png',
    favicon: 'assets/img/branches/zona-norte/favicon.ico'
  };

  // Menú de navegación específico para la sucursal
  menuItems = [
    { title: 'Inicio', path: '/Zona-Norte', icon: 'fa-home' },
    { title: 'Servicios', path: '/Zona-Norte/servicios', icon: 'fa-tools' },
    { title: 'Productos', path: '/Zona-Norte/productos', icon: 'fa-shopping-bag' },
    { title: 'Galería', path: '/Zona-Norte/galeria', icon: 'fa-images' },
    { title: 'Nosotros', path: '/Zona-Norte/nosotros', icon: 'fa-users' },
    { title: 'Contacto', path: '/Zona-Norte/contacto', icon: 'fa-envelope' }
  ];

  // Información de la empresa
  empresa = {
    nombre: 'Sudamericana Enlozados',
    fundado: '2018',
    descripcion: 'Con más de 15 años de experiencia, somos líderes en enlozado de bañeras, restauración de sanitarios y pulido de parquet.',
    servicios: [
      'Enlozado de bañeras y jacuzzis',
      'Restauración de sanitarios',
      'Instalación de azulejos',
      'Pulido y plastificado de parquet',
      'Trabajos en todo el país'
    ]
  };

  constructor() { }

  // Método para contactar por WhatsApp
  contactarWhatsApp(mensaje?: string) {
    const texto = mensaje || 'Hola, quiero consultar sobre los servicios de Sudamericana Enlozados';
    window.open(`https://wa.me/${this.sucursal.whatsapp}?text=${encodeURIComponent(texto)}`, '_blank');
  }

  // Método para llamar por teléfono
  llamarTelefono() {
    window.open(`tel:${this.sucursal.telefono}`, '_self');
  }

  // Método para enviar email
  enviarEmail() {
    window.open(`mailto:${this.sucursal.email}`, '_self');
  }

  // Método para scroll al top
  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Método para toggle del menú móvil
  mobileMenuOpen = false;
  
  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  closeMobileMenu() {
    this.mobileMenuOpen = false;
  }
}
