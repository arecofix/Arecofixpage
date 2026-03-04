import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-zona-norte-nosotros',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './zona-norte-nosotros.component.html',
  styleUrls: ['./zona-norte-nosotros.component.scss']
})
export class ZonaNorteNosotrosComponent {
  
  historia = {
    titulo: 'Nuestra Historia',
    contenido: 'Sudamericana Enlozados nació hace más de 15 años con la misión de ofrecer soluciones de alta calidad en restauración de baños y pisos. Comenzamos como un pequeño taller familiar y, gracias a la dedicación y el compromiso con la excelencia, hemos crecido hasta convertirnos en referentes del mercado.',
    anioFundacion: 2008,
    empleados: 25,
    proyectosCompletados: 2000
  };

  mision = {
    titulo: 'Nuestra Misión',
    contenido: 'Transformar los espacios de nuestros clientes a través de soluciones innovadoras y duraderas, superando sus expectativas con cada trabajo. Nos comprometemos a utilizar los mejores materiales y técnicas del mercado para garantizar resultados excepcionales.',
    icono: 'fa-bullseye'
  };

  vision = {
    titulo: 'Nuestra Visión',
    contenido: 'Ser la empresa líder en restauración de baños y pisos a nivel nacional, reconocida por nuestra calidad, profesionalismo y capacidad de innovación. Buscamos expandir nuestros servicios manteniendo siempre los estándares de excelencia que nos caracterizan.',
    icono: 'fa-eye'
  };

  valores = [
    {
      titulo: 'Calidad',
      descripcion: 'No comprometemos la calidad en ningún trabajo. Utilizamos solo materiales premium y técnicas probadas.',
      icono: 'fa-award'
    },
    {
      titulo: 'Profesionalismo',
      descripcion: 'Cada miembro de nuestro equipo está altamente capacitado y comprometido con la excelencia.',
      icono: 'fa-user-tie'
    },
    {
      titulo: 'Puntualidad',
      descripcion: 'Respetamos los plazos acordados y cumplimos con los tiempos de entrega prometidos.',
      icono: 'fa-clock'
    },
    {
      titulo: 'Confianza',
      descripcion: 'Construimos relaciones duraderas con nuestros clientes basadas en la transparencia y honestidad.',
      icono: 'fa-handshake'
    }
  ];

  equipo = [
    {
      nombre: 'Juan Carlos Pérez',
      cargo: 'Fundador y Director General',
      experiencia: '15+ años',
      especialidad: 'Enlozado y restauración',
      foto: 'assets/img/branches/zona-norte/equipo-1.jpg',
      descripcion: 'Líder con amplia experiencia en el sector, visionario y comprometido con la calidad.'
    },
    {
      nombre: 'María González',
      cargo: 'Directora de Operaciones',
      experiencia: '10+ años',
      especialidad: 'Gestión de proyectos',
      foto: 'assets/img/branches/zona-norte/equipo-2.jpg',
      descripcion: 'Experta en coordinación de equipos y gestión de grandes proyectos.'
    },
    {
      nombre: 'Roberto Silva',
      cargo: 'Jefe de Taller',
      experiencia: '12+ años',
      especialidad: 'Pulido de parquet',
      foto: 'assets/img/branches/zona-norte/equipo-3.jpg',
      descripcion: 'Maestro en el arte de la restauración de pisos de madera.'
    },
    {
      nombre: 'Laura Martínez',
      cargo: 'Supervisora de Calidad',
      experiencia: '8+ años',
      especialidad: 'Control de calidad',
      foto: 'assets/img/branches/zona-norte/equipo-4.jpg',
      descripcion: 'Garantiza que cada trabajo cumpla con nuestros estándares de excelencia.'
    }
  ];

  clientes = [
    {
      nombre: 'Hotel Boutique Palermo',
      tipo: 'Hotelería 5 estrellas',
      logo: 'assets/img/branches/zona-norte/cliente-1.jpg',
      testimonio: 'Trabajo excepcional, cumplieron con todos los plazos y la calidad fue superior.'
    },
    {
      nombre: 'Consorcio Belgrano',
      tipo: 'Consorcios',
      logo: 'assets/img/branches/zona-norte/cliente-2.jpg',
      testimonio: 'Profesionales serios y responsables. Recomendados 100%.'
    },
    {
      nombre: 'Hospital Municipal',
      tipo: 'Salud',
      logo: 'assets/img/branches/zona-norte/cliente-3.jpg',
      testimonio: 'Trabajaron con las normas de higiene requeridas, excelente resultado.'
    },
    {
      nombre: 'Corporate Building',
      tipo: 'Oficinas',
      logo: 'assets/img/branches/zona-norte/cliente-4.jpg',
      testimonio: 'Transformaron nuestros espacios, muy profesionales y eficientes.'
    }
  ];

  certificaciones = [
    {
      nombre: 'Certificación de Calidad ISO 9001',
      descripcion: 'Sistema de gestión de calidad reconocido internacionalmente',
      icono: 'fa-certificate'
    },
    {
      nombre: 'Registro de Constructores',
      descripcion: 'Habilitación municipal para trabajos de construcción',
      icono: 'fa-hard-hat'
    },
    {
      nombre: 'Seguro de Responsabilidad Civil',
      descripcion: 'Cobertura completa para todos nuestros trabajos',
      icono: 'fa-shield-alt'
    }
  ];

  constructor() { }

  contactarWhatsApp(mensaje?: string) {
    const texto = mensaje || 'Hola, quiero conocer más sobre Sudamericana Enlozados';
    window.open(`https://wa.me/5491563049494?text=${encodeURIComponent(texto)}`, '_blank');
  }

  llamarTelefono() {
    window.open('tel:0111563049494', '_self');
  }
}
