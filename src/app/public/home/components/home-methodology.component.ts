import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

export interface MethodologyStep {
  number: string;
  title: string;
  description: string;
  icon?: string;
}

export interface MethodologySection {
  title: string;
  description: string;
  steps: MethodologyStep[];
}

@Component({
  selector: 'app-home-methodology',
  standalone: true,
  imports: [CommonModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <section
      class="py-16 md:py-24 bg-gray-50 dark:bg-[#0a0a0a] text-gray-900 dark:text-white transition-colors duration-300"
    >
      <div class="container mx-auto px-4">
        <div class="flex flex-col lg:flex-row gap-10 lg:gap-16 items-start">
          <!-- Columna Izquierda: Estática en mobile para evitar que flote y tape los pasos al scrollear; Sticky solo en desktop -->
          <div class="w-full lg:w-1/3 static lg:sticky lg:top-24 z-10">
            <h2
              class="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6 font-heading text-gray-900 dark:text-white"
            >
              {{ methodology().title }}
            </h2>
            <p
              class="text-gray-700 dark:text-gray-400 text-base md:text-lg leading-relaxed mb-6 md:mb-8 font-body"
            >
              {{ methodology().description }}
            </p>
            <a
              routerLink="/contacto"
              class="w-full sm:w-auto text-center px-6 py-3.5 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-bold transition-colors inline-block shadow-md hover:shadow-lg"
            >
              Start a Project
            </a>
          </div>

          <!-- Columna Derecha: Tarjetas de pasos con flujo vertical natural en mobile -->
          <div class="w-full lg:w-2/3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4 md:gap-6">
            @for (
              step of methodology().steps;
              track step.number;
              let last = $last
            ) {
              <div
                class="flex flex-col lg:flex-row gap-4 md:gap-6 items-center lg:items-start p-5 md:p-8 rounded-2xl glass-panel hover:bg-white/10 transition-colors text-center lg:text-left h-full"
                [class.sm:col-span-2]="last"
                [class.lg:col-span-1]="last"
              >
                <div class="flex flex-col items-center gap-2 shrink-0">
                  <span
                    class="text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-linear-to-b from-blue-400 to-blue-600 font-mono"
                    >{{ step.number }}</span
                  >
                  <div class="hidden lg:block h-12 w-px bg-blue-500/30"></div>
                </div>
                <div>
                  <div
                    class="flex flex-col lg:flex-row items-center gap-3 mb-2 justify-center lg:justify-start"
                  >
                    <i
                      [class]="
                        step.icon +
                        ' text-blue-400 text-xl lg:hidden'
                      "
                    ></i>
                    <h3
                      class="text-lg md:text-xl font-bold font-heading text-gray-900 dark:text-white leading-tight"
                    >
                      {{ step.title }}
                    </h3>
                  </div>
                  <p
                    class="text-gray-700 dark:text-gray-400 font-body text-sm md:text-base leading-relaxed"
                  >
                    {{ step.description }}
                  </p>
                </div>
              </div>
            }
          </div>
        </div>
      </div>
    </section>
  `,
})
export class HomeMethodologyComponent {
  methodology = input.required<MethodologySection>();
}
