import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CourseRepository } from '@app/features/courses/domain/repositories/course.repository';
import { Course } from '@app/features/courses/domain/entities/course.entity';
import { AuthService } from '@app/core/services/auth.service';

@Component({
  selector: 'app-instructor-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center mb-8">
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Panel de Instructor</h1>
          <a routerLink="/instructor/builder" class="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition">
            + Proponer Nuevo Curso
          </a>
        </div>

        @if (loading()) {
          <div class="flex justify-center py-12">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        } @else if (myCourses().length === 0) {
          <div class="bg-white dark:bg-gray-800 rounded-xl p-12 text-center shadow-sm">
            <h3 class="text-xl font-medium text-gray-900 dark:text-white mb-2">Aún no tienes cursos propuestos</h3>
            <p class="text-gray-500 dark:text-gray-400 mb-6">Comienza a crear tu primer curso y compártelo con el mundo.</p>
            <a routerLink="/instructor/builder" class="text-indigo-600 font-medium hover:underline">Sugerir mi primera capacitación &rarr;</a>
          </div>
        } @else {
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            @for (course of myCourses(); track course.id) {
              <div class="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700">
                <img [src]="course.image_url || 'assets/img/branding/og-services.png'" class="w-full h-48 object-cover" alt="Course Image">
                <div class="p-6">
                  <div class="flex justify-between items-start mb-4">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                          [ngClass]="{
                            'bg-yellow-100 text-yellow-800': course.status === 'PENDING',
                            'bg-green-100 text-green-800': course.status === 'APPROVED' || course.status === 'PUBLISHED',
                            'bg-red-100 text-red-800': course.status === 'REJECTED',
                            'bg-gray-100 text-gray-800': course.status === 'DRAFT'
                          }">
                      {{ course.status || 'PUBLISHED' }}
                    </span>
                    <a [routerLink]="['/instructor/builder', course.id]" class="text-gray-400 hover:text-indigo-600 transition">
                      <i class="fas fa-edit"></i>
                    </a>
                  </div>
                  <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">{{ course.title }}</h3>
                  
                  @if (course.status === 'REJECTED' && course.admin_feedback) {
                    <div class="mt-4 p-3 bg-red-50 dark:bg-red-900/20 rounded border border-red-100 dark:border-red-800/30">
                      <p class="text-sm text-red-800 dark:text-red-300">
                        <span class="font-bold">Feedback:</span> {{ course.admin_feedback }}
                      </p>
                    </div>
                  }
                </div>
              </div>
            }
          </div>
        }
      </div>
    </div>
  `
})
export class InstructorDashboardComponent implements OnInit {
  private courseRepo = inject(CourseRepository);
  private authService = inject(AuthService);
  
  myCourses = signal<Course[]>([]);
  loading = signal(true);

  async ngOnInit() {
    const user = this.authService.getCurrentProfile();
    if (!user) {
      this.loading.set(false);
      return;
    }

    try {
      // In a real app, we would have a method getCoursesByAuthor(user.id)
      // Since CourseRepository might only have getAll(), we fetch all and filter for now.
      const allCourses = await this.courseRepo.getAll();
      const mine = allCourses.filter(c => c.author_id === user.id);
      this.myCourses.set(mine);
    } catch (e) {
      console.error(e);
    } finally {
      this.loading.set(false);
    }
  }
}
