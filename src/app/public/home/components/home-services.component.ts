import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home-services',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="py-24 bg-gray-50 dark:bg-[#050505] transition-colors duration-300">
      <div class="container mx-auto px-4">
        <div class="text-center max-w-3xl mx-auto mb-20">
          <h2 class="text-3xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6 font-heading">{{ services().title }}</h2>
          <p class="text-gray-700 dark:text-gray-400 text-lg font-body">{{ services().subtitle }}</p>
        </div>
        <div class="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
          @for(service of services().items; track service.title; let last = $last) {
            <div class="glass-card rounded-xl p-4 md:p-8 hover:bg-[#151515] transition-all group h-full flex flex-col items-center text-center"
              [class.col-span-2]="last" [class.lg:col-span-1]="last">
              <div class="mb-3 md:mb-6 w-10 h-10 md:w-12 md:h-12 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
                <i [class]="service.icon + ' text-lg md:text-xl'"></i>
              </div>
              <h3 class="text-sm md:text-xl font-bold text-gray-900 dark:text-white mb-2 md:mb-3 font-heading leading-tight">{{ service.title }}</h3>
              <p class="text-gray-700 dark:text-gray-400 leading-relaxed text-xs md:text-sm font-body grow">{{ service.description }}</p>
            </div>
          }
        </div>
      </div>
    </section>
  `
})
export class HomeServicesComponent {
  services = input.required<any>();
}
