-- Enable anonymous users to submit contact messages and notifications for reservations
-- Using DO blocks to make them idempotent

DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'contact_messages' AND policyname = 'Public can insert contact messages'
    ) THEN
        CREATE POLICY "Public can insert contact messages"
        ON contact_messages
        FOR INSERT
        TO public
        WITH CHECK (true);
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'notifications' AND policyname = 'Public can insert admin notifications'
    ) THEN
        CREATE POLICY "Public can insert admin notifications"
        ON notifications
        FOR INSERT
        TO public
        WITH CHECK (scope = 'admin');
    END IF;
END $$;
