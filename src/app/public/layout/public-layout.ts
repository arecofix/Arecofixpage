import { ChangeDetectionStrategy, Component, inject, OnInit, OnDestroy } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PublicLayoutHeader } from './components';
import { Footer } from '../../shared/footer/footer';
import { AccessibilitySidebarComponent } from '../../shared/components/accessibility-sidebar/accessibility-sidebar.component';
import { PreferencesService } from '../../shared/services/preferences.service';
import { SeoService } from '@app/core/services/seo.service';
import { Subscription, filter } from 'rxjs';

@Component({
  selector: 'app-public-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, PublicLayoutHeader, AccessibilitySidebarComponent, Footer],
  templateUrl: './public-layout.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PublicLayout implements OnInit, OnDestroy {
  private seoService = inject(SeoService); 
  private router = inject(Router);
  private subscription = new Subscription();

  constructor(public preferencesService: PreferencesService) {}

  ngOnInit(): void {
    // Cerrar sidebar de accesibilidad automáticamente al navegar
    this.subscription.add(
      this.router.events.pipe(
        filter(event => event instanceof NavigationEnd)
      ).subscribe(() => {
        this.preferencesService.closeSidebar();
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
