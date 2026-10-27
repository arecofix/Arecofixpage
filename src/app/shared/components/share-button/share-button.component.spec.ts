import { ComponentFixture, TestBed, fakeAsync, tick, flushMicrotasks } from '@angular/core/testing';
import { ShareButtonComponent } from './share-button.component';
import { ToastService } from '../../services/toast.service';

describe('ShareButtonComponent', () => {
  let component: ShareButtonComponent;
  let fixture: ComponentFixture<ShareButtonComponent>;
  let mockToastService: { show: jest.Mock };

  beforeEach(async () => {
    mockToastService = {
      show: jest.fn()
    };

    await TestBed.configureTestingModule({
      imports: [ShareButtonComponent],
      providers: [
        { provide: ToastService, useValue: mockToastService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ShareButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should use navigator.share when available and emit success', async () => {
    const mockShare = jest.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'share', {
      value: mockShare,
      configurable: true
    });

    component.title = 'Servicio de Reparación';
    component.text = 'Reparación de placas';
    component.url = 'https://arecofix.com.ar/servicios/reparacion';

    const sharedSpy = jest.spyOn(component.shared, 'emit');

    await component.share();

    expect(mockShare).toHaveBeenCalledWith({
      title: 'Servicio de Reparación',
      text: 'Reparación de placas',
      url: 'https://arecofix.com.ar/servicios/reparacion'
    });
    expect(sharedSpy).toHaveBeenCalledWith({ method: 'native', success: true });
  });

  it('should fallback to clipboard when navigator.share is undefined', async () => {
    jest.useFakeTimers();
    Object.defineProperty(navigator, 'share', {
      value: undefined,
      configurable: true
    });

    const mockWriteText = jest.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: mockWriteText },
      configurable: true
    });

    component.url = 'https://arecofix.com.ar/productos/modulo-samsung';
    const sharedSpy = jest.spyOn(component.shared, 'emit');

    await component.share();

    expect(mockWriteText).toHaveBeenCalledWith('https://arecofix.com.ar/productos/modulo-samsung');
    expect(mockToastService.show).toHaveBeenCalledWith('Enlace copiado al portapapeles', 'success');
    expect(sharedSpy).toHaveBeenCalledWith({ method: 'clipboard', success: true });
    expect(component.copied()).toBe(true);

    jest.advanceTimersByTime(2600);
    expect(component.copied()).toBe(false);
    jest.useRealTimers();
  });

  it('should silently handle AbortError when user dismisses the native share sheet', async () => {
    const abortError = new Error('Share canceled');
    abortError.name = 'AbortError';

    const mockShare = jest.fn().mockRejectedValue(abortError);
    Object.defineProperty(navigator, 'share', {
      value: mockShare,
      configurable: true
    });

    const sharedSpy = jest.spyOn(component.shared, 'emit');

    await component.share();

    expect(mockShare).toHaveBeenCalled();
    expect(sharedSpy).not.toHaveBeenCalled();
    expect(mockToastService.show).not.toHaveBeenCalled();
  });
});
