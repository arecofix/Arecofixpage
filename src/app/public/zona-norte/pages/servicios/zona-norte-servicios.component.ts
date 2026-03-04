import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-zona-norte-servicios',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './zona-norte-servicios.component.html',
  styleUrls: ['./zona-norte-servicios.component.scss']
})
export class ZonaNorteServiciosComponent {
  
  servicios = [
    {
      icono: 'fa-bath',
      titulo: 'Enlozado de Bañeras',
      descripcion: 'Restauración profesional de bañeras, jacuzzis e hidromasajes con resina de origen alemán de alta calidad.',
      caracteristicas: [
        'Trabajo completado en 3 horas',
        'Resina de origen alemán',
        'Garantía de durabilidad',
        'Todas las marcas y modelos',
        'Acabado brillante o satinado'
      ],
      imagen: 'assets/img/branches/zona-norte/servicio-banera.jpg',
      tiempo: '3 horas',
      garantia: '2 años'
    },
    {
      icono: 'fa-toilet',
      titulo: 'Sanitarios',
      descripcion: 'Restauración completa de inodoros, bidets, piletas y bachas con cambio de color el mismo día.',
      caracteristicas: [
        'Cambio de color instantáneo',
        'Reparación de grietas y fisuras',
        'Eliminación de manchas',
        'Restauración de brillo',
        'Trabajo en el mismo día'
      ],
      imagen: 'assets/img/branches/zona-norte/servicio-sanitarios.jpg',
      tiempo: '4-6 horas',
      garantia: '1 año'
    },
    {
      icono: 'fa-th-large',
      titulo: 'Azulejos',
      descripcion: 'Instalación y restauración profesional de azulejos con pastina especial y acabados perfectos.',
      caracteristicas: [
        'Instalación completa',
        'Cambio de azulejos rotos',
        'Limpieza profunda',
        'Aplicación de pastina especial',
        'Cotización por metro cuadrado'
      ],
      imagen: 'assets/img/branches/zona-norte/servicio-azulejos.jpg',
      tiempo: '1-2 días',
      garantia: '3 años'
    },
    {
      icono: 'fa-tree',
      titulo: 'Pulido de Parquet',
      descripcion: 'Renovación completa de pisos de madera con 3 procesos de lijado y 3 manos de laca de alto tránsito.',
      caracteristicas: [
        '3 procesos de lijado profesional',
        '3 manos de laca de alto tránsito',
        'Terminación brillante o satinada',
        'Secado de 12 a 15 horas',
        'Trabajo en toda la superficie'
      ],
      imagen: 'assets/img/branches/zona-norte/servicio-parquet.jpg',
      tiempo: '1-2 días',
      garantia: '2 años'
    }
  ];

  constructor() { }

  contactarWhatsApp(servicio?: string) {
    const mensaje = servicio 
      ? `Hola, quiero consultar sobre el servicio de ${servicio} de Sudamericana Enlozados`
      : 'Hola, quiero consultar sobre los servicios de Sudamericana Enlozados';
    window.open(`https://wa.me/5491563049494?text=${encodeURIComponent(mensaje)}`, '_blank');
  }

  llamarTelefono() {
    window.open('tel:0111563049494', '_self');
  }
}
