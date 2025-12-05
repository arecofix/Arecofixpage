import { Component, OnInit, OnDestroy } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { PreferencesService } from '../../shared/services/preferences.service';
import { GsmService, GsmTool, BrandService, DownloadItem } from './services/gsm.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-gsm',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './gsm.component.html',
  styleUrl: './gsm.component.css',
})
export class GsmComponent implements OnInit, OnDestroy {

  gsmTools: GsmTool[] = [];
  brandServices: BrandService[] = [];
  downloads: DownloadItem[] = [];

  whatsappUrl = 'https://wa.me/541125960900?text=Hola,%20necesito%20ayuda%20con%20herramientas%20GSM';

  // Translations
  translations: any = {
    es: {
      badge: 'Plataforma Profesional GSM',
      title_sub: 'Herramientas & Licencias',
      description: 'Plataforma integral para técnicos GSM, FRP y licencias digitales. Soluciones profesionales al alcance de un clic.',
      btn_whatsapp: 'Soporte WhatsApp',
      btn_tools: 'Ver Herramientas',
      offer_badge: 'Oferta Activada',
      offer_desc: 'Descuento exclusivo por tiempo limitado',
      region: 'Región',
      mac_support: 'Podemos hacerlo en una MAC',
      btn_offer: 'Ver Oferta',
      calc_title: 'Conversor Rápido',
      calc_desc: 'Calculá tus operaciones de manera transparente y segura.',
      calc_label: 'Calculadora USDT',
      calc_sub: 'Cotización en tiempo real',
      input_label: 'Cantidad USDT',
      btn_calc: 'CALCULAR TOTAL',
      total_est: 'Total Estimado (ARS)',
      cot_ref: 'Cotización ref',
      tools_title: 'Herramientas GSM & Licencias',
      tools_desc: 'Software profesional para desbloqueo, flasheo y reparación de dispositivos móviles.',
      btn_login: 'Inicia sesión',
      brands_title: 'Catálogo de Servicios',
      brands_desc: 'Selecciona una marca para ver los servicios disponibles',
      btn_view_services: 'Ver Servicios',
      downloads_title: 'Descargas Útiles',
      downloads_desc: 'Drivers y herramientas esenciales para tu taller.',
      btn_view_all: 'Ver todo',
      btn_download: 'Descargar ahora',
      utility: 'Utilidad',
      days: 'Días',
      hours: 'Hs',
      min: 'Min',
      sec: 'Seg'
    },
    en: {
      badge: 'Professional GSM Platform',
      title_sub: 'Tools & Licenses',
      description: 'Comprehensive platform for GSM technicians, FRP, and digital licenses. Professional solutions just a click away.',
      btn_whatsapp: 'WhatsApp Support',
      btn_tools: 'View Tools',
      offer_badge: 'Offer Activated',
      offer_desc: 'Exclusive discount for a limited time',
      region: 'Region',
      mac_support: 'We can do it on a MAC',
      btn_offer: 'View Offer',
      calc_title: 'Quick Converter',
      calc_desc: 'Calculate your operations transparently and securely.',
      calc_label: 'USDT Calculator',
      calc_sub: 'Real-time quotation',
      input_label: 'USDT Amount',
      btn_calc: 'CALCULATE TOTAL',
      total_est: 'Estimated Total (ARS)',
      cot_ref: 'Ref quote',
      tools_title: 'GSM Tools & Licenses',
      tools_desc: 'Professional software for unlocking, flashing, and repairing mobile devices.',
      btn_login: 'Login',
      brands_title: 'Service Catalog',
      brands_desc: 'Select a brand to view available services',
      btn_view_services: 'View Services',
      downloads_title: 'Useful Downloads',
      downloads_desc: 'Essential drivers and tools for your workshop.',
      btn_view_all: 'View all',
      btn_download: 'Download now',
      utility: 'Utility',
      days: 'Days',
      hours: 'Hrs',
      min: 'Min',
      sec: 'Sec'
    }
  };

  constructor(
    private titleService: Title,
    private metaService: Meta,
    public preferencesService: PreferencesService,
    private gsmService: GsmService
  ) { }

  // Calculator
  usdtAmount: number | null = null;
  usdtRate: number = 1240; // Example rate, could be dynamic
  usdtTotal: number | null = null;

  // Countdown
  countdown = {
    days: 5,
    hours: 9,
    minutes: 8,
    seconds: 19
  };
  private countdownInterval: any;

  ngOnInit(): void {
    // SEO Optimization
    this.titleService.setTitle('Herramientas GSM Profesionales - Licencias Digitales | ARECOFIX');

    this.metaService.addTags([
      { name: 'description', content: 'Plataforma integral para técnicos GSM con herramientas profesionales, licencias digitales, servicios FRP y descargas útiles. ARECOFIX - Tu socio en reparación de móviles.' },
      { name: 'keywords', content: 'GSM, herramientas GSM, FRP, licencias digitales, reparación móviles, Octoplus, SigmaKey, UMT Pro, desbloqueo, flasheo, técnicos móviles' },
      { name: 'author', content: 'ARECOFIX' },
      { property: 'og:title', content: 'Herramientas GSM Profesionales | ARECOFIX' },
      { property: 'og:description', content: 'Accede a las mejores herramientas GSM, licencias digitales y recursos para técnicos profesionales.' },
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: 'https://arecofix.com.ar/#/gsm' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: 'Herramientas GSM Profesionales | ARECOFIX' },
      { name: 'twitter:description', content: 'Plataforma integral para técnicos GSM con herramientas profesionales y licencias digitales.' }
    ]);

    this.loadData();
    this.startCountdown();
  }

  loadData() {
    this.gsmService.getGsmTools().subscribe(data => this.gsmTools = data);
    this.gsmService.getBrandServices().subscribe(data => this.brandServices = data);
    this.gsmService.getDownloads().subscribe(data => this.downloads = data);
  }

  ngOnDestroy() {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
  }

  calculateUsdt() {
    if (this.usdtAmount) {
      this.usdtTotal = this.usdtAmount * this.usdtRate;
    } else {
      this.usdtTotal = null;
    }
  }

  startCountdown() {
    this.countdownInterval = setInterval(() => {
      if (this.countdown.seconds > 0) {
        this.countdown.seconds--;
      } else {
        this.countdown.seconds = 59;
        if (this.countdown.minutes > 0) {
          this.countdown.minutes--;
        } else {
          this.countdown.minutes = 59;
          if (this.countdown.hours > 0) {
            this.countdown.hours--;
          } else {
            this.countdown.hours = 23;
            if (this.countdown.days > 0) {
              this.countdown.days--;
            } else {
              // Reset or stop
              this.countdown = { days: 5, hours: 9, minutes: 8, seconds: 19 };
            }
          }
        }
      }
    }, 1000);
  }
}
