import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface ArticleItem {
  image: string;
  category: string;
  title: string;
  description: string;
  link: string;
  color: string;
  cta?: string;
}

@Component({
  selector: 'app-article-grid',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './article-grid.component.html',
})
export class ArticleGridComponent {
  @Input() title: string = '';
  @Input() description: string = '';
  @Input() cta: string = '';
  @Input() items: ArticleItem[] = [];
}
