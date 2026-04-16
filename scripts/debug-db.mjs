import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jftiyfnnaogmgvksgkbn.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpmdGl5Zm5uYW9nbWd2a3Nna2JuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE2NjQyMDgsImV4cCI6MjA2NzI0MDIwOH0.2hJUL3hRthqnOAETTlkdwdP5s39J4nwmWfaC180ixG0';

const supabase = createClient(supabaseUrl, supabaseKey);

async function debug() {
    console.log('--- DB DEBUG ---');
    const { data, error } = await supabase.from('products').select('slug, is_active, deleted_at').limit(5);
    if (error) {
        console.error('Error:', error);
    } else {
        console.log('Products sample:', data);
    }

    const { data: count } = await supabase.from('products').select('*', { count: 'exact', head: true });
    console.log('Total products count:', count);
}

debug();
