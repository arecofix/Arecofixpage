import {
  ApplicationConfig,
  ErrorHandler,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
  APP_INITIALIZER,
  LOCALE_ID,
  isDevMode,
  inject,
} from '@angular/core';
import { provideServiceWorker } from '@angular/service-worker';
import {
  provideClientHydration,
  withEventReplay,
  withNoIncrementalHydration,
} from '@angular/platform-browser';
import {
  provideRouter,
  withInMemoryScrolling,
  TitleStrategy,
  withHashLocation,
} from '@angular/router';
import {
  provideHttpClient,
  withFetch,
  withInterceptors,
} from '@angular/common/http';
import { registerLocaleData } from '@angular/common';
import localeEsAr from '@angular/common/locales/es-AR';
import { AppTitleStrategy } from './core/strategies/app-title.strategy';

registerLocaleData(localeEsAr, 'es-AR');
import { routes } from './app.routes';
import { RouteReuseStrategy } from '@angular/router';
import { CustomRouteReuseStrategy } from './core/strategies/custom-route-reuse.strategy';
import { GlobalErrorHandler } from './core/errors/global-error-handler';
import { SupabaseService } from './core/services/supabase.service';
import { SUPABASE_CLIENT } from './core/di/supabase-token';
import { globalErrorInterceptor } from './core/interceptors/error.interceptor';
import { timeoutInterceptor } from './core/interceptors/timeout.interceptor';
import { ProductRepository } from './features/products/domain/repositories/product.repository';
import { SupabaseProductRepository } from './features/products/infrastructure/repositories/supabase-product.repository';
import { FlaskProductRepository } from './features/products/infrastructure/repositories/flask-product.repository';
import { ProductStockRepository } from './features/products/domain/repositories/product-stock.repository';
import { SupabaseProductStockRepository } from './features/products/infrastructure/repositories/supabase-product-stock.repository';
import { CategoryRepository } from './features/products/domain/repositories/category.repository';
import { SupabaseCategoryRepository } from './features/products/infrastructure/repositories/supabase-category.repository';
import { FlaskCategoryRepository } from './features/products/infrastructure/repositories/flask-category.repository';
import { BrandRepository } from './features/products/domain/repositories/brand.repository';
import { SupabaseBrandRepository } from './features/products/infrastructure/repositories/supabase-brand.repository';
import { FlaskBrandRepository } from './features/products/infrastructure/repositories/flask-brand.repository';
import { CustomerRepository } from './features/customers/domain/repositories/customer.repository';
import { SupabaseCustomerRepository } from './features/customers/infrastructure/repositories/supabase-customer.repository';
import { FlaskCustomerRepository } from './features/customers/infrastructure/repositories/flask-customer.repository';
import { RepairRepository } from './features/repairs/domain/repositories/repair.repository';
import { SupabaseRepairRepository } from './features/repairs/infrastructure/repositories/supabase-repair.repository';
import { FlaskRepairRepository } from './features/repairs/infrastructure/repositories/flask-repair.repository';
import { SupabaseAppServiceRepository } from './features/products/infrastructure/repositories/supabase-app-service.repository';
import { AppServiceRepository } from './features/products/domain/repositories/app-service.repository';
import { AnalyticsRepository } from './features/analytics/domain/repositories/analytics.repository';
import { SupabaseAnalyticsRepository } from './features/analytics/infrastructure/repositories/supabase-analytics.repository';
import { UserProfileRepository } from './core/repositories/user-profile.repository';
import { SupabaseUserProfileRepository } from './core/infrastructure/repositories/supabase-user-profile.repository';
import { OrderRepository } from './features/orders/domain/repositories/order.repository';
import { SupabaseOrderRepository } from './features/orders/infrastructure/repositories/supabase-order.repository';
import { FlaskOrderRepository } from './features/orders/infrastructure/repositories/flask-order.repository';
import { FinanceRepository } from './features/finance/domain/repositories/finance.repository';
import { SupabaseFinanceRepository } from './features/finance/infrastructure/repositories/supabase-finance.repository';
import { FlaskFinanceRepository } from './features/finance/infrastructure/repositories/flask-finance.repository';
import { ProductReviewBaseRepository } from './features/products/domain/repositories/product-review.repository';
import { SupabaseProductReviewRepository } from './features/products/infrastructure/repositories/supabase-product-review.repository';
import { InvoiceRepository } from './features/sales/domain/repositories/invoice.repository';
import { SupabaseInvoiceRepository } from './features/sales/infrastructure/repositories/supabase-invoice.repository';
import { CourseRepository } from './features/courses/domain/repositories/course.repository';
import { SupabaseCourseRepository } from './features/courses/infrastructure/repositories/supabase-course.repository';
import { NotificationBaseRepository } from './features/messages/domain/repositories/notification.repository';
import { SupabaseNotificationRepository } from './features/messages/infrastructure/repositories/supabase-notification.repository';
import { TenantService } from './core/services/tenant.service';

