import { Router, Request, Response } from 'express';
import { environment } from '../../src/environments/environment';

export const adminDashboardRoutes = Router();

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
      'Content-Type': 'application/json'
    }
  };
}

/**
 * Middleware: Verify Admin Access
 * Restricts access to super_admin or admin roles.
 */
async function requireAdminAuth(req: Request, res: Response, next: () => void): Promise<void> {
  // Test mode: strictly restricted to test environment with explicit secret
  if (
    process.env['NODE_ENV'] === 'test' &&
    process.env['TEST_SECRET'] &&
    req.headers['x-test-secret'] === process.env['TEST_SECRET']
  ) {
    (req as any).user = { id: '00000000-0000-0000-0000-000000000001', email: 'test-admin@arecofix.com.ar' };
    (req as any).profile = { id: '00000000-0000-0000-0000-000000000001', role: 'admin', is_active: true };
    return next();
  }

  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    res.status(401).json({
      success: false,
      error: 'Token de autorización ausente. Se requiere inicio de sesión administrativo.'
    });
    return;
  }

  try {
    const { supabaseUrl, headers } = getSupabaseConfig(req);
    // 1. Fetch user from Supabase auth
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

    // 2. Fetch profile role & tenant_id
    const profileRes = await fetch(
      `${supabaseUrl}/rest/v1/profiles?id=eq.${user.id}&select=id,role,is_active,tenant_id`,
      { headers }
    );
    const profiles = profileRes.ok ? await profileRes.json() : [];
    const profile = profiles[0];

    if (!profile || (profile.role !== 'admin' && profile.role !== 'super_admin')) {
      res.status(403).json({
        success: false,
        error: 'Acceso denegado: Se requieren permisos de administrador (admin o super_admin).'
      });
      return;
    }

    // Attach to request for downstream handlers
    (req as any).user = user;
    (req as any).profile = profile;

    return next();
  } catch (err: unknown) {
    console.error('[AdminDashboardAuth] Error verifying admin permissions:', err);
    res.status(500).json({ success: false, error: 'Error al verificar credenciales administrativas.' });
  }
}

/**
 * GET /api/admin/dashboard/health
 * Health check endpoint for dashboard database aggregation RPC and readiness
 */
adminDashboardRoutes.get('/health', async (_req: Request, res: Response): Promise<void> => {
  const startTime = Date.now();
  try {
    const { supabaseUrl, headers } = getSupabaseConfig();
    const rpcRes = await fetch(`${supabaseUrl}/rest/v1/rpc/get_admin_business_dashboard_metrics`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ p_range: 'month' })
    });

    const elapsedMs = Date.now() - startTime;
    if (!rpcRes.ok) {
      const errText = await rpcRes.text();
      res.status(503).json({
        status: 'unhealthy',
        database: 'error',
        error: errText,
        elapsed_ms: elapsedMs,
        timestamp: new Date().toISOString()
      });
      return;
    }

    const data = await rpcRes.json();
    if (data?.error) {
      res.status(503).json({
        status: 'unhealthy',
        database: 'rpc_error',
        error: data.error,
        elapsed_ms: elapsedMs,
        timestamp: new Date().toISOString()
      });
      return;
    }

    res.status(200).json({
      status: 'healthy',
      database: 'connected',
      elapsed_ms: elapsedMs,
      sample_kpis: data?.kpis || data?.metrics,
      timestamp: new Date().toISOString()
    });
  } catch (err: unknown) {
    res.status(500).json({
      status: 'unhealthy',
      database: 'disconnected',
      error: err instanceof Error ? err.message : String(err),
      elapsed_ms: Date.now() - startTime,
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * GET /api/admin/dashboard/db-health
 * Full PostgreSQL database health inspection (connections, cache hit, locks, dead tuples, vacuum, data freshness)
 */
adminDashboardRoutes.get('/db-health', requireAdminAuth, async (_req: Request, res: Response): Promise<void> => {
  try {
    const { supabaseUrl, headers } = getSupabaseConfig();
    const rpcRes = await fetch(`${supabaseUrl}/rest/v1/rpc/get_admin_database_health`, {
      method: 'POST',
      headers,
      body: JSON.stringify({})
    });

    if (!rpcRes.ok) {
      const errText = await rpcRes.text();
      res.status(502).json({ success: false, error: `Error de RPC get_admin_database_health: ${errText}` });
      return;
    }

    const data = await rpcRes.json();
    if (data?.error) {
      res.status(400).json({ success: false, error: data.error });
      return;
    }

    res.status(200).json({
      success: true,
      data
    });
  } catch (err: unknown) {
    const errMsg = err instanceof Error ? err.message : String(err);
    res.status(500).json({ success: false, error: `Error al obtener salud de la base de datos: ${errMsg}` });
  }
});

/**
 * GET /api/admin/dashboard/analytics
 * Returns top products sold, RFM customer segmentation, and repair statistics by brand/model/issues
 */
adminDashboardRoutes.get('/analytics', requireAdminAuth, async (req: Request, res: Response): Promise<void> => {
  const range = (req.query['range'] as string) || 'month';
  const branchId = req.query['branch_id'] as string | undefined;

  try {
    const { supabaseUrl, headers } = getSupabaseConfig();
    const rpcRes = await fetch(`${supabaseUrl}/rest/v1/rpc/get_admin_dashboard_analytics`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        p_range: range,
        p_branch_id: branchId || null
      })
    });

    if (!rpcRes.ok) {
      const errText = await rpcRes.text();
      res.status(502).json({ success: false, error: `Error de RPC get_admin_dashboard_analytics: ${errText}` });
      return;
    }

    const data = await rpcRes.json();
    if (data?.error) {
      res.status(400).json({ success: false, error: data.error });
      return;
    }

    res.status(200).json({
      success: true,
      data
    });
  } catch (err: unknown) {
    const errMsg = err instanceof Error ? err.message : String(err);
    res.status(500).json({ success: false, error: `Error al obtener analítica de negocio: ${errMsg}` });
  }
});


