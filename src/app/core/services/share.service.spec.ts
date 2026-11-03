import { TestBed } from '@angular/core/testing';
import { PLATFORM_ID } from '@angular/core';
import { ShareService } from './share.service';

describe('ShareService', () => {
  let service: ShareService;

  describe('En entorno Navegador (Browser)', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [
          ShareService,
          { provide: PLATFORM_ID, useValue: 'browser' },
        ],
      });
      service = TestBed.inject(ShareService);
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('debe crearse correctamente', () => {
      expect(service).toBeTruthy();
    });

    it('debe detectar soporte de Web Share API cuando navigator.share está disponible', () => {
      const shareMock = jest.fn();
      Object.defineProperty(navigator, 'share', {
        value: shareMock,
        configurable: true,
        writable: true,
      });

      expect(service.canUseWebShare()).toBe(true);
    });

    it('share() debe invocar navigator.share si está disponible', async () => {
      const shareMock = jest.fn().mockResolvedValue(undefined);
      Object.defineProperty(navigator, 'share', {
        value: shareMock,
        configurable: true,
        writable: true,
      });

      const result = await service.share({
        title: 'Título de Prueba',
        text: 'Texto de Prueba',
        url: 'https://arecofix.com.ar/productos/123',
      });

      expect(shareMock).toHaveBeenCalledWith({
        title: 'Título de Prueba',
        text: 'Texto de Prueba',
        url: 'https://arecofix.com.ar/productos/123',
      });
      expect(result.success).toBe(true);
      expect(result.network).toBe('native');
    });

    it('shareToWhatsApp debe abrir la URL oficial con texto codificado', () => {
      const openSpy = jest.spyOn(window, 'open').mockImplementation(() => null);

      service.shareToWhatsApp('https://arecofix.com.ar/test', 'Mira esto');

      expect(openSpy).toHaveBeenCalledWith(
        expect.stringContaining('https://wa.me/?text='),
        '_blank',
        expect.stringContaining('noopener')
      );
    });

    it('shareToFacebook debe abrir la URL oficial de Facebook', () => {
      const openSpy = jest.spyOn(window, 'open').mockImplementation(() => null);

      service.shareToFacebook('https://arecofix.com.ar/test');

      expect(openSpy).toHaveBeenCalledWith(
        expect.stringContaining('https://www.facebook.com/sharer/sharer.php?u='),
        '_blank',
        expect.stringContaining('noopener')
      );
    });

    it('shareToX debe abrir la URL oficial de Twitter/X', () => {
      const openSpy = jest.spyOn(window, 'open').mockImplementation(() => null);

      service.shareToX('https://arecofix.com.ar/test', 'Mira este producto');

      expect(openSpy).toHaveBeenCalledWith(
        expect.stringContaining('https://twitter.com/intent/tweet?'),
        '_blank',
        expect.stringContaining('noopener')
      );
    });

    it('copyToClipboard debe usar navigator.clipboard si está disponible', async () => {
      const writeTextMock = jest.fn().mockResolvedValue(undefined);
      Object.defineProperty(navigator, 'clipboard', {
        value: { writeText: writeTextMock },
        configurable: true,
        writable: true,
      });

      const copied = await service.copyToClipboard('https://arecofix.com.ar/producto/1');

      expect(writeTextMock).toHaveBeenCalledWith('https://arecofix.com.ar/producto/1');
      expect(copied).toBe(true);
    });
  });

  describe('En entorno Servidor (SSR)', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [
          ShareService,
          { provide: PLATFORM_ID, useValue: 'server' },
        ],
      });
      service = TestBed.inject(ShareService);
    });

    it('canUseWebShare() debe retornar false en el servidor', () => {
      expect(service.canUseWebShare()).toBe(false);
    });

    it('copyToClipboard() debe retornar false sin arrojar error en el servidor', async () => {
      const result = await service.copyToClipboard('https://arecofix.com.ar');
      expect(result).toBe(false);
    });
  });
});

