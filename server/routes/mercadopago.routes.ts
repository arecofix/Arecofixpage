import { Request, Response, Router } from 'express';
import crypto from 'node:crypto';
import { environment } from '../../src/environments/environment';

export const mercadopagoRoutes = Router();

interface MpItemPayload {
  id: string;
  title: string;
  description?: string;
  picture_url?: string;
  quantity: number;
  currency_id: string;
  unit_price: number;
}

/**
 * Helper to get the active Mercado Pago access token.
 * Defaults to environment variable MP_ACCESS_TOKEN on the server.
 */
export function getMpAccessToken(): string {
  return process.env['MP_ACCESS_TOKEN'] || 
         process.env['MERCADOPAGO_ACCESS_TOKEN'] || 
         '';
}

/**
 * Helper to get the webhook secret for signature verification.
 */
export function getMpWebhookSecret(): string | undefined {
  return process.env['MP_WEBHOOK_SECRET'] || process.env['MERCADOPAGO_WEBHOOK_SECRET'];
}

/**
 * Validates Mercado Pago Webhook HMAC-SHA256 signature
 */
export function verifyMpSignature(
  xSignature: string | undefined,
  xRequestId: string | undefined,
  dataId: string | undefined,
  secret: string
): boolean {
  if (!xSignature || !xRequestId || !dataId) return false;

  const parts = xSignature.split(',').reduce<Record<string, string>>((acc, part) => {
    const [k, v] = part.split('=');
    if (k && v) acc[k.trim()] = v.trim();
    return acc;
  }, {});

  const ts = parts['ts'];
  const hash = parts['v1'];
  if (!ts || !hash) return false;

  // Manifest: id:[data.id];request-id:[x-request-id];ts:[ts];
  const manifest = `id:${dataId};request-id:${xRequestId};ts:${ts};`;
  const computedHash = crypto.createHmac('sha256', secret).update(manifest).digest('hex');

  try {
    return crypto.timingSafeEqual(Buffer.from(computedHash, 'hex'), Buffer.from(hash, 'hex'));
  } catch {
    return false;
  }
}

/**
 * POST /api/mercadopago/create-preference
 * Secure backend preference creation with full price & stock validation against DB.
 */
