import {
  Component,
  Input,
  Output,
  EventEmitter,
  signal,
  inject,
  ChangeDetectionStrategy,
  PLATFORM_ID,
  HostListener,
  ElementRef,
  viewChild
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ShareService, ShareNetwork } from '@app/core/services/share.service';
import { ToastService } from '@app/shared/services/toast.service';

export interface NetworkConfig {
  id: ShareNetwork;
  name: string;
  ariaLabel: string;
  iconClass: string;
  colorClass: string;
}

@Component({
  selector: 'app-share-buttons',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './share-buttons.component.html',
  styleUrl: './share-buttons.component.scss'
})
export class ShareButtonsComponent {
  private platformId = inject(PLATFORM_ID);
  public shareService = inject(ShareService);
  private toastService = inject(ToastService);
  private elementRef = inject(ElementRef);

  triggerButton = viewChild<ElementRef<HTMLButtonElement>>('triggerBtn');

  @Input() title: string = '';
  @Input() text: string = '';
  @Input() url: string = '';
  @Input() networks: ShareNetwork[] = ['whatsapp', 'facebook', 'x', 'linkedin', 'telegram', 'email', 'copy'];
  /**
   * Modo de visualización:
   * - 'discreet': Botón/enlace sutil con ícono y texto (ideal para fichas de producto al lado de título/estrellas).
   * - 'inline': Fila de botones para fichas de producto o artículos.
   * - 'menu': Dropdown compacto para barras de herramientas.
   * - 'static': Botón minimalista icon-only (abre menú hacia arriba, sin fixed/sticky).
   * - 'floating': Alias por compatibilidad de 'static'.
   */
  @Input() variant: 'discreet' | 'inline' | 'menu' | 'static' | 'floating' = 'inline';
  @Input() ariaLabel: string = 'Compartir este producto';
  @Input() showLabels: boolean = false;
  @Input() customClass: string = '';

  @Output() shared = new EventEmitter<{ network: string; url: string }>();

  isMenuOpen = signal<boolean>(false);
  copied = signal<boolean>(false);
  private copyTimeout: ReturnType<typeof setTimeout> | null = null;

  readonly allNetworks: Record<ShareNetwork, NetworkConfig> = {
    whatsapp: {
      id: 'whatsapp',
      name: 'WhatsApp',
      ariaLabel: 'Compartir en WhatsApp',
      iconClass: 'fa-brands fa-whatsapp',
      colorClass: 'hover:bg-[#25D366] hover:text-white hover:border-[#25D366]'
    },
    facebook: {
      id: 'facebook',
      name: 'Facebook',
      ariaLabel: 'Compartir en Facebook',
      iconClass: 'fa-brands fa-facebook-f',
      colorClass: 'hover:bg-[#1877F2] hover:text-white hover:border-[#1877F2]'
    },
    x: {
      id: 'x',
      name: 'X (Twitter)',
      ariaLabel: 'Compartir en X (Twitter)',
      iconClass: 'fa-brands fa-x-twitter',
      colorClass: 'hover:bg-black hover:text-white hover:border-black dark:hover:bg-white dark:hover:text-black'
    },
    linkedin: {
      id: 'linkedin',
      name: 'LinkedIn',
      ariaLabel: 'Compartir en LinkedIn',
      iconClass: 'fa-brands fa-linkedin-in',
      colorClass: 'hover:bg-[#0A66C2] hover:text-white hover:border-[#0A66C2]'
    },
    telegram: {
      id: 'telegram',
      name: 'Telegram',
      ariaLabel: 'Compartir en Telegram',
      iconClass: 'fa-brands fa-telegram',
      colorClass: 'hover:bg-[#24A1DE] hover:text-white hover:border-[#24A1DE]'
    },
    email: {
      id: 'email',
      name: 'Email',
      ariaLabel: 'Compartir por correo electrónico',
      iconClass: 'fa-solid fa-envelope',
      colorClass: 'hover:bg-[#EA4335] hover:text-white hover:border-[#EA4335]'
    },
    copy: {
      id: 'copy',
      name: 'Copiar enlace',
      ariaLabel: 'Copiar enlace al portapapeles',
      iconClass: 'fa-solid fa-link',
      colorClass: 'hover:bg-brand-blue hover:text-white hover:border-brand-blue'
    }
  };

