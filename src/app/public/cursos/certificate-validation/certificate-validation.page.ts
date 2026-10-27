import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CertificatesService } from '@app/features/courses/application/services/certificates.service';

export interface PublicCertView {
  certificateId: string;
  studentName: string;
  courseTitle: string;
  instructorName: string;
  issuedAt: string;
  status: 'valid' | 'revoked' | 'not_found';
  isValid: boolean;
  pdfUrl?: string;
}

@Component({
  selector: 'app-certificate-validation-page',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="min-h-screen bg-slate-50 dark:bg-slate-900 py-12 px-4 flex items-center justify-center">
      <div class="max-w-2xl w-full">
        
        <!-- Header -->
        <div class="text-center mb-8">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider mb-3">
            <i class="fas fa-shield-alt"></i> Verificación Oficial
          </div>
          <h1 class="text-3xl font-black text-slate-900 dark:text-white">Arecofix Academy</h1>
          <p class="text-slate-600 dark:text-slate-400 mt-1">Portal Público de Validación de Certificaciones</p>
        </div>

        @if (loading()) {
          <div class="flex flex-col items-center justify-center py-16 bg-white dark:bg-slate-800 rounded-3xl shadow-lg border border-slate-200 dark:border-slate-700">
            <div class="loading loading-spinner loading-lg text-primary mb-4"></div>
            <p class="text-slate-500 font-medium text-sm">Verificando autenticidad en la base de datos...</p>
          </div>
        } @else if (cert() && cert()?.isValid) {
          <!-- Tarjeta de Certificado Válido -->
          <div id="valid-certificate-card" class="bg-white dark:bg-slate-800 rounded-3xl shadow-xl border border-emerald-500/30 overflow-hidden relative transition-all">
            <div class="absolute top-0 w-full h-2.5 bg-gradient-to-r from-emerald-500 to-teal-400"></div>
            
            <div class="p-8 text-center border-b border-slate-100 dark:border-slate-700/60 bg-emerald-50/40 dark:bg-emerald-950/20">
              <div class="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center text-4xl mx-auto mb-4 shadow-inner">
                <i class="fas fa-check-circle"></i>
              </div>
              <h2 class="text-2xl font-bold text-slate-900 dark:text-white">✅ Certificado Válido</h2>
              <p class="text-emerald-800 dark:text-emerald-300 font-medium text-base mt-2 max-w-lg mx-auto leading-relaxed">
                <strong class="font-bold">{{ cert()?.studentName }}</strong> ha completado exitosamente el curso 
                <strong class="font-bold">"{{ cert()?.courseTitle }}"</strong> dictado por 
                <strong class="font-bold">{{ cert()?.instructorName }}</strong> el 
                <strong class="font-bold">{{ cert()?.issuedAt | date:'dd/MM/yyyy' }}</strong>.
              </p>
            </div>

            <div class="p-8 space-y-6">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 dark:bg-slate-900/40 p-6 rounded-2xl border border-slate-100 dark:border-slate-800">
                <div>
                  <p class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Nombre del Alumno</p>
                  <p class="text-base font-bold text-slate-800 dark:text-white">{{ cert()?.studentName }}</p>
                </div>
                <div>
                  <p class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Capacitación Aprobada</p>
                  <p class="text-base font-bold text-slate-800 dark:text-white">{{ cert()?.courseTitle }}</p>
                </div>
                <div>
                  <p class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Instructor / Dirección</p>
                  <p class="text-base font-bold text-slate-800 dark:text-white">{{ cert()?.instructorName }}</p>
                </div>
                <div>
                  <p class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Fecha de Emisión</p>
                  <p class="text-base font-bold text-slate-800 dark:text-white">{{ cert()?.issuedAt | date:'dd/MM/yyyy' }}</p>
                </div>
              </div>

              <div>
                <p class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Código Único de Registro</p>
                <div class="flex items-center gap-2 bg-slate-100 dark:bg-slate-900 px-3 py-2 rounded-lg font-mono text-xs text-slate-600 dark:text-slate-300">
                  <i class="fas fa-fingerprint text-primary"></i>
                  <span>{{ cert()?.certificateId }}</span>
                </div>
              </div>
            </div>

            <!-- Footer Actions -->
            <div class="bg-slate-50 dark:bg-slate-900/60 p-6 border-t border-slate-100 dark:border-slate-800 flex flex-wrap justify-center items-center gap-4">
              <a [href]="cert()?.pdfUrl || ('/api/academy/certificates/' + cert()?.certificateId + '/pdf')" 
                 target="_blank" 
                 class="btn btn-primary px-6 rounded-xl shadow-lg shadow-primary/25">
                <i class="fas fa-file-pdf mr-2"></i> Descargar Certificado (PDF)
              </a>
              <a routerLink="/academy" class="btn btn-ghost rounded-xl">
                Ver Más Cursos
              </a>
            </div>
          </div>
        } @else {
          <!-- Tarjeta de Certificado Inválido o Revocado -->
          <div id="invalid-certificate-card" class="bg-white dark:bg-slate-800 rounded-3xl shadow-xl border border-red-500/30 overflow-hidden relative text-center p-10">
            <div class="absolute top-0 w-full h-2.5 bg-red-500"></div>
            
            <div class="w-20 h-20 bg-red-100 dark:bg-red-950/50 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center text-4xl mx-auto mb-6 shadow-inner">
              <i class="fas fa-times-circle"></i>
            </div>
            
            <h2 class="text-2xl font-bold text-slate-900 dark:text-white mb-2">
              ❌ Certificado Inválido
            </h2>
            
            <p class="text-slate-600 dark:text-slate-400 mb-8 max-w-md mx-auto text-sm leading-relaxed">
              @if (cert()?.status === 'revoked') {
                Este certificado ha sido <strong>revocado</strong> por la dirección académica y ya no posee validez oficial.
              } @else {
                El identificador de certificado ingresado no existe en nuestro registro o ha sido alterado.
              }
            </p>

            <div class="flex justify-center gap-3">
              <a routerLink="/academy" class="btn btn-outline rounded-xl px-6">
                Volver a la Academia
              </a>
            </div>
          </div>
        }
      </div>
    </div>
  `
})
export class CertificateValidationPage implements OnInit {
  private route = inject(ActivatedRoute);
  private certService = inject(CertificatesService);

  cert = signal<PublicCertView | null>(null);
  loading = signal(true);

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      const data = await this.certService.getPublicCertificateData(id);
      if (data && data.success && data.status === 'valid') {
        this.cert.set({
          certificateId: data.certificate_id || id,
          studentName: data.student_name || 'Alumno',
          courseTitle: data.course_title || 'Curso',
          instructorName: data.instructor_name || 'Arecofix Academy',
          issuedAt: data.issued_at || new Date().toISOString(),
          status: 'valid',
          isValid: true,
          pdfUrl: data.pdf_url || `/api/academy/certificates/${id}/pdf`
        });
      } else if (data && data.status === 'revoked') {
        this.cert.set({
          certificateId: id,
          studentName: '',
          courseTitle: '',
          instructorName: '',
          issuedAt: '',
          status: 'revoked',
          isValid: false
        });
      } else {
        this.cert.set(null);
      }
    } else {
      this.cert.set(null);
    }
    this.loading.set(false);
  }
}
