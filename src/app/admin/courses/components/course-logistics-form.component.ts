import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, ControlContainer, FormGroupDirective } from '@angular/forms';

@Component({
  selector: 'app-course-logistics-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  viewProviders: [
    {
      provide: ControlContainer,
      useFactory: () => inject(FormGroupDirective)
    }
  ],
  template: `
<!-- Bloque 2: Logística y Tiempos -->
            <div
              class="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden"
            >
              <div
                class="bg-slate-50 dark:bg-slate-900/50 px-6 py-4 border-b border-gray-100 dark:border-slate-700"
              >
                <h3
                  class="font-bold text-gray-900 dark:text-white flex items-center gap-2"
                >
                  <i class="fas fa-calendar-alt text-purple-500"></i> Cursada y
                  Logística
                </h3>
              </div>
              <div class="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Duración -->
                <div class="form-control">
                  <label class="label">
                    <span
                      class="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest"
                      >Duración Total</span
                    >
                  </label>
                  <label
                    class="input bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 flex items-center gap-3 rounded-xl px-4 h-12 text-gray-900 dark:text-white"
                  >
                    <i
                      class="fas fa-hourglass-half text-slate-400 dark:text-slate-500"
                    ></i>
                    <input
                      type="text"
                      formControlName="duration"
                      class="grow bg-transparent placeholder:text-slate-400 dark:placeholder:text-slate-600 outline-none"
                      placeholder="Ej: 3 meses"
                    />
                  </label>
                  @if (
                    formGroupDirective.control.get('duration')?.invalid &&
                    formGroupDirective.control.get('duration')?.touched
                  ) {
                    <span
                      class="text-red-500 text-xs font-medium mt-1.5 flex items-center gap-1"
                      ><i class="fas fa-exclamation-circle"></i> La duración es
                      obligatoria</span
                    >
                  }
                </div>
                <!-- Horarios -->
                <div class="form-control">
                  <label class="label">
                    <span
                      class="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest"
                      >Días y Horarios</span
                    >
                  </label>
                  <label
                    class="input bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 flex items-center gap-3 rounded-xl px-4 h-12 text-gray-900 dark:text-white"
                  >
                    <i
                      class="fas fa-clock text-slate-400 dark:text-slate-500"
                    ></i>
                    <input
                      type="text"
                      formControlName="schedule"
                      class="grow bg-transparent placeholder:text-slate-400 dark:placeholder:text-slate-600 outline-none"
                      placeholder="Ej: Lunes y Miércoles 18hs a 21hs"
                    />
                  </label>
                  @if (
                    formGroupDirective.control.get('schedule')?.invalid &&
                    formGroupDirective.control.get('schedule')?.touched
                  ) {
                    <span
                      class="text-red-500 text-xs font-medium mt-1.5 flex items-center gap-1"
                      ><i class="fas fa-exclamation-circle"></i> Los horarios
                      son obligatorios</span
                    >
                  }
                </div>
                <!-- Horas por Semana -->
                <div class="form-control">
                  <label class="label">
                    <span
                      class="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest"
                      >Horas por Semana</span
                    >
                  </label>
                  <label
                    class="input bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 flex items-center gap-3 rounded-xl px-4 h-12 text-gray-900 dark:text-white"
                  >
                    <i
                      class="fas fa-business-time text-slate-400 dark:text-slate-500"
                    ></i>
                    <input
                      type="text"
                      formControlName="hours_per_week"
                      class="grow bg-transparent placeholder:text-slate-400 dark:placeholder:text-slate-600 outline-none"
                      placeholder="Ej: 6 horas semanales"
                    />
                  </label>
                </div>
                <!-- Cantidad de Clases -->
                <div class="form-control">
                  <label class="label">
                    <span
                      class="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest"
                      >Cantidad de Clases</span
                    >
                  </label>
                  <label
                    class="input bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 flex items-center gap-3 rounded-xl px-4 h-12 text-gray-900 dark:text-white"
                  >
                    <i
                      class="fas fa-chalkboard text-slate-400 dark:text-slate-500"
                    ></i>
                    <input
                      type="number"
                      formControlName="classes_count"
                      class="grow bg-transparent placeholder:text-slate-400 dark:placeholder:text-slate-600 outline-none"
                      placeholder="Ej: 24"
                    />
                  </label>
                </div>
                <!-- Horas Contenido -->
                <div class="form-control">
                  <label class="label">
                    <span
                      class="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest"
                      >Horas de Contenido</span
                    >
                  </label>
                  <label
                    class="input bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 flex items-center gap-3 rounded-xl px-4 h-12 text-gray-900 dark:text-white"
                  >
                    <i
                      class="fas fa-video text-slate-400 dark:text-slate-500"
                    ></i>
                    <input
                      type="number"
                      formControlName="hours_content"
                      class="grow bg-transparent placeholder:text-slate-400 dark:placeholder:text-slate-600 outline-none"
                      placeholder="Ej: 12"
                    />
                  </label>
                </div>
                <!-- Horas Práctica -->
                <div class="form-control">
                  <label class="label">
                    <span
                      class="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest"
                      >Horas de Práctica</span
                    >
                  </label>
                  <label
                    class="input bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 flex items-center gap-3 rounded-xl px-4 h-12 text-gray-900 dark:text-white"
                  >
                    <i
                      class="fas fa-tools text-slate-400 dark:text-slate-500"
                    ></i>
                    <input
                      type="number"
                      formControlName="hours_practice"
                      class="grow bg-transparent placeholder:text-slate-400 dark:placeholder:text-slate-600 outline-none"
                      placeholder="Ej: 36"
                    />
                  </label>
                </div>

                <!-- Estrategia de Desbloqueo -->
                <div class="form-control md:col-span-2">
                  <label class="label">
                    <span
                      class="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest"
                      >Estrategia de Desbloqueo de Contenido</span
                    >
                  </label>
                  <select
                    formControlName="unlock_strategy"
                    class="select bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl h-12 text-gray-900 dark:text-white"
                  >
                    <option value="ALL_AT_ONCE">Desbloqueo Total Inmediato (ALL_AT_ONCE)</option>
                    <option value="SEQUENTIAL">Secuencial por Progreso (SEQUENTIAL - requiere completar unidad previa)</option>
                  </select>
                  <span class="text-xs text-slate-400 mt-1">
                    En modo secuencial, los alumnos no podrán visualizar el módulo N+1 hasta completar los recursos del módulo N.
                  </span>
                </div>
              </div>
            </div>

            `
  
})
export class CourseLogisticsFormComponent {
  formGroupDirective = inject(FormGroupDirective);
}
