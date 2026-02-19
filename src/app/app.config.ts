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
import { createClient } from '@supabase/supabase-js';
import { environment } from '../environments/environment';
import { SUPABASE_CLIENT } from './core/di/supabase-token';

const supabase = createClient(environment.supabaseUrl, environment.supabaseKey, {
    auth: {
        persistSession: typeof window !== 'undefined' && !!window.localStorage,
        autoRefreshToken: typeof window !== 'undefined' && !!window.localStorage,
        detectSessionInUrl: typeof window !== 'undefined'
    }
});

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
import { AnalyticsRepository } from './features/analytics/domain/repositories/analytics.repository';
import { SupabaseAnalyticsRepository } from './features/analytics/infrastructure/repositories/supabase-analytics.repository';
import { UserProfileRepository } from './core/repositories/user-profile.repository';
import { SupabaseUserProfileRepository } from './core/infrastructure/repositories/supabase-user-profile.repository';

export const appConfig: ApplicationConfig = {
  providers: [
    // Global error handler
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
    { provide: SUPABASE_CLIENT, useValue: supabase },

    // Core Angular providers
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideClientHydration(),
    provideRouter(
      routes,
      withInMemoryScrolling({
        anchorScrolling: 'enabled',
        scrollPositionRestoration: 'enabled'
      })
    ),
    provideHttpClient(withFetch()),

    // Charts provider moved to main.ts for SSR compatibility
    // provideCharts(withDefaultRegisterables()),
    
    // Repositories
    { provide: ProductRepository, useClass: SupabaseProductRepository },
    { provide: CategoryRepository, useClass: SupabaseCategoryRepository },
    { provide: BrandRepository, useClass: SupabaseBrandRepository },
    { provide: RepairRepository, useClass: SupabaseRepairRepository },
    { provide: AnalyticsRepository, useClass: SupabaseAnalyticsRepository },
    { provide: UserProfileRepository, useClass: SupabaseUserProfileRepository },
  ]
};