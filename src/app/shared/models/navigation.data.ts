import { NavItem } from './navigation.model';

/**
 * Static Navigation Data — Single Source of Truth
 *
 * Structure:  Padre  →  Hijo  →  Nieto
 * Each item's `theme` maps to visual styles defined in THEME_STYLES.
 * Paths must match routes declared in public.routes.ts & products.routes.ts.
 */
export const NAVIGATION_ITEMS: NavItem[] = [
  // ══════════════════════════════════════════════════
  // TIENDA — Productos, repuestos, electrónica
  // ══════════════════════════════════════════════════
  {
    id: 'tienda',
    label: 'Tienda',
    path: '/productos',
    icon: 'fas fa-store',
    theme: 'tienda',
    description: 'Productos, repuestos y accesorios',
    children: [
      {
        id: 'tienda-celulares',
        label: 'Celulares',
        path: '/productos/categoria/celulares',
        icon: 'fas fa-mobile-alt',
        theme: 'tienda',
        description: 'Smartphones nuevos y reacondicionados',
        children: [
          {
            id: 'tienda-celulares-nuevos',
            label: 'Nuevos',
            path: '/productos/categoria/celulares-nuevos',
            icon: 'fas fa-box-open',
            theme: 'tienda',
          },
          {
            id: 'tienda-celulares-reacondicionados',
            label: 'Reacondicionados',
            path: '/productos/categoria/celulares-reacondicionados',
            icon: 'fas fa-recycle',
            theme: 'tienda',
          },
          {
            id: 'tienda-celulares-tablets',
            label: 'Tablets',
            path: '/productos/categoria/tablets',
            icon: 'fas fa-tablet-alt',
            theme: 'tienda',
          },
        ],
      },
      {
        id: 'tienda-repuestos',
        label: 'Repuestos',
        path: '/repuestos',
        icon: 'fas fa-microchip',
        theme: 'tienda',
        description: 'Pantallas, baterías, flex y más',
        children: [
          {
            id: 'tienda-repuestos-modulos',
            label: 'Módulos / Pantallas',
            path: '/productos/categoria/modulos',
            icon: 'fas fa-th',
            theme: 'tienda',
          },
          {
            id: 'tienda-repuestos-baterias',
            label: 'Baterías',
            path: '/productos/categoria/baterias',
            icon: 'fas fa-battery-full',
            theme: 'tienda',
          },
          {
            id: 'tienda-repuestos-flex',
            label: 'Flex & Cables',
            path: '/productos/categoria/flex',
            icon: 'fas fa-plug',
            theme: 'tienda',
          },
          {
            id: 'tienda-repuestos-pin-carga',
            label: 'Pines de Carga',
            path: '/productos/categoria/pin-de-carga',
            icon: 'fas fa-charging-station',
            theme: 'tienda',
          },
        ],
      },
      {
        id: 'tienda-electronicos',
        label: 'Electrónica',
        path: '/productos/categoria/electronicos',
        icon: 'fas fa-laptop',
        theme: 'tienda',
        description: 'Computación, accesorios y gadgets',
        children: [
          {
            id: 'tienda-electronicos-accesorios',
            label: 'Accesorios',
            path: '/productos/categoria/accesorios',
            icon: 'fas fa-headphones',
            theme: 'tienda',
          },
          {
            id: 'tienda-electronicos-computacion',
            label: 'Computación',
            path: '/productos/categoria/computacion',
            icon: 'fas fa-desktop',
            theme: 'tienda',
          },
          {
            id: 'tienda-electronicos-audio',
            label: 'Audio & Video',
            path: '/productos/categoria/audio-video',
            icon: 'fas fa-volume-up',
            theme: 'tienda',
          },
          {
            id: 'tienda-electronicos-redes',
            label: 'Redes & WiFi',
            path: '/productos/categoria/redes',
            icon: 'fas fa-wifi',
            theme: 'tienda',
          },
        ],
      },
      {
        id: 'tienda-herramientas',
        label: 'Herramientas',
        path: '/productos/categoria/herramientas',
        icon: 'fas fa-wrench',
        theme: 'tienda',
        description: 'Kits profesionales de reparación',
      },
      {
        id: 'tienda-destacados',
        label: 'Destacados',
        path: '/productos/destacados',
        icon: 'fas fa-star',
        theme: 'tienda',
        badge: 'Hot',
      },
      {
        id: 'tienda-categorias',
        label: 'Todas las Categorías',
        path: '/categories',
        icon: 'fas fa-tags',
        theme: 'tienda',
      },
    ],
  },

  // ══════════════════════════════════════════════════
  // SERVICIOS — Técnico, IT, GSM, Portfolio
  // ══════════════════════════════════════════════════
  {
    id: 'servicios',
    label: 'Servicios',
    path: '/servicios',
    icon: 'fas fa-concierge-bell',
    theme: 'software',
    description: 'Servicio técnico, desarrollo y consultoría IT',
    children: [
      {
        id: 'servicios-tecnico',
        label: 'Servicio Técnico de Celulares',
        path: '/celular',
        icon: 'fas fa-mobile-alt',
        theme: 'software',
        description: 'Reparación en el acto en Marcos Paz',
        badge: '⚡',
      },
      {
        id: 'servicios-it',
        label: 'Consultoría IT',
        path: '/',
        icon: 'fas fa-server',
        theme: 'software',
        description: 'Desarrollo web, apps y transformación digital',
      },
      {
        id: 'servicios-gsm',
        label: 'GSM Tools',
        path: '/gsm',
        icon: 'fas fa-satellite-dish',
        theme: 'software',
        description: 'Flash, unlock y diagnóstico',
      },
      {
        id: 'servicios-tracking',
        label: 'Seguimiento de Reparación',
        path: '/tracking/consulta',
        icon: 'fas fa-search-location',
        theme: 'software',
        description: 'Consultá el estado de tu equipo',
      },
      {
        id: 'servicios-portfolio',
        label: 'Portfolio',
        path: '/portfolio',
        icon: 'fas fa-briefcase',
        theme: 'software',
        description: 'Proyectos y experiencia profesional',
      },
    ],
  },

  // ══════════════════════════════════════════════════
  // ACADEMIA — Cursos, blog, recursos
  // ══════════════════════════════════════════════════
  {
    id: 'academia',
    label: 'Academia',
    path: '/academy',
    icon: 'fas fa-graduation-cap',
    theme: 'academia',
    description: 'Cursos, blog y recursos técnicos',
    children: [
      {
        id: 'academia-cursos',
        label: 'Cursos',
        path: '/academy',
        icon: 'fas fa-chalkboard-teacher',
        theme: 'academia',
        description: 'Reparación de celulares y electrónica',
        badge: 'Nuevo',
      },
      {
        id: 'academia-blog',
        label: 'Blog',
        path: '/blog',
        icon: 'fas fa-newspaper',
        theme: 'academia',
        description: 'Artículos, guías y tutoriales',
      },
      {
        id: 'academia-recursos',
        label: 'Recursos',
        path: '/recursos',
        icon: 'fas fa-download',
        theme: 'academia',
        description: 'Drivers, manuales y descargas',
      },
      {
        id: 'academia-fixtecnicos',
        label: 'FixTécnicos',
        path: '/fixtecnicos',
        icon: 'fas fa-users-cog',
        theme: 'academia',
        description: 'Comunidad de técnicos reparadores',
      },
    ],
  },

  // ══════════════════════════════════════════════════
  // LINKS DIRECTOS
  // ══════════════════════════════════════════════════
  {
    id: 'nosotros',
    label: 'Nosotros',
    path: '/nosotros',
    icon: 'fas fa-users',
    theme: 'general',
  },
  {
    id: 'contacto',
    label: 'Contacto',
    path: '/contacto',
    icon: 'fas fa-envelope',
    theme: 'general',
  },
];

/**
 * Theme-specific visual styles for rendering icons, badges, and backgrounds.
 */
export const THEME_STYLES: Record<string, { gradient: string; accent: string; bg: string }> = {
  tienda:   { gradient: 'from-blue-500 to-cyan-400',    accent: 'text-blue-400',    bg: 'bg-blue-500/10' },
  software: { gradient: 'from-purple-500 to-pink-400',  accent: 'text-purple-400',  bg: 'bg-purple-500/10' },
  academia: { gradient: 'from-emerald-500 to-teal-400', accent: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  general:  { gradient: 'from-gray-400 to-gray-500',    accent: 'text-gray-400',    bg: 'bg-gray-500/10' },
};

/**
 * Shared "Ver todo" labels for mega menu footer and mobile accordion.
 * Single source of truth — used by both PublicLayoutHeader and NavItemRecursiveComponent.
 */
export const VIEW_ALL_LABELS: Record<string, string> = {
  tienda: 'Ver todos los productos',
  servicios: 'Ver todos los servicios',
  academia: 'Ver toda la academia',
};
