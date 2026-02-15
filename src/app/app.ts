import { Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { WhatsappButton } from './shared/whatsapp-button/whatsapp-button';
import { ToastComponent } from './shared/components/toast/toast.component';
import { AnalyticsService } from './core/services/analytics.service';
import { LoggerService } from './core/services/logger.service';
import { SeoService } from './core/services/seo.service';
import posthog from 'posthog-js';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    WhatsappButton,
    ToastComponent
  ],
  templateUrl: './app.html'
})
export class App implements OnInit {
  private analytics = inject(AnalyticsService);
  private logger = inject(LoggerService);
  private seoService = inject(SeoService);
  private platformId = inject(PLATFORM_ID);
  private document = inject(DOCUMENT);

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      // SEO Redirection Rule
      if (this.document.location.hostname === 'celulares.arecofix.com.ar') {
        this.document.location.href = 'https://www.arecofix.com.ar/celular';
        return;
      }

      // Send a test event to verify PostHog is working
      this.logger.debug('Sending test event to PostHog...');
      posthog.capture('app_initialized', {
        timestamp: new Date().toISOString(),
        message: 'Angular app successfully initialized'
      });
      this.logger.debug('Test event sent to PostHog');
    }
  }
}