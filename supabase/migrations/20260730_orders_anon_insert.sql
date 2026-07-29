-- Allow anonymous users to insert orders (Guest Checkout)
CREATE POLICY "Enable insert for anonymous users" ON "public"."orders"
FOR INSERT TO anon
WITH CHECK (true);

-- Ensure authenticated users can also insert
CREATE POLICY "Enable insert for authenticated users" ON "public"."orders"
FOR INSERT TO authenticated
WITH CHECK (true);
