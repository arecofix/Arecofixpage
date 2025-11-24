-- ============================================
-- ADD BARCODE COLUMN TO PRODUCTS TABLE
-- ============================================

-- Add barcode column to products table
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS barcode VARCHAR(100);

-- Create index for barcode lookups (optional but recommended)
CREATE INDEX IF NOT EXISTS idx_products_barcode ON products(barcode);

-- Add comment to document the column
COMMENT ON COLUMN products.barcode IS 'Product barcode for inventory management and scanning';
