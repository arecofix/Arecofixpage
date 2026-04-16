import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// --- CONFIGURATION ---
const SUPABASE_URL = 'https://jftiyfnnaogmgvksgkbn.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpmdGl5Zm5uYW9nbWd2a3Nna2JuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE2NjQyMDgsImV4cCI6MjA2NzI0MDIwOH0.2hJUL3hRthqnOAETTlkdwdP5s39J4nwmWfaC180ixG0';
const BASE_URL = 'https://arecofix.com.ar';
const CHUNK_SIZE = 1000;

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const STATIC_ROUTES = [
  '/', '/celular', '/servicios', '/academy', '/blog',
  '/contacto', '/nosotros', '/fixtecnicos', '/recursos',
  '/productos', '/productos/destacados', '/portfolio',
  '/gsm', '/privacy', '/terms'
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
    products.forEach(p => p.slug && routes.push(`/productos/detalle/${p.slug}`));

    // 2. Fetch Blog Posts (Published)
    console.log('📝 Fetching blog posts...');
    const posts = await fetchAll('blog_posts', 'slug, updated_at', { status: 'published' });
    posts.forEach(p => p.slug && routes.push(`/posts/${p.slug}`));

    // 3. Fetch Categories
    console.log('📂 Fetching categories...');
    const categories = await fetchAll('categories', 'slug', { is_active: true });
    categories.forEach(c => c.slug && routes.push(`/productos/categoria/${c.slug}`));

    // 4. Fetch Courses
    console.log('🎓 Fetching courses...');
    const courses = await fetchAll('courses', 'slug', { is_active: true });
    courses.forEach(c => c.slug && routes.push(`/academy/${c.slug}`));

    const finalRoutes = [...new Set(routes)].map(r => r === '' ? '/' : r);
    console.log(`✅ Total routes identified: ${finalRoutes.length}`);

    // --- GENERATE SITEMAP.XML ---
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${finalRoutes.map(route => {
    const url = route.startsWith('http') ? route : `${BASE_URL}${route.startsWith('/') ? '' : '/'}${route}`;
    return `
  <url>
    <loc>${url}</loc>
    <changefreq>weekly</changefreq>
    <priority>${route === '/' ? '1.0' : '0.8'}</priority>
  </url>`;
  }).join('')}
</urlset>`;

    const publicDir = path.join(process.cwd(), 'public');
    if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });
    
    fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemap);
    console.log(`📄 Sitemap generated at public/sitemap.xml`);

    // --- GENERATE META-CATALOG.CSV (For Facebook/Instagram Shops) ---
    console.log('🛍️ Generating Meta Catalog CSV...');
    // We need more fields for the catalog than just the slug
    const catalogProducts = await fetchAll('products', 'id,name,description,price,currency,image_url,slug,stock,brand_id', { is_active: true, deleted_at: null });
    const brands = await fetchAll('brands', 'id,name');
    const brandMap = new Map(brands.map(b => [b.id, b.name]));

    const headers = ['id', 'title', 'description', 'availability', 'condition', 'price', 'link', 'image_link', 'brand', 'quantity_to_sell_on_facebook', 'google_product_category'];
    const quotedHeaders = headers.map(h => `"${h}"`).join(',');

    const csvRows = catalogProducts.map(p => {
        const productLink = `${BASE_URL}/productos/${p.slug}`;
        let imageLink = p.image_url || '';
        if (imageLink && !imageLink.startsWith('http')) {
            imageLink = `${SUPABASE_URL}/storage/v1/object/public/public-assets/${imageLink}`;
        }

        const quote = (val) => `"${String(val || '').replace(/"/g, '""').replace(/\n/g, ' ')}"`;
        const availability = (p.stock > 0 || p.stock === null) ? 'in stock' : 'out of stock';
        const formattedPrice = `${(Number(p.price) || 0).toFixed(2)} ${p.currency || 'ARS'}`;
        const title = p.name || p.description || 'Producto Arecofix';

        return [
            quote(p.id),
            quote(title),
            quote(p.description || title),
            quote(availability),
            quote('new'),
            quote(formattedPrice),
            quote(productLink),
            quote(imageLink),
            quote(brandMap.get(p.brand_id) || 'Arecofix'),
            quote(p.stock || 0),
            quote('')
        ].join(',');
    });

    const csvContent = '\ufeff' + [quotedHeaders, ...csvRows].join('\r\n');
    const feedDir = path.join(publicDir, 'feed');
    if (!fs.existsSync(feedDir)) fs.mkdirSync(feedDir, { recursive: true });
    
    fs.writeFileSync(path.join(feedDir, 'meta.csv'), csvContent);
    console.log(`📄 Meta Catalog generated at public/feed/meta.csv`);

    console.log('✨ SEO Sync completed successfully.');
}

run().catch(console.error);
