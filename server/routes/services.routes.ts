import { Router, Request, Response } from 'express';
import { environment } from '../../src/environments/environment';
import { validateBlockContent, BlockType } from '../../src/app/features/services/domain/dtos/block-schemas';
import * as crypto from 'crypto';

export const servicesRoutes = Router();

// In-memory sliding window rate limiter for leads
const leadRateLimitMap = new Map<string, number[]>();

function getSupabaseConfig(req?: Request) {
  const supabaseUrl = process.env['SUPABASE_URL'] || environment.supabaseUrl;
  const serviceKey = process.env['SUPABASE_SERVICE_ROLE_KEY'] || process.env['SUPABASE_KEY'] || environment.supabaseKey;
  const authHeader = req?.headers['authorization'];

  return {
    supabaseUrl: supabaseUrl.replace(/\/+$/, ''),
    serviceKey,
    headers: {
      'apikey': serviceKey,
      'Authorization': authHeader || `Bearer ${serviceKey}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    }
  };
}

function getClientIp(req: Request): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string') {
    return forwarded.split(',')[0].trim();
  }
  return req.ip || req.socket.remoteAddress || '127.0.0.1';
}

function hashIp(ip: string): string {
  const salt = process.env['IP_HASH_SALT'] || 'arecofix-leads-salt-2026';
  return crypto.createHash('sha256').update(ip + salt).digest('hex');
}

/**
 * Middleware: Verify Admin Access
 */
async function requireAdminAuth(req: Request, res: Response, next: () => void): Promise<void> {
  // Test mode: strictly restricted to test environment with explicit secret
  if (
    process.env['NODE_ENV'] === 'test' &&
    process.env['TEST_SECRET'] &&
    req.headers['x-test-secret'] === process.env['TEST_SECRET']
  ) {
    (req as any).adminUser = { id: '00000000-0000-0000-0000-000000000001', email: 'test-admin@arecofix.com.ar' };
    (req as any).adminProfile = { id: '00000000-0000-0000-0000-000000000001', role: 'admin', is_active: true };
    return next();
  }

  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    res.status(401).json({ success: false, error: 'Token de autorización ausente.' });
    return;
  }

  try {
    const { supabaseUrl, headers } = getSupabaseConfig(req);
    const userRes = await fetch(`${supabaseUrl}/auth/v1/user`, { headers });
    if (!userRes.ok) {
      res.status(401).json({ success: false, error: 'Sesión no válida o expirada.' });
      return;
    }
    const user = await userRes.json();
    if (!user?.id) {
      res.status(401).json({ success: false, error: 'Usuario no autenticado.' });
      return;
    }

    const profileRes = await fetch(
      `${supabaseUrl}/rest/v1/profiles?id=eq.${user.id}&select=id,role,is_active,tenant_id`,
      { headers }
    );
    const profiles = await profileRes.json();
    const profile = profiles?.[0];

    const allowedRoles = ['super_admin', 'admin', 'tenant_owner'];
    if (!profile || !allowedRoles.includes(profile.role)) {
      res.status(403).json({ success: false, error: 'Acceso denegado: se requieren permisos administrativos.' });
      return;
    }

    (req as any).adminUser = user;
    (req as any).adminProfile = profile;
    next();
  } catch (err: any) {
    res.status(500).json({ success: false, error: 'Error al verificar autenticación administrativa.' });
  }
}

// ==============================================================================
// 1. HEALTH CHECK: GET /health/services
// ==============================================================================
servicesRoutes.get('/health/services', async (_req: Request, res: Response): Promise<void> => {
  try {
    const { supabaseUrl, headers } = getSupabaseConfig();
    const [svcRes, blocksRes] = await Promise.all([
      fetch(`${supabaseUrl}/rest/v1/services?select=id&limit=1`, { headers }),
      fetch(`${supabaseUrl}/rest/v1/service_blocks?select=id&limit=1`, { headers }),
    ]);

    if (!svcRes.ok || !blocksRes.ok) {
      res.status(503).json({
        status: 'unhealthy',
        servicesTable: svcRes.ok ? 'connected' : 'error',
        blocksTable: blocksRes.ok ? 'connected' : 'error',
        timestamp: new Date().toISOString(),
      });
      return;
    }

    res.json({
      status: 'healthy',
      servicesTable: 'connected',
      blocksTable: 'connected',
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    res.status(503).json({ status: 'unhealthy', error: err.message });
  }
});

// ==============================================================================
// 2. PUBLIC API: GET /api/public/services
// ==============================================================================
servicesRoutes.get('/api/public/services', async (_req: Request, res: Response): Promise<void> => {
  try {
    const { supabaseUrl, headers } = getSupabaseConfig();
    const response = await fetch(
      `${supabaseUrl}/rest/v1/services?select=id,name,slug,icon,short_description,base_price,price,price_currency,duration_minutes,is_quotable,is_bookable,hero_image_url,template_slug,created_at&is_published=eq.true&deleted_at=is.null&order=created_at.desc`,
      { headers }
    );

    if (!response.ok) {
      const err = await response.text();
      res.status(500).json({ success: false, error: err });
      return;
    }

    const services = await response.json();
    const formatted = (services || []).map((s: any) => ({
      ...s,
      price_formatted: s.base_price !== null && s.base_price !== undefined
        ? new Intl.NumberFormat('es-AR', { style: 'currency', currency: s.price_currency || 'ARS' }).format(s.base_price)
        : 'Consultar',
    }));

    res.json({ success: true, data: formatted });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ==============================================================================
// 3. PUBLIC API: GET /api/public/services/:slug
// ==============================================================================
servicesRoutes.get('/api/public/services/:slug', async (req: Request, res: Response): Promise<void> => {
  const slug = String(req.params['slug'] || '');
  try {
    const { supabaseUrl, headers } = getSupabaseConfig();

    // 1. Check if published service exists
    const svcRes = await fetch(
      `${supabaseUrl}/rest/v1/services?slug=eq.${encodeURIComponent(slug)}&is_published=eq.true&deleted_at=is.null&limit=1`,
      { headers }
    );
    const services = await svcRes.json();
    const service = services?.[0];

    if (service) {
      // 2. Fetch features and blocks
      const [featRes, blocksRes] = await Promise.all([
        fetch(`${supabaseUrl}/rest/v1/service_features?service_id=eq.${service.id}&order=order_index.asc`, { headers }),
        fetch(`${supabaseUrl}/rest/v1/service_blocks?owner_type=eq.service&owner_id=eq.${service.id}&is_enabled=eq.true&order=order_index.asc`, { headers })
      ]);

      const features = (await featRes.json()) || [];
      const blocks = (await blocksRes.json()) || [];
      const siteUrl = environment.baseUrl || 'https://arecofix.com.ar';
      const canonical = service.canonical_url || `${siteUrl}/servicios/${service.slug}`;

      const schemaGraph = {
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'Service',
            '@id': `${canonical}#service`,
            name: service.name,
            description: service.short_description,
            url: canonical,
            serviceType: 'Tecnología & Reparaciones',
            provider: {
              '@type': 'LocalBusiness',
              '@id': `${siteUrl}/#organization`,
              name: 'Arecofix',
              url: siteUrl,
              telephone: '+5491125960900',
              address: {
                '@type': 'PostalAddress',
                streetAddress: 'Jorge Newbery 69',
                addressLocality: 'Marcos Paz',
                addressRegion: 'Buenos Aires',
                postalCode: '1727',
                addressCountry: 'AR'
              }
            },
            offers: service.base_price !== null ? {
              '@type': 'Offer',
              price: service.base_price,
              priceCurrency: service.price_currency || 'ARS',
              availability: 'https://schema.org/InStock',
              url: canonical
            } : undefined
          },
          {
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Inicio', item: siteUrl },
              { '@type': 'ListItem', position: 2, name: 'Servicios', item: `${siteUrl}/servicios` },
              { '@type': 'ListItem', position: 3, name: service.name, item: canonical }
            ]
          }
        ]
      };

      res.json({
        success: true,
        data: {
          ...service,
          price_formatted: service.base_price !== null && service.base_price !== undefined
            ? new Intl.NumberFormat('es-AR', { style: 'currency', currency: service.price_currency || 'ARS' }).format(service.base_price)
            : 'Consultar',
          features,
          blocks,
          schema_org: schemaGraph
        }
      });
      return;
    }

    // 3. Not found, check slug_redirects for 301
    const redirRes = await fetch(
      `${supabaseUrl}/rest/v1/slug_redirects?entity_type=eq.service&old_slug=eq.${encodeURIComponent(slug)}&order=created_at.desc&limit=1`,
      { headers }
    );
    const redirs = await redirRes.json();
    if (redirs && redirs.length > 0) {
      res.status(301).json({
        redirect: true,
        statusCode: 301,
        targetSlug: redirs[0].new_slug,
        location: `/servicios/${redirs[0].new_slug}`
      });
      return;
    }

    res.status(404).json({ success: false, error: 'Servicio no encontrado o no publicado.' });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ==============================================================================
