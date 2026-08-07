import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.SUPABASE_URL as string, process.env.SUPABASE_KEY as string);

async function checkTriggers() {
    const { data, error } = await supabase.rpc('run_sql', {
        query: `
            SELECT trigger_name, event_object_table, action_statement
            FROM information_schema.triggers
            WHERE event_object_table = 'repair_parts_used';
        `
    });
    console.log('Triggers:', data || error);
}

checkTriggers();
