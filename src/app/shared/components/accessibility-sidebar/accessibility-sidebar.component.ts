import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { PreferencesService } from '../../services/preferences.service';
import { WawAccessibilityService } from '@app/core/services/waw-accessibility.service';
import { WawFeatureKey } from '@app/core/constants/waw.constants';

@Component({
  selector: 'app-accessibility-sidebar',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './accessibility-sidebar.html',
})
export class AccessibilitySidebarComponent {
  public preferencesService = inject(PreferencesService);
  public wawService = inject(WawAccessibilityService);

  // Señales reactivas derivadas de PreferencesService (Angular 21)
  public sidebarOpen = toSignal(this.preferencesService.sidebarOpen$, { initialValue: false });
  public language = toSignal(this.preferencesService.language$, { initialValue: 'es' });
  public theme = toSignal(this.preferencesService.theme$, { initialValue: 'gradient-5' });
  public fontSize = toSignal(this.preferencesService.fontSize$, { initialValue: 16 });

  get backgroundOptions() {
    return this.preferencesService.backgroundOptions;
  }

  async openFullWawPanel(event?: Event): Promise<void> {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    this.preferencesService.closeSidebar();
    await this.wawService.openFullWawPanel(undefined, event);
  }

  async openWawWidget(event?: Event): Promise<void> {
    await this.openFullWawPanel(event);
  }

  async toggleQuickOption(optionKey: WawFeatureKey | string, event?: Event): Promise<void> {
    await this.wawService.toggleQuickOption(optionKey, event);
  }

  async toggleDyslexia(event?: Event): Promise<void> {
    await this.wawService.toggleDyslexia(event);
  }

  async toggleReadingLine(event?: Event): Promise<void> {
    await this.wawService.toggleReadingLine(event);
  }

  async toggleReadingMask(event?: Event): Promise<void> {
    await this.wawService.toggleReadingMask(event);
  }

  async toggleBigCursor(event?: Event): Promise<void> {
    await this.wawService.toggleBigCursor(event);
  }

  async toggleScreenReader(event?: Event): Promise<void> {
    await this.wawService.toggleScreenReader(event);
  }

  async toggleStopAnimations(event?: Event): Promise<void> {
    await this.wawService.toggleStopAnimations(event);
  }

  resetAll(): void {
    this.preferencesService.resetPreferences();
    this.wawService.reset();
  }
}
