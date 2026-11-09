import {
  Component,
  inject,
  OnInit,
  signal,
  computed,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SUPABASE_CLIENT } from '@app/core/di/supabase-token';
import { AuthService } from '@app/core/services/auth.service';
import { ToastService } from '@app/shared/services/toast.service';
import { CoursesService, Course } from '@app/core/services/courses.service';
import { RegisterAcademyPaymentUseCase } from '@app/features/courses/application/usecases/register-academy-payment.usecase';
import { CreateEnrollmentUseCase } from '@app/features/courses/application/usecases/create-enrollment.usecase';
import { AcademyPaymentRepository } from '@app/features/courses/domain/repositories/academy-payment.repository';
import { ReceiptPdfService } from '@app/features/courses/application/services/receipt-pdf.service';
import { EnrollmentStatusCalculator } from '@app/features/courses/domain/services/enrollment-status.calculator';
import { EffectiveEnrollmentStatus } from '@app/features/courses/domain/entities/course.entity';
import { AcademyPayment } from '@app/features/courses/domain/entities/academy-subscription.entity';

export interface StudentEnrollmentRow {
  id: string;
  user_id: string | null;
  full_name: string;
  email: string;
  phone: string | null;
  dni: string | null;
  course_id: string;
  course_title: string;
  status: string;
  agreed_price: number;
  installments_count: number;
  installment_amount: number;
  installments_paid: number;
  next_due_date: string | null;
  expires_at: string | null;
  payment_plan_status: string;
  effective_status: EffectiveEnrollmentStatus;
  notes: string | null;
  created_at: string;
}

@Component({
  selector: 'app-admin-academy-subscriptions-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './admin-academy-subscriptions-page.html'
})
export class AdminAcademySubscriptionsPage implements OnInit {
  private supabase = inject(SUPABASE_CLIENT);
  private authService = inject(AuthService);
  private toastService = inject(ToastService);
  private coursesService = inject(CoursesService);
  private registerPaymentUseCase = inject(RegisterAcademyPaymentUseCase);
  private createEnrollmentUseCase = inject(CreateEnrollmentUseCase);
  private paymentRepo = inject(AcademyPaymentRepository);
  private receiptPdfService = inject(ReceiptPdfService);
  private cdr = inject(ChangeDetectorRef);

  loading = signal(true);
  enrollments = signal<StudentEnrollmentRow[]>([]);
  courses = signal<Course[]>([]);
  searchQuery = signal('');
  selectedFilter = signal<'all' | 'pending_payment' | 'active' | 'grace_period' | 'suspended' | 'scholarship' | 'completed' | 'cancelled'>('all');

  // Stats computed
  stats = computed(() => {
    const list = this.enrollments().filter(e => e.status === 'confirmed' && e.payment_plan_status !== 'cancelled');
    return {
      total: list.length,
      active: list.filter(e => e.effective_status === 'active').length,
      pending: list.filter(e => e.effective_status === 'pending_payment' || e.effective_status === 'grace_period').length,
      scholarship: list.filter(e => e.effective_status === 'scholarship').length,
      suspended: list.filter(e => e.effective_status === 'suspended').length
    };
  });

  // Filtered enrollments
  filteredEnrollments = computed(() => {
    let list = this.enrollments();
    const q = this.searchQuery().trim().toLowerCase();
    const f = this.selectedFilter();

    if (f !== 'all') {
      list = list.filter(e => e.effective_status === f);
    }

    if (q) {
      list = list.filter(e =>
        e.full_name.toLowerCase().includes(q) ||
        e.email.toLowerCase().includes(q) ||
        (e.dni && e.dni.toLowerCase().includes(q)) ||
        e.course_title.toLowerCase().includes(q)
      );
    }

    return list;
  });

  // Modal State: Registrar Pago
  showPaymentModal = signal(false);
  isSubmittingPayment = signal(false);
  selectedEnrollmentForPayment = signal<StudentEnrollmentRow | null>(null);
  paymentAmount = signal(0);
  paymentMethod = signal<'cash' | 'transfer' | 'mercadopago' | 'other'>('cash');
  paymentDate = signal(new Date().toISOString().substring(0, 10));
  paymentNotes = signal('');
  generatePdfCheckbox = signal(true);

  // Modal State: Historial de Pagos & Anulación
  showHistoryModal = signal(false);
  selectedEnrollmentForHistory = signal<StudentEnrollmentRow | null>(null);
  historyPayments = signal<AcademyPayment[]>([]);
  historyLoading = signal(false);
  isVoiding = signal<Record<string, boolean>>({});

