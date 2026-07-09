import { Component, Input, signal } from '@angular/core';


@Component({
  selector: 'app-certificate-gallery',
  standalone: true,
  imports: [],
  template: `
    <section class="py-12 bg-white dark:bg-white/5 backdrop-blur-sm rounded-xl">
      <div class="container mx-auto px-4">
        <div class="text-center mb-10">
          <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">{{ title }}</h2>
          <div class="w-24 h-1 bg-blue-600 mx-auto rounded-full"></div>
        </div>
    
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
          @for (image of images; track image) {
            <div class="group relative aspect-4/3 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer"
                 (click)="openImage(image.src)">
              <img [src]="image.src"
                [alt]="'Certificate ' + image.id"
                class="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500">
                <div class="absolute inset-0 bg-linear-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                  <span class="text-white font-medium px-4 py-2 bg-white/20 backdrop-blur-md rounded-lg">Ver Certificado</span>
                </div>
              </div>
            }
          </div>
        </div>
      </section>

      <!-- Lightbox Modal -->
      @if (selectedImage()) {
        <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md transition-all duration-300"
             (click)="closeImage()">
          <!-- Close Button -->
          <button type="button" class="absolute top-6 right-6 text-white/80 hover:text-white text-3xl transition-colors p-2 z-60"
                  (click)="closeImage()">
            <i class="fa-solid fa-xmark"></i>
          </button>
          
          <!-- Image Container -->
          <div class="relative max-w-4xl max-h-[85vh] mx-4 overflow-hidden rounded-2xl border border-white/10 shadow-2xl flex items-center justify-center"
               (click)="$event.stopPropagation()">
            <img [src]="selectedImage()!" class="max-w-full max-h-[85vh] object-contain rounded-2xl" alt="Certificate enlarged">
          </div>
        </div>
      }
    `,
  styles: []
})
export class CertificateGalleryComponent {
  @Input() title: string = 'Nuestros Certificados';

  images = [
    { id: 1, src: 'assets/img/cursos/certiicate/1.jpg' },
    { id: 2, src: 'assets/img/cursos/certiicate/2.jpg' },
    { id: 3, src: 'assets/img/cursos/certiicate/3.jpg' },
    { id: 4, src: 'assets/img/cursos/certiicate/4.jpg' },
    { id: 5, src: 'assets/img/cursos/certiicate/python.jpg' }
  ];

  selectedImage = signal<string | null>(null);

  openImage(src: string) {
    this.selectedImage.set(src);
  }

  closeImage() {
    this.selectedImage.set(null);
  }
}
