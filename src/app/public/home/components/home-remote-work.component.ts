import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home-remote-work',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section class="py-24 relative overflow-hidden bg-linear-to-br from-blue-900 via-blue-950 to-black">
      <div class="absolute inset-0 bg-[url('assets/img/pattern-grid.svg')] opacity-10"></div>
      <div class="container mx-auto px-4 relative z-10 text-center text-white">
        <span class="inline-block py-1 px-3 rounded glass-panel text-blue-200 text-xs font-bold uppercase tracking-wider mb-6">Global Reach</span>
        <h2 class="text-4xl lg:text-5xl font-bold mb-6 max-w-3xl mx-auto font-heading">{{ remoteWork().title }}</h2>
        <p class="text-xl text-blue-100 mb-10 max-w-2xl mx-auto font-body">{{ remoteWork().description }}</p>
        <div class="flex flex-wrap justify-center gap-4 mb-10">
          @for(benefit of remoteWork().benefits; track $index) {
            <span class="flex items-center gap-2 bg-blue-800/30 backdrop-blur-sm px-4 py-2 rounded-full border border-blue-400/30 text-sm">
              <i class="fas fa-check text-green-300"></i> {{ benefit }}
            </span>
          }
        </div>
        <a routerLink="/contacto" class="inline-block bg-white text-blue-900 px-10 py-4 rounded-xl font-bold text-lg shadow-xl hover:bg-gray-100 transition-colors cursor-pointer">
          {{ remoteWork().cta }}
        </a>
      </div>
    </section>
  `
})
export class HomeRemoteWorkComponent {
  remoteWork = input.required<any>();
}
