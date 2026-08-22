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

@Component({
  selector: 'app-admin-courses-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <!-- Top Header & Actions -->
    <div
      class="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6"
    >
      <div class="relative">
        <div
          class="absolute -left-4 top-0 w-1 h-full bg-gradient-to-b from-indigo-500 to-purple-600 rounded-r-lg"
        ></div>
        <h2
          class="text-4xl font-black text-slate-900 dark:text-white mb-2 tracking-tight"
        >
          <i
            class="fas fa-graduation-cap text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600 mr-3"
          ></i
          >Academia Global
        </h2>
        <p class="text-base text-slate-500 dark:text-slate-400 font-medium">
          Control maestro de programas educativos, certificaciones y progreso.
        </p>
      </div>
      <a
        routerLink="/admin/courses/new"
        class="group relative px-6 py-3 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold shadow-xl shadow-slate-900/20 dark:shadow-white/10 hover:shadow-2xl hover:-translate-y-1 transition-all overflow-hidden"
      >
        <div
          class="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-600/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"
        ></div>
        <div class="flex items-center gap-3 relative z-10">
          <div
            class="w-8 h-8 rounded-full bg-white/20 dark:bg-slate-900/10 flex items-center justify-center group-hover:scale-110 transition-transform"
          >
            <i class="fas fa-plus text-sm"></i>
          </div>
          <span>Crear Programa</span>
        </div>
      </a>
    </div>

    <!-- Dashboards / Metrics Widgets -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
      <!-- Active Courses -->
      <div
        class="bg-white dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl p-6 border border-slate-200/60 dark:border-slate-700/50 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group"
      >
        <div
          class="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-indigo-500/10 transition-colors"
        ></div>
        <div class="flex items-center gap-5 relative z-10">
          <div
            class="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-900/30 dark:to-blue-900/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 text-2xl shadow-inner border border-indigo-100/50 dark:border-indigo-800/30"
          >
            <i class="fas fa-book-open"></i>
          </div>
          <div>
            <p
              class="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1"
            >
              Cursos Activos
            </p>
            <div class="flex items-baseline gap-2">
              <h3
                class="text-4xl font-black text-slate-900 dark:text-white leading-none"
              >
                {{ activeCoursesCount() }}
              </h3>
              <span class="text-sm font-semibold text-slate-400"
                >/ {{ courses().length }}</span
              >
            </div>
          </div>
        </div>
      </div>

      <!-- Current Students (Mock for now, to show potential) -->
      <div
        class="bg-white dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl p-6 border border-slate-200/60 dark:border-slate-700/50 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group"
      >
        <div
          class="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-emerald-500/10 transition-colors"
        ></div>
        <div class="flex items-center gap-5 relative z-10">
          <div
            class="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/30 dark:to-teal-900/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 text-2xl shadow-inner border border-emerald-100/50 dark:border-emerald-800/30"
          >
            <i class="fas fa-user-graduate"></i>
          </div>
          <div>
            <p
              class="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1"
            >
              Alumnos (Leads)
            </p>
            <div class="flex items-center gap-3 text-slate-900 dark:text-white">
              <h3 class="text-4xl font-black leading-none">--</h3>
              <span
                class="text-[10px] font-bold text-emerald-600 bg-emerald-100 dark:bg-emerald-500/20 dark:text-emerald-300 px-2.5 py-1 rounded-lg flex items-center gap-1.5"
                ><i class="fas fa-arrow-trend-up"></i> Próx.</span
              >
            </div>
          </div>
        </div>
      </div>

      <!-- Financial Projections (Based on Active Prices) -->
      <div
        class="bg-white dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl p-6 border border-slate-200/60 dark:border-slate-700/50 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group"
      >
        <div
          class="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-purple-500/10 transition-colors"
        ></div>
        <div class="flex items-center gap-5 relative z-10">
          <div
            class="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-50 to-fuchsia-50 dark:from-purple-900/30 dark:to-fuchsia-900/20 flex items-center justify-center text-purple-600 dark:text-purple-400 text-2xl shadow-inner border border-purple-100/50 dark:border-purple-800/30"
          >
            <i class="fas fa-wallet"></i>
          </div>
          <div class="min-w-0">
            <p
              class="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1"
            >
              Ticket Potencial
            </p>
            <h3
              class="text-3xl font-black text-slate-900 dark:text-white leading-none truncate"
              [title]="
                totalMonthlyRevenue() | currency: 'ARS' : 'symbol' : '1.0-0'
              "
            >
              {{ totalMonthlyRevenue() | currency: 'ARS' : 'symbol' : '1.0-0' }}
            </h3>
          </div>
        </div>
      </div>
    </div>

    <!-- Tabs for UGC (Pendientes vs Activos) -->
    <div
      class="flex gap-2 mb-8 bg-slate-100/50 dark:bg-slate-800/50 p-1.5 rounded-2xl w-fit border border-slate-200/50 dark:border-slate-700/50"
    >
      <button
        (click)="activeTab.set('activos'); currentPage.set(1)"
        class="px-6 py-2.5 rounded-xl font-bold transition-all duration-300 text-sm"
        [class.bg-white]="activeTab() === 'activos'"
        [class.dark:bg-slate-700]="activeTab() === 'activos'"
        [class.text-indigo-600]="activeTab() === 'activos'"
        [class.dark:text-indigo-300]="activeTab() === 'activos'"
        [class.shadow-sm]="activeTab() === 'activos'"
        [class.text-slate-500]="activeTab() !== 'activos'"
        [class.hover:bg-slate-200]="activeTab() !== 'activos'"
        [class.dark:hover:bg-slate-700/50]="activeTab() !== 'activos'"
      >
        Cursos Oficiales ({{ activeCoursesCount() }})
      </button>
      <button
        (click)="activeTab.set('pendientes'); currentPage.set(1)"
        class="px-6 py-2.5 rounded-xl font-bold transition-all duration-300 text-sm flex items-center gap-2"
        [class.bg-white]="activeTab() === 'pendientes'"
        [class.dark:bg-slate-700]="activeTab() === 'pendientes'"
        [class.text-indigo-600]="activeTab() === 'pendientes'"
        [class.dark:text-indigo-300]="activeTab() === 'pendientes'"
        [class.shadow-sm]="activeTab() === 'pendientes'"
        [class.text-slate-500]="activeTab() !== 'pendientes'"
        [class.hover:bg-slate-200]="activeTab() !== 'pendientes'"
        [class.dark:hover:bg-slate-700/50]="activeTab() !== 'pendientes'"
      >
        Propuestas Pendientes
        @if (pendingCoursesCount() > 0) {
          <span
            class="bg-rose-500 text-white text-[10px] px-2 py-0.5 rounded-full shadow-sm"
            >{{ pendingCoursesCount() }}</span
          >
        }
      </button>
    </div>

    <!-- The Grid Layout (Highly visual cards instead of simple list) -->
    <div class="mb-8">
      @if (loading()) {
        <div class="flex justify-center items-center py-20">
          <div
            class="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"
          ></div>
        </div>
      } @else if (courses().length === 0) {
        <div
          class="text-center py-24 bg-white/50 dark:bg-slate-800/30 backdrop-blur-sm rounded-3xl border border-dashed border-slate-300 dark:border-slate-700"
        >
          <div
            class="w-24 h-24 bg-indigo-50 dark:bg-indigo-900/20 rounded-full flex items-center justify-center mx-auto mb-6 text-indigo-300 dark:text-indigo-500 text-4xl shadow-inner"
          >
            <i class="fas fa-folder-open"></i>
          </div>
          <h3 class="text-2xl font-black text-slate-900 dark:text-white mb-2">
            Academia Vacía
          </h3>
          <p
            class="text-slate-500 dark:text-slate-400 max-w-md mx-auto text-lg mb-8"
          >
            El catálogo de cursos está esperando su primer programa educativo.
          </p>
          <a
            routerLink="/admin/courses/new"
            class="btn bg-indigo-600 hover:bg-indigo-700 text-white border-none rounded-xl px-8 shadow-lg shadow-indigo-500/30"
          >
            Crear el primer curso
          </a>
        </div>
      } @else if (paginatedCourses().length === 0) {
        <div class="text-center py-20 text-slate-500 dark:text-slate-400">
          <i class="fas fa-search text-4xl mb-4 opacity-50"></i>
          <p class="text-lg">No hay cursos en esta pestaña.</p>
        </div>
      } @else {
        <div
          class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8"
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
                  [src]="getImageSrc(course.image_url)"
                  [alt]="course.title"
                  class="w-full h-full object-cover group-hover:scale-110 group-hover:rotate-1 transition-transform duration-700"
                  (error)="handleImageError($event)"
                />

                <!-- Status Badge -->
                <div class="absolute top-4 left-4 z-20">
                  @if (course.status === 'PENDING') {
                    <div
                      class="flex items-center gap-1.5 bg-yellow-500/90 backdrop-blur text-white px-3 py-1 rounded-lg text-xs font-bold shadow-lg"
                    >
                      <i class="fas fa-clock"></i> Pendiente
                    </div>
                  } @else if (course.is_active) {
                    <div
                      class="flex items-center gap-1.5 bg-emerald-500/90 backdrop-blur text-white px-3 py-1 rounded-lg text-xs font-bold shadow-lg"
                    >
                      <div
                        class="w-1.5 h-1.5 rounded-full bg-white animate-pulse"
                      ></div>
                      Público
                    </div>
                  } @else {
                    <div
                      class="flex items-center gap-1.5 bg-slate-800/90 backdrop-blur text-white px-3 py-1 rounded-lg text-xs font-bold shadow-lg"
                    >
                      <i class="fas fa-eye-slash"></i> Borrador
                    </div>
                  }
                </div>

                <!-- Price Tag -->
                <div class="absolute top-4 right-4 z-20">
                  <div
                    class="bg-white/95 dark:bg-slate-900/95 backdrop-blur px-3 py-1 rounded-lg shadow-lg border border-white/20 dark:border-slate-700/50 text-right"
                  >
                    <div
                      class="text-sm font-black text-slate-900 dark:text-white"
                    >
                      {{ course.price | currency: 'ARS' : 'symbol' : '1.0-0' }}
                    </div>
                    @if (course.sale_price) {
                      <div
                        class="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold -mt-1"
                      >
                        <i class="fas fa-tag"></i>
                        {{
                          course.sale_price
                            | currency: 'ARS' : 'symbol' : '1.0-0'
                        }}
                      </div>
                    }
                  </div>
                </div>

                <!-- Title Overlay -->
                <div class="absolute bottom-4 left-4 right-4 z-20">
                  <span
                    class="text-[10px] uppercase tracking-widest font-bold text-indigo-300 mb-1 block"
                    >{{ course.level }}</span
                  >
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
                <!-- Metadata -->
                <div
                  class="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mb-5 font-medium"
                >
                  <span
                    class="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 py-1 px-2.5 rounded-md"
                    ><i class="fas fa-link"></i> {{ course.slug }}</span
                  >
                </div>

                <div class="grid grid-cols-4 gap-2">
                  @if (course.status === 'PENDING') {
                    <button
                      (click)="approveCourse(course)"
                      class="col-span-1 btn bg-emerald-50 hover:bg-emerald-500 text-emerald-600 hover:text-white dark:bg-emerald-900/30 dark:hover:bg-emerald-600 dark:text-emerald-400 border-none rounded-xl h-12 transition-colors tooltip"
                      data-tip="Aprobar"
                    >
                      <i class="fas fa-check text-lg"></i>
                    </button>
                    <button
                      (click)="deleteCourse(course)"
                      class="col-span-1 btn bg-rose-50 hover:bg-rose-500 text-rose-600 hover:text-white dark:bg-rose-900/30 dark:hover:bg-rose-600 dark:text-rose-400 border-none rounded-xl h-12 transition-colors tooltip"
                      data-tip="Rechazar"
                    >
                      <i class="fas fa-times text-lg"></i>
                    </button>
                    <a
                      [routerLink]="['/admin/courses', course.id, 'materials']"
                      class="col-span-2 btn bg-indigo-50 hover:bg-indigo-600 text-indigo-600 hover:text-white dark:bg-indigo-900/30 dark:hover:bg-indigo-600 dark:text-indigo-400 border-none rounded-xl h-12 transition-colors"
                    >
                      <i class="fas fa-folder-open mr-1"></i> Revisar
                    </a>
                  } @else {
                    <a
                      [routerLink]="['/admin/courses', course.id, 'materials']"
                      class="col-span-2 btn bg-indigo-50 hover:bg-indigo-600 text-indigo-600 hover:text-white dark:bg-indigo-900/30 dark:hover:bg-indigo-600 dark:text-indigo-400 border-none rounded-xl h-12 transition-colors shadow-sm"
                    >
                      <i class="fas fa-folder-open mr-1"></i> Materiales
                    </a>
                    <a
                      [routerLink]="['/admin/courses', course.id]"
                      class="col-span-1 btn bg-slate-100 hover:bg-slate-800 text-slate-600 hover:text-white dark:bg-slate-800 dark:hover:bg-white dark:text-slate-300 dark:hover:text-slate-900 border-none rounded-xl h-12 transition-colors tooltip"
                      data-tip="Editar"
                    >
                      <i class="fas fa-pen"></i>
                    </a>
                    <a
                      [routerLink]="['/academy', course.slug]"
                      target="_blank"
                      class="col-span-1 btn bg-slate-50 hover:bg-slate-200 text-slate-500 dark:bg-slate-800/50 dark:hover:bg-slate-700 dark:text-slate-400 border border-slate-200 dark:border-slate-700 rounded-xl h-12 transition-colors tooltip"
                      data-tip="Ver Aula"
                    >
                      <i class="fas fa-external-link-alt"></i>
                    </a>
                  }
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
                  [class.dark:hover:bg-slate-800]="currentPage() !== $index + 1"
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
  `,
})
export class AdminCoursesPage implements OnInit {
  private coursesService = inject(CoursesService);
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
      // @ts-ignore
      const { error } = await this.coursesService.supabase
        .from('courses')
        .update({ status: 'published', is_active: true })
        .eq('id', course.id);

      if (error) throw error;

      this.courses.update((current) =>
        current.map((c) =>
          c.id === course.id
            ? ({ ...c, status: 'PUBLISHED', is_active: true } as Course)
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
