const { createClient } = require('@supabase/supabase-js');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const fetch = require('node-fetch'); // May need `npm install node-fetch@2` if not using Node 18+

// 1. CONFIGURACIÓN SUPABASE
const SUPABASE_URL = 'https://jftiyfnnaogmgvksgkbn.supabase.co';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpmdGl5Zm5uYW9nbWd2a3Nna2JuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MTY2NDIwOCwiZXhwIjoyMDY3MjQwMjA4fQ.vw_3PzcMrrp0R8KaHBYX01JyIvApeeS1Tg6MZxBZWmI'; // Using service_role key
const SUPABASE_BUCKET = 'public-assets';

// 2. CONFIGURACIÓN CLOUDFLARE R2
const R2_ACCOUNT_ID = 'd43201aa7c78ff1a8e65376a7fb6fbf3';
const R2_ACCESS_KEY = 'e4e1d420c7fd3e5ebe27dafb76500c30';
const R2_SECRET_KEY = '58771aeeb2842f87bf73f9bbcc41660f5051d7ee7b55a17853e327ffda8d8745';
const R2_BUCKET = 'arecofix-assets'; // Nombre exacto del bucket R2

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

const s3Client = new S3Client({
  region: 'auto',
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: R2_ACCESS_KEY,
    secretAccessKey: R2_SECRET_KEY,
  },
});

async function downloadFile(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
  return await response.arrayBuffer();
}

async function uploadToR2(filePath, buffer, contentType) {
  const command = new PutObjectCommand({
    Bucket: R2_BUCKET,
    Key: filePath,
    Body: Buffer.from(buffer),
    ContentType: contentType,
  });
  await s3Client.send(command);
}

async function getMimeType(filePath) {
    const ext = filePath.split('.').pop().toLowerCase();
    const mimes = {
        'png': 'image/png', 'jpg': 'image/jpeg', 'jpeg': 'image/jpeg', 
        'webp': 'image/webp', 'gif': 'image/gif', 'svg': 'image/svg+xml',
        'pdf': 'application/pdf', 'mp4': 'video/mp4'
    };
    return mimes[ext] || 'application/octet-stream';
}

async function processFolder(folderPath = '') {
  console.log(`Buscando archivos en: /${folderPath}`);
  const { data, error } = await supabase.storage.from(SUPABASE_BUCKET).list(folderPath, {
    limit: 1000,
    offset: 0,
    sortBy: { column: 'name', order: 'asc' },
  });

  if (error) {
    console.error(`Error listando carpeta ${folderPath}:`, error);
    return;
  }

  for (const item of data) {
    // Si item.id es nulo, es una subcarpeta
    if (!item.id) {
      const subfolder = folderPath ? `${folderPath}/${item.name}` : item.name;
      await processFolder(subfolder);
    } else {
      // Es un archivo
      const filePath = folderPath ? `${folderPath}/${item.name}` : item.name;
      const fileUrl = `${SUPABASE_URL}/storage/v1/object/public/${SUPABASE_BUCKET}/${filePath}`;
      
      try {
        console.log(`Descargando: ${filePath}...`);
        const buffer = await downloadFile(fileUrl);
        const mime = await getMimeType(filePath);
        
        console.log(`Subiendo a R2: ${filePath} (${mime})...`);
        await uploadToR2(filePath, buffer, mime);
        
        console.log(`✅ Migrado exitosamente: ${filePath}`);
      } catch (err) {
        console.error(`❌ Error migrando ${filePath}:`, err.message);
      }
    }
  }
}

async function main() {
  console.log('--- INICIANDO MIGRACIÓN DE SUPABASE A CLOUDFLARE R2 ---');
  await processFolder('');
  console.log('--- MIGRACIÓN COMPLETADA ---');
}

main();
