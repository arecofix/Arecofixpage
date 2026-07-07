import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SupabaseService } from '@app/core/services/supabase.service';
import { SupabaseStorageService } from '@app/core/services/supabase-storage.service';
import { PLATFORM_ID } from '@angular/core';

@Component({
  selector: 'app-free-trial',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './free-trial.component.html'
})
export class FreeTrialPageComponent implements OnInit {
  private fb = inject(FormBuilder);
  private supabase = inject(SupabaseService);
  private storageService = inject(SupabaseStorageService);
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);

  trialForm!: FormGroup;
  previewMode: 'light' | 'dark' = 'light';
  
  isLoading = false;
  uploadingLogo = false;
  hasClaimedTrial = false;
  
  logoUrl: string | null = null;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  showDownloadStep = false;
  accessToken: string | null = null;
  exeDownloadUrl = 'https://github.com/arecofix/Arecofixpage/releases/latest/download/Arecofix-setup.exe'; // Reemplazar luego con la URL real

  ngOnInit() {
    this.checkHardwareLock();
    
    this.trialForm = this.fb.group({
      businessName: ['', [Validators.required, Validators.minLength(3)]],
      subtitle: [''],
      whatsapp: ['', [Validators.required, Validators.pattern(/^\+[1-9]\d{6,14}$/)]], // E.164 format roughly
      email: ['', [Validators.required, Validators.email]],
      currency: ['ARS', [Validators.required]]
    });
  }

  private checkHardwareLock() {
    if (isPlatformBrowser(this.platformId)) {
      if (localStorage.getItem('arecofix_trial_claimed') === 'true') {
        this.hasClaimedTrial = true;
        this.errorMessage = 'Ya has registrado una prueba gratuita de 72 h en este dispositivo. Para continuar usando el sistema, adquiere una licencia definitiva.';
      }
    }
  }

  async onLogoSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    
    if (file.size > 2 * 1024 * 1024) {
      this.errorMessage = 'El logo no debe superar los 2MB';
      return;
    }

    try {
      this.uploadingLogo = true;
      this.errorMessage = null;
      // Use public bucket for logos
      const path = `logos/trial_${Date.now()}_${file.name}`;
      const url = await this.storageService.uploadFile(file, 'logos', 'public-assets');
      this.logoUrl = url;
    } catch (e: any) {
      this.errorMessage = 'Error al subir el logo: ' + e.message;
    } finally {
      this.uploadingLogo = false;
    }
  }

  async onSubmit() {
    if (this.trialForm.invalid || this.hasClaimedTrial || this.uploadingLogo) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;
    this.successMessage = null;

    const payload = {
      ...this.trialForm.value,
      logo_url: this.logoUrl
    };

    try {
      const response = await this.supabase.getClient().functions.invoke('create-trial-tenant', {
        body: payload
      });

      if (response.error) {
        throw new Error(response.error.message || 'Error en el servidor al procesar la solicitud.');
      }

      const result = response.data;

      if (!result.success) {
        throw new Error(result.error || 'No se pudo crear la prueba gratuita.');
      }

      this.successMessage = '¡Prueba creada! Iniciando sesión y preparando tu descarga...';
      
      // Hardware lock
      if (isPlatformBrowser(this.platformId)) {
        localStorage.setItem('arecofix_trial_claimed', 'true');
      }

      // Log in with the generated credentials
      const { email, password } = result.credentials;
      const { error: signInError, data: signInData } = await this.supabase.getClient().auth.signInWithPassword({
        email,
        password
      });

      if (signInError) {
        throw new Error('Cuenta creada, pero hubo un error al iniciar sesión. Por favor, revisa tu correo electrónico.');
      }

      this.accessToken = signInData.session?.access_token || null;
      this.showDownloadStep = true;
      this.successMessage = null;

    } catch (e: any) {
      console.error(e);
      let msg = e.message;
      if (e instanceof Error && e.message.includes('Ya existe')) {
          msg = 'El correo o WhatsApp ya se encuentra registrado.';
      }
      this.errorMessage = msg || 'Ocurrió un error inesperado.';
    } finally {
      this.isLoading = false;
    }
  }
}
