-- Diagnostic script for Repuestos categories and products

-- 1. Get Repuestos Root ID
WITH RootCat AS (
    SELECT id, name FROM categories WHERE slug = 'repuestos' OR name = 'Repuestos' LIMIT 1
)
SELECT 'Root Category' as info, * FROM RootCat;

-- 2. Count subcategories
WITH RootCat AS (
    SELECT id FROM categories WHERE slug = 'repuestos' OR name = 'Repuestos' LIMIT 1
)
SELECT 'Subcategories Count' as info, count(*) 
FROM categories 
WHERE parent_id = (SELECT id FROM RootCat);

-- 3. List subcategories IDs and Names
WITH RootCat AS (
    SELECT id FROM categories WHERE slug = 'repuestos' OR name = 'Repuestos' LIMIT 1
)
SELECT id, name, slug FROM categories 
WHERE parent_id = (SELECT id FROM RootCat) OR id = (SELECT id FROM RootCat);

-- 4. Count Products in these categories
WITH RepuestosTree AS (
    SELECT id FROM categories 
    WHERE parent_id IN (SELECT id FROM categories WHERE slug = 'repuestos' OR name = 'Repuestos')
       OR id IN (SELECT id FROM categories WHERE slug = 'repuestos' OR name = 'Repuestos')
)
SELECT 'Products Count in Repuestos Tree' as info, count(*) 
FROM products 
WHERE category_id IN (SELECT id FROM RepuestosTree);

-- 5. Show distribution of products by category (Top 10)
SELECT c.name as category_name, count(p.id) as product_count
FROM products p
LEFT JOIN categories c ON p.category_id = c.id
GROUP BY c.name
ORDER BY product_count DESC
LIMIT 10;
