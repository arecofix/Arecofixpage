import { Component, inject } from '@angular/core';
import { ThemeService } from '@app/core/services/theme.service';

/**
 * Theme Toggle Button
 *
 * A compact, animated toggle that cycles through theme modes.
 * Shows sun/moon/auto icon based on current mode.
 */
@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  template: `
    <button
      (click)="theme.cycle()"
      class="btn btn-circle btn-sm btn-ghost
             hover:bg-black/10 dark:hover:bg-white/10
             text-gray-600 dark:text-gray-300
             transition-all duration-300 relative overflow-hidden"
      [attr.aria-label]="'Cambiar tema: ' + theme.mode()"
      [title]="modeLabel()">
      <!-- Sun Icon (light mode) -->
      @if (theme.mode() === 'light') {
        <svg class="w-[18px] h-[18px] animate-theme-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round"
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      }
      <!-- Moon Icon (dark mode) -->
      @if (theme.mode() === 'dark') {
        <svg class="w-[18px] h-[18px] animate-theme-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round"
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      }
      <!-- Auto Icon (system mode) -->
      @if (theme.mode() === 'system') {
        <svg class="w-[18px] h-[18px] animate-theme-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round"
            d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      }
    </button>
  `,
  styles: `
    @keyframes themeIconIn {
      0% {
        transform: scale(0) rotate(-180deg);
        opacity: 0;
      }
      100% {
        transform: scale(1) rotate(0);
        opacity: 1;
      }
    }
    :host .animate-theme-icon {
      animation: themeIconIn 0.35s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
    }
  `,
})
export class ThemeToggleComponent {
  readonly theme = inject(ThemeService);

  modeLabel(): string {
    const labels: Record<string, string> = {
      light: 'Modo claro',
      dark: 'Modo oscuro',
      system: 'Automático (sistema)',
    };
    return labels[this.theme.mode()] ?? '';
  }
}
