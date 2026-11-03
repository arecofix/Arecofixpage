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
});

