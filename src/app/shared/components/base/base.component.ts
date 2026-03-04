import { 
  Component, 
  OnInit, 
  OnDestroy, 
  ChangeDetectorRef, 
  ChangeDetectionStrategy,
  inject
} from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { StructuredLoggerService } from '@app/core/infrastructure/logging/structured-logger.service';

/**
 * Base component with proper lifecycle management
 * Implements common patterns to avoid memory leaks and ensure clean code
 */
@Component({
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export abstract class BaseComponent implements OnInit, OnDestroy {
  protected destroy$ = new Subject<void>();
  protected cdr = inject(ChangeDetectorRef);
  protected logger = inject(StructuredLoggerService);

  // Component metadata
  protected abstract readonly componentName: string;

  ngOnInit(): void {
    this.logger.logComponentLifecycle(this.componentName, 'init');
    this.onInit();
  }

  ngOnDestroy(): void {
    this.logger.logComponentLifecycle(this.componentName, 'destroy');
    this.onDestroy();
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Template methods for child components
  protected onInit(): void {
    // Override in child components
  }

  protected onDestroy(): void {
    // Override in child components
  }

  // Utility methods
  protected markForCheck(): void {
    this.cdr.markForCheck();
  }

  protected detectChanges(): void {
    this.cdr.detectChanges();
  }

  /**
   * Helper to automatically unsubscribe from observables
   */
  protected takeUntilDestroy<T>() {
    return takeUntil<T>(this.destroy$);
  }

  /**
   * Safe async operation with error handling
   */
  protected async safeAsync<T>(
    operation: () => Promise<T>,
    operationName: string,
    errorMessage?: string
  ): Promise<T | null> {
    const endTimer = this.logger.startTimer(this.componentName, operationName);
    
    try {
      const result = await operation();
      endTimer();
      return result;
    } catch (error) {
      this.logger.error(this.componentName, errorMessage || `${operationName} failed`, error as Error);
      endTimer();
      return null;
    }
  }

  /**
   * Log user actions consistently
   */
  protected logUserAction(action: string, details?: Record<string, unknown>): void {
    this.logger.logUserAction(`${this.componentName}:${action}`, details);
  }
}
