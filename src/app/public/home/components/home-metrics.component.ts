import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home-metrics',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="py-16 bg-white dark:bg-black border-y border-gray-200 dark:border-white/5 text-center transition-colors duration-300">
      <div class="container mx-auto px-4">
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-8">
          @for(metric of metrics().items; track metric.label) {
            <div class="p-4">
              <h2 class="text-4xl lg:text-5xl font-extrabold text-gradient-blue mb-2 font-heading">
                {{ metric.value }}
              </h2>
              <p class="text-gray-700 dark:text-gray-400 font-mono text-xs uppercase tracking-widest">{{ metric.label }}</p>
            </div>
          }
        </div>
      </div>
    </section>
  `
})
export class HomeMetricsComponent {
  metrics = input.required<any>();
}
