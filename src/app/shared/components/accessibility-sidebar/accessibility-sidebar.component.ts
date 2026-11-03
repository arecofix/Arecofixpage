import { Component, ChangeDetectionStrategy, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PreferencesService } from '../../services/preferences.service';
import { WawAccessibilityService } from '@app/core/services/waw-accessibility.service';

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
  private cdr = inject(ChangeDetectorRef);

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
    this.cdr.markForCheck();
  }

  async openWawWidget(event?: Event): Promise<void> {
    await this.openFullWawPanel(event);
  }

  async toggleQuickOption(optionKey: string, event?: Event): Promise<void> {
    await this.wawService.toggleQuickOption(optionKey, event);
    this.cdr.markForCheck();
  }

  async toggleDyslexia(event?: Event): Promise<void> {
    await this.wawService.toggleDyslexia(event);
    this.cdr.markForCheck();
  }

  async toggleReadingLine(event?: Event): Promise<void> {
    await this.wawService.toggleReadingLine(event);
    this.cdr.markForCheck();
  }

  async toggleReadingMask(event?: Event): Promise<void> {
    await this.wawService.toggleReadingMask(event);
    this.cdr.markForCheck();
  }

  async toggleBigCursor(event?: Event): Promise<void> {
    await this.wawService.toggleBigCursor(event);
    this.cdr.markForCheck();
  }

  async toggleScreenReader(event?: Event): Promise<void> {
    await this.wawService.toggleScreenReader(event);
    this.cdr.markForCheck();
  }

  async toggleStopAnimations(event?: Event): Promise<void> {
    await this.wawService.toggleStopAnimations(event);
    this.cdr.markForCheck();
  }

  resetAll(): void {
    this.preferencesService.resetPreferences();
    this.wawService.reset();
    this.cdr.markForCheck();
  }
}
