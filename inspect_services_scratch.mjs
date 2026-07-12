import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jftiyfnnaogmgvksgkbn.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpmdGl5Zm5uYW9nbWd2a3Nna2JuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE2NjQyMDgsImV4cCI6MjA2NzI0MDIwOH0.2hJUL3hRthqnOAETTlkdwdP5s39J4nwmWfaC180ixG0';
const supabase = createClient(supabaseUrl, supabaseKey);

async function testVisibility() {
  const email = 'admin@arecofix.com.ar';
  const password = 'admin2026';
  
  // Find a repair tracking code from repairs (including deleted/non-deleted ones)
  const { data: authData } = await supabase.auth.signInWithPassword({ email, password });
  const { data: repairs } = await supabase.from('repairs').select('tracking_code, deleted_at').limit(5);
  console.log('Repairs in DB:', repairs);
  
  if (!repairs || repairs.length === 0) return;
  const code = repairs[0].tracking_code;

  console.log(`\nTesting search for "${code}" while logged in...`);
  const resAuth = await supabase.rpc('get_repair_tracking', { p_code: code });
  console.log('Logged in result:', resAuth.data?.length > 0 ? 'FOUND ✅' : 'NOT FOUND ❌', resAuth.data);

  console.log(`\nTesting search for "${code}" while logged out...`);
  await supabase.auth.signOut();
  const resAnon = await supabase.rpc('get_repair_tracking', { p_code: code });
  console.log('Logged out result:', resAnon.data?.length > 0 ? 'FOUND ✅' : 'NOT FOUND ❌', resAnon.data);
}

testVisibility();
