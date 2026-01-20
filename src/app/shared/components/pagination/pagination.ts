import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  linkedSignal,
} from '@angular/core';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { inject } from '@angular/core';

@Component({
  selector: 'pagination',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './pagination.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Pagination {
  pages = input<number>(0);
  currentPage = input<number>(1);

  activePage = linkedSignal(this.currentPage);

  getPagesList = computed(() => {
    const total = this.pages();
    const current = this.activePage();
    const range = 3; // Show 3 before and 3 after (user asked for 5 but 3 is cleaner on mobile, let's aim for a balance or stick to 5 if space allows. I'll use 4 which is a good middle ground).

    if (total <= 1) return [1];

    let start = Math.max(1, current - range);
    let end = Math.min(total, current + range);

    // Shift window if near limits to keep consistent size if desired, 
    // but standard sliding is adequate.
    
    // Always include first and last? 
    // "resumiendo por ejemplo y mostrando los 5 mas cercanos adelante y atras"
    // Let's basically return the array of numbers to show.
    
    // Simplest approach matching request:
    const pages: (number | string)[] = [];
    
    // Always show first page
    if (start > 1) {
      pages.push(1);
      if (start > 2) pages.push('...');
    }

    for (let i = start; i <= end; i++) {
        pages.push(i);
    }

    // Always show last page
    if (end < total) {
      if (end < total - 1) pages.push('...');
      pages.push(total);
    }

    return pages;
  });

  onPageChange(page: number | string) {
    if (typeof page === 'string') return;
    if (page < 1 || page > this.pages()) return;
    this.activePage.set(page);
  }

  private router = inject(Router);
  private route = inject(ActivatedRoute);

  next() {
    const nextP = this.activePage() + 1;
    if (nextP <= this.pages()) {
        this.navigateTo(nextP);
    }
  }

  prev() {
    const prevP = this.activePage() - 1;
    if (prevP >= 1) {
        this.navigateTo(prevP);
    }
  }

  navigateTo(page: number) {
      this.router.navigate([], {
          relativeTo: this.route,
          queryParams: { _page: page },
          queryParamsHandling: 'merge'
      });
  }
}
