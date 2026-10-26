import { Directive, ElementRef, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { NgControl } from '@angular/forms';

/**
 * HydrationPreserveDirective
 *
 * Prevents loss of keystrokes during Angular SSR hydration and zoneless change detection.
 * 1. Preserves DOM input values entered before or during hydration.
 * 2. Prevents DefaultValueAccessor from overwriting in-flight typed characters with '' upon initial control binding.
 */
@Directive({
  selector: 'input:not([type="checkbox"]):not([type="radio"])[formControlName], input:not([type="checkbox"]):not([type="radio"])[formControl], textarea[formControlName], textarea[formControl]',
  standalone: true,
})
export class HydrationPreserveDirective implements OnInit {
  private el = inject(ElementRef<HTMLInputElement | HTMLTextAreaElement>);
  private ngControl = inject(NgControl, { optional: true });
  private platformId = inject(PLATFORM_ID);

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const nativeInput = this.el.nativeElement;
    if (nativeInput.type === 'checkbox' || nativeInput.type === 'radio') {
      return;
    }

    const control = this.ngControl?.control;

    // 1. If DOM element already has a value upon hydration, sync to control
    if (nativeInput && nativeInput.value && control && !control.value) {
      control.setValue(nativeInput.value, { emitEvent: false });
    }

    // 2. Intercept ControlValueAccessor writeValue to avoid wiping in-flight user typing
    if (this.ngControl?.valueAccessor) {
      const originalWriteValue = this.ngControl.valueAccessor.writeValue.bind(this.ngControl.valueAccessor);
      this.ngControl.valueAccessor.writeValue = (value: unknown) => {
        // If Angular tries to write empty/null during hydration, but the input already has content
        if ((value === '' || value === null || value === undefined) && nativeInput && nativeInput.value) {
          if (control && control.value !== nativeInput.value) {
            control.setValue(nativeInput.value, { emitEvent: false });
          }
          return;
        }
        originalWriteValue(value);
      };
    }
  }
}
