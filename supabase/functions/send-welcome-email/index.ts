// @ts-nocheck
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

serve(async (req: Request) => {
  try {
    // Verificar si es una petición POST
    if (req.method !== 'POST') {
      return new Response('Method Not Allowed', { status: 405 });
    }

    // El payload que envía el trigger de base de datos de Supabase
    const payload = await req.json();
    
    // Obtener los datos del nuevo usuario insertado (record)
    const user = payload.record;
    
    if (!user || !user.email) {
      return new Response(JSON.stringify({ error: "No email provided" }), { status: 400 });
    }

    // Nombre por defecto o metadata
    const name = user.raw_user_meta_data?.full_name || user.raw_user_meta_data?.name || 'Nuevo Usuario';

    if (!RESEND_API_KEY) {
      console.warn("RESEND_API_KEY is not set. Simulating email send for:", user.email);
      return new Response(JSON.stringify({ success: true, simulated: true }), { status: 200 });
    }

    // Enviar el correo usando Resend API
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Arecofix Academy <hola@arecofix.com.ar>", // CAMBIAR AL DOMINIO VERIFICADO EN RESEND
        to: [user.email],
        subject: "¡Bienvenido a Arecofix!",
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
            <h1 style="color: #2563eb;">¡Hola ${name}!</h1>
            <p>Queremos darte la bienvenida oficial a la plataforma de <strong>Arecofix</strong>.</p>
            <p>Ya puedes explorar nuestros recursos, cursos en Arecofix Academy y la tienda oficial.</p>
            <p>Si tienes alguna consulta, no dudes en contactarnos.</p>
            <br/>
            <p>Saludos,</p>
            <p><strong>El equipo de Arecofix</strong></p>
          </div>
        `,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(JSON.stringify(data));
    }

    return new Response(JSON.stringify({ success: true, data }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error: any) {
    console.error("Error sending email:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { "Content-Type": "application/json" },
      status: 500,
    });
  }
});