// 4. PUBLIC API: POST /api/public/leads
// ==============================================================================
servicesRoutes.post('/api/public/leads', async (req: Request, res: Response): Promise<void> => {
  try {
    const { service_id, name, email, phone, message, source, utm_source, utm_medium, utm_campaign, hp_field } = req.body;

    // 1. Honeypot verification: reject bots immediately
    if (hp_field && hp_field.trim().length > 0) {
      res.status(400).json({ success: false, error: 'Detección anti-spam activada.' });
      return;
    }

    // 1.1 Turnstile verification
    const turnstileToken = req.body['cf-turnstile-response'] || req.body['turnstile_token'];
    const skipTurnstile = process.env['SKIP_TURNSTILE'] === 'true';

    if (!skipTurnstile) {
      if (!turnstileToken) {
        res.status(400).json({ success: false, error: 'Turnstile token required' });
        return;
      }

      if (turnstileToken === 'INVALID_TOKEN' || turnstileToken === 'TEST_FAIL_TOKEN') {
        res.status(400).json({ success: false, error: 'Turnstile validation failed' });
        return;
      }

      const turnstileSecret = process.env['TURNSTILE_SECRET_KEY'] || '1x0000000000000000000000000000000AA';
      try {
        const verifyRes = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({
            secret: turnstileSecret,
            response: turnstileToken,
            remoteip: getClientIp(req),
          }),
        });
        const verifyData: any = await verifyRes.json();
        if (!verifyData.success) {
          res.status(400).json({ success: false, error: 'Turnstile validation failed' });
          return;
        }
      } catch (err: any) {
        console.error('[Turnstile Verify Error]', err);
        res.status(400).json({ success: false, error: 'Turnstile validation failed' });
        return;
      }
    }

    // 2. Validate inputs
    if (!name || name.trim().length < 2) {
      res.status(400).json({ success: false, error: 'El nombre debe tener al menos 2 caracteres.' });
      return;
    }

    const cleanEmail = (email || '').trim();
    const cleanPhone = (phone || '').trim();
    if (!cleanEmail && !cleanPhone) {
      res.status(400).json({ success: false, error: 'Se requiere al menos un teléfono o correo electrónico de contacto.' });
      return;
    }

    if (!message || message.trim().length < 5) {
      res.status(400).json({ success: false, error: 'El mensaje debe tener al menos 5 caracteres.' });
      return;
    }

    // 3. Rate limiting (max 5 leads per hour per IP)
    const clientIp = getClientIp(req);
    const ipHashed = hashIp(clientIp);
    const now = Date.now();
    const windowMs = 3600 * 1000;

    const timestamps = leadRateLimitMap.get(ipHashed) || [];
    const validTimestamps = timestamps.filter(t => now - t < windowMs);

    if (validTimestamps.length >= 5) {
      res.status(429).json({
        success: false,
        error: 'Has alcanzado el límite de consultas permitidas por hora. Por favor reintentá más tarde.'
      });
      return;
    }

    validTimestamps.push(now);
    leadRateLimitMap.set(ipHashed, validTimestamps);

    // 4. Insert lead in database
    const leadId = crypto.randomUUID();
    const { supabaseUrl, headers } = getSupabaseConfig();
    const insertPayload = {
      id: leadId,
      service_id: service_id || null,
      name: name.trim(),
      email: cleanEmail || null,
      phone: cleanPhone || null,
      message: message.trim(),
      source: source || 'landing_service',
      utm_source: utm_source || null,
      utm_medium: utm_medium || null,
      utm_campaign: utm_campaign || null,
      ip_hash: ipHashed,
      user_agent: req.headers['user-agent'] || null,
      status: 'new'
    };

    const insertRes = await fetch(`${supabaseUrl}/rest/v1/service_leads`, {
      method: 'POST',
      headers: {
        ...headers,
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify(insertPayload)
    });

    if (!insertRes.ok) {
      const errText = await insertRes.text();
      res.status(500).json({ success: false, error: errText });
      return;
    }

    console.log(`[Lead Created] ID: ${leadId} - Name: ${name.trim()} - Source: ${source || 'landing'}`);

    res.status(201).json({
      success: true,
      message: 'Consulta recibida',
      data: { id: leadId }
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ==============================================================================
// 5. ADMIN API: GET & POST /api/admin/services
// ==============================================================================
servicesRoutes.get('/api/admin/services', requireAdminAuth, async (req: Request, res: Response): Promise<void> => {
  try {
    const { supabaseUrl, headers } = getSupabaseConfig(req);
    const page = parseInt(req.query['page'] as string) || 1;
    const limit = parseInt(req.query['limit'] as string) || 24;
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let queryUrl = `${supabaseUrl}/rest/v1/services?select=*,service_leads(count)&deleted_at=is.null&order=created_at.desc`;
    if (req.query['search']) {
      queryUrl += `&name=ilike.*${encodeURIComponent(req.query['search'] as string)}*`;
    }

    const response = await fetch(queryUrl, {
      headers: { ...headers, 'Range': `${from}-${to}`, 'Prefer': 'count=exact' }
    });

    const contentRange = response.headers.get('content-range');
    const total = contentRange ? parseInt(contentRange.split('/')[1]) || 0 : 0;
    const data = await response.json();

    res.json({ success: true, data, total, page, limit });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

servicesRoutes.post('/api/admin/services', requireAdminAuth, async (req: Request, res: Response): Promise<void> => {
  try {
    const { supabaseUrl, headers } = getSupabaseConfig(req);
    const { name, slug, short_description, long_description, base_price, is_quotable, is_bookable, icon, hero_image_url } = req.body;

    if (!name || name.trim().length < 3) {
      res.status(400).json({ success: false, error: 'El nombre debe tener al menos 3 caracteres.' });
      return;
    }

    const cleanSlug = (slug || name)
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    const insertPayload = {
      name: name.trim(),
      slug: cleanSlug,
      short_description: short_description || null,
      long_description: long_description || null,
      base_price: base_price !== undefined ? base_price : null,
      price: base_price || 0,
      icon: icon || 'fa-tools',
      hero_image_url: hero_image_url || null,
      is_quotable: is_quotable ?? true,
      is_bookable: is_bookable ?? false,
      is_published: false
    };

    const response = await fetch(`${supabaseUrl}/rest/v1/services`, {
      method: 'POST',
      headers,
      body: JSON.stringify(insertPayload)
    });

    if (!response.ok) {
      const errText = await response.text();
      res.status(400).json({ success: false, error: errText });
      return;
    }

    const created = await response.json();
    const service = created?.[0];

    // Create default hero block
    if (service?.id) {
      await fetch(`${supabaseUrl}/rest/v1/service_blocks`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          owner_type: 'service',
          owner_id: service.id,
          block_type: 'hero',
          order_index: 0,
          is_enabled: true,
          content: {
            title: service.name,
            subtitle: service.short_description || 'Servicio garantizado por Arecofix.',
            ctaLabel: 'Consultar Presupuesto',
            ctaHref: '#contacto',
            align: 'left',
            imageUrl: service.hero_image_url || ''
          }
        })
      });
    }

    res.status(201).json({ success: true, data: service });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ==============================================================================
// 6. ADMIN API: GET, PUT, DELETE /api/admin/services/:id
// ==============================================================================
servicesRoutes.get('/api/admin/services/:id', requireAdminAuth, async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { supabaseUrl, headers } = getSupabaseConfig(req);
    const response = await fetch(`${supabaseUrl}/rest/v1/services?id=eq.${id}&limit=1`, { headers });
    const data = await response.json();
    if (!data || data.length === 0) {
      res.status(404).json({ success: false, error: 'Servicio no encontrado.' });
      return;
    }

    // Fetch features
    const featRes = await fetch(`${supabaseUrl}/rest/v1/service_features?service_id=eq.${id}&order=order_index.asc`, { headers });
    const features = await featRes.json();

    res.json({ success: true, data: { ...data[0], features: features || [] } });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

servicesRoutes.put('/api/admin/services/:id', requireAdminAuth, async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { supabaseUrl, headers } = getSupabaseConfig(req);
    const updatePayload = { ...req.body, updated_at: new Date().toISOString() };
    delete updatePayload.id;
    delete updatePayload.features;

    // Check slug redirect if slug changes
    if (updatePayload.slug) {
      const currentRes = await fetch(`${supabaseUrl}/rest/v1/services?id=eq.${id}&select=slug`, { headers });
      const current = await currentRes.json();
      const oldSlug = current?.[0]?.slug;
      if (oldSlug && oldSlug !== updatePayload.slug) {
        await fetch(`${supabaseUrl}/rest/v1/slug_redirects`, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            entity_type: 'service',
            entity_id: id,
            old_slug: oldSlug,
            new_slug: updatePayload.slug
          })
        });
      }
    }

    const response = await fetch(`${supabaseUrl}/rest/v1/services?id=eq.${id}`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify(updatePayload)
    });

    if (!response.ok) {
      const errText = await response.text();
      res.status(400).json({ success: false, error: errText });
      return;
    }

    const updated = await response.json();
    res.json({ success: true, data: updated?.[0] });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

servicesRoutes.delete('/api/admin/services/:id', requireAdminAuth, async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { supabaseUrl, headers } = getSupabaseConfig(req);

    // Soft delete
    const response = await fetch(`${supabaseUrl}/rest/v1/services?id=eq.${id}`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify({ deleted_at: new Date().toISOString(), is_published: false })
    });

    if (!response.ok) {
      const errText = await response.text();
      res.status(400).json({ success: false, error: errText });
      return;
    }

    res.json({ success: true, message: 'Servicio eliminado correctamente.' });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ==============================================================================
// 7. ADMIN ACTIONS: PUBLISH, UNPUBLISH, DUPLICATE
// ==============================================================================
servicesRoutes.post('/api/admin/services/:id/publish', requireAdminAuth, async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { supabaseUrl, headers } = getSupabaseConfig(req);

    // 1. Verify service details
    const svcRes = await fetch(`${supabaseUrl}/rest/v1/services?id=eq.${id}&limit=1`, { headers });
    const services = await svcRes.json();
    const service = services?.[0];
    if (!service) {
      res.status(404).json({ success: false, error: 'Servicio no encontrado.' });
      return;
    }

    if (!service.short_description || service.short_description.trim().length < 10) {
      res.status(400).json({ success: false, error: 'La descripción corta es obligatoria para publicar (mínimo 10 caracteres).' });
      return;
    }

    // 2. Verify Hero block
    const blocksRes = await fetch(`${supabaseUrl}/rest/v1/service_blocks?owner_type=eq.service&owner_id=eq.${id}&block_type=eq.hero&is_enabled=eq.true&limit=1`, { headers });
    const heroes = await blocksRes.json();
    if (!heroes || heroes.length === 0) {
      res.status(400).json({ success: false, error: 'Se requiere al menos un bloque Hero habilitado para publicar.' });
      return;
    }

    // 3. Publish
    const updateRes = await fetch(`${supabaseUrl}/rest/v1/services?id=eq.${id}`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify({
        is_published: true,
        published_at: service.published_at || new Date().toISOString(),
        seo_title: service.seo_title || `${service.name} | Arecofix`,
        seo_description: service.seo_description || service.short_description.slice(0, 160)
      })
    });

    const updated = await updateRes.json();
    res.json({ success: true, data: updated?.[0], message: 'Servicio publicado con éxito.' });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

servicesRoutes.post('/api/admin/services/:id/unpublish', requireAdminAuth, async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { supabaseUrl, headers } = getSupabaseConfig(req);
    const response = await fetch(`${supabaseUrl}/rest/v1/services?id=eq.${id}`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify({ is_published: false })
    });
    const updated = await response.json();
    res.json({ success: true, data: updated?.[0], message: 'Servicio despublicado.' });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

servicesRoutes.post('/api/admin/services/:id/duplicate', requireAdminAuth, async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { supabaseUrl, headers } = getSupabaseConfig(req);

    const origRes = await fetch(`${supabaseUrl}/rest/v1/services?id=eq.${id}&limit=1`, { headers });
    const originals = await origRes.json();
    const original = originals?.[0];
    if (!original) {
      res.status(404).json({ success: false, error: 'Servicio original no encontrado.' });
      return;
    }

    const newSlug = `${original.slug}-copia-${Date.now().toString().slice(-4)}`;
    const clonePayload = {
      ...original,
      name: `${original.name} (Copia)`,
      slug: newSlug,
      is_published: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      deleted_at: null
    };
    delete clonePayload.id;

    const createRes = await fetch(`${supabaseUrl}/rest/v1/services`, {
      method: 'POST',
      headers,
      body: JSON.stringify(clonePayload)
    });
    const created = await createRes.json();
    const duplicated = created?.[0];

    // Clone blocks
    const blocksRes = await fetch(`${supabaseUrl}/rest/v1/service_blocks?owner_type=eq.service&owner_id=eq.${id}&order=order_index.asc`, { headers });
    const originalBlocks = await blocksRes.json();
    if (originalBlocks && originalBlocks.length > 0 && duplicated?.id) {
      const clonedBlocks = originalBlocks.map((b: any) => ({
        owner_type: 'service',
        owner_id: duplicated.id,
        block_type: b.block_type,
        content: b.content,
        order_index: b.order_index,
        is_enabled: b.is_enabled
      }));

      await fetch(`${supabaseUrl}/rest/v1/service_blocks`, {
        method: 'POST',
        headers,
        body: JSON.stringify(clonedBlocks)
      });
    }

    res.status(201).json({ success: true, data: duplicated, message: 'Servicio duplicado con éxito.' });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ==============================================================================
// 8. ADMIN BLOCKS API: GET, PUT, DELETE
// ==============================================================================
servicesRoutes.get('/api/admin/blocks', requireAdminAuth, async (req: Request, res: Response): Promise<void> => {
  try {
    const ownerType = (req.query['owner_type'] as string) || 'service';
    const ownerId = req.query['owner_id'] as string;
    if (!ownerId) {
      res.status(400).json({ success: false, error: 'owner_id es requerido.' });
      return;
    }

    const { supabaseUrl, headers } = getSupabaseConfig(req);
    const response = await fetch(
      `${supabaseUrl}/rest/v1/service_blocks?owner_type=eq.${ownerType}&owner_id=eq.${ownerId}&order=order_index.asc`,
      { headers }
    );
    const blocks = await response.json();
    res.json({ success: true, data: blocks || [] });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

servicesRoutes.put('/api/admin/blocks', requireAdminAuth, async (req: Request, res: Response): Promise<void> => {
  try {
    const { owner_type, owner_id, blocks } = req.body;
    if (!owner_type || !owner_id || !Array.isArray(blocks)) {
      res.status(400).json({ success: false, error: 'owner_type, owner_id y array de blocks son requeridos.' });
      return;
    }

    // Validate each block with Zod
    const errors: Record<string, string> = {};
    blocks.forEach((b: any, idx: number) => {
      const type = b.block_type as BlockType;
      const validation = validateBlockContent(type, b.content || {});
      if (!validation.success) {
        errors[b.id || `block_${idx}`] = validation.error || 'Contenido inválido';
      }
    });

    if (Object.keys(errors).length > 0) {
      res.status(400).json({ success: false, error: 'Validación de bloques fallida.', errors });
      return;
    }

    const { supabaseUrl, headers } = getSupabaseConfig(req);
    const rows = blocks.map((b: any, index: number) => ({
      ...(b.id ? { id: b.id } : {}),
      owner_type,
      owner_id,
      block_type: b.block_type,
      content: b.content || {},
      order_index: b.order_index !== undefined ? b.order_index : index,
      is_enabled: b.is_enabled !== undefined ? b.is_enabled : true,
      updated_at: new Date().toISOString()
    }));

    const response = await fetch(`${supabaseUrl}/rest/v1/service_blocks`, {
      method: 'POST',
      headers: { ...headers, 'Prefer': 'resolution=merge-duplicates,return=representation' },
      body: JSON.stringify(rows)
    });

    if (!response.ok) {
      const errText = await response.text();
      res.status(400).json({ success: false, error: errText });
      return;
    }

    const saved = await response.json();
    res.json({ success: true, data: saved });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

servicesRoutes.delete('/api/admin/blocks/:id', requireAdminAuth, async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { supabaseUrl, headers } = getSupabaseConfig(req);
    const response = await fetch(`${supabaseUrl}/rest/v1/service_blocks?id=eq.${id}`, {
      method: 'DELETE',
      headers
    });
    if (!response.ok) {
      const errText = await response.text();
      res.status(400).json({ success: false, error: errText });
      return;
    }
    res.json({ success: true, message: 'Bloque eliminado correctamente.' });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ==============================================================================
// 9. ADMIN LEADS API: GET /api/admin/leads & PATCH /api/admin/leads/:id/status
// ==============================================================================
servicesRoutes.get('/api/admin/leads', requireAdminAuth, async (req: Request, res: Response): Promise<void> => {
  try {
    const { supabaseUrl, headers } = getSupabaseConfig(req);
    let queryUrl = `${supabaseUrl}/rest/v1/service_leads?select=*,services:service_id(name)&order=created_at.desc`;
    if (req.query['status']) {
      queryUrl += `&status=eq.${encodeURIComponent(req.query['status'] as string)}`;
    }
    if (req.query['service_id']) {
      queryUrl += `&service_id=eq.${encodeURIComponent(req.query['service_id'] as string)}`;
    }

    const response = await fetch(queryUrl, { headers });
    const leads = await response.json();
    res.json({ success: true, data: leads || [] });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

servicesRoutes.patch('/api/admin/leads/:id/status', requireAdminAuth, async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const valid = ['new', 'contacted', 'quoted', 'won', 'lost'];
    if (!valid.includes(status)) {
      res.status(400).json({ success: false, error: `Estado inválido. Debe ser uno de: ${valid.join(', ')}` });
      return;
    }

    const { supabaseUrl, headers } = getSupabaseConfig(req);
    const updateBody: any = { status };
    if (status !== 'new') {
      updateBody.contacted_at = new Date().toISOString();
    }

    const response = await fetch(`${supabaseUrl}/rest/v1/service_leads?id=eq.${id}`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify(updateBody)
    });

    const updated = await response.json();
    res.json({ success: true, data: updated?.[0] });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});
