import { TestBed } from '@angular/core/testing';
import { PLATFORM_ID } from '@angular/core';
import { PreferencesService } from './preferences.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';

describe('PreferencesService', () => {
  let service: PreferencesService;

  beforeEach(() => {
    const mockRouter = {
      events: of(),
      url: '/',
    };

    TestBed.configureTestingModule({
      providers: [
        PreferencesService,
        { provide: PLATFORM_ID, useValue: 'browser' },
        { provide: Router, useValue: mockRouter },
      ],
    });

    localStorage.clear();
    service = TestBed.inject(PreferencesService);
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('debe crearse correctamente', () => {
    expect(service).toBeTruthy();
  });

  it('resetPreferences() debe restablecer tamaño a 16, tema a system y contraste a false', () => {
    // Modificar valores
    service.increaseFontSize(); // 18
    service.toggleHighContrast(); // true
    service.setTheme('gradient-5');

    // Resetear
    service.resetPreferences();

    let fontSize = 0;
    service.fontSize$.subscribe(size => fontSize = size);
    expect(fontSize).toBe(16);

    let contrast = true;
    service.highContrast$.subscribe(val => contrast = val);
    expect(contrast).toBe(false);

    let theme = '';
    service.theme$.subscribe(t => theme = t);
    expect(theme).toBe('system');
  });
});

