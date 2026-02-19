import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Load Environment Variables (or hardcode for build script)
const SUPABASE_URL = 'https://jftiyfnnaogmgvksgkbn.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpmdGl5Zm5uYW9nbWd2a3Nna2JuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE2NjQyMDgsImV4cCI6MjA2NzI0MDIwOH0.2hJUL3hRthqnOAETTlkdwdP5s39J4nwmWfaC180ixG0';
const BASE_URL = 'https://arecofix.com.ar';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const STATIC_ROUTES = [
  '',
  '/celular',
  '/servicios',
  '/academy',
  '/blog',
  '/contacto',
  '/nosotros',
  '/fixtecnicos',
  '/recursos',
  '/productos',
  '/productos/destacados',
  '/portfolio',
  '/gsm',
  '/privacy',
  '/terms'
];

async function generateSitemap() {
  console.log('Generating sitemap.xml...');

  const routes = [...STATIC_ROUTES];

  // 1. Fetch Dynamic Posts
  const { data: posts } = await supabase.from('posts').select('slug, updated_at');
  if (posts) {
    posts.forEach(post => {
      if (post.slug) routes.push(`/posts/${post.slug}`);
    });
  }

  // 2. Fetch Dynamic Services
  // Assuming 'services' table exists based on context
  const { data: services } = await supabase.from('services').select('slug');
  if (services) {
    services.forEach(service => {
      if (service.slug) routes.push(`/servicios/${service.slug}`);
    });
  }
  
  // 3. Fetch Products
  const { data: products } = await supabase.from('products').select('slug');
  if (products) {
    products.forEach(p => {
        if (p.slug) routes.push(`/productos/detalle/${p.slug}`);
    });
  }

   // 4. Fetch Categories
   const { data: categories } = await supabase.from('categories').select('slug');
   if (categories) {
     categories.forEach(c => {
         if (c.slug) routes.push(`/productos/categoria/${c.slug}`);
     });
   }
   
   // 5. Fetch Courses
   const { data: courses } = await supabase.from('courses').select('slug');
   if (courses) {
       courses.forEach(c => {
           if (c.slug) routes.push(`/academy/${c.slug}`);
       });
   }


  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${routes.map(route => {
    const url = route.startsWith('/') ? `${BASE_URL}${route}` : `${BASE_URL}/${route}`;
    return `
  <url>
    <loc>${url}</loc>
    <changefreq>weekly</changefreq>
    <priority>${route === '' ? '1.0' : '0.8'}</priority>
  </url>`;
  }).join('')}
</urlset>`;

  const outputPath = path.join(process.cwd(), 'src', 'assets', 'sitemap.xml');
  fs.writeFileSync(outputPath, sitemap);
  console.log(`Sitemap generated at ${outputPath} with ${routes.length} URLs.`);

  // Generate routes.txt for Angular Prerendering
  const routesTxtContent = routes.join('\n');
  const routesTxtPath = path.join(process.cwd(), 'routes.txt');
  fs.writeFileSync(routesTxtPath, routesTxtContent);
  console.log(`routes.txt generated at ${routesTxtPath} for Angular Prerendering.`);
}

generateSitemap().catch(console.error);
