import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AcademyStudentsStateService } from '@app/features/courses/application/services/academy-students-state.service';

@Component({
  selector: 'app-instructor-students-page',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="min-h-screen bg-slate-50 dark:bg-slate-900 py-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div class="mb-8 flex items-center justify-between">
          <div class="flex items-center gap-4">
            <a routerLink="/instructor" class="btn btn-circle btn-sm">
              <i class="fas fa-arrow-left"></i>
            </a>
            <h1 class="text-3xl font-black text-slate-900 dark:text-white">Base de Datos de Alumnos</h1>
          </div>
        </div>

        <div class="mb-6 alert alert-info">
          <i class="fas fa-info-circle"></i>
          <span>Esta lista muestra a todos los clientes registrados. Se considera que cada cliente es un alumno potencial para Academy. Cualquier cambio que hagas en Gestión de Clientes, se reflejará aquí automáticamente.</span>
        </div>

        @if (state.isLoading()) {
          <div class="flex justify-center py-20">
            <div class="loading loading-spinner loading-lg"></div>
          </div>
        } @else if (state.error()) {
          <div class="alert alert-error">{{ state.error() }}</div>
        } @else if (state.students().length === 0) {
          <div class="text-center py-20 text-slate-500">
            No hay alumnos registrados en el sistema todavía.
          </div>
        } @else {
          <div class="overflow-x-auto bg-white dark:bg-slate-800 rounded-box shadow">
            <table class="table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>DNI</th>
                  <th>Email</th>
                  <th>Teléfono</th>
                  <th>Cursos Inscritos</th>
                  <th>Certificados</th>
                </tr>
              </thead>
              <tbody>
                @for (student of state.students(); track student.user_id) {
                  <tr>
                    <td>
                      <div class="font-bold">{{ student.last_name || '' }}, {{ student.first_name || 'Sin Nombre' }}</div>
                    </td>
                    <td>
                      @if (student.dni) {
                        {{ student.dni }}
                      } @else {
                        <span class="badge badge-warning badge-sm">Falta DNI</span>
                      }
                    </td>
                    <td>{{ student.email || '-' }}</td>
                    <td>{{ student.phone || '-' }}</td>
                    <td>
                      <span class="badge badge-neutral">{{ student.enrolled_courses_count }}</span>
                    </td>
                    <td>
                      <span class="badge" [class.badge-primary]="student.certificates_count > 0">
                        {{ student.certificates_count }}
                      </span>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        }

      </div>
    </div>
  `
})
export class InstructorStudentsPage implements OnInit {
  public state = inject(AcademyStudentsStateService);

  ngOnInit() {
    this.state.loadStudents();
  }
}
