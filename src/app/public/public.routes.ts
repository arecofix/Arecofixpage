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
        data: {
            seo: {
                title: 'Soluciones de Software & Consultoría IT',
                description: 'Expertos en desarrollo de software a medida, aplicaciones móviles y transformación digital. Consultoría IT y servicio técnico especializado en Marcos Paz.',
                imageUrl: 'assets/img/hero-illustration.svg'
            }
        }
      },
      {
        title: 'Reparación de Celulares en Marcos Paz | Servicio Técnico Arecofix',
        path: 'celular',
        loadComponent: () => import('@app/public/landing/celular/celular-landing.component').then(m => m.CelularLandingComponent),
        data: {
          seo: {
            title: 'Reparación de Celulares en Marcos Paz | Servicio Técnico Arecofix',
            description: 'Arreglo de pantallas, baterías y pines de carga en el acto. Calidad garantizada en Marcos Paz.',
            imageUrl: 'assets/img/branding/og-celulares.jpg',
            keywords: 'reparacion de celulares marcos paz, servicio tecnico celulares, arreglo de pantallas, cambio de bateria, arecofix',
            schema: {
              '@context': 'https://schema.org',
              '@type': 'MobilePhoneRepair',
              '@id': 'https://arecofix.com.ar',
              'name': 'Arecofix Servicio Técnico',
              'image': 'https://arecofix.com.ar/assets/img/branding/logo/logo-normal1.PNG',
              'description': 'Servicio técnico especializado en reparación de celulares en Marcos Paz. Cursos de reparación.',
              'priceRange': '$$',
              'address': {
                '@type': 'PostalAddress',
                'streetAddress': 'Jorge Newbery 69',
                'addressLocality': 'Marcos Paz',
                'addressRegion': 'Buenos Aires',
                'postalCode': '1727',
                'addressCountry': 'AR'
              },
              'geo': {
                '@type': 'GeoCoordinates',
                'latitude': -34.767191,
                'longitude': -58.817973
              },
              'url': 'https://www.arecofix.com.ar/celular',
              'telephone': '+5491125960900',
              'openingHoursSpecification': [
                {
                  '@type': 'OpeningHoursSpecification',
                  'dayOfWeek': ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
                  'opens': '09:00',
                  'closes': '19:00'
                },
                {
                  '@type': 'OpeningHoursSpecification',
                  'dayOfWeek': 'Saturday',
                  'opens': '09:00',
                  'closes': '13:00'
                }
              ],
              'aggregateRating': {
                '@type': 'AggregateRating',
                'ratingValue': '4.8',
                'reviewCount': '120'
              }
            }
          }
        }
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
        title: 'Portfolio - Ezequiel Enrico Areco | Fullstack Engineer',
        path: 'portfolio',
        loadComponent: () =>
          import('./portfolio/portfolio').then(
            (m) => m.PortfolioComponent
          ),
        data: {
            seo: {
                title: 'Ezequiel Enrico Areco - Senior Backend & Fullstack Engineer | Portfolio',
                description: 'Arquitecto de Soluciones Escalables & Ingeniero de Software. Experto en Node.js, Cloud, Clean Architecture y sistemas de alto rendimiento.',
                imageUrl: 'assets/img/branding/logo/Logo (2).png',
                keywords: 'software engineer, backend developer, clean architecture, node.js, cloud architect, ezequiel enrico areco, fullstack developer',
                type: 'profile',
                schema: {
                  '@context': 'https://schema.org',
                  '@type': 'Person',
                  'name': 'Ezequiel Enrico Areco',
                  'jobTitle': 'Senior Backend & Fullstack Engineer',
                  'url': 'https://arecofix.com.ar/portfolio',
                  'image': 'https://arecofix.com.ar/assets/img/branding/logo/Logo (2).png',
                  'sameAs': [
                    'https://www.linkedin.com/in/ezequiel-enrico/',
                    'https://github.com/arecofix'
                  ],
                  'knowsAbout': ['Node.js', 'Angular', 'Cloud Architecture', 'System Design', 'Supabase', 'Docker', 'Clean Architecture'],
                  'worksFor': {
                    '@type': 'Organization',
                    'name': 'Arecofix'
                  }
                }
            }
        }
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
