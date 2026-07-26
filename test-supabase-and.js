const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://xyz.supabase.co', 'xyz');
let q = supabase.from('products').select('*');
q = q.filter('and', 'eq', '(name.ilike.%a%,name.ilike.%b%)');
console.log(q.url.toString());
