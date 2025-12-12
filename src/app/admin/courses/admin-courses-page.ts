import { Component, inject, OnInit, signal, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CoursesService, Course } from '@app/core/services/courses.service';

@Component({
  selector: 'app-admin-courses-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold text-green-600">Administrar Cursos</h2>
      <a routerLink="/admin/courses/new" class="btn btn-primary">
        <i class="fas fa-plus mr-2"></i> Nuevo Curso
      </a>
    </div>
    
    <div class="overflow-x-auto bg-base-100 rounded-lg shadow text-base-content">
      <table class="table w-full">
        <thead>
          <tr class="text-base-content">
            <th>Imagen</th>
            <th>Título</th>
            <th>Precio</th>
            <th>Nivel</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          @for (course of courses(); track course.id) {
            <tr>
              <td>
                <div class="avatar">
                  <div class="mask mask-squircle w-12 h-12">
                    <img [src]="getImageSrc(course.image_url)" 
                         [alt]="course.title"
                         (error)="handleImageError($event)" />
                  </div>
                </div>
              </td>
              <td>
                <div class="font-bold">{{course.title}}</div>
                <div class="text-sm opacity-50">{{course.slug}}</div>
              </td>
              <td>
                {{course.price | currency}}
                <br/>
                @if (course.sale_price) {
                  <span class="text-xs text-green-600">
                    Oferta: {{course.sale_price | currency}}
                  </span>
                }
              </td>
              <td>{{course.level}}</td>
              <td>
                <div class="badge" [class.badge-success]="course.is_active" [class.badge-ghost]="!course.is_active">
                  {{course.is_active ? 'Activo' : 'Inactivo'}}
                </div>
              </td>
              <td>
                <div class="flex gap-2">
                  <a [routerLink]="['/admin/courses', course.id]" class="btn btn-sm btn-square btn-ghost text-blue-600">
                    <i class="fas fa-edit"></i>
                  </a>
                  <button (click)="deleteCourse(course)" class="btn btn-sm btn-square btn-ghost text-red-600">
                    <i class="fas fa-trash"></i>
                  </button>
                </div>
              </td>
            </tr>
          }
          @if (courses().length === 0 && !loading()) {
            <tr>
              <td colspan="6" class="text-center py-8 text-gray-500">
                No hay cursos registrados.
              </td>
            </tr>
          }
        </tbody>
      </table>
    </div>
    
    @if (loading()) {
      <div class="flex justify-center py-8">
        <span class="loading loading-spinner loading-lg"></span>
      </div>
    }
    `
})
export class AdminCoursesPage implements OnInit {
  private coursesService = inject(CoursesService);
  private cdr = inject(ChangeDetectorRef);
  
  courses = signal<Course[]>([]);
  loading = signal(true);

  ngOnInit() {
    this.loadCourses();
  }

  loadCourses() {
    this.loading.set(true);
    this.coursesService.getCourses().subscribe({
      next: (response) => {
        this.courses.set(response.data || []);
        this.loading.set(false);
        this.cdr.markForCheck();
      },
      error: (err) => {
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
      error: (err) => alert('Error al eliminar el curso: ' + err.message)
    });
  }

  handleImageError(event: any) {
    event.target.src = '/assets/img/cursos/1.jpg'; // Fallback to a valid image with absolute path
  }

  getImageSrc(url: string | null): string {
    if (!url) return 'assets/placeholder.png'; // Handled by || in template, but good practice
    if (url.startsWith('http') || url.startsWith('/')) {
      return url;
    }
    return '/' + url;
  }
}
