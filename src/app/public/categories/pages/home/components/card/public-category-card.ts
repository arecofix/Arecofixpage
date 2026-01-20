import { ChangeDetectionStrategy, Component, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { iCategory } from '@app/public/categories/interfaces/category.interface';

@Component({
  selector: 'public-category-card',
  imports: [RouterLink, CommonModule],
  templateUrl: './public-category-card.html',
  styles: `
    :host { display: block; height: 100%; }
    .line-clamp-2 {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PublicCategoryCard {
  category = input.required<iCategory>();

  // Icon mapping
  private iconMap: Record<string, string> = {
    'repuestos': 'fas fa-tools',
    'accesorios': 'fas fa-headphones',
    'celulares': 'fas fa-mobile-alt',
    'tablets': 'fas fa-tablet-alt',
    'computacion': 'fas fa-laptop', 
    'notebooks': 'fas fa-laptop',
    'monitores': 'fas fa-desktop',
    'gamer': 'fas fa-gamepad',
    'redes': 'fas fa-wifi',
    'impresion': 'fas fa-print',
    'audio': 'fas fa-music',
    'cables': 'fas fa-plug',
    'fundas': 'fas fa-shield-alt',
    'cargadores': 'fas fa-charging-station',
    'baterias': 'fas fa-battery-full',
    'modulos': 'fas fa-mobile',
    'ofertas': 'fas fa-tags',
    'nuevos': 'fas fa-star',
    'destacados': 'fas fa-fire',
    'default': 'fas fa-layer-group'
  };

  categoryIcon = computed(() => {
    const slug = this.category().slug.toLowerCase();
    const name = this.category().name.toLowerCase();
    
    // Check slug matches
    for (const key in this.iconMap) {
        if (slug.includes(key)) return this.iconMap[key];
    }
    
    // Check name matches
    for (const key in this.iconMap) {
        if (name.includes(key)) return this.iconMap[key];
    }

    return this.category().icon || this.iconMap['default'];
  });
}
