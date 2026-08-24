import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { PDFDocument, rgb, StandardFonts } from "https://esm.sh/pdf-lib@1.17.1";
import QRCode from "https://esm.sh/qrcode@1.5.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { courseId, studentName, studentDni, studentEmail, courseName, tenantId } = await req.json();

    if (!courseId || !studentName || !studentDni || !studentEmail || !courseName || !tenantId) {
      throw new Error('Missing required fields');
    }

    // 1. Initialize Supabase Admin client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // 2. Generate UUID for DB and a short code for the filename
    const certificateId = crypto.randomUUID();
    const shortCode = certificateId.split('-')[0];
    // DESCARGAR LA PLANTILLA DEL PDF DIRECTAMENTE DESDE STORAGE
    // El PDF es demasiado grande (14MB) para incluirlo en el código de la Edge Function.
    // Lo descargamos del bucket 'academy_certificates' en la ruta 'template/certificado.pdf'
    const verificationUrl = `https://arecofix.com.ar/academy/certificado/${certificateId}`;
    const qrBuffer = await QRCode.toBuffer(verificationUrl, { errorCorrectionLevel: 'H' });

    const { data: templateData, error: templateError } = await supabase
      .storage
      .from('academy_certificates')
      .download('template/certificado.pdf');

    if (templateError) {
      console.error('Error al descargar plantilla:', templateError);
      throw new Error('No se pudo encontrar la plantilla certificado.pdf en el storage');
    }

    const templateBytes = await templateData.arrayBuffer();
    
    // Cargar el PDF original para extraer su página
    const templateDoc = await PDFDocument.load(templateBytes);
    
    // Crear un nuevo documento A4
    const pdfDoc = await PDFDocument.create();
    const A4_WIDTH = 841.89;
    const A4_HEIGHT = 595.28;
    const page = pdfDoc.addPage([A4_WIDTH, A4_HEIGHT]);
    
    // Incrustar la página de la plantilla y dibujarla ajustada a A4
    const [embeddedTemplate] = await pdfDoc.embedPdf(templateBytes, [0]);
    page.drawPage(embeddedTemplate, {
      x: 0,
      y: 0,
      width: A4_WIDTH,
      height: A4_HEIGHT
    });
    
    const width = A4_WIDTH;
    const height = A4_HEIGHT;

    // Cargar Fuentes
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const fontItalic = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);
    const textColor = rgb(0.1, 0.1, 0.1);

    // Get certificate count for registry number
    const { count, error: countError } = await supabase
      .from('course_certificates')
      .select('*', { count: 'exact', head: true })
      .eq('tenant_id', tenantId);
      
    if (countError) throw countError;
    const currentCount = count || 0;
    const registryNumber = String(currentCount + 1).padStart(4, '0');

    // Calculate hours (default 32)
    // You can customize this per course if needed later.
    let hours = '32';
    if (courseName.toLowerCase().includes('barber')) hours = '24';
    if (courseName.toLowerCase().includes('soldadura')) hours = '20';

    // DIBUJAR LOS DATOS SOBRE LA PLANTILLA
    
    // Nombre del alumno (Centrado en la línea superior)
    const nameSize = 35;
    const nameWidth = fontBold.widthOfTextAtSize(studentName, nameSize);
    page.drawText(studentName, { 
      x: (width - nameWidth) / 2, 
      y: height * 0.58, 
      size: nameSize, 
      font: fontBold,
      color: textColor
    });

    // DNI (Sobre la línea de "con DNI _____")
    page.drawText(studentDni, { 
      x: width * 0.365,
      y: height * 0.52,
      size: 16.5,
      font: fontBold,
      color: textColor
    });

    // Nombre del Curso (Sobre la línea inferior)
    const courseSize = 23;
    const courseWidth = fontBold.widthOfTextAtSize(courseName, courseSize);
    page.drawText(courseName, { 
      x: (width - courseWidth) / 2, 
      y: height * 0.38,
      size: courseSize, 
      font: fontBold,
      color: textColor
    });
    
    // Cantidad de horas
    const hoursText = `${hours}`;
    page.drawText(hoursText, { 
      x: width * 0.57, 
      y: height * 0.31, 
      size: 16.5, 
      font: fontBold, 
      color: textColor 
    });

    // Número de Registro
    page.drawText(`${registryNumber}`, { 
      x: width * 0.14, 
      y: height * 0.05, 
      size: 13, 
      font: fontBold, 
      color: textColor 
    });
    
    // --- Fechas ---
    const hoy = new Date();
    const dia = hoy.getDate().toString().padStart(2, '0');
    const meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
    const mes = meses[hoy.getMonth()];
    const anio = hoy.getFullYear().toString();

    // Fechas
    const dateSize = 16.5;
    // Usuario pidió: "un poquitito mas hacia abajo y a la izquierda" 
    // (Y de 0.26 a 0.255, X de 0.43 a 0.425)
    page.drawText(dia, { x: width * 0.425, y: height * 0.255, size: dateSize, font: font, color: textColor });
    page.drawText(mes, { x: width * 0.515, y: height * 0.255, size: dateSize, font: font, color: textColor });
    page.drawText(anio, { x: width * 0.645, y: height * 0.255, size: dateSize, font: font, color: textColor });

    // --- QR Code ---
    const qrImage = await pdfDoc.embedPng(qrBuffer);
    // Usuario pidió: "un poquitito mas hacia arriba pero minimo" 
    // (Y de 0.18 a 0.185)
    page.drawImage(qrImage, { 
      x: width * 0.86,
      y: height * 0.185,
      width: 77,
      height: 77 
    });
    
    const pdfBytes = await pdfDoc.save();

    // 4. Upload to Storage
    const fileName = `${shortCode}.pdf`;
    
    const { error: uploadError } = await supabase
      .storage
      .from('academy_certificates')
      .upload(fileName, pdfBytes, {
        contentType: 'application/pdf',
        upsert: true
      });

    if (uploadError) throw uploadError;

    const { data: publicUrlData } = supabase
      .storage
      .from('academy_certificates')
      .getPublicUrl(fileName);

    const pdfUrl = publicUrlData.publicUrl;

    // 5. Save to database
    const { error: dbError } = await supabase
      .from('course_certificates')
      .insert({
        id: certificateId,
        course_id: courseId,
        tenant_id: tenantId,
        email: studentEmail,
        student_dni: studentDni,
        student_name: studentName,
        pdf_url: pdfUrl
      });

    if (dbError) throw dbError;

    return new Response(JSON.stringify({ success: true, certificateId, pdfUrl }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});
