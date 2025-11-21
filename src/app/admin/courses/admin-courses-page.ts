import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CoursesService, Course } from '@app/services/courses.service';

@Component({
    selector: 'app-admin-courses-page',
    standalone: true,
    imports: [CommonModule, RouterLink],
    template: `
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold text-gray-800">Administrar Cursos</h2>
      <a routerLink="/admin/courses/new" class="btn btn-primary">
        <i class="fas fa-plus mr-2"></i> Nuevo Curso
      </a>
    </div>
    
    <div class="overflow-x-auto bg-white rounded-lg shadow">
      <table class="table w-full">
        <thead>
          <tr>
            <th>Imagen</th>
            <th>Título</th>
            <th>Precio</th>
            <th>Nivel</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          @for (course of courses; track course.id) {
            <tr>
              <td>
                <div class="avatar">
                  <div class="mask mask-squircle w-12 h-12">
                    <img [src]="course.image_url" [alt]="course.title" />
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
          @if (courses.length === 0 && !loading) {
            <tr>
              <td colspan="6" class="text-center py-8 text-gray-500">
                No hay cursos registrados.
              </td>
            </tr>
          }
        </tbody>
      </table>
    </div>
    
    @if (loading) {
      <div class="flex justify-center py-8">
        <span class="loading loading-spinner loading-lg"></span>
      </div>
    }
    `
})
export class AdminCoursesPage implements OnInit {
    private coursesService = inject(CoursesService);
    courses: Course[] = [];
    loading = true;

    ngOnInit() {
        this.loadCourses();
    }

    loadCourses() {
        this.loading = true;
        this.coursesService.getCourses().subscribe({
            next: (data) => {
                this.courses = data || [];
                this.loading = false;
            },
            error: (err) => {
                console.error('Error loading courses', err);
                this.loading = false;
            }
        });
    }

    async deleteCourse(course: Course) {
        if (!confirm(`¿Estás seguro de eliminar el curso "${course.title}"?`)) return;

        this.coursesService.deleteCourse(course.id).subscribe({
            next: () => {
                this.courses = this.courses.filter(c => c.id !== course.id);
            },
            error: (err) => alert('Error al eliminar el curso: ' + err.message)
        });
    }
}
