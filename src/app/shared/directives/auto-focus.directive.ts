import {
  Directive,
  ElementRef,
  Input,
  OnInit,
  OnDestroy,
  inject,
  PLATFORM_ID,
  NgZone,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Observable, Subscription, EMPTY } from 'rxjs';

/**
 * AutoFocusDirective — Declaratively focus an element.
 *
 * Usage:
 *   <input [appAutoFocus]="trigger$" />
 *
 * • On init: if `appAutoFocusImmediate` is true, focuses the element immediately.
 * • Reactively: whenever `trigger$` emits, focuses the element.
 *
 * This keeps DOM manipulation out of the component, following Angular best practices.
 */
@Directive({
  selector: '[appAutoFocus]',
  standalone: true,
})
export class AutoFocusDirective implements OnInit, OnDestroy {

  /** Observable that triggers focus on each emission. */
  @Input('appAutoFocus') focusTrigger$: Observable<void> = EMPTY;

  /** If true, focus the element as soon as the directive initialises. */
  @Input() appAutoFocusImmediate = false;

  private readonly el = inject(ElementRef<HTMLElement>);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly zone = inject(NgZone);
  private subscription?: Subscription;

  /** Small delay to ensure the element is rendered and visible before focusing. */
  private static readonly FOCUS_DELAY_MS = 80;

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    // Immediate focus on render (e.g. when the drawer opens with search already requested)
    if (this.appAutoFocusImmediate) {
      this.focusElement();
    }

    // Reactive focus from the trigger observable
    this.subscription = this.focusTrigger$.subscribe(() => this.focusElement());
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  /** Schedule focus with a micro-delay so Angular has time to render the host. */
  private focusElement(): void {
    this.zone.runOutsideAngular(() => {
      setTimeout(() => {
        this.el.nativeElement.focus({ preventScroll: false });
      }, AutoFocusDirective.FOCUS_DELAY_MS);
    });
  }
}
