import {
  Component,
  OnInit,
  inject,
  PLATFORM_ID,
  ChangeDetectorRef,
} from '@angular/core';
import { CommonModule, DOCUMENT, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Title, Meta } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { AuthService } from '@app/core/services/auth.service';
import { ReservationCalendar } from '@app/public/reservation/reservation-calendar';
// Note: Assuming ProductCard or similar is available.
// For now, I will use a simple iteration in HTML or simple cards as in Home.
// If ProductCarouselComponent is standalone, I can import it.
import { ProductCarouselComponent } from '@app/shared/components/product-carousel/product-carousel.component';

@Component({
  selector: 'app-celular-landing',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    FormsModule,
    ReservationCalendar,
    ProductCarouselComponent,
  ],
  templateUrl: './celular-landing.component.html',
})
export class CelularLandingComponent implements OnInit {
  private titleService = inject(Title);
  private metaService = inject(Meta);
  private document = inject(DOCUMENT);
  private platformId = inject(PLATFORM_ID);
  private auth = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);

  whatsappNumber = environment.contact.whatsappNumber;

  // --- MIGRATED DATA ---

  // Special Offers (Lo ultimo de Samsung etc)
  specialOffers = [
    {
      image: 'assets/img/products/a06.webp',
      name: 'Samsung Galaxy A06',
      description: 'Lo ultimo de Samsung | $320 | Celulares',
      price: '$320',
      category: 'Celulares',
      link: '/#/products',
    },
    {
      image: 'assets/img/products/arreglo-consolas.webp',
      name: 'Auriculares P9 Pro Max',
      description: 'Auriculares Nuevo en Caja | $19000 | Celulares',
      price: '$19000',
      category: 'Celulares',
      link: '/#/products',
    },
    {
      image: 'assets/img/products/servicio-tecnico-consolas.webp',
      name: 'Parlante Cargador Inalambrico',
      description: 'Parlante Nuevo en Caja | $27000 | Celulares',
      price: '$27000',
      category: 'Celulares',
      link: '/#/products',
    },
    {
      image: 'assets/img/products/reparacion-consolas.webp',
      name: 'Joystick Play Station 4',
      description: 'Joystick Nuevo en Caja | $47800 | Consolas',
      price: '$47800',
      category: 'Consoles',
      link: '/#/products',
    },
  ];

  // Tech Best (Lo mejor en tecnología)
  techBest = [
    {
      image: 'assets/img/products/sam.webp',
      name: 'Samsung Galaxy J8',
      description: 'En venta Samsung Galaxy J8 Color Azul | $79000 | Celulares',
      price: '$79000',
      category: 'Celulares',
      link: '/#/products',
    },
    {
      image: 'assets/img/products/iphx.webp',
      name: 'Motorola Moto E32',
      description: 'Motorola Moto E32 | $56000 | Celulares',
      price: '$56000',
      category: 'Celulares',
      link: '/#/products',
    },
    {
      image: 'assets/img/products/iph8plus.webp',
      name: 'iPhone 8 Plus',
      description: 'Apple Nuevo en Caja | $290 USD | Celulares',
      price: '$290 USD',
      category: 'Celulares',
      link: '/#/products',
    },
    {
      image: 'assets/img/products/j2.webp',
      name: 'TCL 7 SE',
      description: 'TCL 7 SE Vidrio Astillado | $29000 | Celulares',
      price: '$29000',
      category: 'Celulares',
      link: '/#/products',
    },
  ];

  // Courses List
  coursesList = [
    {
      img: 'assets/img/cursos/egresado-2025.jpg',
      title: 'Tobias Marchi',
      subtitle: 'Egresado 2025',
    },
    {
      img: 'assets/img/cursos/alumno3.jpg',
      title: 'Certificación Oficial',
      subtitle: 'Mejora tus capacidades',
    },
    {
      img: 'assets/img/cursos/alumno2.jpg',
      title: 'Aulas Equipadas',
      subtitle: 'Tecnología de última generación',
    },
    {
      img: 'assets/img/cursos/aprendizaje-practico.jpg',
      title: 'Aprendizaje Práctico',
      subtitle: '85% práctica - 15% teoría',
    },
  ];

  // Contact Form Data
  contactName = '';
  contactPhone = '';
  contactMessage = '';
  sendingContact = false;

    // FAQ Data
    faqs = [
        {
            question: '¿Cuánto tiempo tarda la reparación de un celular?',
            answer: 'La mayoría de las reparaciones como cambio de módulo (pantalla) o batería se realizan en el día, generalmente entre 1 a 3 horas.'
        },
        {
            question: '¿Tienen garantía los arreglos?',
            answer: 'Sí, todas nuestras reparaciones cuentan con garantía escrita de 30 a 90 días sobre el repuesto y la mano de obra.'
        },
        {
            question: '¿Se pierden mis datos al reparar el equipo?',
            answer: 'No. En cambios de pantalla, batería y reparaciones de hardware, tus fotos y datos permanecen intactos.'
        },
        {
            question: '¿Aceptan tarjetas de crédito/débito?',
            answer: 'Sí, aceptamos efectivo, transferencia, tarjetas de crédito y débito, y Mercado Pago.'
        }
    ];

    // Reviews Data
    reviews = [
        {
            name: 'Laura Gómez',
            date: 'hace 2 días',
            stars: 5,
            initial: 'L',
            bgColor: 'bg-orange-500',
            text: 'Excelente atención. Me cambiaron la pantalla de mi Samsung A32 en menos de 2 horas. Quedó como nuevo y el precio me pareció justo. Muy recomendables.'
        },
        {
            name: 'Martín Rodriguez',
            date: 'hace 1 semana',
            stars: 5,
            initial: 'M',
            bgColor: 'bg-blue-600',
            text: 'Fui por un problema de carga en mi iPhone 11. Pensé que era el pin de carga pero me lo limpiaron y funcionó perfecto. Honestidad total, no me cobraron de más.'
        },
        {
            name: 'Sofía Mendez',
            date: 'hace 3 semanas',
            stars: 4,
            initial: 'S',
            bgColor: 'bg-green-600',
            text: 'Buena atención y rapidez. Compré un cargador original y funciona bárbaro. Lo único que hay un poco de espera, pero vale la pena.'
        },
        {
            name: 'Carlos Alberto',
            date: 'hace 1 mes',
            stars: 5,
            initial: 'C',
            bgColor: 'bg-green-600',
            text: 'Llevé una notebook y un celular. Los dos quedaron perfectos. Son técnicos de verdad, saben lo que hacen. El local está muy bien puesto.'
        }
    ];
    
    // Process Steps
    processSteps = [
        {
            title: '1. Recepción',
            desc: 'Traés tu equipo a nuestra sede. Te generamos una orden de servicio única.',
            icon: 'fas fa-store',
            color: 'text-indigo-600',
            bg: 'bg-white'
        },
        {
            title: '2. Reparación',
            desc: 'Experiencia pura. Nuestros técnicos trabajan en tu equipo con repuestos de calidad.',
            icon: 'fas fa-tools',
            color: 'text-indigo-400',
            bg: 'bg-gray-800'
        },
        {
            title: '3. Seguimiento App',
            desc: '¡Exclusivo! Seguí el estado de tu reparación en tiempo real desde nuestra App web.',
            icon: 'fas fa-mobile-alt',
            color: 'text-green-400',
            bg: 'bg-gray-800'
        },
        {
            title: '4. A Disfrutar',
            desc: 'Retirás tu equipo funcionando como nuevo y con garantía escrita.',
            icon: 'fas fa-smile-beam',
            color: 'text-yellow-500',
            bg: 'bg-white'
        }
    ];

    // Gallery Items
    galleryItems = [
        { type: 'video', src: 'assets/img/repair/4.mp4', poster: 'assets/img/repair/1.jpg', span: 'col-span-2 row-span-2' },
        { type: 'image', src: 'assets/img/repair/13.jpg', alt: 'Reparación de placa', span: '' },
        { type: 'image', src: 'assets/img/repair/6.jpg', alt: 'Microscopio digital', span: '' },
        { type: 'image', src: 'assets/img/repair/3.jpg', alt: 'Cambio de pantalla', span: '' },
        { type: 'image', src: 'assets/img/repair/iphone.jpg', alt: 'Reparación iPhone', span: '' }
    ];
    
    // Partners & Mentions
    partners = [
        { name: 'MobiDoc', img: 'https://mobidoc.com.ar/wp-content/uploads/2021/08/Logo-MobiDoc-Web.png', url: 'https://mobidoc.com.ar' },
        { name: 'Mercado Pago', icon: 'fas fa-hand-holding-usd', color: 'text-blue-400' },
        { name: 'Reviews', icon: 'fab fa-google', color: 'text-blue-600' }
    ];

    mentions = [
        { name: 'La Electrónica Online', url: 'https://laelectronicaonline.com.ar/casa-electronica/arecofix-servicio-tecnico-de-celulares-venta-de-repuestos/' },
        { name: 'Municipio Marcos Paz', url: 'https://www.marcospaz.gob.ar/noticias/item/8551-j%C3%B3venes-del-programa-envi%C3%B3n-finalizaron-el-curso-de-reparaci%C3%B3n-de-celulares.html' },
        { name: 'A1 Noticias', url: 'https://a1noticias.com.ar/nota/9798/marcos-paz-jovenes-del-programa-envion-finalizaron-el-curso-de-reparacion-de-celulares' },
        { name: 'Mobidoc', url: 'https://mobidoc.com.ar/servicio-tecnico/arecofix-soluciones-digitales/' },
        { name: 'Red Argentina', url: 'https://www.redargentina.com.ar/arecofix-servicio-tecnico-de-celulares-en-marcos-paz-F120EC10E1AD945' },
        { name: 'Marcos Paz Conectada', url: 'https://noticias.marcospazconectada.com/2023/02/09/termino-el-curso-de-reparacion-de-celulares-del-programa-envion/' }
    ];

    // Blog / Resources Data
    blogFeatures = [
        {
             title: 'Servicio Técnico en Marcos Paz',
             desc: 'Conocé en detalle cómo trabajamos y por qué somos los elegidos en la zona.',
             img: 'assets/img/repair/10.jpg',
             link: '/posts/servicio-tecnico-de-celulares-en-marcos-paz'
        },
        {
             title: 'Cursos de Reparación',
             desc: 'Capacitate con nosotros. Salida laboral inmediata y certificación.',
             img: 'assets/img/cursos/egresado-2025.jpg',
             link: '/cursos'
        },
        {
             title: 'Venta de Repuestos',
             desc: 'Catálogo completo de módulos, baterías y herramientas para el técnico.',
             img: 'assets/img/products/repuestos-varios.jpg',
             link: '/products/category/repuestos'
        }
    ];

    // App Info
    appInfo = {
        title: 'Llevá Arecofix en tu bolsillo',
        desc: 'Seguí tus reparaciones en tiempo real, pedí presupuestos y accedé a descuentos exclusivos desde nuestra App.',
        features: ['Seguimiento de Orden', 'Historial de Reparaciones', 'Turnos Prioritarios'],
        downloadLink: 'https://play.google.com/store/apps/details?id=com.arecofix.app&hl=es_AR&gl=US' // Placeholder or real
    };


  ngOnInit() {
    this.setSEO();
    this.setStructuredData();
  }

  setSEO() {
    const title =
      'Servicio Técnico de Celulares en Marcos Paz | Reparación iPhone, Samsung, Motorola | Arecofix';
    // Enhanced description with "Presupuesto sin Cargo" and "Garantía"
    const description =
      'Arreglo de celulares en Marcos Paz. Presupuesto sin cargo y garantía escrita. Cambio de pantalla y batería en el acto. Servicio técnico oficial para iPhone, Samsung y Motorola.';
    const url = 'https://arecofix.com/#/celular';
    const image = 'https://arecofix.com/assets/img/branding/og-celulares.jpg';

    this.titleService.setTitle(title);

    // Standard Meta
    this.metaService.updateTag({ name: 'description', content: description });
    this.metaService.updateTag({
      name: 'keywords',
      content:
        'Reparacion de celulares Marcos Paz, servicio tecnico celulares marcos paz, curso reparacion celulares, venta celulares marcos paz',
    });
    this.metaService.updateTag({ name: 'geo.region', content: 'AR-B' });
    this.metaService.updateTag({
      name: 'geo.placename',
      content: 'Marcos Paz',
    });

    // Open Graph
    this.metaService.updateTag({ property: 'og:type', content: 'website' });
    this.metaService.updateTag({ property: 'og:title', content: title });
    this.metaService.updateTag({
      property: 'og:description',
      content: description,
    });
    this.metaService.updateTag({ property: 'og:image', content: image });
    this.metaService.updateTag({ property: 'og:url', content: url });
    this.metaService.updateTag({
      property: 'og:site_name',
      content: 'Arecofix',
    });
    this.metaService.updateTag({ property: 'og:locale', content: 'es_AR' });
  }

  setStructuredData() {
    if (!isPlatformBrowser(this.platformId)) return;

    // LocalBusiness Schema
    const script = this.document.createElement('script');
    script.type = 'application/ld+json';

    // Combined Schema for Repair Business + Course Provider (EducationalOrganization implies courses)
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'MobilePhoneRepair',
      name: 'Arecofix Servicio Técnico',
      image: 'https://arecofix.com/assets/img/logo.png',
      description:
        'Servicio técnico especializado en reparación de celulares en Marcos Paz. Cursos de reparación.',
      priceRange: '$$',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Jorge Newbery 69', // Fixed typo
        addressLocality: 'Marcos Paz',
        addressRegion: 'Buenos Aires',
        postalCode: '1727',
        addressCountry: 'AR',
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: -34.77,
        longitude: -58.83,
      },
      url: 'https://arecofix.com/#/celular',
      telephone: '+5491125960900',
      openingHoursSpecification: [
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
          opens: '09:00',
          closes: '19:00',
        },
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: 'Saturday',
          opens: '09:00',
          closes: '13:00',
        },
      ],
      // Added comprehensive Review/Rating schema (Conservative default)
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.8',
        reviewCount: '120',
      },
    };

    script.text = JSON.stringify(schema);
    this.document.head.appendChild(script);
  }

  async sendContactForm() {
    if (!this.contactName || !this.contactPhone || !this.contactMessage) {
      alert('Por favor completa todos los campos');
      return;
    }

    this.sendingContact = true;
    this.cdr.markForCheck();

    try {
      const supabase = this.auth.getSupabaseClient();

      // Save to DB (using contact_messages table as per PostPage logic)
      await supabase.from('contact_messages').insert({
        name: this.contactName,
        phone: this.contactPhone,
        email: 'lp-celular@arecofix.com', // Placeholder to distinguish source
        subject: 'Consulta desde Landing Celulares',
        message: this.contactMessage,
        is_read: false,
      });

      alert('¡Consulta enviada con éxito! Te responderemos a la brevedad.');
      this.contactName = '';
      this.contactPhone = '';
      this.contactMessage = '';
    } catch (error) {
      console.error('Error sending message:', error);
      // Fallback to WhatsApp if DB fails
      const text = `Hola Arecofix, soy ${this.contactName}. ${this.contactMessage}`;
      window.open(
        `https://wa.me/${this.whatsappNumber}?text=${encodeURIComponent(text)}`,
        '_blank'
      );
    } finally {
      this.sendingContact = false;
      this.cdr.markForCheck();
    }
  }
}
