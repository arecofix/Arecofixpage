import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AccessibilitySidebarComponent } from './accessibility-sidebar.component';
import { PreferencesService } from '../../services/preferences.service';
import { WawAccessibilityService } from '@app/core/services/waw-accessibility.service';
import { signal } from '@angular/core';

describe('AccessibilitySidebarComponent', () => {
  let component: AccessibilitySidebarComponent;
  let fixture: ComponentFixture<AccessibilitySidebarComponent>;

  let mockPreferencesService: {
    sidebarOpen$: any;
    language$: any;
    theme$: any;
    fontSize$: any;
    backgroundOptions: any[];
    closeSidebar: jest.Mock;
    toggleSidebar: jest.Mock;
    setLanguage: jest.Mock;
    setTheme: jest.Mock;
    increaseFontSize: jest.Mock;
    decreaseFontSize: jest.Mock;
    resetPreferences: jest.Mock;
  };

  let mockWawService: {
    isWawOpen: any;
    isDyslexiaActive: any;
    isBigCursorActive: any;
    isReadingLineActive: any;
    isReadingMaskActive: any;
    isScreenReaderActive: any;
    isAnimationsStopped: any;
    openFullWawPanel: jest.Mock;
    toggleQuickOption: jest.Mock;
    toggleDyslexia: jest.Mock;
    toggleReadingLine: jest.Mock;
    toggleReadingMask: jest.Mock;
    toggleBigCursor: jest.Mock;
    toggleScreenReader: jest.Mock;
    toggleStopAnimations: jest.Mock;
    reset: jest.Mock;
  };

  const { of } = require('rxjs');

  beforeEach(async () => {
    mockPreferencesService = {
      sidebarOpen$: of(false),
      language$: of('es'),
      theme$: of('gradient-5'),
      fontSize$: of(16),
      backgroundOptions: [
        { id: 'light', name: 'Claro', class: 'bg-white' },
        { id: 'dark', name: 'Oscuro', class: 'bg-black' },
      ],
      closeSidebar: jest.fn(),
      toggleSidebar: jest.fn(),
      setLanguage: jest.fn(),
      setTheme: jest.fn(),
      increaseFontSize: jest.fn(),
      decreaseFontSize: jest.fn(),
      resetPreferences: jest.fn(),
    };

    mockWawService = {
      isWawOpen: signal(false),
      isDyslexiaActive: signal(false),
      isBigCursorActive: signal(false),
      isReadingLineActive: signal(false),
      isReadingMaskActive: signal(false),
      isScreenReaderActive: signal(false),
      isAnimationsStopped: signal(false),
      openFullWawPanel: jest.fn().mockResolvedValue(undefined),
      toggleQuickOption: jest.fn().mockResolvedValue(undefined),
      toggleDyslexia: jest.fn().mockResolvedValue(undefined),
      toggleReadingLine: jest.fn().mockResolvedValue(undefined),
      toggleReadingMask: jest.fn().mockResolvedValue(undefined),
      toggleBigCursor: jest.fn().mockResolvedValue(undefined),
      toggleScreenReader: jest.fn().mockResolvedValue(undefined),
      toggleStopAnimations: jest.fn().mockResolvedValue(undefined),
      reset: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [AccessibilitySidebarComponent],
      providers: [
        { provide: PreferencesService, useValue: mockPreferencesService },
        { provide: WawAccessibilityService, useValue: mockWawService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AccessibilitySidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe crearse correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('debe derivar señales reactivas desde PreferencesService', () => {
    expect(component.sidebarOpen()).toBe(false);
    expect(component.language()).toBe('es');
    expect(component.theme()).toBe('gradient-5');
    expect(component.fontSize()).toBe(16);
  });

  it('openFullWawPanel debe cerrar el sidebar y delegar en wawService.openFullWawPanel', async () => {
    const mockEvent = new MouseEvent('click');
    const stopSpy = jest.spyOn(mockEvent, 'stopPropagation');
    const prevSpy = jest.spyOn(mockEvent, 'preventDefault');

    await component.openFullWawPanel(mockEvent);

    expect(prevSpy).toHaveBeenCalled();
    expect(stopSpy).toHaveBeenCalled();
    expect(mockPreferencesService.closeSidebar).toHaveBeenCalled();
    expect(mockWawService.openFullWawPanel).toHaveBeenCalledWith(undefined, mockEvent);
  });

  it('toggleDyslexia debe delegar en wawService.toggleDyslexia', async () => {
    await component.toggleDyslexia();
    expect(mockWawService.toggleDyslexia).toHaveBeenCalled();
  });

  it('toggleBigCursor debe delegar en wawService.toggleBigCursor', async () => {
    await component.toggleBigCursor();
    expect(mockWawService.toggleBigCursor).toHaveBeenCalled();
  });

  it('toggleReadingLine debe delegar en wawService.toggleReadingLine', async () => {
    await component.toggleReadingLine();
    expect(mockWawService.toggleReadingLine).toHaveBeenCalled();
  });

  it('toggleReadingMask debe delegar en wawService.toggleReadingMask', async () => {
    await component.toggleReadingMask();
    expect(mockWawService.toggleReadingMask).toHaveBeenCalled();
  });

  it('toggleScreenReader debe delegar en wawService.toggleScreenReader', async () => {
    await component.toggleScreenReader();
    expect(mockWawService.toggleScreenReader).toHaveBeenCalled();
  });

  it('toggleStopAnimations debe delegar en wawService.toggleStopAnimations', async () => {
    await component.toggleStopAnimations();
    expect(mockWawService.toggleStopAnimations).toHaveBeenCalled();
  });

  it('resetAll debe reiniciar tanto PreferencesService como WawAccessibilityService', () => {
    component.resetAll();
    expect(mockPreferencesService.resetPreferences).toHaveBeenCalled();
    expect(mockWawService.reset).toHaveBeenCalled();
  });
});

