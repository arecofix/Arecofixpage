import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// --- CONFIGURATION ---
const envPath = path.join(process.cwd(), 'src/environments/environment.prod.ts');
const envContent = fs.readFileSync(envPath, 'utf8');

const urlMatch = envContent.match(/supabaseUrl:\s*'([^']+)'/);
const keyMatch = envContent.match(/supabaseKey:\s*'([^']+)'/);

const SUPABASE_URL = process.env.SUPABASE_URL || (urlMatch ? urlMatch[1] : 'https://jftiyfnnaogmgvksgkbn.supabase.co');
const SUPABASE_KEY = process.env.SUPABASE_KEY || (keyMatch ? keyMatch[1] : 'YOUR_SUPABASE_ANON_KEY');
const BASE_URL = 'https://arecofix.com.ar';
const CHUNK_SIZE = 1000;

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const STATIC_ROUTES = [
  '/', '/celular', '/servicios', '/academy', '/academy/mis-cursos', '/academy/create', '/blog',
  '/contacto', '/nosotros', '/fixtecnicos', '/recursos',
  '/productos', '/productos/destacados', '/portfolio',
  '/gsm', '/privacy', '/terms', '/not-found', '/reserva',
  '/repuestos', '/prueba-gratis'
];

async function fetchAll(table, select = 'slug', filters = {}) {
    let allData = [];
    let fromIdx = 0;
    let hasMore = true;

    while (hasMore) {
        let query = supabase.from(table).select(select).limit(CHUNK_SIZE).range(fromIdx, fromIdx + CHUNK_SIZE - 1);
        
        // Apply filters
        for (const [key, val] of Object.entries(filters)) {
            if (val === null) query = query.is(key, null);
            else if (typeof val === 'boolean') query = query.eq(key, val);
            else query = query.eq(key, val);
        }

        const { data, error } = await query;

        if (error) {
            console.error(` [31m[ERROR] Failed to fetch ${table}: [0m`, error.message);
            break;
        }

        if (data && data.length > 0) {
            allData = [...allData, ...data];
            if (data.length < CHUNK_SIZE) hasMore = false;
            else fromIdx += CHUNK_SIZE;
        } else {
            hasMore = false;
        }
    }
    return allData;
}

async function run() {
    console.log('🚀 Starting SEO Data Generation (Sitemap + Routes)...');

    const routes = [...STATIC_ROUTES];
    
    // 1. Fetch Products (Active & Not Deleted)
    console.log('📦 Fetching products...');
    const products = await fetchAll('products', 'slug', { is_active: true, deleted_at: null });
    // TEMPORARY: Do not prerender all individual products to avoid OOM in GitHub Actions!
    // Cloudflare Pages will serve these via SPA fallback correctly.
    // products.forEach(p => p.slug && routes.push(`/productos/detalle/${p.slug}`));

    // 2. Fetch Blog Posts (Published)
    console.log('📝 Fetching blog posts...');
    const posts = await fetchAll('blog_posts', 'slug, updated_at', { status: 'published' });
    posts.forEach(p => p.slug && routes.push(`/posts/${p.slug}`));

    // 3. Fetch Categories
    console.log('📂 Fetching categories...');
    const categories = await fetchAll('categories', 'slug', { is_active: true });
    categories.forEach(c => c.slug && routes.push(`/productos/categoria/${c.slug}`));

    // 3. Fetch Products
    console.log('🛍️ Fetching products...');
    // TEMPORARY: Do not add all individual products to routes.txt to avoid OOM in GitHub Actions!
    // Cloudflare Pages will serve these via SPA fallback correctly thanks to our _redirects rules.
    // const products = await fetchAll('products', 'slug', { is_active: true });
    // products.forEach(p => p.slug && routes.push(`/productos/detalle/${p.slug}`));

    // 4. Fetch Courses
    console.log('🎓 Fetching courses...');
    const courses = await fetchAll('courses', 'slug', { is_active: true });
    courses.forEach(c => c.slug && routes.push(`/academy/${c.slug}`));

    const finalRoutes = [...new Set(routes)].map(r => r === '' ? '/' : r);
    console.log(`✅ Total routes identified: ${finalRoutes.length}`);

    // --- GENERATE ROUTES.TXT (For Angular Prerender) ---
    const routesContent = finalRoutes.join('\n');
    fs.writeFileSync(path.join(process.cwd(), 'routes.txt'), routesContent);
    console.log(`📄 Routes generated at routes.txt`);

    // --- GENERATE _redirects (For Cloudflare Pages SPA Fallback) ---
    // We need explicit rewrites for prerendered routes so Cloudflare serves them instead of the root SPA.
    let redirectsContent = '';
    STATIC_ROUTES.forEach(route => {
        if (route === '/' || route === '/not-found') return;
        redirectsContent += `${route} ${route}/index.html 200\n`;
        redirectsContent += `${route}/ ${route}/index.html 200\n`;
    });
    
    // Dynamic splats for Cloudflare
    redirectsContent += `/productos/detalle/* /productos/detalle/:splat/index.html 200\n`;
    redirectsContent += `/productos/categoria/* /productos/categoria/:splat/index.html 200\n`;
    redirectsContent += `/posts/* /posts/:splat/index.html 200\n`;
    redirectsContent += `/academy/* /academy/:splat/index.html 200\n\n`;
    
    // SPA Fallback
    redirectsContent += `/* /index.html 200\n`;
    
    fs.writeFileSync(path.join(process.cwd(), 'public/_redirects'), redirectsContent);
    console.log(`📄 _redirects generated at public/_redirects`);

    console.log('✨ SEO Sync completed successfully.');
}

run().catch(console.error);
