import { Injectable, inject, PLATFORM_ID, signal, RendererFactory2, Renderer2 } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

/**
 * Representación tipada del objeto persistido por WAW en localStorage ('wawStates')
 */
export interface WawStoredStates {
  text_size?: number | boolean;
  line_height?: number | boolean;
  letter_spacing?: number | boolean;
  color_invert?: boolean;
  greyscale?: boolean;
  big_cursor?: boolean;
  reading_line?: boolean;
  reading_mask?: boolean;
  voice_reading?: boolean;
  hide_images?: boolean;
  highlight_links?: boolean;
  highlight_headers?: boolean;
  dyslexia_font?: boolean;
  sound?: boolean;
  animations?: boolean;
  dark_theme?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class WawAccessibilityService {
  private platformId = inject(PLATFORM_ID);
  private renderer: Renderer2 = inject(RendererFactory2).createRenderer(null, null);
  private instance: any = null;
  private isInitialized = false;
  private lastFocusedElement: HTMLElement | null = null;
  private initPromise: Promise<void> | null = null;
  private mutationObserver: MutationObserver | null = null;

  // ── Signals reactivos de estado (Angular 21) ──────────────────────────────────
  public isWawOpen = signal(false);
  public isDyslexiaActive = signal(false);
  public isBigCursorActive = signal(false);
  public isReadingLineActive = signal(false);
  public isReadingMaskActive = signal(false);
  public isScreenReaderActive = signal(false);
  public isAnimationsStopped = signal(false);
  public isLinksHighlighted = signal(false);
  public isHeadersHighlighted = signal(false);
  public isImagesHidden = signal(false);
  public isMuted = signal(false);

  /**
   * Inicializa el widget WAW de forma lazy (solo en navegador).
   * Pre-inyecta sprites SVG con rutas absolutas para evitar fallos 404.
   */
  async init(): Promise<void> {
    if (!isPlatformBrowser(this.platformId) || typeof window === 'undefined') {
      return;
    }

    if (this.isInitialized) {
      return;
    }

    if (this.initPromise) {
      return this.initPromise;
    }

    this.initPromise = (async () => {
      try {
        await this.preinjectSprites();

        const { default: WAW } = await import('waw-widget');

        if (!this.instance) {
          this.instance = new WAW({
            colors: {
              mainColor: '#486EAB',
              secondColor: '#1A1A40'
            }
          });
        }

        this.instance.run();
        this.isInitialized = true;

        this.registerKeyboardListener();
        this.setupCloseButtonListener();
        this.setupStateObserver();
        this.syncStates();
      } catch (err) {
        console.error('[WawAccessibilityService] Error al inicializar WAW:', err);
      }
    })();

    return this.initPromise;
  }

  /**
   * FASE 2: Listener directo al botón nativo de cierre ('X') de WAW (#close-button)
   * Garantiza la remoción inmediata de waw-panel-open y la restauración de inert sin clics extras
   */
  private setupCloseButtonListener(): void {
    if (typeof document === 'undefined') return;

    const closeBtn = document.getElementById('close-button');
    const widget = document.getElementById('waw-widget');

    if (closeBtn) {
      this.renderer.listen(closeBtn, 'click', () => {
        if (document.body) {
          this.renderer.removeClass(document.body, 'waw-panel-open');
        }
        if (widget) {
          this.renderer.removeClass(widget, 'open');
          this.renderer.setAttribute(widget, 'inert', '');
        }
        const overlay = document.getElementById('waw-backdrop-overlay');
        if (overlay) {
          this.renderer.removeClass(overlay, 'visible');
        }
        this.isWawOpen.set(false);
        this.syncStates();
      });
    }
  }

  /**
   * Pre-inyecta los símbolos SVG de WAW usando rutas absolutas
   */
  private async preinjectSprites(): Promise<void> {
    if (typeof document === 'undefined' || document.getElementById('waw-svg-sprites-preinjected')) {
      return;
    }

    const spriteFiles = [
      '/assets/icons/icons.svg',
      '/assets/icons/options.svg'
    ];

    const container = this.renderer.createElement('div') as HTMLElement;
    this.renderer.setProperty(container, 'id', 'waw-svg-sprites-preinjected');
    this.renderer.setStyle(container, 'position', 'absolute');
    this.renderer.setStyle(container, 'width', '0');
    this.renderer.setStyle(container, 'height', '0');
    this.renderer.setStyle(container, 'display', 'none');
    this.renderer.setStyle(container, 'overflow', 'hidden');

    const fetches = spriteFiles.map(async file => {
      try {
        const res = await fetch(file);
        if (!res.ok) return '';
        return await res.text();
      } catch {
        return '';
      }
    });

    const svgs = await Promise.all(fetches);
    this.renderer.setProperty(container, 'innerHTML', svgs.join('\n'));
    if (document.body) {
      this.renderer.insertBefore(document.body, container, document.body.firstChild);
    }
  }

  /**
   * Configura MutationObserver seguro para SSR para escuchar cambios en documentElement y en el contenedor del widget.
   */
  private setupStateObserver(): void {
    if (typeof window === 'undefined' || typeof document === 'undefined' || typeof MutationObserver === 'undefined') {
      return;
    }

    if (this.mutationObserver) return;

    this.mutationObserver = new MutationObserver(() => {
      this.syncStates();
    });

    // Observar cambios de clases en el <html>
    this.mutationObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class', 'style']
    });

