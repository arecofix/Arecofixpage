import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoursesService, StudentEnrollment } from '@app/core/services/courses.service';
import { SUPABASE_CLIENT } from '@app/core/di/supabase-token';
import { ToastService } from '@app/shared/services/toast.service';

@Component({
  selector: 'app-admin-course-enrollments-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-course-enrollments-page.html',
})
export class AdminCourseEnrollmentsPage implements OnInit {
  private coursesService = inject(CoursesService);
  private supabase = inject(SUPABASE_CLIENT);
  private toastService = inject(ToastService);

  enrollments = signal<StudentEnrollment[]>([]);
  loading = signal(true);

  ngOnInit() {
    this.loadEnrollments();
  }

  loadEnrollments() {
    this.loading.set(true);
    this.coursesService.getEnrollments().subscribe({
      next: (res) => {
        this.enrollments.set(res.data || []);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error loading enrollments', err);
        this.loading.set(false);
      }
    });
  }

  async deleteEnrollment(id: string) {
    if (!confirm('¿Estás seguro de eliminar esta solicitud de inscripción?')) return;
    
    const { error } = await this.supabase
      .from('course_enrollments')
      .delete()
      .eq('id', id);

    if (error) {
      this.toastService.show('Error al eliminar inscripción', 'error');
      console.error(error);
    } else {
      this.toastService.show('Inscripción eliminada', 'success');
      this.enrollments.update(e => e.filter(en => en.id !== id));
    }
  }

  async markAsConfirmed(id: string) {
    const { error } = await this.supabase
      .from('course_enrollments')
      .update({ status: 'confirmed' })
      .eq('id', id);

    if (error) {
      this.toastService.show('Error al actualizar estado', 'error');
    } else {
      this.toastService.show('Estado actualizado', 'success');
      this.enrollments.update(e => e.map(en => en.id === id ? { ...en, status: 'confirmed' as const } : en));
    }
  }
}
