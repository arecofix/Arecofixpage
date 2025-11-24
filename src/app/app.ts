import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Footer } from './shared/footer/footer'; //
import { WhatsappButton } from './shared/whatsapp-button/whatsapp-button'; // <-- Sin .component
import { AnalyticsService } from './services/analytics.service';
import posthog from 'posthog-js';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    Footer,
    WhatsappButton,
  ],
  templateUrl: './app.html'
})
export class App implements OnInit {
  private analytics = inject(AnalyticsService);

  ngOnInit() {
    // Send a test event to verify PostHog is working
    console.log('🚀 Sending test event to PostHog...');
    posthog.capture('app_initialized', {
      timestamp: new Date().toISOString(),
      message: 'Angular app successfully initialized'
    });
    console.log('✅ Test event sent!');
  }
}