    // Observar contenedor principal del widget
    const widget = document.getElementById('waw-widget');
    if (widget) {
      this.mutationObserver.observe(widget, {
        attributes: true,
        subtree: true,
        attributeFilter: ['class', 'inert']
      });
    }
  }

  /**
   * Conciliación multi-fuente: Sincroniza las señales reactivas leyendo clases de <html>,
   * estado de botones internos (.active) y persistencia en localStorage ('wawStates').
   */
  public syncStates(): void {
    if (typeof window === 'undefined' || typeof document === 'undefined') return;

    const rootClasses = document.documentElement.classList;

    let parsedStates: WawStoredStates | null = null;
    try {
      const raw = localStorage.getItem('wawStates');
      if (raw) {
        parsedStates = JSON.parse(raw) as WawStoredStates;
      }
    } catch {
      // Ignorar fallo de parseo
    }

    const isBtnActive = (id: string): boolean => {
      const el = document.getElementById(id);
      return el ? el.classList.contains('active') : false;
    };

    // 1. Modo Dislexia
    const isDyslexia =
      rootClasses.contains('WAWDyslexicFont') ||
      isBtnActive('btn-apto-dislexia') ||
      parsedStates?.dyslexia_font === true;
    this.isDyslexiaActive.set(isDyslexia);

    // 2. Cursor Grande
    const isBigCursor =
      rootClasses.contains('WAWBigCursor') ||
      isBtnActive('btn-big-cursor') ||
      parsedStates?.big_cursor === true;
    this.isBigCursorActive.set(isBigCursor);

    // 3. Detener Animaciones (en WAW animations === false significa detenido)
    const isAnimStopped =
      rootClasses.contains('WAWNoAnimations') ||
      isBtnActive('btn-animations') ||
      (parsedStates && typeof parsedStates.animations === 'boolean' ? !parsedStates.animations : false);
    this.isAnimationsStopped.set(isAnimStopped);

    // 4. Ocultar Imágenes
    const isHideImg =
      rootClasses.contains('WAWHideImages') ||
      isBtnActive('btn-hide-img') ||
      parsedStates?.hide_images === true;
    this.isImagesHidden.set(isHideImg);

    // 5. Resaltar Enlaces
    const isLinks =
      rootClasses.contains('WAWHighlightLinks') ||
      isBtnActive('btn-highlight-links') ||
      parsedStates?.highlight_links === true;
    this.isLinksHighlighted.set(isLinks);

    // 6. Resaltar Encabezados
    const isHeaders =
      rootClasses.contains('WAWHighlightHeaders') ||
      isBtnActive('btn-highlight-headers') ||
      parsedStates?.highlight_headers === true;
    this.isHeadersHighlighted.set(isHeaders);

    // 7. Guía de Lectura
    const readingLine = document.getElementById('waw-reading-line');
    const isLineActive =
      (!!readingLine && !readingLine.classList.contains('hidden')) ||
      isBtnActive('btn-reading-line') ||
      parsedStates?.reading_line === true;
    this.isReadingLineActive.set(isLineActive);

    // 8. Máscara de Lectura
    const readingMask = document.getElementById('waw-reading-mask');
    const isMaskActive =
      (!!readingMask && !readingMask.classList.contains('hidden')) ||
      isBtnActive('btn-reading-mask') ||
      parsedStates?.reading_mask === true;
    this.isReadingMaskActive.set(isMaskActive);

    // 9. Lector de Pantalla / Voz
    const isVoice =
      isBtnActive('btn-voice-reading') ||
      parsedStates?.voice_reading === true;
    this.isScreenReaderActive.set(isVoice);

    // 10. Sonido / Mute (en WAW sound === false significa silenciado)
    const muteIndicator = document.getElementById('waw-mute-indicator');
    const isMutedState =
      (!!muteIndicator && muteIndicator.classList.contains('active')) ||
      isBtnActive('btn-mute-sound') ||
      (parsedStates && typeof parsedStates.sound === 'boolean' ? !parsedStates.sound : false);
    this.isMuted.set(isMutedState);

    // Panel abierto/cerrado
    const widget = document.getElementById('waw-widget');
    const open = widget?.classList.contains('open') ?? (this.instance?.widget_open ?? false);
    this.isWawOpen.set(open);
    if (document.body) {
      if (open) {
        this.renderer.addClass(document.body, 'waw-panel-open');
      } else {
        this.renderer.removeClass(document.body, 'waw-panel-open');
      }
    }
    const overlay = document.getElementById('waw-backdrop-overlay');
    if (overlay && !open) {
      this.renderer.removeClass(overlay, 'visible');
    }
    if (widget && !open && !widget.hasAttribute('inert')) {
      this.renderer.setAttribute(widget, 'inert', '');
    }
  }

  /**
   * Manejo accesible por teclado: Esc para cerrar el panel y devolver el foco
   */
  private registerKeyboardListener(): void {
    if (typeof window === 'undefined' || typeof document === 'undefined') return;

    document.addEventListener('keydown', (event: KeyboardEvent) => {
      if (event.key === 'Escape' && this.isOpen()) {
        event.preventDefault();
        this.close();
      }
    });
  }

  /**
   * Crea o asegura la existencia de un backdrop overlay seguro para WAW
   */
  private ensureOverlay(): HTMLElement | null {
    if (typeof document === 'undefined') return null;

    let overlay = document.getElementById('waw-backdrop-overlay');
    if (!overlay) {
      overlay = this.renderer.createElement('div') as HTMLElement;
      this.renderer.setProperty(overlay, 'id', 'waw-backdrop-overlay');
      this.renderer.addClass(overlay, 'waw-custom-backdrop');
      this.renderer.setAttribute(overlay, 'aria-hidden', 'true');
      overlay.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.close();
      });
      if (document.body) {
        this.renderer.appendChild(document.body, overlay);
      }
    }
    return overlay;
  }

  /**
   * Abre el panel de WAW eliminando el atributo 'inert' y mostrando el overlay
   */
  async open(triggerElement?: HTMLElement): Promise<void> {
    if (!isPlatformBrowser(this.platformId) || typeof window === 'undefined' || typeof document === 'undefined') return;

    if (triggerElement) {
      this.lastFocusedElement = triggerElement;
    } else if (document.activeElement instanceof HTMLElement) {
      this.lastFocusedElement = document.activeElement;
    }

    if (!this.isInitialized) {
      await this.init();
    }

    const widget = document.getElementById('waw-widget');
    if (widget) {
      this.renderer.removeAttribute(widget, 'inert');
    }

    const overlay = this.ensureOverlay();
    if (overlay) {
      this.renderer.addClass(overlay, 'visible');
    }

    if (this.instance && typeof this.instance.open === 'function') {
      this.instance.open();
    } else {
      const openBtn = document.getElementById('open-button');
      if (openBtn) {
        openBtn.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
      }
    }

    if (widget) {
      this.renderer.addClass(widget, 'open');
      this.renderer.removeAttribute(widget, 'inert');
    }
    if (document.body) {
      this.renderer.addClass(document.body, 'waw-panel-open');
    }

    this.syncStates();
  }

  /**
   * Alias explícito para apertura de panel completo
   */
  async openFullWawPanel(triggerElement?: HTMLElement, event?: Event): Promise<void> {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    setTimeout(() => {
      this.open(triggerElement);
    }, 10);
  }

  /**
   * Cierra el panel de WAW, restaura 'inert' y devuelve el foco
   */
  close(): void {
    if (!isPlatformBrowser(this.platformId) || typeof window === 'undefined' || typeof document === 'undefined') return;

    const overlay = document.getElementById('waw-backdrop-overlay');
    if (overlay) {
      this.renderer.removeClass(overlay, 'visible');
    }

    if (this.instance && typeof this.instance.close === 'function') {
      this.instance.close();
    } else {
      const closeBtn = document.getElementById('close-button');
      if (closeBtn) {
        closeBtn.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
      }
    }

    const widget = document.getElementById('waw-widget');
    if (widget) {
      this.renderer.removeClass(widget, 'open');
      this.renderer.setAttribute(widget, 'inert', '');
    }
    if (document.body) {
      this.renderer.removeClass(document.body, 'waw-panel-open');
    }

    if (this.lastFocusedElement && typeof this.lastFocusedElement.focus === 'function') {
      this.lastFocusedElement.focus();
      this.lastFocusedElement = null;
    }

    this.syncStates();
  }

  /**
   * Alterna estado abierto/cerrado del widget WAW
   */
  async toggle(triggerElement?: HTMLElement): Promise<void> {
    if (this.isOpen()) {
      this.close();
    } else {
      await this.open(triggerElement);
    }
  }

  /**
   * Verifica si el panel WAW está visible actualmente
   */
  isOpen(): boolean {
    if (!isPlatformBrowser(this.platformId) || typeof document === 'undefined') return false;
    const widget = document.getElementById('waw-widget');
    return widget?.classList.contains('open') ?? (this.instance?.widget_open ?? false);
  }

  /**
   * Restablece todas las funciones del widget WAW y limpia clases globales
   */
  reset(): void {
    if (!isPlatformBrowser(this.platformId) || typeof document === 'undefined') return;

    if (this.instance && typeof this.instance.resetFunctions === 'function') {
      this.instance.resetFunctions();
    } else {
      const resetBtn = document.querySelector('[data-waw-function="reset"]') as HTMLElement | null;
      if (resetBtn) {
        resetBtn.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
      }
    }

    document.documentElement.classList.remove(
      'WAWDyslexicFont',
      'WAWBigCursor',
      'WAWNoAnimations',
      'WAWHideImages',
      'WAWHighlightLinks',
      'WAWHighlightHeaders',
      'WAWGreyscale',
      'WAWInvertedColor'
    );

    const activeButtons = document.querySelectorAll('.waw .opcion.active, #waw-mute-indicator.active');
    activeButtons.forEach(btn => this.renderer.removeClass(btn, 'active'));

    const readingMask = document.getElementById('waw-reading-mask');
    if (readingMask) {
      this.renderer.addClass(readingMask, 'hidden');
    }

    const readingLine = document.getElementById('waw-reading-line');
    if (readingLine) {
      this.renderer.addClass(readingLine, 'hidden');
    }

    try {
      localStorage.removeItem('wawStates');
    } catch {
      // ignore
    }

    this.syncStates();
  }

  /**
   * Dispara una funcionalidad individual de WAW eliminando temporalmente 'inert' si el contenedor está cerrado.
   * Utiliza UN SOLO evento sintético 'click' con bubbles: true para evitar el efecto de doble rebote.
   */
  async clickFeatureButton(btnId: string): Promise<void> {
    if (!isPlatformBrowser(this.platformId) || typeof document === 'undefined') return;

    if (!this.isInitialized) {
      await this.init();
    }

    const widget = document.getElementById('waw-widget');
    const wasInert = widget ? widget.hasAttribute('inert') : false;

    // 1. Remover atributo 'inert' ANTES de ejecutar el clic para permitir despacho del evento
    if (widget && wasInert) {
      this.renderer.removeAttribute(widget, 'inert');
    }

    const btn = document.getElementById(btnId);
    if (btn) {
      // Despacho único y limpio mediante dispatchEvent con bubbles: true
      btn.dispatchEvent(
        new MouseEvent('click', {
          bubbles: true,
          cancelable: true,
          view: window,
        })
      );
    }

    // 2. Restaurar 'inert' solo si el panel WAW permanece cerrado
    if (widget && wasInert && !this.isOpen()) {
      this.renderer.setAttribute(widget, 'inert', '');
    }

    // 3. Sincronización inmediata multi-fuente
    this.syncStates();
  }

  /**
   * Toggle genérico para accesos rápidos con bypass de 'inert'
   */
  async toggleQuickOption(optionKey: string, event?: Event): Promise<void> {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    const buttonMap: Record<string, string> = {
      dyslexia: 'btn-apto-dislexia',
      'reading-line': 'btn-reading-line',
      'reading-mask': 'btn-reading-mask',
      'big-cursor': 'btn-big-cursor',
      'screen-reader': 'btn-voice-reading',
      animations: 'btn-animations',
      links: 'btn-highlight-links',
      headers: 'btn-highlight-headers',
      'hide-img': 'btn-hide-img',
      mute: 'btn-mute-sound',
    };

    const targetBtnId = buttonMap[optionKey] || optionKey;
    await this.clickFeatureButton(targetBtnId);
  }

  // --- Atajos de conveniencia para accesos directos ---
  async toggleDyslexia(event?: Event): Promise<void> {
    await this.toggleQuickOption('dyslexia', event);
  }

  async toggleReadingLine(event?: Event): Promise<void> {
    await this.toggleQuickOption('reading-line', event);
  }

  async toggleReadingMask(event?: Event): Promise<void> {
    await this.toggleQuickOption('reading-mask', event);
  }

  async toggleBigCursor(event?: Event): Promise<void> {
    await this.toggleQuickOption('big-cursor', event);
  }

  async toggleScreenReader(event?: Event): Promise<void> {
    await this.toggleQuickOption('screen-reader', event);
  }

  async toggleStopAnimations(event?: Event): Promise<void> {
    await this.toggleQuickOption('animations', event);
  }

  async toggleHighlightLinks(event?: Event): Promise<void> {
    await this.toggleQuickOption('links', event);
  }

  async toggleHighlightHeaders(event?: Event): Promise<void> {
    await this.toggleQuickOption('headers', event);
  }

  async toggleHideImages(event?: Event): Promise<void> {
    await this.toggleQuickOption('hide-img', event);
  }

  async toggleMute(event?: Event): Promise<void> {
    await this.toggleQuickOption('mute', event);
  }
}
