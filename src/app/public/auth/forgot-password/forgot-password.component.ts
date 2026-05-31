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

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);

  constructor() {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  get email() {
    return this.form.get('email');
  }

  async resetPassword() {
    this.error = '';
    this.success = '';
    
    if (this.form.invalid) {
      if (this.email?.hasError('required')) {
        this.error = 'Ingresa tu email para restablecer la contraseña.';
      } else if (this.email?.hasError('email')) {
        this.error = 'Por favor ingresa un email válido.';
      }
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
        this.success = 'Te enviamos un email para restablecer la contraseña. Revisa tu bandeja de entrada.';
        this.form.reset();
      }
    } catch (err) {
      this.loading = false;
      this.error = 'Error al enviar el correo de recuperación.';
    }
  }

  private parseAuthError(error: any): string {
    const errorMsg = error?.message || error || '';
    if (typeof errorMsg === 'string' && errorMsg.toLowerCase().includes('user not found')) {
      return 'No existe una cuenta con este email.';
    }
    return typeof errorMsg === 'string' ? errorMsg : 'Error al enviar el correo.';
  }
}
