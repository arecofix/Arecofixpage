import {
  Component,
  Input,
  signal,
  inject,
  OnInit,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  RouterLink,
  RouterLinkActive,
  Router,
  NavigationEnd,
} from '@angular/router';
import { NavItem } from '@app/shared/models/navigation.model';
import {
  THEME_STYLES,
  VIEW_ALL_LABELS,
} from '@app/shared/models/navigation.data';
import { NavigationStateService } from '@app/core/services/navigation-state.service';
import { filter } from 'rxjs/operators';

/**
 * Recursive Nav Item
 *
 * Renders a single navigation item. If it has children,
 * renders an expandable accordion that can be toggled in-place
 * without page reload. Each child is rendered via self-reference
 * (<app-nav-item-recursive>), enabling unlimited nesting depth.
 */
@Component({
  selector: 'app-nav-item-recursive',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    NavItemRecursiveComponent,
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    @if (item.children && item.children.length > 0) {
      <!-- Accordion Header (toggle) -->
      <button
        (click)="isOpen.set(!isOpen())"
        class="flex items-center justify-between w-full py-2.5 pr-2 outline-none cursor-pointer
               hover:text-blue-500 dark:hover:text-blue-400 transition-colors select-none text-left rounded-xl px-3"
        [style.margin-left.px]="depth > 0 ? 8 : 0"
        [attr.aria-expanded]="isOpen()"
      >
        <span class="flex items-center gap-3 flex-1 font-medium text-sm">
          <span
            class="w-6 h-6 rounded-lg flex items-center justify-center text-xs"
            [ngClass]="getThemeBg(item.theme)"
          >
            <i [class]="item.icon" [ngClass]="getThemeAccent(item.theme)"></i>
          </span>
          {{ item.label }}
          @if (item.badge) {
            <span
              class="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-red-500/20 text-red-400"
            >
              {{ item.badge }}
            </span>
          }
        </span>
        <svg
          class="w-3.5 h-3.5 opacity-50 shrink-0 transition-transform duration-300 ease-out"
          [class.rotate-180]="isOpen()"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2.5"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      <!-- Accordion Body (children) -->
      @if (isOpen()) {
        <div
          class="border-l border-gray-200 dark:border-white/10 ml-5 mt-0.5 mb-1 space-y-0.5
                    animate-accordion-open"
        >
          @if (item.path) {
            <a
              [routerLink]="item.path"
              (click)="closeMobileMenu()"
              routerLinkActive="bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-semibold shadow-sm"
              [routerLinkActiveOptions]="{ exact: true }"
              class="flex items-center gap-3 py-2 text-sm hover:text-blue-500
                      transition-all text-gray-500 dark:text-gray-400 rounded-xl px-3"
            >
              <i class="fas fa-arrow-right text-[10px] opacity-40"></i>
              {{ getViewAllLabel(item.id, item.label) }}
            </a>
          }
          @for (child of item.children; track child.id) {
            <app-nav-item-recursive [item]="child" [depth]="depth + 1" />
          }
        </div>
      }
    } @else {
      <!-- Leaf item (no children) → simple link -->
      <a
        [routerLink]="item.path"
        (click)="closeMobileMenu()"
        routerLinkActive="bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-semibold shadow-sm"
        [routerLinkActiveOptions]="{ exact: true }"
        class="flex items-center gap-3 py-2.5 text-sm hover:text-blue-500 transition-all font-medium rounded-xl px-3"
        [style.margin-left.px]="depth > 0 ? 8 : 0"
        [attr.target]="item.external ? '_blank' : null"
      >
        <span
          class="w-6 h-6 rounded-lg flex items-center justify-center text-xs"
          [ngClass]="getThemeBg(item.theme)"
        >
          <i [class]="item.icon" [ngClass]="getThemeAccent(item.theme)"></i>
        </span>
        {{ item.label }}
        @if (item.badge) {
          <span
            class="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-red-500/20 text-red-400"
          >
            {{ item.badge }}
          </span>
        }
      </a>
    }
  `,
})
export class NavItemRecursiveComponent implements OnInit {
  @Input({ required: true }) item!: NavItem;
  @Input() depth = 0;

  /** Controls accordion open/close state */
  readonly isOpen = signal(false);

  public navState = inject(NavigationStateService);
  private router = inject(Router);

  ngOnInit() {
    this.checkActiveState();

    // Auto expand accordion if any child becomes active on route changes
    this.router.events
      .pipe(
        filter(
          (event): event is NavigationEnd => event instanceof NavigationEnd,
        ),
      )
      .subscribe(() => {
        this.checkActiveState();
      });
  }

  closeMobileMenu() {
    this.navState.closeMobileMenu();
  }

  private checkActiveState() {
    if (this.hasActiveChild(this.item)) {
      this.isOpen.set(true);
    }
  }

  private hasActiveChild(item: NavItem): boolean {
    if (!item.children || item.children.length === 0) {
      return false;
    }
    return item.children.some((child) => {
      if (
        child.path &&
        this.router.isActive(child.path, {
          paths: 'subset',
          queryParams: 'ignored',
          fragment: 'ignored',
          matrixParams: 'ignored',
        })
      ) {
        return true;
      }
      return this.hasActiveChild(child);
    });
  }

  getThemeBg(theme: string): string {
    return THEME_STYLES[theme]?.bg ?? THEME_STYLES['general'].bg;
  }

  getThemeAccent(theme: string): string {
    return THEME_STYLES[theme]?.accent ?? THEME_STYLES['general'].accent;
  }

  /** Context-aware "Ver todo" label */
  getViewAllLabel(itemId: string, itemLabel: string): string {
    return VIEW_ALL_LABELS[itemId] ?? `Ver todo ${itemLabel}`;
  }
}
