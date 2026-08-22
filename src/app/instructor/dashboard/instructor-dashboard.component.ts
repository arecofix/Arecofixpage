import {
  Component,
  OnInit,
  inject,
  signal,
  computed,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CourseRepository } from '@app/features/courses/domain/repositories/course.repository';
import { Course } from '@app/features/courses/domain/entities/course.entity';
import { AuthService } from '@app/core/services/auth.service';

@Component({
  selector: 'app-instructor-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <div class="min-h-screen bg-slate-50 dark:bg-slate-900 py-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Header -->
        <div
          class="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6"
        >
          <div class="relative">
            <div
              class="absolute -left-4 top-0 w-1 h-full bg-gradient-to-b from-indigo-500 to-purple-600 rounded-r-lg"
            ></div>
            <h1
              class="text-4xl font-black text-slate-900 dark:text-white mb-2 tracking-tight"
            >
              <i
                class="fas fa-chalkboard-user text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600 mr-3"
              ></i
              >Mis Programas
            </h1>
            <p class="text-base text-slate-500 dark:text-slate-400 font-medium">
              Gestiona los cursos que impartes en la academia.
            </p>
          </div>
          <a
            routerLink="/instructor/builder"
            class="group relative px-6 py-3 rounded-2xl bg-indigo-600 text-white font-bold shadow-xl shadow-indigo-500/30 hover:shadow-2xl hover:-translate-y-1 transition-all overflow-hidden"
          >
            <div
              class="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"
            ></div>
            <div class="flex items-center gap-3 relative z-10">
              <div
                class="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform"
              >
                <i class="fas fa-plus text-sm"></i>
              </div>
              <span>Proponer Curso</span>
            </div>
          </a>
        </div>

        @if (loading()) {
          <div class="flex justify-center py-20">
            <div
              class="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"
            ></div>
          </div>
        } @else if (myCourses().length === 0) {
          <div
            class="text-center py-24 bg-white/50 dark:bg-slate-800/30 backdrop-blur-sm rounded-3xl border border-dashed border-slate-300 dark:border-slate-700"
          >
            <div
              class="w-24 h-24 bg-indigo-50 dark:bg-indigo-900/20 rounded-full flex items-center justify-center mx-auto mb-6 text-indigo-300 dark:text-indigo-500 text-4xl shadow-inner"
            >
              <i class="fas fa-lightbulb"></i>
            </div>
            <h3 class="text-2xl font-black text-slate-900 dark:text-white mb-2">
              Aún no tienes cursos propuestos
            </h3>
            <p
              class="text-slate-500 dark:text-slate-400 max-w-md mx-auto text-lg mb-8"
            >
              Comienza a crear tu primer curso y compártelo con la comunidad.
            </p>
            <a
              routerLink="/instructor/builder"
              class="btn bg-indigo-600 hover:bg-indigo-700 text-white border-none rounded-xl px-8 shadow-lg shadow-indigo-500/30"
            >
              Sugerir mi primera capacitación
            </a>
          </div>
        } @else {
          <div
            class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
          >
            @for (course of paginatedCourses(); track course.id) {
              <div
                class="group bg-white dark:bg-slate-800 rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl border border-slate-200/80 dark:border-slate-700/80 hover:border-indigo-300 dark:hover:border-indigo-500/50 transition-all duration-500 flex flex-col h-full hover:-translate-y-1"
              >
                <!-- Image Banner & Status -->
                <div
                  class="relative h-48 sm:h-56 overflow-hidden bg-slate-100 dark:bg-slate-900"
                >
                  <div
                    class="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent z-10"
                  ></div>
                  <img
                    [src]="course.image_url || 'assets/img/branding/inicio.jpg'"
                    alt="Course Image"
                    class="w-full h-full object-cover group-hover:scale-110 group-hover:rotate-1 transition-transform duration-700"
                  />

                  <!-- Status Badge -->
                  <div class="absolute top-4 left-4 z-20">
                    <span
                      class="inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold shadow-lg backdrop-blur text-white"
                      [ngClass]="{
                        'bg-yellow-500/90': course.status === 'PENDING',
                        'bg-emerald-500/90':
                          course.status === 'APPROVED' ||
                          course.status === 'PUBLISHED',
                        'bg-rose-500/90': course.status === 'REJECTED',
                        'bg-slate-800/90':
                          course.status === 'DRAFT' || !course.status,
                      }"
                    >
                      @if (course.status === 'PENDING') {
                        <i class="fas fa-clock mr-1.5"></i> Pendiente
                      } @else if (
                        course.status === 'APPROVED' ||
                        course.status === 'PUBLISHED'
                      ) {
                        <div
                          class="w-1.5 h-1.5 rounded-full bg-white animate-pulse mr-1.5"
                        ></div>
                        Público
                      } @else if (course.status === 'REJECTED') {
                        <i class="fas fa-ban mr-1.5"></i> Rechazado
                      } @else {
                        <i class="fas fa-pen-ruler mr-1.5"></i> Borrador
                      }
                    </span>
                  </div>

                  <!-- Title Overlay -->
                  <div class="absolute bottom-4 left-4 right-4 z-20">
                    <h4
                      class="text-xl font-black text-white leading-tight line-clamp-2"
                      [title]="course.title"
                    >
                      {{ course.title }}
                    </h4>
                  </div>
                </div>

                <!-- Action Bar -->
                <div class="p-5 flex-grow flex flex-col justify-end">
                  @if (course.status === 'REJECTED' && course.admin_feedback) {
                    <div
                      class="mb-4 p-3 bg-rose-50 dark:bg-rose-900/20 rounded-xl border border-rose-100 dark:border-rose-800/30"
                    >
                      <p class="text-sm text-rose-800 dark:text-rose-300">
                        <span class="font-bold"
                          ><i class="fas fa-circle-exclamation mr-1"></i>
                          Feedback:</span
                        >
                        {{ course.admin_feedback }}
                      </p>
                    </div>
                  }

                  <div class="flex justify-end gap-2 mt-auto">
                    <a
                      [routerLink]="['/instructor/students', course.id]"
                      class="btn flex-1 bg-green-50 hover:bg-green-600 text-green-600 hover:text-white dark:bg-green-900/30 dark:hover:bg-green-600 dark:text-green-400 border-none rounded-xl h-12 transition-colors shadow-sm"
                    >
                      <i class="fas fa-users mr-2"></i> Alumnos
                    </a>
                    <a
                      [routerLink]="['/instructor/builder', course.id]"
                      class="btn flex-1 bg-indigo-50 hover:bg-indigo-600 text-indigo-600 hover:text-white dark:bg-indigo-900/30 dark:hover:bg-indigo-600 dark:text-indigo-400 border-none rounded-xl h-12 transition-colors shadow-sm"
                    >
                      <i class="fas fa-pen mr-2"></i> Editar
                    </a>
                  </div>
                </div>
              </div>
            }
          </div>

          <!-- Pagination Controls -->
          @if (totalPages() > 1) {
            <div class="flex justify-center items-center gap-2 mt-12">
              <button
                class="btn btn-circle btn-sm bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 shadow-sm"
                [disabled]="currentPage() === 1"
                (click)="currentPage.set(currentPage() - 1)"
              >
                <i class="fas fa-chevron-left"></i>
              </button>

              <div class="flex gap-1">
                @for (page of [].constructor(totalPages()); track $index) {
                  <button
                    class="w-8 h-8 rounded-full text-sm font-bold transition-all"
                    [class.bg-indigo-600]="currentPage() === $index + 1"
                    [class.text-white]="currentPage() === $index + 1"
                    [class.shadow-md]="currentPage() === $index + 1"
                    [class.bg-transparent]="currentPage() !== $index + 1"
                    [class.text-slate-500]="currentPage() !== $index + 1"
                    [class.hover:bg-slate-200]="currentPage() !== $index + 1"
                    [class.dark:text-slate-400]="currentPage() !== $index + 1"
                    [class.dark:hover:bg-slate-800]="
                      currentPage() !== $index + 1
                    "
                    (click)="currentPage.set($index + 1)"
                  >
                    {{ $index + 1 }}
                  </button>
                }
              </div>

              <button
                class="btn btn-circle btn-sm bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 shadow-sm"
                [disabled]="currentPage() === totalPages()"
                (click)="currentPage.set(currentPage() + 1)"
              >
                <i class="fas fa-chevron-right"></i>
              </button>
            </div>
          }
        }
      </div>
    </div>
  `,
})
export class InstructorDashboardComponent implements OnInit {
  private courseRepo = inject(CourseRepository);
  private authService = inject(AuthService);

  myCourses = signal<Course[]>([]);
  loading = signal(true);

  // Pagination State
  currentPage = signal(1);
  pageSize = signal(6);

  paginatedCourses = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize();
    return this.myCourses().slice(start, start + this.pageSize());
  });

  totalPages = computed(() =>
    Math.ceil(this.myCourses().length / this.pageSize()),
  );

  async ngOnInit() {
    const user = this.authService.getCurrentProfile();
    if (!user) {
      this.loading.set(false);
      return;
    }

    try {
      const allCourses = await this.courseRepo.getAll();
      const mine = allCourses.filter((c) => c.author_id === user.id);
      this.myCourses.set(mine);
    } catch (e) {
      console.error(e);
    } finally {
      this.loading.set(false);
    }
  }
}
