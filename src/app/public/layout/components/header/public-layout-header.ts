import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { RouterLink, RouterLinkActive } from '@angular/router';
/*  */
import { iMenuItem } from '@app/shared/interfaces';
import { CategoryService } from '@app/public/categories/services';
import { environment } from '@env/environment';
import { iCategoriesResponse } from '@app/public/categories/interfaces';

@Component({
  selector: 'public-layout-header',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './public-layout-header.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PublicLayoutHeader {
  public appName: string = environment.appName;
  public categoryService = inject(CategoryService);
  public categoryRs = rxResource<iCategoriesResponse, unknown>({
    stream: () => this.categoryService.getFeaturedData(),
  });

  /*  */

  public menuItems = computed<iMenuItem[]>(() => {
  return (
    this.categoryRs.value()?.data
      .filter((category) => category.slug !== 'sports' && category.name !== 'Deportes') // 👈 EXCLUYE
      .map((category) => ({
        title: category.name,
        path: '/products/category/' + category.slug,
        icon: category.icon,
      }))
    ?? []
  );
});
}

