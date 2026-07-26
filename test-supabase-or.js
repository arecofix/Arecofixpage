const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://xyz.supabase.co', 'xyz');
let q = supabase.from('products').select('*');
q = q.or('name.ilike.%a%');
q = q.or('name.ilike.%b%');
console.log(q.url.toString());
