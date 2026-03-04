import { Component, inject, OnInit, PLATFORM_ID, DOCUMENT } from '@angular/core';
import { AiAssistant } from './features/ai-assistant/ai-assistant';
import { RouterOutlet } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { WhatsappButton } from './shared/whatsapp-button/whatsapp-button';
import { ToastComponent } from './shared/components/toast/toast.component';
import { AnalyticsService } from './core/services/analytics.service';
import { LoggerService } from './core/services/logger.service';
import { SeoService } from './core/services/seo.service';
import { ThemeService } from './core/services/theme.service';
import { TenantService } from './shared/services/tenant.service';

@Component({

  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    WhatsappButton,
    ToastComponent,
    AiAssistant
  ],
  templateUrl: './app.html'
})
export class App implements OnInit {
  private analytics = inject(AnalyticsService);
  private logger = inject(LoggerService);
  private seoService = inject(SeoService);
  private themeService = inject(ThemeService); // Ensures theme is applied before first paint
  private tenantService = inject(TenantService); // Guardián del ecosistema SaaS
  private platformId = inject(PLATFORM_ID);
  private document = inject(DOCUMENT);

  ngOnInit() {
    this.seoService.initialize();

    if (isPlatformBrowser(this.platformId)) {
      // Inicializar el servicio de tenants primero
      this.tenantService.getCurrentTenant$().subscribe((tenant: any) => {
        if (tenant) {
          console.log(`🏢 Tenant activo: ${tenant.name} (${tenant.isMain ? 'Principal' : 'Sucursal'})`);
        }
      });

      // SEO Redirection Rule Heredada
      const currentHost = window.location.hostname;
      if (currentHost === 'celulares.arecofix.com.ar') {
        this.document.location.href = 'https://arecofix.com.ar/celular';
        return;
      }
    }
  }
}