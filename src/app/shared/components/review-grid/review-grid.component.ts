import { Component, Input } from '@angular/core';


export interface ReviewItem {
  image: string;
  name: string;
  rating: number;
  text: string;
  date: string;
}

@Component({
  selector: 'app-review-grid',
  standalone: true,
  imports: [],
  templateUrl: './review-grid.component.html'
})
export class ReviewGridComponent {
  @Input() title: string = '';
  @Input() cta: string = '';
  @Input() items: ReviewItem[] = [];
}
