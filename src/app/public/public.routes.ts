import { Routes } from '@angular/router';
import { PublicLayout } from '@app/public/layout/public-layout';
import { PublicHomePage } from './home/public-home-page';

export const publicRoutes: Routes = [
  {
    title: 'Home',
    path: '',
    component: PublicLayout,
    children: [
      {
        title: 'Home',
        path: '',
        component: PublicHomePage,
      },
      {
        title: 'Categories',
        path: 'categories',
        loadChildren: () => import('@app/public/categories/categories.routes'),
      },
      {
        title: 'Products',
        path: 'products',
        loadChildren: () => import('@app/public/products/products.routes'),
      },
    ],
  },
];

export default publicRoutes;
