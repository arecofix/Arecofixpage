import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '@app/core/services/auth.service';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';

import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
})
export class LoginComponent implements OnInit, OnDestroy {
  form: FormGroup;
  loading = false;
  error = '';
  success = '';
  showPassword = false;
  resetEmailSent = false;
  resetPasswordMode = false;
  returnUrl = '';
  socialLoading: { [key: string]: boolean } = {
    google: false,
    github: false,
    facebook: false,
  };

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private destroy$ = new Subject<void>();

  constructor() {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnInit() {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    
    this.authService.authState$
      .pipe(takeUntil(this.destroy$))
      .subscribe((state) => {
        if (state.user) {
          const target = this.sanitizeReturnUrl(this.returnUrl);
          const currentUrl = this.router.url.split('?')[0];
          if (target !== currentUrl) {
            this.router.navigate([target]);
          }
        }
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get email() {
    return this.form.get('email');
  }

  get password() {
    return this.form.get('password');
  }

  async handleLogin() {
    this.error = '';
    this.success = '';
    if (this.form.invalid) return;
    
    this.loading = true;
    const { email, password } = this.form.value as { email: string; password: string };
    
    try {
      const res = await this.authService.signIn(email, password);
      this.loading = false;
      
      if (res.error) {
        this.error = this.parseAuthError(res.error);
        return;
      }
      
      this.success = '¡Bienvenido! Redirigiendo...';
      const target = this.sanitizeReturnUrl(this.returnUrl);
      setTimeout(() => {
        this.router.navigate([target]);
      }, 1500);
    } catch (err) {
      this.loading = false;
      this.error = 'Error al iniciar sesión. Intenta nuevamente.';
    }
  }

  async loginWithGoogle() {
    this.error = '';
    this.success = '';
    this.socialLoading['google'] = true;
    
    try {
      const res = await this.authService.signInWithGoogle();
      this.socialLoading['google'] = false;
      
      if (res.error) {
        this.error = this.parseAuthError(res.error);
        return;
      }
      
      this.success = '¡Bienvenido! Redirigiendo...';
      const target = this.sanitizeReturnUrl(this.returnUrl);
      setTimeout(() => {
        this.router.navigate([target]);
      }, 1500);
    } catch (err) {
      this.socialLoading['google'] = false;
      this.error = 'Error al iniciar sesión con Google.';
    }
  }



  async loginWithFacebook() {
    this.error = '';
    this.success = '';
    this.socialLoading['facebook'] = true;
    
    try {
      const res = await this.authService.signInWithFacebook();
      this.socialLoading['facebook'] = false;
      
      if (res.error) {
        this.error = this.parseAuthError(res.error);
        return;
      }
      
      this.success = '¡Bienvenido! Redirigiendo...';
      const target = this.sanitizeReturnUrl(this.returnUrl);
      setTimeout(() => {
        this.router.navigate([target]);
      }, 1500);
    } catch (err) {
      this.socialLoading['facebook'] = false;
      this.error = 'Error al iniciar sesión con Facebook.';
    }
  }

  async loginWithGithub() {
    this.error = '';
    this.success = '';
    this.socialLoading['github'] = true;
    
    try {
      const res = await this.authService.signInWithGithub();
      this.socialLoading['github'] = false;
      
      if (res.error) {
        this.error = this.parseAuthError(res.error);
        return;
      }
      
      this.success = '¡Bienvenido! Redirigiendo...';
      const target = this.sanitizeReturnUrl(this.returnUrl);
      setTimeout(() => {
        this.router.navigate([target]);
      }, 1500);
    } catch (err) {
      this.socialLoading['github'] = false;
      this.error = 'Error al iniciar sesión con GitHub.';
    }
  }

  async resetPassword() {
    this.error = '';
    this.success = '';
    const email = this.email?.value as string | null;
    
    if (!email) {
      this.error = 'Ingresa tu email para restablecer la contraseña.';
      return;
    }

    if (!this.validateEmail(email)) {
      this.error = 'Por favor ingresa un email válido.';
      return;
    }

    this.loading = true;
    
    try {
      const err = await this.authService.resetPassword(email);
      this.loading = false;
      
      if (err) {
        this.error = this.parseAuthError(err);
      } else {
        this.success = 'Te enviamos un email para restablecer la contraseña. Revisa tu bandeja de entrada.';
        this.resetEmailSent = true;
        setTimeout(() => {
          this.resetPasswordMode = false;
          this.resetEmailSent = false;
          this.form.patchValue({ password: '' });
        }, 3000);
      }
    } catch (err) {
      this.loading = false;
      this.error = 'Error al enviar el correo de recuperación.';
    }
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  toggleResetPasswordMode() {
    this.resetPasswordMode = !this.resetPasswordMode;
    this.error = '';
    this.success = '';
    this.resetEmailSent = false;
    if (!this.resetPasswordMode) {
      this.form.patchValue({ password: '' });
    }
  }

  private validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private sanitizeReturnUrl(url: string): string {
    const disallowed = ['/login', '/register'];
    if (!url || disallowed.includes(url)) return '/';
    return url;
  }

  private parseAuthError(error: string): string {
    const errorMap: { [key: string]: string } = {
      'Invalid login credentials': 'Email o contraseña incorrectos.',
      'Email not confirmed': 'Por favor confirma tu email antes de iniciar sesión.',
      'User not found': 'No existe una cuenta con este email.',
      'User already registered': 'Esta cuenta ya está registrada.',
      'Weak password': 'La contraseña debe tener al menos 6 caracteres.',
      'Invalid email': 'Por favor ingresa un email válido.',
    };

    for (const [key, value] of Object.entries(errorMap)) {
      if (error.toLowerCase().includes(key.toLowerCase())) {
        return value;
      }
    }

    return error || 'Error al iniciar sesión.';
  }
}
