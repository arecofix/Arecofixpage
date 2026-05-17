import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// --- CONFIGURATION ---
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://jftiyfnnaogmgvksgkbn.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_KEY || 'YOUR_SUPABASE_ANON_KEY';
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

    // --- GENERATE ROUTES.TXT (For Angular Prerender) ---
    const routesContent = finalRoutes.join('\n');
    fs.writeFileSync(path.join(process.cwd(), 'routes.txt'), routesContent);
    console.log(`📄 Routes generated at routes.txt`);

    console.log('✨ SEO Sync completed successfully.');
}

run().catch(console.error);
