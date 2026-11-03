export default {
  async fetch(request, env, ctx) {
    // 1. CORS Preflight
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization, apikey, x-client-info, X-Client-Info, Origin, x-sync-secret",
          "Access-Control-Max-Age": "86400",
        },
      });
    }

    try {
      const url = new URL(request.url);
      const pathname = url.pathname.replace(/^\/+|\/+$/g, ''); // Normalizar slashes

      // Simple root ping
      if (!pathname) {
        return new Response("OK", { 
          status: 200,
          headers: { "Access-Control-Allow-Origin": "*" }
        });
      }

      // 2. Healthcheck Endpoint
      if (pathname === 'health') {
        const tablesRes = await env.DB.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' AND name NOT LIKE '_cf_%' AND name NOT LIKE '_sync_%' ORDER BY name").all();
        const tables = (tablesRes.results || []).map(r => r.name);
        
        let lastSync = null;
        try {
          const syncMeta = await env.DB.prepare("SELECT val FROM _sync_metadata WHERE key = 'last_sync_at'").first();
          if (syncMeta && syncMeta.val) {
            lastSync = syncMeta.val;
          } else {
            const syncRes = await env.DB.prepare("SELECT MAX(created_at) as last_sync FROM products").first();
            lastSync = syncRes?.last_sync || null;
          }
        } catch {
          const syncRes = await env.DB.prepare("SELECT MAX(created_at) as last_sync FROM products").first();
          lastSync = syncRes?.last_sync || null;
        }

        // Corrección de lógica crítica: Si lastSync es null (nunca sincronizado), o > 24h -> stale = true
        const lastSyncTime = lastSync ? new Date(lastSync).getTime() : null;
        const isStale = lastSyncTime === null || isNaN(lastSyncTime) || (Date.now() - lastSyncTime > 24 * 3600 * 1000);

        return new Response(JSON.stringify({
          status: 'ok',
          tables,
          last_sync_at: lastSync,
          stale: isStale,
          timestamp: new Date().toISOString()
        }), {
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
          }
        });
      }

      // 3. Webhook de Sincronización (POST /sync)
      if (pathname === 'sync') {
        if (request.method !== 'POST') {
          return new Response(JSON.stringify({ error: "Method Not Allowed. Use POST for /sync" }), {
            status: 405,
            headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
          });
        }

        // Autenticación por Bearer Token o Header x-sync-secret
        const authHeader = request.headers.get("Authorization") || "";
        const customHeader = request.headers.get("x-sync-secret") || "";
        const expectedSecret = env.SYNC_SECRET || "arecofix-d1-sync-secret-20261019";

        const isAuthorized = authHeader === `Bearer ${expectedSecret}` || customHeader === expectedSecret;
        if (!isAuthorized) {
          return new Response(JSON.stringify({ error: "Unauthorized: Invalid or missing sync secret" }), {
            status: 401,
            headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
          });
        }

        const payload = await request.json().catch(() => null);
        if (!payload || !payload.table) {
          return new Response(JSON.stringify({ error: "Invalid payload: 'table' is required" }), {
            status: 400,
            headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
          });
        }

        const table = payload.table;
        if (!['products', 'categories', 'tenants', 'branches'].includes(table)) {
          return new Response(JSON.stringify({ error: `Unsupported table '${table}' for synchronization` }), {
            status: 400,
            headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
          });
        }

        let records = [];
        let action = payload.action || 'upsert';

        // Support both Supabase native database webhooks and custom payloads
        if (payload.record || payload.old_record) {
          if (payload.type === 'DELETE') {
            action = 'delete';
            records = [payload.old_record || payload.record];
          } else {
            action = 'upsert';
            records = [payload.record];
          }
        } else if (payload.data) {
          records = Array.isArray(payload.data) ? payload.data : [payload.data];
        } else if (payload.id) {
          records = [payload];
        } else {
          records = [];
        }

        let processedCount = 0;
        const nowIso = new Date().toISOString();

        if (action === 'delete') {
          for (const item of records) {
            if (item && item.id) {
              await env.DB.prepare(`DELETE FROM ${table} WHERE id = ?`).bind(item.id).run();
              processedCount++;
            }
          }
        } else {
          // UPSERT según tabla
          for (const item of records) {
            if (!item || !item.id) continue;

            if (table === 'tenants') {
              await env.DB.prepare(`
                INSERT INTO tenants (id, name, subdomain, custom_domain, logo_url, primary_color, created_at)
                VALUES (?, ?, ?, ?, ?, ?, ?)
                ON CONFLICT(id) DO UPDATE SET
                  name = excluded.name,
                  subdomain = excluded.subdomain,
                  custom_domain = excluded.custom_domain,
                  logo_url = excluded.logo_url,
                  primary_color = excluded.primary_color,
                  created_at = excluded.created_at
              `).bind(
                item.id,
                item.name || 'Tenant',
                item.subdomain || 'arecofix',
                item.custom_domain || null,
                item.logo_url || null,
                item.primary_color || null,
                item.created_at || nowIso
              ).run();
              processedCount++;
            } else if (table === 'categories') {
              await env.DB.prepare(`
                INSERT INTO categories (id, tenant_id, name, slug, description, image_url, created_at)
                VALUES (?, ?, ?, ?, ?, ?, ?)
                ON CONFLICT(id) DO UPDATE SET
                  tenant_id = excluded.tenant_id,
                  name = excluded.name,
                  slug = excluded.slug,
                  description = excluded.description,
                  image_url = excluded.image_url,
                  created_at = excluded.created_at
              `).bind(
                item.id,
                item.tenant_id || 'bba26ccd-59ce-471c-aac0-4c1f5513de3b',
                item.name || 'General',
                item.slug || 'general',
                item.description || null,
                item.image_url || null,
                item.created_at || nowIso
              ).run();
              processedCount++;
            } else if (table === 'products') {
              // Asegurar que el tenant exista si hay FK
              const tenantId = item.tenant_id || 'bba26ccd-59ce-471c-aac0-4c1f5513de3b';
              await env.DB.prepare(`
                INSERT INTO tenants (id, name, subdomain, created_at)
                VALUES (?, 'Arecofix', 'arecofix', ?)
                ON CONFLICT(id) DO NOTHING
              `).bind(tenantId, nowIso).run();

              if (item.category_id) {
                await env.DB.prepare(`
                  INSERT INTO categories (id, tenant_id, name, slug, created_at)
                  VALUES (?, ?, 'Categoría', ?, ?)
                  ON CONFLICT(id) DO NOTHING
                `).bind(item.category_id, tenantId, `cat-${item.category_id}`, nowIso).run();
              }

              const priceNum = typeof item.price === 'number' ? item.price : parseFloat(item.price) || 0;
              const stockNum = typeof item.stock === 'number' ? item.stock : parseInt(item.stock, 10) || 0;

              await env.DB.prepare(`
                INSERT INTO products (id, tenant_id, category_id, name, slug, description, price, stock, image_url, is_active, created_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                ON CONFLICT(id) DO UPDATE SET
                  tenant_id = excluded.tenant_id,
                  category_id = excluded.category_id,
                  name = excluded.name,
                  slug = excluded.slug,
                  description = excluded.description,
                  price = excluded.price,
                  stock = excluded.stock,
                  image_url = excluded.image_url,
                  is_active = excluded.is_active,
                  created_at = excluded.created_at
              `).bind(
                item.id,
                tenantId,
                item.category_id || null,
                item.name || 'Producto',
                item.slug || `prod-${item.id}`,
                item.description || null,
                priceNum,
                stockNum,
                item.image_url || null,
                item.is_active !== undefined ? (item.is_active ? 1 : 0) : 1,
                item.created_at || nowIso
              ).run();
              processedCount++;
            }
          }
        }

        // Actualizar _sync_metadata con el timestamp exacto del sync
        try {
          await env.DB.prepare(`
            CREATE TABLE IF NOT EXISTS _sync_metadata (
              key TEXT PRIMARY KEY,
              val TEXT
            )
          `).run();
          await env.DB.prepare(`
            INSERT INTO _sync_metadata (key, val) VALUES ('last_sync_at', ?)
            ON CONFLICT(key) DO UPDATE SET val = excluded.val
          `).bind(nowIso).run();
        } catch {
          // ignore error si falla _sync_metadata
        }

        return new Response(JSON.stringify({
          success: true,
          table,
          action,
          processed_count: processedCount,
          synced_at: nowIso,
          timestamp: new Date().toISOString()
        }), {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
          }
        });
      }

      // 4. Endpoints de Consulta de Solo Lectura (GET /<table_name>)
      if (request.method !== "GET") {
        return new Response(JSON.stringify({ error: "Method Not Allowed" }), { 
          status: 405,
          headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
        });
      }

      // Basic protection against SQL injection on table name
      if (!/^[a-zA-Z0-9_]+$/.test(pathname)) {
        return new Response(JSON.stringify({ error: "Invalid table name" }), { 
          status: 400,
          headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
        });
      }

      let query = `SELECT * FROM ${pathname}`;
      const params = [];
      const conditions = [];

      for (const [key, value] of url.searchParams.entries()) {
        if (key === 'select') continue;
        
        // Parse PostgREST eq. operators
        if (value.startsWith('eq.')) {
          conditions.push(`${key} = ?`);
          params.push(value.replace('eq.', ''));
        }
      }

      if (conditions.length > 0) {
        query += ` WHERE ` + conditions.join(' AND ');
      }

      const stmt = env.DB.prepare(query);
      const result = await stmt.bind(...params).all();
      
      if (!result.success) {
        throw new Error(result.error);
      }

      return new Response(JSON.stringify(result.results), {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "Content-Type, Authorization, apikey, x-client-info, X-Client-Info, Origin",
        },
      });
    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), { 
        status: 500,
        headers: { 
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*" 
        }
      });
    }
  },
};
