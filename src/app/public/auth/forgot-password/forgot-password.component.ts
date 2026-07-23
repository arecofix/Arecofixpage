import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '@app/core/services/auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
})
export class ForgotPasswordComponent {
  form: FormGroup;
  loading = false;
  error = '';
  success = '';
  currentYear = new Date().getFullYear();
  step: 'EMAIL' | 'CODE' | 'PASSWORD' = 'EMAIL';
  savedEmail = '';

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);

  constructor() {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      code: [''],
      newPassword: ['']
    });
  }

  get email() {
    return this.form.get('email');
  }

  get code() {
    return this.form.get('code');
  }

  get newPassword() {
    return this.form.get('newPassword');
  }

  async resetPassword() {
    this.error = '';
    this.success = '';
    
    if (this.step === 'EMAIL') {
      if (this.email?.invalid) {
        this.error = 'Por favor ingresa un email válido.';
        return;
      }
      this.loading = true;
      const emailValue = this.email?.value as string;
      try {
        const err = await this.authService.resetPassword(emailValue);
        this.loading = false;
        if (err) {
          this.error = this.parseAuthError(err);
        } else {
          this.savedEmail = emailValue;
          this.success = 'Código enviado. Revisa tu bandeja de entrada.';
          this.step = 'CODE';
          this.form.get('code')?.setValidators([Validators.required, Validators.minLength(6)]);
          this.form.get('code')?.updateValueAndValidity();
        }
      } catch (err) {
        this.loading = false;
        this.error = 'Error al enviar el correo de recuperación.';
      }
    } else if (this.step === 'CODE') {
      if (this.code?.invalid) {
        this.error = 'Por favor ingresa el código de 6 dígitos.';
        return;
      }
      this.loading = true;
      const codeValue = this.code?.value as string;
      try {
        const err = await this.authService.verifyOtpRecovery(this.savedEmail, codeValue);
        this.loading = false;
        if (err) {
          this.error = this.parseAuthError(err);
        } else {
          this.success = 'Código verificado. Ingresa tu nueva contraseña.';
          this.step = 'PASSWORD';
          this.form.get('newPassword')?.setValidators([Validators.required, Validators.minLength(8)]);
          this.form.get('newPassword')?.updateValueAndValidity();
        }
      } catch (err) {
        this.loading = false;
        this.error = 'Error al verificar el código.';
      }
    } else if (this.step === 'PASSWORD') {
      if (this.newPassword?.invalid) {
        this.error = 'La contraseña debe tener al menos 8 caracteres.';
        return;
      }
      this.loading = true;
      const pwdValue = this.newPassword?.value as string;
      try {
        const err = await this.authService.updatePassword(pwdValue);
        this.loading = false;
        if (err) {
          this.error = this.parseAuthError(err);
        } else {
          this.success = 'Contraseña actualizada exitosamente. Ya puedes iniciar sesión.';
          this.form.reset();
        }
      } catch (err) {
        this.loading = false;
        this.error = 'Error al actualizar la contraseña.';
      }
    }
  }

  private parseAuthError(error: any): string {
    const errorMsg = error?.message || error || '';
    if (typeof errorMsg === 'string' && errorMsg.toLowerCase().includes('user not found')) {
      return 'No existe una cuenta con este email.';
    }
    if (typeof errorMsg === 'string' && errorMsg.toLowerCase().includes('token has expired or is invalid')) {
      return 'El código es inválido o ha expirado.';
    }
    return typeof errorMsg === 'string' ? errorMsg : 'Error al procesar la solicitud.';
  }
}
