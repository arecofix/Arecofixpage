import {
  Component,
  Input,
  Output,
  EventEmitter,
  signal,
  inject,
  ChangeDetectionStrategy,
  PLATFORM_ID
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ToastService } from '../../services/toast.service';

export interface ShareDataPayload {
  title?: string;
  text?: string;
  url?: string;
}

export interface ShareResult {
  method: 'native' | 'clipboard';
  success: boolean;
}

@Component({
  selector: 'app-share-button',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      type="button"
      (click)="share()"
      [disabled]="isSharing()"
      [attr.aria-label]="copied() ? 'Enlace copiado' : label"
      [title]="copied() ? 'Enlace copiado al portapapeles' : (supportsNativeShare ? 'Compartir' : 'Copiar enlace')"
      [class]="getButtonClasses()"
    >
      @if (showIcon) {
        @if (copied()) {
          <i class="fa-solid fa-check text-emerald-500 transition-transform duration-200 scale-110" aria-hidden="true"></i>
        } @else {
          <i class="fa-solid fa-arrow-up-from-bracket transition-transform duration-200 group-hover:-translate-y-0.5" aria-hidden="true"></i>
        }
      }

      @if (variant !== 'icon') {
        <span class="truncate">
          {{ copied() ? copiedLabel : label }}
        </span>
      }
    </button>
  `,
  styles: [`
    :host {
      display: inline-block;
    }
  `]
})
export class ShareButtonComponent {
  private platformId = inject(PLATFORM_ID);
  private toastService = inject(ToastService);

  @Input() title: string = '';
  @Input() text: string = '';
  @Input() url: string = '';
  @Input() label: string = 'Compartir';
  @Input() copiedLabel: string = '¡Enlace copiado!';
  @Input() variant: 'solid' | 'outline' | 'ghost' | 'glass' | 'icon' = 'outline';
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() showIcon: boolean = true;
  @Input() customClass: string = '';

  @Output() shared = new EventEmitter<ShareResult>();

  copied = signal<boolean>(false);
  isSharing = signal<boolean>(false);

  private copyTimeout: ReturnType<typeof setTimeout> | null = null;

  get isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  get supportsNativeShare(): boolean {
    if (!this.isBrowser || typeof navigator === 'undefined') {
      return false;
    }
    return typeof navigator.share === 'function';
  }

  async share(): Promise<void> {
    if (!this.isBrowser) return;

    const shareUrl = this.resolveUrl();
    const shareTitle = this.title || (typeof document !== 'undefined' ? document.title : 'Arecofix');
    const shareText = this.text || 'Te comparto este enlace de Arecofix:';

    const payload: ShareDataPayload = {
      title: shareTitle,
      text: shareText,
      url: shareUrl
    };

    // 1. Web Share API nativa (dispositivos móviles y navegadores compatibles)
    if (this.supportsNativeShare) {
      this.isSharing.set(true);
      try {
        await navigator.share(payload);
        this.shared.emit({ method: 'native', success: true });
        return;
      } catch (err: unknown) {
        // Si el usuario canceló el share sheet, no hacer nada ni reportar error
        if ((err as Error)?.name === 'AbortError') {
          return;
        }
        // Si falló por otra razón, proceder al fallback de copiar al portapapeles
      } finally {
        this.isSharing.set(false);
      }
    }

    // 2. Fallback: Copiar enlace al portapapeles (Desktop / Navegadores sin Web Share API)
    await this.copyToClipboard(shareUrl);
  }

  private async copyToClipboard(textToCopy: string): Promise<void> {
    let success = false;

    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(textToCopy);
        success = true;
      } else {
        // Fallback clásico con textarea oculto para webviews restrictivos
        success = this.fallbackExecCommand(textToCopy);
      }
    } catch {
      success = this.fallbackExecCommand(textToCopy);
    }

    if (success) {
      this.triggerCopiedState();
      this.toastService.show('Enlace copiado al portapapeles', 'success');
      this.shared.emit({ method: 'clipboard', success: true });
    } else {
      this.toastService.show('No se pudo copiar el enlace', 'error');
      this.shared.emit({ method: 'clipboard', success: false });
    }
  }

  private fallbackExecCommand(text: string): boolean {
    if (typeof document === 'undefined') return false;
    try {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      const successful = document.execCommand('copy');
      document.body.removeChild(textarea);
      return successful;
    } catch {
      return false;
    }
  }

  private triggerCopiedState(): void {
    this.copied.set(true);
    if (this.copyTimeout) {
      clearTimeout(this.copyTimeout);
    }
    this.copyTimeout = setTimeout(() => {
      this.copied.set(false);
      this.copyTimeout = null;
    }, 2500);
  }

  private resolveUrl(): string {
    if (this.url && this.url.trim().length > 0) {
      return this.url.trim();
    }
    if (typeof window !== 'undefined' && window.location?.href) {
      return window.location.href;
    }
    return 'https://arecofix.com.ar';
  }

  getButtonClasses(): string {
    const base = 'group inline-flex items-center justify-center font-medium transition-all duration-200 cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-indigo-500 active:scale-95 select-none';

    // Tamaños
    const sizeClasses = {
      sm: this.variant === 'icon' ? 'w-8 h-8 rounded-lg text-xs' : 'px-3 py-1.5 text-xs rounded-lg gap-1.5',
      md: this.variant === 'icon' ? 'w-9 h-9 rounded-xl text-sm' : 'px-4 py-2 text-sm rounded-xl gap-2',
      lg: this.variant === 'icon' ? 'w-11 h-11 rounded-xl text-base' : 'px-5 py-2.5 text-base rounded-xl gap-2.5'
    }[this.size];

    // Variantes de diseño
    const variantClasses = {
      solid: 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-xs hover:shadow-md shadow-indigo-500/20',
      outline: 'border border-gray-300 dark:border-white/15 bg-white/70 dark:bg-white/5 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/10 hover:border-gray-400 dark:hover:border-white/25',
      ghost: 'bg-transparent text-gray-700 dark:text-gray-300 hover:bg-gray-200/60 dark:hover:bg-white/10',
      glass: 'glass-panel text-gray-900 dark:text-white hover:bg-black/5 dark:hover:bg-white/10 shadow-xs',
      icon: 'border border-gray-300 dark:border-white/15 bg-white/70 dark:bg-white/5 text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-100 dark:hover:bg-white/10'
    }[this.variant];

    return `${base} ${sizeClasses} ${variantClasses} ${this.customClass}`.trim();
  }
}
