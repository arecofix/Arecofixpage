import {
  Component,
  inject,
  ElementRef,
  ViewChild,
  ChangeDetectionStrategy,
  AfterViewInit,
  effect,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TabService, TabInfo } from '@app/core/services/tab.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { InvoiceService } from '@app/features/sales/application/invoice.service';
import { OnInit, signal } from '@angular/core';

@Component({
  selector: 'app-admin-tab-bar',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './admin-tab-bar.component.html',
  styles: [
    `
      :host {
        display: block;
        width: 100%;
      }

      .tab-bar-container {
        touch-action: pan-x manipulation;
        -webkit-overflow-scrolling: touch;
        overscroll-behavior-x: contain;
      }

      .tab-item {
        touch-action: manipulation;
        -webkit-tap-highlight-color: transparent;
        user-select: none;
      }

      /* Hide scrollbar for a sleek appearance while keeping scroll functionality */
      .no-scrollbar::-webkit-scrollbar {
        display: none;
      }
      .no-scrollbar {
        -ms-overflow-style: none;
        scrollbar-width: none;
      }
    `,
  ],
})
export class AdminTabBarComponent implements AfterViewInit, OnInit {
  public tabService = inject(TabService);
  private router = inject(Router);
  private invoiceService = inject(InvoiceService, { optional: true });

  @ViewChild('tabsContainer') tabsContainerRef?: ElementRef<HTMLDivElement>;

  // Convert observable to signal for reactive performance
  tabs = toSignal(this.tabService.tabs$, { initialValue: [] as TabInfo[] });

  // Pending invoice drafts counter for badge display
  pendingDraftCount = signal<number>(0);

  // Touch tracking state to prevent conflicts between tapping and scrolling
  private touchStartX = 0;
  private touchStartY = 0;
  private touchStartTime = 0;
  private isSwiping = false;
  private touchHandled = false;

  constructor() {
    // When active tab changes, scroll it into view smoothly
    effect(() => {
      const activeTab = this.tabs().find((t) => t.active);
      if (activeTab) {
        // Run on next tick
        setTimeout(() => this.scrollActiveTabIntoView(), 60);
      }
    });
  }

  async ngOnInit(): Promise<void> {
    if (this.invoiceService) {
      try {
        const count = await this.invoiceService.getDraftCount();
        this.pendingDraftCount.set(count);
      } catch {
        // Ignore failure
      }
    }
  }

  ngAfterViewInit(): void {
    this.scrollActiveTabIntoView();
  }

  /**
   * TouchStart: Record starting position and time
   */
  onTouchStart(event: TouchEvent, tab: TabInfo): void {
    if (event.touches.length !== 1) return;
    const touch = event.touches[0];
    this.touchStartX = touch.clientX;
    this.touchStartY = touch.clientY;
    this.touchStartTime = Date.now();
    this.isSwiping = false;
    this.touchHandled = false;
  }

  /**
   * TouchMove: Check if the user is actually scrolling/swiping
   */
  onTouchMove(event: TouchEvent): void {
    if (event.touches.length !== 1) return;
    const touch = event.touches[0];
    const diffX = Math.abs(touch.clientX - this.touchStartX);
    const diffY = Math.abs(touch.clientY - this.touchStartY);

    // If movement exceeds threshold, this is a drag/scroll, not a tap
    if (diffX > 8 || diffY > 8) {
      this.isSwiping = true;
    }
  }

  /**
   * TouchEnd: If not swiping and duration is short, execute fast navigation
   */
  onTouchEnd(event: TouchEvent, tab: TabInfo): void {
    const elapsed = Date.now() - this.touchStartTime;

    // Check if it qualifies as an intentional tap
    if (!this.isSwiping && elapsed < 450) {
      this.touchHandled = true;
      event.preventDefault(); // Prevent 300ms delayed synthetic click
      this.navigateToTab(tab);

      // Reset touchHandled flag after a short grace period
      setTimeout(() => {
        this.touchHandled = false;
      }, 400);
    }
  }

  /**
   * Click handler for desktop mouse interactions
   */
  onTabClick(event: MouseEvent, tab: TabInfo): void {
    // Prevent synthetic click from firing twice if touch already handled it
    if (this.touchHandled) {
      event.preventDefault();
      return;
    }
    this.navigateToTab(tab);
  }

  /**
   * Navigate to the clicked/tapped tab
   */
  private navigateToTab(tab: TabInfo): void {
    if (!tab.active) {
      this.router.navigateByUrl(tab.url);
    }
  }

  /**
   * Close a specific tab
   */
  closeTab(index: number, event: Event): void {
    event.stopPropagation();
    event.preventDefault();
    this.tabService.closeTab(index);
  }

  /**
   * Close all tabs
   */
  closeAll(): void {
    this.tabService.closeAllTabs();
  }

  /**
   * Scroll active tab into visible container area
   */
  private scrollActiveTabIntoView(): void {
    const container = this.tabsContainerRef?.nativeElement;
    if (!container) return;

    const activeEl = container.querySelector<HTMLElement>(
      '[aria-selected="true"]'
    );
    if (activeEl && typeof activeEl.scrollIntoView === 'function') {
      activeEl.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center',
      });
    }
  }

  /**
   * Keyboard accessibility (WAI-ARIA tab navigation: Left/Right arrows)
   */
  onKeyDown(event: KeyboardEvent, currentIndex: number): void {
    const list = this.tabs();
    if (list.length === 0) return;

    let targetIndex = currentIndex;
    if (event.key === 'ArrowRight') {
      targetIndex = (currentIndex + 1) % list.length;
      event.preventDefault();
    } else if (event.key === 'ArrowLeft') {
      targetIndex = (currentIndex - 1 + list.length) % list.length;
      event.preventDefault();
    } else if (event.key === 'Home') {
      targetIndex = 0;
      event.preventDefault();
    } else if (event.key === 'End') {
      targetIndex = list.length - 1;
      event.preventDefault();
    } else {
      return;
    }

    const targetTab = list[targetIndex];
    if (targetTab) {
      this.navigateToTab(targetTab);
    }
  }

  /**
   * Manual scroll helpers for mobile arrows
   */
  scrollLeft(): void {
    const container = this.tabsContainerRef?.nativeElement;
    if (container && typeof container.scrollBy === 'function') {
      container.scrollBy({ left: -140, behavior: 'smooth' });
    }
  }

  scrollRight(): void {
    const container = this.tabsContainerRef?.nativeElement;
    if (container && typeof container.scrollBy === 'function') {
      container.scrollBy({ left: 140, behavior: 'smooth' });
    }
  }
}