mercadopagoRoutes.post('/create-preference', async (req: Request, res: Response): Promise<void> => {
  const correlationId = crypto.randomUUID();
  try {
    const { orderId } = req.body;
    if (!orderId) {
      res.status(400).json({ success: false, error: 'Falta el orderId requerido.' });
      return;
    }

    const supabaseUrl = process.env['SUPABASE_URL'] || environment.supabaseUrl;
    const supabaseKey = process.env['SUPABASE_SERVICE_ROLE_KEY'] || process.env['SUPABASE_KEY'] || environment.supabaseKey;
    const fetchHeaders = {
      'apikey': supabaseKey,
      'Authorization': `Bearer ${supabaseKey}`,
      'Content-Type': 'application/json'
    };

    // 1. Fetch order and items with linked product details from database
    const orderRes = await fetch(
      `${supabaseUrl}/rest/v1/orders?id=eq.${orderId}&select=*,items:order_items(*,product:products(id,name,description,price,stock,image_url,is_active))`,
      { headers: fetchHeaders }
    );

    if (!orderRes.ok) {
      res.status(500).json({ success: false, error: 'Error al consultar la base de datos.' });
      return;
    }

    const orders = await orderRes.json();
    if (!orders || orders.length === 0) {
      res.status(404).json({ success: false, error: 'Orden no encontrada.' });
      return;
    }

    const order = orders[0];
    const orderItems = order.items || [];

    if (orderItems.length === 0) {
      res.status(400).json({ success: false, error: 'La orden no contiene productos.' });
      return;
    }

    // 2. Validate stock & verify price from DB (Price & Stock Tampering Prevention)
    const mpItems: MpItemPayload[] = [];
    let calculatedSubtotal = 0;

    for (const item of orderItems) {
      const product = item.product;
      const quantity = Math.max(1, Number(item.quantity) || 1);

      // Re-verify real DB stock
      if (product && product.stock !== undefined && product.stock !== null && product.stock < quantity) {
        res.status(400).json({
          success: false,
          error: `Stock insuficiente para "${product.name}". Disponible: ${product.stock}, solicitado: ${quantity}`
        });
        return;
      }

      // Re-verify real DB price
      const dbPrice = product && product.price !== undefined ? Number(product.price) : Number(item.unit_price);
      if (isNaN(dbPrice) || dbPrice <= 0) {
        res.status(400).json({ success: false, error: `Precio inválido para el producto ${item.product_name}` });
        return;
      }

      calculatedSubtotal += dbPrice * quantity;

      mpItems.push({
        id: String(item.product_id || product?.id || item.id),
        title: String(product?.name || item.product_name || 'Producto'),
        description: product?.description ? String(product.description).slice(0, 255) : undefined,
        picture_url: product?.image_url || undefined,
        quantity,
        currency_id: 'ARS',
        unit_price: Number(dbPrice.toFixed(2))
      });
    }

    // 3. Add shipping if applicable
    const subtotal = Number(order.subtotal) || calculatedSubtotal;
    const discount = Number(order.discount) || 0;
    const totalOrder = Number(order.total) || Number(order.total_amount) || calculatedSubtotal;
    const shippingCost = Math.max(0, totalOrder - (subtotal - discount));

    if (shippingCost > 0) {
      mpItems.push({
        id: 'shipping',
        title: 'Costo de Envío',
        quantity: 1,
        currency_id: 'ARS',
        unit_price: Number(shippingCost.toFixed(2))
      });
    }

    // 4. Adjust items if discount applies (Mercado Pago requires sum(unit_price * qty) == total)
    const itemsSum = mpItems.reduce((acc, curr) => acc + curr.unit_price * curr.quantity, 0);
    if (Math.abs(itemsSum - totalOrder) > 0.05 && discount > 0) {
      // Proportionally apply discount to product items
      const discountRatio = Math.max(0, (totalOrder - shippingCost) / calculatedSubtotal);
      for (const item of mpItems) {
        if (item.id !== 'shipping') {
          item.unit_price = Number((item.unit_price * discountRatio).toFixed(2));
        }
      }
    }

    // 5. Build payer and back URLs
    const baseUrl = process.env['BASE_URL'] || environment.baseUrl || 'https://arecofix.com.ar';
    const customerName = order.customer_name || 'Cliente';
    const nameParts = customerName.trim().split(' ');
    const firstName = nameParts[0] || 'Cliente';
    const lastName = nameParts.slice(1).join(' ') || 'Arecofix';

    const address = order.shipping_address || {};
    const payer = {
      name: firstName,
      surname: lastName,
      email: order.customer_email || 'cliente@arecofix.com.ar',
      phone: order.customer_phone ? { number: String(order.customer_phone) } : undefined,
      address: address.street ? {
        street_name: String(address.street),
        street_number: Number(address.number) || 0,
        zip_code: String(address.postal_code || '')
      } : undefined
    };

    const backUrls = {
      success: `${baseUrl}/checkout/success?order_id=${order.id}`,
      failure: `${baseUrl}/checkout/failure?order_id=${order.id}`,
      pending: `${baseUrl}/checkout/pending?order_id=${order.id}`
    };

    const notificationUrl = `${baseUrl}/api/mercadopago/webhook`;

    const mpPayload = {
      items: mpItems,
      payer,
      back_urls: backUrls,
      auto_return: 'approved',
      notification_url: notificationUrl,
      external_reference: String(order.id),
      statement_descriptor: 'ARECOFIX',
      binary_mode: false
    };

    // 6. Invoke Mercado Pago API with Idempotency Key
    const accessToken = getMpAccessToken();
    if (!accessToken) {
      console.error(`[MercadoPago][${correlationId}] MP_ACCESS_TOKEN is missing in server environment`);
      res.status(500).json({ success: false, error: 'Mercado Pago access token no está configurado en el servidor.' });
      return;
    }
    const mpRes = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'X-Idempotency-Key': String(order.id)
      },
      body: JSON.stringify(mpPayload)
    });

    const mpData = await mpRes.json();

    if (!mpRes.ok) {
      console.error(`[MercadoPago][${correlationId}] MP API Error:`, mpData);
      res.status(mpRes.status).json({ success: false, error: mpData });
      return;
    }

    // 7. Update order with preference_id in Supabase
    await fetch(`${supabaseUrl}/rest/v1/orders?id=eq.${order.id}`, {
      method: 'PATCH',
      headers: {
        ...fetchHeaders,
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify({
        preference_id: mpData.id,
        updated_at: new Date().toISOString()
      })
    });

    res.status(200).json({
      success: true,
      init_point: mpData.init_point,
      id: mpData.id,
      correlation_id: correlationId
    });

  } catch (err: unknown) {
    console.error(`[MercadoPago][${correlationId}] Unexpected error:`, err);
    res.status(500).json({
      success: false,
      error: (err as Error).message || 'Error interno al crear preferencia de Mercado Pago.'
    });
  }
});

