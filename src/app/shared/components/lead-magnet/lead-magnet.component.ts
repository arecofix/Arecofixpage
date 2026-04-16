import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-lead-magnet',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './lead-magnet.component.html',
  styleUrl: './lead-magnet.component.scss'
})
export class LeadMagnetComponent {
  leadForm: FormGroup;
  isDownloading = false;
  downloadSuccess = false;

  constructor(private fb: FormBuilder) {
    this.leadForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      whatsapp: ['', [Validators.required, Validators.pattern('^[0-9]{10,15}$')]],
      email: ['', [Validators.email]] // Opcional pero si se ingresa debe ser válido
    });
  }

  onSubmit() {
    if (this.leadForm.valid) {
      this.isDownloading = true;

      // TODO: Lógica para enviar los datos al backend (Supabase, Firebase, etc.)
      const formData = this.leadForm.value;
      console.log('Datos capturados Listos para enviar:', formData);

      // Simulamos un breve tiempo de procesamiento (e.g. guardando en DB) y luego disparamos la descarga
      setTimeout(() => {
        this.triggerDownload();
        this.isDownloading = false;
        this.downloadSuccess = true;
      }, 1500);
    } else {
      this.leadForm.markAllAsTouched();
    }
  }

  private triggerDownload() {
    const link = document.createElement('a');
    // Reemplaza esto con la ruta real del PDF en public/assets/docs/...
    link.href = 'assets/docs/guia-protocolo-carga.pdf';
    link.download = 'Guia-Protocolo-Carga-Arecofix.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
