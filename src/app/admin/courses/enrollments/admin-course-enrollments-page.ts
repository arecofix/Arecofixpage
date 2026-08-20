import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CoursesService, StudentEnrollment } from '@app/core/services/courses.service';
import { SUPABASE_CLIENT } from '@app/core/di/supabase-token';
import { ToastService } from '@app/shared/services/toast.service';

@Component({
  selector: 'app-admin-course-enrollments-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-course-enrollments-page.html',
})
export class AdminCourseEnrollmentsPage implements OnInit {
  private coursesService = inject(CoursesService);
  private supabase = inject(SUPABASE_CLIENT);
  private toastService = inject(ToastService);

  enrollments = signal<StudentEnrollment[]>([]);
  courses = signal<any[]>([]);

  searchQuery = signal('');
  searchResults = signal<any[]>([]);
  selectedUser = signal<any>(null);
  selectedCourseId = signal('');
  isEnrolling = signal(false);
  loading = signal(true);

  ngOnInit() {
    this.loadEnrollments();
    this.loadCourses();
  }

  loadCourses() {
      this.coursesService.getCourses().subscribe(res => {
          this.courses.set(res.data || []);
      });
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

  searchUsers() {
      const query = this.searchQuery().trim();
      this.coursesService.searchUsersByEmail(query).subscribe(res => {
          this.searchResults.set(res.data || []);
      });
  }

  selectUser(user: any) {
      this.selectedUser.set(user);
      this.searchResults.set([]);
      this.searchQuery.set('');
  }

  clearSelectedUser() {
      this.selectedUser.set(null);
  }

  async enrollUser() {
      if (!this.selectedUser() || !this.selectedCourseId()) return;
      
      this.isEnrolling.set(true);
      const user = this.selectedUser();
      const courseId = this.selectedCourseId();
      const fullName = user.full_name || `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.email;

      const { data, error } = await this.coursesService.enrollStudentManually(courseId, user.email, fullName, user.phone);
      
      this.isEnrolling.set(false);
      if (error) {
          this.toastService.show('Error al matricular', 'error');
      } else {
          this.toastService.show('Usuario matriculado correctamente', 'success');
          this.selectedUser.set(null);
          this.selectedCourseId.set('');
          this.loadEnrollments(); // reload to show the new one
      }
  }
}
