import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export type ShareNetwork = 'whatsapp' | 'facebook' | 'x' | 'linkedin' | 'telegram' | 'email' | 'copy';

export interface ShareDataPayload {
  title?: string;
  text?: string;
  url?: string;
}

export interface ShareResult {
  network: ShareNetwork | 'native';
  url: string;
  success: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ShareService {
  private platformId = inject(PLATFORM_ID);

  get isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  /**
   * Determina si la Web Share API nativa está disponible
   */
  canUseWebShare(): boolean {
    if (!this.isBrowser || typeof navigator === 'undefined') {
      return false;
    }
    return typeof navigator.share === 'function';
  }

  /**
   * Intenta compartir mediante navigator.share(); si no está disponible o falla, cae a copiar al portapapeles
   */
  async share(data: ShareDataPayload): Promise<ShareResult> {
    const url = data.url || (this.isBrowser ? window.location.href : '');
    const title = data.title || (this.isBrowser && typeof document !== 'undefined' ? document.title : '');
    const text = data.text || '';

    if (this.canUseWebShare()) {
      try {
        await navigator.share({
          title,
          text,
          url,
        });
        return { network: 'native', url, success: true };
      } catch (err: unknown) {
        if (err instanceof Error && err.name === 'AbortError') {
          return { network: 'native', url, success: false };
        }
        const copied = await this.copyToClipboard(url);
        return { network: 'copy', url, success: copied };
      }
    }

    const copied = await this.copyToClipboard(url);
    return { network: 'copy', url, success: copied };
  }

  /**
   * Abre enlace oficial para compartir en WhatsApp
   */
  shareToWhatsApp(url: string, text?: string): void {
    const message = text ? `${text} ${url}` : url;
    this.openWindow(`https://wa.me/?text=${encodeURIComponent(message)}`);
  }

  /**
   * Abre diálogo oficial de Facebook Share
   */
  shareToFacebook(url: string): void {
    this.openWindow(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`);
  }

  /**
   * Abre diálogo oficial de publicación en X (Twitter)
   */
  shareToX(url: string, text?: string): void {
    const query = new URLSearchParams({ url });
    if (text) query.set('text', text);
    this.openWindow(`https://twitter.com/intent/tweet?${query.toString()}`);
  }

  /**
   * Abre diálogo oficial de LinkedIn Share
   */
  shareToLinkedIn(url: string): void {
    this.openWindow(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`);
  }

  /**
   * Abre diálogo oficial de Telegram
   */
  shareToTelegram(url: string, text?: string): void {
    const query = new URLSearchParams({ url });
    if (text) query.set('text', text);
    this.openWindow(`https://t.me/share/url?${query.toString()}`);
  }

  /**
   * Genera enlace mailto
   */
  shareByEmail(url: string, text?: string, title?: string): void {
    const subject = title || 'Te comparto este enlace';
    const body = text ? `${text}\n${url}` : url;
    if (this.isBrowser) {
      window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    }
  }

  /**
   * Copia enlace al portapapeles con fallback robusto
   */
  async copyToClipboard(text: string): Promise<boolean> {
    if (!this.isBrowser) return false;

    if (navigator?.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(text);
        return true;
      } catch {
        // Fallback a execCommand
      }
    }

    try {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.left = '-9999px';
      textarea.style.top = '0';
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

  private openWindow(targetUrl: string): void {
    if (!this.isBrowser) return;
    window.open(targetUrl, '_blank', 'noopener,noreferrer,width=600,height=600');
  }
}

