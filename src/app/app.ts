import { Component, inject, OnInit, PLATFORM_ID, DOCUMENT, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { ToastComponent } from './shared/components/toast/toast.component';
import { AnalyticsService } from './core/services/analytics.service';
import { LoggerService } from './core/services/logger.service';
import { SeoService } from './core/services/seo.service';
import { ThemeService } from './core/services/theme.service';
import { TenantService } from './core/services/tenant.service';

@Component({

  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    ToastComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './app.html'
})
export class App implements OnInit {
  private analytics = inject(AnalyticsService);
  private logger = inject(LoggerService);
  private seoService = inject(SeoService);
  private themeService = inject(ThemeService); 
  private tenantService = inject(TenantService); 
  private platformId = inject(PLATFORM_ID);
  private document = inject(DOCUMENT);

  ngOnInit() {
    this.seoService.initialize();

    if (isPlatformBrowser(this.platformId)) {
      // SEO Redirection Rule Heredada
      const currentHost = window.location.hostname;
      if (currentHost === 'celulares.arecofix.com.ar') {
        this.document.location.href = 'https://arecofix.com.ar/celular';
        return;
      }
    }
  }
}