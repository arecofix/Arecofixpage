import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jftiyfnnaogmgvksgkbn.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpmdGl5Zm5uYW9nbWd2a3Nna2JuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE2NjQyMDgsImV4cCI6MjA2NzI0MDIwOH0.2hJUL3hRthqnOAETTlkdwdP5s39J4nwmWfaC180ixG0';
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkCourses() {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: 'zaona@arecofix.com.ar',
    password: 'zaona2026'
  });
  
  const { data: courses, error: fetchError } = await supabase
    .from('courses')
    .select('id, title, is_active, tenant_id');
    
  if (fetchError) {
    console.error('Fetch error:', fetchError.message);
    return;
  }
  
  console.log(`Found ${courses.length} courses:`);
  console.log(courses);
}

checkCourses();
