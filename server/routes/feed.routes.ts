import { Request, Response, Router } from 'express';
import { environment } from '../../src/environments/environment';

const router = Router();

router.get('/meta.csv', async (req: Request, res: Response): Promise<void> => {
  try {
    if (!environment.supabaseUrl || !environment.supabaseKey) {
      res.status(500).send('Supabase configuration missing');
      return;
    }

    const baseUrl = environment.baseUrl || 'https://arecofix.com.ar';
    const fetchOptions = {
      headers: {
        'apikey': environment.supabaseKey,
        'Authorization': `Bearer ${environment.supabaseKey}`
      }
    };

    const [brandsRes, categoriesRes] = await Promise.all([
      fetch(`${environment.supabaseUrl}/rest/v1/brands?select=id,name`, fetchOptions),
      fetch(`${environment.supabaseUrl}/rest/v1/categories?select=id,name`, fetchOptions)
    ]);

    const brands = brandsRes.ok ? await brandsRes.json() : [];
    const categories = categoriesRes.ok ? await categoriesRes.json() : [];

    const brandMap = new Map(brands.map((b: any) => [b.id, b.name]));
    const categoryMap = new Map(categories.map((c: any) => [c.id, c.name]));

    const productsRes = await fetch(`${environment.supabaseUrl}/rest/v1/products?select=id,name,description,price,currency,image_url,slug,stock,brand_id,category_id,branch_id,sku,is_active&is_active=eq.true&deleted_at=is.null&limit=15000`, fetchOptions);
    if (!productsRes.ok) {
      res.status(500).send('Error fetching products');
      return;
    }

    const rawProducts = await productsRes.json();
    const seenMetaIds = new Set();
    const seenSlugs = new Set();
    const seenSkus = new Set();

    const headers = [
      'id', 'retailer_id', 'item_group_id', 'mpn', 'title', 'description',
      'availability', 'condition', 'price', 'link', 'image_link', 'brand',
      'quantity_to_sell_on_facebook', 'google_product_category', 'custom_label_0'
    ];

    const rows = rawProducts.map((p: any) => {
      const rawId = String(p.id || '').trim();
      const branchId = String(p.branch_id || 'default').substring(0, 8);
      let metaId = rawId;

      if (seenMetaIds.has(metaId)) {
        metaId = `${rawId}_${branchId}`;
      }
      seenMetaIds.add(metaId);

      let slug = String(p.slug || '').trim();
      if (!slug || slug === '_' || seenSlugs.has(slug)) {
        slug = `${slug && slug !== '_' ? slug : 'p'}-${p.id.substring(0, 5)}`;
      }
      seenSlugs.add(slug);
      const productLink = `${baseUrl}/productos/detalle/${slug}`;

      let imageLink = String(p.image_url || '').trim();
      const noImagePlaceholder = `${baseUrl}/assets/img/no-image.png`;

      if (!imageLink || imageLink === 'null' || imageLink === 'undefined' || imageLink === '' || imageLink === '_') {
        imageLink = noImagePlaceholder;
      } else if (!imageLink.startsWith('http')) {
        const encodedPath = imageLink.split('/').map((s: string) => encodeURIComponent(s)).join('/');
        imageLink = `${environment.supabaseUrl}/storage/v1/object/public/public-assets/${encodedPath}`;
      }

      if (imageLink.startsWith('http:')) imageLink = imageLink.replace('http:', 'https:');

      const isActuallyInStock = (p.is_active && (p.stock > 0 || p.stock === null));
      const availability = isActuallyInStock ? 'in stock' : 'out of stock';
      let stockValue = Number(p.stock);
      if (isNaN(stockValue) || stockValue <= 0) stockValue = isActuallyInStock ? 10 : 0;

      let priceValue = Number(p.price) || 0;
      if (priceValue <= 0) priceValue = 100.00;
      const formattedPrice = `${priceValue.toFixed(2)} ARS`;

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

      let sku = String(p.sku || p.id.substring(0, 8)).trim();
      if (seenSkus.has(sku)) {
        sku = `${sku}-${branchId}`;
      }
      seenSkus.add(sku);

      const categoryName = String(categoryMap.get(p.category_id) || 'Hardware');
      const googleCategory = categoryName.toLowerCase().includes('celular') ? 'Electronics > Communications > Telephony > Mobile Phones' : 'Hardware > Computer Hardware';

      const quote = (val: any) => `"${String(val || '').trim()}"`;
      const isRepuesto = categoryName.toLowerCase().includes('repuesto') || categoryName.toLowerCase().includes('módulo') || categoryName.toLowerCase().includes('pantalla') || title.toLowerCase().includes('repuesto');
      const customLabel0 = isRepuesto ? 'Repuestos' : 'Equipos Principales';

      return [
        quote(metaId), quote(sku), quote(p.id), quote(sku), quote(title), quote(description),
        quote(availability), quote('new'), quote(formattedPrice), quote(productLink), quote(imageLink),
        quote(brand), quote(stockValue), quote(googleCategory), quote(customLabel0)
      ].join(',');
    });

    const quotedHeaders = headers.map((h: string) => `"${h}"`).join(',');
    const csvContent = '\ufeff' + [quotedHeaders, ...rows].join('\r\n');

    res.header('Content-Type', 'text/csv; charset=utf-8');
    res.header('Content-Disposition', 'attachment; filename=meta-catalog.csv');
    res.set('Cache-Control', 'public, max-age=60, s-maxage=60');
    res.send(csvContent);
  } catch (e) {
    console.error('Meta Feed Error:', e);
    res.status(500).send('Internal Server Error');
  }
});

