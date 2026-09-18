import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://db.arecofix.com.ar';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlIiwiaWF0IjoxNzg4NDUxOTI2LCJleHAiOjIxMDM4MTE5MjZ9.nZqQkOuevPpgU9Z4hOMwE5IBz1WinSKiBhcRI0fQkCs';
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
    console.log('Testing course_enrollments query for axl0749@gmail.com...');
    const { data, error } = await supabase.from('course_enrollments')
        .select(`
            *,
            course:courses(id, title, slug, image_url, short_description)
        `)
        .ilike('email', 'axl0749@gmail.com')
        .eq('status', 'confirmed');

    if (error) {
        console.error('Error in query:', error);
    } else {
        console.log(`Success! Fetched ${data.length} records.`);
        console.dir(data, { depth: null });
    }
}

run();
