import { Component, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NavItem } from '@app/shared/models/navigation.model';
import { THEME_STYLES, VIEW_ALL_LABELS } from '@app/shared/models/navigation.data';

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
  imports: [CommonModule, RouterLink, RouterLinkActive, NavItemRecursiveComponent],
  template: `
    @if (item.children && item.children.length > 0) {
      <!-- Accordion Header (toggle) -->
      <button
        (click)="isOpen.set(!isOpen())"
        class="flex items-center justify-between w-full py-2.5 pr-2 outline-none cursor-pointer
               hover:text-blue-500 transition-colors select-none text-left"
        [style.padding-left.px]="depth * 16"
        [attr.aria-expanded]="isOpen()"
      >
        <span class="flex items-center gap-3 flex-1 font-medium text-sm">
          <span class="w-6 h-6 rounded-lg flex items-center justify-center text-xs"
                [ngClass]="getThemeBg(item.theme)">
            <i [class]="item.icon" [ngClass]="getThemeAccent(item.theme)"></i>
          </span>
          {{ item.label }}
          @if (item.badge) {
            <span class="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-red-500/20 text-red-400">
              {{ item.badge }}
            </span>
          }
        </span>
        <svg class="w-3.5 h-3.5 opacity-50 shrink-0 transition-transform duration-300 ease-out"
             [class.rotate-180]="isOpen()"
             fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <!-- Accordion Body (children) -->
      @if (isOpen()) {
        <div class="border-l border-gray-200 dark:border-white/10 ml-5 mt-0.5 mb-1 space-y-0.5
                    animate-accordion-open">
          @if (item.path) {
            <a [routerLink]="item.path"
               routerLinkActive="text-blue-500 font-bold"
               [routerLinkActiveOptions]="{exact: true}"
               class="flex items-center gap-3 py-2 pl-4 text-sm hover:text-blue-500
                      transition-colors text-gray-500 dark:text-gray-400">
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
      <a [routerLink]="item.path"
         routerLinkActive="text-blue-500 font-bold"
         [routerLinkActiveOptions]="{exact: true}"
         class="flex items-center gap-3 py-2.5 text-sm hover:text-blue-500 transition-colors font-medium"
         [style.padding-left.px]="depth * 16"
         [attr.target]="item.external ? '_blank' : null">
        <span class="w-6 h-6 rounded-lg flex items-center justify-center text-xs"
              [ngClass]="getThemeBg(item.theme)">
          <i [class]="item.icon" [ngClass]="getThemeAccent(item.theme)"></i>
        </span>
        {{ item.label }}
        @if (item.badge) {
          <span class="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-red-500/20 text-red-400">
            {{ item.badge }}
          </span>
        }
      </a>
    }
  `,
})
export class NavItemRecursiveComponent {
  @Input({ required: true }) item!: NavItem;
  @Input() depth = 0;

  /** Controls accordion open/close state */
  readonly isOpen = signal(false);

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
