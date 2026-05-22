import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jftiyfnnaogmgvksgkbn.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpmdGl5Zm5uYW9nbWd2a3Nna2JuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE2NjQyMDgsImV4cCI6MjA2NzI0MDIwOH0.2hJUL3hRthqnOAETTlkdwdP5s39J4nwmWfaC180ixG0';

const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  console.log("Testing order query with anon key...");
  
  const { data, error } = await supabase
    .from('orders')
    .select('*, items:order_items(*, product:products(id, name, slug, price, currency, image_url))')
    .eq('status', 'cart')
    .eq('session_id', 'some-session-id')
    .eq('tenant_id', 'bba26ccd-59ce-471c-aac0-4c1f5513de3b');

  if (error) {
    console.error("Query Error:", error);
  } else {
    console.log("Query Success:", data);
  }
}

test();
