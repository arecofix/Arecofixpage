import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import fs from 'fs';

async function createTestPdf() {
  const templateBytes = fs.readFileSync('C:\\Users\\ezequ\\Desktop\\Utilidades\\Trabajo\\apps\\Arecofixpage\\supabase\\functions\\generate-certificate\\certificado-listop.jpg');
  const pdfDoc = await PDFDocument.create();
  const image = await pdfDoc.embedJpg(templateBytes);
  
  const A4_WIDTH = 841.89;
  const A4_HEIGHT = 595.28;
  const page = pdfDoc.addPage([A4_WIDTH, A4_HEIGHT]);
  
  page.drawImage(image, { x: 0, y: 0, width: A4_WIDTH, height: A4_HEIGHT });
  
  const width = A4_WIDTH;
  const height = A4_HEIGHT;
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const textColor = rgb(0.1, 0.1, 0.1);
  
  const studentName = 'Perez, Juan Carlos';
  const nameSize = 35;
  const nameWidth = fontBold.widthOfTextAtSize(studentName, nameSize);
  page.drawText(studentName, { x: (width - nameWidth) / 2, y: height * 0.55, size: nameSize, font: fontBold, color: textColor });
  
  const studentDni = '12.345.678';
  page.drawText(studentDni, { x: width * 0.245, y: height * 0.47, size: 16.5, font: fontBold, color: textColor });
  
  const courseName = 'Reparación de Celulares y Tablets';
  const courseSize = 23;
  const courseWidth = fontBold.widthOfTextAtSize(courseName, courseSize);
  page.drawText(courseName, { x: (width - courseWidth) / 2, y: height * 0.40, size: courseSize, font: fontBold, color: textColor });
  
  page.drawText('23', { x: width * 0.44, y: height * 0.27, size: 16.5, font: font, color: textColor });
  page.drawText('Agosto', { x: width * 0.52, y: height * 0.27, size: 16.5, font: font, color: textColor });
  page.drawText('2026', { x: width * 0.63, y: height * 0.27, size: 16.5, font: font, color: textColor });
  
  // Custom additions
  page.drawText('Carga horaria: 32 horas reloj', { x: width * 0.40, y: height * 0.35, size: 14, font: font, color: textColor });
  page.drawText('Registro Nº: 0042', { x: width * 0.08, y: height * 0.90, size: 14, font: fontBold, color: textColor });
  
  const pdfBytes = await pdfDoc.save();
  fs.writeFileSync('C:\\Users\\ezequ\\Desktop\\Utilidades\\Trabajo\\apps\\Arecofixpage\\supabase\\functions\\generate-certificate\\test-output.pdf', pdfBytes);
}

createTestPdf().catch(console.error);
