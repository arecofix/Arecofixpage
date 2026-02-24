import {
  ApplicationConfig,
  ErrorHandler,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { routes } from './app.routes';
import { GlobalErrorHandler } from './core/errors/global-error-handler';
import { SupabaseService } from './core/services/supabase.service';
import { SUPABASE_CLIENT } from './core/di/supabase-token';

import { ProductRepository } from './features/products/domain/repositories/product.repository';
import { SupabaseProductRepository } from './features/products/infrastructure/repositories/supabase-product.repository';
import { CategoryRepository } from './features/products/domain/repositories/category.repository';
import { SupabaseCategoryRepository } from './features/products/infrastructure/repositories/supabase-category.repository';
import { BrandRepository } from './features/products/domain/repositories/brand.repository';
import { SupabaseBrandRepository } from './features/products/infrastructure/repositories/supabase-brand.repository';
import { RepairRepository } from './features/repairs/domain/repositories/repair.repository';
import { SupabaseRepairRepository } from './features/repairs/infrastructure/repositories/supabase-repair.repository';
import { AnalyticsRepository } from './features/analytics/domain/repositories/analytics.repository';
import { SupabaseAnalyticsRepository } from './features/analytics/infrastructure/repositories/supabase-analytics.repository';
import { UserProfileRepository } from './core/repositories/user-profile.repository';
import { SupabaseUserProfileRepository } from './core/infrastructure/repositories/supabase-user-profile.repository';

export const appConfig: ApplicationConfig = {
  providers: [
    // Global error handler
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
    
    // Supabase Client Provider via SupabaseService
    { 
      provide: SUPABASE_CLIENT, 
      useFactory: (supabaseService: SupabaseService) => supabaseService.getClient(),
      deps: [SupabaseService]
    },

    // Core Angular providers
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideClientHydration(withEventReplay()),
    provideRouter(
      routes,
      withInMemoryScrolling({
        anchorScrolling: 'enabled',
        scrollPositionRestoration: 'enabled'
      })
    ),
    provideHttpClient(withFetch()),

    // Repositories
    { provide: ProductRepository, useClass: SupabaseProductRepository },
    { provide: CategoryRepository, useClass: SupabaseCategoryRepository },
    { provide: BrandRepository, useClass: SupabaseBrandRepository },
    { provide: RepairRepository, useClass: SupabaseRepairRepository },
    { provide: AnalyticsRepository, useClass: SupabaseAnalyticsRepository },
    { provide: UserProfileRepository, useClass: SupabaseUserProfileRepository },
  ]
};