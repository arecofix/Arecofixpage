#!/usr/bin/env node
/**
 * ==============================================================================
 * ARECOFIX - DASHBOARD HEALTH CHECK & METRICS VALIDATOR (scripts/dashboard-healthcheck.mjs)
 * ==============================================================================
 * Verifies that the dashboard aggregation RPCs:
 * 1. get_admin_business_dashboard_metrics
 * 2. get_admin_dashboard_analytics
 * 3. get_admin_database_health
 * execute without error against the real production database (db.arecofix.com.ar).
 * ==============================================================================
 */

import 'dotenv/config';

const supabaseUrl = process.env.SUPABASE_URL || 'https://db.arecofix.com.ar';
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!serviceKey) {
  console.error('\x1b[31m[ERROR] SUPABASE_SERVICE_ROLE_KEY no configurado en variables de entorno.\x1b[0m');
  process.exit(1);
}

async function runDashboardHealthCheck() {
  const startTime = Date.now();
  console.log('\x1b[36m======================================================================\x1b[0m');
  console.log('\x1b[1m\x1b[32m🩺 ARECOFIX - AUDITORÍA FORENSE & HEALTH CHECK DEL DASHBOARD\x1b[0m');
  console.log('\x1b[36m======================================================================\x1b[0m');
  console.log(`📡 URL Supabase: ${supabaseUrl}`);

  let allHealthy = true;

  // 1. Base Metrics across 4 ranges
  console.log('\n\x1b[1m\x1b[34m[1/3] Verificando Métricas Base (Caja, E-commerce, Taller, Academia)...\x1b[0m');
  const ranges = ['today', '7days', 'month', 'year'];

  for (const range of ranges) {
    const rangeStart = Date.now();
    try {
      const res = await fetch(`${supabaseUrl.replace(/\/+$/, '')}/rest/v1/rpc/get_admin_business_dashboard_metrics`, {
        method: 'POST',
        headers: {
          apikey: serviceKey,
          Authorization: `Bearer ${serviceKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ p_range: range })
      });

      const elapsed = Date.now() - rangeStart;

      if (!res.ok) {
        const errText = await res.text();
        console.error(`\x1b[31m❌ Rango [${range}]: HTTP ${res.status} (${elapsed}ms) - Error: ${errText}\x1b[0m`);
        allHealthy = false;
        continue;
      }

      const data = await res.json();
      if (data?.error) {
        console.error(`\x1b[31m❌ Rango [${range}]: Fallo lógico (${elapsed}ms) - Error: ${data.error}\x1b[0m`);
        allHealthy = false;
        continue;
      }

      const kpis = data.kpis || data.metrics || {};
      const alerts = data.alerts || {};
      const charts = data.charts || {};

      console.log(`\x1b[32m✔ Rango [${range}]: OK (${elapsed}ms)\x1b[0m`);
      console.log(`   ├─ Balance Neto:        $ ${Number(kpis.net_balance || kpis.net_cashflow || 0).toLocaleString('es-AR')}`);
      console.log(`   ├─ Ingresos / Egresos:  $ ${Number(kpis.total_income || 0).toLocaleString('es-AR')} / $ ${Number(kpis.total_expense || 0).toLocaleString('es-AR')}`);
      console.log(`   ├─ Ventas E-commerce:   ${kpis.ecommerce_orders_count || 0} pedidos ($ ${Number(kpis.ecommerce_amount || 0).toLocaleString('es-AR')})`);
      console.log(`   ├─ Taller Activo:       ${kpis.active_repairs_count || 0} equipos (${kpis.delayed_repairs_count || 0} en demora)`);
      console.log(`   ├─ Alumnos Academia:    ${kpis.active_subscriptions_count || 0}`);
      console.log(`   ├─ Stock Crítico:       ${alerts.critical_stock_items?.length || 0} productos listados`);
      console.log(`   └─ Meses en Tendencia:  ${charts.trend_6_months?.length || 0} períodos`);
    } catch (err) {
      console.error(`\x1b[31m❌ Rango [${range}]: Excepción - ${err.message}\x1b[0m`);
      allHealthy = false;
    }
  }

  // 2. Advanced Analytics (Top Products, RFM, Repairs by Brand/Model/Issue)
  console.log('\n\x1b[1m\x1b[34m[2/3] Verificando Analítica de Negocio (Top Productos, Segmentación RFM, Taller)...\x1b[0m');
  const analyticsStart = Date.now();
  try {
    const res = await fetch(`${supabaseUrl.replace(/\/+$/, '')}/rest/v1/rpc/get_admin_dashboard_analytics`, {
      method: 'POST',
      headers: {
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ p_range: 'month' })
    });
    const elapsed = Date.now() - analyticsStart;

    if (!res.ok) {
      const errText = await res.text();
      console.error(`\x1b[31m❌ get_admin_dashboard_analytics: HTTP ${res.status} (${elapsed}ms) - Error: ${errText}\x1b[0m`);
      allHealthy = false;
    } else {
      const data = await res.json();
      console.log(`\x1b[32m✔ Analítica de Negocio: OK (${elapsed}ms)\x1b[0m`);
      console.log(`   ├─ Top Productos Listados: ${data.top_products?.length || 0} ítems`);
      if (data.top_products?.length > 0) {
        console.log(`   │  └─ #1: ${data.top_products[0].product_name} (${data.top_products[0].units_sold} un, $${Number(data.top_products[0].revenue).toLocaleString('es-AR')})`);
      }
      console.log(`   ├─ Tasa de Recompra (RFM): ${data.customer_analytics?.repeat_purchase_rate || 0}%`);
      console.log(`   ├─ Clientes Totales / Recurrentes: ${data.customer_analytics?.total_customers || 0} / ${data.customer_analytics?.repeat_customers || 0}`);
      console.log(`   ├─ Marcas en Taller: ${data.repair_analytics?.by_brand?.length || 0} marcas analizadas`);
      console.log(`   └─ Fallas Comunes:   ${data.repair_analytics?.common_issues?.length || 0} diagnósticos frecuentes`);
    }
  } catch (err) {
    console.error(`\x1b[31m❌ Error en analytics: ${err.message}\x1b[0m`);
    allHealthy = false;
  }

  // 3. PostgreSQL Database Health
  console.log('\n\x1b[1m\x1b[34m[3/3] Verificando Salud de PostgreSQL (pg_stat_*, conexiones, caché, frescura)...\x1b[0m');
  const healthStart = Date.now();
  try {
    const res = await fetch(`${supabaseUrl.replace(/\/+$/, '')}/rest/v1/rpc/get_admin_database_health`, {
      method: 'POST',
      headers: {
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({})
    });
    const elapsed = Date.now() - healthStart;

    if (!res.ok) {
      const errText = await res.text();
      console.error(`\x1b[31m❌ get_admin_database_health: HTTP ${res.status} (${elapsed}ms) - Error: ${errText}\x1b[0m`);
      allHealthy = false;
    } else {
      const data = await res.json();
      console.log(`\x1b[32m✔ Salud de Base de Datos: OK (${elapsed}ms)\x1b[0m`);
      console.log(`   ├─ Estado del Sistema:    ${data.status?.toUpperCase()}`);
      console.log(`   ├─ Conexiones Activas:    ${data.connections?.active} / ${data.connections?.max} (${data.connections?.percentage}%)`);
      console.log(`   ├─ Buffer Cache Hit:      ${data.performance?.cache_hit_ratio}%`);
      console.log(`   ├─ Bloqueos Bloqueados:   ${data.performance?.blocked_locks}`);
      console.log(`   ├─ Tablas Monitoreadas:   ${data.table_stats?.length || 0} tablas`);
      console.log(`   ├─ Última Reparación:     ${data.data_freshness?.last_repair}`);
      console.log(`   ├─ Última Venta/Orden:    ${data.data_freshness?.last_order}`);
      console.log(`   └─ Enlace Studio/pgAdmin: ${data.links?.studio_url}`);
    }
  } catch (err) {
    console.error(`\x1b[31m❌ Error en db health: ${err.message}\x1b[0m`);
    allHealthy = false;
  }

  const totalElapsed = ((Date.now() - startTime) / 1000).toFixed(2);
  console.log('\x1b[36m----------------------------------------------------------------------\x1b[0m');

  if (allHealthy) {
    console.log(`\x1b[1m\x1b[32m🎉 AUDITORÍA & HEALTH CHECK EXITOSO: Todos los módulos sincronizados en ${totalElapsed}s.\x1b[0m\n`);
    process.exit(0);
  } else {
    console.error(`\x1b[1m\x1b[31m💥 HEALTH CHECK CON ADVERTENCIAS: Se detectaron fallas.\x1b[0m\n`);
    process.exit(1);
  }
}

runDashboardHealthCheck();
