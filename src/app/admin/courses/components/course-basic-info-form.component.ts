import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, ControlContainer, FormGroupDirective } from '@angular/forms';

@Component({
  selector: 'app-course-basic-info-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  viewProviders: [
    {
      provide: ControlContainer,
      useFactory: () => inject(FormGroupDirective)
    }
  ],
  template: `
    <div
      class="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden"
    >
      <div
        class="bg-slate-50 dark:bg-slate-900/50 px-6 py-4 border-b border-gray-100 dark:border-slate-700"
      >
        <h3
          class="font-bold text-gray-900 dark:text-white flex items-center gap-2"
        >
          <i class="fas fa-tag text-blue-500"></i> Identidad y Detalles
        </h3>
      </div>
      <div class="p-6 space-y-6">
        <!-- Título -->
        <div class="form-control">
          <label class="label">
            <span
              class="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest"
              >Título Comercial</span
            >
          </label>
          <label
            class="input bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500 transition-colors flex items-center gap-3 rounded-xl focus-within:ring-2 focus-within:ring-blue-500/20 px-4 h-12 text-gray-900 dark:text-white"
          >
            <i
              class="fas fa-heading text-slate-400 dark:text-slate-500"
            ></i>
            <input
              type="text"
              formControlName="title"
              class="grow bg-transparent placeholder:text-slate-400 dark:placeholder:text-slate-600 outline-none"
              placeholder="Ej: Especialización en Hardware Apple"
            />
          </label>
          @if (
            formGroupDirective.control.get('title')?.invalid && formGroupDirective.control.get('title')?.touched
          ) {
            <span
              class="text-red-500 text-xs font-medium mt-1.5 flex items-center gap-1"
              ><i class="fas fa-exclamation-circle"></i> El título es
              obligatorio</span
            >
          }
        </div>

        <!-- Slug & Nivel -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="form-control">
            <label class="label">
              <span
                class="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest"
                >URL (Slug)</span
              >
            </label>
            <label
              class="input bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500 transition-colors flex items-center gap-3 rounded-xl px-4 h-12 text-gray-900 dark:text-white"
            >
              <i
                class="fas fa-link text-slate-400 dark:text-slate-500"
              ></i>
              <input
                type="text"
                formControlName="slug"
                class="grow bg-transparent placeholder:text-slate-400 dark:placeholder:text-slate-600 outline-none"
                placeholder="ej: hardware-apple"
              />
            </label>
            @if (
              formGroupDirective.control.get('slug')?.invalid && formGroupDirective.control.get('slug')?.touched
            ) {
              <span
                class="text-red-500 text-xs font-medium mt-1.5 flex items-center gap-1"
                ><i class="fas fa-exclamation-circle"></i> El slug es
                obligatorio</span
              >
            }
          </div>
          <div class="form-control">
            <label class="label">
              <span
                class="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest"
                >Dificultad / Nivel</span
              >
            </label>
            <select
              formControlName="level"
              class="select select-bordered bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-700 text-gray-900 dark:text-white rounded-xl h-12"
            >
              <option value="basic">Básico (Inicial)</option>
              <option value="intermediate">
                Intermedio (Requiere experiencia)
              </option>
              <option value="advanced">Avanzado (Profesionales)</option>
              <option value="all">Apto para todo público</option>
            </select>
          </div>
        </div>

        <!-- Descripción -->
        <div class="form-control">
          <label class="label">
            <span
              class="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest"
              >Descripción / Propuesta de Valor</span
            >
          </label>
          <textarea
            formControlName="description"
            class="textarea textarea-bordered bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-700 text-gray-900 dark:text-white rounded-xl h-28 resize-none focus:ring-2 focus:ring-blue-500/20"
            placeholder="¿Qué va a lograr el alumno con este curso? Redactá un texto vendedor..."
          ></textarea>
          @if (
            formGroupDirective.control.get('description')?.invalid &&
            formGroupDirective.control.get('description')?.touched
          ) {
            <span
              class="text-red-500 text-xs font-medium mt-1.5 flex items-center gap-1"
              ><i class="fas fa-exclamation-circle"></i> La descripción
              es obligatoria</span
            >
          }
        </div>
      </div>
    </div>
  `
})
export class CourseBasicInfoFormComponent {
  formGroupDirective = inject(FormGroupDirective);
}
