import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing SUPABASE_URL or SUPABASE_KEY");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testInsert() {
  const { data, error } = await supabase.from('repair_parts_used').insert([{
    repair_id: '31143bb6-a393-4506-b1cb-40ae239d26b2', // From user trace
    product_id: '11111111-1111-1111-1111-111111111111', // Fake UUID to trigger FK error or see if missing column
    quantity: 1,
    unit_price_at_time: 100,
    cost_at_time: 50,
    tenant_id: 'bba26ccd-59ce-471c-aac0-4c1f5513de3b' // From user trace
  }]);

  console.log('Result:', JSON.stringify(error, null, 2) || 'Success');
}

testInsert();
