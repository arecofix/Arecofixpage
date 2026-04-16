import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home-tech-stack',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="py-20 bg-white dark:bg-black border-y border-gray-200 dark:border-white/5 transition-colors duration-300">
      <div class="container mx-auto px-4 text-center">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold text-gray-900 dark:text-white font-heading">{{ techServices().title }}</h2>
          <p class="text-gray-700 dark:text-gray-400 mt-2">{{ techServices().subtitle }}</p>
        </div>
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
          @for(item of techServices().items; track item.title) {
            <div class="glass-panel p-3 md:p-6 rounded-xl flex flex-col items-center justify-center text-center hover:bg-white/5 transition-colors h-full">
              <i [class]="item.icon + ' text-2xl md:text-4xl mb-2 md:mb-3 text-gradient block mx-auto'"></i>
              <h3 class="text-sm md:text-lg font-bold text-gray-900 dark:text-white mb-1 md:mb-2 leading-tight">{{ item.title }}</h3>
              <p class="text-xs md:text-sm text-gray-700 dark:text-gray-400 mb-3 md:mb-4 leading-relaxed">{{ item.description }}</p>
              <div class="flex flex-wrap justify-center gap-1 md:gap-2 mt-auto">
                @for(feat of item.features; track $index) {
                  <span class="text-[10px] md:text-xs bg-gray-200 dark:bg-white/10 px-1.5 py-0.5 md:px-2 md:py-1 rounded text-gray-700 dark:text-gray-300 font-mono">{{ feat }}</span>
                }
              </div>
            </div>
          }
        </div>
      </div>
    </section>
  `
})
export class HomeTechStackComponent {
  techServices = input.required<any>();
}
