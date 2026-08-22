import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CertificatesService, Certificate } from '@app/features/courses/application/services/certificates.service';

@Component({
  selector: 'app-certificate-validation-page',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="min-h-screen bg-slate-50 dark:bg-slate-900 py-12 flex items-center justify-center">
      <div class="max-w-2xl w-full mx-4">
        
        <div class="text-center mb-8">
          <h1 class="text-3xl font-black text-slate-900 dark:text-white">Validación de Certificado</h1>
          <p class="text-slate-600 mt-2">Sistema de Verificación ArecoFix Academy</p>
        </div>

        @if (loading()) {
          <div class="flex justify-center py-10">
            <div class="loading loading-spinner loading-lg text-primary"></div>
          </div>
        } @else if (certificate()) {
          <div class="bg-white dark:bg-slate-800 rounded-3xl shadow-xl border border-success/20 overflow-hidden relative">
            <div class="absolute top-0 w-full h-2 bg-success"></div>
            
            <div class="p-8 text-center border-b border-slate-100 dark:border-slate-700">
              <div class="w-20 h-20 bg-success/10 text-success rounded-full flex items-center justify-center text-4xl mx-auto mb-4">
                <i class="fas fa-check-circle"></i>
              </div>
              <h2 class="text-2xl font-bold text-slate-800 dark:text-white">Certificado Auténtico</h2>
              <p class="text-slate-500">Este documento ha sido validado criptográficamente por nuestro sistema.</p>
            </div>

            <div class="p-8 space-y-6">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p class="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">Otorgado a</p>
                  <p class="text-lg font-bold text-slate-800 dark:text-white">{{ certificate()?.student_name }}</p>
                  <p class="text-sm text-slate-500">DNI: {{ certificate()?.student_dni }}</p>
                </div>
                <div>
                  <p class="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">Capacitación</p>
                  <p class="text-lg font-bold text-slate-800 dark:text-white">{{ certificate()?.course?.title }}</p>
                </div>
                <div>
                  <p class="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">Fecha de Emisión</p>
                  <p class="text-lg font-bold text-slate-800 dark:text-white">{{ certificate()?.issued_at | date:'dd/MM/yyyy' }}</p>
                </div>
                <div>
                  <p class="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">ID de Certificado</p>
                  <p class="text-xs font-mono text-slate-600 bg-slate-100 dark:bg-slate-700 p-2 rounded">{{ certificate()?.id }}</p>
                </div>
              </div>
            </div>

            <div class="bg-slate-50 dark:bg-slate-900/50 p-6 flex justify-center gap-4">
              <a [href]="certificate()?.pdf_url" target="_blank" class="btn btn-primary shadow-lg shadow-primary/30">
                <i class="fas fa-download mr-2"></i> Descargar Documento Original
              </a>
              <a routerLink="/academy" class="btn btn-ghost">Ir a la Academia</a>
            </div>
          </div>
        } @else {
          <div class="bg-white dark:bg-slate-800 rounded-3xl shadow-lg border border-error/20 overflow-hidden relative text-center p-12">
            <div class="absolute top-0 w-full h-2 bg-error"></div>
            <div class="w-24 h-24 bg-error/10 text-error rounded-full flex items-center justify-center text-4xl mx-auto mb-6">
              <i class="fas fa-times-circle"></i>
            </div>
            <h2 class="text-2xl font-bold text-slate-800 dark:text-white mb-2">Certificado No Encontrado</h2>
            <p class="text-slate-500 mb-8 max-w-md mx-auto">
              El ID del certificado ingresado no existe o ha sido revocado. Por favor verifica que la URL o el código escaneado sean correctos.
            </p>
            <a routerLink="/academy" class="btn btn-outline">Volver al Inicio</a>
          </div>
        }
      </div>
    </div>
  `
})
export class CertificateValidationPage implements OnInit {
  private route = inject(ActivatedRoute);
  private certService = inject(CertificatesService);

  certificate = signal<Certificate | null>(null);
  loading = signal(true);

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.certificate.set(await this.certService.validateCertificate(id));
    }
    this.loading.set(false);
  }
}
