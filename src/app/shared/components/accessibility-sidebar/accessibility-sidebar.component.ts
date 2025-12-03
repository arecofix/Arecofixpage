import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PreferencesService } from '../../services/preferences.service';

@Component({
  selector: 'app-accessibility-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './accessibility-sidebar.html'
})
export class AccessibilitySidebarComponent {
  constructor(public preferencesService: PreferencesService) {}

  get backgroundOptions() {
    return this.preferencesService.backgroundOptions;
  }
}
