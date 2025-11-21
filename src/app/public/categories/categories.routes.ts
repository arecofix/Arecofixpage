import { Routes } from '@angular/router';

export const categoriesRoutes: Routes = [
  {
    title: 'Categories',
    path: '',
    loadComponent: () =>
      import(
        '@app/public/categories/pages/home/public-categories-home-page'
      ).then((m) => m.PublicCategoriesHomePage),
  },
];

export default categoriesRoutes;
