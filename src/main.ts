import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { environment } from './environments/environment';
import { enableProdMode } from '@angular/core'; // Import enableProdMode
import posthog from 'posthog-js';
import 'cally';

if (environment.production) {
  enableProdMode();
}

// Initialize PostHog
posthog.init(
  environment.posthogKey,
  {
    api_host: environment.posthogHost,
    person_profiles: 'identified_only', // or 'always' to create profiles for anonymous users as well
    defaults: '2025-05-24'
  }
);

bootstrapApplication(App, appConfig)
    .catch((err) => console.error(err));
// Trigger rebuild
