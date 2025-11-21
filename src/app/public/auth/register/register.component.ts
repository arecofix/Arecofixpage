import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '@app/services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup, AbstractControl, ValidationErrors } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, CommonModule],
})
export class RegisterComponent implements OnInit, OnDestroy {
  form: FormGroup;
  loading = false;
  error = '';
  success = '';
  showPassword = false;
  showConfirmPassword = false;
  agreedToTerms = false;
  passwordStrengthRequirements = {
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumeric: false,
    hasSpecialChar: false,
  };

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private destroy$ = new Subject<void>();

  constructor() {
    this.form = this.fb.group({
      first_name: ['', [Validators.required, Validators.minLength(2)]],
      last_name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9\-\+\s\(\)]+$/)]],
      password: ['', [Validators.required, Validators.minLength(8), this.passwordStrengthValidator]],
      confirmPassword: ['', [Validators.required]],
      terms: [false, [Validators.requiredTrue]],
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit() {
    // If user is already logged in, redirect
    this.authService.authState$
      .pipe(takeUntil(this.destroy$))
      .subscribe((state) => {
        if (state.user) {
          this.router.navigate(['/']);
        }
      });

    // Update password strength requirements on password change
    this.password?.valueChanges.subscribe(() => {
      this.updatePasswordStrength();
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get first_name() { return this.form.get('first_name'); }
  get last_name() { return this.form.get('last_name'); }
  get email() { return this.form.get('email'); }
  get phone() { return this.form.get('phone'); }
  get password() { return this.form.get('password'); }
  get confirmPassword() { return this.form.get('confirmPassword'); }
  get terms() { return this.form.get('terms'); }

  updatePasswordStrength() {
    const value = this.password?.value || '';
    this.passwordStrengthRequirements = {
      hasUpperCase: /[A-Z]/.test(value),
      hasLowerCase: /[a-z]/.test(value),
      hasNumeric: /[0-9]/.test(value),
      hasSpecialChar: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value),
    };
  }

  passwordStrengthValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) return null;

    const hasUpperCase = /[A-Z]/.test(value);
    const hasLowerCase = /[a-z]/.test(value);
    const hasNumeric = /[0-9]/.test(value);
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value);

    const passwordValid = hasUpperCase && hasLowerCase && hasNumeric && hasSpecialChar;

    if (!passwordValid) {
      return {
        passwordStrength: {
          hasUpperCase,
          hasLowerCase,
          hasNumeric,
          hasSpecialChar,
        },
      };
    }

    return null;
  }

  passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
    const password = group.get('password');
    const confirmPassword = group.get('confirmPassword');

    if (!password || !confirmPassword) return null;

    return password.value === confirmPassword.value ? null : { passwordMismatch: true };
  }

  async handleRegister() {
    this.error = '';
    this.success = '';
    
    if (this.form.invalid) {
      this.error = 'Por favor completa correctamente todos los campos.';
      return;
    }

    this.loading = true;
    const { email, password, first_name, last_name, phone } = this.form.value as {
      email: string;
      password: string;
      first_name: string;
      last_name: string;
      phone: string;
    };

    try {
      const res = await this.authService.signUp(email, password, {
        first_name,
        last_name,
        phone,
        display_name: `${first_name} ${last_name}`,
      });

      this.loading = false;

      if (res.error) {
        this.error = this.parseAuthError(res.error);
        return;
      }

      // Mensaje según el flujo: si no hay usuario inmediato, se envió Magic Link
      if (!res.user) {
        this.success = 'Te enviamos un enlace de acceso por correo. Revisa tu bandeja de entrada para confirmar tu cuenta.';
      } else {
        this.success = '¡Cuenta creada exitosamente! Redirigiendo...';
      }
      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 2000);
    } catch (err) {
      this.loading = false;
      this.error = 'Error al crear la cuenta. Intenta nuevamente.';
      console.error('Registration error:', err);
    }
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  toggleTermsCheckbox() {
    this.agreedToTerms = !this.agreedToTerms;
  }

  getPasswordStrengthText(): string {
    const { hasUpperCase, hasLowerCase, hasNumeric, hasSpecialChar } = this.passwordStrengthRequirements;
    const strength = [hasUpperCase, hasLowerCase, hasNumeric, hasSpecialChar].filter(Boolean).length;

    if (strength < 2) return 'Débil';
    if (strength < 3) return 'Media';
    if (strength < 4) return 'Fuerte';
    return 'Muy Fuerte';
  }

  getPasswordStrengthColor(): string {
    const text = this.getPasswordStrengthText();
    switch (text) {
      case 'Débil': return 'text-red-600';
      case 'Media': return 'text-yellow-600';
      case 'Fuerte': return 'text-blue-600';
      case 'Muy Fuerte': return 'text-green-600';
      default: return 'text-gray-400';
    }
  }

  private parseAuthError(error: string): string {
    const errorMap: { [key: string]: string } = {
      'User already registered': 'Este email ya está registrado.',
      'Weak password': 'La contraseña debe tener al menos 8 caracteres con mayúsculas, minúsculas, números y caracteres especiales.',
      'Invalid email': 'Por favor ingresa un email válido.',
      'Email already exists': 'Este email ya está registrado.',
      'Password should be different': 'La contraseña debe ser diferente a la anterior.',
    };

    for (const [key, value] of Object.entries(errorMap)) {
      if (error.toLowerCase().includes(key.toLowerCase())) {
        return value;
      }
    }

    return error || 'Error al crear la cuenta.';
  }
}
