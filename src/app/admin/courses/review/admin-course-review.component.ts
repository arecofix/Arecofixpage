import {
  Component,
  OnInit,
  inject,
  signal,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CourseRepository } from '@app/features/courses/domain/repositories/course.repository';
import { Course } from '@app/features/courses/domain/entities/course.entity';
import { ReviewCourseProposalUseCase } from '@app/features/courses/application/usecases/review-course-proposal.usecase';

@Component({
  selector: 'app-admin-course-review',
  standalone: true,
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <div class="p-6">
      <h1 class="text-2xl font-bold mb-6">Revisión de Propuestas de Cursos</h1>

      @if (loading()) {
        <p>Cargando propuestas...</p>
      } @else if (pendingCourses().length === 0) {
        <p>No hay cursos pendientes de revisión.</p>
      } @else {
        <div class="grid gap-6">
          @for (course of pendingCourses(); track course.id) {
            <div class="bg-white p-6 rounded shadow border">
              <h2 class="text-xl font-bold mb-2">{{ course.title }}</h2>
              <p class="text-sm text-gray-500 mb-4">
                Instructor ID: {{ course.author_id }}
              </p>

              <div class="mb-4">
                <strong>Descripción:</strong>
                <p>{{ course.description }}</p>
              </div>

              <div class="mb-4">
                <strong>Video de Muestra:</strong>
                <a
                  [href]="course.preview_video_url"
                  target="_blank"
                  class="text-blue-600 hover:underline"
                  >Ver Video</a
                >
              </div>

              <div class="mt-6 border-t pt-4">
                <label class="block text-sm font-medium mb-1"
                  >Feedback (opcional o si se rechaza):</label
                >
                <textarea
                  [(ngModel)]="feedbacks[course.id]"
                  class="w-full border rounded p-2 mb-4"
                  rows="3"
                ></textarea>

                <div class="flex space-x-3">
                  <button
                    (click)="review(course.id, 'APPROVED')"
                    class="bg-green-600 text-white px-4 py-2 rounded"
                  >
                    Aprobar
                  </button>
                  <button
                    (click)="review(course.id, 'REJECTED')"
                    class="bg-red-600 text-white px-4 py-2 rounded"
                  >
                    Rechazar
                  </button>
                </div>
              </div>
            </div>
          }
        </div>
      }
    </div>
  `,
})
export class AdminCourseReviewComponent implements OnInit {
  private courseRepo = inject(CourseRepository);
  private reviewUseCase = inject(ReviewCourseProposalUseCase);

  pendingCourses = signal<Course[]>([]);
  loading = signal(true);

  feedbacks: Record<string, string> = {};

  async ngOnInit() {
    this.loadPending();
  }

  async loadPending() {
    this.loading.set(true);
    try {
      const all = await this.courseRepo.getAll();
      this.pendingCourses.set(all.filter((c) => c.status === 'PENDING'));
    } catch (e) {
      console.error(e);
    } finally {
      this.loading.set(false);
    }
  }

  async review(id: string, status: 'APPROVED' | 'REJECTED') {
    const fb = this.feedbacks[id] || '';
    if (status === 'REJECTED' && !fb) {
      alert('Debes incluir feedback al rechazar.');
      return;
    }

    await this.reviewUseCase.execute(id, status, fb);
    this.loadPending();
  }
}
