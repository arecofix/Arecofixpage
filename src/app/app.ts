import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { WhatsappButton } from './shared/whatsapp-button/whatsapp-button';
import { AnalyticsService } from './services/analytics.service';
import { LoggerService } from './core/services/logger.service';
import { SeoService } from './core/services/seo.service';
import posthog from 'posthog-js';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    WhatsappButton,
  ],
  templateUrl: './app.html'
})
export class App implements OnInit {
  private analytics = inject(AnalyticsService);
  private logger = inject(LoggerService);
  private seoService = inject(SeoService);

  ngOnInit() {
    // Send a test event to verify PostHog is working
    this.logger.debug('Sending test event to PostHog...');
    posthog.capture('app_initialized', {
      timestamp: new Date().toISOString(),
      message: 'Angular app successfully initialized'
    });
    this.logger.debug('Test event sent to PostHog');
  }
}