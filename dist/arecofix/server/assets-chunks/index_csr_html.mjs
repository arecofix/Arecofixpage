export default `<!doctype html>
<html lang="es">
  <head>
    <meta charset="utf-8"/>
    <meta http-equiv="Content-Security-Policy" content="default-src 'self' https://us.posthog.com https://us.i.posthog.com https://us-assets.i.posthog.com; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://connect.facebook.net https://*.facebook.net https://*.facebook.com https://us.posthog.com https://us.i.posthog.com https://us-assets.i.posthog.com https://*.google.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: blob: https://*.supabase.co https://*.google.com https://*.google.com.ar https://*.google-analytics.com https://*.facebook.com https://*.googletagmanager.com https://tailwindcss.com https://images.unsplash.com https://www.transparenttextures.com https://ui-avatars.com https://huggingface.co https://stats.g.doubleclick.net; frame-src 'self' https://www.google.com https://www.youtube.com https://*.facebook.com; connect-src 'self' https://*.supabase.co wss://*.supabase.co https://*.google-analytics.com https://*.googletagmanager.com https://us.posthog.com https://us.i.posthog.com https://us-assets.i.posthog.com https://*.google.com https://*.facebook.com https://*.facebook.net https://huggingface.co https://ui-avatars.com https://stats.g.doubleclick.net;"/>

    <title>Soluciones Informáticas - Consultoría IT | Arecofix</title>
    <base href="/"/>
    <meta name="viewport" content="width=device-width, initial-scale=1"/>
    <meta name="description" content="Servicio Técnico especializado en Celulares, Consultoría IT, Desarrollo Web y Inteligencia Artificial en Marcos Paz."/>
    <meta name="robots" content="index, follow"/>
    <meta name="author" content="Arecofix"/>
    <meta name="theme-color" content="#1f2136"/>

    <!-- Open Graph / Facebook / WhatsApp Placeholders -->
    <meta property="fb:app_id" content="1209190100450173"/>
    <meta property="og:type" content="website"/>
    <meta property="og:title" content="Soluciones Informáticas - Consultoría IT | Arecofix"/>
    <meta property="og:description" content="Reparación de Celulares en el acto, Desarrollo Web y Consultoría IT en Marcos Paz."/>
    <meta property="og:image" content="assets/img/branding/og-services.jpg"/>
    <meta property="og:url" content="https://arecofix.com.ar"/>
    <meta property="og:site_name" content="Arecofix"/>

    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image"/>
    <meta name="twitter:title" content="Soluciones Informáticas - Consultoría IT | Arecofix"/>
    <meta name="twitter:description" content="Reparación de Celulares y Soluciones IT en Marcos Paz."/>
    <meta name="twitter:image" content="assets/img/branding/og-services.jpg"/>

    <!-- Favicon -->
    <link rel="icon" type="image/x-icon" href="assets/img/brands/logo/Logo.ico"/>
    <link rel="manifest" href="site.webmanifest"/>

    <!-- Preconnect to critical origins -->
    <link rel="preconnect" href="https://arecofix.com.ar"/>
    <link rel="preconnect" href="https://fonts.googleapis.com"/>
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin=""/>
    <link rel="preconnect" href="https://jftiyfnnaogmgvksgkbn.supabase.co"/>

    <!-- DNS-prefetch for deferred third-party origins -->
    <link rel="dns-prefetch" href="https://www.googletagmanager.com"/>

    <!-- Critical fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Exo+2:wght@700;900&amp;family=Inter:wght@400;700&amp;display=swap" rel="stylesheet" media="print" onload="this.media = 'all'"/>
    <noscript>
      <link
        href="https://fonts.googleapis.com/css2?family=Exo+2:wght@700;900&family=Inter:wght@400;700&display=swap"
        rel="stylesheet"
      />
    </noscript>

    <!-- Analytics Lazy Loader -->
    <script>
      (function () {
        if (window.location.hash && window.location.hash.startsWith("#/")) {
          var newPath = window.location.hash.substring(1);
          window.history.replaceState(null, "", newPath);
        }

        var analyticsLoaded = false;
        function loadAnalytics() {
          if (analyticsLoaded) return;
          analyticsLoaded = true;

          // Skip analytics on localhost to avoid console noise
          if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
            return;
          }

          // Google Tag Manager
          (function (w, d, s, l, i) {
            w[l] = w[l] || [];
            w[l].push({ "gtm.start": new Date().getTime(), event: "gtm.js" });
            var f = d.getElementsByTagName(s)[0],
              j = d.createElement(s),
              dl = l != "dataLayer" ? "&l=" + l : "";
            j.async = true;
            j.src = "https://www.googletagmanager.com/gtm.js?id=" + i + dl;
            f.parentNode.insertBefore(j, f);
          })(window, document, "script", "dataLayer", "GTM-NLVCRSJR");

          // GTAG
          var gtagScript = document.createElement("script");
          gtagScript.async = true;
          gtagScript.src =
            "https://www.googletagmanager.com/gtag/js?id=G-N7DQDV8MED";
          document.head.appendChild(gtagScript);

          window.dataLayer = window.dataLayer || [];
          function gtag() {
            dataLayer.push(arguments);
          }
          gtag("js", new Date());
          gtag("config", "G-N7DQDV8MED");

          // Meta Pixel with Permissions-Policy to avoid console noise
          !(function (f, b, e, v, n, t, s) {
            if (f.fbq) return;
            n = f.fbq = function () {
              n.callMethod
                ? n.callMethod.apply(n, arguments)
                : n.queue.push(arguments);
            };
            if (!f._fbq) f._fbq = n;
            n.push = n;
            n.loaded = !0;
            n.version = "2.0";
            n.queue = [];
            t = b.createElement(e);
            t.async = !0;
            t.src = v;
            s = b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t, s);
          })(
            window,
            document,
            "script",
            "https://connect.facebook.net/en_US/fbevents.js",
          );
          fbq("init", "1304105440826069");
          fbq("track", "PageView");
        }

        var events = ["mousedown", "keydown", "touchstart", "scroll"];
        events.forEach(function (e) {
          window.addEventListener(e, loadAnalytics, {
            once: true,
            passive: true,
          });
        });
        setTimeout(loadAnalytics, 8000);
      })();
    </script>
  <link rel="stylesheet" href="styles.css" crossorigin="anonymous"></head>

  <body ngcm="">
    <!-- Google Tag Manager (noscript) -->
    <noscript><iframe
        src="https://www.googletagmanager.com/ns.html?id=GTM-NLVCRSJR"
        height="0"
        width="0"
        style="display: none; visibility: hidden"
      ></iframe
    ></noscript>
    <!-- End Google Tag Manager (noscript) -->

    <!-- Meta Pixel Code (noscript) -->
    <noscript><img
        height="1"
        width="1"
        style="display: none"
        src="https://www.facebook.com/tr?id=1304105440826069&ev=PageView&noscript=1"
    /></noscript>
    <!-- End Meta Pixel Code (noscript) -->
    <noscript>
      <div style="text-align: center; padding: 20px">
        <h1>Arecofix - Soluciones Informáticas</h1>
        <p>Este sitio requiere JavaScript. Servicio Tecnico de Celulares</p>
        <p>
          Si tenés problemas, escribinos a:
          <a href="mailto:info@arecofix.com.ar" style="color: #5bbad5"
            >info@arecofix.com.ar</a
          >
        </p>
      </div>
    </noscript>

    <app-root></app-root>
    <!-- Analytics se carga dinámicamente sólo en producción -->
  <link rel="modulepreload" href="chunk-MLWSDCGA.js"><link rel="modulepreload" href="chunk-U6UXZZNZ.js"><link rel="modulepreload" href="chunk-EVQVIDWO.js"><link rel="modulepreload" href="chunk-7I3KJFJA.js"><link rel="modulepreload" href="chunk-MYSAJLFD.js"><link rel="modulepreload" href="chunk-ZJZBKGOC.js"><link rel="modulepreload" href="chunk-2PFUEYPY.js"><link rel="modulepreload" href="chunk-PD7VQIR7.js"><link rel="modulepreload" href="chunk-2WW63FQH.js"><link rel="modulepreload" href="chunk-43CFO3KR.js"><script src="main.js" type="module" crossorigin="anonymous"></script></body>
</html>
`;