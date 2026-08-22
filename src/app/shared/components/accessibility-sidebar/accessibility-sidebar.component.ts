import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PreferencesService } from '../../services/preferences.service';

@Component({
  selector: 'app-accessibility-sidebar',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './accessibility-sidebar.html',
})
export class AccessibilitySidebarComponent {
  constructor(public preferencesService: PreferencesService) {}

  get backgroundOptions() {
    return this.preferencesService.backgroundOptions;
  }
}
