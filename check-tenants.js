const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = 'https://jftiyfnnaogmgvksgkbn.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpmdGl5Zm5uYW9nbWd2a3Nna2JuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE2NjQyMDgsImV4cCI6MjA2NzI0MDIwOH0.2hJUL3hRthqnOAETTlkdwdP5s39J4nwmWfaC180ixG0';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkData() {
    const { data: tenants, error: tErr } = await supabase.from('tenants').select('id, name, slug');
    console.log("Tenants:");
    console.log(tenants, tErr);

    const { data: products, error: pErr } = await supabase.from('products').select('id, name, tenant_id').limit(5);
    console.log("\nProducts sample:");
    console.log(products, pErr);
}

checkData();
