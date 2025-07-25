import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-cursos',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './cursos.html',
  styleUrls: ['./cursos.css'],
})
export class Cursos {
  courses = [
    {
      title: 'Desarrollo Web',
      description: 'Aprendé a crear sitios modernos con HTML, CSS y JS.',
      price: 24999,
      image: 'assets/img/web-dev.jpg',
    },
    {
      title: 'Lógica y Matemática Discreta',
      description: 'Domina la lógica booleana, proposicional y teoría de conjuntos.',
      price: 19999,
      image: 'assets/img/logica.jpg',
    },
    {
      title: 'Angular + Tailwind',
      description: 'Construí apps modernas con Angular 20 y Tailwind CSS.',
      price: 29999,
      image: 'assets/img/angular-tailwind.jpg',
    },
  ];

  formatPrice(price: number): string {
    return `$${price.toLocaleString('es-AR')}`;
  }

  inscribirse(curso: string) {
    const mensaje = `Hola! Quiero inscribirme al curso de ${curso}.`;
    const whatsappURL = `https://wa.me/5491112345678?text=${encodeURIComponent(mensaje)}`;
    window.open(whatsappURL, '_blank');
  }
}
