import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { DOCUMENT } from '@angular/common';
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
  returnUrl = '';
  currentYear = new Date().getFullYear();
  socialLoading: { [key: string]: boolean } = {
    google: false,
    github: false,
    facebook: false,
  };

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private document = inject(DOCUMENT);
  private destroy$ = new Subject<void>();

  constructor() {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [true],
    });
  }

  async ngOnInit() {
    this.document.body.classList.add('hide-floating-widgets');
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '';
    if (typeof window !== 'undefined') {
        localStorage.setItem('arecofix_return_url', this.returnUrl);
    }
    
    this.authService.authState$
      .pipe(takeUntil(this.destroy$))
      .subscribe(async (state) => {
        if (state.user) {
          let target = this.sanitizeReturnUrl(this.returnUrl);
          
          if (state.profile?.branch_id) {
            try {
              const { firstValueFrom, of } = await import('rxjs');
              const { filter, take, timeout, catchError } = await import('rxjs/operators');
              const branch = await firstValueFrom(
                this.authService.currentBranch$.pipe(
                  filter(b => b?.id === state.profile?.branch_id),
                  take(1),
                  timeout(2000),
                  catchError(() => of(null))
                )
              );
              if (branch?.slug) {
                if (target === '/admin' || target.startsWith('/admin/')) {
                  target = `/${branch.slug}${target}`;
                }
              }
            } catch (e) {}
          }
          
          const currentUrl = this.router.url.split('?')[0];
          if (target !== currentUrl) {
            this.router.navigate([target]);
          }
        }
      });
  }

  ngOnDestroy() {
    this.document.body.classList.remove('hide-floating-widgets');
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
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.error = 'Por favor completa correctamente todos los campos.';
      return;
    }
    
    this.loading = true;
    const { email, password, rememberMe } = this.form.value;
    
    if (typeof window !== 'undefined') {
        localStorage.setItem('supabase-remember-me', rememberMe ? 'true' : 'false');
    }
    
    try {
      const res = await this.authService.signIn(email, password);
      this.loading = false;
      
      if (res.error) {
        this.error = this.parseAuthError(res.error);
        return;
      }
      
      this.success = '¡Bienvenido! Redirigiendo...';
      
      const { isTauri } = await import('@tauri-apps/api/core');
      const runningInTauri = isTauri();
      const isAdmin = this.authService.isSuperAdmin();

      let target = this.sanitizeReturnUrl(this.returnUrl);
      
      const profile = this.authService.getCurrentProfile();
      if (profile?.branch_id) {
        try {
          const { firstValueFrom, of } = await import('rxjs');
          const { filter, take, timeout, catchError } = await import('rxjs/operators');
          const branch = await firstValueFrom(
            this.authService.currentBranch$.pipe(
              filter(b => b?.id === profile.branch_id),
              take(1),
              timeout(2000),
              catchError(() => of(null))
            )
          );
          if (branch?.slug) {
             if (target === '/admin' || target.startsWith('/admin/')) {
                target = `/${branch.slug}${target}`;
             } else if (runningInTauri && target === '/') {
                target = `/${branch.slug}/admin`;
             }
          }
        } catch (e) {}
      } else if (runningInTauri) {
        if (isAdmin) {
          target = '/admin';
        } else {
          target = '/';
        }
      }

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
    
    if (typeof window !== 'undefined') {
        localStorage.setItem('supabase-remember-me', this.form.value.rememberMe ? 'true' : 'false');
    }
    
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
    
    if (typeof window !== 'undefined') {
        localStorage.setItem('supabase-remember-me', this.form.value.rememberMe ? 'true' : 'false');
    }
    
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
    
    if (typeof window !== 'undefined') {
        localStorage.setItem('supabase-remember-me', this.form.value.rememberMe ? 'true' : 'false');
    }
    
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

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  private sanitizeReturnUrl(url: string): string {
    const disallowed = ['/login', '/register'];
    if (!url || disallowed.includes(url)) return '/admin';
    return url;
  }

  private parseAuthError(error: any): string {
    const errorMsg = error?.message || error || '';
    const errorMap: { [key: string]: string } = {
      'Invalid login credentials': 'Email o contraseña incorrectos.',
      'Email not confirmed': 'Por favor confirma tu email antes de iniciar sesión.',
      'User not found': 'No existe una cuenta con este email.',
      'User already registered': 'Esta cuenta ya está registrada.',
      'Weak password': 'La contraseña debe tener al menos 6 caracteres.',
      'Invalid email': 'Por favor ingresa un email válido.',
    };

    for (const [key, value] of Object.entries(errorMap)) {
      if (typeof errorMsg === 'string' && errorMsg.toLowerCase().includes(key.toLowerCase())) {
        return value;
      }
    }

    return typeof errorMsg === 'string' ? errorMsg : 'Error al iniciar sesión.';
  }
}
