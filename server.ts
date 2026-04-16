import { APP_BASE_HREF } from '@angular/common';
import { CommonEngine } from '@angular/ssr/node';
import express from 'express';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import bootstrap from './src/main.server';
import { environment } from './src/environments/environment';

// The Express app is exported so that it can be used by serverless Functions.
export function app(): express.Express {
  const server = express();
  const serverDistFolder = dirname(fileURLToPath(import.meta.url));
  const browserDistFolder = resolve(serverDistFolder, '../browser');
  const indexHtml = join(serverDistFolder, 'index.server.html');

  const commonEngine = new CommonEngine();

  server.set('view engine', 'html');
  server.set('views', browserDistFolder);

  // Serve static files from /browser
  server.use(express.static(browserDistFolder, {
    maxAge: '1y',
    index: false
  }));

  // Dynamic Sitemap optimized for Google Search Console
  server.get('/sitemap.xml', async (req, res) => {
    try {
      const baseUrl = environment.baseUrl || 'https://arecofix.com.ar';
      
      let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
      
      // Static key routes
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

      // Fetch dynamic routes from Supabase (Products)
      if (environment.supabaseUrl && environment.supabaseKey) {
        try {
          const fetchOptions = {
            headers: {
              'apikey': environment.supabaseKey,
              'Authorization': `Bearer ${environment.supabaseKey}`
            }
          };
          // Fetch products that are public / active / not deleted
          // We use a high limit (10,000) to ensure we get all products for the sitemap
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
      // Cache sitemap in CDN for 24 hours, but let browsers cache it for 1 hour
      res.set('Cache-Control', 'public, max-age=3600, s-maxage=86400');
      return res.send(xml);
    } catch (e) {
      return res.status(500).end();
    }
  });

  // Dynamic Meta Product Catalog Feed (CSV Format for Facebook/Instagram Sales)
  server.get('/feed/meta.csv', async (req, res) => {
    try {
      if (!environment.supabaseUrl || !environment.supabaseKey) {
        return res.status(500).send('Supabase configuration missing');
      }

      const baseUrl = environment.baseUrl || 'https://arecofix.com.ar';
      const fetchOptions = {
        headers: {
          'apikey': environment.supabaseKey,
          'Authorization': `Bearer ${environment.supabaseKey}`
        }
      };

      // 1. Fetch Brands and Categories for mapping
      const [brandsRes, categoriesRes] = await Promise.all([
        fetch(`${environment.supabaseUrl}/rest/v1/brands?select=id,name`, fetchOptions),
        fetch(`${environment.supabaseUrl}/rest/v1/categories?select=id,name`, fetchOptions)
      ]);

      const brands = brandsRes.ok ? await brandsRes.json() : [];
      const categories = categoriesRes.ok ? await categoriesRes.json() : [];
      
      const brandMap = new Map(brands.map((b: any) => [b.id, b.name]));
      const categoryMap = new Map(categories.map((c: any) => [c.id, c.name]));

      // 2. Fetch Active Products (Including branch_id and sku)
      const productsRes = await fetch(`${environment.supabaseUrl}/rest/v1/products?select=id,name,description,price,currency,image_url,slug,stock,brand_id,category_id,branch_id,sku,is_active&is_active=eq.true&deleted_at=is.null&limit=15000`, fetchOptions);
      if (!productsRes.ok) return res.status(500).send('Error fetching products');
      
      const rawProducts = await productsRes.json();
      
      // Filter out invalid products and track unique identifiers
      const seenMetaIds = new Set();
      const seenSlugs = new Set();
      const seenSkus = new Set();
      
      console.log(`[Meta Feed] Processing ${rawProducts.length} raw products.`);

      // 3. Build CSV Content
      const headers = [
        'id',             // Unique ID
        'retailer_id',    // Often SKU or unique ID
        'item_group_id',  // Used for variants
        'mpn',            // Manufacturer Part Number
        'title', 
        'description', 
        'availability', 
        'condition', 
        'price', 
        'link', 
        'image_link', 
        'brand', 
        'quantity_to_sell_on_facebook', 
        'google_product_category'
      ];
      
      const rows = rawProducts.map((p: any) => {
        // 1. Unique ID Generation: Some products share IDs across different tenants/branches
        // We append branch_id to ensure Meta sees them as distinct items
        const rawId = String(p.id || '').trim();
        const branchId = String(p.branch_id || 'default').substring(0, 8);
        let metaId = rawId;
        
        if (seenMetaIds.has(metaId)) {
          metaId = `${rawId}_${branchId}`;
        }
        seenMetaIds.add(metaId);

        // 2. Links: Deduplicate slugs
        let slug = String(p.slug || '').trim();
        if (!slug || slug === '_' || seenSlugs.has(slug)) {
          slug = `${slug && slug !== '_' ? slug : 'p'}-${p.id.substring(0, 5)}`;
        }
        seenSlugs.add(slug);
        const productLink = `${baseUrl}/productos/detalle/${slug}`;
        
        // 3. Image: Standardize and catch '_' or placeholders
        let imageLink = String(p.image_url || '').trim();
        const noImagePlaceholder = `${baseUrl}/assets/img/no-image.png`;

        if (!imageLink || imageLink === 'null' || imageLink === 'undefined' || imageLink === '' || imageLink === '_') {
            imageLink = noImagePlaceholder;
        } else if (!imageLink.startsWith('http')) {
          const encodedPath = imageLink.split('/').map((s: string) => encodeURIComponent(s)).join('/');
          imageLink = `${environment.supabaseUrl}/storage/v1/object/public/public-assets/${encodedPath}`;
        }
        
        if (imageLink.startsWith('http:')) imageLink = imageLink.replace('http:', 'https:');
        
        // 4. Availability & Quantity
        const isActuallyInStock = (p.is_active && (p.stock > 0 || p.stock === null));
        const availability = isActuallyInStock ? 'in stock' : 'out of stock';
        let stockValue = Number(p.stock);
        if (isNaN(stockValue) || stockValue <= 0) stockValue = isActuallyInStock ? 10 : 0;

        // 5. Price & Currency: Force ARS if missing or invalid
        let priceValue = Number(p.price) || 0;
        if (priceValue <= 0) priceValue = 100.00;
        const currency = 'ARS'; 
        const formattedPrice = `${priceValue.toFixed(2)} ${currency}`;
        
        // 6. Text fields & SKU
        const sanitize = (text: string, len: number) => {
          return String(text || '').replace(/"/g, '""')
                        .replace(/[\x00-\x1F\x7F-\x9F]/g, '')
                        .replace(/\s+/g, ' ')
                        .trim()
                        .substring(0, len);
        };

        const title = sanitize(p.name || 'Producto Arecofix', 150);
        const description = sanitize(p.description || title, 4999);
        const brand = sanitize(String(brandMap.get(p.brand_id) || 'Arecofix'), 100);
        
        // SKU handling
        let sku = String(p.sku || p.id.substring(0, 8)).trim();
        if (seenSkus.has(sku)) {
          sku = `${sku}-${branchId}`;
        }
        seenSkus.add(sku);

        // Google Product Category mapping (fallback to category name)
        const categoryName = String(categoryMap.get(p.category_id) || 'Hardware');
        const googleCategory = categoryName.toLowerCase().includes('celular') ? 'Electronics > Communications > Telephony > Mobile Phones' : 'Hardware > Computer Hardware';

        // Robust CSV Escape Helper
        const quote = (val: any) => `"${String(val || '').trim()}"`;

        return [
          quote(metaId),
          quote(sku),           // retailer_id (Use SKU if available)
          quote(p.id),          // item_group_id (Base product ID)
          quote(sku),           // mpn
          quote(title),
          quote(description),
          quote(availability),
          quote('new'), 
          quote(formattedPrice),
          quote(productLink),
          quote(imageLink),
          quote(brand),
          quote(stockValue),
          quote(googleCategory)
        ].join(',');
      });

      const quotedHeaders = headers.map((h: string) => `"${h}"`).join(',');
      const csvContent = '\ufeff' + [quotedHeaders, ...rows].join('\r\n');

      res.header('Content-Type', 'text/csv; charset=utf-8');
      res.header('Content-Disposition', 'attachment; filename=meta-catalog.csv');
      res.set('Cache-Control', 'public, max-age=60, s-maxage=60'); 
      return res.send(csvContent);
    } catch (e) {
      console.error('Meta Feed Error:', e);
      return res.status(500).send('Internal Server Error');
    }
  });

  // All regular routes use the Angular Engine
  server.get(/(.*)/, (req, res, next) => {
    const { originalUrl, baseUrl, headers } = req;
    
    // Check X-Forwarded-Proto for correct protocol behind proxies like Firebase / Cloud Functions
    const protocol = headers['x-forwarded-proto'] || req.protocol;
    const host = headers['x-forwarded-host'] || headers.host;
    
    const fullUrl = `${protocol}://${host}${originalUrl}`;

    const userAgent = headers['user-agent']?.toLowerCase() || '';
    const isBot = /googlebot|facebookexternalhit|whatsapp|twitterbot|linkedinbot|bingbot|pinterest/i.test(userAgent);
    
    // Setting optimal Cache-Control headers natively for Firebase Hosting to read
    if (isBot) {
        // Bots: We want to cache metadata on the CDN for a shorter time or not at all
        // to ensure link previews update quickly when changed.
        res.set('Cache-Control', 'public, max-age=300, s-maxage=600');
    } else {
        // Regular Users: CDN cache for optimal performance (e.g., 1 hour)
        // Adjust these values as needed for your content update frequency
        res.set('Cache-Control', 'public, max-age=600, s-maxage=3600');
    }

    commonEngine
      .render({
        bootstrap,
        documentFilePath: indexHtml,
        url: fullUrl,
        publicPath: browserDistFolder,
        providers: [
            { provide: APP_BASE_HREF, useValue: baseUrl },
        ],
      })
      .then((html) => res.send(html))
      .catch((err) => next(err));
  });

  return server;
}

function run(): void {
  const port = process.env['PORT'] || 4000;
  const server = app();
  server.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

const mainModule = process.argv[1];
const modulePath = fileURLToPath(import.meta.url);

if (mainModule && (mainModule === modulePath || mainModule + '.mjs' === modulePath)) {
    run();
}
