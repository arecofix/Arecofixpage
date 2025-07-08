import {
  ApplicationConfig,
  provideExperimentalZonelessChangeDetection,
  provideZoneChangeDetection
} from '@angular/core';
import { provideRouter, withHashLocation } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withFetch } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    // O
    provideExperimentalZonelessChangeDetection(),  // Opción moderna sin Zone.js

    provideRouter(routes, withHashLocation()),  // Hash routing para GitHub Pages
    provideHttpClient(withFetch()),  // HttpClient con Fetch API
    
    // Configuración adicional recomendada para producción:
    { provide: 'BASE_URL', useValue: '/' },  // URL base para APIs
  ]
};