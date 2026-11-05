import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PLATFORM_ID } from '@angular/core';
import { ShareButtonsComponent } from './share-buttons.component';
import { ShareService } from '@app/core/services/share.service';
import { ToastService } from '@app/shared/services/toast.service';

describe('ShareButtonsComponent', () => {
  let component: ShareButtonsComponent;
  let fixture: ComponentFixture<ShareButtonsComponent>;
  let mockShareService: any;
  let mockToastService: any;

  beforeEach(async () => {
    mockShareService = {
      canUseWebShare: jest.fn().mockReturnValue(false),
      share: jest.fn().mockResolvedValue({ network: 'native', url: 'https://test.com', success: true }),
      shareToWhatsApp: jest.fn(),
      shareToFacebook: jest.fn(),
      shareToX: jest.fn(),
      shareToLinkedIn: jest.fn(),
      shareToTelegram: jest.fn(),
      shareByEmail: jest.fn(),
      copyToClipboard: jest.fn().mockResolvedValue(true),
    };

    mockToastService = {
      show: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [ShareButtonsComponent],
      providers: [
        { provide: ShareService, useValue: mockShareService },
        { provide: ToastService, useValue: mockToastService },
        { provide: PLATFORM_ID, useValue: 'browser' },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ShareButtonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe crearse correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('debe renderizar la lista de redes activas en variante inline por defecto', () => {
    const buttons = fixture.nativeElement.querySelectorAll('button');
    expect(buttons.length).toBe(component.networks.length);
  });

  it('al hacer clic en WhatsApp debe invocar shareService.shareToWhatsApp y emitir shared', () => {
    const sharedSpy = jest.spyOn(component.shared, 'emit');
    component.url = 'https://arecofix.com.ar/test';
    component.title = 'Producto Test';

    component.onShareNetwork('whatsapp');

    expect(mockShareService.shareToWhatsApp).toHaveBeenCalledWith('https://arecofix.com.ar/test', 'Producto Test');
    expect(sharedSpy).toHaveBeenCalledWith({
      network: 'whatsapp',
      url: 'https://arecofix.com.ar/test',
    });
  });

  it('al hacer clic en Facebook debe invocar shareService.shareToFacebook', () => {
    component.url = 'https://arecofix.com.ar/test';

    component.onShareNetwork('facebook');

    expect(mockShareService.shareToFacebook).toHaveBeenCalledWith('https://arecofix.com.ar/test');
  });

  it('al hacer clic en Copiar debe llamar a copyToClipboard, mostrar toast y activar el estado copiado', async () => {
    component.url = 'https://arecofix.com.ar/test';

    await component.onShareNetwork('copy');

    expect(mockShareService.copyToClipboard).toHaveBeenCalledWith('https://arecofix.com.ar/test');
    expect(component.copied()).toBe(true);
    expect(mockToastService.show).toHaveBeenCalledWith('¡Enlace copiado al portapapeles!', 'success');
  });

  it('en variante menu, debe alternar isMenuOpen al hacer clic', () => {
    component.variant = 'menu';
    fixture.detectChanges();

    expect(component.isMenuOpen()).toBe(false);

    component.triggerNativeOrMenu();
    expect(component.isMenuOpen()).toBe(true);

    component.closeMenu();
    expect(component.isMenuOpen()).toBe(false);
  });

  it('debe cerrar el menú al presionar la tecla Escape', () => {
    component.variant = 'menu';
    component.isMenuOpen.set(true);
    fixture.detectChanges();

    const escapeEvent = new KeyboardEvent('keydown', { key: 'Escape' });
    component.onEscapeKey(escapeEvent);

    expect(component.isMenuOpen()).toBe(false);
  });

  it('en variante static o floating no debe tener clases fixed o sticky', () => {
    fixture.componentRef.setInput('variant', 'static');
    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;
    const fixedOrStickyElements = element.querySelectorAll('.fixed, .sticky');
    expect(fixedOrStickyElements.length).toBe(0);
  });

  it('el botón disparador en variante static debe tener aria-label y title "Compartir esta página"', () => {
    fixture.componentRef.setInput('variant', 'static');
    fixture.detectChanges();

    const triggerBtn = fixture.nativeElement.querySelector('button[aria-label="Compartir esta página"]');
    expect(triggerBtn).toBeTruthy();
    expect(triggerBtn.getAttribute('title')).toBe('Compartir esta página');
    expect(triggerBtn.getAttribute('aria-expanded')).toBe('false');
  });

  it('en variante static despliega el menú absoluto hacia arriba y responde a Escape', async () => {
    fixture.componentRef.setInput('variant', 'static');
    fixture.detectChanges();

    expect(component.isMenuOpen()).toBe(false);

    await component.triggerNativeOrMenu();
    fixture.detectChanges();
    expect(component.isMenuOpen()).toBe(true);

    const menu = fixture.nativeElement.querySelector('div[role="menu"]');
    expect(menu).toBeTruthy();
    expect(menu.classList.contains('absolute')).toBe(true);
    expect(menu.classList.contains('fixed')).toBe(false);

    const netButtons = fixture.nativeElement.querySelectorAll('div[role="menu"] button');
    expect(netButtons.length).toBe(component.networks.length);

    // Escape cierra el menú
    const escapeEvent = new KeyboardEvent('keydown', { key: 'Escape' });
    component.onEscapeKey(escapeEvent);
    fixture.detectChanges();
    expect(component.isMenuOpen()).toBe(false);
  });

  describe('variante discreet (para páginas de detalle de producto)', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('variant', 'discreet');
      fixture.detectChanges();
    });

    it('no debe tener clases fixed ni sticky', () => {
      const element = fixture.nativeElement as HTMLElement;
      const fixedOrStickyElements = element.querySelectorAll('.fixed, .sticky');
      expect(fixedOrStickyElements.length).toBe(0);
    });

    it('debe renderizar un botón discreto con ícono y texto Compartir', () => {
      const triggerBtn = fixture.nativeElement.querySelector('button');
      expect(triggerBtn).toBeTruthy();
      expect(triggerBtn.textContent).toContain('Compartir');
      expect(triggerBtn.getAttribute('aria-label')).toBe('Compartir este producto');
      expect(triggerBtn.getAttribute('title')).toBe('Compartir este producto');
    });

    it('al hacer clic despliega el menú absoluto hacia abajo y lista las redes', async () => {
      expect(component.isMenuOpen()).toBe(false);

      await component.triggerNativeOrMenu();
      fixture.detectChanges();
      expect(component.isMenuOpen()).toBe(true);

      const menu = fixture.nativeElement.querySelector('div[role="menu"]');
      expect(menu).toBeTruthy();
      expect(menu.classList.contains('absolute')).toBe(true);
      expect(menu.classList.contains('top-full')).toBe(true);
      expect(menu.classList.contains('fixed')).toBe(false);

      const netButtons = fixture.nativeElement.querySelectorAll('div[role="menu"] button');
      expect(netButtons.length).toBe(component.networks.length);
    });

    it('al seleccionar una red en discreet emite shared y cierra el menú', async () => {
      const sharedSpy = jest.spyOn(component.shared, 'emit');
      component.url = 'https://arecofix.com.ar/productos/1';
      component.title = 'Módulo iPhone';

      await component.triggerNativeOrMenu();
      fixture.detectChanges();
      expect(component.isMenuOpen()).toBe(true);

      await component.onShareNetwork('whatsapp');
      fixture.detectChanges();

      expect(mockShareService.shareToWhatsApp).toHaveBeenCalled();
      expect(sharedSpy).toHaveBeenCalled();
      expect(component.isMenuOpen()).toBe(false);
    });

    it('cierra el menú con la tecla Escape', async () => {
      await component.triggerNativeOrMenu();
      fixture.detectChanges();
      expect(component.isMenuOpen()).toBe(true);

      const escapeEvent = new KeyboardEvent('keydown', { key: 'Escape' });
      component.onEscapeKey(escapeEvent);
      fixture.detectChanges();
      expect(component.isMenuOpen()).toBe(false);
    });
  });
});


