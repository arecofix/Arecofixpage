import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

export interface BreadcrumbItem {
  label: string;
  url?: string;
}

@Component({
  selector: 'app-breadcrumbs',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <nav aria-label="Breadcrumb" class="container mx-auto px-4 py-4">
      <ol class="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
        <li *ngFor="let item of items; let last = last" class="flex items-center">
          <ng-container *ngIf="!last; else lastItem">
            <a [routerLink]="item.url" class="hover:text-primary transition-colors hover:underline">
              {{ item.label }}
            </a>
            <i class="fas fa-chevron-right text-xs mx-2 opacity-50"></i>
          </ng-container>
          <ng-template #lastItem>
            <span class="font-semibold text-gray-900 dark:text-gray-200" aria-current="page">
              {{ item.label }}
            </span>
          </ng-template>
        </li>
      </ol>
    </nav>
  `,
  styles: []
})
export class BreadcrumbsComponent {
  @Input() items: BreadcrumbItem[] = [];
}
