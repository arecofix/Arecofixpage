import {
  Component,
  inject,
  signal,
  OnInit,
  AfterViewInit,
  OnDestroy,
  NgZone,
  PLATFORM_ID,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { SeoService } from '@app/core/services/seo.service';
import { SUPABASE_CLIENT } from '@app/core/di/supabase-token';
import { STORAGE_KEYS } from '@app/core/constants/storage.constants';
import { environment } from '@env/environment';

@Component({
  selector: 'app-prueba-gratis',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './prueba-gratis.component.html',
})
export class PruebaGratisComponent implements OnInit, AfterViewInit, OnDestroy {
  private seoService = inject(SeoService);
  private fb = inject(FormBuilder);
  private supabase = inject(SUPABASE_CLIENT);
  private platformId = inject(PLATFORM_ID);
  private zone = inject(NgZone);

  trialForm: FormGroup;

  loading = signal(false);
  success = signal(false);
  errorMsg = signal<string | null>(null);
  uploadingLogo = signal(false);
  hasClaimedTrial = signal(false);

  // Credenciales generadas para mostrar al usuario
  generatedEmail = signal('');
  generatedPassword = signal('');
  credentialsCopied = signal(false);

  // Logo
  selectedLogoFile: File | null = null;
  logoPreviewUrl = signal<string | null>(null);

  // Turnstile
  turnstileToken = signal<string | null>(null);
  readonly turnstileSiteKey = environment.turnstileSiteKey;
  private widgetId: string | null = null;

  // Feature Flag
  readonly trialEnabled = signal<boolean>(environment.features?.trialEnabled ?? false);

  readonly whatsappUrl = `https://wa.me/${environment.contact.whatsappNumber}?text=${encodeURIComponent('Hola! Quiero solicitar una prueba gratuita de Arecofix')}`;

  readonly exeDownloadUrl = environment.downloads.desktopSetupUrl;

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      if (localStorage.getItem(STORAGE_KEYS.TRIAL_CLAIMED) === 'true') {
        this.hasClaimedTrial.set(true);
      }
    }
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId) && this.trialEnabled()) {
      this.initTurnstile();
    }
  }

  ngOnDestroy(): void {
    if (isPlatformBrowser(this.platformId) && this.widgetId && typeof (window as any).turnstile !== 'undefined') {
      try {
        (window as any).turnstile.remove(this.widgetId);
      } catch (e) {
        console.warn('[Turnstile remove error]', e);
      }
    }
  }

  private initTurnstile(): void {
    if (!isPlatformBrowser(this.platformId) || !this.trialEnabled()) return;

    if (typeof (window as any).turnstile !== 'undefined') {
      this.renderWidget();
    } else {
      let attempts = 0;
      const interval = setInterval(() => {
        attempts++;
        if (typeof (window as any).turnstile !== 'undefined') {
          clearInterval(interval);
          this.renderWidget();
        } else if (attempts > 50) {
          clearInterval(interval);
          console.warn('[Turnstile] Script failed to load in time.');
        }
      }, 100);
    }
  }

  private renderWidget(): void {
    const container = document.getElementById('turnstile-container');
    if (!container) return;
    if (this.widgetId) return;

    try {
      this.widgetId = (window as any).turnstile.render(container, {
        sitekey: this.turnstileSiteKey,
        action: 'trial_signup',
        callback: (token: string) => {
          this.zone.run(() => {
            this.turnstileToken.set(token);
            this.errorMsg.set(null);
          });
        },
        'error-callback': (code: any) => {
          this.zone.run(() => {
            this.turnstileToken.set(null);
            console.error('[Turnstile error code]', code);
          });
        },
        'expired-callback': () => {
          this.zone.run(() => {
            this.turnstileToken.set(null);
          });
        },
      });
    } catch (e) {
      console.error('[Turnstile render error]', e);
    }
  }

  constructor() {
    this.trialForm = this.fb.group({
      businessName: ['', [Validators.required, Validators.minLength(3)]],
      userName: ['', [Validators.required, Validators.minLength(3)]],
      whatsapp: [
        '',
        [Validators.required, Validators.pattern('^[0-9+ ]{8,15}$')],
      ],
      email: ['', [Validators.required, Validators.email]],
    });
  }

  onLogoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    // Validate: only images, max 2MB
    if (!file.type.startsWith('image/')) {
      this.errorMsg.set(
        'Solo se permiten archivos de imagen (JPG, PNG, SVG, WebP).',
      );
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      this.errorMsg.set('El logo no puede superar los 2 MB.');
      return;
    }

    this.selectedLogoFile = file;
    this.errorMsg.set(null);

    // Generate preview
    const reader = new FileReader();
    reader.onload = (e) => {
      this.logoPreviewUrl.set(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  }

  removeLogo(): void {
    this.selectedLogoFile = null;
    this.logoPreviewUrl.set(null);
  }

  async uploadLogo(file: File): Promise<string | null> {
    try {
      this.uploadingLogo.set(true);
      const ext = file.name.split('.').pop() ?? 'png';
      const fileName = `trial-logos/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

      const { error } = await this.supabase.storage
        .from('logos')
        .upload(fileName, file, { contentType: file.type, upsert: false });

      if (error) {
        console.warn(
          '[PruebaGratis] Logo upload failed (non-critical):',
          error.message,
        );
        return null;
      }

      const { data } = this.supabase.storage
        .from('logos')
        .getPublicUrl(fileName);
      return data?.publicUrl ?? null;
    } catch (e) {
      console.warn('[PruebaGratis] Logo upload exception (non-critical):', e);
      return null;
    } finally {
      this.uploadingLogo.set(false);
    }
  }

  async onSubmit() {
    if (this.trialForm.invalid) {
      this.trialForm.markAllAsTouched();
      return;
    }

    if (!this.turnstileToken()) {
      this.errorMsg.set('Debe completar la verificación de seguridad para continuar.');
      return;
    }

    this.loading.set(true);
    this.errorMsg.set(null);

    const formData = this.trialForm.value;

    try {
      // Upload logo first (optional — non-blocking)
      let logoUrl: string | null = null;
      if (this.selectedLogoFile) {
        logoUrl = await this.uploadLogo(this.selectedLogoFile);
      }

      const { data, error } = await this.supabase.functions.invoke(
        'create-trial-tenant',
        {
          body: {
            businessName: formData.businessName,
            userName: formData.userName,
            email: formData.email,
            whatsapp: formData.whatsapp,
            subtitle: 'Reparación Especializada por ' + formData.userName,
            currency: 'ARS',
            logo_url: logoUrl,
            'cf-turnstile-response': this.turnstileToken(),
            turnstileToken: this.turnstileToken(),
          },
        },
      );

      if (error) {
        throw new Error(
          error.message || 'Error al crear la cuenta. Intente nuevamente.',
        );
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      // Show generated credentials from edge function response
      this.generatedEmail.set(data?.credentials?.email ?? formData.email);
      this.generatedPassword.set(data?.credentials?.password ?? '');

      if (isPlatformBrowser(this.platformId)) {
        localStorage.setItem(STORAGE_KEYS.TRIAL_CLAIMED, 'true');
      }

      this.success.set(true);
    } catch (e: unknown) {
      const err = e as Error;
      this.errorMsg.set(
        err.message || 'Ocurrió un error inesperado al solicitar la prueba.',
      );
      if (this.widgetId && typeof (window as any).turnstile !== 'undefined') {
        try {
          (window as any).turnstile.reset(this.widgetId);
        } catch {}
        this.turnstileToken.set(null);
      }
    } finally {
      this.loading.set(false);
    }
  }

  async copyCredentials(): Promise<void> {
    const text = `Email: ${this.generatedEmail()}\nContraseña: ${this.generatedPassword()}`;
    try {
      await navigator.clipboard.writeText(text);
      this.credentialsCopied.set(true);
      setTimeout(() => this.credentialsCopied.set(false), 2500);
    } catch {
      const el = document.createElement('textarea');
      el.value = text;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      this.credentialsCopied.set(true);
      setTimeout(() => this.credentialsCopied.set(false), 2500);
    }
  }

  downloadApp() {
    window.open(this.exeDownloadUrl, '_blank', 'noopener,noreferrer');
  }
}
