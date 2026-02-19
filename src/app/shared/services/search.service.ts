import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject, Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

/**
 * SearchService — Decouples the Navbar search trigger from the Sidenav search input.
 *
 * Responsibilities:
 *  - Manage the raw search query string.
 *  - Emit a debounced & deduplicated search term for consumers.
 *  - Signal "open drawer and focus the search input" via a dedicated Subject.
 */
@Injectable({ providedIn: 'root' })
export class SearchService {

  // ── Private state ────────────────────────────────────
  private readonly querySubject = new BehaviorSubject<string>('');
  private readonly focusTrigger = new Subject<void>();

  /** Debounce window in milliseconds */
  private static readonly DEBOUNCE_MS = 300;

  // ── Public API ───────────────────────────────────────

  /** Raw, un-debounced query (useful for two-way binding in the template). */
  readonly query$ = this.querySubject.asObservable();

  /** Optimized stream: emits only after the user stops typing and the value changed. */
  readonly debouncedQuery$: Observable<string> = this.querySubject.pipe(
    debounceTime(SearchService.DEBOUNCE_MS),
    distinctUntilChanged(),
  );

  /** Fires when the navbar lupa icon is clicked → the drawer should open & focus. */
  readonly focusRequested$ = this.focusTrigger.asObservable();

  // ── Mutations ────────────────────────────────────────

  /** Update the search query (called from the input's ngModel or event). */
  updateQuery(value: string): void {
    this.querySubject.next(value);
  }

  /** Get the current query snapshot. */
  get currentQuery(): string {
    return this.querySubject.getValue();
  }

  /** Clear the search query. */
  clearQuery(): void {
    this.querySubject.next('');
  }

  /**
   * Request that the mobile drawer opens and the search input receives focus.
   * Called by the navbar search-icon button.
   */
  requestSearchFocus(): void {
    this.focusTrigger.next();
  }
}
