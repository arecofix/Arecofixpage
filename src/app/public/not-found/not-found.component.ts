import {
  Component,
  OnInit,
  inject,
  PLATFORM_ID,
  signal,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './not-found.component.html',
})
export class NotFoundComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly platformId = inject(PLATFORM_ID);

  searchQuery = signal('');
  readonly currentYear = new Date().getFullYear();

  readonly quickLinks = [
    { label: 'Inicio', path: '/', icon: 'fa-house' },
    { label: 'Servicios', path: '/servicios', icon: 'fa-wrench' },
    { label: 'Productos', path: '/productos', icon: 'fa-box-open' },
    { label: 'Contacto', path: '/contacto', icon: 'fa-envelope' },
    { label: 'Academy', path: '/academy', icon: 'fa-graduation-cap' },
  ];

  ngOnInit(): void {
    this.title.setTitle('Página no encontrada | Arecofix');
    this.meta.updateTag({
      name: 'description',
      content:
        'La página que buscás no existe o fue movida. Explorá nuestros servicios, productos o volvé al inicio de Arecofix.',
    });
    this.meta.updateTag({ name: 'robots', content: 'noindex, follow' });
  }

  onSearch(): void {
    const query = this.searchQuery().trim();
    if (query) {
      this.router.navigate(['/productos'], { queryParams: { q: query } });
    }
  }

  goBack(): void {
    if (isPlatformBrowser(this.platformId)) {
      if (window.history.length > 1) {
        window.history.back();
      } else {
        this.router.navigate(['/']);
      }
    }
  }
}
