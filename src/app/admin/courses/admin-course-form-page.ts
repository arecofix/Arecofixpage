import { Component, inject, OnInit } from '@angular/core';

import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CoursesService } from '@app/core/services/courses.service';

@Component({
  selector: 'app-admin-course-form-page',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <div class="max-w-4xl mx-auto">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold">
          {{ isEditing ? 'Editar Curso' : 'Nuevo Curso' }}
        </h2>
        <a routerLink="/admin/courses" class="btn btn-ghost">
          <i class="fas fa-arrow-left mr-2"></i> Volver
        </a>
      </div>
    
      <div class="card bg-base-100 shadow-lg">
        <div class="card-body p-6">
          <form [formGroup]="form" (ngSubmit)="save()" class="space-y-6">
        
            <!-- Basic Info -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="form-control">
                <label class="label">
                  <span class="label-text font-medium">Título</span>
                </label>
                <label class="input input-bordered flex items-center gap-2">
                  <i class="fas fa-heading text-gray-400"></i>
                  <input type="text" formControlName="title" class="grow" placeholder="Ej: Reparación de iPhone" />
                </label>
              </div>
        
              <div class="form-control">
                <label class="label">
                  <span class="label-text font-medium">Slug (URL)</span>
                </label>
                <label class="input input-bordered flex items-center gap-2">
                  <i class="fas fa-link text-gray-400"></i>
                  <input type="text" formControlName="slug" class="grow" placeholder="ej: reparacion-iphone" />
                </label>
                <label class="label">
                  <span class="label-text-alt text-xs text-gray-500">Identificador único para la URL</span>
                </label>
              </div>
            </div>
        
            <div class="form-control">
              <label class="label">
                <span class="label-text font-medium">Descripción Corta</span>
              </label>
              <textarea formControlName="description" class="textarea textarea-bordered h-24 leading-relaxed" placeholder="Breve resumen del curso..."></textarea>
            </div>
        
            <!-- Details -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div class="form-control">
                <label class="label">
                  <span class="label-text font-medium">Precio</span>
                </label>
                <label class="input input-bordered flex items-center gap-2">
                  <i class="fas fa-dollar-sign text-gray-400"></i>
                  <input type="number" formControlName="price" class="grow" />
                </label>
              </div>
        
              <div class="form-control">
                <label class="label">
                  <span class="label-text font-medium">Precio Oferta (Opcional)</span>
                </label>
                <label class="input input-bordered flex items-center gap-2">
                  <i class="fas fa-tag text-gray-400"></i>
                  <input type="number" formControlName="sale_price" class="grow" />
                </label>
              </div>
        
              <div class="form-control">
                <label class="label">
                  <span class="label-text font-medium">Nivel</span>
                </label>
                <select formControlName="level" class="select select-bordered w-full">
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
                  <span class="label-text font-medium">Duración</span>
                </label>
                <label class="input input-bordered flex items-center gap-2">
                  <i class="fas fa-clock text-gray-400"></i>
                  <input type="text" formControlName="duration" class="grow" placeholder="Ej: 3 meses" />
                </label>
              </div>
        
              <div class="form-control">
                <label class="label">
                  <span class="label-text font-medium">Horario</span>
                </label>
                <label class="input input-bordered flex items-center gap-2">
                  <i class="fas fa-calendar-alt text-gray-400"></i>
                  <input type="text" formControlName="schedule" class="grow" placeholder="Ej: Lunes 18hs" />
                </label>
              </div>
            </div>
        
            <!-- Media -->
            <div class="form-control">
              <label class="label">
                <span class="label-text font-medium">URL de Imagen</span>
              </label>
              <label class="input input-bordered flex items-center gap-2">
                <i class="fas fa-image text-gray-400"></i>
                <input type="text" formControlName="image_url" class="grow" placeholder="https://..." />
              </label>
              @if (form.get('image_url')?.value) {
                <div class="mt-4 p-4 border rounded-lg bg-base-200 flex justify-center">
                  <img [src]="form.get('image_url')?.value" 
                       class="h-48 rounded object-cover shadow-sm" 
                       alt="Preview" 
                       onerror="this.style.display='none'" />
                </div>
              }
            </div>
        
            <div class="form-control">
              <label class="label cursor-pointer justify-start gap-4 p-0">
                <span class="label-text font-medium">Curso Activo</span>
                <input type="checkbox" formControlName="is_active" class="toggle toggle-success" />
              </label>
            </div>
        
            <!-- Actions -->
            <div class="flex justify-end gap-4 pt-6 border-t border-base-200">
              <a routerLink="/admin/courses" class="btn btn-ghost">Cancelar</a>
              <button type="submit" class="btn btn-primary px-8" [disabled]="form.invalid || saving">
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

  loadCourse(id: string) {
    this.coursesService.getCourseById(id).subscribe({
      next: (course) => {
        this.form.patchValue(course);
      },
      error: (err) => console.error('Error loading course', err)
    });
  }

  save() {
    if (this.form.invalid) return;

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
