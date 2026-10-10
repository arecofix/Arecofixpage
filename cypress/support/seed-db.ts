import { createClient } from '@supabase/supabase-js';

export async function resetTestTenant(url: string, key: string, tenantId: string) {
  const supabase = createClient(url, key);
  
  console.log(`[Cypress Seed] Reseteando datos para el tenant: ${tenantId}`);

  // Borrar datos en cascada (el orden importa por las Foreign Keys)
  await supabase.from('repair_parts_used').delete().eq('tenant_id', tenantId);
  await supabase.from('repairs').delete().eq('tenant_id', tenantId);
  await supabase.from('order_items').delete().eq('tenant_id', tenantId);
  await supabase.from('orders').delete().eq('tenant_id', tenantId);
  await supabase.from('product_variants').delete().eq('tenant_id', tenantId);
  await supabase.from('products').delete().eq('tenant_id', tenantId);
  await supabase.from('categories').delete().eq('tenant_id', tenantId);

  // Insertar Categoría de Prueba
  const { data: category } = await supabase.from('categories').insert({
    tenant_id: tenantId,
    name: 'Categoría Test Cypress',
    slug: 'categoria-test-cypress',
    is_active: true
  }).select().single();

  // Insertar Producto de Prueba
  if (category) {
    await supabase.from('products').insert({
      tenant_id: tenantId,
      name: 'Producto Cypress Test',
      slug: 'producto-cypress-test',
      category_id: category.id,
      price: 1500,
      stock: 10,
      is_active: true
    });
  }

  console.log('[Cypress Seed] Base de datos de pruebas lista.');
  return null;
}
