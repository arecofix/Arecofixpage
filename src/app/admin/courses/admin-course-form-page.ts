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
        <h2 class="text-2xl font-bold text-gray-800">
          {{ isEditing ? 'Editar Curso' : 'Nuevo Curso' }}
        </h2>
        <a routerLink="/admin/courses" class="btn btn-ghost">
          <i class="fas fa-arrow-left mr-2"></i> Volver
        </a>
      </div>
    
      <form [formGroup]="form" (ngSubmit)="save()" class="bg-white rounded-lg shadow p-6 space-y-6">
    
        <!-- Basic Info -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="form-control">
            <label class="label">Título</label>
            <input type="text" formControlName="title" class="input input-bordered" placeholder="Ej: Reparación de iPhone" />
          </div>
    
          <div class="form-control">
            <label class="label">Slug (URL)</label>
            <input type="text" formControlName="slug" class="input input-bordered" placeholder="ej: reparacion-iphone" />
            <label class="label text-xs text-gray-500">Identificador único para la URL</label>
          </div>
        </div>
    
        <div class="form-control">
          <label class="label">Descripción Corta</label>
          <textarea formControlName="description" class="textarea textarea-bordered h-24" placeholder="Breve resumen del curso..."></textarea>
        </div>
    
        <!-- Details -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="form-control">
            <label class="label">Precio</label>
            <input type="number" formControlName="price" class="input input-bordered" />
          </div>
    
          <div class="form-control">
            <label class="label">Precio Oferta (Opcional)</label>
            <input type="number" formControlName="sale_price" class="input input-bordered" />
          </div>
    
          <div class="form-control">
            <label class="label">Nivel</label>
            <select formControlName="level" class="select select-bordered">
              <option value="Básico">Básico</option>
              <option value="Intermedio">Intermedio</option>
              <option value="Avanzado">Avanzado</option>
              <option value="Todos los niveles">Todos los niveles</option>
            </select>
          </div>
        </div>
    
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="form-control">
            <label class="label">Duración</label>
            <input type="text" formControlName="duration" class="input input-bordered" placeholder="Ej: 3 meses" />
          </div>
    
          <div class="form-control">
            <label class="label">Horario</label>
            <input type="text" formControlName="schedule" class="input input-bordered" placeholder="Ej: Lunes 18hs" />
          </div>
        </div>
    
        <!-- Media -->
        <div class="form-control">
          <label class="label">URL de Imagen</label>
          <input type="text" formControlName="image_url" class="input input-bordered" placeholder="https://..." />
          @if (form.get('image_url')?.value) {
            <div class="mt-2">
              <img [src]="form.get('image_url')?.value" class="h-32 rounded object-cover border" alt="Preview" />
            </div>
          }
        </div>
    
        <div class="form-control">
          <label class="label cursor-pointer justify-start gap-4">
            <span class="label-text font-bold">Curso Activo</span>
            <input type="checkbox" formControlName="is_active" class="toggle toggle-success" />
          </label>
        </div>
    
        <!-- Actions -->
        <div class="flex justify-end gap-4 pt-4 border-t">
          <a routerLink="/admin/courses" class="btn btn-ghost">Cancelar</a>
          <button type="submit" class="btn btn-primary" [disabled]="form.invalid || saving">
            @if (saving) {
              <span class="loading loading-spinner"></span>
            }
            {{ isEditing ? 'Actualizar' : 'Crear Curso' }}
          </button>
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
