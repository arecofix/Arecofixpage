export async function onRequest(context) {
  const { request, env, params } = context;
  const userAgent = request.headers.get('User-Agent') || '';

  // 1. Detect social bots
  const botPattern = /WhatsApp|facebookexternalhit|Twitterbot|LinkedInBot|Slackbot|TelegramBot|Pinterest|Discordbot/i;
  const isBot = botPattern.test(userAgent);

  // 2. If it's NOT a bot, pass the request to the normal Angular app
  if (!isBot) {
    return env.ASSETS.fetch(request);
  }

  // 3. It's a bot! Intercept and build the dynamic SEO tags
  const code = params.code;
  const SUPABASE_URL = "https://jftiyfnnaogmgvksgkbn.supabase.co";
  // Public Anon Key from environment.ts
  const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpmdGl5Zm5uYW9nbWd2a3Nna2JuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE2NjQyMDgsImV4cCI6MjA2NzI0MDIwOH0.2hJUL3hRthqnOAETTlkdwdP5s39J4nwmWfaC180ixG0";

  try {
    // Fetch repair from Supabase
    const response = await fetch(`${SUPABASE_URL}/rest/v1/repairs?tracking_code=eq.${code}&select=*`, {
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
      }
    });

    const data = await response.json();
    const repair = data && data.length > 0 ? data[0] : null;

    let title = 'Arecofix - Seguimiento de Reparación';
    let description = 'Ingresá tu código para ver el estado en tiempo real de tu equipo.';
    let imageUrl = 'https://arecofix.com.ar/assets/img/branding/og-tracking.png';
    const currentUrl = `https://arecofix.com.ar/tracking/${code}`;

    if (repair) {
      title = `Seguimiento de Equipo: ${repair.device_model} - Orden #${repair.repair_number || code}`;
      
      const statusId = repair.current_status_id;
      const statusMap = {
        1: 'Diagnóstico en Curso',
        2: 'Esperando Repuestos',
        3: 'En Reparación',
        4: 'Control de Calidad',
        5: 'Listo para Retirar',
        6: 'Entregado',
        7: 'Cancelado'
      };
      const statusName = statusMap[statusId] || 'En Proceso';
      
      description = `Estado: ${statusName} | Cliente: ${repair.customer_name || 'Arecofix'}. Hacé clic para ver los detalles en tiempo real.`;
      
      if (repair.images && repair.images.length > 0) {
        const firstImg = repair.images[0];
        if (firstImg && !firstImg.startsWith('http') && !firstImg.startsWith('assets/')) {
            imageUrl = `${SUPABASE_URL}/storage/v1/object/public/repair-images/${firstImg}`;
        } else if (firstImg) {
            imageUrl = firstImg;
        }
      }
    }

    // Build standard OpenGraph HTML
    const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <title>${title}</title>
  <meta name="description" content="${description}">
  <link rel="canonical" href="${currentUrl}">
  
  <!-- Open Graph / Facebook / WhatsApp -->
  <meta property="og:type" content="website">
  <meta property="og:url" content="${currentUrl}">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${description}">
  <meta property="og:image" content="${imageUrl}">
  <meta property="og:site_name" content="Arecofix">
  
  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:url" content="${currentUrl}">
  <meta name="twitter:title" content="${title}">
  <meta name="twitter:description" content="${description}">
  <meta name="twitter:image" content="${imageUrl}">
</head>
<body>
  <script>
    // Fallback redirect if a real user somehow gets here
    window.location.replace("${currentUrl}");
  </script>
</body>
</html>`;

    return new Response(html, {
      headers: { 'content-type': 'text/html;charset=UTF-8' },
    });

  } catch (e) {
    // Fallback on error: send to Angular app
    return env.ASSETS.fetch(request);
  }
}
