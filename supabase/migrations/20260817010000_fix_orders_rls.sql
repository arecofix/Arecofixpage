-- Migration to fix orders RLS for customers
-- We drop the overly restrictive Force_My_Tenant_On_Insert_Orders policy

DROP POLICY IF EXISTS "Force_My_Tenant_On_Insert_Orders" ON public.orders;

-- Ensure users can insert orders if they are creating it for themselves
DROP POLICY IF EXISTS "Users can insert their own orders" ON public.orders;
CREATE POLICY "Users can insert their own orders"
    ON public.orders FOR INSERT
    WITH CHECK (user_id = auth.uid());

-- Ensure users can update their own orders
DROP POLICY IF EXISTS "Users can update their own orders" ON public.orders;
CREATE POLICY "Users can update their own orders"
    ON public.orders FOR UPDATE
    USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());

-- Ensure admins/staff can still insert orders via the staff policies
-- We'll add a policy that allows staff to insert if the order's tenant matches their tenant
DROP POLICY IF EXISTS "Staff can insert orders for their tenant" ON public.orders;
CREATE POLICY "Staff can insert orders for their tenant"
    ON public.orders FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.staff s 
            WHERE s.id = auth.uid() 
            AND s.tenant_id = orders.tenant_id
        )
    );

-- Also fix order_items RLS
DROP POLICY IF EXISTS "Force_My_Tenant_On_Insert_Order_Items" ON public.order_items;

DROP POLICY IF EXISTS "Users can manage their own order items" ON public.order_items;
CREATE POLICY "Users can manage their own order items"
    ON public.order_items FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.orders o
            WHERE o.id = order_items.order_id
            AND o.user_id = auth.uid()
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.orders o
            WHERE o.id = order_items.order_id
            AND o.user_id = auth.uid()
        )
    );
