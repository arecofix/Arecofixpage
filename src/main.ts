import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { environment } from './environments/environment';
import { enableProdMode, ApplicationConfig } from '@angular/core';

if (environment.production) {
  enableProdMode();
}

// Bootstrap the app
bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));
