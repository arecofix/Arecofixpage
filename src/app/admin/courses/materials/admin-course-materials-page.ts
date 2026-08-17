import { Component, inject, OnInit, signal, effect } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CoursesService, Course, Module, CourseExamQuestion } from '@app/core/services/courses.service';
import { ProductMediaService } from '@app/admin/products/services/product-media.service';
import { NotificationService } from '@app/core/services/notification.service';
import { LoggerService } from '@app/core/services/logger.service';

export interface ModuleContent {
  id?: string;
  lesson_id: string;
  type: 'video' | 'image' | 'document' | 'link' | 'text' | 'exam';
  title: string;
  url: string;
  metadata?: any;
  order_index: number;
}

@Component({
  selector: 'app-admin-course-materials-page',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="max-w-6xl mx-auto pb-12">
      <!-- Header -->
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 class="text-3xl font-black text-gray-900 dark:text-white mb-1 flex items-center gap-3">
             <a routerLink="/admin/courses" class="btn btn-sm btn-circle btn-ghost text-slate-400 hover:text-white transition-colors">
              <i class="fas fa-arrow-left"></i>
             </a>
            Materiales del Curso
          </h2>
          <p class="text-sm text-gray-500 dark:text-slate-400 ml-11">
            Gestiona los recursos, videos y documentos para <strong>{{ course()?.title || 'Cargando...' }}</strong>
          </p>
        </div>
      </div>

      @if (loading()) {
        <div class="flex justify-center py-20">
            <span class="loading loading-spinner loading-lg text-blue-500"></span>
        </div>
      } @else {
        <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
            
            <!-- Left Sidebar: Modules List -->
            <div class="lg:col-span-1 space-y-4">
               <h3 class="font-bold text-gray-900 dark:text-white uppercase tracking-wider text-xs px-2">Temario (Unidades)</h3>
               
               @if (modules().length === 0) {
                  <div class="alert alert-warning text-sm rounded-xl">
                    <i class="fas fa-exclamation-triangle"></i>
                    <span>Este curso no tiene módulos creados. Edítalo primero para agregar el temario.</span>
                  </div>
               }
               
               <ul class="menu bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 w-full p-2 shadow-sm">
                 @for (mod of modules(); track mod.id) {
                    <li>
                      <a [class.active]="selectedModule()?.id === mod.id" 
                         (click)="selectModule(mod)"
                         class="rounded-xl py-3 text-gray-700 dark:text-gray-300">
                         <i class="fas fa-folder text-blue-500"></i>
                         <span class="truncate font-medium">{{ mod.title }}</span>
                      </a>
                    </li>
                 }
               </ul>
            </div>

            <!-- Right Content: Materials Manager -->
            <div class="lg:col-span-3">
                @if (selectedModule()) {
                    <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
                        <div class="bg-slate-50 dark:bg-slate-900/50 p-6 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
                            <div>
                                <h3 class="text-xl font-bold text-gray-900 dark:text-white">{{ selectedModule()?.title }}</h3>
                                <p class="text-sm text-slate-500 mt-1">Organiza los recursos educativos para esta unidad.</p>
                            </div>
                            <div class="dropdown dropdown-end">
                              <div tabindex="0" role="button" class="btn btn-primary btn-sm rounded-xl">
                                <i class="fas fa-plus"></i> Agregar Recurso
                              </div>
                              <ul tabindex="0" class="dropdown-content z-[1] menu p-2 shadow-xl bg-base-100 rounded-box w-52 border border-slate-200 dark:border-slate-700 mt-2">
                                <li><a (click)="addResource('video')"><i class="fas fa-video text-red-500"></i> Enlace de Video (YouTube/Vimeo)</a></li>
                                <li><a (click)="addResource('document')"><i class="fas fa-file-pdf text-orange-500"></i> Documento / PDF</a></li>
                                <li><a (click)="addResource('link')"><i class="fas fa-link text-blue-500"></i> Enlace Externo (Meet, Web)</a></li>
                                <li><a (click)="addResource('text')"><i class="fas fa-align-left text-green-500"></i> Texto (Aviso / Info)</a></li>
                                <li><a (click)="addResource('exam')"><i class="fas fa-clipboard-list text-purple-500"></i> Examen (Cuestionario)</a></li>
                              </ul>
                            </div>
                        </div>
                        
                        <div class="p-6 space-y-4 bg-slate-50 dark:bg-slate-800/50">
                           @if (loadingContents()) {
                               <div class="flex justify-center py-10"><span class="loading loading-spinner text-blue-500"></span></div>
                           } @else if (contents().length === 0) {
                               <div class="text-center py-12 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl bg-white dark:bg-slate-800">
                                   <i class="fas fa-box-open text-4xl text-slate-300 dark:text-slate-600 mb-3"></i>
                                   <p class="text-slate-500 font-medium">No hay recursos en este módulo.</p>
                                   <p class="text-xs text-slate-400 mt-1">Haz clic en "Agregar Recurso" para comenzar.</p>
                               </div>
                           } @else {
                               @for (content of contents(); track content.id || $index) {
                                   <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-4 flex flex-col md:flex-row gap-4 items-start shadow-sm transition-all hover:border-blue-300">
                                       
                                       <!-- Icon based on type -->
                                       <div class="flex-none pt-2">
                                            @if (content.type === 'video') { <div class="w-10 h-10 rounded-full bg-red-50 text-red-500 flex items-center justify-center"><i class="fas fa-play"></i></div> }
                                            @else if (content.type === 'document') { <div class="w-10 h-10 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center"><i class="fas fa-file-pdf"></i></div> }
                                            @else if (content.type === 'link') { <div class="w-10 h-10 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center"><i class="fas fa-link"></i></div> }
                                            @else if (content.type === 'exam') { <div class="w-10 h-10 rounded-full bg-purple-50 text-purple-500 flex items-center justify-center"><i class="fas fa-clipboard-list"></i></div> }
                                            @else { <div class="w-10 h-10 rounded-full bg-green-50 text-green-500 flex items-center justify-center"><i class="fas fa-align-left"></i></div> }
                                       </div>
                                       
                                       <div class="grow w-full space-y-3">
                                           <!-- Title -->
                                           <div class="form-control w-full">
                                              <input type="text" [(ngModel)]="content.title" class="input input-sm border-slate-200 dark:border-slate-700 focus:border-blue-500 w-full font-bold text-gray-900 dark:text-white" placeholder="Título del recurso..." />
                                           </div>
                                           
                                           <!-- URL / Content depending on type -->
                                           @if (content.type === 'document') {
                                               <div class="flex items-center gap-2">
                                                   <input type="text" [(ngModel)]="content.url" class="input input-sm border-slate-200 dark:border-slate-700 text-xs w-full text-slate-500" placeholder="URL del archivo (o súbelo usando el botón)" />
                                                   
                                                   <label class="btn btn-sm btn-outline rounded-lg flex-none cursor-pointer">
                                                       <i class="fas fa-upload"></i> Subir PDF
                                                       <input type="file" class="hidden" accept=".pdf,.doc,.docx,.xls,.xlsx" (change)="uploadFile($event, content)" />
                                                   </label>
                                               </div>
                                           } @else if (content.type === 'text') {
                                               <textarea [(ngModel)]="content.url" class="textarea textarea-bordered border-slate-200 dark:border-slate-700 w-full text-sm h-24" placeholder="Escribe el contenido aquí..."></textarea>
                                           } @else if (content.type === 'exam') {
                                               <div class="flex items-center gap-3">
                                                   <div class="text-sm text-slate-500">
                                                       <strong>{{ content.metadata?.questions?.length || 0 }}</strong> preguntas configuradas. Puntaje para aprobar: <strong>{{ content.metadata?.passing_score || 60 }}%</strong>
                                                   </div>
                                                   <button class="btn btn-sm btn-primary rounded-lg" (click)="openExamEditor(content)">
                                                       <i class="fas fa-cog"></i> Configurar Examen
                                                   </button>
                                               </div>
                                           } @else {
                                               <input type="text" [(ngModel)]="content.url" class="input input-sm border-slate-200 dark:border-slate-700 w-full text-sm text-blue-500" placeholder="https://..." />
                                           }
                                       </div>

                                       <!-- Actions -->
                                       <div class="flex-none flex items-center gap-1">
                                            <!-- Up/Down Ordering -->
                                            <div class="flex flex-col border border-slate-100 dark:border-slate-700 rounded-lg overflow-hidden">
                                                <button class="btn btn-xs btn-ghost rounded-none h-6 px-2 hover:bg-slate-100" (click)="moveUp($index)" [disabled]="$index === 0"><i class="fas fa-chevron-up text-[10px]"></i></button>
                                                <div class="h-[1px] bg-slate-100 dark:bg-slate-700"></div>
                                                <button class="btn btn-xs btn-ghost rounded-none h-6 px-2 hover:bg-slate-100" (click)="moveDown($index)" [disabled]="$index === contents().length - 1"><i class="fas fa-chevron-down text-[10px]"></i></button>
                                            </div>
                                            <button class="btn btn-square btn-ghost text-red-500 hover:bg-red-50" (click)="removeResource($index)"><i class="fas fa-trash"></i></button>
                                       </div>
                                   </div>
                               }
                           }
                           
                           @if (contents().length > 0) {
                               <div class="flex justify-end pt-4">
                                   <button class="btn btn-primary rounded-xl px-8" (click)="saveContents()" [disabled]="saving()">
                                       @if (saving()) {
                                           <span class="loading loading-spinner"></span> Guardando...
                                       } @else {
                                           <i class="fas fa-save"></i> Guardar Materiales
                                       }
                                   </button>
                               </div>
                           }
                        </div>
                    </div>
                } @else {
                    <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 h-[400px] flex flex-col items-center justify-center text-slate-400">
                        <i class="fas fa-hand-pointer text-5xl mb-4 opacity-20"></i>
                        <p class="font-medium text-lg">Selecciona un Módulo del Temario</p>
                        <p class="text-sm mt-1">Para visualizar y gestionar sus recursos educativos.</p>
                    </div>
                }
            </div>
        </div>
      }

      <!-- Exam Editor Modal -->
      <dialog id="exam_modal" class="modal modal-bottom sm:modal-middle" [class.modal-open]="editingExamContent !== null">
        <div class="modal-box max-w-4xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-xl">
            <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" (click)="closeExamEditor()"><i class="fas fa-times"></i></button>
            <h3 class="font-bold text-xl mb-4 text-slate-800 dark:text-white">
                <i class="fas fa-clipboard-list text-purple-500 mr-2"></i> Configurar Examen
            </h3>
            
            @if (editingExamContent) {
                <div class="form-control mb-6">
                    <label class="label"><span class="label-text font-bold">Puntaje mínimo para aprobar (%)</span></label>
                    <input type="number" [(ngModel)]="editingExamContent.metadata.passing_score" class="input input-bordered w-32" min="1" max="100">
                </div>

                <div class="divider">Preguntas ({{ editingExamContent.metadata.questions?.length || 0 }})</div>

                <div class="space-y-6">
                    @for (q of editingExamContent.metadata.questions; track $index; let qIndex = $index) {
                        <div class="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 relative">
                            <button class="btn btn-sm btn-square btn-ghost text-red-500 absolute top-2 right-2" (click)="removeQuestion(qIndex)">
                                <i class="fas fa-trash"></i>
                            </button>
                            
                            <div class="form-control w-full pr-10 mb-4">
                                <label class="label"><span class="label-text font-bold">Pregunta {{ qIndex + 1 }}</span></label>
                                <input type="text" [(ngModel)]="q.question_text" class="input input-bordered w-full" placeholder="Ej: ¿Qué es HTML?">
                            </div>

                            <label class="label py-0 mb-2"><span class="label-text text-xs text-slate-500">Opciones (Marca la correcta)</span></label>
                            <div class="space-y-2 pl-4">
                                @for (opt of q.options; track optIndex; let optIndex = $index) {
                                    <div class="flex items-center gap-3">
                                        <input type="radio" [name]="'correct_' + qIndex" [value]="optIndex" [(ngModel)]="q.correct_option_index" class="radio radio-primary radio-sm">
                                        <input type="text" [(ngModel)]="q.options[optIndex]" (ngModelChange)="trackOptionChange(q, optIndex, $event)" class="input input-sm input-bordered w-full max-w-md" placeholder="Opción...">
                                        <button class="btn btn-xs btn-ghost text-red-400" (click)="removeOption(q, optIndex)" [disabled]="q.options.length <= 2"><i class="fas fa-times"></i></button>
                                    </div>
                                }
                                <button class="btn btn-xs btn-outline mt-2" (click)="addOption(q)"><i class="fas fa-plus"></i> Añadir opción</button>
                            </div>
                        </div>
                    }
                </div>

                <div class="mt-6">
                    <button class="btn btn-outline btn-block border-dashed" (click)="addQuestion()"><i class="fas fa-plus"></i> Añadir Nueva Pregunta</button>
                </div>

                <div class="modal-action mt-8">
                    <button class="btn btn-primary px-8" (click)="closeExamEditor()">Listo</button>
                </div>
            }
        </div>
        <form method="dialog" class="modal-backdrop" (click)="closeExamEditor()">
            <button>close</button>
        </form>
      </dialog>
    </div>
  `
})
export class AdminCourseMaterialsPage implements OnInit {
  private route = inject(ActivatedRoute);
  private coursesService = inject(CoursesService);
  private mediaService = inject(ProductMediaService);
  private notification = inject(NotificationService);
  private logger = inject(LoggerService);

  courseId = signal<string>('');
  course = signal<Course | null>(null);
  modules = signal<Module[]>([]);
  
  selectedModule = signal<Module | null>(null);
  contents = signal<ModuleContent[]>([]);

  loading = signal(true);
  loadingContents = signal(false);
  saving = signal(false);

  editingExamContent: ModuleContent | null = null;

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.courseId.set(id);
      this.loadData();
    }
  }

  loadData() {
    this.loading.set(true);
    // Load Course metadata
    this.coursesService.getCourseById(this.courseId()).subscribe(res => {
      if (res.data) this.course.set(res.data);
    });

    // Load Modules
    this.coursesService.getModulesByCourseId(this.courseId()).subscribe(res => {
      this.loading.set(false);
      if (res.data) {
          this.modules.set(res.data);
          // Auto select first module if exists
          if (res.data.length > 0) {
              this.selectModule(res.data[0]);
          }
      }
    });
  }

  selectModule(mod: Module) {
      this.selectedModule.set(mod);
      this.loadingContents.set(true);
      
      this.coursesService.getModuleContents(mod.id!).subscribe(res => {
          this.loadingContents.set(false);
          this.contents.set(res.data || []);
      });
  }

  addResource(type: 'video' | 'image' | 'document' | 'link' | 'text' | 'exam') {
      const current = this.contents();
      const newResource: ModuleContent = {
          lesson_id: this.selectedModule()!.id!,
          type,
          title: '',
          url: '',
          order_index: current.length + 1
      };
      
      if (type === 'video') newResource.title = 'Nuevo Video';
      else if (type === 'document') newResource.title = 'Nuevo Documento';
      else if (type === 'link') newResource.title = 'Enlace de Interés';
      else if (type === 'exam') {
          newResource.title = 'Nuevo Examen';
          newResource.url = 'exam';
          newResource.metadata = { passing_score: 60, questions: [] };
      }
      else newResource.title = 'Información Importante';

      this.contents.set([...current, newResource]);
  }

  removeResource(index: number) {
      const current = [...this.contents()];
      current.splice(index, 1);
      this.contents.set(current);
  }

  moveUp(index: number) {
      if (index === 0) return;
      const current = [...this.contents()];
      const temp = current[index];
      current[index] = current[index - 1];
      current[index - 1] = temp;
      this.contents.set(current);
  }

  moveDown(index: number) {
      const current = [...this.contents()];
      if (index === current.length - 1) return;
      const temp = current[index];
      current[index] = current[index + 1];
      current[index + 1] = temp;
      this.contents.set(current);
  }

  async uploadFile(event: any, contentRef: ModuleContent) {
      const file: File = event.target.files?.[0];
      if (!file) return;

      this.notification.showSuccess('Subiendo archivo, aguarda un momento...');
      try {
          // Upload to course-materials folder
          const publicUrl = await this.mediaService.uploadFile(file, 'course-materials');
          
          this.contents.update(current => {
              const updated = [...current];
              const index = updated.findIndex(c => c === contentRef);
              if (index !== -1) {
                  updated[index].url = publicUrl;
                  if (updated[index].title === 'Nuevo Documento' || !updated[index].title) {
                      updated[index].title = file.name;
                  }
              }
              return updated;
          });
          
          this.notification.showSuccess('Archivo subido correctamente.');
      } catch (err: any) {
          this.logger.error('Failed to upload course material', err);
          this.notification.showError('Error al subir el archivo: ' + err.message);
      }
  }

  async saveContents() {
      const modId = this.selectedModule()?.id;
      if (!modId) return;

      // Validate
      const currentContents = this.contents();
      for (const c of currentContents) {
          if (!c.title || (!c.url && c.type !== 'exam')) {
              this.notification.showError('Todos los recursos deben tener Título y Contenido/URL.');
              return;
          }
      }

      this.saving.set(true);
      
      try {
          const res = await firstValueFrom(this.coursesService.saveModuleContents(modId, currentContents));
          
          if (res?.error) {
              throw res.error;
          }

          const savedContents = res?.data || [];
          
          // Now save questions for any exam contents
          for (let i = 0; i < savedContents.length; i++) {
              const savedItem = savedContents[i];
              if (savedItem.type === 'exam' && savedItem.metadata?.questions) {
                  const questionsPayload = savedItem.metadata.questions.map((q: any, idx: number) => ({
                      question_text: q.question_text,
                      options: q.options,
                      correct_option_index: q.correct_option_index ?? 0,
                      order_index: idx
                  }));
                  
                  const qRes = await firstValueFrom(this.coursesService.saveExamQuestions(savedItem.id, questionsPayload));
                  if (qRes?.error) {
                      this.logger.error('Failed to save exam questions', qRes.error);
                      this.notification.showError('Materiales guardados, pero falló al guardar las preguntas del examen.');
                      this.saving.set(false);
                      return;
                  }
              }
          }

          this.notification.showSuccess('Materiales y exámenes guardados correctamente.');
          this.contents.set(savedContents);
          
      } catch (err: any) {
          this.notification.showError('Error al guardar materiales: ' + err.message);
      } finally {
          this.saving.set(false);
      }
  }

  // --- Exam Editor Logic ---

  async openExamEditor(content: ModuleContent) {
      if (!content.metadata) content.metadata = { passing_score: 60, questions: [] };
      
      if (content.id) {
          try {
              const res = await firstValueFrom(this.coursesService.getExamQuestions(content.id));
              if (res.data && res.data.length > 0) {
                  // Ensure correct format and types
                  content.metadata.questions = res.data.sort((a: any, b: any) => a.order_index - b.order_index).map((q: any) => ({
                      question_text: q.question_text,
                      options: q.options,
                      correct_option_index: Number(q.correct_option_index) || 0
                  }));
              } else {
                  content.metadata.questions = content.metadata.questions || [];
              }
          } catch (err) {
              this.logger.error('Error fetching exam questions', err);
              if (!content.metadata.questions) content.metadata.questions = [];
          }
      } else {
          if (!content.metadata.questions) content.metadata.questions = [];
      }
      
      this.editingExamContent = content;
  }

  closeExamEditor() {
      this.editingExamContent = null;
  }

  addQuestion() {
      if (!this.editingExamContent) return;
      this.editingExamContent.metadata.questions.push({
          question_text: '',
          options: ['Opción 1', 'Opción 2'],
          correct_option_index: 0
      });
  }

  removeQuestion(index: number) {
      if (!this.editingExamContent) return;
      this.editingExamContent.metadata.questions.splice(index, 1);
  }

  addOption(q: any) {
      q.options.push('Nueva Opción');
  }

  removeOption(q: any, index: number) {
      q.options.splice(index, 1);
      if (q.correct_option_index >= q.options.length) {
          q.correct_option_index = 0;
      }
  }

  trackOptionChange(q: any, index: number, value: string) {
      q.options[index] = value;
  }
}
