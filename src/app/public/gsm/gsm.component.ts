import { Component, OnInit, OnDestroy, signal, inject, DestroyRef } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { PreferencesService } from '../../shared/services/preferences.service';
import { GsmService, GsmTool, BrandService, DownloadItem } from './services/gsm.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SeoService } from '@app/core/services/seo.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-gsm',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './gsm.component.html',
  styleUrl: './gsm.component.css',
})
export class GsmComponent implements OnInit, OnDestroy {
  private destroyRef = inject(DestroyRef);
  
  gsmTools = signal<GsmTool[]>([]);
  brandServices = signal<BrandService[]>([]);
  downloads = signal<DownloadItem[]>([]);

  whatsappUrl = 'https://wa.me/541125960900?text=Hola,%20necesito%20ayuda%20con%20herramientas%20GSM';
  telegramUrl = 'https://t.me/+541125960900';

  // Translations
  translations: any = {
    es: {
      badge: 'Bypass iPhone Profesional',
      title_sub: 'Bypass iCloud hasta iPhone 16 Pro Max',
      description: 'La plataforma más potente para revendedores. Desbloqueos instantáneos, seguridad bancaria y soporte real. Bypass, FRP, F4, eliminación y cuentas bloqueadas para iPhone, iPad y más.',
      btn_whatsapp: 'Consultar Oferta',
      btn_tools: 'Herramientas GSM',
      btn_telegram: 'CANAL TELEGRAM',
      official_channel: 'NOVEDADES EN CANAL OFICIAL',
      offer_badge: 'OFERTA POR TIEMPO LIMITADO',
      offer_desc: 'Bypass Full para todos los modelos. iPhone 5s al 16 Pro Max.',
      trust_badge: '100% GARANTIZADO',
      trust_text: 'Recuperamos tu iPhone bloqueado de forma segura y permanente.',
      region: 'Disponibilidad',
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
      sec: 'Seg',
      features_title: '¿Por qué elegir nuestra plataforma?',
      feature_1_title: 'Soporte 24/7',
      feature_1_desc: 'Estamos para ayudarte en cualquier momento del día.',
      feature_2_title: 'Precios competitivos',
      feature_2_desc: 'Las mejores tarifas para revendedores y mayoristas.',
      feature_3_title: 'Desbloqueo Seguro',
      feature_3_desc: 'Métodos 100% seguros sin riesgo para el dispositivo.',
      step_1: 'Registrate',
      step_1_desc: 'Creá tu cuenta de revendedor gratis.',
      step_2: 'Cargá Saldo',
      step_2_desc: 'Usá Alias, QR o USDT de forma instantánea.',
      step_3: 'Hacé tu pedido',
      step_3_desc: 'Seleccioná el servicio y enviá el IMEI/Serial.',
      step_4: 'Resultado',
      step_4_desc: 'Recibí la notificación y listo!'
    },
    en: {
      badge: 'Professional iPhone Bypass',
      title_sub: 'iCloud Bypass up to iPhone 16 Pro Max',
      description: 'We have Bypass available for all iPhone models. Exclusive limited-time offer. If your iPhone has an iCloud account, we can solve it with a full guarantee.',
      btn_whatsapp: 'Check Offer',
      btn_tools: 'GSM Tools',
      offer_badge: 'LIMITED TIME OFFER',
      offer_desc: 'Full Bypass for all models. iPhone 5s to 16 Pro Max.',
      trust_badge: '100% GUARANTEED',
      trust_text: 'We recover your locked iPhone safely and permanently.',
      region: 'Availability',
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
    public preferencesService: PreferencesService,
    private gsmService: GsmService,
    private seoService: SeoService
  ) { }

  // Calculator
  usdtAmount = signal<number | null>(null);
  usdtRate = signal<number>(1240);
  usdtTotal = signal<number | null>(null);

  // Countdown logic fixed
  countdown = signal({
    days: 5,
    hours: 9,
    minutes: 8,
    seconds: 19
  });
  private countdownInterval: any;

  // New Offers Data
  offers = signal([
    { name: 'ChatGPT Plus - 1 Month - All Countrys', price: 0.6, type: 'Private Account' },
    { name: 'ChatGPT Plus - 3 Months - All Countrys', price: 0.6, type: 'Private Account' },
    { name: 'Cheetah Tool Pro - 3 Meses', price: 27.12, type: 'License' },
    { name: 'Cheetah Tool Pro - 6 Meses', price: 39.12, type: 'License' },
    { name: 'Cheetah Tool Pro - 12 Meses', price: 53.52, type: 'License' },
    { name: 'Cheetah Tool - Recarga de Creditos', price: 0.85, type: 'Credits' },
    { name: '⚡PROMO HFZ (A12+) ✔ [XR a 16 Pro Max + iPads]', price: 5.04, type: 'Bypass' },
    { name: '⚡PROMO iRemove (A12+) ✔ [XR a 16 Pro Max + iPads]', price: 9, type: 'Bypass' },
    { name: '⚡PROMO iRemoval Pro (A12+) ✔ [XR a 16 Pro Max + iPads]', price: 7.8, type: 'Bypass' },
    { name: '⚡PROMO Mina (A12+) ✔ [XR a 16 Pro Max + iPads]', price: 7.2, type: 'Bypass' }
  ]);

  ngOnInit(): void {
    // SEO ...
    this.seoService.setPageData({
      title: 'Bypass iPhone iCloud hasta 16 Pro Max | Oferta Limitada | ARECOFIX',
      description: '¿iPhone bloqueado con iCloud? Solución de Bypass profesional hasta iPhone 16 Pro Max. 100% remoto, seguro y garantizado. ¡Oferta por tiempo limitado para revendedores!',
      imageUrl: '/assets/img/gsm/gsm-og-banner.png',
      url: '/gsm',
      keywords: 'bypass iphone, bypass icloud, desbloqueo icloud, iphone 16 prm bypass, bypass remoto, frp, gsm tools, arecofix',
      type: 'website'
    });

    this.loadData();
    this.startCountdown();
  }

  loadData() {
    this.gsmService.getUsdtRate()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(rate => {
        this.usdtRate.set(rate);
        this.calculateUsdt(); // Re-calculate if amount was already entered
      });

    this.gsmService.getGsmTools()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(data => this.gsmTools.set(data));

    this.gsmService.getBrandServices()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(data => this.brandServices.set(data));

    this.gsmService.getDownloads()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(data => this.downloads.set(data));
  }

  ngOnDestroy() {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
  }

  calculateUsdt() {
    const amount = this.usdtAmount();
    if (amount) {
      this.usdtTotal.set(amount * this.usdtRate());
    } else {
      this.usdtTotal.set(null);
    }
  }

  startCountdown() {
    this.countdownInterval = setInterval(() => {
      this.countdown.update((c: { days: number, hours: number, minutes: number, seconds: number }) => {
        let { days, hours, minutes, seconds } = c;
        if (seconds > 0) {
          seconds--;
        } else {
          seconds = 59;
          if (minutes > 0) {
            minutes--;
          } else {
            minutes = 59;
            if (hours > 0) {
              hours--;
            } else {
              hours = 23;
              if (days > 0) {
                days--;
              } else {
                // Time up, reset for demo or stop
                days = 5; hours = 9; minutes = 8; seconds = 19;
              }
            }
          }
        }
        return { days, hours, minutes, seconds };
      });
    }, 1000);
  }
}
