import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jftiyfnnaogmgvksgkbn.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpmdGl5Zm5uYW9nbWd2a3Nna2JuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE2NjQyMDgsImV4cCI6MjA2NzI0MDIwOH0.2hJUL3hRthqnOAETTlkdwdP5s39J4nwmWfaC180ixG0';
const supabase = createClient(supabaseUrl, supabaseKey);

async function signUpUser() {
  const email = 'zaona@arecofix.com.ar';
  const password = 'zaona2026';
  
  console.log('Attempting to sign up user in Supabase Auth...');
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        first_name: 'Zaona',
        last_name: 'Libreria',
        full_name: 'Libreria Zaona',
        role: 'admin',
        is_active: true,
        tenant_id: 'bba26ccd-59ce-471c-aac0-4c1f5513de3b',
        branch_id: 'ae0776b7-2034-4baf-acf3-a9dab87a1e51'
      }
    }
  });

  if (error) {
    console.error('Error signing up:', error.message);
  } else {
    console.log('User signed up successfully:', data.user?.id);
    
    // Check if profile was created automatically, if not, create it
    if (data.user) {
        const { error: profileError } = await supabase.from('profiles').upsert({
            id: data.user.id,
            email: email,
            first_name: 'Zaona',
            last_name: 'Libreria',
            full_name: 'Libreria Zaona',
            role: 'user',
            is_active: true,
            tenant_id: '1' // Assuming tenant_id '1' for Arecofix
        });
        
        if (profileError) {
             console.error('Error creating profile:', profileError.message);
        } else {
             console.log('Profile ensured in profiles table.');
        }
    }
  }
}

signUpUser();