  // Modal State: Matricular Alumno Manualmente
  showEnrollModal = signal(false);
  isSubmittingEnroll = signal(false);
  enrollStudentName = signal('');
  enrollEmail = signal('');
  enrollPhone = signal('');
  enrollCourseId = signal('');
  enrollPrice = signal(120000);
  enrollInstallments = signal(6);
  enrollStartDate = signal(new Date().toISOString().substring(0, 10));
  enrollPaymentDay = signal(10);
  enrollIsScholarship = signal(false);
  enrollNotes = signal('');

  ngOnInit() {
    this.loadData();
  }

  async loadData() {
    this.loading.set(true);
    try {
      await Promise.all([this.loadEnrollments(), this.loadCourses()]);
    } finally {
      this.loading.set(false);
      this.cdr.markForCheck();
    }
  }

  async loadEnrollments() {
    try {
      const { data, error } = await this.supabase
        .from('course_enrollments')
        .select(`
          id,
          user_id,
          full_name,
          email,
          phone,
          status,
          agreed_price,
          installments_count,
          installment_amount,
          installments_paid,
          next_due_date,
          expires_at,
          payment_plan_status,
          notes,
          created_at,
          courses (id, title)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching enrollments:', error);
        return;
      }

      // Fetch profiles to get DNI if available
      const userIds = (data || []).map((e: any) => e.user_id).filter(Boolean);
      let profilesMap: Record<string, { dni?: string; phone?: string }> = {};
      if (userIds.length > 0) {
        const { data: profiles } = await this.supabase
          .from('profiles')
          .select('id, dni, phone')
          .in('id', userIds);
        if (profiles) {
          profilesMap = profiles.reduce((acc: any, p: any) => ({ ...acc, [p.id]: p }), {});
        }
      }

      const rows: StudentEnrollmentRow[] = (data || []).map((e: any) => {
        const prof = e.user_id ? profilesMap[e.user_id] : null;
        const effectiveStatus = EnrollmentStatusCalculator.calculate(
          e.payment_plan_status || e.status,
          e.next_due_date
        );

        return {
          id: e.id,
          user_id: e.user_id,
          full_name: e.full_name || 'Sin Nombre',
          email: e.email || '',
          phone: e.phone || prof?.phone || null,
          dni: prof?.dni || null,
          course_id: e.courses?.id || '',
          course_title: e.courses?.title || 'Curso General',
          status: e.status,
          agreed_price: Number(e.agreed_price || 0),
          installments_count: Number(e.installments_count || 1),
          installment_amount: Number(e.installment_amount || 0),
          installments_paid: Number(e.installments_paid || 0),
          next_due_date: e.next_due_date,
          expires_at: e.expires_at,
          payment_plan_status: e.payment_plan_status || 'none',
          effective_status: effectiveStatus,
          notes: e.notes,
          created_at: e.created_at
        };
      });

      this.enrollments.set(rows);
    } catch (e) {
      console.error('Unexpected error loading enrollments:', e);
    }
  }

  async loadCourses() {
    this.coursesService.getCourses().subscribe({
      next: (res) => {
        const list = res.data || [];
        this.courses.set(list);
        if (list.length > 0 && !this.enrollCourseId()) {
          this.enrollCourseId.set(list[0].id);
          this.onCourseSelectionChange(list[0].id);
        }
        this.cdr.markForCheck();
      }
    });
  }

  onCourseSelectionChange(courseId: string) {
    const course = this.courses().find(c => c.id === courseId);
    if (course) {
      const isCarrera = (course.slug || '').includes('carrera') || (course.title || '').toLowerCase().includes('carrera');
      const isAndroid = (course.slug || '').includes('android') || (course.title || '').toLowerCase().includes('android');

      if (isCarrera) {
        this.enrollInstallments.set(6);
        this.enrollPrice.set(720000); // 6 cuotas de $120.000
      } else if (isAndroid) {
        this.enrollInstallments.set(3);
        this.enrollPrice.set(270000); // 3 cuotas de $90.000
      } else {
        const monthly = Number(course.sale_price || course.price || 120000);
        this.enrollInstallments.set(6);
        this.enrollPrice.set(monthly * 6);
      }
    }
  }

  // --- REGISTRAR PAGO (4.2) ---
  openPaymentModal(enrollment: StudentEnrollmentRow) {
    this.selectedEnrollmentForPayment.set(enrollment);
    this.paymentAmount.set(enrollment.installment_amount || Math.round(enrollment.agreed_price / (enrollment.installments_count || 1)));
    this.paymentMethod.set('cash');
    this.paymentDate.set(new Date().toISOString().substring(0, 10));
    this.paymentNotes.set('');
    this.generatePdfCheckbox.set(true);
    this.showPaymentModal.set(true);
  }

  closePaymentModal() {
    this.showPaymentModal.set(false);
    this.selectedEnrollmentForPayment.set(null);
  }

  async submitPayment() {
    const enrollment = this.selectedEnrollmentForPayment();
    if (!enrollment) return;

    const amount = Number(this.paymentAmount());
    if (isNaN(amount) || amount <= 0) {
      this.toastService.show('El monto debe ser estrictamente mayor a 0', 'error');
      return;
    }

    const todayStr = new Date().toISOString().substring(0, 10);
    if (this.paymentDate() > todayStr) {
      this.toastService.show('La fecha de pago no puede ser futura', 'error');
      return;
    }

    this.isSubmittingPayment.set(true);
    try {
      const currentProfile = this.authService.getCurrentProfile();
      const adminUserId = currentProfile?.id || (await this.authService.getSession())?.user?.id || '9da10a3a-e000-4a5e-8671-4f4c55266dbe';

      const periodNumber = enrollment.installments_paid + 1;
      const res = await this.registerPaymentUseCase.execute({
        enrollmentId: enrollment.id,
        amount,
        paymentMethod: this.paymentMethod(),
        paidAt: new Date(this.paymentDate()),
        periodNumber,
        notes: this.paymentNotes().trim() || undefined,
        createdBy: adminUserId
      });

      if (!res.success || !res.data) {
        this.toastService.show(res.error || 'Error al registrar el pago', 'error');
        return;
      }

      const receiptNumber = res.data.receiptNumber;
      this.toastService.show(`Pago registrado exitosamente. Recibo: ${receiptNumber}`, 'success');

      // Generar y descargar PDF si checkbox está marcado
      if (this.generatePdfCheckbox()) {
        try {
          const receiptData = {
            receiptNumber,
            studentName: enrollment.full_name,
            studentEmail: enrollment.email,
            studentPhone: enrollment.phone || undefined,
            courseTitle: enrollment.course_title,
            periodNumber,
            installmentsCount: enrollment.installments_count,
            amount,
            paymentMethod: this.paymentMethod(),
            paidAt: this.paymentDate(),
            notes: this.paymentNotes().trim() || undefined
          };

          const { blob, doc } = await this.receiptPdfService.generateReceiptPdf(receiptData);
          doc.save(`${receiptNumber}.pdf`);

          // Guardar en Supabase Storage
          await this.receiptPdfService.uploadReceiptToStorage(receiptNumber, blob);
        } catch (pdfErr) {
          console.warn('Error al generar PDF de recibo:', pdfErr);
        }
      }

      this.closePaymentModal();
      await this.loadEnrollments();
    } catch (e: any) {
      this.toastService.show(e.message || 'Error inesperado al registrar el pago', 'error');
    } finally {
      this.isSubmittingPayment.set(false);
      this.cdr.markForCheck();
    }
  }

  // --- HISTORIAL Y ANULACIÓN (4.3) ---
  async openHistoryModal(enrollment: StudentEnrollmentRow) {
    this.selectedEnrollmentForHistory.set(enrollment);
    this.showHistoryModal.set(true);
    this.historyLoading.set(true);
    try {
      const payments = await this.paymentRepo.getPaymentsByEnrollment(enrollment.id);
      this.historyPayments.set(payments);
    } catch (e) {
      console.error('Error fetching payment history:', e);
    } finally {
      this.historyLoading.set(false);
      this.cdr.markForCheck();
    }
  }

  closeHistoryModal() {
    this.showHistoryModal.set(false);
    this.selectedEnrollmentForHistory.set(null);
    this.historyPayments.set([]);
  }

  async voidPayment(payment: AcademyPayment) {
    const reason = prompt(`¿Motivo de anulación para el recibo ${payment.receipt_number || payment.id}?`);
    if (!reason || !reason.trim()) {
      return;
    }

    const currentProfile = this.authService.getCurrentProfile();
    const adminUserId = currentProfile?.id || (await this.authService.getSession())?.user?.id || '9da10a3a-e000-4a5e-8671-4f4c55266dbe';

    this.isVoiding.update(map => ({ ...map, [payment.id]: true }));
    try {
      await this.paymentRepo.voidPayment(payment.id, adminUserId, reason.trim());
      this.toastService.show(`Recibo ${payment.receipt_number} anulado correctamente y egreso asentado en caja.`, 'info');

      // Refresh modal history & enrollments
      const enrollment = this.selectedEnrollmentForHistory();
      if (enrollment) {
        const payments = await this.paymentRepo.getPaymentsByEnrollment(enrollment.id);
        this.historyPayments.set(payments);
      }
      await this.loadEnrollments();
    } catch (e: any) {
      this.toastService.show(e.message || 'Error al anular pago', 'error');
    } finally {
      this.isVoiding.update(map => ({ ...map, [payment.id]: false }));
      this.cdr.markForCheck();
    }
  }

  // --- MATRICULACIÓN MANUAL (4.4) ---
  openEnrollModal() {
    this.enrollStudentName.set('');
    this.enrollEmail.set('');
    this.enrollPhone.set('');
    this.enrollStartDate.set(new Date().toISOString().substring(0, 10));
    this.enrollPaymentDay.set(10);
    this.enrollIsScholarship.set(false);
    this.enrollNotes.set('');
    if (this.courses().length > 0) {
      this.enrollCourseId.set(this.courses()[0].id);
      this.onCourseSelectionChange(this.courses()[0].id);
    } else {
      this.enrollInstallments.set(6);
      this.enrollPrice.set(720000);
    }
    this.showEnrollModal.set(true);
  }

  closeEnrollModal() {
    this.showEnrollModal.set(false);
  }

  async submitEnrollment() {
    const name = this.enrollStudentName().trim();
    const email = this.enrollEmail().trim();
    const courseId = this.enrollCourseId();

    if (!name || !email || !courseId) {
      this.toastService.show('Completa los campos obligatorios (Nombre, Email y Curso)', 'error');
      return;
    }

    this.isSubmittingEnroll.set(true);
    try {
      const res = await this.createEnrollmentUseCase.execute({
        studentName: name,
        email,
        phone: this.enrollPhone().trim() || undefined,
        courseId,
        agreedPrice: Number(this.enrollPrice()),
        installmentsCount: Number(this.enrollInstallments()),
        startDate: new Date(this.enrollStartDate()),
        paymentDay: Number(this.enrollPaymentDay()),
        isScholarship: this.enrollIsScholarship(),
        notes: this.enrollNotes().trim() || undefined
      });

      if (!res.success || !res.enrollment) {
        this.toastService.show(res.error || 'Error al matricular alumno', 'error');
        return;
      }

      this.toastService.show('Alumno matriculado exitosamente', 'success');
      this.closeEnrollModal();
      await this.loadEnrollments();

      // Si no es becado, abrir automáticamente el modal de pago para la cuota 1
      if (!this.enrollIsScholarship()) {
        const found = this.enrollments().find(e => e.id === res.enrollment?.id);
        if (found) {
          this.openPaymentModal(found);
        }
      }
    } catch (e: any) {
      this.toastService.show(e.message || 'Error inesperado al matricular', 'error');
    } finally {
      this.isSubmittingEnroll.set(false);
      this.cdr.markForCheck();
    }
  }

  // --- EXPORTAR CSV ---
  exportCsv() {
    const list = this.filteredEnrollments();
    if (list.length === 0) {
      this.toastService.show('No hay alumnos para exportar', 'info');
      return;
    }

    const headers = ['Alumno', 'Email', 'Telefono', 'DNI', 'Curso', 'Cuotas_Pagadas', 'Cuotas_Total', 'Importe_Cuota', 'Precio_Acordado', 'Estado', 'Proximo_Vencimiento', 'Fecha_Inscripcion'];
    const rows = list.map(e => [
      `"${e.full_name}"`,
      `"${e.email}"`,
      `"${e.phone || ''}"`,
      `"${e.dni || ''}"`,
      `"${e.course_title}"`,
      e.installments_paid,
      e.installments_count,
      e.installment_amount,
      e.agreed_price,
      `"${e.effective_status}"`,
      `"${e.next_due_date ? e.next_due_date.substring(0, 10) : ''}"`,
      `"${e.created_at.substring(0, 10)}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `alumnos_academia_${new Date().toISOString().substring(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    this.toastService.show('Reporte CSV descargado con éxito', 'success');
  }

  getStatusBadgeClass(status: EffectiveEnrollmentStatus | string): string {
    switch (status) {
      case 'active':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
      case 'grace_period':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 border-amber-200 dark:border-amber-800';
      case 'suspended':
        return 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300 border-rose-200 dark:border-rose-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 border-blue-200 dark:border-blue-800';
      case 'scholarship':
        return 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/40 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800';
      case 'cancelled':
        return 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300 border-slate-300';
      case 'pending_payment':
      default:
        return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700';
    }
  }

  getStatusLabel(status: EffectiveEnrollmentStatus | string, dueDate?: string | null): string {
    switch (status) {
      case 'active':
        return 'Al día';
      case 'grace_period': {
        if (dueDate) {
          const daysLeft = Math.max(0, Math.ceil((new Date(dueDate).getTime() + 7 * 86400000 - Date.now()) / 86400000));
          return `En gracia (${daysLeft}d)`;
        }
        return 'En gracia';
      }
      case 'suspended':
        return 'Suspendido';
      case 'completed':
        return 'Completado';
      case 'scholarship':
        return 'Becado';
      case 'cancelled':
        return 'Cancelado';
      case 'pending_payment':
      default:
        return 'Pendiente de pago';
    }
  }
}

// Alias for backwards compatibility
export { AdminAcademySubscriptionsPage as AdminStudentsAndMembershipsPage };
