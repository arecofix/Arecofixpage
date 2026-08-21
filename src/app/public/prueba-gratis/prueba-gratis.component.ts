import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SeoService } from '@app/core/services/seo.service';
import { SUPABASE_CLIENT } from '@app/core/di/supabase-token';

@Component({
  selector: 'app-prueba-gratis',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './prueba-gratis.component.html'
})
export class PruebaGratisComponent {
  private seoService = inject(SeoService);
  private fb = inject(FormBuilder);
  private supabase = inject(SUPABASE_CLIENT);

  trialForm: FormGroup;
  
  loading = signal(false);
  success = signal(false);
  errorMsg = signal<string | null>(null);
  uploadingLogo = signal(false);
  
  // Credenciales generadas para mostrar al usuario
  generatedEmail = signal('');
  generatedPassword = signal('');
  credentialsCopied = signal(false);

  // Logo
  selectedLogoFile: File | null = null;
  logoPreviewUrl = signal<string | null>(null);

  constructor() {
    

    this.trialForm = this.fb.group({
      businessName: ['', [Validators.required, Validators.minLength(3)]],
      userName: ['', [Validators.required, Validators.minLength(3)]],
      whatsapp: ['', [Validators.required, Validators.pattern('^[0-9+ ]{8,15}$')]],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onLogoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    // Validate: only images, max 2MB
    if (!file.type.startsWith('image/')) {
      this.errorMsg.set('Solo se permiten archivos de imagen (JPG, PNG, SVG, WebP).');
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
        console.warn('[PruebaGratis] Logo upload failed (non-critical):', error.message);
        return null;
      }

      const { data } = this.supabase.storage.from('logos').getPublicUrl(fileName);
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

    this.loading.set(true);
    this.errorMsg.set(null);

    const formData = this.trialForm.value;

    try {
      // Upload logo first (optional — non-blocking)
      let logoUrl: string | null = null;
      if (this.selectedLogoFile) {
        logoUrl = await this.uploadLogo(this.selectedLogoFile);
      }

      const { data, error } = await this.supabase.functions.invoke('create-trial-tenant', {
        body: {
          businessName: formData.businessName,
          userName: formData.userName,
          email: formData.email,
          whatsapp: formData.whatsapp,
          subtitle: 'Reparación Especializada por ' + formData.userName,
          currency: 'ARS',
          logo_url: logoUrl
        }
      });

      if (error) {
        throw new Error(error.message || 'Error al crear la cuenta. Intente nuevamente.');
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      // Show generated credentials from edge function response
      this.generatedEmail.set(data?.credentials?.email ?? formData.email);
      this.generatedPassword.set(data?.credentials?.password ?? '');

      this.success.set(true);
      
    } catch (e: unknown) {
      const err = e as Error;
      this.errorMsg.set(err.message || 'Ocurrió un error inesperado al solicitar la prueba.');
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
    // Generar la descarga de la app de escritorio
    const link = document.createElement('a');
    link.href = '/assets/downloads/Arecofix-Setup.zip';
    link.download = 'Arecofix-Setup.zip';
    link.click();
  }
}
