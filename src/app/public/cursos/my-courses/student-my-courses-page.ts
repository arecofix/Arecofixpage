import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CoursesService } from '@app/core/services/courses.service';
import { AuthService } from '@app/core/services/auth.service';

@Component({
  selector: 'app-student-my-courses-page',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="min-h-screen bg-slate-50 dark:bg-slate-900 py-12">
      <div class="container mx-auto px-4 max-w-6xl">
        
        <div class="mb-8">
            <h1 class="text-3xl font-bold text-slate-800 dark:text-white">Mis Cursos</h1>
            <p class="text-slate-600 dark:text-slate-400 mt-2">Accede al material y progreso de tus materias matriculadas.</p>
        </div>

        @if (loading()) {
            <div class="flex justify-center py-20">
                <span class="loading loading-spinner loading-lg text-indigo-500"></span>
            </div>
        } @else if (enrolledCourses().length === 0) {
            <div class="text-center py-20 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
                <div class="text-6xl mb-4 text-slate-300 dark:text-slate-600">
                    <i class="fas fa-graduation-cap"></i>
                </div>
                <h2 class="text-xl font-bold text-slate-700 dark:text-slate-200 mb-2">Aún no tienes cursos</h2>
                <p class="text-slate-500 dark:text-slate-400 mb-6 max-w-md mx-auto">
                    Explora nuestra academia y descubre el curso perfecto para llevar tus habilidades al siguiente nivel.
                </p>
                <a routerLink="/academy" class="btn btn-primary">
                    <i class="fas fa-search mr-2"></i> Explorar Cursos
                </a>
            </div>
        } @else {
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                @for (enrollment of enrolledCourses(); track enrollment.id) {
                    <div class="card bg-white dark:bg-slate-800 shadow-sm hover:shadow-md transition-all border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col">
                        <figure class="aspect-video relative bg-slate-100 dark:bg-slate-900">
                            @if (enrollment.course.image_url) {
                                <img [src]="enrollment.course.image_url" [alt]="enrollment.course.title" class="w-full h-full object-cover">
                            } @else {
                                <div class="flex items-center justify-center w-full h-full text-slate-300 dark:text-slate-600 text-4xl">
                                    <i class="fas fa-book"></i>
                                </div>
                            }
                            <div class="absolute top-3 right-3">
                                <span class="badge badge-success border-none text-white shadow-sm font-medium">Matriculado</span>
                            </div>
                        </figure>
                        <div class="card-body p-6 flex-1 flex flex-col">
                            <h2 class="card-title text-xl text-slate-800 dark:text-white leading-tight mb-2">
                                {{ enrollment.course.title }}
                            </h2>
                            <p class="text-slate-600 dark:text-slate-400 text-sm line-clamp-2 flex-1">
                                {{ enrollment.course.short_description || 'Sin descripción' }}
                            </p>
                            
                            <div class="divider my-2"></div>
                            
                            <div class="card-actions justify-end mt-2">
                                <a [routerLink]="['/academy', enrollment.course.slug, 'aula']" class="btn btn-primary w-full">
                                    <i class="fas fa-chalkboard-teacher mr-2"></i> Ir al Aula Virtual
                                </a>
                            </div>
                        </div>
                    </div>
                }
            </div>
        }
      </div>
    </div>
  `
})
export class StudentMyCoursesPage implements OnInit {
    private coursesService = inject(CoursesService);
    private authService = inject(AuthService);

    enrolledCourses = signal<any[]>([]);
    loading = signal(true);

    async ngOnInit() {
        const session = await this.authService.getSession();
        const userEmail = session?.user?.email;

        if (userEmail) {
            this.loadMyCourses(userEmail);
        } else {
            this.loading.set(false);
        }
    }

    loadMyCourses(email: string) {
        this.coursesService.getUserEnrolledCourses(email).subscribe(res => {
            this.enrolledCourses.set(res.data || []);
            this.loading.set(false);
        });
    }
}
