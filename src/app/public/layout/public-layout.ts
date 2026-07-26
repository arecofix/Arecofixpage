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
import { PublicLayoutHeader } from './components';
import { Footer } from '../../shared/footer/footer';
import { AccessibilitySidebarComponent } from '../../shared/components/accessibility-sidebar/accessibility-sidebar.component';
import { PreferencesService } from '../../shared/services/preferences.service';
import { SeoService } from '@app/core/services/seo.service';
import { Subscription, filter } from 'rxjs';

import { WhatsappButton } from '../../shared/whatsapp-button/whatsapp-button';

@Component({
  selector: 'app-public-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    PublicLayoutHeader,
    AccessibilitySidebarComponent,
    Footer,
    WhatsappButton,
  ],
  templateUrl: './public-layout.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PublicLayout implements OnInit, OnDestroy {
  private seoService = inject(SeoService);
  private router = inject(Router);
  private subscription = new Subscription();

  public isPortfolioRoute = signal(false);
  public isTrackingRoute = signal(false);

  constructor(public preferencesService: PreferencesService) {}

  ngOnInit(): void {
    this.isPortfolioRoute.set(this.router.url.includes('/portfolio'));
    this.isTrackingRoute.set(this.router.url.includes('/tracking'));

    // Cerrar sidebar de accesibilidad automáticamente al navegar
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
              event.urlAfterRedirects.includes('/tracking')
            );
          }
        }),
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