/**
 * POST /api/mercadopago/webhook
 * Receives Webhooks / IPN from Mercado Pago with signature validation and idempotency.
 */
mercadopagoRoutes.post('/webhook', async (req: Request, res: Response): Promise<void> => {
  const correlationId = crypto.randomUUID();
  const webhookSecret = getMpWebhookSecret();

  // Extract payment/data ID
  const dataId = String(req.body?.data?.id || req.query?.['data.id'] || req.query?.['id'] || '');
  const xSignature = req.headers['x-signature'] as string | undefined;
  const xRequestId = req.headers['x-request-id'] as string | undefined;

  // 1. Signature validation (if secret is configured)
  if (webhookSecret) {
    const isValid = verifyMpSignature(xSignature, xRequestId, dataId, webhookSecret);
    if (!isValid) {
      console.warn(`[MercadoPago][Webhook][${correlationId}] Invalid HMAC signature rejected.`);
      res.status(401).send('Invalid signature');
      return;
    }
  }

  // 2. Respond 200 OK immediately to satisfy Mercado Pago SLA
  res.status(200).json({ received: true });

  // 3. Process notification asynchronously
  if (!dataId) {
    console.info(`[MercadoPago][Webhook][${correlationId}] Ping notification received without data ID.`);
    return;
  }

  // Run in background without blocking response
  setImmediate(async () => {
    try {
      await processPaymentWebhook(dataId, correlationId);
    } catch (err) {
      console.error(`[MercadoPago][Webhook][${correlationId}] Background processing error:`, err);
    }
  });
});

/**
 * Asynchronously processes and reconciles payment with Mercado Pago API and Supabase
 */
