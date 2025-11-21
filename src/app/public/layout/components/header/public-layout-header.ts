import { Component, ChangeDetectionStrategy, inject, ChangeDetectorRef } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { environment } from '@env/environment';
import { CategoryService } from '@app/public/categories/services/category.service';
import { iCategoriesResponse, iCategory } from '@app/public/categories/interfaces';
import { rxResource } from '@angular/core/rxjs-interop';
import { AuthService } from '@app/services/auth.service';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

interface iMenuItem {
  title: string;
  path: string;
  icon: string;
}

@Component({
  selector: 'public-layout-header',
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './public-layout-header.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PublicLayoutHeader {
  public appName: string = environment.appName;
  public categoryService = inject(CategoryService);
  public authService = inject(AuthService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  public user$ = this.authService.authState$.pipe(map(state => state.user));

  public categoryRs = rxResource<iCategoriesResponse, unknown>({
    stream: () => this.categoryService.getFeaturedData(),
  });

  public menuItems = () => {
    return (
      this.categoryRs.value()?.data
        .filter((category: iCategory) => category.slug !== 'sports' && category.name !== 'Deportes')
        .map((category: iCategory) => ({
          title: category.name,
          path: '/products/category/' + category.slug,
          icon: category.icon,
        }))
      ?? []
    );
  };

  async logout() {
    try {
      await this.authService.signOut();
      this.cdr.markForCheck();
      this.router.navigate(['/login']);
    } catch (err) {
      console.error('Error during logout:', err);
    }
  }
}
