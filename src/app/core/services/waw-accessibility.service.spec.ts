import { TestBed } from '@angular/core/testing';
import { PLATFORM_ID } from '@angular/core';
import { WawAccessibilityService } from './waw-accessibility.service';

jest.mock('waw-widget', () => {
  return {
    __esModule: true,
    default: jest.fn().mockImplementation(() => ({
      run: jest.fn(),
      open: jest.fn(),
      close: jest.fn(),
      resetFunctions: jest.fn(),
      widget_open: false,
    })),
  };
});

describe('WawAccessibilityService', () => {
  let service: WawAccessibilityService;

  describe('En entorno Navegador (Browser)', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [
          WawAccessibilityService,
          { provide: PLATFORM_ID, useValue: 'browser' },
        ],
      });
      service = TestBed.inject(WawAccessibilityService);
      localStorage.clear();
    });

    afterEach(() => {
      document.documentElement.className = '';
      const widget = document.getElementById('waw-widget');
      if (widget) widget.remove();
      const overlay = document.getElementById('waw-backdrop-overlay');
      if (overlay) overlay.remove();
      localStorage.clear();
    });

    it('debe crearse correctamente', () => {
      expect(service).toBeTruthy();
    });

    it('isOpen() debe retornar false cuando el widget no está en DOM o está cerrado', () => {
      expect(service.isOpen()).toBe(false);
    });

    it('close() no debe fallar si se llama antes de inicializar', () => {
      expect(() => service.close()).not.toThrow();
    });

    it('reset() no debe fallar si se llama antes de inicializar', () => {
      expect(() => service.reset()).not.toThrow();
    });

    it('debe inicializar WAW de forma lazy y ejecutar run()', async () => {
      await service.init();
      expect(service).toBeTruthy();
    });

    it('debe devolver el foco al elemento disparador al llamar close()', async () => {
      const triggerBtn = document.createElement('button');
      document.body.appendChild(triggerBtn);
      const focusSpy = jest.spyOn(triggerBtn, 'focus');

      await service.open(triggerBtn);
      service.close();

      expect(focusSpy).toHaveBeenCalled();
      document.body.removeChild(triggerBtn);
    });

    it('Multi-Source Reconciliation: debe detectar estado activo desde clases en <html>', async () => {
      await service.init();

      expect(service.isDyslexiaActive()).toBe(false);
      expect(service.isBigCursorActive()).toBe(false);

      // 1. Simular clase inyectada en <html>
      document.documentElement.classList.add('WAWDyslexicFont');
      document.documentElement.classList.add('WAWBigCursor');

      service.syncStates();

      expect(service.isDyslexiaActive()).toBe(true);
      expect(service.isBigCursorActive()).toBe(true);

      // 2. Limpiar
      document.documentElement.classList.remove('WAWDyslexicFont', 'WAWBigCursor');
      service.syncStates();

      expect(service.isDyslexiaActive()).toBe(false);
      expect(service.isBigCursorActive()).toBe(false);
    });

    it('Multi-Source Reconciliation: debe detectar estado activo desde clase .active en botones internos de WAW', async () => {
      await service.init();

      const widget = document.createElement('aside');
      widget.id = 'waw-widget';
      const btnDislexia = document.createElement('button');
      btnDislexia.id = 'btn-apto-dislexia';
      btnDislexia.className = 'opcion active';
      widget.appendChild(btnDislexia);
      document.body.appendChild(widget);

      service.syncStates();

      expect(service.isDyslexiaActive()).toBe(true);

      btnDislexia.classList.remove('active');
      service.syncStates();

      expect(service.isDyslexiaActive()).toBe(false);
      widget.remove();
    });

    it('Multi-Source Reconciliation: debe detectar estado activo desde localStorage ("wawStates")', async () => {
      await service.init();

      localStorage.setItem('wawStates', JSON.stringify({
        dyslexia_font: true,
        big_cursor: true,
        animations: false, // false significa detenido
        reading_line: true,
        reading_mask: true,
        voice_reading: true,
        sound: false, // false significa silenciado
      }));

      service.syncStates();

      expect(service.isDyslexiaActive()).toBe(true);
      expect(service.isBigCursorActive()).toBe(true);
      expect(service.isAnimationsStopped()).toBe(true);
      expect(service.isReadingLineActive()).toBe(true);
      expect(service.isReadingMaskActive()).toBe(true);
      expect(service.isScreenReaderActive()).toBe(true);
      expect(service.isMuted()).toBe(true);
    });

    it('Prevención de Doble Despacho (Anti-Flip-Flop): toggleQuickOption debe despachar un solo evento click sintético', async () => {
      await service.init();

      const widget = document.createElement('aside');
      widget.id = 'waw-widget';
      widget.setAttribute('inert', '');

      const btnDislexia = document.createElement('button');
      btnDislexia.id = 'btn-apto-dislexia';
      const dispatchSpy = jest.spyOn(btnDislexia, 'dispatchEvent');

      widget.appendChild(btnDislexia);
      document.body.appendChild(widget);

      expect(widget.hasAttribute('inert')).toBe(true);

      await service.toggleQuickOption('dyslexia');

      // Debe haberse despachado exactamente 1 vez para no revertir el toggle
      expect(dispatchSpy).toHaveBeenCalledTimes(1);
      const dispatchedEvent = dispatchSpy.mock.calls[0][0] as MouseEvent;
      expect(dispatchedEvent.type).toBe('click');
      expect(dispatchedEvent.bubbles).toBe(true);

      // Como el widget sigue cerrado, debe restaurar inert
      expect(widget.hasAttribute('inert')).toBe(true);

      widget.remove();
    });

    it('openFullWawPanel debe remover inert y añadir clase open', async () => {
      await service.init();

      const widget = document.createElement('aside');
      widget.id = 'waw-widget';
      widget.setAttribute('inert', '');
      document.body.appendChild(widget);

      await service.open();

      expect(widget.hasAttribute('inert')).toBe(false);
      expect(widget.classList.contains('open')).toBe(true);
      expect(service.isWawOpen()).toBe(true);

      widget.remove();
    });

    it('FASE 2: setupCloseButtonListener debe remover waw-panel-open, ocultar overlay y restaurar inert al hacer clic en #close-button', async () => {
      await service.init();

      const widget = document.createElement('aside');
      widget.id = 'waw-widget';
      widget.classList.add('open');

      const closeBtn = document.createElement('button');
      closeBtn.id = 'close-button';
      widget.appendChild(closeBtn);
      document.body.appendChild(widget);

      const overlay = document.createElement('div');
      overlay.id = 'waw-backdrop-overlay';
      overlay.classList.add('visible');
      document.body.appendChild(overlay);

      document.body.classList.add('waw-panel-open');
      service.isWawOpen.set(true);

      (service as any).setupCloseButtonListener();

      closeBtn.click();

      expect(document.body.classList.contains('waw-panel-open')).toBe(false);
      expect(overlay.classList.contains('visible')).toBe(false);
      expect(widget.hasAttribute('inert')).toBe(true);
      expect(service.isWawOpen()).toBe(false);

      widget.remove();
      overlay.remove();
    });

    it('reset() debe limpiar DOM, botones active, localStorage y restablecer Signals', async () => {
      await service.init();

      document.documentElement.classList.add('WAWDyslexicFont', 'WAWBigCursor');
      localStorage.setItem('wawStates', JSON.stringify({ dyslexia_font: true }));

      service.syncStates();
      expect(service.isDyslexiaActive()).toBe(true);

      service.reset();

      expect(document.documentElement.classList.contains('WAWDyslexicFont')).toBe(false);
      expect(document.documentElement.classList.contains('WAWBigCursor')).toBe(false);
      expect(service.isDyslexiaActive()).toBe(false);
      expect(service.isBigCursorActive()).toBe(false);
    });
  });

  describe('En entorno Servidor (SSR)', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [
          WawAccessibilityService,
          { provide: PLATFORM_ID, useValue: 'server' },
        ],
      });
      service = TestBed.inject(WawAccessibilityService);
    });

    it('init() no debe acceder a APIs del DOM ni arrojar error en el servidor', async () => {
      await expect(service.init()).resolves.toBeUndefined();
    });

    it('open() y close() deben ser seguros y no realizar operaciones en el servidor', async () => {
      await expect(service.open()).resolves.toBeUndefined();
      expect(() => service.close()).not.toThrow();
      expect(service.isOpen()).toBe(false);
    });

    it('toggleQuickOption() no debe arrojar error en el servidor', async () => {
      await expect(service.toggleQuickOption('dyslexia')).resolves.toBeUndefined();
    });
  });
});
