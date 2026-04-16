import { Component, inject, OnInit, signal, computed, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CoursesService, Course } from '@app/core/services/courses.service';

@Component({
  selector: 'app-admin-courses-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <!-- Top Header & Actions -->
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
      <div>
        <h2 class="text-3xl font-black text-gray-900 dark:text-white mb-1"><i class="fas fa-graduation-cap text-blue-600 dark:text-blue-500 mr-2"></i>Gestión de Academia</h2>
        <p class="text-sm text-gray-500 dark:text-slate-400">Control maestro de programas educativos y certificaciones.</p>
      </div>
      <a routerLink="/admin/courses/new" class="btn border-none bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-500/30 flex items-center gap-2 group transition-all">
        <i class="fas fa-plus bg-white/20 rounded-full p-1 w-6 h-6 flex items-center justify-center text-xs group-hover:rotate-90 transition-transform"></i> 
        <span>Nuevo Programa</span>
      </a>
    </div>

    <!-- Dashboards / Metrics Widgets -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <!-- Active Courses -->
      <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-100 dark:border-slate-700 shadow-sm flex items-center gap-4">
        <div class="w-14 h-14 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 text-2xl shrink-0">
          <i class="fas fa-book-open"></i>
        </div>
        <div>
          <p class="text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-widest mb-1">Cursos Activos</p>
          <h3 class="text-3xl font-black text-gray-900 dark:text-white leading-none">{{ activeCoursesCount() }} / {{ courses().length }}</h3>
        </div>
      </div>
      
      <!-- Current Students (Mock for now, to show potential) -->
      <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-100 dark:border-slate-700 shadow-sm flex items-center gap-4">
        <div class="w-14 h-14 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 text-2xl shrink-0">
          <i class="fas fa-users"></i>
        </div>
        <div>
          <p class="text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-widest mb-1">Alumnos (Leads)</p>
          <div class="flex items-center gap-2 text-gray-900 dark:text-white">
            <h3 class="text-3xl font-black leading-none">--</h3>
            <span class="text-xs font-medium text-emerald-500 bg-emerald-100 dark:bg-emerald-900/50 px-2 py-0.5 rounded-md flex items-center gap-1"><i class="fas fa-arrow-up"></i> Próx.</span>
          </div>
        </div>
      </div>

      <!-- Financial Projections (Based on Active Prices) -->
      <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-100 dark:border-slate-700 shadow-sm flex items-center gap-4">
        <div class="w-14 h-14 rounded-xl bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400 text-2xl shrink-0">
          <i class="fas fa-chart-line"></i>
        </div>
        <div>
          <p class="text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-widest mb-1">Potencial Ticket (Total)</p>
          <h3 class="text-2xl font-black text-gray-900 dark:text-white leading-none truncate" [title]="totalMonthlyRevenue() | currency:'ARS':'symbol':'1.0-0'">
            {{ totalMonthlyRevenue() | currency:'ARS':'symbol':'1.0-0' }}
          </h3>
        </div>
      </div>
    </div>

    <!-- The List Layout (Replaces strict dark table) -->
    <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden">
      <!-- Standardized Table Header inside the card -->
      <div class="bg-gray-50 dark:bg-slate-900/50 border-b border-gray-100 dark:border-slate-700 px-6 py-4 grid grid-cols-12 gap-4 text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider">
        <div class="col-span-1">Programa</div>
        <div class="col-span-5 md:col-span-4"></div> <!-- Image & Title area -->
        <div class="col-span-3 hidden md:block">Inversión</div>
        <div class="col-span-2 hidden md:block text-center">Estado</div>
        <div class="col-span-6 md:col-span-2 text-right">Acciones</div>
      </div>

      <div class="flex flex-col divide-y divide-gray-100 dark:divide-slate-700/50">
        @if (loading()) {
          <div class="flex justify-center items-center py-20 bg-white dark:bg-slate-800">
            <span class="loading loading-spinner text-blue-500 w-10"></span>
          </div>
        } @else if (courses().length === 0) {
          <div class="text-center py-20 bg-white dark:bg-slate-800">
            <div class="w-20 h-20 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400 text-3xl">
              <i class="fas fa-folder-open"></i>
            </div>
            <h3 class="text-lg font-bold text-gray-900 dark:text-white">Aún no tienes programas</h3>
            <p class="text-gray-500 dark:text-slate-400 max-w-sm mx-auto mt-2">Crea tu primer curso educativo para empezar a recibir alumnos.</p>
          </div>
        } @else {
          <!-- Modern Row Design -->
          @for (course of courses(); track course.id) {
            <div class="group px-6 py-5 grid grid-cols-12 gap-4 items-center bg-white dark:bg-slate-800 hover:bg-blue-50/50 dark:hover:bg-slate-800/80 transition-colors">
              
              <!-- Branding & Identity -->
              <div class="col-span-6 md:col-span-5 flex items-center gap-5">
                <div class="relative w-16 h-12 md:w-24 md:h-16 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-900 shrink-0 border border-gray-100 dark:border-slate-700">
                  <img [src]="getImageSrc(course.image_url)" 
                       [alt]="course.title"
                       class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                       (error)="handleImageError($event)" />
                  @if (!course.is_active) {
                    <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-[1px] flex items-center justify-center">
                      <i class="fas fa-eye-slash text-white/80 text-xs"></i>
                    </div>
                  }
                </div>
                <div class="flex flex-col min-w-0">
                  <h4 class="text-sm md:text-base font-bold text-gray-900 dark:text-white truncate" [title]="course.title">{{ course.title }}</h4>
                  <div class="flex items-center gap-2 mt-1">
                    <span class="text-[10px] md:text-xs text-gray-500 dark:text-slate-400 bg-gray-100 dark:bg-slate-700 px-2 py-0.5 rounded uppercase font-semibold">
                      {{ course.level }}
                    </span>
                    <span class="hidden md:inline-block text-[10px] md:text-xs text-gray-400 dark:text-slate-500 truncate">{{ course.slug }}</span>
                  </div>
                </div>
              </div>

              <!-- Pricing Strategy Info -->
              <div class="hidden md:flex col-span-3 flex-col justify-center">
                <div class="text-sm font-bold text-gray-900 dark:text-white">
                  {{ course.price | currency:'ARS':'symbol':'1.0-0' }}
                </div>
                @if (course.sale_price) {
                  <div class="text-xs text-green-600 dark:text-green-400 font-semibold flex items-center gap-1 mt-0.5">
                    <i class="fas fa-tag text-[10px]"></i> {{ course.sale_price | currency:'ARS':'symbol':'1.0-0' }}
                  </div>
                }
              </div>

              <!-- Status Indicator -->
              <div class="hidden md:flex col-span-2 justify-center items-center">
                @if (course.is_active) {
                  <div class="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-900/20 px-3 py-1.5 rounded-full border border-emerald-100 dark:border-emerald-800/50">
                    <div class="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)] animate-pulse"></div>
                    <span class="text-xs font-bold text-emerald-700 dark:text-emerald-400">Público</span>
                  </div>
                } @else {
                  <div class="flex items-center gap-2 bg-slate-50 dark:bg-slate-900/50 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-700">
                    <div class="w-2 h-2 rounded-full bg-slate-400"></div>
                    <span class="text-xs font-bold text-slate-600 dark:text-slate-400">Borrador</span>
                  </div>
                }
              </div>

              <!-- Admin Actions -->
              <div class="col-span-6 md:col-span-2 flex justify-end items-center gap-1 md:gap-2">
                <!-- Direct Academy Link -->
                <a [routerLink]="['/academy', course.slug]" target="_blank" 
                   class="btn btn-sm btn-circle btn-ghost text-gray-400 hover:text-gray-900 dark:hover:text-white tooltip" data-tip="Ver en página">
                  <i class="fas fa-external-link-alt"></i>
                </a>
                <!-- Edit -->
                <a [routerLink]="['/admin/courses', course.id]" 
                   class="btn btn-sm btn-circle bg-blue-50 dark:bg-slate-700 text-blue-600 dark:text-blue-400 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 border-none transition-colors">
                  <i class="fas fa-pen text-xs"></i>
                </a>
                <!-- Delete -->
                <button (click)="deleteCourse(course)" 
                        class="btn btn-sm btn-circle bg-red-50 dark:bg-slate-700 text-red-600 dark:text-red-400 hover:bg-red-600 hover:text-white dark:hover:bg-red-600 border-none transition-colors">
                  <i class="fas fa-trash text-xs"></i>
                </button>
              </div>

            </div>
          }
        }
      </div>
    </div>
  `
})
export class AdminCoursesPage implements OnInit {
  private coursesService = inject(CoursesService);
  private cdr = inject(ChangeDetectorRef);
  
  courses = signal<Course[]>([]);
  loading = signal(true);

  // Dashboards computed metrics
  activeCoursesCount = computed(() => this.courses().filter(c => c.is_active).length);
  totalMonthlyRevenue = computed(() => this.courses().reduce((sum, c) => sum + (c.is_active ? Number(c.price || 0) : 0), 0));

  ngOnInit() {
    this.loadCourses();
  }

  loadCourses() {
    this.loading.set(true);
    this.coursesService.getCourses().subscribe({
      next: (response: { data: Course[], error: any }) => {
        this.courses.set(response.data || []);
        this.loading.set(false);
        this.cdr.markForCheck();
      },
      error: (err: any) => {
        console.error('Error loading courses', err);
        this.loading.set(false);
        this.cdr.markForCheck();
      }
    });
  }

  async deleteCourse(course: Course) {
    if (!confirm(`¿Estás seguro de eliminar el curso "${course.title}"?`)) return;

    this.coursesService.deleteCourse(course.id).subscribe({
      next: () => {
        this.courses.update(current => current.filter(c => c.id !== course.id));
        this.cdr.markForCheck();
      },
      error: (err: any) => alert('Error al eliminar el curso: ' + err.message)
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
