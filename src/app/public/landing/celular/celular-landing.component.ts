import {
  Component,
  OnInit,
  inject,
  PLATFORM_ID,
  ChangeDetectorRef,
} from '@angular/core';
import { CommonModule, DOCUMENT, isPlatformBrowser, NgOptimizedImage } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Title, Meta } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { AuthService } from '@app/core/services/auth.service';
import { SeoService } from '@app/shared/services/seo.service'; // Added import
import { ReservationCalendar } from '@app/public/reservation/reservation-calendar';
import { ProductCarouselComponent } from '@app/shared/components/product-carousel/product-carousel.component';
import { BreadcrumbsComponent } from '@app/shared/components/breadcrumbs/breadcrumbs.component';
import {
  APP_INFO,
  BLOG_FEATURES,
  COURSES_LIST,
  FAQS,
  GALLERY_ITEMS,
  MENTIONS,
  PARTNERS,
  PROCESS_STEPS,
  RELATED_SERVICES,
  REVIEWS,
  SPECIAL_OFFERS,
  TECH_BEST,
} from './celular-landing.data';

interface GalleryItem {
  type: string;
  src: string;
  alt?: string;
  poster?: string;
  span?: string;
}

@Component({
  selector: 'app-celular-landing',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReservationCalendar,
    ProductCarouselComponent,
    BreadcrumbsComponent,
    NgOptimizedImage
  ],
  templateUrl: './celular-landing.component.html',
})
export class CelularLandingComponent implements OnInit {
  private seoService = inject(SeoService); // Injected SeoService
  private document = inject(DOCUMENT);
  private platformId = inject(PLATFORM_ID);
  private auth = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);

  whatsappNumber = environment.contact.whatsappNumber;

  breadcrumbItems = [
    { label: 'Inicio', url: '/' },
    { label: 'Servicio Técnico Celulares', url: '/celular' }
  ];

  // --- MIGRATED DATA ---
  specialOffers = SPECIAL_OFFERS;
  techBest = TECH_BEST;
  coursesList = COURSES_LIST;
  faqs = FAQS;
  reviews = REVIEWS;
  processSteps = PROCESS_STEPS;
  galleryItems: GalleryItem[] = GALLERY_ITEMS;
  partners: { name: string; icon?: string; color?: string; url?: string; img?: string }[] = PARTNERS;
  mentions = MENTIONS;
  blogFeatures = BLOG_FEATURES;
  appInfo = APP_INFO;
  relatedServices = RELATED_SERVICES;

  // Contact Form Data
  contactName = '';
  contactPhone = '';
  contactMessage = '';
  sendingContact = false;

  ngOnInit() {
    this.setSEO();
    this.setStructuredData();
  }

  setSEO() {
    this.seoService.setSeoData({
      title: 'Servicio Técnico de Celulares en Marcos Paz | Reparación iPhone, Samsung, Motorola | Arecofix',
      description: 'Arreglo de celulares en Marcos Paz. Presupuesto sin cargo y garantía escrita. Cambio de pantalla y batería en el acto. Servicio técnico oficial para iPhone, Samsung y Motorola.',
      keywords: 'Reparación de celulares en Marcos Paz, accesorios para celulares, local especializado en reparación de celulares, servicio técnico oficial iPhone Samsung Motorola, cambio de pantalla, arreglo de bateria, Arecofix',
      ogImage: 'https://arecofix.com/assets/img/branding/og-celulares.jpg',
      ogUrl: 'https://arecofix.com/#/celular',
      ogTitle: 'Servicio Técnico de Celulares en Marcos Paz | Arecofix',
      ogDescription: 'Reparación profesional de celulares. Confía en los expertos. Presupuesto sin cargo.',
      additionalMetaTags: [
        { name: 'geo.region', content: 'AR-B' },
        { name: 'geo.placename', content: 'Marcos Paz' }
      ]
    });
  }

  setStructuredData() {
    if (!isPlatformBrowser(this.platformId)) return;

    const script = this.document.createElement('script');
    script.type = 'application/ld+json';

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
        streetAddress: 'Jorge Newbery 69',
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

      await supabase.from('contact_messages').insert({
        name: this.contactName,
        phone: this.contactPhone,
        email: 'lp-celular@arecofix.com',
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
