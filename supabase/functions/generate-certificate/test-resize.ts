import { PDFDocument } from 'pdf-lib';
import fs from 'fs';

async function test() {
  const templateBytes = fs.readFileSync('C:\\Users\\ezequ\\Desktop\\Utilidades\\Trabajo\\apps\\Arecofixpage\\supabase\\functions\\generate-certificate\\certificado.pdf');
  
  const templateDoc = await PDFDocument.load(templateBytes);
  const pdfDoc = await PDFDocument.create();
  
  const [embeddedPage] = await pdfDoc.embedPages(templateDoc.getPages());
  
  const A4_WIDTH = 841.89;
  const A4_HEIGHT = 595.28;
  const page = pdfDoc.addPage([A4_WIDTH, A4_HEIGHT]);
  
  page.drawPage(embeddedPage, {
    x: 0,
    y: 0,
    width: A4_WIDTH,
    height: A4_HEIGHT,
  });
  
  const outBytes = await pdfDoc.save();
  fs.writeFileSync('C:\\Users\\ezequ\\Desktop\\Utilidades\\Trabajo\\apps\\Arecofixpage\\supabase\\functions\\generate-certificate\\test-resize.pdf', outBytes);
  console.log('Done!');
}
test().catch(console.error);
