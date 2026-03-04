import { UrlMatcher, UrlSegment, UrlSegmentGroup, Route } from '@angular/router';

/**
 * Matcher para sucursales que evita colisiones con rutas reservadas.
 */
export const branchSlugMatcher: UrlMatcher = (segments: UrlSegment[], group: UrlSegmentGroup, route: Route) => {
  if (segments.length === 0) return null;

  const reservedSlugs = [
    'admin', 'login', 'register', 'perfil', 'nosotros', 'contacto', 
    'servicios', 'academy', 'checkout', 'posts', 'tracking', 'blog', 
    'portfolio', 'productos', 'categories', 'repuestos', 'gsm', 'fixtecnicos', 'recursos'
  ];

  const slug = segments[0].path.toLowerCase();

  // Si es reservado, no hay match
  if (reservedSlugs.includes(slug)) {
    return null;
  }

  // Si hay match, consumimos el segmento y lo pasamos como parámetro branchSlug
  return {
    consumed: [segments[0]],
    posParams: { branchSlug: segments[0] }
  };
};

/**
 * Guard complementario (legacy) por si se usa canMatch
 */
export const systemReservedGuard = (route: Route, segments: UrlSegment[]) => {
  const result = branchSlugMatcher(segments, null as any, route);
  return !!result;
};
