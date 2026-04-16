import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home-industries',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="py-24 bg-gray-50 dark:bg-[#050505] transition-colors duration-300">
      <div class="container mx-auto px-4">
        <div class="text-center mb-16">
          <h2 class="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white font-heading">{{ industries().title }}</h2>
          <p class="text-gray-700 dark:text-gray-400">{{ industries().subtitle }}</p>
        </div>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          @for(industry of industries().items; track industry.title) {
            <div class="aspect-square rounded-2xl glass-card flex flex-col items-center justify-center p-6 text-center group cursor-default hover:border-green-500/30">
              <i [class]="industry.icon + ' text-4xl mb-4 text-gray-500 group-hover:text-green-500 dark:group-hover:text-green-400 transition-colors duration-300'"></i>
              <h3 class="font-bold text-gray-900 dark:text-white mb-2">{{ industry.title }}</h3>
              <p class="text-xs text-gray-700 dark:text-gray-400 hidden lg:block">{{ industry.description }}</p>
            </div>
          }
        </div>
      </div>
    </section>
  `
})
export class HomeIndustriesComponent {
  industries = input.required<any>();
}
