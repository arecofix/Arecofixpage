import { Request, Response, Router } from 'express';
import { environment } from '../../src/environments/environment';

const router = Router();

router.get('/sitemap.xml', async (req: Request, res: Response): Promise<void> => {
  try {
    const baseUrl = environment.baseUrl || 'https://arecofix.com.ar';
    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

    const staticRoutes = [
      { path: '/', priority: '1.0', freq: 'daily' },
      { path: '/productos', priority: '0.9', freq: 'daily' },
      { path: '/nosotros', priority: '0.8', freq: 'monthly' },
      { path: '/contacto', priority: '0.8', freq: 'monthly' },
      { path: '/cursos', priority: '0.8', freq: 'weekly' }
    ];

    staticRoutes.forEach(route => {
      xml += `  <url>\n    <loc>${baseUrl}${route.path}</loc>\n    <changefreq>${route.freq}</changefreq>\n    <priority>${route.priority}</priority>\n  </url>\n`;
    });

    if (environment.supabaseUrl && environment.supabaseKey) {
      try {
        const fetchOptions = {
          headers: {
            'apikey': environment.supabaseKey,
            'Authorization': `Bearer ${environment.supabaseKey}`
          }
        };
        const queryParams = 'select=slug&is_active=eq.true&deleted_at=is.null&limit=10000';
        const productsRes = await fetch(`${environment.supabaseUrl}/rest/v1/products?${queryParams}`, fetchOptions);
        if (productsRes.ok) {
          const products = await productsRes.json();
          products.forEach((p: any) => {
            if (p.slug) {
              xml += `  <url>\n    <loc>${baseUrl}/productos/detalle/${p.slug}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>\n`;
            }
          });
        }
      } catch (e) {
        console.error('Error fetching products from Supabase for sitemap:', e);
      }
    }

    xml += `</urlset>`;
    res.header('Content-Type', 'application/xml');
    res.set('Cache-Control', 'public, max-age=3600, s-maxage=86400');
    res.send(xml);
  } catch (e) {
    res.status(500).end();
  }
});

export const sitemapRoutes = router;
