import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  OnDestroy,
  signal,
} from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { Subscription, filter, map } from 'rxjs';

// Componentes
import { PublicLayoutHeader } from './components';
import { Footer } from '../../shared/footer/footer';
import { AccessibilitySidebarComponent } from '../../shared/components/accessibility-sidebar/accessibility-sidebar.component';
import { AiChatbotComponent } from '../../shared/ai-chatbot/ai-chatbot.component';

// Servicios
import { PreferencesService } from '../../shared/services/preferences.service';
import { SeoService } from '@app/core/services/seo.service';

@Component({
  selector: 'app-public-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    PublicLayoutHeader,
    AccessibilitySidebarComponent,
    Footer,
    AiChatbotComponent,
  ],
  templateUrl: './public-layout.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PublicLayout implements OnInit, OnDestroy {
  // Inyección de dependencias moderna
  private seoService = inject(SeoService);
  private router = inject(Router);
  public preferencesService = inject(PreferencesService); // Público para usarlo en el HTML si hace falta

  private subscription = new Subscription();

  // Signals de Rutas
  public isPortfolioRoute = signal(false);
  public isTrackingRoute = signal(false);

  // Signals de Preferencias (Conversión de Observables a Signals)
  public themeClass = toSignal(
    this.preferencesService.theme$.pipe(
      map((theme) => this.preferencesService.getBackgroundClass(theme)),
    ),
    { initialValue: 'bg-gray-50 dark:bg-[#080808]' }, // Fondo por defecto por si tarda en cargar
  );

  public isHighContrast = toSignal(this.preferencesService.highContrast$, {
    initialValue: false,
  });

  ngOnInit(): void {
    // Inicialización de rutas
    this.isPortfolioRoute.set(this.router.url.includes('/portfolio'));
    this.isTrackingRoute.set(this.router.url.includes('/tracking'));

    // Cerrar sidebar de accesibilidad automáticamente al navegar y actualizar rutas
    this.subscription.add(
      this.router.events
        .pipe(filter((event) => event instanceof NavigationEnd))
        .subscribe((event: any) => {
          this.preferencesService.closeSidebar();

          if (event.urlAfterRedirects) {
            this.isPortfolioRoute.set(
              event.urlAfterRedirects.includes('/portfolio'),
            );
            this.isTrackingRoute.set(
              event.urlAfterRedirects.includes('/tracking'),
            );
          }
        }),
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}