/**
 * GET /api/admin/dashboard/metrics
 * Consolidates real-time KPIs, charts and operational alerts across:
 * - Cash movements (Ingresos / Egresos / Balance)
 * - Orders (Ventas E-commerce)
 * - Repairs (Taller & retrasos)
 * - Academy (Suscripciones e ingresos)
 * - Products (Stock crítico)
 */
adminDashboardRoutes.get('/metrics', requireAdminAuth, async (req: Request, res: Response): Promise<void> => {
  const range = (req.query['range'] as string) || 'month';
  const startDate = req.query['start_date'] as string | undefined;
  const endDate = req.query['end_date'] as string | undefined;
  const branchId = req.query['branch_id'] as string | undefined;
  const queryTenantId = req.query['tenant_id'] as string | undefined;
  const simulateFailure = req.query['simulate_failure'] as string | undefined;

  const authProfile = (req as any).profile;
  const effectiveTenantId = queryTenantId || authProfile?.tenant_id || undefined;

  const partialErrors: Record<string, string> = {};

  try {
    const { supabaseUrl, headers } = getSupabaseConfig();

    console.log(`[AdminDashboard] Fetching metrics range=${range}, tenant=${effectiveTenantId || 'default'}, branch=${branchId || 'all'}`);

    // Adversarial testing simulation
    if (simulateFailure === 'academy') {
      partialErrors['academy'] = 'No se pudieron cargar los datos de Academia.';
    }

    // Call PostgreSQL RPC: get_admin_business_dashboard_metrics
    const rpcRes = await fetch(`${supabaseUrl}/rest/v1/rpc/get_admin_business_dashboard_metrics`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        p_tenant_id: effectiveTenantId || null,
        p_range: range,
        p_start_date: startDate || null,
        p_end_date: endDate || null,
        p_branch_id: branchId || null
      })
    });

    if (!rpcRes.ok) {
      const errText = await rpcRes.text();
      console.warn('[AdminDashboard] RPC returned non-200:', errText);
      throw new Error(`Database RPC error: ${errText}`);
    }

    const data = await rpcRes.json();

    if (data?.error) {
      console.warn('[AdminDashboard] RPC returned logical error:', data.error);
      throw new Error(data.error);
    }

    // If simulated failure on academy, blank out academy data
    if (simulateFailure === 'academy' && data?.kpis) {
      data.kpis.active_subscriptions_count = 0;
      data.kpis.academy_revenue = 0;
      if (data.charts?.revenue_by_origin) {
        data.charts.revenue_by_origin.academy = 0;
      }
    }

    console.log(`[AdminDashboard] Successfully retrieved metrics for range=${range}`);

    res.status(200).json({
      success: true,
      data,
      partialErrors: Object.keys(partialErrors).length > 0 ? partialErrors : undefined
    });
  } catch (err: unknown) {
    const errMsg = err instanceof Error ? err.message : String(err);
    console.error('[AdminDashboard] Error executing metrics RPC:', errMsg);

    // Return explicit error response for the client to handle
    res.status(500).json({
      success: false,
      error: `Error al cargar métricas de negocio: ${errMsg}`,
      data: {
        period: { range, start_date: new Date().toISOString(), end_date: new Date().toISOString() },
        kpis: {
          total_income: 0,
          total_expense: 0,
          net_balance: 0,
          ecommerce_orders_count: 0,
          ecommerce_amount: 0,
          active_repairs_count: 0,
          delayed_repairs_count: 0,
          has_delayed_alert: false,
          active_subscriptions_count: 0,
          academy_revenue: 0,
          critical_stock_count: 0
        },
        alerts: {
          critical_stock_items: [],
          overdue_pickup_repairs: [],
          expiring_grace_subscriptions: []
        },
        charts: {
          trend_6_months: [],
          revenue_by_origin: { ecommerce: 0, repairs: 0, academy: 0 }
        }
      },
      partialErrors: {
        system: 'Error de agregación en la base de datos.'
      }
    });
  }
});
