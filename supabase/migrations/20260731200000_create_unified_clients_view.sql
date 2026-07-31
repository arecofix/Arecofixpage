-- Vista unificada de clientes (perfiles e invitados) para paginación server-side
CREATE OR REPLACE VIEW v_unified_clients AS

-- 1. Perfiles registrados
SELECT 
    p.id::text,
    p.tenant_id,
    p.branch_id,
    p.first_name,
    p.last_name,
    p.email,
    p.phone,
    p.address,
    p.dni,
    CASE WHEN p.is_guest THEN 'repair' ELSE 'profile' END AS source,
    p.created_at,
    (SELECT count(*) FROM repairs r WHERE r.client_id = p.id) AS repair_count,
    (SELECT count(*) FROM orders o WHERE o.user_id = p.id) AS order_count
FROM profiles p
WHERE p.role = 'user' OR p.is_guest = true

UNION ALL

-- 2. Clientes invitados (órdenes sin perfil registrado)
SELECT 
    ('guest_' || COALESCE(o.customer_email, o.customer_phone))::text AS id,
    o.tenant_id,
    o.branch_id,
    SPLIT_PART(o.customer_name, ' ', 1) AS first_name,
    SUBSTRING(o.customer_name FROM POSITION(' ' IN o.customer_name) + 1) AS last_name,
    o.customer_email AS email,
    o.customer_phone AS phone,
    NULL AS address,
    NULL AS dni,
    'order' AS source,
    MIN(o.created_at) AS created_at,
    0 AS repair_count,
    COUNT(*) AS order_count
FROM orders o
WHERE o.user_id IS NULL AND (o.customer_email IS NOT NULL OR o.customer_phone IS NOT NULL)
GROUP BY 
    o.tenant_id, 
    o.branch_id, 
    o.customer_email, 
    o.customer_phone, 
    o.customer_name;
