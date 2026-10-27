import {
  Component,
  inject,
  OnInit,
  signal,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  CoursesService,
  Course,
  StudentEnrollment,
} from '@app/core/services/courses.service';
import { ToastService } from '@app/shared/services/toast.service';

export interface SearchUserResult {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  full_name?: string;
  phone?: string;
  avatar_url?: string;
  role?: string;
}

@Component({
  selector: 'app-admin-course-enrollments-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './admin-course-enrollments-page.html',
})
export class AdminCourseEnrollmentsPage implements OnInit {
  private coursesService = inject(CoursesService);
  private toastService = inject(ToastService);

  enrollments = signal<StudentEnrollment[]>([]);
  courses = signal<Course[]>([]);

  searchQuery = signal('');
  searchResults = signal<SearchUserResult[]>([]);
  selectedUser = signal<SearchUserResult | null>(null);
  selectedCourseId = signal('');
  isEnrolling = signal(false);
  loading = signal(true);

  ngOnInit() {
    this.loadEnrollments();
    this.loadCourses();
  }

  loadCourses() {
    this.coursesService.getCourses().subscribe((res) => {
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
      },
    });
  }

  async deleteEnrollment(id: string) {
    if (!confirm('¿Estás seguro de eliminar esta solicitud de inscripción?'))
      return;

    const { error } = await this.coursesService.deleteEnrollment(id);

    if (error) {
      this.toastService.show('Error al eliminar inscripción', 'error');
      console.error(error);
    } else {
      this.toastService.show('Inscripción eliminada', 'success');
      this.enrollments.update((e) => e.filter((en) => en.id !== id));
    }
  }

  async markAsConfirmed(id: string) {
    const { error } = await this.coursesService.updateEnrollmentStatus(id, 'confirmed');

    if (error) {
      this.toastService.show('Error al actualizar estado', 'error');
    } else {
      this.toastService.show('Estado actualizado', 'success');
      this.enrollments.update((e) =>
        e.map((en) =>
          en.id === id ? { ...en, status: 'confirmed' as const } : en,
        ),
      );
    }
  }

  searchUsers() {
    const query = this.searchQuery().trim();
    this.coursesService.searchUsersByEmail(query).subscribe((res) => {
      this.searchResults.set((res.data || []) as SearchUserResult[]);
    });
  }

  selectUser(user: SearchUserResult) {
    this.selectedUser.set(user);
    this.searchResults.set([]);
    this.searchQuery.set('');
  }

  clearSelectedUser() {
    this.selectedUser.set(null);
  }

  async enrollUser() {
    const user = this.selectedUser();
    const courseId = this.selectedCourseId();
    if (!user || !courseId) return;

    this.isEnrolling.set(true);
    const fullName =
      user.full_name ||
      `${user.first_name || ''} ${user.last_name || ''}`.trim() ||
      user.email;

    const { error } = await this.coursesService.enrollStudentManually(
      courseId,
      user.email,
      fullName,
      user.phone,
      user.id
    );

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
