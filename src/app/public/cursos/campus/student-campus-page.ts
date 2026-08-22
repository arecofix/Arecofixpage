import {
  Component,
  inject,
  OnInit,
  signal,
  effect,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink, Router } from '@angular/router';
import {
  CoursesService,
  Course,
  Module,
  CourseExamQuestion,
} from '@app/core/services/courses.service';
import { AuthService } from '@app/core/services/auth.service';
import { ModuleContent } from '@app/admin/courses/materials/admin-course-materials-page';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-student-campus-page',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <div class="min-h-screen bg-slate-50 dark:bg-slate-900 pb-20">
      @if (loading()) {
        <div class="flex justify-center items-center h-[60vh]">
          <span class="loading loading-spinner loading-lg text-blue-500"></span>
        </div>
      } @else if (!course()) {
        <div
          class="flex justify-center items-center h-[60vh] flex-col text-slate-500"
        >
          <i class="fas fa-exclamation-circle text-4xl mb-4"></i>
          <h2 class="text-xl font-bold">Curso no encontrado</h2>
          <button routerLink="/academy" class="btn btn-primary mt-4">
            Volver a la Academia
          </button>
        </div>
      } @else if (!hasAccess()) {
        <div
          class="flex flex-col justify-center items-center h-[60vh] max-w-lg mx-auto text-center px-4"
        >
          <div
            class="w-20 h-20 bg-orange-100 text-orange-500 rounded-full flex items-center justify-center text-3xl mb-4"
          >
            <i class="fas fa-lock"></i>
          </div>
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Acceso Restringido
          </h2>
          <p class="text-slate-500 mb-6">
            No tienes una inscripción activa para este curso o aún está
            pendiente de aprobación.
          </p>
          <button
            [routerLink]="[
              '/academy',
              $safeNavigationMigration(course()?.slug),
            ]"
            class="btn btn-primary w-full sm:w-auto"
          >
            Ir a la página del Curso
          </button>
        </div>
      } @else {
        <!-- Instructor Edit Banner -->
        @if (isAuthor()) {
          <div class="bg-indigo-600 text-white shadow-md relative z-50">
            <div
              class="max-w-6xl mx-auto px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-3"
            >
              <div class="flex items-center gap-2">
                <i class="fas fa-tools text-indigo-200"></i>
                <span class="font-medium text-sm sm:text-base"
                  >Estás viendo este curso en modo estudiante.</span
                >
              </div>
              <a
                [routerLink]="[
                  '/instructor/builder',
                  $safeNavigationMigration(course()?.id),
                ]"
                class="btn btn-sm bg-white text-indigo-700 hover:bg-indigo-50 border-none whitespace-nowrap"
              >
                <i class="fas fa-edit"></i> Editar este Curso
              </a>
            </div>
          </div>
        }

        <!-- Header Banner -->
        <div
          class="bg-blue-900 dark:bg-slate-950 text-white relative overflow-hidden"
        >
          <div
            class="absolute inset-0 opacity-20 bg-cover bg-center mix-blend-overlay"
            [style.backgroundImage]="
              'url(' +
              getImageSrc($safeNavigationMigration(course()?.image_url)) +
              ')'
            "
          ></div>
          <div
            class="absolute inset-0 bg-gradient-to-t from-blue-900/90 to-transparent dark:from-slate-950"
          ></div>

          <div class="max-w-6xl mx-auto px-4 py-12 relative z-10">
            <div
              class="flex flex-col md:flex-row gap-6 items-end justify-between"
            >
              <div>
                <div
                  class="badge badge-primary badge-sm font-bold mb-3 uppercase tracking-widest border-none bg-blue-500 text-white"
                >
                  {{
                    course()?.level === 'basic'
                      ? 'Básico'
                      : course()?.level === 'intermediate'
                        ? 'Intermedio'
                        : 'Avanzado'
                  }}
                </div>
                <h1 class="text-3xl md:text-5xl font-black mb-2 leading-tight">
                  {{ course()?.title }}
                </h1>
                <div
                  class="flex items-center gap-4 text-sm text-blue-200 font-medium"
                >
                  @if (course()?.instructor_name) {
                    <span class="flex items-center gap-2"
                      ><i class="fas fa-chalkboard-teacher text-blue-400"></i>
                      Prof. {{ course()?.instructor_name }}</span
                    >
                  }
                  <span class="flex items-center gap-2"
                    ><i class="fas fa-layer-group text-blue-400"></i>
                    {{ modules().length }} Módulos</span
                  >
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Campus Body -->
        <div class="max-w-6xl mx-auto px-4 py-8">
          <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <!-- Left Content: Modules and Materials -->
            <div class="lg:col-span-3 space-y-6">
              <!-- Aviso General -->
              @if (course()?.description) {
                <div
                  class="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700"
                >
                  <h3
                    class="font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2"
                  >
                    <i class="fas fa-bullhorn text-orange-500"></i> Información
                    del Curso
                  </h3>
                  <p
                    class="text-slate-600 dark:text-slate-300 text-sm leading-relaxed whitespace-pre-wrap"
                  >
                    {{ course()?.description }}
                  </p>
                </div>
              }

              <!-- Modules Accordion -->
              <h3
                class="font-black text-xl text-gray-900 dark:text-white mt-8 mb-4 border-b border-slate-200 dark:border-slate-700 pb-2"
              >
                Temario y Recursos
              </h3>

              <div class="space-y-4">
                @for (mod of modules(); track mod.id; let i = $index) {
                  @if (isModuleUnlocked(mod) || isAuthor()) {
                    <!-- UNLOCKED MODULE — normal accordion -->
                    <div
                      class="collapse collapse-arrow bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 rounded-2xl"
                      [class.collapse-open]="i === 0"
                    >
                      <input
                        type="radio"
                        name="modules-accordion"
                        [checked]="i === 0"
                      />
                      <div
                        class="collapse-title text-lg font-bold text-gray-900 dark:text-white flex items-center gap-3"
                      >
                        <div
                          class="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center text-sm"
                        >
                          {{ i + 1 }}
                        </div>
                        {{ mod.title }}
                        @if (isAuthor() && !isModuleUnlocked(mod)) {
                          <span
                            class="badge badge-warning badge-sm ml-2 font-normal"
                            >Bloqueado (solo tú lo ves)</span
                          >
                        }
                      </div>
                      <div
                        class="collapse-content border-t border-slate-100 dark:border-slate-700 pt-4"
                      >
                        @if (mod.description) {
                          <p
                            class="text-sm text-slate-500 dark:text-slate-400 mb-4"
                          >
                            {{ mod.description }}
                          </p>
                        }

                        @if ((moduleContentsMap[mod.id!] || []).length > 0) {
                          <div class="space-y-2">
                            @for (
                              resource of moduleContentsMap[mod.id!];
                              track resource.id
                            ) {
                              <a
                                [href]="resource.url"
                                target="_blank"
                                class="group flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-900/50 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-all"
                              >
                                <!-- Icon -->
                                <div
                                  class="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm"
                                  [class.bg-red-50]="resource.type === 'video'"
                                  [class.text-red-500]="
                                    resource.type === 'video'
                                  "
                                  [class.bg-orange-50]="
                                    resource.type === 'document'
                                  "
                                  [class.text-orange-500]="
                                    resource.type === 'document'
                                  "
                                  [class.bg-blue-50]="resource.type === 'link'"
                                  [class.text-blue-500]="
                                    resource.type === 'link'
                                  "
                                  [class.bg-purple-50]="
                                    resource.type === 'exam'
                                  "
                                  [class.text-purple-500]="
                                    resource.type === 'exam'
                                  "
                                  [class.bg-green-50]="resource.type === 'text'"
                                  [class.text-green-500]="
                                    resource.type === 'text'
                                  "
                                >
                                  @if (resource.type === 'video') {
                                    <i class="fas fa-play ml-1"></i>
                                  } @else if (resource.type === 'document') {
                                    <i class="fas fa-file-pdf"></i>
                                  } @else if (resource.type === 'link') {
                                    <i class="fas fa-link"></i>
                                  } @else if (resource.type === 'exam') {
                                    <i class="fas fa-clipboard-list"></i>
                                  } @else {
                                    <i class="fas fa-align-left"></i>
                                  }
                                </div>

                                <div class="grow min-w-0">
                                  <h4
                                    class="font-bold text-sm text-gray-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors"
                                  >
                                    {{ resource.title }}
                                  </h4>
                                  <p
                                    class="text-xs text-slate-400 uppercase font-semibold tracking-wider"
                                  >
                                    {{ getTypeLabel(resource.type) }}
                                  </p>
                                </div>

                                <div class="shrink-0 flex items-center gap-2">
                                  @if (completedContents().has(resource.id!)) {
                                    <div
                                      class="text-emerald-500 tooltip tooltip-left"
                                      data-tip="Completado"
                                    >
                                      <i
                                        class="fas fa-check-circle text-xl"
                                      ></i>
                                    </div>
                                  } @else {
                                    @if (resource.type === 'exam') {
                                      <button
                                        class="btn btn-sm btn-outline rounded-xl"
                                        (click)="
                                          openExam(resource);
                                          $event.preventDefault()
                                        "
                                      >
                                        Comenzar
                                      </button>
                                    } @else {
                                      <button
                                        class="btn btn-sm btn-ghost hover:bg-emerald-50 hover:text-emerald-600 dark:hover:bg-emerald-900/30 dark:hover:text-emerald-400 rounded-xl tooltip tooltip-left"
                                        data-tip="Marcar completado"
                                        (click)="
                                          markContentAsCompleted(
                                            resource.id!,
                                            $event
                                          )
                                        "
                                        [disabled]="
                                          markingCompleted()[resource.id!]
                                        "
                                      >
                                        @if (markingCompleted()[resource.id!]) {
                                          <span
                                            class="loading loading-spinner loading-xs"
                                          ></span>
                                        } @else {
                                          <i
                                            class="far fa-circle text-slate-300 dark:text-slate-600 text-xl"
                                          ></i>
                                        }
                                      </button>
                                    }
                                  }
                                </div>
                              </a>

                              <!-- If it is text type, display the content inline instead of link -->
                              @if (resource.type === 'text') {
                                <div
                                  class="ml-14 pl-4 border-l-2 border-green-200 dark:border-green-900/50 py-2 pr-4 text-sm text-slate-600 dark:text-slate-300 mb-4 bg-green-50/30 dark:bg-green-900/10 rounded-r-xl"
                                >
                                  {{ resource.url }}
                                </div>
                              }
                            }
                          </div>
                        } @else {
                          <div
                            class="text-center py-6 bg-slate-50 dark:bg-slate-900/30 rounded-xl text-slate-400 text-sm"
                          >
                            <i
                              class="fas fa-clock text-2xl mb-2 opacity-50"
                            ></i>
                            <p>
                              Aún no hay materiales publicados en esta unidad.
                            </p>
                          </div>
                        }
                      </div>
                    </div>
                  } @else {
                    <!-- LOCKED MODULE — visible structure but content blocked -->
                    <div
                      class="bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden opacity-75"
                    >
                      <!-- Module title row (always visible) -->
                      <div
                        class="px-6 py-4 flex items-center gap-3 cursor-not-allowed"
                      >
                        <div
                          class="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-400 flex items-center justify-center text-sm font-bold"
                        >
                          {{ i + 1 }}
                        </div>
                        <span
                          class="text-lg font-bold text-slate-400 dark:text-slate-500 flex-1"
                          >{{ mod.title }}</span
                        >
                        <i
                          class="fas fa-lock text-slate-300 dark:text-slate-600 text-lg"
                        ></i>
                      </div>
                      <!-- Lock banner -->
                      <div
                        class="border-t border-slate-100 dark:border-slate-700 px-6 py-5 bg-slate-50/60 dark:bg-slate-900/30 flex items-center gap-4"
                      >
                        <div
                          class="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center shrink-0"
                        >
                          <i
                            class="fas fa-lock text-slate-400 dark:text-slate-500 text-lg"
                          ></i>
                        </div>
                        <div>
                          @if (mod.unlock_date) {
                            <p
                              class="font-semibold text-slate-500 dark:text-slate-400 text-sm"
                            >
                              Disponible el
                              {{ formatUnlockDate(mod.unlock_date) }}
                            </p>
                            <p class="text-xs text-slate-400 mt-0.5">
                              Este módulo se habilitará automáticamente en la
                              fecha indicada.
                            </p>
                          } @else {
                            <p
                              class="font-semibold text-slate-500 dark:text-slate-400 text-sm"
                            >
                              Disponible próximamente
                            </p>
                            <p class="text-xs text-slate-400 mt-0.5">
                              Este módulo se habilitará más adelante durante la
                              cursada.
                            </p>
                          }
                        </div>
                        <div class="ml-auto">
                          <span
                            class="btn btn-sm btn-disabled rounded-xl cursor-not-allowed opacity-60 pointer-events-none"
                          >
                            <i class="fas fa-lock mr-1"></i> Bloqueado
                          </span>
                        </div>
                      </div>
                    </div>
                  }
                }
              </div>
            </div>

            <!-- Right Sidebar: Shortcuts & Instructor Info -->
            <div class="lg:col-span-1 space-y-6">
              <!-- Progress Card -->
              <div
                class="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700"
              >
                <h3
                  class="font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2"
                >
                  <i class="fas fa-tasks text-emerald-500"></i> Tu Progreso
                </h3>
                <div
                  class="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2.5 mb-2 overflow-hidden"
                >
                  <div
                    class="bg-emerald-500 h-2.5 rounded-full transition-all duration-1000"
                    [style.width]="progress() + '%'"
                  ></div>
                </div>
                <p class="text-xs text-slate-500 font-medium text-right">
                  {{ progress() | number: '1.0-0' }}% Completado
                </p>

                @if (certificateId()) {
                  <div
                    class="mt-5 pt-5 border-t border-slate-100 dark:border-slate-700 text-center"
                  >
                    <div
                      class="text-xs text-emerald-600 dark:text-emerald-400 font-bold mb-3 uppercase tracking-wider"
                    >
                      ¡Curso Finalizado!
                    </div>
                    <a
                      [routerLink]="['/academy/cert', certificateId()]"
                      target="_blank"
                      class="btn btn-sm btn-primary w-full shadow-lg shadow-blue-500/30 rounded-xl"
                    >
                      <i class="fas fa-certificate"></i> Ver Certificado
                    </a>
                  </div>
                }
              </div>

              <!-- Instructor -->
              @if (course()?.instructor_name) {
                <div
                  class="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 text-center"
                >
                  <div
                    class="w-20 h-20 mx-auto rounded-full overflow-hidden mb-3 border-4 border-slate-50 dark:border-slate-700"
                  >
                    <img
                      [src]="
                        getImageSrc(
                          $safeNavigationMigration(course()?.instructor_avatar)
                        )
                      "
                      onerror="this.src='/assets/img/avatar.png'"
                      class="w-full h-full object-cover"
                    />
                  </div>
                  <h3 class="font-bold text-gray-900 dark:text-white">
                    {{ course()?.instructor_name }}
                  </h3>
                  <p class="text-xs text-slate-500 mb-4">
                    {{ course()?.instructor_role || 'Profesor(a)' }}
                  </p>
                  <a
                    [href]="'mailto:info@arecofix.com.ar'"
                    class="btn btn-sm btn-outline w-full rounded-xl"
                    ><i class="fas fa-envelope"></i> Contactar</a
                  >
                </div>
              }
            </div>
          </div>
        </div>
      }

      <!-- Exam Modal -->
      <dialog
        id="take_exam_modal"
        class="modal modal-bottom sm:modal-middle"
        [class.modal-open]="activeExam !== null"
      >
        <div
          class="modal-box max-w-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-xl"
        >
          @if (activeExam) {
            <button
              class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
              (click)="closeExam()"
            >
              <i class="fas fa-times"></i>
            </button>
            <h3
              class="font-black text-2xl mb-2 text-slate-800 dark:text-white border-b border-slate-200 dark:border-slate-700 pb-4"
            >
              {{ activeExam.title }}
            </h3>

            @if (examLoading()) {
              <div class="flex justify-center py-20">
                <span class="loading loading-spinner text-blue-500"></span>
              </div>
            } @else if (examResult()) {
              <!-- Result Screen -->
              <div class="text-center py-10">
                <div
                  class="w-24 h-24 mx-auto rounded-full flex items-center justify-center text-4xl mb-4"
                  [class.bg-green-100]="examResult().passed"
                  [class.text-green-600]="examResult().passed"
                  [class.bg-red-100]="!examResult().passed"
                  [class.text-red-600]="!examResult().passed"
                >
                  <i
                    class="fas"
                    [class.fa-check]="examResult().passed"
                    [class.fa-times]="!examResult().passed"
                  ></i>
                </div>
                <h2
                  class="text-3xl font-bold mb-2 text-gray-900 dark:text-white"
                >
                  {{ examResult().passed ? '¡Aprobado!' : 'Reprobado' }}
                </h2>
                <p class="text-lg text-slate-600 dark:text-slate-400 mb-6">
                  Obtuviste
                  <strong class="text-gray-900 dark:text-white"
                    >{{ examResult().score | number: '1.0-0' }}%</strong
                  >
                  <br />
                  ({{ examResult().correct_answers }} de
                  {{ examResult().total_questions }} correctas)
                </p>
                <button class="btn btn-primary" (click)="closeExam()">
                  Continuar
                </button>
              </div>
            } @else {
              <!-- Exam Questions -->
              <div class="space-y-8 mt-6">
                @for (
                  q of activeExamQuestions();
                  track q.id;
                  let qIndex = $index
                ) {
                  <div
                    class="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-700"
                  >
                    <h4
                      class="font-bold text-lg text-gray-900 dark:text-white mb-4"
                    >
                      <span class="text-blue-500 mr-2">{{ qIndex + 1 }}.</span>
                      {{ q.question_text }}
                    </h4>
                    <div class="space-y-3">
                      @for (
                        opt of q.options;
                        track optIndex;
                        let optIndex = $index
                      ) {
                        <label
                          class="flex items-center gap-3 p-3 rounded-xl border border-slate-200 dark:border-slate-600 hover:bg-white dark:hover:bg-slate-700 cursor-pointer transition-colors"
                          [class.bg-blue-50]="
                            activeExamAnswers[q.id] === optIndex
                          "
                          [class.border-blue-300]="
                            activeExamAnswers[q.id] === optIndex
                          "
                          [class.dark:bg-blue-900]="
                            activeExamAnswers[q.id] === optIndex
                          "
                          [class.dark:border-blue-500]="
                            activeExamAnswers[q.id] === optIndex
                          "
                        >
                          <input
                            type="radio"
                            [name]="'q_' + q.id"
                            [value]="optIndex"
                            [(ngModel)]="activeExamAnswers[q.id]"
                            class="radio radio-primary"
                          />
                          <span
                            class="text-slate-700 dark:text-slate-300 font-medium"
                            >{{ opt }}</span
                          >
                        </label>
                      }
                    </div>
                  </div>
                }
              </div>

              <div
                class="modal-action mt-8 border-t border-slate-200 dark:border-slate-700 pt-6"
              >
                <button class="btn btn-outline" (click)="closeExam()">
                  Cancelar
                </button>
                <button
                  class="btn btn-primary px-8"
                  (click)="submitExam()"
                  [disabled]="submittingExam()"
                >
                  @if (submittingExam()) {
                    <span class="loading loading-spinner"></span>
                  }
                  Entregar Examen
                </button>
              </div>
            }
          }
        </div>
        <form method="dialog" class="modal-backdrop" (click)="closeExam()">
          <button>close</button>
        </form>
      </dialog>
    </div>
  `,
})
export class StudentCampusPage implements OnInit {
  private route = inject(ActivatedRoute);
  private coursesService = inject(CoursesService);
  private authService = inject(AuthService);
  private router = inject(Router);

  loading = signal(true);
  course = signal<Course | null>(null);
  modules = signal<Module[]>([]);
  moduleContentsMap: Record<string, ModuleContent[]> = {};

  hasAccess = signal(false);

  // Progress state
  progress = signal<number>(0);
  completedContents = signal<Set<string>>(new Set());
  certificateId = signal<string | null>(null);
  markingCompleted = signal<Record<string, boolean>>({});

  isAuthor = signal(false);

  // Exam state
  activeExam: ModuleContent | null = null;
  activeExamQuestions = signal<any[]>([]);
  activeExamAnswers: Record<string, number> = {};
  examLoading = signal(false);
  submittingExam = signal(false);
  examResult = signal<any>(null);

  ngOnInit() {
    const slug = this.route.snapshot.paramMap.get('slug');
    if (slug) {
      this.loadCourseData(slug);
    } else {
      this.loading.set(false);
    }
  }

  async loadCourseData(slug: string) {
    this.loading.set(true);

    // 1. Get Course details
    this.coursesService.getCourseBySlug(slug).subscribe(async (res) => {
      if (!res.data) {
        this.loading.set(false);
        return;
      }
      this.course.set(res.data);
      const courseId = res.data.id;

      const profile = this.authService.getCurrentProfile();
      if (profile && res.data.author_id === profile.id) {
        this.isAuthor.set(true);
      }

      // 2. Validate Access — check role and enrollment directly
      let accessConfirmed = false;

      // 2a. Admins and staff always have access
      const userSession = await this.authService.getSession();
      const userRole = userSession?.user?.user_metadata?.['role'];
      if (
        ['admin', 'staff', 'super_admin', 'tenant_owner'].includes(userRole)
      ) {
        accessConfirmed = true;
      }

      // 2b. Course author always has access
      if (this.isAuthor()) {
        accessConfirmed = true;
      }

      // 2c. For regular students: check directly in course_enrollments
      if (!accessConfirmed) {
        const userEmail = userSession?.user?.email || profile?.email || '';
        if (userEmail) {
          const { enrolled } = await this.coursesService.checkEnrollment(
            courseId,
            userEmail,
          );
          accessConfirmed = enrolled;
        }
      }

      this.hasAccess.set(accessConfirmed);

      // 3. Load modules and their contents (for enrolled/authorized users)
      this.coursesService
        .getModulesByCourseId(courseId)
        .subscribe(async (modulesRes) => {
          if (modulesRes.data) {
            this.modules.set(modulesRes.data);

            if (accessConfirmed) {
              for (const mod of modulesRes.data) {
                // Only fetch contents for unlocked modules (or for admins/authors)
                const shouldLoad =
                  this.isModuleUnlocked(mod) || this.isAuthor();
                if (!shouldLoad) continue;
                try {
                  const contentsRes = await this.coursesService
                    .getModuleContents(mod.id!)
                    .toPromise();
                  if (contentsRes?.data) {
                    this.moduleContentsMap[mod.id!] = contentsRes.data;
                  }
                } catch (e) {
                  console.error('Error loading contents for module', mod.id, e);
                }
              }
            }

            // Fetch progress
            this.coursesService
              .getCourseProgress(courseId)
              .subscribe((progressRes) => {
                if (progressRes.data) {
                  this.progress.set(progressRes.data.progress);
                  this.completedContents.set(
                    new Set(progressRes.data.completed_contents),
                  );
                  this.certificateId.set(
                    progressRes.data.certificate_id || null,
                  );
                }
                this.loading.set(false);
              });
          } else {
            this.loading.set(false);
          }
        });
    });
  }

  getImageSrc(url: string | null | undefined): string {
    if (!url) return '/assets/img/cursos/1.jpg';
    if (url.startsWith('http') || url.startsWith('/')) {
      return url;
    }
    return '/' + url;
  }

  /** Returns true if the module is currently accessible to students */
  isModuleUnlocked(mod: Module | null | undefined): boolean {
    if (!mod?.unlock_date) return false;
    return new Date(mod.unlock_date) <= new Date();
  }

  /** Formats an ISO date string to a human-readable date (es-AR locale) */
  formatUnlockDate(iso: string | null | undefined): string {
    if (!iso) return '';
    return new Date(iso).toLocaleString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  getTypeLabel(type: string): string {
    switch (type) {
      case 'video':
        return 'Video Clase';
      case 'document':
        return 'Material de Estudio';
      case 'link':
        return 'Enlace Externo';
      case 'text':
        return 'Lectura';
      case 'exam':
        return 'Examen';
      default:
        return 'Recurso';
    }
  }

  markContentAsCompleted(contentId: string, event: Event) {
    event.preventDefault();
    event.stopPropagation();
    if (this.completedContents().has(contentId)) return;

    this.markingCompleted.update((v) => ({ ...v, [contentId]: true }));
    this.coursesService.markContentCompleted(contentId).subscribe((res) => {
      this.markingCompleted.update((v) => ({ ...v, [contentId]: false }));
      if (!res.error && res.data) {
        this.progress.set(res.data.progress);
        const newSet = new Set(this.completedContents());
        newSet.add(contentId);
        this.completedContents.set(newSet);
        if (res.data.certificate_id) {
          this.certificateId.set(res.data.certificate_id);
        }
      }
    });
  }

  // --- Exam Logic ---

  openExam(resource: ModuleContent) {
    this.activeExam = resource;
    this.examResult.set(null);
    this.activeExamAnswers = {};
    this.examLoading.set(true);

    this.coursesService.getExamQuestions(resource.id!).subscribe((res) => {
      this.examLoading.set(false);
      this.activeExamQuestions.set(res.data || []);
    });
  }

  closeExam() {
    if (this.submittingExam()) return;
    this.activeExam = null;
  }

  submitExam() {
    if (!this.activeExam) return;

    const questions = this.activeExamQuestions();
    // Ensure all questions are answered
    for (const q of questions) {
      if (this.activeExamAnswers[q.id] === undefined) {
        alert(
          'Por favor, responde a todas las preguntas antes de entregar el examen.',
        );
        return;
      }
    }

    this.submittingExam.set(true);

    const payload = Object.keys(this.activeExamAnswers).map((qId) => ({
      question_id: qId,
      selected_index: this.activeExamAnswers[qId],
    }));

    this.coursesService
      .submitExam(this.activeExam.id!, payload)
      .subscribe((res) => {
        this.submittingExam.set(false);
        if (res.error) {
          alert('Error al enviar el examen: ' + res.error.message);
        } else {
          this.examResult.set(res.data);
          // Update progress if passed
          if (res.data?.progress) {
            this.progress.set(res.data.progress.progress);
            const newSet = new Set(this.completedContents());
            newSet.add(this.activeExam!.id!);
            this.completedContents.set(newSet);
            if (res.data.progress.certificate_id) {
              this.certificateId.set(res.data.progress.certificate_id);
            }
          }
        }
      });
  }
}
