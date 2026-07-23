import { Component, inject, signal, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { SubmitCourseProposalUseCase } from '@app/features/courses/application/usecases/submit-course-proposal.usecase';
import { Course } from '@app/features/courses/domain/entities/course.entity';

@Component({
  selector: 'app-course-builder',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div class="max-w-4xl mx-auto px-4 sm:px-6">
        
        <div class="mb-8 flex items-center justify-between">
          <div>
            <a routerLink="/instructor" class="text-sm text-indigo-600 hover:underline mb-2 inline-block">&larr; Volver al Panel</a>
            <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
              {{ isEdit() ? 'Editar Curso' : 'Sugerir Capacitación' }}
            </h1>
          </div>
          <div class="flex space-x-3">
            <button (click)="save('DRAFT')" class="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded hover:bg-gray-300 transition">
              Guardar Borrador
            </button>
            <button (click)="save('PENDING')" class="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition" [disabled]="saving()">
              {{ saving() ? 'Enviando...' : 'Enviar a Revisión' }}
            </button>
          </div>
        </div>

        <!-- Builder Flow (Minimalist UI) -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-8">
          
          <!-- Step 1: Info General -->
          <div class="space-y-6">
            <h3 class="text-xl font-bold text-gray-900 dark:text-white border-b pb-2 dark:border-gray-700">1. Información General</h3>
            
            <div class="grid grid-cols-1 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Título del Curso *</label>
                <input type="text" [(ngModel)]="courseData.title" class="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Descripción Detallada *</label>
                <textarea [(ngModel)]="courseData.description" rows="4" class="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"></textarea>
              </div>

              <div class="grid grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Categoría</label>
                  <select [(ngModel)]="courseData.slug" class="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
                    <option value="tech">Tecnología y Hardware</option>
                    <option value="code">Programación</option>
                    <option value="trades">Oficios y Estética</option>
                  </select>
                  <p class="text-xs text-gray-500 mt-1">Usamos el slug temporalmente para la categoría.</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nivel</label>
                  <select [(ngModel)]="courseData.level" class="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
                    <option value="basic">Principiante</option>
                    <option value="intermediate">Intermedio</option>
                    <option value="advanced">Avanzado</option>
                    <option value="all">Todos los niveles</option>
                  </select>
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">URL Video de Muestra (2 mins) *</label>
                <input type="url" [(ngModel)]="courseData.preview_video_url" placeholder="https://youtube.com/..." class="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
                <p class="text-xs text-gray-500 mt-1">Sube un video de prueba para evaluar calidad de audio y pedagógica.</p>
              </div>
            </div>
          </div>

          <!-- Step 2: Módulos (Minimalist) -->
          <div class="space-y-6 mt-12">
            <h3 class="text-xl font-bold text-gray-900 dark:text-white border-b pb-2 dark:border-gray-700 flex justify-between items-center">
              2. Estructura de Módulos
              <button (click)="addModule()" class="text-sm bg-indigo-100 text-indigo-700 px-3 py-1 rounded hover:bg-indigo-200">
                + Agregar Módulo
              </button>
            </h3>

            @if (modules.length === 0) {
              <p class="text-gray-500 italic text-sm">No hay módulos creados. Agrega tu primer módulo.</p>
            }

            <div class="space-y-6">
              @for (mod of modules; track $index) {
                <div class="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl border border-gray-200 dark:border-gray-600">
                  <div class="flex items-center space-x-3 mb-4">
                    <div class="flex flex-col space-y-1">
                      <button (click)="moveModule($index, -1)" [disabled]="$index === 0" class="text-gray-400 hover:text-indigo-600 disabled:opacity-30"><i class="fas fa-chevron-up"></i></button>
                      <button (click)="moveModule($index, 1)" [disabled]="$index === modules.length - 1" class="text-gray-400 hover:text-indigo-600 disabled:opacity-30"><i class="fas fa-chevron-down"></i></button>
                    </div>
                    <div class="flex-1">
                      <input type="text" [(ngModel)]="mod.title" placeholder="Título del Módulo" class="w-full text-lg font-bold rounded border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white">
                    </div>
                    <button (click)="removeModule($index)" class="text-red-500 hover:text-red-700 p-2">
                      <i class="fas fa-trash"></i>
                    </button>
                  </div>

                  <!-- Dropzone Gestor de Archivos -->
                  <div class="mt-4 pl-8 border-l-2 border-indigo-100 dark:border-indigo-900 ml-2">
                    <h4 class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3"><i class="fas fa-photo-video text-indigo-500 mr-2"></i> Contenidos (Videos, Docs)</h4>
                    
                    <!-- Lista de archivos del módulo -->
                    <div class="space-y-2 mb-4">
                       @for (content of mod.contents; track content.id) {
                         <div class="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded border border-gray-100 dark:border-gray-700">
                           <div class="flex items-center space-x-3">
                             @if (content.type === 'video') { <i class="fas fa-video text-pink-500"></i> }
                             @else if (content.type === 'document') { <i class="fas fa-file-pdf text-red-500"></i> }
                             @else { <i class="fas fa-image text-blue-500"></i> }
                             <span class="text-sm font-medium dark:text-white">{{ content.title || 'Archivo Adjunto' }}</span>
                           </div>
                           <button class="text-red-400 hover:text-red-600" (click)="removeContent(mod, content)"><i class="fas fa-times"></i></button>
                         </div>
                       }
                    </div>

                    <!-- Dropzone -->
                    <div 
                      class="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer relative"
                      (dragover)="onDragOver($event)" (dragleave)="onDragLeave($event)" (drop)="onDrop($event, mod)"
                    >
                      <i class="fas fa-cloud-upload-alt text-3xl text-gray-400 mb-2"></i>
                      <p class="text-sm text-gray-600 dark:text-gray-400">Arrastra archivos aquí o haz clic para subir</p>
                      <input type="file" multiple (change)="onFileSelected($event, mod)" class="absolute inset-0 w-full h-full opacity-0 cursor-pointer">
                      
                      @if (mod.uploading) {
                        <div class="mt-4">
                          <progress class="progress progress-primary w-full" [value]="mod.uploadProgress" max="100"></progress>
                          <span class="text-xs text-indigo-500 font-semibold">{{ mod.uploadProgress }}% Subiendo...</span>
                        </div>
                      }
                    </div>
                  </div>
                </div>
              }
            </div>
          </div>

          @if (errorMsg()) {
            <div class="mt-8 p-4 bg-red-50 text-red-800 rounded">
              {{ errorMsg() }}
            </div>
          }

        </div>
      </div>
    </div>
  `
})
export class CourseBuilderComponent {
  private router = inject(Router);
  route = inject(ActivatedRoute);
  submitUseCase = inject(SubmitCourseProposalUseCase);
  cd = inject(ChangeDetectorRef);
  
  isEdit = signal(false);
  saving = signal(false);
  errorMsg = signal('');

  courseData: Partial<Course> = {
    title: '',
    description: '',
    slug: 'tech',
    level: 'basic',
    preview_video_url: '',
    price: 0,
    duration: '1 mes',
    schedule: 'A tu propio ritmo',
    image_url: ''
  };

  modules: any[] = [];

  addModule() {
    this.modules.push({ id: crypto.randomUUID(), title: '', description: '', order_index: this.modules.length, contents: [], uploading: false, uploadProgress: 0 });
  }

  removeModule(index: number) {
    this.modules.splice(index, 1);
  }

  moveModule(index: number, direction: number) {
    if (index + direction < 0 || index + direction >= this.modules.length) return;
    const temp = this.modules[index];
    this.modules[index] = this.modules[index + direction];
    this.modules[index + direction] = temp;
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
  }

  async onDrop(event: DragEvent, mod: any) {
    event.preventDefault();
    if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
      await this.handleFiles(event.dataTransfer.files, mod);
    }
  }

  async onFileSelected(event: any, mod: any) {
    if (event.target.files && event.target.files.length > 0) {
      await this.handleFiles(event.target.files, mod);
    }
  }

  async handleFiles(files: FileList, mod: any) {
    mod.uploading = true;
    this.cd.detectChanges();
    // Simulate upload progress
    for (let i = 0; i <= 100; i += 10) {
      mod.uploadProgress = i;
      this.cd.detectChanges();
      await new Promise(r => setTimeout(r, 200));
    }
    
    // Simulate File Uploaded
    Array.from(files).forEach(file => {
      let type = 'document';
      if (file.type.startsWith('video/')) type = 'video';
      else if (file.type.startsWith('image/')) type = 'image';

      mod.contents.push({
        id: crypto.randomUUID(),
        title: file.name,
        type: type,
        url: 'https://supabase.com/storage/v1/object/public/course-contents/fake-url.mp4'
      });
    });
    
    mod.uploading = false;
    mod.uploadProgress = 0;
    this.cd.detectChanges();
  }

  removeContent(mod: any, content: any) {
    mod.contents = mod.contents.filter((c: any) => c.id !== content.id);
  }

  async save(status: 'DRAFT' | 'PENDING') {
    this.errorMsg.set('');
    
    if (status === 'PENDING') {
      if (!this.courseData.title || !this.courseData.description || !this.courseData.preview_video_url) {
        this.errorMsg.set('Título, descripción y video de muestra son obligatorios para enviar a revisión.');
        return;
      }
    }

    this.saving.set(true);
    this.courseData.status = status;
    // Embed modules in syllabus as JSON for now to simplify
    this.courseData.syllabus = this.modules;

    const res = await this.submitUseCase.execute(this.courseData);
    this.saving.set(false);

    if (res.success) {
      this.router.navigate(['/instructor']);
    } else {
      this.errorMsg.set(res.error?.message || 'Error al guardar el curso.');
    }
  }
}
