import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
    console.log('Testing getAdminList query...');
    const { data, error } = await supabase.from('repairs')
        .select(`
            *,
            client:profiles!repairs_client_id_fkey(id, first_name, last_name, phone),
            assigned_technician:profiles!repairs_assigned_technician_id_fkey(id, first_name, last_name),
            status:repair_status_types(id, name, color, icon),
            device:customer_devices!device_id(id, type, imei, passcode, model:models(name, brand_id))
        `)
        .range(0, 10)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error in query:', error);
    } else {
        console.log(`Success! Fetched ${data.length} records.`);
    }
}

run();
