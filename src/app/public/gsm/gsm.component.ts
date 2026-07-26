import { Component, OnInit, OnDestroy, signal, inject, DestroyRef } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { PreferencesService } from '../../shared/services/preferences.service';
import { GsmService, GsmTool, BrandService, DownloadItem } from './services/gsm.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SeoService } from '@app/core/services/seo.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
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
      trust_secure: 'Servicio Seguro & Privado',
      region: 'Disponibilidad',
      region_all: 'TODOS LOS MODELOS',
      mac_support: 'Podemos hacerlo en una MAC',
      support_limit: 'Soporte hasta iPhone 16 Pro Max',
      btn_offer: 'Ver Oferta',
      btn_repeat_offer: 'REPETIR OFERTA AHORA',
      btn_platform: 'Plataforma',
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
      software: 'Software',
      days: 'Días',
      hours: 'Hs',
      min: 'Min',
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
      step_4_desc: 'Recibí la notificación y listo!',
      banner_title: 'LO MEJOR EN',
      banner_desc: 'Acceso instantáneo a los mejores servicios del mercado.',
      dash_panel: 'Panel',
      dash_order: 'Orden',
      dash_history: 'Historial',
      dash_recharge: 'RECARGA',
      dash_balance_title: 'TU SALDO ACTUAL',
      dash_recharge_btn: 'RECARGAR SALDO',
      dash_order_frp: 'ORDEN FRP F4',
      dash_licenses: 'LICENCIAS Y CRÉDITOS',
      dash_rentals: 'Renta de Herramientas',
      dash_success: 'EXITOSAS',
      dash_process: 'EN PROCESO',
      dash_failed: 'FALLIDAS',
      dash_qr: 'QR ALIAS',
      dash_news: 'NOVEDADES/OFERTAS',
      dash_updated: 'Actualizado ahora',
      dash_instant: 'Instantáneo',
      remote_bypass: 'Bypass Remoto 100% Garantizado',
      remote_bypass_desc: 'Desbloqueos y bypass 100% remotos',
      footer_title: '¿Listo para empezar?',
      footer_desc: 'Unite hoy a la red de revendedores más grande de la región.',
      footer_btn: 'Registrarme',
      tool_names: {},
      tool_desc: {},
      dl_desc: {}
    },
    en: {
      badge: 'Professional iPhone Bypass',
      title_sub: 'iCloud Bypass up to iPhone 16 Pro Max',
      description: 'The most powerful platform for resellers. Instant unlocks, bank-grade security, and real support. Bypass, FRP, F4, removal and locked accounts for iPhone, iPad and more.',
      btn_whatsapp: 'Check Offer',
      btn_tools: 'GSM Tools',
      btn_telegram: 'TELEGRAM CHANNEL',
      official_channel: 'NEWS IN OFFICIAL CHANNEL',
      offer_badge: 'LIMITED TIME OFFER',
      offer_desc: 'Full Bypass for all models. iPhone 5s to 16 Pro Max.',
      trust_badge: '100% GUARANTEED',
      trust_text: 'We recover your locked iPhone safely and permanently.',
      trust_secure: 'Secure & Private Service',
      region: 'Availability',
      region_all: 'ALL MODELS',
      mac_support: 'We can do it on a MAC',
      support_limit: 'Support up to iPhone 16 Pro Max',
      btn_offer: 'View Offer',
      btn_repeat_offer: 'REPEAT OFFER NOW',
      btn_platform: 'Platform',
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
      software: 'Software',
      days: 'Days',
      hours: 'Hrs',
      min: 'Min',
      sec: 'Sec',
      features_title: 'Why choose our platform?',
      feature_1_title: '24/7 Support',
      feature_1_desc: 'We are here to help you anytime.',
      feature_2_title: 'Competitive Prices',
      feature_2_desc: 'The best rates for resellers and wholesalers.',
      feature_3_title: 'Secure Unlocking',
      feature_3_desc: '100% safe methods with no risk to the device.',
      step_1: 'Register',
      step_1_desc: 'Create your free reseller account.',
      step_2: 'Add Balance',
      step_2_desc: 'Use Alias, QR or USDT instantly.',
      step_3: 'Place your order',
      step_3_desc: 'Select the service and send the IMEI/Serial.',
      step_4: 'Result',
      step_4_desc: 'Receive the notification and you are done!',
      banner_title: 'THE BEST IN',
      banner_desc: 'Instant access to the best services in the market.',
      dash_panel: 'Panel',
      dash_order: 'Order',
      dash_history: 'History',
      dash_recharge: 'TOP UP',
      dash_balance_title: 'YOUR CURRENT BALANCE',
      dash_recharge_btn: 'RECHARGE BALANCE',
      dash_order_frp: 'FRP F4 ORDER',
      dash_licenses: 'LICENSES & CREDITS',
      dash_rentals: 'Tool Rentals',
      dash_success: 'SUCCESSFUL',
      dash_process: 'IN PROGRESS',
      dash_failed: 'FAILED',
      dash_qr: 'QR ALIAS',
      dash_news: 'NEWS/OFFERS',
      dash_updated: 'Updated just now',
      dash_instant: 'Instant',
      remote_bypass: '100% Guaranteed Remote Bypass',
      remote_bypass_desc: '100% remote unlocks and bypasses',
      footer_title: 'Ready to start?',
      footer_desc: 'Join the largest network of resellers in the region today.',
      footer_btn: 'Register Now',
      tool_names: {
        'UnlockTool': 'UnlockTool',
        'Chimera Tool': 'Chimera Tool',
        'Z3X Box': 'Z3X Box',
        'SigmaKey': 'SigmaKey',
        'Octoplus Box': 'Octoplus Box',
        'Hydra Tool': 'Hydra Tool',
        'EFT Pro': 'EFT Pro',
        'DFT Pro': 'DFT Pro'
      },
      tool_desc: {
        'UnlockTool': 'Professional tool for FRP unlock, Mi Account and Flashing.',
        'Chimera Tool': 'Multi-brand support for IMEI repair, unlocking and more.',
        'Z3X Box': 'Specialized in Samsung and LG. IMEI repair and Flashing.',
        'SigmaKey': 'Solution for Huawei, Motorola and other MTK/Qualcomm brands.',
        'Octoplus Box': 'Leader in LG, Samsung and JTAG/Specialized services.',
        'Hydra Tool': 'Powerful dongle for MTK, Qualcomm and Spreadtrum repairs.',
        'EFT Pro': 'Specialist in Samsung (Flash/FRP) and Huawei devices.',
        'DFT Pro': 'Modern tool for Xiaomi, Samsung and MediaTek processors.'
      },
      dl_desc: {
        'Samsung USB Drivers': 'Official drivers for Samsung devices.',
        'Odin Flash Tool': 'Flashing tool for Samsung.',
        'Xiaomi ADB/Fastboot Tools': 'Tool to manage Xiaomi devices.',
        'Platform Tools (ADB/Fastboot)': 'Command line tools from Android SDK.',
        'FlexiHub': 'Remote access to USB devices and COM ports.',
        'Radmin VPN': 'Secure and easy-to-use virtual private network.',
        'USB Redirector 2.5': 'USB device redirection over network.',
        'USB Redirector 1.9.7': 'Legacy version for specific compatibility.',
        'RustDesk': 'Open source remote desktop software.',
        'TeamViewer': 'Leading solution for remote support.',
        'UltraViewer': 'Alternative remote desktop control.',
        'Psiphon': 'Internet censorship circumvention tool.',
        'AnyDesk': 'Fast remote desktop application.',
        'VirtualHere Client': 'Client for sharing USB over IP.',
        'SamFw Tool': 'Free tool for Samsung FRP and more.',
        'SamFirm': 'Download official Samsung firmwares.',
        '3uTools': 'All-in-one tool for iOS devices.'
      }
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
  private countdownInterval: ReturnType<typeof setInterval> | undefined;

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

  private platformId = inject(PLATFORM_ID);

  startCountdown() {
    if (isPlatformBrowser(this.platformId)) {
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
}


