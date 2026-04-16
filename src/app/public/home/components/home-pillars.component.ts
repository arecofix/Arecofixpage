import { Component, input } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home-pillars',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage, RouterLink],
  template: `
    <section class="py-20 bg-white dark:bg-black text-gray-900 dark:text-white relative z-20 transition-colors duration-300">
      <div class="container mx-auto px-4 -mt-20 lg:-mt-32">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <h2 class="sr-only">Nuestros Pilares de Negocio</h2>
          @for(pillar of businessPillars().items; track pillar.title) {
            <div class="group relative overflow-hidden rounded-2xl glass-card transition-all duration-300 hover:border-blue-500/50 flex flex-col h-full">
              <div class="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <i [class]="pillar.icon + ' text-9xl'"></i>
              </div>
              @if (pillar.image) {
                <div class="relative h-48 overflow-hidden">
                  <img [ngSrc]="pillar.image" [alt]="pillar.title" class="object-cover transform group-hover:scale-110 transition-transform duration-700" fill sizes="(max-width: 768px) 100vw, 50vw">
                  <div class="absolute inset-0 bg-linear-to-t from-white dark:from-[#1a1a1a] to-transparent opacity-80"></div>
                </div>
              }
              <div class="relative z-10 p-8 pt-4 flex flex-col text-left grow">
                <div [class]="'w-14 h-14 rounded-xl flex items-center justify-center mb-6 ' + (pillar.colorClass === 'blue' ? 'bg-blue-500/20 text-blue-400' : 'bg-green-500/20 text-green-400')">
                  <i [class]="pillar.icon + ' text-2xl'"></i>
                </div>
                <h3 class="text-2xl font-bold mb-3 font-heading text-gray-900 dark:text-white">{{ pillar.title }}</h3>
                <p class="text-gray-700 dark:text-gray-400 mb-6 leading-relaxed grow font-body">{{ pillar.description }}</p>
                <a [routerLink]="pillar.link" class="inline-flex items-center gap-2 font-bold text-sm tracking-wide uppercase hover:text-blue-600 dark:hover:text-white transition-colors text-gray-700 dark:text-gray-300 mt-auto">
                  {{ pillar.cta }} <i class="fas fa-arrow-right"></i>
                </a>
              </div>
            </div>
          }
        </div>
      </div>
    </section>
  `
})
export class HomePillarsComponent {
  businessPillars = input.required<any>();
}
