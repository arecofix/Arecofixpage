-- Robust fix for "Database error deleting user"
-- This script dynamically finds ALL foreign keys referencing auth.users and updates them to ON DELETE CASCADE.

DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN
        SELECT
            tc.table_schema, 
            tc.table_name, 
            tc.constraint_name,
            kcu.column_name
        FROM 
            information_schema.table_constraints AS tc 
            JOIN information_schema.key_column_usage AS kcu
              ON tc.constraint_name = kcu.constraint_name
              AND tc.table_schema = kcu.table_schema
            JOIN information_schema.constraint_column_usage AS ccu
              ON ccu.constraint_name = tc.constraint_name
              AND ccu.table_schema = tc.table_schema
        WHERE tc.constraint_type = 'FOREIGN KEY' 
          AND ccu.table_name = 'users' 
          AND ccu.table_schema = 'auth'
    LOOP
        -- Drop the existing constraint
        EXECUTE format('ALTER TABLE %I.%I DROP CONSTRAINT %I', r.table_schema, r.table_name, r.constraint_name);
        
        -- Re-add it with ON DELETE CASCADE
        EXECUTE format('ALTER TABLE %I.%I ADD CONSTRAINT %I FOREIGN KEY (%I) REFERENCES auth.users(id) ON DELETE CASCADE', 
                       r.table_schema, r.table_name, r.constraint_name, r.column_name);
                       
        RAISE NOTICE 'Updated constraint % on table %.% to ON DELETE CASCADE', r.constraint_name, r.table_schema, r.table_name;
    END LOOP;
END $$;
