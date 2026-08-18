import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CoursesService } from '@app/core/services/courses.service';
import { AuthService } from '@app/core/services/auth.service';
import { CourseRepository } from '@app/features/courses/domain/repositories/course.repository';
import { Course } from '@app/features/courses/domain/entities/course.entity';

@Component({
  selector: 'app-student-my-courses-page',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="min-h-screen bg-slate-50 dark:bg-slate-900 py-12">
      <div class="container mx-auto px-4 max-w-6xl">
        
        <div class="mb-8">
            <h1 class="text-3xl font-bold text-slate-800 dark:text-white">Mi Academia</h1>
            <p class="text-slate-600 dark:text-slate-400 mt-2">Bienvenido a tu centro de aprendizaje y enseñanza.</p>
        </div>

        <!-- Role-based Tabs -->
        @if (isInstructor() || isAdmin()) {
          <div role="tablist" class="tabs tabs-boxed mb-8 p-1 bg-slate-200/50 dark:bg-slate-800/50 inline-flex">
            <a role="tab" class="tab h-10 px-6 font-bold" 
               [class.tab-active]="activeTab() === 'estudios'"
               [class.bg-white]="activeTab() === 'estudios'"
               [class.dark:bg-slate-700]="activeTab() === 'estudios'"
               [class.shadow-sm]="activeTab() === 'estudios'"
               (click)="activeTab.set('estudios')">
               <i class="fas fa-user-graduate mr-2"></i> Mis Estudios
            </a>
            <a role="tab" class="tab h-10 px-6 font-bold" 
               [class.tab-active]="activeTab() === 'instructor'"
               [class.bg-indigo-600]="activeTab() === 'instructor'"
               [class.text-white]="activeTab() === 'instructor'"
               [class.shadow-md]="activeTab() === 'instructor'"
               [class.shadow-indigo-500/30]="activeTab() === 'instructor'"
               (click)="activeTab.set('instructor')">
               <i class="fas fa-chalkboard-teacher mr-2"></i> Portal de Instructor
            </a>
          </div>
        }

        @if (loading()) {
            <div class="flex justify-center py-20">
                <span class="loading loading-spinner loading-lg text-indigo-500"></span>
            </div>
        } @else {
          <!-- TAB 1: Estudiante -->
          @if (activeTab() === 'estudios') {
            @if (enrolledCourses().length === 0) {
                <div class="text-center py-20 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
                    <div class="text-6xl mb-4 text-slate-300 dark:text-slate-600">
                        <i class="fas fa-graduation-cap"></i>
                    </div>
                    <h2 class="text-xl font-bold text-slate-700 dark:text-slate-200 mb-2">Aún no tienes cursos inscritos</h2>
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
          }
          
          <!-- TAB 2: Instructor -->
          @if (activeTab() === 'instructor') {
            <div class="bg-indigo-50 dark:bg-slate-800/80 rounded-3xl p-8 border border-indigo-100 dark:border-slate-700 mb-8 shadow-sm">
               <div class="flex flex-col md:flex-row items-center justify-between gap-6">
                 <div class="flex items-center gap-6">
                   <div class="w-20 h-20 rounded-full bg-indigo-600 flex items-center justify-center text-white text-3xl shadow-lg shadow-indigo-500/30">
                     <i class="fas fa-user-tie"></i>
                   </div>
                   <div>
                     <h2 class="text-2xl font-black text-slate-900 dark:text-white">Portal de Instructor</h2>
                     <p class="text-slate-600 dark:text-slate-400">Tienes <strong class="text-indigo-600 dark:text-indigo-400">{{ authoredCourses().length }}</strong> cursos propuestos/activos bajo tu cargo.</p>
                   </div>
                 </div>
                 <a routerLink="/instructor" class="btn bg-indigo-600 hover:bg-indigo-700 text-white border-none rounded-xl px-8 shadow-lg shadow-indigo-500/30 w-full md:w-auto h-14">
                   <i class="fas fa-external-link-alt mr-2"></i> Ingresar al Administrador
                 </a>
               </div>
            </div>

            @if (authoredCourses().length > 0) {
              <h3 class="font-bold text-xl text-slate-800 dark:text-white mb-4">Tus Programas Activos</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  @for (course of authoredCourses().slice(0, 3); track course.id) {
                      <div class="card bg-white dark:bg-slate-800 shadow-sm hover:shadow-md transition-all border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col">
                          <figure class="h-32 relative bg-slate-100 dark:bg-slate-900">
                              @if (course.image_url) {
                                  <img [src]="course.image_url" [alt]="course.title" class="w-full h-full object-cover">
                              }
                          </figure>
                          <div class="card-body p-5">
                              <h2 class="font-bold text-slate-800 dark:text-white text-lg leading-tight line-clamp-2">
                                  {{ course.title }}
                              </h2>
                              <div class="mt-4">
                                <a [routerLink]="['/instructor/builder', course.id]" class="btn btn-sm btn-outline border-indigo-200 text-indigo-600 hover:bg-indigo-600 hover:text-white w-full">
                                  <i class="fas fa-edit mr-1"></i> Editar Curso
                                </a>
                              </div>
                          </div>
                      </div>
                  }
              </div>
              @if (authoredCourses().length > 3) {
                 <div class="text-center mt-6">
                   <a routerLink="/instructor" class="btn btn-ghost text-indigo-600">Ver todos tus cursos <i class="fas fa-arrow-right ml-1"></i></a>
                 </div>
              }
            } @else {
              <div class="text-center py-12">
                 <div class="w-16 h-16 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400 text-2xl">
                   <i class="fas fa-lightbulb"></i>
                 </div>
                 <h3 class="text-lg font-bold text-slate-700 dark:text-slate-200">Aún no has propuesto cursos</h3>
                 <p class="text-slate-500 mb-4">Comienza a crear tu primer curso y compártelo.</p>
                 <a routerLink="/instructor/builder" class="btn btn-sm bg-indigo-600 hover:bg-indigo-700 text-white border-none">Sugerir Capacitación</a>
              </div>
            }
          }
        }
      </div>
    </div>
  `
})
export class StudentMyCoursesPage implements OnInit {
    private coursesService = inject(CoursesService);
    private authService = inject(AuthService);
    private courseRepo = inject(CourseRepository);

    enrolledCourses = signal<any[]>([]);
    authoredCourses = signal<Course[]>([]);
    
    loading = signal(true);
    activeTab = signal<'estudios' | 'instructor'>('estudios');
    
    isInstructor = signal(false);
    isAdmin = signal(false);

    async ngOnInit() {
        const session = await this.authService.getSession();
        const profile = this.authService.getCurrentProfile();
        
        if (profile) {
            this.isInstructor.set(profile.role === 'instructor');
            this.isAdmin.set(profile.role === 'admin' || profile.role === 'super_admin');
        }

        const userEmail = session?.user?.email;

        if (userEmail) {
            this.loadMyCourses(userEmail);
        } else {
            this.loading.set(false);
        }

        // If instructor/admin, pre-load authored courses
        if (profile && (this.isInstructor() || this.isAdmin())) {
            try {
               const allCourses = await this.courseRepo.getAll();
               const mine = allCourses.filter(c => c.author_id === profile.id);
               this.authoredCourses.set(mine);
            } catch (e) {
               console.error("Error loading instructor courses:", e);
            }
        }
    }

    loadMyCourses(email: string) {
        this.coursesService.getUserEnrolledCourses(email).subscribe(res => {
            this.enrolledCourses.set(res.data || []);
            this.loading.set(false);
        });
    }
}

