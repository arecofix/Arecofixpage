import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  linkedSignal,
} from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'pagination',
  imports: [RouterLink],
  templateUrl: './pagination.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Pagination {
  pages = input<number>(0);
  currentPage = input<number>(1);

  activePage = linkedSignal(this.currentPage);

  getPagesList = computed(()=>{
    return Array.from({length:this.pages()}, (_, i) => i + 1)
  });
}
