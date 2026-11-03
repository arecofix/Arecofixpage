import {
  Component,
  inject,
  OnInit,
  signal,
  computed,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CoursesService, Course } from '@app/core/services/courses.service';
import { CertificatesService, Certificate } from '@app/features/courses/application/services/certificates.service';
import { ToastService } from '@app/shared/services/toast.service';
import { SUPABASE_CLIENT } from '@app/core/di/supabase-token';

@Component({
  selector: 'app-admin-courses-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './admin-courses-page.html',
})
export class AdminCoursesPage implements OnInit {
  private coursesService = inject(CoursesService);
  private certificatesService = inject(CertificatesService);
  private toastService = inject(ToastService);
  private supabase = inject(SUPABASE_CLIENT);
  private cdr = inject(ChangeDetectorRef);

  courses = signal<Course[]>([]);
  certificates = signal<Certificate[]>([]);
  loading = signal(true);
  certificatesLoading = signal(false);
  activeTab = signal<'activos' | 'pendientes' | 'certificados'>('activos');

  // Pagination State
  currentPage = signal(1);
  pageSize = signal(6);

  // Dashboards computed metrics
  activeCoursesCount = computed(
    () => this.courses().filter((c) => c.status !== 'PENDING').length,
  );
  pendingCoursesCount = computed(
    () => this.courses().filter((c) => c.status === 'PENDING').length,
  );
  certificatesCount = computed(() => this.certificates().length);
  validCertificatesCount = computed(
    () => this.certificates().filter((c) => c.status !== 'revoked').length,
  );
  revokedCertificatesCount = computed(
    () => this.certificates().filter((c) => c.status === 'revoked').length,
  );

  filteredCourses = computed(() => {
    if (this.activeTab() === 'pendientes') {
      return this.courses().filter((c) => c.status === 'PENDING');
    }
    return this.courses().filter((c) => c.status !== 'PENDING');
  });

  paginatedCourses = computed(() => {
    const list = this.filteredCourses();
    const start = (this.currentPage() - 1) * this.pageSize();
    return list.slice(start, start + this.pageSize());
  });

  totalPages = computed(() =>
    Math.ceil(this.filteredCourses().length / this.pageSize()),
  );

  totalMonthlyRevenue = computed(() =>
    this.courses().reduce(
      (sum, c) => sum + (c.is_active ? Number(c.price || 0) : 0),
      0,
    ),
  );

  ngOnInit() {
    this.loadCourses();
    this.loadCertificates();
  }

  loadCourses() {
    this.loading.set(true);
    this.coursesService.getCourses().subscribe({
      next: (response: { data: Course[]; error: any }) => {
        this.courses.set(response.data || []);
        this.loading.set(false);
        this.cdr.markForCheck();
      },
      error: (err: any) => {
        console.error('Error loading courses', err);
        this.loading.set(false);
        this.cdr.markForCheck();
      },
    });
  }

  async loadCertificates() {
    this.certificatesLoading.set(true);
    try {
      const data = await this.certificatesService.getAllCertificatesAdmin();
      this.certificates.set(data);
    } catch (err) {
      console.error('Error loading certificates', err);
    } finally {
      this.certificatesLoading.set(false);
      this.cdr.markForCheck();
    }
  }

  /**
   * 1-Click Revoke Certificate Action
   */
  async revokeCertificate(cert: Certificate) {
    const confirmed = confirm(
      `¿Estás seguro de REVOCAR el certificado de ${cert.student_name}?\n\n` +
      `Curso: ${cert.course?.title || cert.course_id}\n` +
      `ID: ${cert.id}\n\n` +
      `El certificado perderá su validez técnica y la URL pública (/academy/verify/${cert.id}) ` +
      `mostrará "❌ Certificado Inválido" de inmediato.`
    );

    if (!confirmed) return;

    const res = await this.certificatesService.revokeCertificateById(cert.id, 'Revocado desde Panel Admin');
    if (res.success) {
      this.certificates.update((list) =>
        list.map((c) => (c.id === cert.id ? { ...c, status: 'revoked' as const } : c))
      );
      this.toastService.show(
        `Certificado de ${cert.student_name} revocado. Verificación pública invalidada.`,
        'info'
      );
      this.cdr.markForCheck();
    } else {
      this.toastService.show(`Error al revocar: ${res.error}`, 'error');
    }
  }

  /**
   * 1-Click Reactivate Certificate Action
   */
  async reactivateCertificate(cert: Certificate) {
    const confirmed = confirm(
      `¿Deseas REACTIVAR el certificado de ${cert.student_name}?\n` +
      `Volverá a mostrarse como "✅ Certificado Válido" en el portal público.`
    );

    if (!confirmed) return;

    const res = await this.certificatesService.reactivateCertificateById(cert.id);
    if (res.success) {
      this.certificates.update((list) =>
        list.map((c) => (c.id === cert.id ? { ...c, status: 'valid' as const } : c))
      );
      this.toastService.show(
        `Certificado de ${cert.student_name} reactivado exitosamente.`,
        'success'
      );
      this.cdr.markForCheck();
    } else {
      this.toastService.show(`Error al reactivar: ${res.error}`, 'error');
    }
  }

  async approveCourse(course: Course) {
    if (!confirm('Aprobar y publicar el curso "' + course.title + '"?')) return;

    try {
      const { error } = await this.supabase
        .from('courses')
        .update({ is_active: true })
        .eq('id', course.id);

      if (error) throw error;

      this.courses.update((current) =>
        current.map((c) =>
          c.id === course.id
            ? ({ ...c, is_active: true } as Course)
            : c,
        ),
      );
      this.cdr.markForCheck();
    } catch (err: any) {
      alert('Error al aprobar: ' + err.message);
    }
  }

  async deleteCourse(course: Course) {
    const action = course.status === 'PENDING' ? 'rechazar' : 'eliminar';
    if (
      !confirm(
        'Estas seguro de ' + action + ' el curso "' + course.title + '"?',
      )
    )
      return;

    this.coursesService.deleteCourse(course.id).subscribe({
      next: () => {
        this.courses.update((current) =>
          current.filter((c) => c.id !== course.id),
        );
        this.cdr.markForCheck();
      },
      error: (err: any) =>
        alert('Error al ' + action + ' el curso: ' + err.message),
    });
  }

  handleImageError(event: any) {
    event.target.src = '/assets/img/cursos/1.jpg';
  }

  getImageSrc(url: string | null | undefined): string {
    if (!url) return 'assets/img/cursos/1.jpg';
    if (url.startsWith('http') || url.startsWith('/')) {
      return url;
    }
    return '/' + url;
  }
}

