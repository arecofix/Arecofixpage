const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://jftiyfnnaogmgvksgkbn.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpmdGl5Zm5uYW9nbWd2a3Nna2JuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE2NjQyMDgsImV4cCI6MjA2NzI0MDIwOH0.2hJUL3hRthqnOAETTlkdwdP5s39J4nwmWfaC180ixG0');

async function test() {
    let q = supabase.from('products').select('id, name');
    const words = ['A12', 'Modulo'];
    words.forEach(w => {
        q = q.or(`name.ilike.%${w}%,description.ilike.%${w}%,sku.ilike.%${w}%,barcode.ilike.%${w}%`);
    });
    const { data, error } = await q.limit(10);
    console.log("Error:", error);
    console.log("Data:", data);
}
test();
