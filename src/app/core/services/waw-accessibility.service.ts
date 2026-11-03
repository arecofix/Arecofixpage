import {
  Injectable,
  inject,
  PLATFORM_ID,
  signal,
  RendererFactory2,
  Renderer2,
  DOCUMENT,
  DestroyRef,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import type WAW from 'waw-widget';
import {
  WAW_DOM_IDS,
  WAW_FEATURE_BUTTON_IDS,
  WAW_CSS_CLASSES,
  ALL_WAW_ROOT_CLASSES,
  WAW_STORAGE_KEYS,
  WAW_THEME_COLORS,
  WAW_SPRITE_PATHS,
  WawFeatureKey,
  WAW_FEATURE_MAP,
} from '@app/core/constants/waw.constants';

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
  providedIn: 'root',
})
export class WawAccessibilityService {
  private platformId = inject(PLATFORM_ID);
  private document: Document = inject(DOCUMENT);
  private destroyRef = inject(DestroyRef);
  private renderer: Renderer2 = inject(RendererFactory2).createRenderer(null, null);

  private instance: WAW | null = null;
  private isInitialized = false;
  private lastFocusedElement: HTMLElement | null = null;
  private initPromise: Promise<void> | null = null;
  private mutationObserver: MutationObserver | null = null;
  private pendingSyncFrame: number | null = null;
  private unlisteners: Array<() => void> = [];

  // ── Signals reactivos de estado (Angular 21) ──────────────────────────────────
  public readonly isWawOpen = signal<boolean>(false);
  public readonly isDyslexiaActive = signal<boolean>(false);
  public readonly isBigCursorActive = signal<boolean>(false);
  public readonly isReadingLineActive = signal<boolean>(false);
  public readonly isReadingMaskActive = signal<boolean>(false);
  public readonly isScreenReaderActive = signal<boolean>(false);
  public readonly isAnimationsStopped = signal<boolean>(false);
  public readonly isLinksHighlighted = signal<boolean>(false);
  public readonly isHeadersHighlighted = signal<boolean>(false);
  public readonly isImagesHidden = signal<boolean>(false);
  public readonly isMuted = signal<boolean>(false);

  constructor() {
    this.destroyRef.onDestroy(() => this.destroy());
  }

  /**
   * Limpieza de recursos, listeners y observadores para evitar fugas de memoria
   */
  public destroy(): void {
    if (this.pendingSyncFrame !== null && typeof cancelAnimationFrame !== 'undefined') {
      cancelAnimationFrame(this.pendingSyncFrame);
      this.pendingSyncFrame = null;
    }

    if (this.mutationObserver) {
      this.mutationObserver.disconnect();
      this.mutationObserver = null;
    }

    this.unlisteners.forEach((unlisten) => {
      try {
        unlisten();
      } catch {
        // Ignorar errores al desuscribir
      }
    });
    this.unlisteners = [];
  }

  /**
   * Inicializa el widget WAW de forma diferida (solo en navegador).
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

        const { default: WAWClass } = await import('waw-widget');

        if (!this.instance) {
          this.instance = new WAWClass({
            colors: {
              mainColor: WAW_THEME_COLORS.MAIN,
              secondColor: WAW_THEME_COLORS.SECOND,
            },
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
   * Listener directo al botón nativo de cierre ('X') de WAW (#close-button)
   * Garantiza la remoción inmediata de waw-panel-open y la restauración de inert sin clics extras.
   */
  public setupCloseButtonListener(): void {
    const closeBtn = this.document.getElementById(WAW_DOM_IDS.CLOSE_BUTTON);
    const widget = this.document.getElementById(WAW_DOM_IDS.WIDGET);

    if (closeBtn) {
      const unlisten = this.renderer.listen(closeBtn, 'click', () => {
        if (this.document.body) {
          this.renderer.removeClass(this.document.body, WAW_CSS_CLASSES.PANEL_OPEN);
        }
        if (widget) {
          this.renderer.removeClass(widget, WAW_CSS_CLASSES.OPEN);
          this.renderer.setAttribute(widget, 'inert', '');
        }
        const overlay = this.document.getElementById(WAW_DOM_IDS.BACKDROP_OVERLAY);
        if (overlay) {
          this.renderer.removeClass(overlay, WAW_CSS_CLASSES.OVERLAY_VISIBLE);
        }
        this.isWawOpen.set(false);
        this.syncStates();
      });
      this.unlisteners.push(unlisten);
    }
  }

