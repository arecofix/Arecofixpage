# Plan de Migración a SaaS Multitenant (White Label)

Este documento detalla los pasos para transformar la arquitectura actual de Arecofix en un modelo SaaS donde cada taller tiene su propia instancia aislada.

## 1. Fase de Base de Datos (SQL)

### Creación de la Tabla Tenants

```sql
-- 1. Crear tabla de Tenants
CREATE TABLE IF NOT EXISTS tenants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  plan_type text DEFAULT 'basic' CHECK (plan_type IN ('basic', 'premium', 'enterprise')),
  custom_domain text UNIQUE,
  branding_settings jsonb DEFAULT '{
    "primary_color": "#3b82f6",
    "logo_url": null,
    "favicon_url": null
  }'::jsonb,
  owner_id uuid REFERENCES auth.users(id),
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 2. Habilitar RLS en tenants
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;

-- Los usuarios solo ven su propio tenant (o todos si son super_admin)
CREATE POLICY "Users see their tenant" ON tenants
  FOR SELECT USING (
    id IN (SELECT tenant_id FROM profiles WHERE id = auth.uid())
    OR (SELECT role FROM profiles WHERE id = auth.uid()) = 'super_admin'
  );
```

### Modificación de Tablas Existentes

Debemos añadir `tenant_id` a todas las tablas operativas.

**Tablas a modificar:** `profiles`, `branches`, `clients`, `repairs`, `repair_jobs`, `products`, `product_stock_per_branch`, `orders`, `order_items`, `suppliers`, `categories`, `brands`, `sales`, `purchases`.

```sql
-- Ejemplo de script de migración para una tabla
DO $$
DECLARE
    t_id uuid;
    tables text[] := ARRAY['profiles', 'branches', 'clients', 'repairs', 'repair_jobs', 'products', 'product_stock_per_branch', 'orders', 'order_items', 'suppliers', 'categories', 'brands'];
    table_name text;
BEGIN
    -- 1. Crear el tenant inicial para tu taller actual si no existe
    INSERT INTO tenants (name, slug)
    VALUES ('Arecofix Principal', 'arecofix')
    ON CONFLICT (slug) DO NOTHING;

    SELECT id INTO t_id FROM tenants WHERE slug = 'arecofix';

    -- 2. Añadir columna tenant_id y actualizar datos
    FOREACH table_name IN ARRAY tables LOOP
        EXECUTE format('ALTER TABLE %I ADD COLUMN IF NOT EXISTS tenant_id uuid REFERENCES tenants(id)', table_name);
        EXECUTE format('UPDATE %I SET tenant_id = %L WHERE tenant_id IS NULL', table_name, t_id);
        EXECUTE format('ALTER TABLE %I ALTER COLUMN tenant_id SET NOT NULL', table_name);
    END LOOP;
END $$;
```

### Seguridad (RLS Global)

```sql
-- Función para obtener el tenant del usuario logueado
CREATE OR REPLACE FUNCTION get_my_tenant()
RETURNS uuid AS $$
  SELECT tenant_id FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- Aplicar políticas RLS (Ejemplo para repairs)
ALTER TABLE repairs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Tenant Isolation" ON repairs
  FOR ALL TO authenticated
  USING (tenant_id = get_my_tenant())
  WITH CHECK (tenant_id = get_my_tenant());
```

## 2. Fase de Aplicación (Frontend)

### Actualización de Interfaces (`user.interface.ts`)

```typescript
export type UserRole = "super_admin" | "tenant_owner" | "technician" | "staff";

export interface UserProfile {
  // ... campos actuales
  tenant_id: string;
  role: UserRole;
}
```

### Servicio de Perfil (`profile.service.ts`)

Asegurarse de que cada vez que se crea o consulta un perfil, se maneje el `tenant_id`.

## 3. Fase de Negocio: Suministros Globales

1. Añadir `is_global` a la tabla `products`.
2. Modificar la política RLS de `products` para que si `is_global` es true, el `SELECT` sea permitido para cualquier usuario autenticado, independientemente de su `tenant_id`.
