import { Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, ControlContainer, FormGroupDirective } from '@angular/forms';

@Component({
  selector: 'app-course-staff-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  viewProviders: [
    {
      provide: ControlContainer,
      useFactory: () => inject(FormGroupDirective)
    }
  ],
  template: `
<!-- Bloque 3: Staff & Social Proof (Métricas Semilla) -->
            <div
              class="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden"
            >
              <div
                class="bg-slate-50 dark:bg-slate-900/50 px-6 py-4 border-b border-gray-100 dark:border-slate-700"
              >
                <h3
                  class="font-bold text-gray-900 dark:text-white flex items-center gap-2"
                >
                  <i class="fas fa-star text-yellow-500"></i> Marketing,
                  Prestigio e Instructor
                </h3>
              </div>
              <div class="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Instructor Name -->
                <div class="form-control">
                  <label class="label">
                    <span
                      class="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest"
                      >Nombre del Instructor</span
                    >
                  </label>
                  <label
                    class="input bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 flex items-center gap-3 rounded-xl px-4 h-12 text-gray-900 dark:text-white"
                  >
                    <i
                      class="fas fa-chalkboard-teacher text-slate-400 dark:text-slate-500"
                    ></i>
                    <input
                      type="text"
                      formControlName="instructor_name"
                      class="grow bg-transparent placeholder:text-slate-400 dark:placeholder:text-slate-600 outline-none"
                      placeholder="Ej: Ezequiel"
                    />
                  </label>
                </div>
                <!-- Instructor Role -->
                <div class="form-control">
                  <label class="label">
                    <span
                      class="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest"
                      >Rol del Instructor</span
                    >
                  </label>
                  <label
                    class="input bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 flex items-center gap-3 rounded-xl px-4 h-12 text-gray-900 dark:text-white"
                  >
                    <i
                      class="fas fa-user-tag text-slate-400 dark:text-slate-500"
                    ></i>
                    <input
                      type="text"
                      formControlName="instructor_role"
                      class="grow bg-transparent placeholder:text-slate-400 dark:placeholder:text-slate-600 outline-none"
                      placeholder="Ej: Experto en Microelectrónica"
                    />
                  </label>
                </div>
                <!-- Instructor Assigment (author_id) -->
                <div class="form-control md:col-span-2">
                  <label class="label">
                    <span
                      class="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest"
                      >Asignar a Cuenta de Instructor</span
                    >
                  </label>
                  <label
                    class="input bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 flex items-center gap-3 rounded-xl px-4 h-12 text-gray-900 dark:text-white"
                  >
                    <i
                      class="fas fa-link text-slate-400 dark:text-slate-500"
                    ></i>
                    <select
                      formControlName="author_id"
                      name="author_id"
                      class="grow bg-transparent outline-none"
                    >
                      <option value="">-- Sin Instructor Asignado --</option>
                      @for (instructor of instructors; track instructor.id) {
                        <option [value]="instructor.id">
                          {{ instructor.first_name }}
                          {{ instructor.last_name }} ({{ instructor.email }})
                        </option>
                      }
                    </select>
                  </label>
                  <span class="text-[10px] text-slate-500 mt-1"
                    >Al vincular una cuenta, ese instructor podrá ver y editar
                    su curso desde su panel.</span
                  >
                </div>
                <!-- Instructor Avatar -->
                <div class="form-control">
                  <label class="label">
                    <span
                      class="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest"
                      >Foto del Instructor (URL)</span
                    >
                  </label>
                  <label
                    class="input bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 flex items-center gap-3 rounded-xl px-4 h-12 text-gray-900 dark:text-white"
                  >
                    <i
                      class="fas fa-image text-slate-400 dark:text-slate-500"
                    ></i>
                    <input
                      type="text"
                      formControlName="instructor_avatar"
                      class="grow bg-transparent placeholder:text-slate-400 dark:placeholder:text-slate-600 outline-none"
                      placeholder="Ej: assets/img/profe.jpg"
                    />
                  </label>
                </div>
                <!-- Reviews Count -->
                <div class="form-control">
                  <label class="label">
                    <span
                      class="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest"
                      >Cantidad de Opiniones</span
                    >
                  </label>
                  <label
                    class="input bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 flex items-center gap-3 rounded-xl px-4 h-12 text-gray-900 dark:text-white"
                  >
                    <i
                      class="fas fa-comments text-slate-400 dark:text-slate-500"
                    ></i>
                    <input
                      type="number"
                      formControlName="reviews_count"
                      class="grow bg-transparent placeholder:text-slate-400 dark:placeholder:text-slate-600 outline-none"
                      placeholder="Ej: 371"
                    />
                  </label>
                </div>
                <!-- Instructor Bio -->
                <div class="form-control md:col-span-2">
                  <label class="label">
                    <span
                      class="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest"
                      >Biografía del Instructor</span
                    >
                  </label>
                  <textarea
                    formControlName="instructor_bio"
                    class="textarea textarea-bordered bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-700 text-gray-900 dark:text-white rounded-xl h-24 resize-none"
                    placeholder="Profesional destacado con más de 10 años de experiencia..."
                  ></textarea>
                </div>
                <!-- Audiencia / Beneficios -->
                <div class="form-control md:col-span-2">
                  <label class="label">
                    <span
                      class="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest"
                      >Este curso es para ti si: (Uno por línea)</span
                    >
                  </label>
                  <textarea
                    formControlName="audience_list"
                    class="textarea textarea-bordered bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-700 text-gray-900 dark:text-white rounded-xl h-28 resize-none"
                    placeholder="Querés aprender desde cero...&#10;Buscás alta rentabilidad..."
                  ></textarea>
                  <span class="text-[10px] text-slate-500 mt-1"
                    >Escribe cada punto en una nueva línea.</span
                  >
                </div>

                <div
                  class="col-span-1 md:col-span-2 border-t border-slate-100 dark:border-slate-700 my-2"
                ></div>

                <!-- Alumnos Ficticios -->
                <div class="form-control">
                  <label class="label">
                    <span
                      class="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest"
                      >Alumnos (Semilla)</span
                    >
                  </label>
                  <label
                    class="input bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 flex items-center gap-3 rounded-xl px-4 h-12 text-gray-900 dark:text-white"
                  >
                    <i
                      class="fas fa-users text-slate-400 dark:text-slate-500"
                    ></i>
                    <input
                      type="number"
                      formControlName="students"
                      class="grow bg-transparent placeholder:text-slate-400 dark:placeholder:text-slate-600 outline-none"
                      placeholder="Ej: 120"
                    />
                  </label>
                </div>
                <!-- Calificación -->
                <div class="form-control">
                  <label class="label">
                    <span
                      class="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest"
                      >Rating (0 - 5.0)</span
                    >
                  </label>
                  <label
                    class="input bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 flex items-center gap-3 rounded-xl px-4 h-12 text-gray-900 dark:text-white"
                  >
                    <i class="fas fa-star text-yellow-500"></i>
                    <input
                      type="number"
                      step="0.1"
                      max="5.0"
                      formControlName="rating"
                      class="grow bg-transparent placeholder:text-slate-400 dark:placeholder:text-slate-600 outline-none"
                      placeholder="Ej: 4.9"
                    />
                  </label>
                </div>
              </div>
            </div>

            `
  
})
export class CourseStaffFormComponent {
  formGroupDirective = inject(FormGroupDirective);
  @Input() instructors: any[] = [];
}
