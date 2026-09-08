-- Script para añadir constraint de unicidad en Supabase (evita duplicados de chunks en upserts)
ALTER TABLE public.knowledge_base
ADD CONSTRAINT knowledge_base_tenant_source_chunk_idx UNIQUE (tenant_id, source_id, chunk_index);