router.get('/google-merchant.xml', async (req: Request, res: Response): Promise<void> => {
  try {
    if (!environment.supabaseUrl || !environment.supabaseKey) {
      res.status(500).send('Supabase configuration missing');
      return;
    }

    const baseUrl = environment.baseUrl || 'https://arecofix.com.ar';
    const fetchOptions = {
      headers: {
        'apikey': environment.supabaseKey,
        'Authorization': `Bearer ${environment.supabaseKey}`
      }
    };

    const [brandsRes, categoriesRes, productsRes] = await Promise.all([
      fetch(`${environment.supabaseUrl}/rest/v1/brands?select=id,name`, fetchOptions),
      fetch(`${environment.supabaseUrl}/rest/v1/categories?select=id,name`, fetchOptions),
      fetch(`${environment.supabaseUrl}/rest/v1/products?select=id,name,description,price,currency,image_url,slug,stock,brand_id,category_id,branch_id,sku,is_active&is_active=eq.true&deleted_at=is.null&limit=15000`, fetchOptions)
    ]);

    const brands = brandsRes.ok ? await brandsRes.json() : [];
    const categories = categoriesRes.ok ? await categoriesRes.json() : [];
    const rawProducts = productsRes.ok ? await productsRes.json() : [];

    const brandMap = new Map(brands.map((b: any) => [b.id, b.name]));
    const categoryMap = new Map(categories.map((c: any) => [c.id, c.name]));

    let xml = \`<?xml version="1.0" encoding="UTF-8"?>
<rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">
  <channel>
    <title>Arecofix Catálogo</title>
    <link>\${baseUrl}</link>
    <description>Catálogo de productos de Arecofix - Equipos y Repuestos</description>\n\`;

    const seenSlugs = new Set();

    rawProducts.forEach((p: any) => {
      let slug = String(p.slug || '').trim();
      if (!slug || slug === '_' || seenSlugs.has(slug)) {
        slug = \`\${slug && slug !== '_' ? slug : 'p'}-\${p.id.substring(0, 5)}\`;
      }
      seenSlugs.add(slug);
      const productLink = \`\${baseUrl}/productos/detalle/\${slug}\`;

      let imageLink = String(p.image_url || '').trim();
      const noImagePlaceholder = \`\${baseUrl}/assets/img/no-image.png\`;
      if (!imageLink || imageLink === 'null' || imageLink === '_') imageLink = noImagePlaceholder;
      else if (!imageLink.startsWith('http')) imageLink = \`\${environment.supabaseUrl}/storage/v1/object/public/public-assets/\${imageLink.split('/').map((s: string) => encodeURIComponent(s)).join('/')}\`;
      if (imageLink.startsWith('http:')) imageLink = imageLink.replace('http:', 'https:');

      let priceValue = Number(p.price) || 0;
      if (priceValue <= 0) priceValue = 100.00;
      const formattedPrice = \`\${priceValue.toFixed(2)} ARS\`;

      const isActuallyInStock = (p.is_active && (p.stock > 0 || p.stock === null));
      const availability = isActuallyInStock ? 'in_stock' : 'out_of_stock';

      const title = String(p.name || 'Producto').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      const description = String(p.description || title).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').substring(0, 4999);
      const brand = String(brandMap.get(p.brand_id) || 'Arecofix').replace(/&/g, '&amp;');
      const categoryName = String(categoryMap.get(p.category_id) || 'Hardware');
      const googleCategory = categoryName.toLowerCase().includes('celular') ? 'Electronics &gt; Communications &gt; Telephony &gt; Mobile Phones' : 'Hardware &gt; Computer Hardware';

      const isRepuesto = categoryName.toLowerCase().includes('repuesto') || categoryName.toLowerCase().includes('módulo') || categoryName.toLowerCase().includes('pantalla') || title.toLowerCase().includes('repuesto');
      const customLabel0 = isRepuesto ? 'Repuestos' : 'Equipos';

      xml += \`    <item>
      <g:id>\${p.id}</g:id>
      <g:title>\${title}</g:title>
      <g:description>\${description}</g:description>
      <g:link>\${productLink}</g:link>
      <g:image_link>\${imageLink}</g:image_link>
      <g:condition>new</g:condition>
      <g:availability>\${availability}</g:availability>
      <g:price>\${formattedPrice}</g:price>
      <g:brand>\${brand}</g:brand>
      <g:google_product_category>\${googleCategory}</g:google_product_category>
      <g:custom_label_0>\${customLabel0}</g:custom_label_0>
      <g:mpn>\${p.sku || p.id.substring(0, 8)}</g:mpn>
    </item>\n\`;
    });

    xml += \`  </channel>\n</rss>\`;

    res.header('Content-Type', 'application/xml; charset=utf-8');
    res.set('Cache-Control', 'public, max-age=3600, s-maxage=3600');
    res.send(xml);
  } catch (e) {
    console.error('Google Merchant Feed Error:', e);
    res.status(500).send('Internal Server Error');
  }
});

export const feedRoutes = router;
