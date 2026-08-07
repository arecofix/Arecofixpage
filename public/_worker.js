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
      }
      
      if (table && slug) {
      const supabaseUrl = env.SUPABASE_URL || 'https://jftiyfnnaogmgvksgkbn.supabase.co';
      const supabaseKey = env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpmdGl5Zm5uYW9nbWd2a3Nna2JuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE2NjQyMDgsImV4cCI6MjA2NzI0MDIwOH0.2hJUL3hRthqnOAETTlkdwdP5s39J4nwmWfaC180ixG0';
      
      try {
        const res = await fetch(`${supabaseUrl}/rest/v1/${table}?slug=eq.${slug}&select=*`, {
          headers: {
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`
          }
        });

        if (res.ok) {
          const data = await res.json();
          if (data && data.length > 0) {
            const item = data[0];
            
            // Format image url
            let imageUrl = item.image_url || item.thumbnail_url || '';
            if (imageUrl && !imageUrl.startsWith('http')) {
                imageUrl = `${supabaseUrl}/storage/v1/object/public/public-assets/${imageUrl}`;
            }
            if (!imageUrl) {
                imageUrl = 'https://arecofix.com.ar/assets/img/branding/og-services.png';
            }

            // Fallback description
            let description = (item.description || item.excerpt || item.meta_description || `Mira esto en Arecofix.`);
            // Extract text from description if it's html
            description = description.replace(/<[^>]*>?/gm, '').slice(0, 155) + (description.length > 155 ? '...' : '');
            description = description.replace(/"/g, '&quot;');

            let title = (item.name || item.title || item.meta_title || 'Arecofix').replace(/"/g, '&quot;');

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
