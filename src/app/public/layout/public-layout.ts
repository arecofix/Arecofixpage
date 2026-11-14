import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map } from 'rxjs';

import { PublicLayoutHeader } from './components';
import { Footer } from '../../shared/footer/footer';
import { AccessibilitySidebarComponent } from '../../shared/components/accessibility-sidebar/accessibility-sidebar.component';
import { AiChatbotComponent } from '../../shared/ai-chatbot/ai-chatbot.component';

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
export class PublicLayout {
  private readonly seoService = inject(SeoService);
  private readonly router = inject(Router);
  private readonly preferencesService = inject(PreferencesService);

  // URL actual como signal, actualizada en cada NavigationEnd
  private readonly currentUrl = toSignal(
    this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd),
      map((e) => e.urlAfterRedirects),
    ),
    { initialValue: this.router.url },
  );

  // Derivados: computed, no signals sueltos
  readonly isPortfolioRoute = computed(() =>
    this.currentUrl().startsWith('/portfolio'),
  );
  readonly isTrackingRoute = computed(() =>
    this.currentUrl().startsWith('/tracking'),
  );
  readonly showHeader = computed(() => !this.isPortfolioRoute());

  // Preferencias
  readonly themeClass = toSignal(
    this.preferencesService.theme$.pipe(
      map((theme) => this.preferencesService.getBackgroundClass(theme)),
    ),
    { initialValue: 'bg-gray-50 dark:bg-[#080808]' },
  );
  readonly isHighContrast = toSignal(this.preferencesService.highContrast$, {
    initialValue: false,
  });

  // SeoService: si no lo usás, borralo. Si lo usás, llamalo acá, no en el constructor vacío
  // constructor() { this.seoService.setMeta(...) }
}