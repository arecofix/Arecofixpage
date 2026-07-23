import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const WHATSAPP_FUNC_URL = `${SUPABASE_URL}/functions/v1/send-whatsapp`;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const COMPLETED_STATUSES = new Set([
  'completed', 'COMPLETADO', 'completado', 
  'paid', 'PAID', 'pagado', 'PAGADO', 
  'shipped', 'SHIPPED', 'enviado', 'ENVIADO', 
  'entregado', 'ENTREGADO'
]);

serve(async (req) => {
  try {
    const payload = await req.json();

    if (payload.type === 'UPDATE' && payload.table === 'orders') {
      const order = payload.record;
      const oldOrder = payload.old_record;

      const isNowCompleted = COMPLETED_STATUSES.has(order.status);
      const wasCompleted = COMPLETED_STATUSES.has(oldOrder?.status);

      if (isNowCompleted && !wasCompleted) {
        const orderId = order.id;

        const { data: items, error: itemsError } = await supabase
          .from('order_items')
          .select('*')
          .eq('order_id', orderId);

        if (itemsError) throw itemsError;

        // INCREMENTAR VENTAS REALES (Top Sellers)
        const productsToUpdate = (items ?? []).filter((i: any) => i.product_id != null);
        for (const item of productsToUpdate) {
            try {
                // Call RPC to increment atomically
                const { error: rpcError } = await supabase.rpc('increment_product_sales', {
                    p_product_id: item.product_id,
                    amount: item.quantity
                });
                if (rpcError) console.error(`Error incrementing sales for product ${item.product_id}:`, rpcError);
            } catch (e) {
                console.error(`Exception incrementing sales for product ${item.product_id}:`, e);
            }
        }

        const productosListStr = (items ?? [])
          .map((i: { quantity: number; product_name: string }) => `${i.quantity}x ${i.product_name}`)
          .join(', ');

        const whatsappText = `Hola ${order.customer_name}, tu pedido #${order.order_number} por ${productosListStr} ya está listo. ¡Gracias por tu compra!`;

        try {
          await fetch(WHATSAPP_FUNC_URL, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
            },
            body: JSON.stringify({
              to: order.customer_phone,
              type: 'text',
              text: { body: whatsappText },
            }),
          });
        } catch (e) {
          console.error('No se pudo enviar el WhatsApp', e);
        }

        const mockedInvoiceUrl = `https://arecofix.com/invoices/${orderId}`;

        await supabase
          .from('orders')
          .update({
            invoice_url: mockedInvoiceUrl,
            invoice_generated: true,
            updated_at: new Date().toISOString(),
          })
          .eq('id', orderId);

        return new Response(
          JSON.stringify({ success: true, message: 'Factura y WhatsApp procesados' }),
          { headers: { 'Content-Type': 'application/json' }, status: 200 }
        );
      }
    }

    return new Response(JSON.stringify({ message: 'Ignorado. No es el evento deseado.' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('Error procesando completado de pedido:', error);
    return new Response(JSON.stringify({ error: message }), {
      headers: { 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});
