import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-zona-norte',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './zona-norte.component.html',
  styleUrls: ['./zona-norte.component.scss']
})
export class ZonaNorteComponent {
  
  // Datos del formulario de contacto
  contactoForm = {
    nombre: '',
    telefono: '',
    email: '',
    consulta: ''
  };

  // Imágenes para el carousel
  carouselImages = [
    {
      url: 'assets/img/services/banera-1.jpg',
      alt: 'Bañera restaurada profesionalmente'
    },
    {
      url: 'assets/img/services/banera-2.jpg', 
      alt: 'Jacuzzi moderno renovado'
    },
    {
      url: 'assets/img/services/banera-3.jpg',
      alt: 'Hidromasaje de lujo'
    },
    {
      url: 'assets/img/services/banera-4.jpg',
      alt: 'Bañera antes y después'
    },
    {
      url: 'assets/img/services/banera-5.jpg',
      alt: 'Trabajo profesional en baños'
    }
  ];

  // Servicios ofrecidos
  servicios = [
    {
      titulo: 'ENLOZADO',
      descripcion: 'BAÑERAS - JACUZZI - HIDROMASAJES',
      detalle: 'La superﬁcie se somete a un riguroso tratamiento para obtener una impregnación adecuada de la resina de origen alemán. El trabajo se realiza en 3 horas.',
      icono: 'fa-bath'
    },
    {
      titulo: 'SANITARIOS',
      descripcion: 'Restauración completa de sanitarios',
      detalle: 'Se puede realizar cualquier modiﬁcación de color en el día, siguiendo los mismos procedimientos que en las bañeras - hidromasajes - jacuzzy. También en: inodoro, videt, piletas, bachas, jaboneras, etc.',
      icono: 'fa-toilet'
    },
    {
      titulo: 'AZULEJOS',
      descripcion: 'Instalación y restauración profesional',
      detalle: 'Los azulejos se someten a una rigurosa limpieza, luego se aplica pastina en toda la superficie. Se pueden realizar cambios de azulejos rotos o deteriorados. Luego se realiza el mismo procedimiento que en bañeras - hidromasajes - jacuzzy. El trabajo se cotiza por metro cuadrado (m2).',
      icono: 'fa-th-large'
    },
    {
      titulo: 'PULIDO Y PLASTIFICADO DE PARQUET',
      descripcion: 'Renovación de pisos de madera',
      detalle: 'Los trabajos los realizamos basándonos en las especificaciones técnicas de los productos utilizados. Para el plastificado se procede a la preparación de la superficie en 3 procesos de lijado y se aplican 3 manos de laca de Alto Tránsito de terminación Brillante o Satinado.',
      icono: 'fa-tree'
    }
  ];

  currentImageIndex = 0;

  constructor() { }

  // Métodos para el carousel
  nextImage() {
    this.currentImageIndex = (this.currentImageIndex + 1) % this.carouselImages.length;
  }

  prevImage() {
    this.currentImageIndex = (this.currentImageIndex - 1 + this.carouselImages.length) % this.carouselImages.length;
  }

  goToImage(index: number) {
    this.currentImageIndex = index;
  }

  // Método para enviar formulario
  enviarConsulta() {
    // Aquí iría la lógica para enviar el formulario
    console.log('Enviando consulta:', this.contactoForm);
    
    // Simulación de envío
    alert('¡Consulta enviada con éxito! Nos contactaremos a la brevedad.');
    
    // Limpiar formulario
    this.contactoForm = {
      nombre: '',
      telefono: '',
      email: '',
      consulta: ''
    };
  }

  // Método para WhatsApp
  contactarWhatsApp() {
    const mensaje = encodeURIComponent('Hola, quiero consultar sobre los servicios de plomería de Zona Norte');
    window.open(`https://wa.me/5491563049494?text=${mensaje}`, '_blank');
  }
}
