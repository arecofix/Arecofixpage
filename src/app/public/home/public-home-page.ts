import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { DataService } from '../../services/data';
import { environment } from '../../../environments/environment';
import { PreferencesService } from '../../shared/services/preferences.service';
import { ReservationCalendar } from '../reservation/reservation-calendar';
import { ProductCarouselComponent } from '../../shared/components/product-carousel/product-carousel.component';
import { ReviewGridComponent } from '../../shared/components/review-grid/review-grid.component';
import { ArticleGridComponent } from '../../shared/components/article-grid/article-grid.component';

interface ProductItem {
  image: string;
  name: string;
  description: string;
  price: string;
  category: string;
  link: string;
}

interface ReviewItem {
  image: string;
  name: string;
  rating: number;
  text: string;
  date: string;
}

interface ArticleItem {
  image: string;
  category: string;
  title: string;
  description: string;
  link: string;
  color: string;
}

interface HomeContent {
  hero: {
    title: string;
    message: string;
    cta: string;
  };
  features: {
    solutions: { title: string; description: string; };
    payments: { title: string; description: string; };
    returns: { title: string; description: string; };
    support: { title: string; description: string; };
  };
  products: {
    title: string;
    subtitle: string;
    addToCart: string;
  };
  specialOffers: {
    title: string;
    items: ProductItem[];
  };
  techBest: {
    title: string;
    items: ProductItem[];
  };
  service: {
    title: string;
    subtitle: string;
    cta: string;
    guarantee: string;
  };
  software: {
    title: string;
    subtitle: string;
    description: string;
    ctaQuote: string;
    ctaPortfolio: string;
    techUsed: string;
  };
  courses: {
    title: string;
    subtitle: string;
    cta: string;
  };
  coursesList: { img: string; title: string; subtitle: string; }[];
  consoles: {
    badge: string;
    title: string;
    description: string;
    ctaQuote: string;
    ctaProducts: string;
  };
  reviews: {
    title: string;
    cta: string;
    items: ReviewItem[];
  };
  news: {
    title: string;
    description: string;
    cta: string;
    items: ArticleItem[];
  };
  partsPromo: {
    title: string;
    subtitle: string;
    description: string;
    cta: string;
    guarantee: string;
    stock: string;
  };
}

