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

// Firebase imports
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getAuth, provideAuth } from '@angular/fire/auth';

const firebaseConfig = {
  apiKey: "AIzaSyD5JCGp6wVHlHKzJRssRtTstNHSoaLj2i4",
  authDomain: "arecofix-ca60b.firebaseapp.com",
  projectId: "arecofix-ca60b",
  storageBucket: "arecofix-ca60b.appspot.com",
  messagingSenderId: "301262429786",
  appId: "1:301262429786:web:0aca5a5c777b7ab1d08263"
};

export const appConfig: ApplicationConfig = {
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
    provideAuth(() => getAuth())

    // Agrega otros módulos de Firebase según necesites:
    // provideStorage(() => getStorage()), // Para Firebase Storage
    // provideFunctions(() => getFunctions()) // Para Cloud Functions
  ]
};