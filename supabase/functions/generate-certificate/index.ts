import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { PDFDocument, rgb, StandardFonts } from "https://esm.sh/pdf-lib@1.17.1";
import QRCode from "https://esm.sh/qrcode@1.5.3";
import { templateBase64 } from "./template.ts";

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
    const verificationUrl = `https://arecofix.com.ar/academy/certificado/${certificateId}`;
    const qrBuffer = await QRCode.toBuffer(verificationUrl, { errorCorrectionLevel: 'H' });

    // Cargar la imagen JPG original (Base64) de forma segura en Edge
    const byteString = atob(templateBase64);
    const templateBytes = new Uint8Array(byteString.length);
    for (let i = 0; i < byteString.length; i++) {
      templateBytes[i] = byteString.charCodeAt(i);
    }
    
    const pdfDoc = await PDFDocument.create();
    const image = await pdfDoc.embedJpg(templateBytes);
    
    // Configurar la página como A4 horizontal estándar para evitar recortes al imprimir
    const A4_WIDTH = 841.89;
    const A4_HEIGHT = 595.28;
    const page = pdfDoc.addPage([A4_WIDTH, A4_HEIGHT]);
    
    // Dibujar el fondo ajustado exactamente a A4
    page.drawImage(image, { x: 0, y: 0, width: A4_WIDTH, height: A4_HEIGHT });

    const width = A4_WIDTH;
    const height = A4_HEIGHT;

    // Cargar Fuentes
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const fontItalic = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);
    const textColor = rgb(0.1, 0.1, 0.1);

    // DIBUJAR LOS DATOS SOBRE LA PLANTILLA (coordenadas adaptadas)
    // Se ha escalado la tipografía (x0.822) para compensar el paso de 1024x725 a A4 (842x595)
    
    // Nombre del alumno (Centrado en la línea superior)
    const nameSize = 35; // Escalado de 42
    const nameWidth = fontBold.widthOfTextAtSize(studentName, nameSize);
    page.drawText(studentName, { 
      x: (width - nameWidth) / 2, 
      y: height * 0.55,
      size: nameSize, 
      font: fontBold,
      color: textColor
    });

    // DNI (Sobre la línea de "con DNI _____")
    page.drawText(studentDni, { 
      x: width * 0.245,
      y: height * 0.47,
      size: 16.5, // Escalado de 20
      font: fontBold,
      color: textColor
    });

    // Nombre del Curso (Sobre la línea inferior)
    const courseSize = 23; // Escalado de 28
    const courseWidth = fontBold.widthOfTextAtSize(courseName, courseSize);
    page.drawText(courseName, { 
      x: (width - courseWidth) / 2, 
      y: height * 0.40,
      size: courseSize, 
      font: fontBold,
      color: textColor
    });
    
    // --- Fechas ---
    const hoy = new Date();
    const dia = hoy.getDate().toString().padStart(2, '0');
    const meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
    const mes = meses[hoy.getMonth()];
    const anio = hoy.getFullYear().toString();

    // Fechas con tipografía escalada
    const dateSize = 16.5; // Escalado de 20
    // Dia
    page.drawText(dia, { x: width * 0.44, y: height * 0.27, size: dateSize, font: font, color: textColor });
    // Mes
    page.drawText(mes, { x: width * 0.52, y: height * 0.27, size: dateSize, font: font, color: textColor });
    // Año
    page.drawText(anio, { x: width * 0.63, y: height * 0.27, size: dateSize, font: font, color: textColor });

    // --- QR Code ---
    const qrImage = await pdfDoc.embedPng(qrBuffer);
    page.drawImage(qrImage, { 
      x: width * 0.86,
      y: height * 0.235,
      width: 90, // Escalado de 110
      height: 90 
    });
    
    const pdfBytes = await pdfDoc.save();

    // 4. Upload to Storage
    // Hacemos el filename mucho más corto: "8caracteres.pdf" en lugar de uno gigante.
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
