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
  private supabase = inject(SUPABASE_CLIENT);
  private cdr = inject(ChangeDetectorRef);

  courses = signal<Course[]>([]);
  loading = signal(true);
  activeTab = signal<'activos' | 'pendientes'>('activos');

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

    // For rejection, we simply delete it or set status to rejected. We will use delete per standard.
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
    event.target.src = '/assets/img/cursos/1.jpg'; // Fallback to a valid image with absolute path
  }

  getImageSrc(url: string | null | undefined): string {
    if (!url) return 'assets/img/cursos/1.jpg'; // Usable default fallback
    if (url.startsWith('http') || url.startsWith('/')) {
      return url;
    }
    return '/' + url;
  }
}
