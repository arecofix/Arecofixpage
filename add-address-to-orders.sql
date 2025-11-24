-- Add customer_address column to orders table
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS customer_address TEXT;
