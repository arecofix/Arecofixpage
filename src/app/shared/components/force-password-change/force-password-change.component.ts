import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { AuthService } from '@app/core/services/auth.service';
import { SUPABASE_CLIENT } from '@app/core/di/supabase-token';

/**
 * ForcePasswordChangeComponent
 *
 * Modal overlay shown when `user_metadata.must_change_password === true`.
 * Requires the user to set a new password before accessing the admin panel.
 * On success, clears the must_change_password flag in Supabase user metadata.
 */
@Component({
  selector: 'app-force-password-change',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './force-password-change.component.html'
})
export class ForcePasswordChangeComponent implements OnInit {
  private authService = inject(AuthService);
  private supabase = inject(SUPABASE_CLIENT);
  private fb = inject(FormBuilder);

  form: FormGroup;
  loading = signal(false);
  errorMsg = signal<string | null>(null);
  success = signal(false);
  showPassword = signal(false);
  showConfirmPassword = signal(false);

  /** Emitted when password changed successfully — parent removes overlay */
  onDone: (() => void) | null = null;

  constructor() {
    this.form = this.fb.group(
      {
        password: ['', [Validators.required, Validators.minLength(8), this.passwordStrengthValidator]],
        confirmPassword: ['', Validators.required]
      },
      { validators: this.passwordMatchValidator }
    );
  }

  ngOnInit(): void {}

  get password() { return this.form.get('password'); }
  get confirmPassword() { return this.form.get('confirmPassword'); }

  private passwordStrengthValidator(control: AbstractControl): ValidationErrors | null {
    const value: string = control.value || '';
    const hasUpper = /[A-Z]/.test(value);
    const hasLower = /[a-z]/.test(value);
    const hasNumber = /[0-9]/.test(value);
    if (!hasUpper || !hasLower || !hasNumber) {
      return { strength: true };
    }
    return null;
  }

  private passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
    const pass = group.get('password')?.value;
    const confirm = group.get('confirmPassword')?.value;
    return pass === confirm ? null : { mismatch: true };
  }

  async submit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.errorMsg.set(null);

    const newPassword: string = this.form.value.password;

    try {
      // 1. Update the password via Supabase auth
      const errMsg = await this.authService.updatePassword(newPassword);
      if (errMsg) {
        throw new Error(errMsg);
      }

      // 2. Clear the must_change_password flag in user metadata
      const { error: metaErr } = await this.supabase.auth.updateUser({
        data: { must_change_password: false }
      });
      if (metaErr) {
        console.warn('[ForcePasswordChange] Could not clear flag:', metaErr.message);
      }

      // 3. Also update the profiles table flag
      const user = this.authService.getCurrentUser();
      if (user?.id) {
        await this.supabase
          .from('profiles')
          .update({ must_change_password: false, updated_at: new Date().toISOString() })
          .eq('id', user.id);
      }

      this.success.set(true);
      setTimeout(() => {
        if (this.onDone) this.onDone();
      }, 1800);

    } catch (e: unknown) {
      const err = e as Error;
      this.errorMsg.set(err.message || 'No se pudo actualizar la contraseña. Intente nuevamente.');
    } finally {
      this.loading.set(false);
    }
  }
}
