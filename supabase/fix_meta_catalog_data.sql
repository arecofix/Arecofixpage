-- Meta Catalog Data Fixes
-- This script addresses: 
-- 1. Missing main images
-- 2. Duplicate SKUs
-- 3. Duplicate Slugs (to ensure clean links)

-- 1. Fix Missing/Invalid Images
-- We use a standard placeholder from the repository
UPDATE products 
SET image_url = 'branding/no-image.png' 
WHERE image_url IS NULL 
   OR image_url = '' 
   OR image_url = '_' 
   OR image_url = 'null' 
   OR image_url = 'undefined';

-- 2. Fix Duplicate SKUs
-- Identifies products sharing the same SKU and appends a unique suffix (short ID)
WITH sku_counts AS (
    SELECT sku, count(*) as cnt
    FROM products 
    WHERE sku IS NOT NULL AND sku != '' AND sku != '_'
    GROUP BY sku
    HAVING count(*) > 1
)
UPDATE products p
SET sku = p.sku || '-' || upper(substr(p.id::text, 1, 4))
FROM sku_counts sc
WHERE p.sku = sc.sku;

-- 3. Fix Duplicate Slugs
-- Ensures that every product has a unique URL slug
WITH slug_counts AS (
    SELECT slug, count(*) as cnt
    FROM products 
    WHERE slug IS NOT NULL AND slug != '' AND slug != '_'
    GROUP BY slug
    HAVING count(*) > 1
)
UPDATE products p
SET slug = p.slug || '-' || upper(substr(p.id::text, 1, 4))
FROM slug_counts sc
WHERE p.slug = sc.slug;

-- 4. Audit: Identify remaining duplicate IDs (if any across different tables or constraints)
-- Note: If ID is a PK, this won't find anything in a single table, 
-- but it helps identify logical duplicates in imports.
SELECT id, name, count(*) 
FROM products 
GROUP BY id, name 
HAVING count(*) > 1;
