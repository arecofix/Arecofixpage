import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PublicLayoutHeader } from './components';
import { Footer } from '../../shared/footer/footer';
import { AccessibilitySidebarComponent } from '../../shared/components/accessibility-sidebar/accessibility-sidebar.component';
import { PreferencesService } from '../../shared/services/preferences.service';

import { SeoService } from '@app/core/services/seo.service';

@Component({
  selector: 'app-public-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, PublicLayoutHeader, AccessibilitySidebarComponent, Footer],
  templateUrl: './public-layout.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PublicLayout {
  private seoService = inject(SeoService); // Injection initializes the service
  constructor(public preferencesService: PreferencesService) {}
}
