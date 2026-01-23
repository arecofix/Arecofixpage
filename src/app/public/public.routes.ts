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
        title: 'Servicio Técnico de Celulares en Marcos Paz',
        path: 'celular',
        loadComponent: () => import('@app/public/landing/celular/celular-landing.component').then(m => m.CelularLandingComponent),
      },
      {
        title: 'Categories',

        path: 'categories',
        loadChildren: () => import('@app/public/categories/categories.routes'),
      },
      {
        title: 'Productos',
        path: 'productos',
        loadChildren: () => import('@app/public/products/products.routes'),
      },
      {
        title: 'Repuestos',
        path: 'repuestos',
        loadComponent: () => import('@app/public/repuestos/repuestos').then((m) => m.RepuestosComponent),
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
          import('./portfolio/portfolio').then(
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
        title: 'Detalle de Servicio',
        path: 'servicios/:slug',
        loadComponent: () =>
          import('@app/public/servicios/pages/detail/service-detail.component').then(
            (m) => m.ServiceDetailComponent
          ),
      },
      {
        title: 'Academy',
        path: 'academy',
        loadComponent: () =>
          import('@app/public/cursos/cursos').then(
            (m) => m.CursosComponent
          ),
      },
      {
        title: 'Detalle del Curso',
        path: 'academy/:slug',
        loadComponent: () =>
          import('@app/public/cursos/course-detail/course-detail.component').then(
            (m) => m.CourseDetailComponent
          ),
      },
      {
        title: 'Checkout',
        path: 'checkout',
        loadComponent: () =>
          import('@app/public/checkout/checkout-page').then(
            (m) => m.CheckoutPage
          ),
      },
      {
        path: 'posts/servicio-tecnico-de-celulares-en-marcos-paz',
        redirectTo: 'celular',
        pathMatch: 'full'
      },
      {
        title: 'Blog Post',
        path: 'posts/:slug',
        loadComponent: () =>
          import('@app/public/posts/post-page').then(
            (m) => m.PostPage
          ),
      },
      {
        title: 'Seguimiento de Reparación',
        path: 'tracking/:code',
        loadComponent: () =>
          import('@app/public/tracking/tracking-page').then(
            (m) => m.TrackingPage
          ),
      },
      {
        title: 'Política de Privacidad',
        path: 'privacy',
        loadComponent: () =>
          import('@app/public/privacy/privacy.component').then(
            (m) => m.PrivacyComponent
          ),
      },
      {
        title: 'Términos y Condiciones',
        path: 'terms',
        loadComponent: () =>
          import('@app/public/terms/terms.component').then(
            (m) => m.TermsComponent
          ),
      },
      {
        title: 'Blog',
        path: 'blog',
        loadComponent: () =>
          import('@app/public/blog/blog.component').then(
            (m) => m.BlogComponent
          ),
      },
      {
        title: 'Mapa del Sitio',
        path: 'sitemap',
        loadComponent: () =>
          import('@app/public/sitemap/sitemap.component').then(
            (m) => m.SitemapComponent
          ),
      },
      {
        title: 'FixTécnicos',
        path: 'fixtecnicos',
        loadComponent: () =>
          import('@app/public/fixtecnicos/fixtecnicos.component').then(
            (m) => m.FixtecnicosComponent
          ),
      },
      {
        title: 'Centro de Recursos',
        path: 'recursos',
        loadComponent: () =>
          import('@app/public/recursos/recursos.component').then(
            (m) => m.RecursosComponent
          ),
      },
    ],
  },
];

export default publicRoutes;
