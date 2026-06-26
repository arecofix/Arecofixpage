import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jftiyfnnaogmgvksgkbn.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpmdGl5Zm5uYW9nbWd2a3Nna2JuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE2NjQyMDgsImV4cCI6MjA2NzI0MDIwOH0.2hJUL3hRthqnOAETTlkdwdP5s39J4nwmWfaC180ixG0';
const supabase = createClient(supabaseUrl, supabaseKey);

async function fixUserRole() {
  const email = 'zaona@arecofix.com.ar';
  const password = 'zaona2026';
  
  console.log('Logging in as Zaona...');
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (authError) {
    console.error('Error logging in:', authError.message);
    return;
  }
  
  console.log('Logged in successfully. User ID:', authData.user.id);
  
  console.log('Attempting to update profile role to "admin"...');
  const { data: profileData, error: profileError } = await supabase.from('profiles').update({
    role: 'admin'
  }).eq('id', authData.user.id).select();
  
  if (profileError) {
    console.error('Error updating profile:', profileError.message);
  } else {
    console.log('Profile updated successfully:', profileData);
  }
}

fixUserRole();
