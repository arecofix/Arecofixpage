import {
  ApplicationConfig,
  ErrorHandler,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideClientHydration } from '@angular/platform-browser';
import { provideRouter, withHashLocation, withInMemoryScrolling } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { routes } from './app.routes';
import { GlobalErrorHandler } from './core/errors/global-error-handler';
// import { environment } from '../environments/environment'; // environment no longer needed for firebase config here

// Firebase imports REMOVED
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { ProductRepository } from './features/products/domain/repositories/product.repository';
import { SupabaseProductRepository } from './features/products/infrastructure/repositories/supabase-product.repository';
import { CategoryRepository } from './features/products/domain/repositories/category.repository';
import { SupabaseCategoryRepository } from './features/products/infrastructure/repositories/supabase-category.repository';
import { BrandRepository } from './features/products/domain/repositories/brand.repository';
import { SupabaseBrandRepository } from './features/products/infrastructure/repositories/supabase-brand.repository';
import { RepairRepository } from './features/repairs/domain/repositories/repair.repository';
import { SupabaseRepairRepository } from './features/repairs/infrastructure/repositories/supabase-repair.repository';

// const firebaseConfig = environment.firebase; // Unused

export const appConfig: ApplicationConfig = {
  providers: [
    // Global error handler
    { provide: ErrorHandler, useClass: GlobalErrorHandler },

    // Configuración existente
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    // provideClientHydration(),
    provideRouter(
      routes,
      withInMemoryScrolling({
        anchorScrolling: 'enabled',
        scrollPositionRestoration: 'enabled'
      })
    ),
    provideHttpClient(withFetch()),

    // Charts
    provideCharts(withDefaultRegisterables()),
    
    // Repositories
    { provide: ProductRepository, useClass: SupabaseProductRepository },
    { provide: CategoryRepository, useClass: SupabaseCategoryRepository },
    { provide: BrandRepository, useClass: SupabaseBrandRepository },
    { provide: RepairRepository, useClass: SupabaseRepairRepository },
  ]
};