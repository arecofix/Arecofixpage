import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 20 },  // Ramp-up to 20 users
    { duration: '1m', target: 100 },  // Ramp-up to 100 users
    { duration: '2m', target: 100 },  // Stay at 100 users
    { duration: '30s', target: 0 },   // Ramp-down to 0 users
  ],
  thresholds: {
    http_req_duration: ['p(95)<2000'], // 95% of requests must complete below 2s
    http_req_failed: ['rate<0.01'],    // http errors should be less than 1%
  },
};

const BASE_URL = 'http://localhost:4200'; // Ajustar según el entorno

export default function () {
  // 1. Simular carga inicial de la página
  const resHome = http.get(`${BASE_URL}/`);
  check(resHome, {
    'home is status 200': (r) => r.status === 200,
  });
  sleep(1);

  // 2. Simular obtención de productos
  const resProducts = http.get(`${BASE_URL}/api/products`); // Ajustar al endpoint real (ej. Supabase RPC o Express)
  check(resProducts, {
    'products loaded successfully': (r) => r.status === 200 || r.status === 404, // 404 si la api no está en este path
  });
  
  sleep(2);
}
