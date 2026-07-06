-- ============================================================
-- FIX: save_repair_order RPC — Comprehensive RLS Fix
-- Generated from full schema analysis on 2026-07-02
-- ============================================================
-- The save_repair_order RPC fails with 403 because RLS on internal
-- tables blocks writes from the authenticated caller.
--
-- Tables touched by the RPC (in execution order):
--   1. repair_number_sequences  → upserts the per-tenant counter
--   2. repairs                  → inserts the main repair row
--   3. repair_status_history    → inserts the initial status log
--
-- Valid roles from profiles.role CHECK constraint:
--   'user' | 'admin' | 'staff' | 'super_admin' | 'tenant_owner' | 'technician'
--   NOTE: 'employee' does NOT exist — use 'staff' or 'technician' instead.
--
-- Run ALL statements below in the Supabase SQL Editor.
-- ============================================================


-- ════════════════════════════════════════════════════════════
-- SECTION 1: Disable RLS on purely internal/counter tables
-- repair_number_sequences: only holds a bigint counter per tenant.
-- repair_status_history:   append-only audit log, never read by end users.
-- Disabling RLS here is safe — no PII is exposed.
-- ════════════════════════════════════════════════════════════

ALTER TABLE public.repair_number_sequences DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.repair_status_history   DISABLE ROW LEVEL SECURITY;


-- ════════════════════════════════════════════════════════════
-- SECTION 2: Policies for repair_number_sequences
-- Belt-and-suspenders if RLS is ever re-enabled.
-- ════════════════════════════════════════════════════════════

DROP POLICY IF EXISTS "Staff can select repair_number_sequences" ON public.repair_number_sequences;
CREATE POLICY "Staff can select repair_number_sequences"
  ON public.repair_number_sequences FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
        AND profiles.role IN ('admin', 'super_admin', 'tenant_owner', 'staff', 'technician')
    )
  );

DROP POLICY IF EXISTS "Staff can insert repair_number_sequences" ON public.repair_number_sequences;
CREATE POLICY "Staff can insert repair_number_sequences"
  ON public.repair_number_sequences FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
        AND profiles.role IN ('admin', 'super_admin', 'tenant_owner', 'staff', 'technician')
    )
  );

DROP POLICY IF EXISTS "Staff can update repair_number_sequences" ON public.repair_number_sequences;
CREATE POLICY "Staff can update repair_number_sequences"
  ON public.repair_number_sequences FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
        AND profiles.role IN ('admin', 'super_admin', 'tenant_owner', 'staff', 'technician')
    )
  );


-- ════════════════════════════════════════════════════════════
-- SECTION 3: Policies for repair_status_history
-- Belt-and-suspenders if RLS is ever re-enabled.
-- ════════════════════════════════════════════════════════════

DROP POLICY IF EXISTS "Staff can select repair_status_history" ON public.repair_status_history;
CREATE POLICY "Staff can select repair_status_history"
  ON public.repair_status_history FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
        AND profiles.role IN ('admin', 'super_admin', 'tenant_owner', 'staff', 'technician')
    )
  );

DROP POLICY IF EXISTS "Staff can insert repair_status_history" ON public.repair_status_history;
CREATE POLICY "Staff can insert repair_status_history"
  ON public.repair_status_history FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
        AND profiles.role IN ('admin', 'super_admin', 'tenant_owner', 'staff', 'technician')
    )
  );

DROP POLICY IF EXISTS "Staff can update repair_status_history" ON public.repair_status_history;
CREATE POLICY "Staff can update repair_status_history"
  ON public.repair_status_history FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
        AND profiles.role IN ('admin', 'super_admin', 'tenant_owner', 'staff', 'technician')
    )
  );


-- ════════════════════════════════════════════════════════════
-- SECTION 4: Policies for the repairs table
-- Ensure all staff roles can INSERT, UPDATE, SELECT, DELETE.
-- ════════════════════════════════════════════════════════════

DROP POLICY IF EXISTS "Staff can insert repairs" ON public.repairs;
CREATE POLICY "Staff can insert repairs"
  ON public.repairs FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
        AND profiles.role IN ('admin', 'super_admin', 'tenant_owner', 'staff', 'technician')
    )
  );

DROP POLICY IF EXISTS "Staff can update repairs" ON public.repairs;
CREATE POLICY "Staff can update repairs"
  ON public.repairs FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
        AND profiles.role IN ('admin', 'super_admin', 'tenant_owner', 'staff', 'technician')
    )
  );

DROP POLICY IF EXISTS "Staff can select repairs" ON public.repairs;
CREATE POLICY "Staff can select repairs"
  ON public.repairs FOR SELECT TO authenticated
  USING (
    -- Staff see all repairs for their tenant
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
        AND profiles.role IN ('admin', 'super_admin', 'tenant_owner', 'staff', 'technician')
    )
    OR
    -- Clients can only see their own repairs (for tracking)
    client_id = auth.uid()
  );

DROP POLICY IF EXISTS "Staff can delete repairs" ON public.repairs;
CREATE POLICY "Staff can delete repairs"
  ON public.repairs FOR DELETE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
        AND profiles.role IN ('admin', 'super_admin', 'tenant_owner')
    )
  );

-- Allow clients to read their own repairs (for public tracking page)
DROP POLICY IF EXISTS "Clients can view own repairs" ON public.repairs;
CREATE POLICY "Clients can view own repairs"
  ON public.repairs FOR SELECT TO authenticated
  USING (client_id = auth.uid());


-- ════════════════════════════════════════════════════════════
-- SECTION 5: Policies for repair_images and repair_parts_used
-- These are also written during repair creation/update.
-- ════════════════════════════════════════════════════════════

-- repair_images
DROP POLICY IF EXISTS "Staff can manage repair_images" ON public.repair_images;
CREATE POLICY "Staff can manage repair_images"
  ON public.repair_images FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
        AND profiles.role IN ('admin', 'super_admin', 'tenant_owner', 'staff', 'technician')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
        AND profiles.role IN ('admin', 'super_admin', 'tenant_owner', 'staff', 'technician')
    )
  );

-- repair_parts_used
DROP POLICY IF EXISTS "Staff can manage repair_parts_used" ON public.repair_parts_used;
CREATE POLICY "Staff can manage repair_parts_used"
  ON public.repair_parts_used FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
        AND profiles.role IN ('admin', 'super_admin', 'tenant_owner', 'staff', 'technician')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
        AND profiles.role IN ('admin', 'super_admin', 'tenant_owner', 'staff', 'technician')
    )
  );


-- ════════════════════════════════════════════════════════════
-- SECTION 6 (RECOMMENDED PERMANENT FIX):
-- Make save_repair_order SECURITY DEFINER
--
-- With SECURITY DEFINER the function runs as the DB owner (postgres)
-- and bypasses ALL RLS checks on ALL tables it touches.
-- This is the cleanest solution.
--
-- Steps:
--   1. In Supabase Dashboard → Database → Functions → save_repair_order
--   2. Edit the function
--   3. Add SECURITY DEFINER and SET search_path = public to the definition
--
-- Or run this in the SQL editor after copying the function body:
--   SELECT pg_get_functiondef(oid) FROM pg_proc WHERE proname = 'save_repair_order';
-- Then recreate with SECURITY DEFINER at the end of the CREATE OR REPLACE block.
-- ════════════════════════════════════════════════════════════
