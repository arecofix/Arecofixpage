import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jftiyfnnaogmgvksgkbn.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpmdGl5Zm5uYW9nbWd2a3Nna2JuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE2NjQyMDgsImV4cCI6MjA2NzI0MDIwOH0.2hJUL3hRthqnOAETTlkdwdP5s39J4nwmWfaC180ixG0';
const supabase = createClient(supabaseUrl, supabaseKey);

async function insertProfile() {
  const { data, error } = await supabase.from('profiles').insert([
    {
      id: '00000000-0000-0000-0000-000000000001', // Fake UUID for Zaona
      email: 'zaona@arecofix.com.ar',
      first_name: 'Zaona',
      last_name: 'Libreria',
      full_name: 'Libreria Zaona',
      role: 'admin',
      is_active: true,
      tenant_id: '00000000-0000-0000-0000-000000000000'
    }
  ]);
  
  if (error) {
    console.error('Error inserting profile:', error.message);
  } else {
    console.log('Profile inserted:', data);
  }
}

insertProfile();
