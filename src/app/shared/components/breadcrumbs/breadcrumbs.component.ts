import { Component, Input } from '@angular/core';

import { RouterModule } from '@angular/router';

export interface BreadcrumbItem {
  label: string;
  url?: string;
}

@Component({
  selector: 'app-breadcrumbs',
  standalone: true,
  imports: [RouterModule],
  template: `
    <nav aria-label="Breadcrumb" class="container mx-auto px-4 py-4">
      <ol class="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
        @for (item of items; track item; let last = $last) {
          <li class="flex items-center">
            @if (!last) {
              <a [routerLink]="item.url" class="hover:text-primary transition-colors hover:underline">
                {{ item.label }}
              </a>
              <i class="fas fa-chevron-right text-xs mx-2 opacity-50"></i>
            } @else {
              <span class="font-semibold text-gray-900 dark:text-gray-200" aria-current="page">
                {{ item.label }}
              </span>
            }
          </li>
        }
      </ol>
    </nav>
    `,
  styles: []
})
export class BreadcrumbsComponent {
  @Input() items: BreadcrumbItem[] = [];
}
