import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

// Load environment variables if you have them, otherwise paste your anon key directly below for the script
dotenv.config();

// Configuración de Supabase
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://jftiyfnnaogmgvksgkbn.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'TU_SUPABASE_SERVICE_ROLE_KEY_AQUI';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function cleanOrders() {
    console.log("Iniciando limpieza de la tabla 'orders'...");
    const { data: orders, error } = await supabase.from('orders').select('*');
    
    if (error) {
        console.error("Error obteniendo pedidos:", error);
        return;
    }

    const updates = orders.map(order => {
        // Estructura mínima útil, omitiendo basura de heatmaps o campos no definidos en Arecofix
        const cleanOrder = {
            id: order.id,
            customer_name: order.customer_name || 'Desconocido',
            customer_email: order.customer_email || '',
            customer_phone: order.customer_phone || '',
            customer_address: order.customer_address || '',
            status: order.status || 'A_PAGAR',
            total_amount: order.total_amount || 0,
            order_number: order.order_number || '',
            created_at: order.created_at || new Date().toISOString(),
            invoiceUrl: order.invoiceUrl || null
        };
        
        return supabase.from('orders').update(cleanOrder).eq('id', order.id);
    });

    await Promise.all(updates);
    console.log(`✅ ${orders.length} pedidos limpiados exitosamente.`);
}

async function cleanTaller() {
    console.log("Iniciando limpieza de la tabla de Taller (repair_jobs / services)...");
    
    // NOTA: Reemplazar 'repair_jobs' por el nombre real de tu tabla de taller en Supabase.
    const tableName = 'repair_jobs'; 
    const { data: jobs, error } = await supabase.from(tableName).select('*').catch(() => ({ data: [], error: null }));
    
    if (error || !jobs) {
        console.warn(`No se encontró la tabla ${tableName} o hubo un error al leerla.`);
        return;
    }

    const updates = jobs.map(job => {
        const cleanJob = {
            id: job.id,
            cliente: job.cliente || job.customer_name || 'Desconocido',
            equipo: job.equipo || job.device_model || 'No especificado',
            falla: job.falla || job.issue_description || 'Sin detalles',
            imei: job.imei || null,
            estado: job.estado || job.status || 'PENDIENTE',
            fecha: job.fecha || job.created_at || new Date().toISOString()
        };
        return supabase.from(tableName).update(cleanJob).eq('id', job.id);
    });

    await Promise.all(updates);
    console.log(`✅ ${jobs.length} órdenes de taller limpiadas exitosamente.`);
}

async function runCleanup() {
    console.log("🛠️  Iniciando proceso de Normalización de Supabase...\n");
    await cleanOrders();
    await cleanTaller();
    console.log("\n🚀 Limpieza Finalizada!");
}

runCleanup();
