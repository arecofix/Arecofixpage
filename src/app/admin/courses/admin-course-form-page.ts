import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';


import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CoursesService } from '@app/core/services/courses.service';
import { AuthService } from '@app/core/services/auth.service';

@Component({
  selector: 'app-admin-course-form-page',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <div class="max-w-4xl mx-auto">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold text-base-content">
          {{ isEditing ? 'Editar Curso' : 'Nuevo Curso' }}
        </h2>
        <a routerLink="/admin/courses" class="btn btn-ghost text-base-content">
          <i class="fas fa-arrow-left mr-2"></i> Volver
        </a>
      </div>
    
      <div class="card bg-base-100 shadow-xl border border-base-200">
        <div class="card-body p-8">
          <form [formGroup]="form" (ngSubmit)="save()" class="space-y-6">
        
            <!-- Basic Info -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="form-control">
                <label class="label">
                  <span class="label-text font-medium text-base-content/80">Título</span>
                </label>
                <label class="input input-bordered flex items-center gap-2 bg-base-100 text-base-content">
                  <i class="fas fa-heading text-base-content/50"></i>
                  <input type="text" formControlName="title" class="grow placeholder:text-base-content/30" placeholder="Ej: Reparación de iPhone" />
                </label>
                @if (form.get('title')?.invalid && form.get('title')?.touched) {
                  <span class="text-error text-xs mt-1">El título es requerido</span>
                }
              </div>
        
              <div class="form-control">
                <label class="label">
                  <span class="label-text font-medium text-base-content/80">Slug (URL)</span>
                </label>
                <label class="input input-bordered flex items-center gap-2 bg-base-100 text-base-content">
                  <i class="fas fa-link text-base-content/50"></i>
                  <input type="text" formControlName="slug" class="grow placeholder:text-base-content/30" placeholder="ej: reparacion-iphone" />
                </label>
                <label class="label">
                  <span class="label-text-alt text-xs text-base-content/50">Identificador único para la URL</span>
                </label>
              </div>
            </div>
        
            <div class="form-control">
              <label class="label">
                <span class="label-text font-medium text-base-content/80">Descripción Corta</span>
              </label>
              <textarea formControlName="description" class="textarea textarea-bordered h-24 leading-relaxed bg-base-100 text-base-content placeholder:text-base-content/30" placeholder="Breve resumen del curso..."></textarea>
            </div>
        
            <!-- Details -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div class="form-control">
                <label class="label">
                  <span class="label-text font-medium text-base-content/80">Precio</span>
                </label>
                <label class="input input-bordered flex items-center gap-2 bg-base-100 text-base-content">
                  <i class="fas fa-dollar-sign text-base-content/50"></i>
                  <input type="number" formControlName="price" class="grow placeholder:text-base-content/30" />
                </label>
              </div>
        
              <div class="form-control">
                <label class="label">
                  <span class="label-text font-medium text-base-content/80">Precio Oferta (Opcional)</span>
                </label>
                <label class="input input-bordered flex items-center gap-2 bg-base-100 text-base-content">
                  <i class="fas fa-tag text-base-content/50"></i>
                  <input type="number" formControlName="sale_price" class="grow placeholder:text-base-content/30" />
                </label>
              </div>
        
              <div class="form-control">
                <label class="label">
                  <span class="label-text font-medium text-base-content/80">Nivel</span>
                </label>
                <select formControlName="level" class="select select-bordered w-full bg-base-100 text-base-content">
                  <option value="Básico">Básico</option>
                  <option value="Intermedio">Intermedio</option>
                  <option value="Avanzado">Avanzado</option>
                  <option value="Todos los niveles">Todos los niveles</option>
                </select>
              </div>
            </div>
        
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="form-control">
                <label class="label">
                  <span class="label-text font-medium text-base-content/80">Duración</span>
                </label>
                <label class="input input-bordered flex items-center gap-2 bg-base-100 text-base-content">
                  <i class="fas fa-clock text-base-content/50"></i>
                  <input type="text" formControlName="duration" class="grow placeholder:text-base-content/30" placeholder="Ej: 3 meses" />
                </label>
              </div>
        
              <div class="form-control">
                <label class="label">
                  <span class="label-text font-medium text-base-content/80">Horario</span>
                </label>
                <label class="input input-bordered flex items-center gap-2 bg-base-100 text-base-content">
                  <i class="fas fa-calendar-alt text-base-content/50"></i>
                  <input type="text" formControlName="schedule" class="grow placeholder:text-base-content/30" placeholder="Ej: Lunes 18hs" />
                </label>
              </div>
            </div>
        
            <!-- Media -->
            <div class="form-control">
              <label class="label">
                <span class="label-text font-medium text-base-content/80">Imagen del Curso</span>
              </label>
              
              <div class="flex flex-col gap-4">
                <!-- URL Input (Optional fallback) -->
                <label class="input input-bordered flex items-center gap-2 bg-base-100 text-base-content">
                  <i class="fas fa-link text-base-content/50"></i>
                  <input type="text" formControlName="image_url" class="grow placeholder:text-base-content/30" placeholder="https://..." />
                </label>

                <!-- File Upload -->
                <input type="file" 
                       (change)="onFileChange($event)" 
                       accept="image/*"
                       class="file-input file-input-bordered w-full bg-base-100 text-base-content" />
                
                <label class="label">
                  <span class="label-text-alt text-xs text-base-content/50">Sube una imagen o pega una URL</span>
                </label>
              </div>

              @if (form.get('image_url')?.value) {
                <div class="mt-4 p-4 border rounded-lg bg-base-200 flex justify-center relative group">
                  <img [src]="getImageSrc(form.get('image_url')?.value)" 
                       class="h-48 rounded object-cover shadow-sm" 
                       alt="Preview" 
                       onerror="this.style.display='none'" />
                </div>
              }
            </div>
        
            <div class="form-control">
              <label class="label cursor-pointer justify-start gap-4 p-0">
                <span class="label-text font-medium text-base-content/80">Curso Activo</span>
                <input type="checkbox" formControlName="is_active" class="toggle toggle-success" />
              </label>
            </div>
        
            <!-- Actions -->
            <div class="flex justify-end gap-4 pt-6 border-t border-base-200">
              <a routerLink="/admin/courses" class="btn btn-ghost text-base-content">Cancelar</a>
              <button type="submit" class="btn btn-primary px-8 text-white" [disabled]="saving">
                @if (saving) {
                  <span class="loading loading-spinner"></span>
                }
                {{ isEditing ? 'Actualizar' : 'Crear Curso' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
    `
})
export class AdminCourseFormPage implements OnInit {
  private fb = inject(FormBuilder);
  private coursesService = inject(CoursesService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private auth = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);


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
      is_active: [true]
    });
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

    const supabase = this.auth.getSupabaseClient();
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `courses/${fileName}`;

    try {
      // Create a timeout promise
      const timeout = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Tiempo de espera agotado al subir la imagen')), 15000)
      );

      // Race between upload and timeout
      const uploadPromise = supabase.storage
        .from('public-assets')
        .upload(filePath, file);
      
      const { data, error } = await Promise.race([uploadPromise, timeout]) as any;

      if (error) throw error;

      const { data: publicUrl } = supabase.storage
        .from('public-assets')
        .getPublicUrl(filePath);

      this.form.patchValue({ image_url: publicUrl.publicUrl });
      this.cdr.markForCheck(); // Update preview
    } catch (error: any) {
      console.error('Error uploading image:', error);
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
      next: (response) => {
        if (response.data) {
          this.form.patchValue(response.data);
        }
      },
      error: (err) => console.error('Error loading course', err)
    });
  }

  save() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      alert('Por favor completa todos los campos requeridos');
      return;
    }

    this.saving = true;
    const courseData = this.form.value;

    const request = this.isEditing && this.courseId
      ? this.coursesService.updateCourse(this.courseId, courseData)
      : this.coursesService.createCourse(courseData);

    request.subscribe({
      next: () => {
        this.saving = false;
        this.router.navigate(['/admin/courses']);
      },
      error: (err) => {
        console.error('Error saving course', err);
        alert('Error al guardar: ' + err.message);
        this.saving = false;
      }
    });
  }
}
