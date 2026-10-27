import { Request, Response, Router } from 'express';
import { environment } from '../../src/environments/environment';

const router = Router();

router.get('/sitemap.xml', async (req: Request, res: Response): Promise<void> => {
  try {
    const baseUrl = environment.baseUrl || 'https://arecofix.com.ar';
    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

    const staticRoutes = [
      { path: '/', priority: '1.0', freq: 'daily' },
      { path: '/servicios', priority: '0.9', freq: 'daily' },
      { path: '/productos', priority: '0.9', freq: 'daily' },
      { path: '/nosotros', priority: '0.8', freq: 'monthly' },
      { path: '/contacto', priority: '0.8', freq: 'monthly' },
      { path: '/cursos', priority: '0.8', freq: 'weekly' }
    ];

    staticRoutes.forEach(route => {
      xml += `  <url>\n    <loc>${baseUrl}${route.path}</loc>\n    <changefreq>${route.freq}</changefreq>\n    <priority>${route.priority}</priority>\n  </url>\n`;
    });

    if (environment.supabaseUrl && environment.supabaseKey) {
      const fetchOptions = {
        headers: {
          'apikey': environment.supabaseKey,
          'Authorization': `Bearer ${environment.supabaseKey}`
        }
      };

      try {
        // 1. Productos
        const productsRes = await fetch(`${environment.supabaseUrl}/rest/v1/products?select=slug,updated_at&is_active=eq.true&deleted_at=is.null&limit=1000`, fetchOptions);
        if (productsRes.ok) {
          const products = await productsRes.json();
          products.forEach((p: any) => {
            if (p.slug) {
              const lastmod = p.updated_at ? `<lastmod>${new Date(p.updated_at).toISOString().split('T')[0]}</lastmod>\n    ` : '';
              xml += `  <url>\n    <loc>${baseUrl}/productos/detalle/${p.slug}</loc>\n    ${lastmod}<changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>\n`;
            }
          });
        }

        // 2. Servicios publicados
        const servicesRes = await fetch(`${environment.supabaseUrl}/rest/v1/services?select=slug,updated_at&is_published=eq.true&deleted_at=is.null&limit=500`, fetchOptions);
        if (servicesRes.ok) {
          const services = await servicesRes.json();
          services.forEach((s: any) => {
            if (s.slug) {
              const lastmod = s.updated_at ? `<lastmod>${new Date(s.updated_at).toISOString().split('T')[0]}</lastmod>\n    ` : '';
              xml += `  <url>\n    <loc>${baseUrl}/servicios/${s.slug}</loc>\n    ${lastmod}<changefreq>weekly</changefreq>\n    <priority>0.85</priority>\n  </url>\n`;
            }
          });
        }

        // 3. Blog posts publicados
        const postsRes = await fetch(`${environment.supabaseUrl}/rest/v1/blog_posts?select=slug,updated_at&status=eq.published&limit=500`, fetchOptions);
        if (postsRes.ok) {
          const posts = await postsRes.json();
          posts.forEach((post: any) => {
            if (post.slug) {
              const lastmod = post.updated_at ? `<lastmod>${new Date(post.updated_at).toISOString().split('T')[0]}</lastmod>\n    ` : '';
              xml += `  <url>\n    <loc>${baseUrl}/posts/${post.slug}</loc>\n    ${lastmod}<changefreq>monthly</changefreq>\n    <priority>0.7</priority>\n  </url>\n`;
            }
          });
        }
      } catch (e) {
        console.error('Error fetching dynamic sitemap entries:', e);
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
