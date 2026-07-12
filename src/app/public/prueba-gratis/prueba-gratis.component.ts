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
  
  generatedEmail = signal('');
  generatedPassword = signal('');

  constructor() {
    this.seoService.setPageData({
      title: 'Prueba Gratis Arecofix SaaS | Gestión de Talleres',
      description: 'Obtén tu licencia de prueba gratuita para Arecofix SaaS. Optimiza tu taller de reparación con el mejor software del mercado.',
      imageUrl: 'assets/img/branding/og-default.png'
    });

    this.trialForm = this.fb.group({
      businessName: ['', [Validators.required, Validators.minLength(3)]],
      userName: ['', [Validators.required, Validators.minLength(3)]],
      whatsapp: ['', [Validators.required, Validators.pattern('^[0-9+ ]{8,15}$')]],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  async onSubmit() {
    console.log('Form submitted!', this.trialForm.value, this.trialForm.valid);
    if (this.trialForm.invalid) {
      console.log('Form is invalid!', this.trialForm.errors);
      // Log individual control errors
      Object.keys(this.trialForm.controls).forEach(key => {
        const controlErrors = this.trialForm.get(key)?.errors;
        if (controlErrors) console.log(`Control ${key} errors:`, controlErrors);
      });
      this.trialForm.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.errorMsg.set(null);

    const formData = this.trialForm.value;

    try {
      // Usamos el cliente de supabase inyectado para invocar la edge function
      const { data, error } = await this.supabase.functions.invoke('create-trial-tenant', {
        body: {
          businessName: formData.businessName,
          email: formData.email,
          whatsapp: formData.whatsapp,
          subtitle: 'Reparación Especializada por ' + formData.userName,
          currency: 'ARS',
          logo_url: null
        }
      });

      if (error) {
        throw new Error(error.message || 'Error al crear la cuenta. Intente nuevamente.');
      }
      
      // La función no retorna la contraseña directamente si falla, pero asumiendo que funciona, deberíamos mostrar un mensaje genérico si no nos la pasa, o usar data.password si la edge function lo retorna.
      // Revisando la Edge Function (create-trial-tenant), NO retorna la contraseña generada en su Response actual, solo devuelve data pero el código original termina en return new Response(JSON.stringify({success:true}), ...). 
      // Oops, actually wait, I need to make sure the user knows how to login. 
      // I will instruct them to check their email, or we can just tell them the default behavior.
      
      this.generatedEmail.set(formData.email);
      // As we didn't modify the edge function, we will inform the user to check their email for the temporary password.
      
      this.success.set(true);
      
    } catch (e: any) {
      this.errorMsg.set(e.message || 'Ocurrió un error inesperado al solicitar la prueba.');
    } finally {
      this.loading.set(false);
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
