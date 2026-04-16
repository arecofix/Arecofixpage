// @ts-ignore
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

declare const Deno: any;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Types & Interfaces defining the Clean Architecture Payload
interface AndreaniQuoteRequest {
  cpDestino: string;
  weight_kg?: number;
  volumen_cm3?: number;
  value_declared?: number;
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // 1. Validar el token de autorización si fuera necesario
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) throw new Error('Missing Authorization header');

    // Extraer Payload de la petición
    const payload: AndreaniQuoteRequest = await req.json();

    if (!payload.cpDestino) {
      throw new Error('Código Postal destino es requerido.');
    }

    // 2. Extraer secrets de forma segura (Nunca en JSONs de cliente)
    const ANDREANI_USER = Deno.env.get('ANDREANI_USERNAME') || '';
    const ANDREANI_PASS = Deno.env.get('ANDREANI_PASSWORD') || '';
    const ANDREANI_API_URL = Deno.env.get('ANDREANI_API_URL') || 'https://apis.andreani.com';
    const CONTRATO_ID = Deno.env.get('ANDREANI_CONTRATO') || '400006709';
    const CLIENTE_ID = Deno.env.get('ANDREANI_CLIENTE') || 'CL0003750';

    // 3. Autenticación contra Andreani (Generación de Token Bearer)
    const authResponse = await fetch(`${ANDREANI_API_URL}/login`, {
      method: 'GET',
      headers: {
         'Authorization': 'Basic ' + btoa(`${ANDREANI_USER}:${ANDREANI_PASS}`)
      }
    });

    if (!authResponse.ok) {
        throw new Error('Fallo de autenticación con proveedor logístico (Andreani)');
    }
    const token = authResponse.headers.get('x-authorization-token');

    // 4. Solicitar Cotización
    // NOTA: Se usan los endpoints oficiales v2
    const quoteUrl = `${ANDREANI_API_URL}/v1/tarifas?contrato=${CONTRATO_ID}&cliente=${CLIENTE_ID}&cpDestino=${payload.cpDestino}&bultos[0][volumen]=${payload.volumen_cm3 || 1000}&bultos[0][kilos]=${payload.weight_kg || 1}`;
    
    const quoteResponse = await fetch(quoteUrl, {
      method: 'GET',
      headers: {
        'x-authorization-token': token || ''
      }
    });
    
    if (!quoteResponse.ok) {
        const err = await quoteResponse.text();
        throw new Error(`Andreani Service Error: ${err}`);
    }

    const result = await quoteResponse.json();

    // 5. Retornar tarifas limpias al Angular Frontend
    return new Response(JSON.stringify({ 
        success: true, 
        provider: 'Andreani',
        data: result
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
    
  } catch (error: any) {
    console.error('Andreani API Error:', error);
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});
