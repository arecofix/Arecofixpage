import {
  ApplicationConfig,
  ErrorHandler,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
  APP_INITIALIZER,
} from '@angular/core';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideRouter, withHashLocation, withInMemoryScrolling } from '@angular/router';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { GlobalErrorHandler } from './core/errors/global-error-handler';
import { SupabaseService } from './core/services/supabase.service';
import { SUPABASE_CLIENT } from './core/di/supabase-token';
import { globalErrorInterceptor } from './core/interceptors/error.interceptor';
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
import { OrderRepository } from './features/orders/domain/repositories/order.repository';
import { SupabaseOrderRepository } from './features/orders/infrastructure/repositories/supabase-order.repository';
import { FinanceRepository } from './features/finance/domain/repositories/finance.repository';
import { SupabaseFinanceRepository } from './features/finance/infrastructure/repositories/supabase-finance.repository';
import { ProductReviewBaseRepository } from './features/products/domain/repositories/product-review.repository';
import { SupabaseProductReviewRepository } from './features/products/infrastructure/repositories/supabase-product-review.repository';
import { InvoiceRepository } from './features/sales/domain/repositories/invoice.repository';
import { SupabaseInvoiceRepository } from './features/sales/infrastructure/repositories/supabase-invoice.repository';
import { CourseRepository } from './features/courses/domain/repositories/course.repository';
import { SupabaseCourseRepository } from './features/courses/infrastructure/repositories/supabase-course.repository';
import { TenantService } from './core/services/tenant.service';

export const appConfig: ApplicationConfig = {
  providers: [
    // Global error handler
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
    
    // Initializer to resolve Tenant Context before anything else
    {
      provide: APP_INITIALIZER,
      useFactory: (tenantService: TenantService) => () => tenantService.init(),
      deps: [TenantService],
      multi: true
    },
    
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
    provideHttpClient(
      withFetch(),
      withInterceptors([globalErrorInterceptor])
    ),

    // Repositories
    { provide: ProductRepository, useClass: SupabaseProductRepository },
    { provide: CategoryRepository, useClass: SupabaseCategoryRepository },
    { provide: BrandRepository, useClass: SupabaseBrandRepository },
    { provide: RepairRepository, useClass: SupabaseRepairRepository },
    { provide: AnalyticsRepository, useClass: SupabaseAnalyticsRepository },
    { provide: UserProfileRepository, useClass: SupabaseUserProfileRepository },
    { provide: OrderRepository, useClass: SupabaseOrderRepository },
    { provide: FinanceRepository, useClass: SupabaseFinanceRepository },
    { provide: ProductReviewBaseRepository, useClass: SupabaseProductReviewRepository },
    { provide: InvoiceRepository, useClass: SupabaseInvoiceRepository },
    { provide: CourseRepository, useClass: SupabaseCourseRepository },
  ]
};