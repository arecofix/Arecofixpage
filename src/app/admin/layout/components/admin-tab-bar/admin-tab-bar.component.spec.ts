import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminTabBarComponent } from './admin-tab-bar.component';
import { TabService, TabInfo } from '@app/core/services/tab.service';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { InvoiceService } from '@app/features/sales/application/invoice.service';

describe('AdminTabBarComponent', () => {
  let component: AdminTabBarComponent;
  let fixture: ComponentFixture<AdminTabBarComponent>;
  let mockRouter: { navigateByUrl: jest.Mock };
  let mockTabs$: BehaviorSubject<TabInfo[]>;
  let mockTabService: { tabs$: BehaviorSubject<TabInfo[]>; closeTab: jest.Mock; closeAllTabs: jest.Mock };

  beforeEach(async () => {
    mockTabs$ = new BehaviorSubject<TabInfo[]>([
      { title: 'Dashboard', url: '/admin/dashboard', active: true },
      { title: 'Ventas', url: '/admin/sales', active: false },
      { title: 'Facturación', url: '/admin/sales/invoices', active: false },
    ]);

    mockTabService = {
      tabs$: mockTabs$,
      closeTab: jest.fn(),
      closeAllTabs: jest.fn(),
    };

    mockRouter = {
      navigateByUrl: jest.fn(),
    };

    const mockInvoiceService = {
      getDraftCount: jest.fn().mockResolvedValue(0),
    };

    await TestBed.configureTestingModule({
      imports: [AdminTabBarComponent],
      providers: [
        { provide: TabService, useValue: mockTabService },
        { provide: Router, useValue: mockRouter },
        { provide: InvoiceService, useValue: mockInvoiceService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminTabBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should render all open tabs with role="tab" and aria-selected', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const tabButtons = compiled.querySelectorAll('[role="tab"]');
    expect(tabButtons.length).toBe(3);

    expect(tabButtons[0].getAttribute('aria-selected')).toBe('true');
    expect(tabButtons[1].getAttribute('aria-selected')).toBe('false');
    expect(tabButtons[2].getAttribute('aria-selected')).toBe('false');
  });

  it('should navigate to inactive tab on click', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const secondTab = compiled.querySelectorAll<HTMLButtonElement>('[role="tab"]')[1];

    secondTab.click();
    expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/admin/sales');
  });

  it('should handle clean tap on mobile touch events (touchstart + touchend without moving)', () => {
    const tab = { title: 'Facturación', url: '/admin/sales/invoices', active: false };

    // Simular touchstart
    const touchStartEvt = {
      touches: [{ clientX: 100, clientY: 100 }],
    } as unknown as TouchEvent;
    component.onTouchStart(touchStartEvt, tab);

    // Simular touchend inmediato (tap)
    const preventDefaultSpy = jest.fn();
    const touchEndEvt = {
      preventDefault: preventDefaultSpy,
    } as unknown as TouchEvent;
    component.onTouchEnd(touchEndEvt, tab);

    expect(preventDefaultSpy).toHaveBeenCalled();
    expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/admin/sales/invoices');
  });

  it('should NOT navigate on swipe/drag movement exceeding 8px threshold', () => {
    const tab = { title: 'Facturación', url: '/admin/sales/invoices', active: false };

    // Simular touchstart
    component.onTouchStart({
      touches: [{ clientX: 100, clientY: 100 }],
    } as unknown as TouchEvent, tab);

    // Simular swipe / scroll
    component.onTouchMove({
      touches: [{ clientX: 150, clientY: 100 }], // diffX = 50px
    } as unknown as TouchEvent);

    // Simular touchend tras swipe
    const preventDefaultSpy = jest.fn();
    component.onTouchEnd({
      preventDefault: preventDefaultSpy,
    } as unknown as TouchEvent, tab);

    // No debe navegar porque era un swipe/scroll
    expect(preventDefaultSpy).not.toHaveBeenCalled();
    expect(mockRouter.navigateByUrl).not.toHaveBeenCalled();
  });

  it('should delegate tab closure to TabService', () => {
    const stopPropagation = jest.fn();
    const preventDefault = jest.fn();
    const mockEvt = { stopPropagation, preventDefault } as unknown as Event;

    component.closeTab(1, mockEvt);

    expect(stopPropagation).toHaveBeenCalled();
    expect(preventDefault).toHaveBeenCalled();
    expect(mockTabService.closeTab).toHaveBeenCalledWith(1);
  });

  it('should display pending draft badge when pendingDraftCount > 0 on Facturación tab', () => {
    component.pendingDraftCount.set(3);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const badge = compiled.querySelector('#tab-pending-drafts-badge');

    expect(badge).toBeTruthy();
    expect(badge?.textContent?.trim()).toBe('3');
  });
});
