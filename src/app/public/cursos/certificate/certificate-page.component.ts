import {
  Component,
  inject,
  OnInit,
  signal,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CoursesService } from '@app/core/services/courses.service';
import { TenantService } from '@app/core/services/tenant.service';

@Component({
  selector: 'app-certificate-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div
      class="min-h-screen bg-slate-50 dark:bg-slate-900 py-12 px-4 print:bg-white print:py-0 print:px-0"
    >
      @if (loading()) {
        <div class="flex justify-center items-center h-[60vh] print:hidden">
          <span
            class="loading loading-spinner loading-lg text-emerald-500"
          ></span>
        </div>
      } @else if (!certificate()) {
        <div
          class="flex justify-center items-center h-[60vh] flex-col text-slate-500 print:hidden"
        >
          <i class="fas fa-times-circle text-5xl text-red-400 mb-4"></i>
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
            Certificado no encontrado
          </h2>
          <p class="mt-2 text-center max-w-md">
            El código del certificado no es válido o no existe en nuestra base
            de datos.
          </p>
          <button routerLink="/" class="btn btn-primary mt-6">
            Volver al inicio
          </button>
        </div>
      } @else {
        <!-- Action Buttons (Hidden when printing) -->
        <div
          class="max-w-5xl mx-auto mb-6 flex justify-between items-center print:hidden"
        >
          <button routerLink="/academy/mis-cursos" class="btn btn-ghost">
            <i class="fas fa-arrow-left"></i> Volver
          </button>
          <button
            (click)="printCertificate()"
            class="btn btn-primary shadow-lg shadow-emerald-500/30"
          >
            <i class="fas fa-print"></i> Imprimir / Guardar PDF
          </button>
        </div>

        <!-- Certificate Container -->
        <div
          class="max-w-5xl mx-auto bg-white print:shadow-none print:border-none shadow-2xl border border-slate-200 rounded-3xl overflow-hidden print:w-full print:m-0 print:h-screen"
        >
          <!-- Aestethic Premium Certificate Design -->
          <div
            class="relative w-full aspect-[1.414/1] bg-white text-center p-12 flex flex-col justify-between"
            id="certificate-content"
          >
            <!-- Background Pattern -->
            <div
              class="absolute inset-0 opacity-[0.03] pointer-events-none"
              style="background-image: url('assets/img/branding/logo/logo-normal1.PNG'); background-size: 400px; background-position: center; background-repeat: no-repeat;"
            ></div>

            <!-- Inner Border -->
            <div
              class="absolute inset-4 border-2 border-slate-200 pointer-events-none"
            ></div>
            <div
              class="absolute inset-5 border border-emerald-500/30 pointer-events-none"
            ></div>

            <!-- Header -->
            <div class="relative z-10 pt-8">
              <img
                src="assets/img/branding/logo/logo-normal1.PNG"
                alt="Arecofix Logo"
                class="h-16 mx-auto mb-8"
                onerror="this.style.display='none'"
              />
              <h1
                class="text-5xl font-black text-slate-800 tracking-tight uppercase"
                style="font-family: 'Playfair Display', serif;"
              >
                Certificado de Finalización
              </h1>
              <div class="w-24 h-1 bg-emerald-500 mx-auto mt-6 mb-8"></div>
              <p class="text-xl text-slate-500 font-medium tracking-wide">
                El presente documento certifica que
              </p>
            </div>

            <!-- Student Name -->
            <div class="relative z-10 my-8">
              <h2
                class="text-6xl font-bold text-emerald-700 capitalize"
                style="font-family: 'Great Vibes', cursive, serif;"
              >
                {{ certificate()?.student_name }}
              </h2>
              <div class="w-3/4 max-w-2xl h-px bg-slate-300 mx-auto mt-4"></div>
            </div>

            <!-- Course Name -->
            <div class="relative z-10 space-y-4 mb-8">
              <p class="text-lg text-slate-500 font-medium tracking-wide">
                ha completado satisfactoriamente los requisitos del curso de
              </p>
              <h3 class="text-4xl font-black text-slate-800">
                {{ certificate()?.courses?.title }}
              </h3>
            </div>

            <!-- Footer & Signatures -->
            <div
              class="relative z-10 grid grid-cols-3 gap-8 items-end pb-8 px-12"
            >
              <!-- Date -->
              <div class="text-center">
                <div
                  class="border-b border-slate-400 pb-2 mb-2 font-bold text-slate-800 text-lg"
                >
                  {{
                    $safeNavigationMigration(certificate()?.issued_at)
                      | date: 'dd / MM / yyyy'
                  }}
                </div>
                <p
                  class="text-sm text-slate-500 uppercase tracking-wider font-semibold"
                >
                  Fecha de Emisión
                </p>
              </div>

              <!-- Seal -->
              <div class="flex justify-center">
                <div
                  class="w-32 h-32 rounded-full border-4 border-emerald-500 flex items-center justify-center relative"
                >
                  <div
                    class="absolute inset-1 rounded-full border border-emerald-500/50"
                  ></div>
                  <i class="fas fa-award text-5xl text-emerald-500"></i>
                  <svg
                    viewBox="0 0 100 100"
                    class="absolute inset-0 w-full h-full animate-[spin_20s_linear_infinite]"
                    style="animation-duration: 40s;"
                  >
                    <path
                      id="textPath"
                      d="M 50, 50 m -35, 0 a 35,35 0 1,1 70,0 a 35,35 0 1,1 -70,0"
                      fill="none"
                    ></path>
                    <text
                      class="text-[10px] font-bold fill-emerald-600 uppercase tracking-widest"
                    >
                      <textPath href="#textPath" startOffset="0%">
                        • OFFICIAL CERTIFICATION • ARECOFIX ACADEMY
                      </textPath>
                    </text>
                  </svg>
                </div>
              </div>

              <!-- Signature -->
              <div class="text-center">
                <div class="border-b border-slate-400 pb-2 mb-2">
                  <!-- Placeholder signature image -->
                  <img
                    src="/assets/img/branding/firma.png"
                    alt="Firma"
                    class="h-12 mx-auto opacity-80 mix-blend-multiply"
                    onerror="this.style.display='none'; this.nextElementSibling.style.display='block'"
                  />
                  <span
                    class="font-signature text-2xl text-slate-800 hidden"
                    style="font-family: 'Great Vibes', cursive;"
                    >Ezequiel Areco</span
                  >
                </div>
                <p
                  class="text-sm text-slate-500 uppercase tracking-wider font-semibold"
                >
                  Director General
                </p>
              </div>
            </div>

            <!-- Verification ID -->
            <div class="absolute bottom-6 left-0 right-0 text-center">
              <p class="text-[10px] text-slate-400 font-mono">
                ID de Verificación: {{ certificate()?.id }}
              </p>
              <p class="text-[10px] text-slate-400 font-mono mt-1">
                Verifica la validez de este certificado en:
                https://arecofix.com.ar/academy/cert/{{ certificate()?.id }}
              </p>
            </div>
          </div>
        </div>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  styles: [
    `
      @import url('https://fonts.googleapis.com/css2?family=Great+Vibes&family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&display=swap');

      @media print {
        @page {
          size: landscape;
          margin: 0;
        }
        body {
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
        #certificate-content {
          height: 100vh;
          width: 100vw;
        }
      }
    `,
  ],
})
export class CertificatePageComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private coursesService = inject(CoursesService);
  public tenantService = inject(TenantService);

  loading = signal(true);
  certificate = signal<any>(null);

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.coursesService.getCertificate(id).subscribe((res) => {
        if (res.data) {
          this.certificate.set(res.data);
        }
        this.loading.set(false);
      });
    } else {
      this.loading.set(false);
    }
  }

  printCertificate() {
    window.print();
  }
}
