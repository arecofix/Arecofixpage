import {
  Component,
  inject,
  OnInit,
  signal,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CoursesService } from '@app/core/services/courses.service';
import { AuthService } from '@app/core/services/auth.service';
import { CourseRepository } from '@app/features/courses/domain/repositories/course.repository';
import { Course, StudentEnrollment, EffectiveEnrollmentStatus } from '@app/features/courses/domain/entities/course.entity';
import { SeoService } from '@app/core/services/seo.service';
import { CertificatesService, Certificate } from '@app/features/courses/application/services/certificates.service';
import { ToastService } from '@app/shared/services/toast.service';
import { SUPABASE_CLIENT } from '@app/core/di/supabase-token';
import { EnrollmentStatusCalculator } from '@app/features/courses/domain/services/enrollment-status.calculator';

@Component({
  selector: 'app-student-my-courses-page',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './student-my-courses-page.html'
})
export class StudentMyCoursesPage implements OnInit {
  private coursesService = inject(CoursesService);
  private authService = inject(AuthService);
  private courseRepo = inject(CourseRepository);
  private seoService = inject(SeoService);
  private certificatesService = inject(CertificatesService);
  private toastService = inject(ToastService);
  private supabase = inject(SUPABASE_CLIENT);
  private cdr = inject(ChangeDetectorRef);

  enrolledCourses = signal<StudentEnrollment[]>([]);
  authoredCourses = signal<Course[]>([]);

  loading = signal(true);
  activeTab = signal<'estudios' | 'instructor'>('estudios');

  isInstructor = signal(false);
  isAdmin = signal(false);

  // Modal Pagar Cuota State (5.3)
  showPayModal = signal(false);
  selectedEnrollmentForPay = signal<StudentEnrollment | null>(null);
  selectedProofFile = signal<File | null>(null);
  proofAmount = signal<number>(0);
  proofNotes = signal<string>('');
  isSubmittingProof = signal(false);

  async ngOnInit() {
    this.seoService.setPageData({
      title: 'Mis Cursos',
      description: 'Accede a tus cursos matriculados y gestiona tu aprendizaje en Arecofix Academy.',
      imageUrl: 'https://arecofix.com.ar/assets/img/cursos/academy/academy.jpg'
    });

    const session = await this.authService.getSession();
    const user = session?.user || (await this.authService.getUser());
    const profile = this.authService.getCurrentProfile();

    if (profile) {
      this.isInstructor.set(profile.role === 'instructor');
      this.isAdmin.set(profile.role === 'admin' || profile.role === 'super_admin');
    }

    const userEmail = user?.email || profile?.email || '';
    const userId = user?.id || profile?.id;

    if (userEmail || userId) {
      this.loadMyCourses(userEmail, userId);
    } else {
      this.loading.set(false);
      this.cdr.markForCheck();
    }

    if (profile && (this.isInstructor() || this.isAdmin())) {
      try {
        const allCourses = await this.courseRepo.getAll();
        const mine = allCourses.filter((c) => c.author_id === profile.id);
        this.authoredCourses.set(mine);
      } catch (e) {
        console.error('Error loading instructor courses:', e);
      }
    }
  }

  async loadMyCourses(email?: string, userId?: string) {
    this.coursesService.getUserEnrolledCourses(email, userId).subscribe(async (res) => {
      const validEnrollments = (res.data || []).filter((e) => !!e.course);

      try {
        const certs = email ? await this.certificatesService.getStudentCertificates(email) : [];
        const certMap = new Map<string, Certificate>();
        certs.forEach((c) => certMap.set(c.course_id, c));

        const enriched: StudentEnrollment[] = validEnrollments.map((e) => {
          const effectiveStatus = EnrollmentStatusCalculator.calculate(
            e.payment_plan_status || e.status,
            e.next_due_date
          );

          return {
            ...e,
            effective_status: effectiveStatus,
            certificate: certMap.get(e.course_id) || certMap.get(e.course?.id || '') || e.certificate
          };
        });

        this.enrolledCourses.set(enriched);
      } catch (err) {
        const calculated: StudentEnrollment[] = validEnrollments.map((e) => ({
          ...e,
          effective_status: EnrollmentStatusCalculator.calculate(
            e.payment_plan_status || e.status,
            e.next_due_date
          )
        }));
        this.enrolledCourses.set(calculated);
      }

      this.loading.set(false);
      this.cdr.markForCheck();
    });
  }

