import https from 'https';

const routes = [
  '/',
  '/servicios',
  '/servicios/auditoria-de-sitios-web',
  '/celular',
  '/repuestos',
  '/reserva',
  '/academy',
  '/checkout',
  '/blog',
  '/prueba-gratis'
];

const baseUrl = 'https://arecofix.com.ar';

async function fetchRoute(route) {
  const url = `${baseUrl}${route}`;
  const start = Date.now();
  return new Promise((resolve) => {
    const req = https.get(url, { rejectUnauthorized: false, timeout: 15000 }, (res) => {
      let bodyLength = 0;
      res.on('data', chunk => bodyLength += chunk.length);
      res.on('end', () => {
        const duration = Date.now() - start;
        resolve({
          route,
          url,
          statusCode: res.statusCode,
          durationMs: duration,
          bodyLength,
          location: res.headers['location'] || null
        });
      });
    });
    req.on('error', (err) => {
      resolve({
        route,
        url,
        statusCode: 'ERR: ' + err.message,
        durationMs: Date.now() - start,
        bodyLength: 0,
        location: null
      });
    });
    req.on('timeout', () => {
      req.destroy();
      resolve({
        route,
        url,
        statusCode: 'TIMEOUT',
        durationMs: Date.now() - start,
        bodyLength: 0,
        location: null
      });
    });
  });
}

async function run() {
  console.log(`=== AUDIT FASE 1.1: PUBLIC ROUTES ===`);
  const results = [];
  for (const r of routes) {
    const res = await fetchRoute(r);
    results.push(res);
    console.log(`Route: ${r.padEnd(35)} | Status: ${res.statusCode} | Time: ${res.durationMs}ms | Bytes: ${res.bodyLength}`);
  }
  console.log(JSON.stringify(results, null, 2));
}

run();
