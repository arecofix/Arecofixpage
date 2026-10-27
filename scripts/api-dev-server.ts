import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { mercadopagoRoutes } from '../server/routes/mercadopago.routes';
import { academySubscriptionRoutes } from '../server/routes/academy-subscription.routes';
import { adminDashboardRoutes } from '../server/routes/admin-dashboard.routes';

const app = express();
const PORT = process.env['API_PORT'] || 4000;

app.use(cors());
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));

app.use('/api/mercadopago', mercadopagoRoutes);
app.use('/api/academy', academySubscriptionRoutes);
app.use('/api/admin/dashboard', adminDashboardRoutes);
app.use('/api/webhooks/mercadopago-academy', (req, res, next) => {
  req.url = '/webhook';
  academySubscriptionRoutes(req, res, next);
});

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'arecofix-mercadopago-api' });
});

app.listen(Number(PORT), '0.0.0.0', () => {
  console.log(`[MercadoPago Dev API] Running on http://127.0.0.1:${PORT}`);
});

