import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { environment } from './environments/environment';
import { enableProdMode, mergeApplicationConfig, ApplicationConfig } from '@angular/core';

if (environment.production) {
  enableProdMode();
}

// Browser-specific config (Charts breaks SSR)
const browserConfig: ApplicationConfig = {
  providers: [
    // Charts loaded lazily only when admin dashboard needs them
  ]
};

// Bootstrap the app
bootstrapApplication(App, mergeApplicationConfig(appConfig, browserConfig))
  .catch((err) => console.error(err));
