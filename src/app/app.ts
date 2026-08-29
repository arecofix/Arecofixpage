import {
  Component,
  inject,
  OnInit,
  PLATFORM_ID,
  DOCUMENT,
  CUSTOM_ELEMENTS_SCHEMA,
  ChangeDetectionStrategy,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { ToastComponent } from './shared/components/toast/toast.component';
import { RibbonMenuComponent } from './shared/components/ribbon-menu/ribbon-menu.component';
import { AnalyticsService } from './core/services/analytics.service';
import { LoggerService } from './core/services/logger.service';
import { SeoService } from './core/services/seo.service';
import { ThemeService } from './core/services/theme.service';
import { TenantService } from './core/services/tenant.service';
import { ScannerService } from './core/services/scanner.service';
import { ShortcutService } from './core/services/shortcut.service';
import { SupabaseService } from './core/services/supabase.service';
import { SwUpdate } from '@angular/service-worker';
import { AiChatbotComponent } from './shared/ai-chatbot/ai-chatbot.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    ToastComponent,
    RibbonMenuComponent,
    AiChatbotComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './app.html',
})
export class App implements OnInit {
  private analytics = inject(AnalyticsService);
  private logger = inject(LoggerService);
  private seoService = inject(SeoService);
  private themeService = inject(ThemeService);
  private tenantService = inject(TenantService);
  private platformId = inject(PLATFORM_ID);
  private document = inject(DOCUMENT);

  // Initialize global services for Tauri/ERP features
  private scannerService = inject(ScannerService);
  private shortcutService = inject(ShortcutService);

  private supabase = inject(SupabaseService);
  private swUpdate = inject(SwUpdate, { optional: true });

  ngOnInit() {
    this.seoService.initialize();
    if (typeof document !== 'undefined') {
      const loader = document.querySelector('.initial-loader');
      if (loader) loader.remove();
    }

    if (isPlatformBrowser(this.platformId)) {
      // Auto-recarga cuando hay una nueva versión (evita errores MIME y ChunkLoad)
      if (this.swUpdate?.isEnabled) {
        this.swUpdate.versionUpdates.subscribe((evt) => {
          if (evt.type === 'VERSION_READY') {
            this.logger.info(
              'Nueva versión detectada. Recargando la aplicación...',
            );
            window.location.reload();
          }
        });

        this.swUpdate.unrecoverable.subscribe((evt) => {
          this.logger.error(
            'Estado irrecuperable de caché, recargando...',
            evt.reason,
          );
          window.location.reload();
        });
      }

      // SEO Redirection Rule Heredada
      const currentHost = window.location.hostname;
      if (currentHost === 'celulares.arecofix.com.ar') {
        this.document.location.href = 'https://arecofix.com.ar/celular';
        return;
      }

      // Check for Tauri environment
      if (window.__TAURI_INTERNALS__) {
        this.startSidecar();
        this.setupDeepLinks();
      }
    }
  }

  private async setupDeepLinks() {
    try {
      // @ts-ignore
      const { onOpenUrl } = await import(
        /* @vite-ignore */ '@tauri-apps/plugin-deep-link'
      );

      await onOpenUrl((urls: string[]) => {
        if (!urls || urls.length === 0) return;
        try {
          const urlStr = urls[0];
          if (urlStr.startsWith('arecofix://login')) {
            const urlObj = new URL(urlStr);
            const token = urlObj.searchParams.get('token');
            if (token) {
              // Set the session
              this.supabase
                .getClient()
                .auth.setSession({ access_token: token, refresh_token: token })
                .then(({ error }) => {
                  if (!error) {
                    // Redirect to admin or show a toast
                    window.location.href = '/admin/dashboard';
                  }
                });
            }
          }
        } catch (e) {
          this.logger.error('Error handling deep link:', e);
        }
      });
    } catch (e) {
      this.logger.warn(
        'Deep link plugin not available or failed to initialize:',
        e,
      );
    }
  }

  private async checkBackendStatus(): Promise<boolean> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'OPTIONS', // Fast preflight
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      // If we get a response (even a 405 Method Not Allowed), it means the server is UP.
      return true;
    } catch (e) {
      return false; // Connection refused or timeout
    }
  }

  private async startSidecar() {
    this.logger.info('Checking if backend is already running...');
    const isRunning = await this.checkBackendStatus();

    if (isRunning) {
      this.logger.info(
        'Backend is already responding on port 5000. Skipping sidecar spawn.',
      );
      return;
    }

    try {
      this.logger.info(
        'Backend not responding. Attempting to start sidecar...',
      );
      const { Command } = await import('@tauri-apps/plugin-shell');

      // Try sidecar approach first
      try {
        const sidecar = Command.sidecar('arecofix-backend');
        const child = await sidecar.spawn();
        this.logger.info('Sidecar started successfully with PID:', child.pid);
        return;
      } catch (sidecarErr) {
        this.logger.warn(
          'Sidecar spawn failed, attempting standard execution fallback...',
          sidecarErr,
        );
        // Fallback: standard execution if capabilities restricted the sidecar flag
        const command = Command.create('arecofix-backend');
        const child = await command.spawn();
        this.logger.info(
          'Backend started via fallback execution with PID:',
          child.pid,
        );
      }
    } catch (e) {
      this.logger.error('Failed to start backend completely:', e);
    }
  }
}
