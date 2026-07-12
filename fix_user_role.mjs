import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jftiyfnnaogmgvksgkbn.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpmdGl5Zm5uYW9nbWd2a3Nna2JuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE2NjQyMDgsImV4cCI6MjA2NzI0MDIwOH0.2hJUL3hRthqnOAETTlkdwdP5s39J4nwmWfaC180ixG0';
const supabase = createClient(supabaseUrl, supabaseKey);

async function fixUserRole() {
  const email = 'admin@arecofix.com.ar';
  const password = 'admin2026';
  
  console.log('Logging in as Admin...');
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (authError) {
    console.error('Error logging in:', authError.message);
    return;
  }
  
  console.log('Logged in successfully. User ID:', authData.user.id);
  console.log('User metadata:', authData.user.user_metadata);
  
  console.log('Updating profile role to super_admin...');
  const { data: updatedProfile, error: updateError } = await supabase
    .from('profiles')
    .update({ role: 'super_admin' })
    .eq('id', authData.user.id)
    .select();
    
  if (updateError) {
    console.error('Error updating profile:', updateError.message);
  } else {
    console.log('Profile updated successfully:', updatedProfile);
  }
}

fixUserRole();
