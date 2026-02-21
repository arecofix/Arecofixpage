import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
// import { PDFDocument, rgb } from 'https://cdn.skypack.dev/pdf-lib'; // Requires pdf-lib (mocked generation here)

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const WHATSAPP_FUNC_URL = `${SUPABASE_URL}/functions/v1/send-whatsapp`;

// Supabase Client con Role de Servicio
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

serve(async (req) => {
  try {
    const payload = await req.json();

    // Verificamos si es un UPDATE en la tabla 'orders'
    if (payload.type === 'UPDATE' && payload.table === 'orders') {
      const order = payload.record;
      const oldOrder = payload.old_record;

      // Solo si el estado pasó a 'COMPLETADO'
      if (order.status === 'COMPLETADO' && oldOrder.status !== 'COMPLETADO') {
        const orderId = order.id;

        // 1. Obtener los ítems del pedido para la lista
        const { data: items, error: itemsError } = await supabase
          .from('order_items')
          .select('*')
          .eq('order_id', orderId);

        if (itemsError) throw itemsError;

        // 2. Acción A: Mensaje WhatsApp
        const productosListStr = items.map((i: any) => `${i.quantity}x ${i.product_name}`).join(', ');
        const whatsappText = `Hola ${order.customer_name}, tu pedido #${order.order_number} por ${productosListStr} ya está listo. ¡Gracias por tu compra!`;
        
        console.log(`Enviando WhatsApp a ${order.customer_phone}: ${whatsappText}`);
        
        try {
          // Requiere configuración del header HTTP Authorization
          await fetch(WHATSAPP_FUNC_URL, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`
            },
            body: JSON.stringify({
              to: order.customer_phone,
              type: 'text',
              text: {
                body: whatsappText
              }
            })
          });
        } catch (e) {
          console.error("No se pudo enviar el WhatsApp", e);
        }

        // 3. Acción B: Generación de Factura Digital (Mock: generaría un PDF o HTML y guardaría el URL)
        // Ejemplo simplificado usando data generada:
        const invoiceHtml = `
          <h1>Factura Arecofix</h1>
          <p>Cliente: ${order.customer_name} (${order.customer_email})</p>
          <p>Pedido #${order.order_number}</p>
          <p>Fecha: ${new Date().toISOString()}</p>
          <ul>
            ${items.map((i: any) => `<li>${i.quantity} x ${i.product_name} - Subtotal: $${i.subtotal}</li>`).join('')}
          </ul>
          <h3>Total Final: $${order.total_amount}</h3>
        `;

        console.log('Factura HTML generada: ', invoiceHtml);
        
        // En la vida real, acá subimos el PDF a Supabase Storage:
        // const pdfBytes = await generatePdf(invoiceHtml);
        // await supabase.storage.from('invoices').upload(`invoice_${orderId}.pdf`, pdfBytes);
        const mockedInvoiceUrl = `https://arecofix.com/invoices/${orderId}`; 

        await supabase
          .from('orders')
          .update({ invoiceUrl: mockedInvoiceUrl })
          .eq('id', orderId);

        return new Response(JSON.stringify({ success: true, message: 'Factura y WhatsApp procesados' }), {
          headers: { 'Content-Type': 'application/json' },
          status: 200,
        });
      }
    }

    return new Response(JSON.stringify({ message: 'Ignorado. No es el evento deseado.' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error: any) {
    console.error('Error procesando completado de pedido:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});
