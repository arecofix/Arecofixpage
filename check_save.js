const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://jftiyfnnaogmgvksgkbn.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpmdGl5Zm5uYW9nbWd2a3Nna2JuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE2NjQyMDgsImV4cCI6MjA2NzI0MDIwOH0.2hJUL3hRthqnOAETTlkdwdP5s39J4nwmWfaC180ixG0';

const supabase = createClient(supabaseUrl, supabaseKey);

async function inspectDb() {
  const payload = {
    issue_description: "test edge function error",
    current_status_id: 1,
    estimated_cost: 100,
    final_cost: 100,
    deposit_amount: 0,
    technical_labor_cost: 0,
    completed_at: null,
    branch_id: "00000000-0000-0000-0000-000000000000",
    received_by: null,
    assigned_technician_id: null,
    checklist: {},
    security_pin: null,
    security_pattern: null,
    glass_upsell: false,
    spare_part_cost: 0,
    whatsapp_notifications: true
  };
  
  console.log("Calling save_repair_order...");
  const { data, error } = await supabase.rpc('save_repair_order', { p_payload: payload });
  console.log("Data:", data);
  console.log("Error:", error);
}

inspectDb();
