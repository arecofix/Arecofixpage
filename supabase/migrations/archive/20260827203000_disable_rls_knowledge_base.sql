-- ─────────────────────────────────────────────────────────────────────────────
-- DISABLE RLS FOR KNOWLEDGE_BASE
--
-- Dado que la arquitectura frontend de Arecofix envía el tenant_id
-- explícitamente en las queries (ej. `eq('tenant_id', ...)`), y NO
-- configura la variable de entorno de PostgreSQL `app.current_tenant`
-- en los headers REST, la política RLS introducida en la tabla 
-- knowledge_base estaba devolviendo siempre 0 filas (porque
-- get_my_tenant() retornaba NULL).
--
-- Se desactiva RLS para igualar el patrón del resto de tablas
-- de la base de datos (orders, products, etc.) donde el filtro
-- multi-tenant se aplica vía aplicación y no vía DB policies.
-- ─────────────────────────────────────────────────────────────────────────────

ALTER TABLE public.knowledge_base DISABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Tenant users can manage their knowledge_base" ON public.knowledge_base;
DROP POLICY IF EXISTS "Public read for chatbot" ON public.knowledge_base;