  /**
   * Pre-inyecta los símbolos SVG de WAW usando rutas absolutas para evitar 404 en subrutas
   */
  private async preinjectSprites(): Promise<void> {
    if (this.document.getElementById(WAW_DOM_IDS.SPRITES_CONTAINER)) {
      return;
    }

    const container = this.renderer.createElement('div') as HTMLElement;
    this.renderer.setProperty(container, 'id', WAW_DOM_IDS.SPRITES_CONTAINER);
    this.renderer.setStyle(container, 'position', 'absolute');
    this.renderer.setStyle(container, 'width', '0');
    this.renderer.setStyle(container, 'height', '0');
    this.renderer.setStyle(container, 'display', 'none');
    this.renderer.setStyle(container, 'overflow', 'hidden');

    const fetches = WAW_SPRITE_PATHS.map(async (file) => {
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
    if (this.document.body) {
      this.renderer.insertBefore(this.document.body, container, this.document.body.firstChild);
    }
  }

  /**
   * Configura MutationObserver con debouncing seguro para evitar layout thrashing
   */
  private setupStateObserver(): void {
    if (typeof window === 'undefined' || typeof MutationObserver === 'undefined') {
      return;
    }

    if (this.mutationObserver) return;

    this.mutationObserver = new MutationObserver(() => {
      this.scheduleSyncStates();
    });

    // Observar cambios de clases en el <html>
    if (this.document.documentElement) {
      this.mutationObserver.observe(this.document.documentElement, {
        attributes: true,
        attributeFilter: ['class', 'style'],
      });
    }

    // Observar contenedor principal del widget
    const widget = this.document.getElementById(WAW_DOM_IDS.WIDGET);
    if (widget) {
      this.mutationObserver.observe(widget, {
        attributes: true,
        subtree: true,
        attributeFilter: ['class', 'inert'],
      });
    }
  }

  /**
   * Debounce reactivo para coalescer mutaciones DOM múltiples en un solo frame
   */
  public scheduleSyncStates(): void {
    if (!isPlatformBrowser(this.platformId) || typeof window === 'undefined') return;

    if (this.pendingSyncFrame !== null && typeof cancelAnimationFrame !== 'undefined') {
      cancelAnimationFrame(this.pendingSyncFrame);
    }

    this.pendingSyncFrame = requestAnimationFrame(() => {
      this.pendingSyncFrame = null;
      this.syncStates();
    });
  }

  /**
   * Lectura segura y tipada de localStorage
   */
  private getStoredStates(): WawStoredStates | null {
    if (!isPlatformBrowser(this.platformId) || typeof window === 'undefined') return null;
    try {
      const raw = window.localStorage.getItem(WAW_STORAGE_KEYS.STATES);
      return raw ? (JSON.parse(raw) as WawStoredStates) : null;
    } catch {
      return null;
    }
  }

  /**
   * Borrado seguro de localStorage
   */
  private clearStoredStates(): void {
    if (!isPlatformBrowser(this.platformId) || typeof window === 'undefined') return;
    try {
      window.localStorage.removeItem(WAW_STORAGE_KEYS.STATES);
    } catch {
      // Ignorar fallo de almacenamiento
    }
  }

  /**
   * Conciliación multi-fuente: Sincroniza las señales reactivas leyendo clases de <html>,
   * estado de botones internos (.active) y persistencia en localStorage ('wawStates').
   */
  public syncStates(): void {
    if (!isPlatformBrowser(this.platformId) || !this.document.documentElement) return;

    const rootClasses = this.document.documentElement.classList;
    const parsedStates = this.getStoredStates();

    const isBtnActive = (id: string): boolean => {
      const el = this.document.getElementById(id);
      return el ? el.classList.contains(WAW_CSS_CLASSES.ACTIVE) : false;
    };

    // 1. Modo Dislexia
    const isDyslexia =
      rootClasses.contains(WAW_CSS_CLASSES.ROOT_DYSLEXIA) ||
      isBtnActive(WAW_FEATURE_BUTTON_IDS.DYSLEXIA) ||
      parsedStates?.dyslexia_font === true;
    this.isDyslexiaActive.set(isDyslexia);

    // 2. Cursor Grande
    const isBigCursor =
      rootClasses.contains(WAW_CSS_CLASSES.ROOT_BIG_CURSOR) ||
      isBtnActive(WAW_FEATURE_BUTTON_IDS.BIG_CURSOR) ||
      parsedStates?.big_cursor === true;
    this.isBigCursorActive.set(isBigCursor);

    // 3. Detener Animaciones (en WAW animations === false significa detenido)
    const isAnimStopped =
      rootClasses.contains(WAW_CSS_CLASSES.ROOT_NO_ANIMATIONS) ||
      isBtnActive(WAW_FEATURE_BUTTON_IDS.ANIMATIONS) ||
      (parsedStates && typeof parsedStates.animations === 'boolean' ? !parsedStates.animations : false);
    this.isAnimationsStopped.set(isAnimStopped);

    // 4. Ocultar Imágenes
    const isHideImg =
      rootClasses.contains(WAW_CSS_CLASSES.ROOT_HIDE_IMAGES) ||
      isBtnActive(WAW_FEATURE_BUTTON_IDS.HIDE_IMAGES) ||
      parsedStates?.hide_images === true;
    this.isImagesHidden.set(isHideImg);

    // 5. Resaltar Enlaces
    const isLinks =
      rootClasses.contains(WAW_CSS_CLASSES.ROOT_HIGHLIGHT_LINKS) ||
      isBtnActive(WAW_FEATURE_BUTTON_IDS.HIGHLIGHT_LINKS) ||
      parsedStates?.highlight_links === true;
    this.isLinksHighlighted.set(isLinks);

    // 6. Resaltar Encabezados
    const isHeaders =
      rootClasses.contains(WAW_CSS_CLASSES.ROOT_HIGHLIGHT_HEADERS) ||
      isBtnActive(WAW_FEATURE_BUTTON_IDS.HIGHLIGHT_HEADERS) ||
      parsedStates?.highlight_headers === true;
    this.isHeadersHighlighted.set(isHeaders);

    // 7. Guía de Lectura
    const readingLine = this.document.getElementById(WAW_DOM_IDS.READING_LINE);
    const isLineActive =
      (!!readingLine && !readingLine.classList.contains(WAW_CSS_CLASSES.HIDDEN)) ||
      isBtnActive(WAW_FEATURE_BUTTON_IDS.READING_LINE) ||
      parsedStates?.reading_line === true;
    this.isReadingLineActive.set(isLineActive);

    // 8. Máscara de Lectura
    const readingMask = this.document.getElementById(WAW_DOM_IDS.READING_MASK);
    const isMaskActive =
      (!!readingMask && !readingMask.classList.contains(WAW_CSS_CLASSES.HIDDEN)) ||
      isBtnActive(WAW_FEATURE_BUTTON_IDS.READING_MASK) ||
      parsedStates?.reading_mask === true;
    this.isReadingMaskActive.set(isMaskActive);

    // 9. Lector de Pantalla / Voz
    const isVoice =
      isBtnActive(WAW_FEATURE_BUTTON_IDS.SCREEN_READER) ||
      parsedStates?.voice_reading === true;
    this.isScreenReaderActive.set(isVoice);

    // 10. Sonido / Mute (en WAW sound === false significa silenciado)
    const muteIndicator = this.document.getElementById(WAW_DOM_IDS.MUTE_INDICATOR);
    const isMutedState =
      (!!muteIndicator && muteIndicator.classList.contains(WAW_CSS_CLASSES.ACTIVE)) ||
      isBtnActive(WAW_FEATURE_BUTTON_IDS.MUTE) ||
      (parsedStates && typeof parsedStates.sound === 'boolean' ? !parsedStates.sound : false);
    this.isMuted.set(isMutedState);

    // Panel abierto/cerrado
    const widget = this.document.getElementById(WAW_DOM_IDS.WIDGET);
    const open = widget?.classList.contains(WAW_CSS_CLASSES.OPEN) ?? (this.instance?.widget_open ?? false);
    this.isWawOpen.set(open);

    if (this.document.body) {
      if (open) {
        this.renderer.addClass(this.document.body, WAW_CSS_CLASSES.PANEL_OPEN);
      } else {
        this.renderer.removeClass(this.document.body, WAW_CSS_CLASSES.PANEL_OPEN);
      }
    }

    const overlay = this.document.getElementById(WAW_DOM_IDS.BACKDROP_OVERLAY);
    if (overlay && !open) {
      this.renderer.removeClass(overlay, WAW_CSS_CLASSES.OVERLAY_VISIBLE);
    }
    if (widget && !open && !widget.hasAttribute('inert')) {
      this.renderer.setAttribute(widget, 'inert', '');
    }
  }

  /**
   * Manejo accesible por teclado: Esc para cerrar el panel y devolver el foco
   */
  private registerKeyboardListener(): void {
    if (!isPlatformBrowser(this.platformId) || typeof window === 'undefined') return;

    const unlisten = this.renderer.listen(this.document, 'keydown', (event: KeyboardEvent) => {
      if (event.key === 'Escape' && this.isOpen()) {
        event.preventDefault();
        this.close();
      }
    });
    this.unlisteners.push(unlisten);
  }

  /**
   * Crea o asegura la existencia de un backdrop overlay seguro para WAW
   */
  private ensureOverlay(): HTMLElement | null {
    let overlay = this.document.getElementById(WAW_DOM_IDS.BACKDROP_OVERLAY);
    if (!overlay) {
      overlay = this.renderer.createElement('div') as HTMLElement;
      this.renderer.setProperty(overlay, 'id', WAW_DOM_IDS.BACKDROP_OVERLAY);
      this.renderer.addClass(overlay, WAW_CSS_CLASSES.OVERLAY_CUSTOM);
      this.renderer.setAttribute(overlay, 'aria-hidden', 'true');

      const unlisten = this.renderer.listen(overlay, 'click', (e: Event) => {
        e.preventDefault();
        e.stopPropagation();
        this.close();
      });
      this.unlisteners.push(unlisten);

      if (this.document.body) {
        this.renderer.appendChild(this.document.body, overlay);
      }
    }
    return overlay;
  }

  /**
   * Abre el panel de WAW eliminando el atributo 'inert' y mostrando el overlay
   */
  async open(triggerElement?: HTMLElement): Promise<void> {
    if (!isPlatformBrowser(this.platformId) || typeof window === 'undefined') return;

    if (triggerElement) {
      this.lastFocusedElement = triggerElement;
    } else if (this.document.activeElement instanceof HTMLElement) {
      this.lastFocusedElement = this.document.activeElement;
    }

    if (!this.isInitialized) {
      await this.init();
    }

    const widget = this.document.getElementById(WAW_DOM_IDS.WIDGET);
    if (widget) {
      this.renderer.removeAttribute(widget, 'inert');
    }

    const overlay = this.ensureOverlay();
    if (overlay) {
      this.renderer.addClass(overlay, WAW_CSS_CLASSES.OVERLAY_VISIBLE);
    }

    if (this.instance && typeof this.instance.open === 'function') {
      this.instance.open();
    } else {
      const openBtn = this.document.getElementById(WAW_DOM_IDS.OPEN_BUTTON);
      if (openBtn) {
        openBtn.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
      }
    }

    if (widget) {
      this.renderer.addClass(widget, WAW_CSS_CLASSES.OPEN);
      this.renderer.removeAttribute(widget, 'inert');
    }
    if (this.document.body) {
      this.renderer.addClass(this.document.body, WAW_CSS_CLASSES.PANEL_OPEN);
    }

    this.syncStates();
  }

  /**
   * Apertura programada limpia de panel completo desacoplada de timeouts mágicos
   */
  async openFullWawPanel(triggerElement?: HTMLElement, event?: Event): Promise<void> {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    queueMicrotask(() => {
      this.open(triggerElement);
    });
  }

  /**
   * Cierra el panel de WAW, restaura 'inert' y devuelve el foco
   */
  close(): void {
    if (!isPlatformBrowser(this.platformId) || typeof window === 'undefined') return;

    const overlay = this.document.getElementById(WAW_DOM_IDS.BACKDROP_OVERLAY);
    if (overlay) {
      this.renderer.removeClass(overlay, WAW_CSS_CLASSES.OVERLAY_VISIBLE);
    }

    if (this.instance && typeof this.instance.close === 'function') {
      this.instance.close();
    } else {
      const closeBtn = this.document.getElementById(WAW_DOM_IDS.CLOSE_BUTTON);
      if (closeBtn) {
        closeBtn.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
      }
    }

    const widget = this.document.getElementById(WAW_DOM_IDS.WIDGET);
    if (widget) {
      this.renderer.removeClass(widget, WAW_CSS_CLASSES.OPEN);
      this.renderer.setAttribute(widget, 'inert', '');
    }
    if (this.document.body) {
      this.renderer.removeClass(this.document.body, WAW_CSS_CLASSES.PANEL_OPEN);
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
    if (!isPlatformBrowser(this.platformId)) return false;
    const widget = this.document.getElementById(WAW_DOM_IDS.WIDGET);
    return widget?.classList.contains(WAW_CSS_CLASSES.OPEN) ?? (this.instance?.widget_open ?? false);
  }

  /**
   * Restablece todas las funciones del widget WAW y limpia clases globales con Renderer2
   */
  reset(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    if (this.instance && typeof this.instance.resetFunctions === 'function') {
      this.instance.resetFunctions();
    } else {
      const resetBtn = this.document.querySelector('[data-waw-function="reset"]') as HTMLElement | null;
      if (resetBtn) {
        resetBtn.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
      }
    }

    ALL_WAW_ROOT_CLASSES.forEach((cls) => {
      this.renderer.removeClass(this.document.documentElement, cls);
    });

    const activeButtons = this.document.querySelectorAll('.waw .opcion.active, #waw-mute-indicator.active');
    activeButtons.forEach((btn) => this.renderer.removeClass(btn, WAW_CSS_CLASSES.ACTIVE));

    const readingMask = this.document.getElementById(WAW_DOM_IDS.READING_MASK);
    if (readingMask) {
      this.renderer.addClass(readingMask, WAW_CSS_CLASSES.HIDDEN);
    }

    const readingLine = this.document.getElementById(WAW_DOM_IDS.READING_LINE);
    if (readingLine) {
      this.renderer.addClass(readingLine, WAW_CSS_CLASSES.HIDDEN);
    }

    this.clearStoredStates();
    this.syncStates();
  }

  /**
   * Dispara una funcionalidad individual de WAW eliminando temporalmente 'inert' si el contenedor está cerrado.
   * Utiliza UN SOLO evento sintético 'click' con bubbles: true para evitar el efecto de doble rebote.
   */
  async clickFeatureButton(btnId: string): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) return;

    if (!this.isInitialized) {
      await this.init();
    }

    const widget = this.document.getElementById(WAW_DOM_IDS.WIDGET);
    const wasInert = widget ? widget.hasAttribute('inert') : false;

    // 1. Remover atributo 'inert' ANTES de ejecutar el clic para permitir despacho del evento
    if (widget && wasInert) {
      this.renderer.removeAttribute(widget, 'inert');
    }

    const btn = this.document.getElementById(btnId);
    if (btn) {
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
  async toggleQuickOption(optionKey: WawFeatureKey | string, event?: Event): Promise<void> {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    const targetBtnId =
      optionKey in WAW_FEATURE_MAP
        ? WAW_FEATURE_MAP[optionKey as WawFeatureKey]
        : optionKey;

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
