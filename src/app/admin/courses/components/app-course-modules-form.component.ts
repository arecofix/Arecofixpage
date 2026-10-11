import { Component, inject, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, ControlContainer, FormGroupDirective, FormArray } from '@angular/forms';

@Component({
  selector: 'app-course-modules-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  viewProviders: [
    {
      provide: ControlContainer,
      useFactory: () => inject(FormGroupDirective)
    }
  ],
  template: `
<!-- Bloque 4: Gestor de Módulos (Temario) -->
            <div
              class="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden"
            >
              <div
                class="bg-slate-50 dark:bg-slate-900/50 px-6 py-4 border-b border-gray-100 dark:border-slate-700 flex justify-between items-center h-[72px]"
              >
                <h3
                  class="font-bold text-gray-900 dark:text-white flex items-center gap-2"
                >
                  <i class="fas fa-list-ol text-orange-500"></i> Gestor de
                  Módulos (Temario)
                </h3>
                <button
                  type="button"
                  class="btn btn-sm btn-ghost hover:bg-orange-50 dark:hover:bg-orange-900/20 text-orange-600 dark:text-orange-500 rounded-xl"
                  (click)="addModule.emit()"
                >
                  <i class="fas fa-plus"></i>
                  <span class="hidden sm:inline">Agregar Módulo</span>
                </button>
              </div>
              <div class="p-6 space-y-4" formArrayName="modules">
                @if (modulesFormArray.length === 0) {
                  <div
                    class="text-center py-10 text-slate-500 bg-slate-50 dark:bg-slate-900/50 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700"
                  >
                    <i class="fas fa-sitemap text-4xl mb-3 opacity-30"></i>
                    <p class="text-sm">
                      Aún no agregaste ningún módulo al temario del curso.
                    </p>
                    <button
                      type="button"
                      class="btn btn-sm btn-outline mt-4 rounded-xl"
                      (click)="addModule.emit()"
                    >
                      Crear el Primer Módulo
                    </button>
                  </div>
                }
                @for (mod of modulesFormArray.controls; track $index) {
                  <div
                    [formGroupName]="$index"
                    class="bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl p-4 flex gap-4 items-start relative group transition-all hover:shadow-md hover:border-blue-400 dark:hover:border-blue-500"
                  >
                    <div
                      class="flex-none pt-3 text-slate-400 font-bold text-lg w-8 text-center"
                      title="Orden"
                    >
                      {{ $index + 1 }}
                    </div>

                    <div class="grow space-y-4">
                      <div class="form-control">
                        <input
                          type="text"
                          formControlName="title"
                          class="input bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:border-blue-500 w-full font-bold text-gray-900 dark:text-white h-11 rounded-lg"
                          placeholder="Título (ej: Módulo 1: Fundamentos de Microelectrónica...)"
                        />
                      </div>
                      <div class="form-control">
                        <textarea
                          formControlName="description"
                          class="textarea bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:border-blue-500 w-full text-gray-900 dark:text-white resize-none h-20 rounded-lg text-sm"
                          placeholder="Breve descripción de los temas a cubrir (Opcional)..."
                        ></textarea>
                      </div>
                    </div>

                    <div class="flex-none pt-1">
                      <button
                        type="button"
                        class="btn btn-square btn-sm btn-ghost text-red-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                        (click)="removeModule.emit($index)"
                        title="Eliminar Módulo"
                      >
                        <i class="fas fa-trash"></i>
                      </button>
                    </div>
                  </div>
                }
              </div>
            
  `
})
export class CourseModulesFormComponent {
  formGroupDirective = inject(FormGroupDirective);
  @Input() modulesFormArray!: FormArray;
  @Output() addModule = new EventEmitter<void>();
  @Output() removeModule = new EventEmitter<number>();
}
