import { Routes } from '@angular/router';
import { PublicLayout } from '@app/public/layout/public-layout';
import { PublicHomePage } from './home/public-home-page';

export const publicRoutes: Routes = [
  {
    title: 'Inicio - IT Consultoria y Soluciones - Arecofix',
    path: '',
    component: PublicLayout,
    children: [
      {
        title: 'Inicio - IT Consultoria y Soluciones - Arecofix',
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
      {
        title: 'Login',
        path: 'login',
        loadComponent: () =>
          import('@app/public/auth/login/login.component').then(
            (m) => m.LoginComponent
          ),
      },
      {
        title: 'Register',
        path: 'register',
        loadComponent: () =>
          import('@app/public/auth/register/register.component').then(
            (m) => m.RegisterComponent
          ),
      },
      {
        title: 'Perfil',
        path: 'perfil',
        loadComponent: () =>
          import('@app/public/profile/profile.component').then(
            (m) => m.ProfileComponent
          ),
      },
      {
        title: 'GSM',
        path: 'gsm',
        loadChildren: () => import('@app/public/gsm/gsm.routes').then(m => m.gsmRoutes),
      },
      {
        title: 'Portfolio',
        path: 'portfolio',
        loadComponent: () =>
          import('@app/public/portfolio/portfolio').then(
            (m) => m.PortfolioComponent
          ),
      },
      {
        title: 'Nosotros',
        path: 'nosotros',
        loadComponent: () =>
          import('@app/public/nosotros/nosotros').then(
            (m) => m.NosotrosComponent
          ),
      },
      {
        title: 'Contacto',
        path: 'contacto',
        loadComponent: () =>
          import('@app/public/contacto/contacto').then(
            (m) => m.ContactoComponent
          ),
      },
      {
        title: 'Servicios',
        path: 'servicios',
        loadComponent: () =>
          import('@app/public/servicios/servicios').then(
            (m) => m.ServiciosComponent
          ),
      },
      {
        title: 'Cursos',
        path: 'cursos',
        loadComponent: () =>
          import('@app/public/cursos/cursos').then(
            (m) => m.CursosComponent
          ),
      },
      // Repuestos ahora se sirve a través de products/category/repuestos
      {
        title: 'Checkout',
        path: 'checkout',
        loadComponent: () =>
          import('@app/public/checkout/checkout-page').then(
            (m) => m.CheckoutPage
          ),
      },
    ],
  },
];

export default publicRoutes;