  get activeNetworks(): NetworkConfig[] {
    return this.networks
      .map(id => this.allNetworks[id])
      .filter((net): net is NetworkConfig => !!net);
  }

  get isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  resolveUrl(): string {
    if (this.url) return this.url;
    if (this.isBrowser && typeof window !== 'undefined') {
      return window.location.href;
    }
    return '';
  }

  resolveTitle(): string {
    if (this.title) return this.title;
    if (this.isBrowser && typeof document !== 'undefined') {
      return document.title;
    }
    return 'Arecofix';
  }

  toggleMenu(): void {
    const nextState = !this.isMenuOpen();
    this.isMenuOpen.set(nextState);
  }

  closeMenu(): void {
    if (this.isMenuOpen()) {
      this.isMenuOpen.set(false);
      // Retornar el foco al botón disparador para accesibilidad WCAG
      const btn = this.triggerButton()?.nativeElement;
      if (btn && typeof btn.focus === 'function') {
        btn.focus();
      }
    }
  }

  /**
   * Cierra el menú al presionar Escape o hacer clic fuera del componente
   */
  @HostListener('document:keydown.escape', ['$event'])
  onEscapeKey(event: Event): void {
    if (this.isMenuOpen()) {
      event.preventDefault();
      this.closeMenu();
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    if (this.isMenuOpen() && !this.elementRef.nativeElement.contains(event.target as Node)) {
      this.closeMenu();
    }
  }

  async onShareNetwork(network: ShareNetwork): Promise<void> {
    const shareUrl = this.resolveUrl();
    const shareTitle = this.resolveTitle();
    const shareText = this.text || shareTitle;

    switch (network) {
      case 'whatsapp':
        this.shareService.shareToWhatsApp(shareUrl, shareText);
        break;
      case 'facebook':
        this.shareService.shareToFacebook(shareUrl);
        break;
      case 'x':
        this.shareService.shareToX(shareUrl, shareText);
        break;
      case 'linkedin':
        this.shareService.shareToLinkedIn(shareUrl);
        break;
      case 'telegram':
        this.shareService.shareToTelegram(shareUrl, shareText);
        break;
      case 'email':
        this.shareService.shareByEmail(shareUrl, shareText, shareTitle);
        break;
      case 'copy':
        await this.handleCopy(shareUrl);
        break;
    }

    this.shared.emit({ network, url: shareUrl });

    if (this.variant === 'menu' || this.variant === 'floating' || this.variant === 'static' || this.variant === 'discreet') {
      this.closeMenu();
    }
  }

  /**
   * En mobile o cuando se use variante botón nativo
   */
  async triggerNativeOrMenu(): Promise<void> {
    if (this.shareService.canUseWebShare()) {
      const shareUrl = this.resolveUrl();
      const shareTitle = this.resolveTitle();
      const result = await this.shareService.share({
        title: shareTitle,
        text: this.text || shareTitle,
        url: shareUrl
      });
      if (result.success) {
        this.shared.emit({ network: result.network, url: shareUrl });
        return;
      }
    }
    this.toggleMenu();
  }

  private async handleCopy(url: string): Promise<void> {
    const success = await this.shareService.copyToClipboard(url);
    if (success) {
      this.copied.set(true);
      this.toastService.show('¡Enlace copiado al portapapeles!', 'success');

      if (this.copyTimeout) {
        clearTimeout(this.copyTimeout);
      }
      this.copyTimeout = setTimeout(() => {
        this.copied.set(false);
      }, 2500);
    } else {
      this.toastService.show('No se pudo copiar el enlace', 'error');
    }
  }
}

