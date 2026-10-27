import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Footer } from './footer';
import { PreferencesService } from '../services/preferences.service';

describe('Footer Component', () => {
  let component: Footer;
  let fixture: ComponentFixture<Footer>;
  let mockPreferencesService: { toggleSidebar: jest.Mock };

  beforeEach(async () => {
    mockPreferencesService = {
      toggleSidebar: jest.fn()
    };

    await TestBed.configureTestingModule({
      imports: [Footer],
      providers: [
        provideRouter([]),
        { provide: PreferencesService, useValue: mockPreferencesService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Footer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the footer component', () => {
    expect(component).toBeTruthy();
  });

  it('should trigger accessibility menu', () => {
    const mockEvent = { preventDefault: jest.fn() } as unknown as Event;
    component.openAccessibilityMenu(mockEvent);

    expect(mockEvent.preventDefault).toHaveBeenCalled();
    expect(mockPreferencesService.toggleSidebar).toHaveBeenCalled();
  });
});
