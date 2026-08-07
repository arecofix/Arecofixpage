const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://jftiyfnnaogmgvksgkbn.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpmdGl5Zm5uYW9nbWd2a3Nna2JuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE2NjQyMDgsImV4cCI6MjA2NzI0MDIwOH0.2hJUL3hRthqnOAETTlkdwdP5s39J4nwmWfaC180ixG0';

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
    const { data, error } = await supabase
        .from('repairs')
        .select(`
            id,
            device:customer_devices!repairs_device_id_fkey(id, imei, passcode, model:models(name, brand_id))
        `)
        .limit(1);
    
    if (error) {
        console.error('Error:', error);
    } else {
        console.log(JSON.stringify(data[0], null, 2));
    }
}

run();
