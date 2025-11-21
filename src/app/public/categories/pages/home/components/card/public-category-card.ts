import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { iCategory } from '@app/public/categories/interfaces/category.interface';

@Component({
  selector: 'public-category-card',
  imports: [RouterLink],
  templateUrl: './public-category-card.html',
  styles: `
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
}
