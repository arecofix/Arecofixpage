async function auditMetaRequirements() {
  const supabaseUrl = 'https://jftiyfnnaogmgvksgkbn.supabase.co';
  const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpmdGl5Zm5uYW9nbWd2a3Nna2JuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE2NjQyMDgsImV4cCI6MjA2NzI0MDIwOH0.2hJUL3hRthqnOAETTlkdwdP5s39J4nwmWfaC180ixG0';

  const fetchOptions = {
    headers: {
      'apikey': supabaseKey,
      'Authorization': `Bearer ${supabaseKey}`
    }
  };

  try {
    const res = await fetch(`${supabaseUrl}/rest/v1/products?select=id,name,image_url&limit=5&is_active=eq.true&image_url=not.is.null`, fetchOptions);
    const data = await res.json();
    console.log('--- EJEMPLOS DE IMÁGENES ---');
    if (Array.isArray(data)) {
        data.forEach((p: any) => {
            console.log(`ID: ${p.id} | Name: ${p.name}`);
            console.log(`URL en DB: ${p.image_url}`);
        });
    } else {
        console.error('Data is not an array:', data);
    }
  } catch (error) {
    console.error(error);
  }
}

auditMetaRequirements();
