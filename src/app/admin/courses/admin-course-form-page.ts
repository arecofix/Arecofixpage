import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';


import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CoursesService, Module } from '@app/core/services/courses.service';
import { ProductMediaService } from '@app/admin/products/services/product-media.service';
import { LoggerService } from '@app/core/services/logger.service';

@Component({
  selector: 'app-admin-course-form-page',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <div class="max-w-5xl mx-auto pb-12">
      <!-- Header -->
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 class="text-3xl font-black text-gray-900 dark:text-white mb-1 flex items-center gap-3">
             <a routerLink="/admin/courses" class="btn btn-sm btn-circle btn-ghost text-slate-400 hover:text-white transition-colors">
              <i class="fas fa-arrow-left"></i>
             </a>
            {{ isEditing ? 'Editar Programa Educativo' : 'Nuevo Programa Educativo' }}
          </h2>
          <p class="text-sm text-gray-500 dark:text-slate-400 ml-11">Configura la oferta educativa, precio y presentación para los alumnos.</p>
        </div>
      </div>
    
      <form [formGroup]="form" (ngSubmit)="save()">
        
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <!-- Left Column (Main Info & Pricing) -->
          <div class="lg:col-span-2 space-y-8">
            
            <!-- Bloque 1: Identidad del Curso -->
            <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden">
              <div class="bg-slate-50 dark:bg-slate-900/50 px-6 py-4 border-b border-gray-100 dark:border-slate-700">
                <h3 class="font-bold text-gray-900 dark:text-white flex items-center gap-2"><i class="fas fa-tag text-blue-500"></i> Identidad y Detalles</h3>
              </div>
              <div class="p-6 space-y-6">
                <!-- Título -->
                <div class="form-control">
                  <label class="label">
                    <span class="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Título Comercial</span>
                  </label>
                  <label class="input bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500 transition-colors flex items-center gap-3 rounded-xl focus-within:ring-2 focus-within:ring-blue-500/20 px-4 h-12 text-gray-900 dark:text-white">
                    <i class="fas fa-heading text-slate-400 dark:text-slate-500"></i>
                    <input type="text" formControlName="title" class="grow bg-transparent placeholder:text-slate-400 dark:placeholder:text-slate-600 outline-none" placeholder="Ej: Especialización en Hardware Apple" />
                  </label>
                  @if (form.get('title')?.invalid && form.get('title')?.touched) {
                    <span class="text-red-500 text-xs font-medium mt-1.5 flex items-center gap-1"><i class="fas fa-exclamation-circle"></i> El título es obligatorio</span>
                  }
                </div>
          
                <!-- Slug & Nivel -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div class="form-control">
                    <label class="label">
                      <span class="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">URL (Slug)</span>
                    </label>
                    <label class="input bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500 transition-colors flex items-center gap-3 rounded-xl px-4 h-12 text-gray-900 dark:text-white">
                      <i class="fas fa-link text-slate-400 dark:text-slate-500"></i>
                      <input type="text" formControlName="slug" class="grow bg-transparent placeholder:text-slate-400 dark:placeholder:text-slate-600 outline-none" placeholder="ej: hardware-apple" />
                    </label>
                  </div>
                  <div class="form-control">
                    <label class="label">
                      <span class="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Dificultad / Nivel</span>
                    </label>
                    <select formControlName="level" class="select select-bordered bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-700 text-gray-900 dark:text-white rounded-xl h-12">
                      <option value="Básico">Básico (Inicial)</option>
                      <option value="Intermedio">Intermedio (Requiere experiencia)</option>
                      <option value="Avanzado">Avanzado (Profesionales)</option>
                      <option value="Todos los niveles">Apto para todo público</option>
                    </select>
                  </div>
                </div>
          
                <!-- Descripción -->
                <div class="form-control">
                  <label class="label">
                    <span class="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Descripción / Propuesta de Valor</span>
                  </label>
                  <textarea formControlName="description" class="textarea textarea-bordered bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-700 text-gray-900 dark:text-white rounded-xl h-28 resize-none focus:ring-2 focus:ring-blue-500/20" placeholder="¿Qué va a lograr el alumno con este curso? Redactá un texto vendedor..."></textarea>
                </div>
              </div>
            </div>

            <!-- Bloque 2: Logística y Tiempos -->
            <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden">
              <div class="bg-slate-50 dark:bg-slate-900/50 px-6 py-4 border-b border-gray-100 dark:border-slate-700">
                <h3 class="font-bold text-gray-900 dark:text-white flex items-center gap-2"><i class="fas fa-calendar-alt text-purple-500"></i> Cursada y Logística</h3>
              </div>
              <div class="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Duración -->
                <div class="form-control">
                  <label class="label">
                    <span class="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Duración Total</span>
                  </label>
                  <label class="input bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 flex items-center gap-3 rounded-xl px-4 h-12 text-gray-900 dark:text-white">
                    <i class="fas fa-hourglass-half text-slate-400 dark:text-slate-500"></i>
                    <input type="text" formControlName="duration" class="grow bg-transparent placeholder:text-slate-400 dark:placeholder:text-slate-600 outline-none" placeholder="Ej: 3 meses (12 clases)" />
                  </label>
                </div>
                <!-- Horarios -->
                <div class="form-control">
                  <label class="label">
                    <span class="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Días y Horarios</span>
                  </label>
                  <label class="input bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 flex items-center gap-3 rounded-xl px-4 h-12 text-gray-900 dark:text-white">
                    <i class="fas fa-clock text-slate-400 dark:text-slate-500"></i>
                    <input type="text" formControlName="schedule" class="grow bg-transparent placeholder:text-slate-400 dark:placeholder:text-slate-600 outline-none" placeholder="Ej: Lunes y Miércoles 18hs a 21hs" />
                  </label>
                </div>
              </div>
            </div>

            <!-- Bloque 3: Staff & Social Proof (Métricas Semilla) -->
            <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden">
              <div class="bg-slate-50 dark:bg-slate-900/50 px-6 py-4 border-b border-gray-100 dark:border-slate-700">
                <h3 class="font-bold text-gray-900 dark:text-white flex items-center gap-2"><i class="fas fa-star text-yellow-500"></i> Marketing y Prestigio</h3>
              </div>
              <div class="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                <!-- Instructor -->
                <div class="form-control md:col-span-1">
                  <label class="label">
                    <span class="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Instructor</span>
                  </label>
                  <label class="input bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 flex items-center gap-3 rounded-xl px-4 h-12 text-gray-900 dark:text-white">
                    <i class="fas fa-chalkboard-teacher text-slate-400 dark:text-slate-500"></i>
                    <input type="text" formControlName="instructor_name" class="grow bg-transparent placeholder:text-slate-400 dark:placeholder:text-slate-600 outline-none" placeholder="Ej: Ezequiel" />
                  </label>
                </div>
                <!-- Alumnos Ficticios -->
                <div class="form-control">
                  <label class="label">
                    <span class="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Alumnos (Semilla)</span>
                  </label>
                  <label class="input bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 flex items-center gap-3 rounded-xl px-4 h-12 text-gray-900 dark:text-white">
                    <i class="fas fa-users text-slate-400 dark:text-slate-500"></i>
                    <input type="number" formControlName="students" class="grow bg-transparent placeholder:text-slate-400 dark:placeholder:text-slate-600 outline-none" placeholder="Ej: 120" />
                  </label>
                  <span class="text-[10px] text-slate-500 mt-1">Sirve para generar prueba social.</span>
                </div>
                <!-- Calificación -->
                <div class="form-control">
                  <label class="label">
                    <span class="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Rating</span>
                  </label>
                  <label class="input bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 flex items-center gap-3 rounded-xl px-4 h-12 text-gray-900 dark:text-white">
                    <i class="fas fa-star text-yellow-500"></i>
                    <input type="number" step="0.1" max="5.0" formControlName="rating" class="grow bg-transparent placeholder:text-slate-400 dark:placeholder:text-slate-600 outline-none" placeholder="Ej: 4.9" />
                  </label>
                  <span class="text-[10px] text-slate-500 mt-1">Sugerido: 4.8 a 5.0</span>
                </div>
              </div>
            </div>

            <!-- Bloque 4: Gestor de Módulos (Temario) -->
            <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden">
              <div class="bg-slate-50 dark:bg-slate-900/50 px-6 py-4 border-b border-gray-100 dark:border-slate-700 flex justify-between items-center h-[72px]">
                <h3 class="font-bold text-gray-900 dark:text-white flex items-center gap-2"><i class="fas fa-list-ol text-orange-500"></i> Gestor de Módulos (Temario)</h3>
                <button type="button" class="btn btn-sm btn-ghost hover:bg-orange-50 dark:hover:bg-orange-900/20 text-orange-600 dark:text-orange-500 rounded-xl" (click)="addModule()">
                  <i class="fas fa-plus"></i> <span class="hidden sm:inline">Agregar Módulo</span>
                </button>
              </div>
              <div class="p-6 space-y-4" formArrayName="modules">
                @if (modulesFormArray.length === 0) {
                   <div class="text-center py-10 text-slate-500 bg-slate-50 dark:bg-slate-900/50 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700">
                     <i class="fas fa-sitemap text-4xl mb-3 opacity-30"></i>
                     <p class="text-sm">Aún no agregaste ningún módulo al temario del curso.</p>
                     <button type="button" class="btn btn-sm btn-outline mt-4 rounded-xl" (click)="addModule()">Crear el Primer Módulo</button>
                   </div>
                }
                @for (mod of modulesFormArray.controls; track $index) {
                  <div [formGroupName]="$index" class="bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl p-4 flex gap-4 items-start relative group transition-all hover:shadow-md hover:border-blue-400 dark:hover:border-blue-500">
                    
                    <div class="flex-none pt-3 text-slate-400 font-bold text-lg w-8 text-center" title="Orden">
                      {{ $index + 1 }}
                    </div>
                    
                    <div class="grow space-y-4">
                      <div class="form-control">
                        <input type="text" formControlName="title" class="input bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:border-blue-500 w-full font-bold text-gray-900 dark:text-white h-11 rounded-lg" placeholder="Título (ej: Módulo 1: Fundamentos de Microelectrónica...)" />
                      </div>
                      <div class="form-control">
                        <textarea formControlName="description" class="textarea bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:border-blue-500 w-full text-gray-900 dark:text-white resize-none h-20 rounded-lg text-sm" placeholder="Breve descripción de los temas a cubrir (Opcional)..."></textarea>
                      </div>
                    </div>
                    
                    <div class="flex-none pt-1">
                      <button type="button" class="btn btn-square btn-sm btn-ghost text-red-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20" (click)="removeModule($index)" title="Eliminar Módulo">
                        <i class="fas fa-trash"></i>
                      </button>
                    </div>
                    
                  </div>
                }
              </div>
            </div>

          </div>

          <!-- Right Column (Pricing & Media) -->
          <div class="lg:col-span-1 space-y-8">
            
            <!-- Estado / Publicación -->
            <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 p-6">
               <div class="form-control">
                  <label class="cursor-pointer flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-xl transition-colors"
                         [class.border-emerald-500]="form.get('is_active')?.value"
                         [class.bg-emerald-50]="form.get('is_active')?.value"
                         [class.dark:bg-emerald-900/10]="form.get('is_active')?.value"
                         [class.border-slate-300]="!form.get('is_active')?.value"
                         [class.dark:border-slate-700]="!form.get('is_active')?.value">
                    <div class="flex items-center gap-3 w-full">
                      <div class="flex-1">
                        <span class="block text-sm font-bold text-gray-900 dark:text-white">{{ form.get('is_active')?.value ? 'Curso Público' : 'Modo Borrador' }}</span>
                        <span class="block text-xs text-slate-500 dark:text-slate-400 mt-1">{{ form.get('is_active')?.value ? 'Visible en la academia para todos' : 'Oculto, solo lo ven admins' }}</span>
                      </div>
                      <input type="checkbox" formControlName="is_active" class="toggle toggle-success" />
                    </div>
                  </label>
                </div>
            </div>

            <!-- Precios -->
            <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden">
              <div class="bg-slate-50 dark:bg-slate-900/50 px-6 py-4 border-b border-gray-100 dark:border-slate-700">
                <h3 class="font-bold text-gray-900 dark:text-white flex items-center gap-2"><i class="fas fa-money-bill-wave text-emerald-500"></i> Estrategia de Precio</h3>
              </div>
              <div class="p-6 space-y-4">
                <div class="form-control">
                  <label class="label"><span class="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Inversión Real (Mensual/Total)</span></label>
                  <label class="input bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 flex items-center gap-3 rounded-xl px-4 h-12 text-gray-900 dark:text-white">
                    <span class="font-bold text-emerald-600 dark:text-emerald-500">$</span>
                    <input type="number" formControlName="price" class="grow bg-transparent placeholder:text-slate-400 dark:placeholder:text-slate-600 outline-none text-lg font-bold" />
                  </label>
                </div>
                
                <div class="form-control">
                  <label class="label"><span class="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Precio Ficticio (Tachado)</span></label>
                  <label class="input bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 flex items-center gap-3 rounded-xl px-4 h-12 text-gray-900 dark:text-white opacity-80">
                    <span class="text-slate-400">$</span>
                    <input type="number" formControlName="sale_price" class="grow bg-transparent placeholder:text-slate-400 dark:placeholder:text-slate-600 outline-none" placeholder="Opcional..." />
                  </label>
                  <span class="text-[10px] text-slate-500 dark:text-slate-400 mt-1.5 ml-1">Usalo para generar urgencia mostrando un descuento.</span>
                </div>
              </div>
            </div>

            <!-- Multimedia -->
            <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden">
              <div class="bg-slate-50 dark:bg-slate-900/50 px-6 py-4 border-b border-gray-100 dark:border-slate-700">
                <h3 class="font-bold text-gray-900 dark:text-white flex items-center gap-2"><i class="fas fa-image text-pink-500"></i> Portada del Curso</h3>
              </div>
              <div class="p-6">
                <!-- Image Preview Area -->
                <div class="relative w-full aspect-video rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 mb-4 group flex items-center justify-center">
                  @if (form.get('image_url')?.value) {
                    <img [src]="getImageSrc(form.get('image_url')?.value)" class="w-full h-full object-cover" alt="Portada" onerror="this.src='/assets/img/cursos/1.jpg'" />
                    <div class="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                       <span class="text-white font-bold text-sm bg-black/50 px-4 py-2 rounded-lg backdrop-blur-md border border-white/20"><i class="fas fa-exchange-alt mr-2"></i> Cambiar Portada</span>
                    </div>
                  } @else {
                    <div class="text-slate-400 dark:text-slate-600 flex flex-col items-center">
                      <i class="fas fa-cloud-upload-alt text-4xl mb-2"></i>
                      <span class="text-sm font-medium">Sin imagen</span>
                    </div>
                  }
                  
                  <!-- Invisible File Input overlapping the entire box for easy click -->
                  <input type="file" (change)="onFileChange($event)" accept="image/*" class="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                </div>
                
                <div class="form-control">
                  <span class="text-[10px] text-center text-slate-500 dark:text-slate-400 mb-2">O pega una URL directamente:</span>
                  <input type="text" formControlName="image_url" class="input input-sm bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-700 text-xs text-gray-900 dark:text-white w-full rounded-lg text-center" placeholder="https://..." />
                </div>
              </div>
            </div>

          </div>
        </div>
        
        <!-- Sticky Bottom Actions Bar -->
        <div class="fixed bottom-0 left-0 w-full z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-t border-slate-200 dark:border-slate-800 p-4 shadow-[0_-10px_30px_rgba(0,0,0,0.1)]">
          <div class="container mx-auto max-w-5xl flex justify-between items-center px-4">
            <button type="button" class="btn btn-ghost text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl" routerLink="/admin/courses">
              Cancelar
            </button>
            <button type="submit" class="btn border-none bg-blue-600 hover:bg-blue-700 text-white px-10 rounded-xl shadow-lg shadow-blue-500/30 text-base flex items-center gap-2 transition-all" [disabled]="saving">
              @if (saving) {
                <span class="loading loading-spinner text-white w-5"></span> Guardando datos...
              } @else {
                <i class="fas fa-save"></i> {{ isEditing ? 'Guardar Cambios' : 'Lanzar Programa Educativo' }}
              }
            </button>
          </div>
        </div>

      </form>
    </div>
  `
})
export class AdminCourseFormPage implements OnInit {
  private fb = inject(FormBuilder);
  private coursesService = inject(CoursesService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private mediaService = inject(ProductMediaService);
  private cdr = inject(ChangeDetectorRef);
  private logger = inject(LoggerService);


  form: FormGroup;
  isEditing = false;
  courseId: string | null = null;
  saving = false;

  constructor() {
    this.form = this.fb.group({
      title: ['', Validators.required],
      slug: ['', Validators.required],
      description: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      sale_price: [null],
      level: ['Básico', Validators.required],
      duration: ['', Validators.required],
      schedule: ['', Validators.required],
      image_url: ['', Validators.required],
      is_active: [true],
      instructor_name: [''],
      students: [0],
      rating: [5.0],
      modules: this.fb.array([])
    });
  }

  get modulesFormArray() {
    return this.form.get('modules') as FormArray;
  }

  addModule(modData?: Partial<Module>) {
    const moduleGroup = this.fb.group({
      id: [modData?.id || null],
      title: [modData?.title || '', Validators.required],
      description: [modData?.description || ''],
      order_index: [modData?.order_index || this.modulesFormArray.length + 1]
    });
    this.modulesFormArray.push(moduleGroup);
  }

  removeModule(index: number) {
    this.modulesFormArray.removeAt(index);
  }

  ngOnInit() {
    this.courseId = this.route.snapshot.paramMap.get('id');
    if (this.courseId) {
      this.isEditing = true;
      this.loadCourse(this.courseId);
    }
  }

  getImageSrc(url: string | null): string {
    if (!url) return '';
    if (url.startsWith('http') || url.startsWith('/')) {
      return url;
    }
    // If it is a relative path (e.g. from existing database seed), prepend /
    return '/' + url;
  }

  async onFileChange(event: any) {
    const file: File = event.target.files?.[0];
    if (!file) return;

    this.saving = true;
    this.cdr.markForCheck(); // Force update UI to show spinner

    try {
      const publicUrl = await this.mediaService.uploadFile(file, 'courses');
      this.form.patchValue({ image_url: publicUrl });
      this.cdr.markForCheck(); // Update preview
    } catch (error: any) {
      this.logger.error('Error uploading image', error);
      alert('Error al subir la imagen: ' + (error.message || error));
    } finally {
      this.saving = false;
      this.cdr.markForCheck(); // Ensure spinner stops
      // Reset input so same file can be selected again if needed
      if (event.target) event.target.value = '';
    }
  }

  loadCourse(id: string) {
    this.coursesService.getCourseById(id).subscribe({
      next: (response: { data: any, error: any }) => {
        if (response.data) {
          this.form.patchValue(response.data);
        }
      },
      error: (err: any) => this.logger.error('Error loading course', err)
    });

    this.coursesService.getModulesByCourseId(id).subscribe({
      next: (res: { data: any[], error: any }) => {
        if (res.data && res.data.length > 0) {
            this.modulesFormArray.clear();
            res.data.forEach((m: any) => this.addModule(m));
        }
      },
      error: (err: any) => this.logger.error('Error loading modules', err)
    });
  }

  async save() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      alert('Por favor completa todos los campos requeridos');
      return;
    }

    this.saving = true;
    const { modules, ...courseData } = this.form.value;
    
    this.logger.debug('Starting course save workflow', { isEditing: this.isEditing });

    try {
      let courseResult;
      if (this.isEditing && this.courseId) {
        courseResult = await this.coursesService.updateCourse(this.courseId, courseData).toPromise();
      } else {
        courseResult = await this.coursesService.createCourse(courseData).toPromise();
      }

      if (courseResult?.error) {
        throw new Error(courseResult.error.message || 'Error al guardar el curso');
      }

      const savedCourseId = courseResult?.data?.id || this.courseId;
      
      if (savedCourseId && modules && modules.length >= 0) {
        try {
          await this.coursesService.saveModules(savedCourseId, modules).toPromise();
        } catch (modErr: any) {
          this.logger.warn('Failed to sync modules', modErr);
          alert('El programa se guardó con éxito pero falló la sincronización de los Módulos. Esto puede deberse a que no has aplicado las migraciones de Base de Datos para el Temario.');
        }
      }
      
      this.router.navigate(['/admin/courses']);
      
    } catch (err: any) {
      this.logger.error('Save workflow failed', err);
      alert('Error al guardar: ' + err.message);
    } finally {
      this.saving = false;
    }
  }
}
