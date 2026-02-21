export default `<!DOCTYPE html>
<html lang="es">

<head>
  <script>
    // Silenciar Advertencias y Errores del Pixel de Facebook
    var originalWarn = console.warn;
    var originalError = console.error;

    function filterConsoleMessages(msg) {
      if (typeof msg === 'string') {
        return msg.includes('attribution-reporting') || 
               msg.includes('browsing-topics') || 
               msg.includes('A preload for');
      }
      return false;
    }

    console.warn = function() {
      if (arguments[0] && filterConsoleMessages(arguments[0])) return;
      originalWarn.apply(console, arguments);
    };

    console.error = function() {
      if (arguments[0] && filterConsoleMessages(arguments[0])) return;
      originalError.apply(console, arguments);
    };
  </script>
  <meta charset="utf-8">
  <title>Arecofix - Servicio Técnico de Celulares y Soluciones IT</title>
  <base href="/">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="Servicio Técnico especializado en Celulares, Consultoría IT, Desarrollo Web y Inteligencia Artificial en Marcos Paz.">
  <meta name="robots" content="index, follow">
  <meta name="author" content="Arecofix">
  <meta name="theme-color" content="#1f2136">

  <!-- Open Graph / Facebook / WhatsApp Placeholders -->
  <meta property="fb:app_id" content="1209190100450173">
  <meta property="og:type" content="website">
  <meta property="og:title" content="Arecofix - Servicio Técnico de Celulares y Soluciones IT">
  <meta property="og:description" content="Reparación de Celulares en el acto, Desarrollo Web y Consultoría IT en Marcos Paz.">
  <meta property="og:image" content="assets/img/branding/og-services.jpg">
  <meta property="og:url" content="https://arecofix.com.ar">
  <meta property="og:site_name" content="Arecofix">

  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="Arecofix - Servicio Técnico">
  <meta name="twitter:description" content="Reparación de Celulares y Soluciones IT en Marcos Paz.">
  <meta name="twitter:image" content="assets/img/branding/og-services.jpg">

  <!-- Dynamic Open Graph & Twitter tags are injected by SeoService (SSR) -->

  <!-- Favicon and PWA Manifest -->
  <link rel="icon" type="image/webp" href="assets/img/brands/logo/logo-favicon.webp">
  <link rel="manifest" href="site.webmanifest">

  <!-- Preconnect to critical origins -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="">
  <link rel="preconnect" href="https://jftiyfnnaogmgvksgkbn.supabase.co">
  <!-- DNS-prefetch for deferred third-party origins -->
  <link rel="dns-prefetch" href="https://www.googletagmanager.com">

  <!-- Preload LCP image for fastest rendering -->
  <link rel="preload" href="/assets/img/services/software-illustration.webp" as="image" type="image/webp" fetchpriority="high">

  <!-- Critical fonts: only load the weights needed for initial paint -->
  <link href="https://fonts.googleapis.com/css2?family=Exo+2:wght@700;900&amp;family=Inter:wght@400;700&amp;display=swap" rel="stylesheet" media="print" onload="this.media='all'">
  <noscript>
    <link href="https://fonts.googleapis.com/css2?family=Exo+2:wght@700;900&family=Inter:wght@400;700&display=swap" rel="stylesheet">
  </noscript>

  <!-- Analytics Lazy Loader (deferred — does NOT block rendering) -->
  <script>
    (function() {
      // Fix hash routing redirection
      if (window.location.hash && window.location.hash.startsWith('#/')) {
        var newPath = window.location.hash.substring(1);
        window.history.replaceState(null, '', newPath);
      }

      // Lazy Load Analytics
      var analyticsLoaded = false;
      function loadAnalytics() {
        if (analyticsLoaded) return;
        analyticsLoaded = true;

        // Google Tag Manager
        (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','GTM-NLVCRSJR');

        // GTAG
        var gtagScript = document.createElement('script');
        gtagScript.async = true;
        gtagScript.src = 'https://www.googletagmanager.com/gtag/js?id=G-N7DQDV8MED';
        document.head.appendChild(gtagScript);

        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'G-N7DQDV8MED');

        // Meta Pixel
        !function(f,b,e,v,n,t,s)
        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s)}(window, document,'script',
        'https://connect.facebook.net/en_US/fbevents.js');
        fbq('init', '1304105440826069', { external_id: 'guest_user' });
        fbq('track', 'PageView');
      }

      // Trigger on interaction or timeout (longer delay for better FCP)
      var events = ['mousedown', 'keydown', 'touchstart', 'scroll'];
      events.forEach(function(e) { window.addEventListener(e, loadAnalytics, { once: true, passive: true }); });
      setTimeout(loadAnalytics, 8000); // Delay analytics further — FCP/LCP are more important
    })();
  </script>
<link rel="stylesheet" href="styles.css" crossorigin="anonymous"></head>

<body><script type="text/javascript" id="ng-event-dispatch-contract">(()=>{function p(t,n,r,o,e,i,f,m){return{eventType:t,event:n,targetElement:r,eic:o,timeStamp:e,eia:i,eirp:f,eiack:m}}function u(t){let n=[],r=e=>{n.push(e)};return{c:t,q:n,et:[],etc:[],d:r,h:e=>{r(p(e.type,e,e.target,t,Date.now()))}}}function s(t,n,r){for(let o=0;o<n.length;o++){let e=n[o];(r?t.etc:t.et).push(e),t.c.addEventListener(e,t.h,r)}}function c(t,n,r,o,e=window){let i=u(t);e._ejsas||(e._ejsas={}),e._ejsas[n]=i,s(i,r),s(i,o,!0)}window.__jsaction_bootstrap=c;})();
</script>
<!-- Google Tag Manager (noscript) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-NLVCRSJR"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<!-- End Google Tag Manager (noscript) -->

<!-- Meta Pixel Code (noscript) -->
<noscript><img height="1" width="1" style="display:none"
src="https://www.facebook.com/tr?id=1304105440826069&ev=PageView&noscript=1"
/></noscript>
<!-- End Meta Pixel Code (noscript) -->
  <noscript>
    <div style="text-align: center; padding: 20px;">
      <h1>Arecofix - Soluciones Informáticas</h1>
      <p>Este sitio requiere JavaScript. Servicio Tecnico de Celulares</p>
      <p>Si tenés problemas, escribinos a: <a href="mailto:info@arecofix.com.ar"
          style="color: #5bbad5;">info@arecofix.com.ar</a></p>
    </div>
  </noscript>

  <app-root></app-root>
  <!-- Analytics se carga dinámicamente sólo en producción -->
<link rel="modulepreload" href="chunk-37JUCHEQ.js"><link rel="modulepreload" href="chunk-J4UIC7XA.js"><link rel="modulepreload" href="chunk-XUAOU2YN.js"><link rel="modulepreload" href="chunk-JO5X4B25.js"><link rel="modulepreload" href="chunk-BL5IQYYM.js"><link rel="modulepreload" href="chunk-ZJZBKGOC.js"><link rel="modulepreload" href="chunk-UVURSWET.js"><link rel="modulepreload" href="chunk-65AYZUFN.js"><link rel="modulepreload" href="chunk-GR2FBAX3.js"><link rel="modulepreload" href="chunk-2N73QYS2.js"><script src="main.js" type="module" crossorigin="anonymous"></script></body>

</html>`;