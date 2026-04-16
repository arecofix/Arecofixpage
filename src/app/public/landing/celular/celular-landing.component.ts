import {
  Component,
  OnInit,
  inject,
  PLATFORM_ID,
  ChangeDetectorRef,
  DOCUMENT
} from '@angular/core';
import { CommonModule, isPlatformBrowser, NgOptimizedImage } from '@angular/common';
import {
  DomSanitizer,
  SafeResourceUrl,
  Title,
  Meta,
} from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { AuthService } from '@app/core/services/auth.service';
import { SeoService } from '@app/core/services/seo.service';
import { LoggerService } from '@app/core/services/logger.service';
import {
  ContactService,
  CreateMessageDto,
} from '@app/core/services/contact.service';
import { NotificationService } from '@app/core/services/notification.service';
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
  SEO_CONTENT,
  WHY_US,
  LOCATION_DATA,
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
    NgOptimizedImage,
  ],
  templateUrl: './celular-landing.component.html',
})
export class CelularLandingComponent implements OnInit {
  public sanitizer = inject(DomSanitizer);
  safeMapUrl: SafeResourceUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
    LOCATION_DATA.mapEmbedUrl,
  );
  private seoService = inject(SeoService);
  private titleService = inject(Title);
  private metaService = inject(Meta);
  private contactService = inject(ContactService);
  private notificationService = inject(NotificationService);
  private document = inject(DOCUMENT);
  private platformId = inject(PLATFORM_ID);
  private auth = inject(AuthService); // Kept if needed for other things, but logic moved
  private cdr = inject(ChangeDetectorRef);
  private logger = inject(LoggerService);

  whatsappNumber = environment.contact.whatsappNumber;

  breadcrumbItems = [
    { label: 'Inicio', url: '/' },
    { label: 'Servicio Técnico Celulares', url: '/celular' },
  ];

  // --- MIGRATED DATA ---
  specialOffers = SPECIAL_OFFERS;
  techBest = TECH_BEST;
  coursesList = COURSES_LIST;
  faqs = FAQS;
  reviews = REVIEWS;
  processSteps = PROCESS_STEPS;
  galleryItems: GalleryItem[] = GALLERY_ITEMS;
  partners: {
    name: string;
    icon?: string;
    color?: string;
    url?: string;
    img?: string;
  }[] = PARTNERS;
  mentions = MENTIONS;
  blogFeatures = BLOG_FEATURES;
  appInfo = APP_INFO;
  relatedServices = RELATED_SERVICES;
  seoContent = SEO_CONTENT;
  whyUs = WHY_US;
  locationData = LOCATION_DATA;

  // Contact Form Data
  contactName = '';
  contactPhone = '';
  contactMessage = '';
  sendingContact = false;

  ngOnInit() {
    this.updateSeo();
  }

  private updateSeo() {
    const seoData = {
      title: 'Reparación de Celulares en Marcos Paz y Merlo | Servicio Técnico iPhone Arecofix',
      description: 'Especialistas en arreglo de celulares en Marcos Paz. Cambio de pantallas, baterías y pines de carga en el acto con garantía escrita. iPhone, Samsung, Motorola y Xiaomi.',
      imageUrl: 'assets/img/branding/og-celulares-pro.png',
      keywords: 'reparacion de celulares marcos paz, servicio tecnico celulares merlo, arreglo de celulares zona oeste, cambio de modulos iphone, servicio tecnico samsung marcos paz, arecofix',
      type: 'website' as const,
      schema: {
        "@context": "https://schema.org",
        "@type": ["LocalBusiness", "MobilePhoneRepair"],
        "name": "Arecofix Servicio Técnico",
        "alternateName": "Arecofix Marcos Paz",
        "description": "Servicio técnico especializado en celulares en Marcos Paz. Líderes en reparación de iPhone y multimarca.",
        "url": "https://www.arecofix.com.ar/celular",
        "telephone": "+5491125960900",
        "priceRange": "$$",
        "image": "https://www.arecofix.com.ar/assets/img/branding/og-celulares-pro.png",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "Jorge Newbery 69",
          "addressLocality": "Marcos Paz",
          "addressRegion": "Buenos Aires",
          "postalCode": "1727",
          "addressCountry": "AR"
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": -34.767191,
          "longitude": -58.817973
        },
        "openingHoursSpecification": [
          {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
            "opens": "09:00",
            "closes": "19:00"
          },
          {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": "Saturday",
            "opens": "09:00",
            "closes": "13:00"
          }
        ]
      }
    };
    this.seoService.setPageData(seoData);
  }

  async sendContactForm() {
    if (!this.contactName || !this.contactPhone || !this.contactMessage) {
      this.notificationService.showWarning(
        'Por favor completa todos los campos.',
      );
      return;
    }

    this.sendingContact = true;
    this.cdr.markForCheck();

    const contactData: CreateMessageDto = {
      name: this.contactName,
      phone: this.contactPhone,
      email: 'lp-celular@arecofix.com', // Explicitly setting destination/source email for this landing
      subject: 'Consulta desde Landing Celulares',
      message: this.contactMessage,
    };

    const { error } = await this.contactService.createMessage(contactData);

    if (error) {
      this.logger.error('Error sending message:', error);
      this.notificationService.showError(
        'Hubo un problema al enviar el mensaje. Redireccionando a WhatsApp...',
      );

      const text = `Hola Arecofix, soy ${this.contactName}. ${this.contactMessage}`;
      window.open(
        `https://wa.me/${this.whatsappNumber}?text=${encodeURIComponent(text)}`,
        '_blank',
      );
    } else {
      this.notificationService.showSuccess(
        '¡Consulta enviada con éxito! Te responderemos a la brevedad.',
      );
      this.contactName = '';
      this.contactPhone = '';
      this.contactMessage = '';
    }

    this.sendingContact = false;
    this.cdr.markForCheck();
  }
}
