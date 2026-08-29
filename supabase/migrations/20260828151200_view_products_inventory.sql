CREATE OR REPLACE VIEW public.view_products_inventory WITH (security_invoker = true) AS
SELECT 
    price, 
    stock, 
    min_stock_alert 
FROM 
    public.products 
WHERE 
    deleted_at IS NULL AND is_active = true;
