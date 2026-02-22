import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { environment } from './environments/environment';
import { enableProdMode, mergeApplicationConfig, ApplicationConfig } from '@angular/core';

if (environment.production) {
  enableProdMode();
}

import { provideCharts, withDefaultRegisterables } from 'ng2-charts';

// Browser-specific config (Charts breaks SSR)
const browserConfig: ApplicationConfig = {
  providers: [
    provideCharts(withDefaultRegisterables()),
  ]
};

// Bootstrap the app
bootstrapApplication(App, mergeApplicationConfig(appConfig, browserConfig))
  .catch((err) => console.error(err));
