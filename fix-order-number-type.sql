-- Fix order_number type
-- It seems it might be an integer, but we need it to be a string (VARCHAR)
-- We use USING to cast existing values if possible, or just force the change

ALTER TABLE orders 
ALTER COLUMN order_number TYPE VARCHAR(50);

-- Just in case it was created as serial/integer and we want to drop the default if it had one
ALTER TABLE orders 
ALTER COLUMN order_number DROP DEFAULT;
