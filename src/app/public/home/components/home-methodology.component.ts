import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home-methodology',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section class="py-24 bg-gray-50 dark:bg-[#0a0a0a] text-gray-900 dark:text-white transition-colors duration-300">
      <div class="container mx-auto px-4">
        <div class="flex flex-col lg:flex-row gap-16 items-start">
          <div class="lg:w-1/3 sticky top-24">
            <h2 class="text-4xl lg:text-5xl font-bold mb-6 font-heading text-gray-900 dark:text-white">{{ methodology().title }}</h2>
            <p class="text-gray-700 dark:text-gray-400 text-lg leading-relaxed mb-8 font-body">{{ methodology().description }}</p>
            <a routerLink="/contacto" class="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-bold transition-colors inline-block">
              Start a Project
            </a>
          </div>
          <div class="lg:w-2/3 grid grid-cols-2 lg:grid-cols-1 gap-3 md:gap-6">
            @for(step of methodology().steps; track step.number; let last = $last) {
              <div class="flex flex-col lg:flex-row gap-3 md:gap-6 items-center lg:items-start p-4 md:p-8 rounded-2xl glass-panel hover:bg-white/10 transition-colors text-center lg:text-left h-full"
                [class.col-span-2]="last" [class.lg:col-span-1]="last">
                <div class="flex flex-col items-center gap-2 shrink-0">
                  <span class="text-xl md:text-3xl font-black text-transparent bg-clip-text bg-linear-to-b from-blue-400 to-blue-600 font-mono">{{ step.number }}</span>
                  <div class="hidden lg:block h-12 w-px bg-blue-500/30"></div>
                </div>
                <div>
                  <div class="flex flex-col lg:flex-row items-center gap-3 mb-2 justify-center lg:justify-start">
                    <i [class]="step.icon + ' text-blue-400 text-lg md:text-xl lg:hidden'"></i>
                    <h3 class="text-sm md:text-xl font-bold font-heading text-gray-900 dark:text-white leading-tight">{{ step.title }}</h3>
                  </div>
                  <p class="text-gray-700 dark:text-gray-400 font-body text-xs md:text-base leading-relaxed line-clamp-4 lg:line-clamp-none">{{ step.description }}</p>
                </div>
              </div>
            }
          </div>
        </div>
      </div>
    </section>
  `
})
export class HomeMethodologyComponent {
  methodology = input.required<any>();
}
