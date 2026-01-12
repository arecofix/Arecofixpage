import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-certificate-gallery',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="py-12 bg-white dark:bg-white/5 backdrop-blur-sm rounded-xl">
      <div class="container mx-auto px-4">
        <div class="text-center mb-10">
          <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">{{ title }}</h2>
          <div class="w-24 h-1 bg-blue-600 mx-auto rounded-full"></div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div *ngFor="let image of images" class="group relative aspect-4/3 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300">
            <img [src]="image.src" 
                 [alt]="'Certificate ' + image.id" 
                 class="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500">
            <div class="absolute inset-0 bg-linear-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
              <span class="text-white font-medium px-4 py-2 bg-white/20 backdrop-blur-md rounded-lg">Ver Certificado</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: []
})
export class CertificateGalleryComponent {
  @Input() title: string = 'Nuestros Certificados';

  images = [
    { id: 1, src: 'assets/img/cursos/certiicate/1.jpg' },
    { id: 2, src: 'assets/img/cursos/certiicate/2.jpg' },
    { id: 3, src: 'assets/img/cursos/certiicate/3.jpg' },
    { id: 4, src: 'assets/img/cursos/certiicate/4.jpg' }
  ];
}
