import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-zona-norte-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './zona-norte-home.component.html',
  styleUrls: ['./zona-norte-home.component.scss']
})
export class ZonaNorteHomeComponent {
  
  // Hero carousel images
  heroImages = [
    {
      url: 'assets/img/branches/zona-norte/hero-1.jpg',
      title: 'Enlozado Profesional de Bañeras',
      subtitle: 'Restauración completa en 3 horas'
    },
    {
      url: 'assets/img/branches/zona-norte/hero-2.jpg',
      title: 'Jacuzzis y Hidromasajes',
      subtitle: 'Calidad de lujo para tu hogar'
    },
    {
      url: 'assets/img/branches/zona-norte/hero-3.jpg',
      title: 'Pulido de Parquet',
      subtitle: 'Suelos como nuevos'
    },
    {
      url: 'assets/img/branches/zona-norte/hero-4.jpg',
      title: 'Azulejos y Sanitarios',
      subtitle: 'Soluciones integrales para baños'
    }
  ];

  // Servicios principales
  servicios = [
    {
      icono: 'fa-bath',
      titulo: 'Enlozado de Bañeras',
      descripcion: 'Restauración profesional de bañeras, jacuzzis e hidromasajes con resina de origen alemán.',
      caracteristicas: ['Trabajo en 3 horas', 'Resina alemana', 'Garantía de calidad', 'Todas las marcas'],
      imagen: 'assets/img/branches/zona-norte/servicio-banera.jpg'
    },
    {
      icono: 'fa-toilet',
      titulo: 'Sanitarios',
      descripcion: 'Restauración completa de inodoros, bidets, piletas y bachas con cambio de color el mismo día.',
      caracteristicas: ['Cambio de color', 'Reparación de grietas', 'Todas las marcas', 'Resultado duradero'],
      imagen: 'assets/img/branches/zona-norte/servicio-sanitarios.jpg'
    },
    {
      icono: 'fa-th-large',
      titulo: 'Azulejos',
      descripcion: 'Instalación y restauración profesional de azulejos con pastina y acabados perfectos.',
      caracteristicas: ['Instalación completa', 'Cambio de rotos', 'Pastina especial', 'Cotización por m²'],
      imagen: 'assets/img/branches/zona-norte/servicio-azulejos.jpg'
    },
    {
      icono: 'fa-tree',
      titulo: 'Pulido de Parquet',
      descripcion: 'Renovación completa de pisos de madera con 3 procesos de lijado y 3 manos de laca.',
      caracteristicas: ['3 procesos de lijado', '3 manos de laca', 'Alto tránsito', 'Terminación brillante o satinada'],
      imagen: 'assets/img/branches/zona-norte/servicio-parquet.jpg'
    }
  ];

  // Proyectos destacados
  proyectos = [
    {
      titulo: 'Hotel 5 Estrellas - Palermo',
      descripcion: 'Restauración completa de 20 bañeras de lujo',
      imagen: 'assets/img/branches/zona-norte/proyecto-1.jpg',
      categoria: 'Hoteles'
    },
    {
      titulo: 'Consorcio - Belgrano',
      descripcion: 'Enlozado de sanitarios en 10 unidades',
      imagen: 'assets/img/branches/zona-norte/proyecto-2.jpg',
      categoria: 'Consorcios'
    },
    {
      titulo: 'Residencia Privada - Barrio Norte',
      descripcion: 'Pulido de parquet en toda la vivienda',
      imagen: 'assets/img/branches/zona-norte/proyecto-3.jpg',
      categoria: 'Residencial'
    },
    {
      titulo: 'Hospital - CABA',
      descripcion: 'Restauración de baños institucionales',
      imagen: 'assets/img/branches/zona-norte/proyecto-4.jpg',
      categoria: 'Institucional'
    }
  ];

  // Estadísticas
  estadisticas = [
    { numero: '15+', texto: 'Años de Experiencia' },
    { numero: '2000+', texto: 'Proyectos Completados' },
    { numero: '50+', texto: 'Hoteles 5 Estrellas' },
    { numero: '100%', texto: 'Satisfacción Garantizada' }
  ];

  // Testimonios
  testimonios = [
    {
      nombre: 'Carlos Mendoza',
      cargo: 'Gerente de Hotel',
      empresa: 'Hotel Boutique Palermo',
      texto: 'Excelente trabajo profesional. Restauraron todas nuestras bañeras en tiempo récord con una calidad increíble.',
      calificacion: 5
    },
    {
      nombre: 'Ana Rodríguez',
      cargo: 'Administradora',
      empresa: 'Consorcio Belgrano',
      texto: 'Muy responsables y serios. El trabajo quedó impecable y cumplieron con los plazos acordados.',
      calificacion: 5
    },
    {
      nombre: 'Martín Pérez',
      cargo: 'Propietario',
      empresa: 'Residencia Privada',
      texto: 'Mi parquet quedó como nuevo. El equipo muy profesional y cuidadoso con los detalles.',
      calificacion: 5
    }
  ];

  currentImageIndex = 0;

  constructor() { }

  // Carousel methods
  nextImage() {
    this.currentImageIndex = (this.currentImageIndex + 1) % this.heroImages.length;
  }

  prevImage() {
    this.currentImageIndex = (this.currentImageIndex - 1 + this.heroImages.length) % this.heroImages.length;
  }

  goToImage(index: number) {
    this.currentImageIndex = index;
  }

  // Contact methods
  contactarWhatsApp(mensaje?: string) {
    const texto = mensaje || 'Hola, quiero consultar sobre los servicios de Sudamericana Enlozados';
    window.open(`https://wa.me/5491563049494?text=${encodeURIComponent(texto)}`, '_blank');
  }

  llamarTelefono() {
    window.open('tel:0111563049494', '_self');
  }

  // Generar estrellas para testimonios
  getStars(calificacion: number): number[] {
    return Array(5).fill(0).map((_, i) => i < calificacion ? 1 : 0);
  }
}