const isTauri =
  typeof window !== 'undefined' &&
  (!!(window as any)['__TAURI_INTERNALS__'] || !!(window as any)['__TAURI__']);

export const appConfig: ApplicationConfig = {
  providers: [
    // Locale provider
    { provide: LOCALE_ID, useValue: 'es-AR' },

    // Title Strategy
    { provide: TitleStrategy, useClass: AppTitleStrategy },

    // Global error handler
    { provide: ErrorHandler, useClass: GlobalErrorHandler },

    // Custom Route Reuse Strategy for Tabs
    { provide: RouteReuseStrategy, useClass: CustomRouteReuseStrategy },

    // Initializer to resolve Tenant Context before anything else
    {
      provide: APP_INITIALIZER,
      useFactory: (tenantService: TenantService) => () => tenantService.init(),
      deps: [TenantService],
      multi: true,
    },

    // Supabase Client Provider via SupabaseService
    {
      provide: SUPABASE_CLIENT,
      useFactory: (supabaseService: SupabaseService) =>
        supabaseService.getClient(),
      deps: [SupabaseService],
    },

    // Core Angular providers
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideClientHydration(withEventReplay(), withNoIncrementalHydration()),
    provideRouter(
      routes,
      withInMemoryScrolling({
        anchorScrolling: 'enabled',
        scrollPositionRestoration: 'enabled',
      }),
      ...(isTauri ? [withHashLocation()] : []),
    ),
    provideHttpClient(
      withFetch(),
      withInterceptors([timeoutInterceptor, globalErrorInterceptor]),
    ),
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode() && !isTauri,
      registrationStrategy: 'registerWhenStable:30000',
    }),

    // Repositories
    { 
      provide: ProductRepository, 
      useFactory: () => {
        return isTauri ? inject(FlaskProductRepository) : inject(SupabaseProductRepository);
      }
    },
    { 
      provide: CategoryRepository, 
      useFactory: () => {
        return isTauri ? inject(FlaskCategoryRepository) : inject(SupabaseCategoryRepository);
      }
    },
    { 
      provide: BrandRepository, 
      useFactory: () => {
        return isTauri ? inject(FlaskBrandRepository) : inject(SupabaseBrandRepository);
      }
    },
    {
      provide: AppServiceRepository,
      useClass: SupabaseAppServiceRepository,
    },
    { 
      provide: RepairRepository, 
      useFactory: () => {
        return isTauri ? inject(FlaskRepairRepository) : inject(SupabaseRepairRepository);
      }
    },
    { 
      provide: CustomerRepository, 
      useFactory: () => {
        return isTauri ? inject(FlaskCustomerRepository) : inject(SupabaseCustomerRepository);
      }
    },
    { provide: AnalyticsRepository, useClass: SupabaseAnalyticsRepository },
    { provide: UserProfileRepository, useClass: SupabaseUserProfileRepository },
    { 
      provide: OrderRepository, 
      useFactory: () => {
        return isTauri ? inject(FlaskOrderRepository) : inject(SupabaseOrderRepository);
      }
    },
    { 
      provide: FinanceRepository, 
      useFactory: () => {
        return isTauri ? inject(FlaskFinanceRepository) : inject(SupabaseFinanceRepository);
      }
    },
    {
      provide: ProductReviewBaseRepository,
      useClass: SupabaseProductReviewRepository,
    },
    {
      provide: ProductStockRepository,
      useClass: SupabaseProductStockRepository,
    },
    { provide: InvoiceRepository, useClass: SupabaseInvoiceRepository },
    { provide: CourseRepository, useClass: SupabaseCourseRepository },
    {
      provide: NotificationBaseRepository,
      useClass: SupabaseNotificationRepository,
    },
  ],
};
