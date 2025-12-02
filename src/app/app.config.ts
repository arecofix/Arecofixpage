import {
  ApplicationConfig,
  ErrorHandler,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideRouter, withHashLocation, withInMemoryScrolling } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { routes } from './app.routes';
import { GlobalErrorHandler } from './core/errors/global-error-handler';
import { environment } from '../environments/environment';

// Firebase imports
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';

const firebaseConfig = environment.firebase;

export const appConfig = {
  providers: [
    // Global error handler
    { provide: ErrorHandler, useClass: GlobalErrorHandler },

    // Configuración existente
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(
      routes,
      withHashLocation(),
      withInMemoryScrolling({
        anchorScrolling: 'enabled',
        scrollPositionRestoration: 'enabled'
      })
    ),
    provideHttpClient(withFetch()),

    // Configuración de Firebase
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideFirestore(() => getFirestore()),
    provideAuth(() => getAuth()),

    // Charts
    provideCharts(withDefaultRegisterables()),

    // Agrega otros módulos de Firebase según necesites:
    // provideStorage(() => getStorage()), // Para Firebase Storage
    // provideFunctions(() => getFunctions()) // Para Cloud Functions
  ]
};