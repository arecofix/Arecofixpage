-- Habilitar a los usuarios autenticados (del mismo tenant) a eliminar productos.
CREATE POLICY "Enable delete for tenant users" ON "public"."products"
FOR DELETE TO authenticated
USING (tenant_id = get_my_tenant() OR auth.jwt() ->> 'role' = 'superadmin');
