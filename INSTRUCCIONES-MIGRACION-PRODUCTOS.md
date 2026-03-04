# 🚀 Instrucciones para Recuperar Productos Post-Migración Multi-Sucursal

## 📋 Problema Resuelto

Después de la migración a la arquitectura multi-sucursal, los productos existentes quedaron "invisibles" porque:
1. No tenían el flag `is_global = true`
2. Las políticas RLS bloqueaban su visibilidad para el Super Admin
3. No tenían registros de stock por sucursal

## ✅ Solución Implementada

### 1. Archivos Creados
- `execute-migration.sql` - Script completo para ejecutar la migración
- `fix-migration-scripts.sql` - Scripts individuales por tarea
- `verification-queries.sql` - Consultas para verificar resultados

### 2. Cambios en el Frontend
- Agregados badges 🌐 Global / 🏢 Local en la lista de productos
- El Super Admin ya tenía la lógica para ver todos los productos
- El catálogo de sucursales ya carga productos globales correctamente

## 🔧 Pasos para Ejecutar

### Paso 1: Ejecutar Script Principal
```sql
-- Ejecutar este script en Supabase SQL Editor
-- Copia y pega el contenido de: execute-migration.sql
```

### Paso 2: Verificar Resultados
```sql
-- Ejecutar estas consultas para verificar
-- Copia y pega el contenido de: verification-queries.sql
```

### Paso 3: Probar en el Frontend
1. Iniciar sesión como `ezequielenrico15@gmail.com`
2. Ir a `/admin/products`
3. Deberías ver todos los productos con badges 🌐 Global
4. Los productos deberían aparecer en la tienda principal

## 📊 Resultados Esperados

### Antes de la Migración:
- ❌ Productos invisibles en `/admin/products`
- ❌ Tienda principal sin productos
- ❌ Error de políticas RLS

### Después de la Migración:
- ✅ Todos los productos visibles para el Super Admin
- ✅ Productos globales con badge 🌐 Global
- ✅ Tienda principal mostrando catálogo completo
- ✅ Stock central creado para productos globales

## 🎯 Estructura de Productos

### Productos Globales 🌐
- `is_global = true`
- Visibles en TODAS las sucursales
- Precio se ajusta con markup de cada sucursal
- Stock gestionado desde sucursal central

### Productos Locales 🏢
- `is_global = false`
- Visibles solo en la sucursal que los creó
- Precio sin markup adicional
- Stock gestionado por sucursal específica

## 🔍 Verificación Manual

Ejecuta estas consultas para verificar:

```sql
-- Ver productos globales
SELECT name, sku, price, is_global 
FROM products 
WHERE is_global = true 
AND deleted_at IS NULL;

-- Ver stock central
SELECT p.name, ps.quantity 
FROM products p
JOIN product_stock_per_branch ps ON p.id = ps.product_id
WHERE ps.branch_id = (SELECT id FROM branches ORDER BY created_at ASC LIMIT 1);

-- Ver política RLS
SELECT * FROM pg_policies WHERE tablename = 'products';
```

## 🚨 Notas Importantes

1. **Backup**: Siempre hacer backup antes de ejecutar migraciones
2. **Transacción**: El script principal usa transacción, si falla no se aplica nada
3. **Super Admin**: El usuario `ezequielenrico15@gmail.com` ya está configurado como Super Admin
4. **Sucursal Central**: Se detecta automáticamente como la primera sucursal actualizada (usa `updated_at`)
5. **Columnas**: La tabla `branches` usa `updated_at` en lugar de `created_at` para ordenamiento

## 📞 Soporte

Si tienes problemas:
1. Verifica que el script se ejecutó sin errores
2. Revisa las consultas de verificación
3. Limpia caché del navegador
4. Verifica que estés logueado como Super Admin

---

## ✅ Checklist Final

- [ ] Ejecutar `execute-migration.sql`
- [ ] Verificar con `verification-queries.sql`
- [ ] Probar login como Super Admin
- [ ] Ver productos en `/admin/products`
- [ ] Confirmar badges 🌐 Global / 🏢 Local
- [ ] Ver productos en tienda principal
- [ ] Probar navegación entre sucursales

¡Listo! 🎉 Tu catálogo de productos debería estar completamente recuperado y funcionando.