async function processPaymentWebhook(paymentId: string, correlationId: string): Promise<void> {
  const accessToken = getMpAccessToken();
  const supabaseUrl = process.env['SUPABASE_URL'] || environment.supabaseUrl;
  const supabaseKey = process.env['SUPABASE_SERVICE_ROLE_KEY'] || process.env['SUPABASE_KEY'] || environment.supabaseKey;
  const fetchHeaders = {
    'apikey': supabaseKey,
    'Authorization': `Bearer ${supabaseKey}`,
    'Content-Type': 'application/json'
  };

  // 1. Fetch real payment from Mercado Pago API
  const mpPaymentRes = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
    headers: { 'Authorization': `Bearer ${accessToken}` }
  });

  if (!mpPaymentRes.ok) {
    console.warn(`[MercadoPago][Webhook][${correlationId}] Payment ${paymentId} not found in MP API.`);
    return;
  }

  const payment = await mpPaymentRes.json();
  const orderId = payment.external_reference;

  if (!orderId) {
    console.warn(`[MercadoPago][Webhook][${correlationId}] Payment ${paymentId} has no external_reference.`);
    return;
  }

  // 2. Idempotency Check: check if already processed
  const existingPaymentRes = await fetch(
    `${supabaseUrl}/rest/v1/payments?payment_id=eq.${paymentId}&status=eq.${payment.status}&select=id`,
    { headers: fetchHeaders }
  );

  if (existingPaymentRes.ok) {
    const existing = await existingPaymentRes.json();
    if (existing && existing.length > 0) {
      console.info(`[MercadoPago][Webhook][${correlationId}] Payment ${paymentId} already processed with status ${payment.status}. Skipping.`);
      return;
    }
  }

  // 3. Fetch order from Supabase
  const orderRes = await fetch(`${supabaseUrl}/rest/v1/orders?id=eq.${orderId}&select=*`, {
    headers: fetchHeaders
  });

  if (!orderRes.ok) return;
  const orders = await orderRes.json();
  if (!orders || orders.length === 0) {
    console.warn(`[MercadoPago][Webhook][${correlationId}] Order ${orderId} does not exist in DB.`);
    return;
  }

  const order = orders[0];
  const paidAmount = Number(payment.transaction_amount) || 0;
  const expectedTotal = Number(order.total) || Number(order.total_amount) || 0;

  // 4. Verify Payment Amount against Order (Price Tampering Guard)
  if (payment.status === 'approved' && paidAmount < expectedTotal - 0.5) {
    console.error(`[MercadoPago][SECURITY_ALERT][${correlationId}] Paid amount ($${paidAmount}) is LESS than order total ($${expectedTotal}) for Order ${orderId}!`);
  }

  // 5. Upsert payment record into payments table
  await fetch(`${supabaseUrl}/rest/v1/payments`, {
    method: 'POST',
    headers: {
      ...fetchHeaders,
      'Prefer': 'resolution=merge-duplicates,return=minimal'
    },
    body: JSON.stringify({
      order_id: order.id,
      tenant_id: order.tenant_id,
      payment_id: String(payment.id),
      status: payment.status,
      status_detail: payment.status_detail || null,
      payment_type_id: payment.payment_type_id || null,
      payment_method_id: payment.payment_method_id || null,
      transaction_amount: paidAmount,
      currency_id: payment.currency_id || 'ARS',
      payer_email: payment.payer?.email || null,
      raw_payload: payment
    })
  });

  // 6. Update order status according to MP payment status
  if (payment.status === 'approved') {
    // Update order to paid
    await fetch(`${supabaseUrl}/rest/v1/orders?id=eq.${order.id}`, {
      method: 'PATCH',
      headers: { ...fetchHeaders, 'Prefer': 'return=minimal' },
      body: JSON.stringify({
        status: 'paid',
        payment_id: String(payment.id),
        updated_at: new Date().toISOString()
      })
    });

    // Check if cash movement already exists for this order
    const cashRes = await fetch(
      `${supabaseUrl}/rest/v1/cash_movements?reference_id=eq.${order.id}&select=id`,
      { headers: fetchHeaders }
    );
    const existingCash = cashRes.ok ? await cashRes.json() : [];

    if (!existingCash || existingCash.length === 0) {
      // Register cash movement (ingreso en caja)
      await fetch(`${supabaseUrl}/rest/v1/cash_movements`, {
        method: 'POST',
        headers: { ...fetchHeaders, 'Prefer': 'return=minimal' },
        body: JSON.stringify({
          tenant_id: order.tenant_id,
          branch_id: order.branch_id || undefined,
          amount: paidAmount,
          type: 'income',
          category: 'sale',
          payment_method: 'mercadopago',
          reference_id: order.id,
          notes: `Pago aprobado Mercado Pago #${payment.id}`
        })
      });
      console.info(`[MercadoPago][Webhook][${correlationId}] Cash movement registered for Order ${order.id}.`);
    }

    console.info(`[MercadoPago][Webhook][${correlationId}] Order ${order.id} marked as PAID.`);

  } else if (payment.status === 'rejected' || payment.status === 'cancelled') {
    await fetch(`${supabaseUrl}/rest/v1/orders?id=eq.${order.id}`, {
      method: 'PATCH',
      headers: { ...fetchHeaders, 'Prefer': 'return=minimal' },
      body: JSON.stringify({
        status: 'cancelled',
        updated_at: new Date().toISOString()
      })
    });
    console.info(`[MercadoPago][Webhook][${correlationId}] Order ${order.id} marked as CANCELLED.`);

  } else if (payment.status === 'refunded' || payment.status === 'charged_back') {
    await fetch(`${supabaseUrl}/rest/v1/orders?id=eq.${order.id}`, {
      method: 'PATCH',
      headers: { ...fetchHeaders, 'Prefer': 'return=minimal' },
      body: JSON.stringify({
        status: 'cancelled',
        updated_at: new Date().toISOString()
      })
    });

    // Register expense movement in cash
    await fetch(`${supabaseUrl}/rest/v1/cash_movements`, {
      method: 'POST',
      headers: { ...fetchHeaders, 'Prefer': 'return=minimal' },
      body: JSON.stringify({
        tenant_id: order.tenant_id,
        branch_id: order.branch_id || undefined,
        amount: paidAmount,
        type: 'expense',
        category: 'sale',
        payment_method: 'mercadopago',
        reference_id: order.id,
        notes: `Reembolso Mercado Pago #${payment.id}`
      })
    });
    console.info(`[MercadoPago][Webhook][${correlationId}] Refund registered for Order ${order.id}.`);
  }
}