@Component({
  selector: 'app-public-home-page',
  standalone: true,
  imports: [CommonModule, ReservationCalendar, ProductCarouselComponent, ReviewGridComponent, ArticleGridComponent],
  templateUrl: './public-home-page.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PublicHomePage {
  whatsappNumber = environment.contact.whatsappNumber;
  googleMapsLink = environment.contact.socialMedia.googleMaps;

  homeContent: { en: HomeContent; es: HomeContent } = {
    en: {
      hero: {
        title: 'Comprehensive Technology Solutions - Arecofix',
        message: 'Experts in cell phone and computer repair. Find the most complete catalog of spare parts, accessories, and IT equipment in one place.',
        cta: 'Products'
      },
      features: {
        solutions: { title: 'IT Solutions', description: 'IT consulting and custom development.' },
        payments: { title: 'Secure Payments', description: 'We accept all payment methods.' },
        returns: { title: 'Returns & Exchanges', description: 'We work with a 30-day warranty.' },
        support: { title: 'Technical Support', description: 'Technical assistance and maintenance for your mobile device.' }
      },
      products: {
        title: 'Featured Products',
        subtitle: 'Find everything in technology.',
        addToCart: 'Add to Cart'
      },
      specialOffers: {
        title: 'Special Offers',
        items: [
          { image: 'assets/img/products/a06.webp', name: 'Samsung Galaxy A06', description: 'Latest Samsung | $320 | Cellphones', price: '$320', category: 'Cellphones', link: '/#/products/details/samsung-galaxy-a06' },
          { image: 'assets/img/products/arreglo-consolas.webp', name: 'P9 Pro Max Headphones', description: 'New in Box | $19000 | Accessories', price: '$19000', category: 'Accessories', link: '/#/products/details/p9-pro-max' },
          { image: 'assets/img/products/servicio-tecnico-consolas.webp', name: 'Wireless Charger Speaker', description: 'New in Box | $27000 | Accessories', price: '$27000', category: 'Accessories', link: '/#/products/details/wireless-speaker' },
          { image: 'assets/img/products/reparacion-consolas.webp', name: 'PS4 Joystick', description: 'New in Box | $47800 | Consoles', price: '$47800', category: 'Consoles', link: '/#/products/details/ps4-joystick' }
        ]
      },
      techBest: {
        title: 'The Best in Technology',
        items: [
          { image: 'assets/img/products/sam.webp', name: 'Samsung Galaxy J8', description: 'Samsung Galaxy J8 Blue | $79000 | Cellphones', price: '$79000', category: 'Cellphones', link: '/#/products/details/samsung-galaxy-j8' },
          { image: 'assets/img/products/iphx.webp', name: 'Motorola Moto E32', description: 'Motorola Moto E32 | $56000 | Cellphones', price: '$56000', category: 'Cellphones', link: '/#/products/details/motorola-moto-e32' },
          { image: 'assets/img/products/iph8plus.webp', name: 'iPhone 8 Plus', description: 'Apple New in Box | $290 USD | Cellphones', price: '$290 USD', category: 'Cellphones', link: '/#/products/details/iphone-8-plus' },
          { image: 'assets/img/products/j2.webp', name: 'TCL 7 SE', description: 'TCL 7 SE Cracked Glass | $9800 | Cellphones', price: '$9800', category: 'Cellphones', link: '/#/products/details/tcl-7-se' }
        ]
      },
      service: {
        title: 'Technical Service',
        subtitle: 'Fast and guaranteed repair. Schedule a free appointment now to repair your device today.',
        cta: 'Schedule Appointment',
        guarantee: '30-day warranty on all repairs'
      },
      software: {
        title: 'We transform ideas into',
        subtitle: 'High Impact Software',
        description: 'Custom web and mobile development. We create scalable solutions that drive your business digitally.',
        ctaQuote: 'Quote Project',
        ctaPortfolio: 'View Portfolio',
        techUsed: 'Technologies we use:'
      },
      courses: {
        title: 'Certified Professional Training',
        subtitle: 'More than 500 students trained with our proven methods',
        cta: 'View Courses and Training'
      },
      coursesList: [
        { img: 'assets/img/cursos/egresado-2025.jpg', title: 'Tobias Marchi', subtitle: 'Graduate 2025' },
        { img: 'assets/img/cursos/alumno3.jpg', title: 'Official Certification', subtitle: 'Improve your skills' },
        { img: 'assets/img/cursos/alumno2.jpg', title: 'Equipped Classrooms', subtitle: 'State-of-the-art technology' },
        { img: 'assets/img/cursos/aprendizaje-practico.jpg', title: 'Practical Learning', subtitle: '85% practice - 15% theory' }
      ],
      consoles: {
        badge: 'Official Technical Service',
        title: 'Video Game Console Repair',
        description: 'We recover your fun. We offer preventive maintenance, deep cleaning, and advanced hardware repair for PlayStation, Xbox, and Nintendo.',
        ctaQuote: 'Quote Repair',
        ctaProducts: 'View Products'
      },
      reviews: {
        title: 'What our clients say',
        cta: 'View more reviews',
        items: [
          { image: 'https://randomuser.me/api/portraits/women/43.jpg', name: 'Jimena Rodriguez', rating: 5, text: 'Fast screen repair in less than 2 hours. Excellent service.', date: '1 week ago' },
          { image: 'https://randomuser.me/api/portraits/men/32.jpg', name: 'Carlos Martínez', rating: 4.5, text: 'Good service. Excellent attention and the fix was perfect, thanks.', date: '3 weeks ago' },
          { image: 'https://randomuser.me/api/portraits/women/65.jpg', name: 'Marcela Pita', rating: 5, text: 'Truly excellent work, responsible, very polite and above all very honest. Thanks Ezequiel!!', date: '2 months ago' }
        ]
      },
      news: {
        title: 'News and Resources',
        description: 'Explore our latest articles on software, GSM technology, and exclusive downloads.',
        cta: 'Read article',
        items: [
          { image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1000&auto=format&fit=crop', category: 'Technology', title: 'Software and Development', description: 'Discover the latest lab tools and code optimization.', link: '/#/gsm#Software', color: 'bg-blue-600' },
          { image: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?q=80&w=1000&auto=format&fit=crop', category: 'GSM', title: 'GSM Solutions', description: 'Everything about unlocking, flashing, and advanced software repairs.', link: '/#/gsm', color: 'bg-purple-600' },
          { image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1000&auto=format&fit=crop', category: 'Resources', title: 'Useful Downloads', description: 'Access schematics, boardviews, and technical service software.', link: '/#/recursos', color: 'bg-green-600' }
        ]
      },
      partsPromo: {
        title: 'Does your cell phone need new life?',
        subtitle: 'We have the exact spare part.',
        description: 'Original screens, batteries, and modules with the best warranty on the market.',
        cta: 'View Products',
        guarantee: 'Real Warranty',
        stock: 'Immediate Stock'
      }
    },
    es: {
      hero: {
        title: 'Soluciones Integrales en Tecnología - Arecofix',
        message: 'Expertos en reparación de celulares y computadoras. Encuentra también el catálogo más completo de repuestos, accesorios y equipamiento IT en un solo lugar.',
        cta: 'Productos'
      },
      features: {
        solutions: { title: 'Soluciones Informáticas', description: 'Consultoría IT y desarrollo a medida.' },
        payments: { title: 'Pagos Seguros', description: 'Aceptamos todos los medios de pago.' },
        returns: { title: 'Devoluciones y cambios', description: 'Trabajamos con Garantía de 30 días.' },
        support: { title: 'Soporte Técnico', description: 'Asistencia técnica y mantenimiento para tu Dispositivo Móvil.' }
      },
      products: {
        title: 'Productos Destacados',
        subtitle: 'Encuentra todo en tecnología.',
        addToCart: 'Agregar al Carrito'
      },
      specialOffers: {
        title: 'Ofertas Especiales',
        items: [
          { image: 'assets/img/products/a06.webp', name: 'Samsung Galaxy A06', description: 'Lo ultimo de Samsung | $320 | Celulares', price: '$320', category: 'Celulares', link: '/#/products/details/samsung-galaxy-a06' },
          { image: 'assets/img/products/arreglo-consolas.webp', name: 'Auriculares P9 Pro Max', description: 'Auriculares Nuevo en Caja | $19000 | Celulares', price: '$19000', category: 'Celulares', link: '/#/products/details/auriculares-p9-pro-max' },
          { image: 'assets/img/products/servicio-tecnico-consolas.webp', name: 'Parlante Cargador Inalambrico', description: 'Parlante Nuevo en Caja | $27000 | Celulares', price: '$27000', category: 'Celulares', link: '/#/products/details/parlante-cargador-inalambrico' },
          { image: 'assets/img/products/reparacion-consolas.webp', name: 'Joystick Play Station 4', description: 'Joystick Nuevo en Caja | $47800 | Consolas', price: '$47800', category: 'Consolas', link: '/#/products/details/joystick-play-station-4' }
        ]
      },
      techBest: {
        title: 'Lo mejor en tecnología',
        items: [
          { image: 'assets/img/products/sam.webp', name: 'Samsung Galaxy J8', description: 'En venta Samsung Galaxy J8 Color Azul | $79000 | Celulares', price: '$79000', category: 'Celulares', link: '/#/products/details/samsung-galaxy-j8' },
          { image: 'assets/img/products/iphx.webp', name: 'Motorola Moto E32', description: 'Motorola Moto E32 | $56000 | Celulares', price: '$56000', category: 'Celulares', link: '/#/products/details/motorola-moto-e32' },
          { image: 'assets/img/products/iph8plus.webp', name: 'iPhone 8 Plus', description: 'Apple Nuevo en Caja | $290 USD | Celulares', price: '$290 USD', category: 'Celulares', link: '/#/products/details/iphone-8-plus' },
          { image: 'assets/img/products/j2.webp', name: 'TCL 7 SE', description: 'TCL 7 SE Vidrio Astillado | $29000 | Celulares', price: '$29000', category: 'Celulares', link: '/#/products/details/tcl-7-se' }
        ]
      },
      service: {
        title: 'Servicio Técnico',
        subtitle: 'Reparación rápida y garantizada. Agenda una cita ahora sin cargo para reparar tu dispositivo en el día.',
        cta: 'Agendar Cita',
        guarantee: 'Garantía de 30 días en todas las reparaciones'
      },
      software: {
        title: 'Transformamos ideas en',
        subtitle: 'Software de Alto Impacto',
        description: 'Desarrollo web y móvil a medida. Creamos soluciones escalables que impulsan tu negocio digitalmente.',
        ctaQuote: 'Cotizar Proyecto',
        ctaPortfolio: 'View Portfolio',
        techUsed: 'Tecnologías que utilizamos:'
      },
      courses: {
        title: 'Formación Profesional Certificada',
        subtitle: 'Más de 500 alumnos capacitados con nuestros métodos comprobados',
        cta: 'Ver Cursos y Capacitaciones'
      },
      coursesList: [
        { img: 'assets/img/cursos/egresado-2025.jpg', title: 'Tobias Marchi', subtitle: 'Egresado 2025' },
        { img: 'assets/img/cursos/alumno3.jpg', title: 'Certificación Oficial', subtitle: 'Mejora tus capacidades' },
        { img: 'assets/img/cursos/alumno2.jpg', title: 'Aulas Equipadas', subtitle: 'Tecnología de última generación' },
        { img: 'assets/img/cursos/aprendizaje-practico.jpg', title: 'Aprendizaje Práctico', subtitle: '85% práctica - 15% teoría' }
      ],
      consoles: {
        badge: 'Servicio Técnico Oficial',
        title: 'Reparación de Consolas de Videojuegos',
        description: 'Recuperamos tu diversión. Ofrecemos mantenimiento preventivo, limpieza profunda y reparación avanzada de hardware para PlayStation, Xbox y Nintendo.',
        ctaQuote: 'Cotizar Reparación',
        ctaProducts: 'Ver Productos'
      },
      reviews: {
        title: 'Lo que dicen nuestros clientes',
        cta: 'Ver más reseñas',
        items: [
          { image: 'https://randomuser.me/api/portraits/women/43.jpg', name: 'Jimena Rodriguez', rating: 5, text: 'Rápida reparación de mi pantalla en menos de 2 horas. Excelente servicio.', date: 'Hace 1 semana' },
          { image: 'https://randomuser.me/api/portraits/men/32.jpg', name: 'Carlos Martínez', rating: 4.5, text: 'Buen servicio. Excelente atención y el arreglo quedó perfecto gracias', date: 'Hace 3 semanas' },
          { image: 'https://randomuser.me/api/portraits/women/65.jpg', name: 'Marcela Pita', rating: 5, text: 'La verdad excelente trabajo, responsable muy educado y sobre todo muy honesto. ¡Gracias Ezequiel!!', date: 'Hace 2 meses' }
        ]
      },
      news: {
        title: 'Novedades y Recursos',
        description: 'Explora nuestros últimos artículos sobre software, tecnología GSM y descargas exclusivas.',
        cta: 'Ver artículo',
        items: [
          { image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1000&auto=format&fit=crop', category: 'Tecnología', title: 'Software y Desarrollo', description: 'Descubre las últimas herramientas de laboratorio y optimización de código.', link: '/#/gsm#Software', color: 'bg-blue-600' },
          { image: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?q=80&w=1000&auto=format&fit=crop', category: 'GSM', title: 'Soluciones GSM', description: 'Todo sobre desbloqueos, flasheos y reparaciones de software avanzado.', link: '/#/gsm', color: 'bg-purple-600' },
          { image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1000&auto=format&fit=crop', category: 'Recursos', title: 'Descargas Útiles', description: 'Accede a esquemáticos, boardviews y software de servicio técnico.', link: '/#/recursos', color: 'bg-green-600' }
        ]
      },
      partsPromo: {
        title: '¿Tu celular necesita vida nueva?',
        subtitle: 'Tenemos el repuesto exacto.',
        description: 'Pantallas, baterías y módulos originales con la mejor garantía del mercado.',
        cta: 'Ver Productos',
        guarantee: 'Garantía Real',
        stock: 'Stock Inmediato'
      }
    }
  };

  content$: Observable<HomeContent>;

  constructor(public preferencesService: PreferencesService) {
    this.content$ = this.preferencesService.language$.pipe(
      map(lang => this.homeContent[lang])
    );
  }
}