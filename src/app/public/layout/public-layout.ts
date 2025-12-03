import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PublicLayoutHeader } from './components';
import { AccessibilitySidebarComponent } from '../../shared/components/accessibility-sidebar/accessibility-sidebar.component';
import { PreferencesService } from '../../shared/services/preferences.service';

@Component({
  selector: 'app-public-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, PublicLayoutHeader, AccessibilitySidebarComponent],
  templateUrl: './public-layout.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PublicLayout {
  constructor(public preferencesService: PreferencesService) {}
}