  // --- BADGES Y LABELS (5.1) ---
  getBadgeClass(status?: EffectiveEnrollmentStatus): string {
    switch (status) {
      case 'active':
        return 'bg-emerald-500 text-white border-emerald-600';
      case 'grace_period':
        return 'bg-amber-500 text-slate-900 border-amber-600';
      case 'suspended':
        return 'bg-rose-600 text-white border-rose-700';
      case 'pending_payment':
        return 'bg-slate-600 text-white border-slate-700';
      case 'completed':
        return 'bg-blue-600 text-white border-blue-700';
      case 'scholarship':
        return 'bg-cyan-500 text-white border-cyan-600';
      default:
        return 'bg-slate-500 text-white border-slate-600';
    }
  }

  getBadgeLabel(enrollment: StudentEnrollment): string {
    switch (enrollment.effective_status) {
      case 'active': {
        const due = enrollment.next_due_date ? new Date(enrollment.next_due_date).toLocaleDateString('es-AR') : '';
        return due ? `● Al día — Vto: ${due}` : '● Al día';
      }
      case 'grace_period': {
        if (enrollment.next_due_date) {
          const deadline = new Date(new Date(enrollment.next_due_date).getTime() + 7 * 86400000).toLocaleDateString('es-AR');
          return `⚠️ En gracia hasta ${deadline}`;
        }
        return '⚠️ En período de gracia';
      }
      case 'suspended':
        return '❌ Acceso suspendido';
      case 'pending_payment':
        return '⏳ Pendiente de pago';
      case 'completed':
        return '✓ Curso completado';
      case 'scholarship':
        return '🎓 Becado';
      default:
        return 'Matriculado';
    }
  }

  // --- MODAL PAGAR CUOTA (5.3) ---
  openPayModal(enrollment: StudentEnrollment) {
    this.selectedEnrollmentForPay.set(enrollment);
    const amount = enrollment.installment_amount || (enrollment.agreed_price ? Math.round(enrollment.agreed_price / (enrollment.installments_count || 1)) : 0);
    this.proofAmount.set(amount);
    this.proofNotes.set('');
    this.selectedProofFile.set(null);
    this.showPayModal.set(true);
  }

  closePayModal() {
    this.showPayModal.set(false);
    this.selectedEnrollmentForPay.set(null);
    this.selectedProofFile.set(null);
  }

  onProofFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedProofFile.set(input.files[0]);
    }
  }

  copyToClipboard(text: string, label: string) {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      this.toastService.show(`${label} copiado al portapapeles: ${text}`, 'success');
    }
  }

  async submitProof() {
    const enrollment = this.selectedEnrollmentForPay();
    const file = this.selectedProofFile();
    if (!enrollment || !file) {
      this.toastService.show('Seleccioná el archivo de comprobante', 'error');
      return;
    }

    const amount = Number(this.proofAmount());
    if (isNaN(amount) || amount <= 0) {
      this.toastService.show('Ingresá un importe válido', 'error');
      return;
    }

    this.isSubmittingProof.set(true);
    try {
      const session = await this.authService.getSession();
      const userId = session?.user?.id || enrollment.user_id;

      // 1. Subir archivo a bucket 'comprobantes'
      const cleanFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const storagePath = `${userId || 'anon'}/${Date.now()}_${cleanFileName}`;

      const { data: uploadData, error: uploadError } = await this.supabase.storage
        .from('comprobantes')
        .upload(storagePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('Error uploading payment proof:', uploadError);
        this.toastService.show('Error al subir el comprobante a almacenamiento: ' + uploadError.message, 'error');
        return;
      }

      // Obtener URL del archivo
      const { data: publicUrlData } = this.supabase.storage
        .from('comprobantes')
        .getPublicUrl(storagePath);

      const fileUrl = publicUrlData?.publicUrl || storagePath;

      // 2. Insertar en tabla academy_payment_proofs
      const { error: insertError } = await this.supabase
        .from('academy_payment_proofs')
        .insert({
          enrollment_id: enrollment.id,
          user_id: userId,
          amount: amount,
          file_url: fileUrl,
          notes: this.proofNotes().trim() || null,
          status: 'pending'
        });

      if (insertError) {
        console.error('Error registering payment proof record:', insertError);
        this.toastService.show('Error al registrar el comprobante: ' + insertError.message, 'error');
        return;
      }

      this.toastService.show('Comprobante recibido correctamente. Lo verificaremos a la brevedad.', 'success');
      this.closePayModal();
    } catch (e: any) {
      console.error('Unexpected error submitting proof:', e);
      this.toastService.show(e.message || 'Error inesperado al enviar comprobante', 'error');
    } finally {
      this.isSubmittingProof.set(false);
      this.cdr.markForCheck();
    }
  }

  onImgError(event: Event): void {
    const img = event.target as HTMLImageElement;
    if (img && !img.src.includes('assets/img/branding/inicio.jpg')) {
      img.src = 'assets/img/branding/inicio.jpg';
    }
  }
}
