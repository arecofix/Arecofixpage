export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const userAgent = request.headers.get('user-agent') || '';
    
    // Check if the requester is a social media bot / crawler
    const isBot = /bot|facebook|twitter|whatsapp|telegram|discord|linkedin|slack/i.test(userAgent);

    if (isBot) {
      const pathParts = url.pathname.split('/').filter(p => p.trim() !== '');
      let table = null;
      let slug = null;

      if (pathParts[0] === 'productos' && pathParts[1] === 'detalle' && pathParts[2]) {
        table = 'products';
        slug = pathParts[2];
      } else if (pathParts[0] === 'posts' && pathParts[1]) {
        table = 'blog_posts';
        slug = pathParts[1];
      } else if (pathParts[0] === 'academy' && pathParts[1]) {
        table = 'courses';
        slug = pathParts[1];
      } else if (pathParts[0] === 'tracking' && pathParts[1]) {
        table = 'repairs';
        slug = pathParts[1]; // We will handle tracking_code instead of slug below
      }
      
      if (table && slug) {
      const supabaseUrl = env.SUPABASE_URL || 'https://jftiyfnnaogmgvksgkbn.supabase.co';
      const supabaseKey = env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpmdGl5Zm5uYW9nbWd2a3Nna2JuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE2NjQyMDgsImV4cCI6MjA2NzI0MDIwOH0.2hJUL3hRthqnOAETTlkdwdP5s39J4nwmWfaC180ixG0';
      
      try {
        let res;
        
        if (table === 'repairs') {
          // Use RPC for tracking to bypass RLS policies
          res = await fetch(`${supabaseUrl}/rest/v1/rpc/get_repair_tracking`, {
            method: 'POST',
            headers: {
              'apikey': supabaseKey,
              'Authorization': `Bearer ${supabaseKey}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ p_code: slug })
          });
        } else {
          res = await fetch(`${supabaseUrl}/rest/v1/${table}?slug=eq.${slug}&select=*`, {
            headers: {
              'apikey': supabaseKey,
              'Authorization': `Bearer ${supabaseKey}`
            }
          });
        }

        if (res.ok) {
          let data = await res.json();
          // RPC might return a single object or an array. Standardize to array.
          if (data && !Array.isArray(data)) {
            data = [data];
          }

          if (data && data.length > 0) {
            const item = data[0];
            
            let imageUrl = '';
            let description = '';
            let title = '';

            if (table === 'repairs') {
              // SEO Logic for Tracking
              const deviceName = item.device_model || item.device?.model?.name || 'Reparación';
              title = `Seguimiento de Equipo: ${deviceName} - Orden #${item.repair_number || item.tracking_code || slug}`;
              
              const statusMap = { 1: 'Diagnóstico en Curso', 2: 'Esperando Repuestos', 3: 'En Reparación', 4: 'Control de Calidad', 5: 'Listo para Retirar', 6: 'Entregado', 7: 'Cancelado' };
              const statusName = statusMap[item.current_status_id] || 'En Proceso';
              
              const clientName = item.client ? `${item.client.first_name || ''} ${item.client.last_name || ''}`.trim() : 'Arecofix';
              
              description = `Estado: ${statusName} | Cliente: ${clientName}. Hacé clic para ver los detalles en tiempo real.`;
              
              if (item.images && item.images.length > 0) {
                const firstImg = item.images[0]?.image_url || item.images[0];
                imageUrl = (firstImg && !firstImg.startsWith('http') && !firstImg.startsWith('assets/')) 
                  ? `${supabaseUrl}/storage/v1/object/public/repair-images/${firstImg}` 
                  : (firstImg || '');
              }
              if (!imageUrl) imageUrl = 'https://arecofix.com.ar/assets/img/branding/og-tracking.png';
            } else {
              // SEO Logic for Products, Posts, Courses
              imageUrl = item.image_url || item.thumbnail_url || '';
              if (imageUrl && !imageUrl.startsWith('http')) {
                  imageUrl = `${supabaseUrl}/storage/v1/object/public/public-assets/${imageUrl}`;
              }
              if (!imageUrl) {
                  imageUrl = 'https://arecofix.com.ar/assets/img/branding/og-services.png';
              }

              // Fallback description
              description = (item.description || item.excerpt || item.meta_description || `Mira esto en Arecofix.`);
              // Extract text from description if it's html
              description = description.replace(/<[^>]*>?/gm, '').slice(0, 155) + (description.length > 155 ? '...' : '');
              description = description.replace(/"/g, '&quot;');

              title = (item.name || item.title || item.meta_title || 'Arecofix').replace(/"/g, '&quot;');
            }

            // Fetch the static HTML from Cloudflare Pages
            const response = await env.ASSETS.fetch(request);
            let html = await response.text();

            // Inject the dynamic SEO tags
            html = html.replace(/<title>.*?<\/title>/i, `<title>${title} | Arecofix</title>`);
            html = html.replace(/<meta property="og:title" content="[^"]*"\s*\/?>/i, `<meta property="og:title" content="${title}" />`);
            html = html.replace(/<meta property="og:description" content="[^"]*"\s*\/?>/i, `<meta property="og:description" content="${description}" />`);
            html = html.replace(/<meta property="og:image" content="[^"]*"\s*\/?>/i, `<meta property="og:image" content="${imageUrl}" />`);
            html = html.replace(/<meta property="og:url" content="[^"]*"\s*\/?>/i, `<meta property="og:url" content="${request.url}" />`);
            
            // Also update twitter cards
            html = html.replace(/<meta name="twitter:title" content="[^"]*"\s*\/?>/i, `<meta name="twitter:title" content="${title}" />`);
            html = html.replace(/<meta name="twitter:description" content="[^"]*"\s*\/?>/i, `<meta name="twitter:description" content="${description}" />`);
            html = html.replace(/<meta name="twitter:image" content="[^"]*"\s*\/?>/i, `<meta name="twitter:image" content="${imageUrl}" />`);

            return new Response(html, {
              headers: { 'Content-Type': 'text/html;charset=UTF-8' }
            });
          }
        }
      } catch (err) {
        // Fallback to static assets if Supabase fetch fails
      }
    }
    }
    
    // For non-bots or non-product routes, serve the static assets normally
    return env.ASSETS.fetch(request);
  }
};
