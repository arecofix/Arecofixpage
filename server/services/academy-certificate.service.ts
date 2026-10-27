import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import QRCode from 'qrcode';
import { environment } from '../../src/environments/environment';

export interface CertificateData {
  certificateId: string;
  studentName: string;
  courseTitle: string;
  instructorName?: string;
  issuedAt?: string | Date;
  tenantId?: string;
}

/**
 * Generates an official Arecofix Academy Certificate PDF document with high-resolution layout and QR code.
 */
export async function generateCertificatePdf(data: CertificateData): Promise<Uint8Array> {
  const { certificateId, studentName, courseTitle, instructorName, issuedAt } = data;

  const baseUrl = process.env['BASE_URL'] || environment.baseUrl || 'https://arecofix.com.ar';
  const verificationUrl = `${baseUrl}/academy/verify/${certificateId}`;

  // 1. Generate QR Code pointing to public verification page
  const qrPngBuffer = await QRCode.toBuffer(verificationUrl, {
    width: 250,
    margin: 1,
    color: {
      dark: '#1e293b',
      light: '#ffffff'
    }
  });

  // 2. Create A4 Landscape PDF Document (841.89 x 595.28 points)
  const pdfDoc = await PDFDocument.create();
  const width = 841.89;
  const height = 595.28;
  const page = pdfDoc.addPage([width, height]);

  // Embed Fonts
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontOblique = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);

  // Color Palette
  const navy = rgb(0.08, 0.15, 0.28); // #142647
  const gold = rgb(0.85, 0.65, 0.13); // #D9A621
  const darkGray = rgb(0.2, 0.23, 0.28);
  const lightGray = rgb(0.96, 0.97, 0.98);
  const borderGold = rgb(0.79, 0.60, 0.16);

  // Background
  page.drawRectangle({
    x: 0,
    y: 0,
    width,
    height,
    color: lightGray
  });

  // Outer Decorative Borders
  page.drawRectangle({
    x: 20,
    y: 20,
    width: width - 40,
    height: height - 40,
    borderColor: navy,
    borderWidth: 3
  });

  page.drawRectangle({
    x: 26,
    y: 26,
    width: width - 52,
    height: height - 52,
    borderColor: borderGold,
    borderWidth: 1.5
  });

  // Header: ARECOFIX ACADEMY
  const brandTitle = 'ARECOFIX ACADEMY';
  const brandTitleSize = 26;
  const brandTitleWidth = fontBold.widthOfTextAtSize(brandTitle, brandTitleSize);
  page.drawText(brandTitle, {
    x: (width - brandTitleWidth) / 2,
    y: height - 85,
    size: brandTitleSize,
    font: fontBold,
    color: navy
  });

  // Subtitle
  const subHeader = 'CERTIFICADO OFICIAL DE APROBACIÓN Y COMPETENCIA';
  const subHeaderSize = 12;
  const subHeaderWidth = fontBold.widthOfTextAtSize(subHeader, subHeaderSize);
  page.drawText(subHeader, {
    x: (width - subHeaderWidth) / 2,
    y: height - 105,
    size: subHeaderSize,
    font: fontBold,
    color: gold
  });

  // Introductory text
  const intro = 'Se certifica por la presente que:';
  const introSize = 14;
  const introWidth = fontRegular.widthOfTextAtSize(intro, introSize);
  page.drawText(intro, {
    x: (width - introWidth) / 2,
    y: height - 160,
    size: introSize,
    font: fontRegular,
    color: darkGray
  });

  // Student Name
  const formattedStudentName = studentName.trim().toUpperCase();
  const nameSize = 30;
  const nameWidth = fontBold.widthOfTextAtSize(formattedStudentName, nameSize);
  page.drawText(formattedStudentName, {
    x: (width - nameWidth) / 2,
    y: height - 210,
    size: nameSize,
    font: fontBold,
    color: navy
  });

  // Underline for student name
  const underlinePadding = 40;
  const lineStartX = Math.max(80, (width - nameWidth) / 2 - underlinePadding);
  const lineEndX = Math.min(width - 80, (width + nameWidth) / 2 + underlinePadding);
  page.drawLine({
    start: { x: lineStartX, y: height - 220 },
    end: { x: lineEndX, y: height - 220 },
    thickness: 1.5,
    color: gold
  });

  // Completion statement
  const statement = 'ha completado y aprobado satisfactoriamente todos los módulos teóricos y prácticos de:';
  const statementSize = 13;
  const statementWidth = fontRegular.widthOfTextAtSize(statement, statementSize);
  page.drawText(statement, {
    x: (width - statementWidth) / 2,
    y: height - 260,
    size: statementSize,
    font: fontRegular,
    color: darkGray
  });

  // Course Title
  const formattedCourseTitle = courseTitle.trim();
  const courseSize = 22;
  const courseWidth = fontBold.widthOfTextAtSize(formattedCourseTitle, courseSize);
  page.drawText(formattedCourseTitle, {
    x: (width - courseWidth) / 2,
    y: height - 305,
    size: courseSize,
    font: fontBold,
    color: navy
  });

  // Issue Date formatting
  const dateObj = issuedAt ? new Date(issuedAt) : new Date();
  const formattedDate = dateObj.toLocaleDateString('es-AR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  // Embed QR Code
  const qrImage = await pdfDoc.embedPng(qrPngBuffer);
  const qrSize = 90;
  const qrX = width - 150;
  const qrY = 70;
  page.drawImage(qrImage, {
    x: qrX,
    y: qrY,
    width: qrSize,
    height: qrSize
  });

  // Text under QR
  const qrLegend = 'Escanear para verificar';
  const qrLegendSize = 8;
  const qrLegendWidth = fontRegular.widthOfTextAtSize(qrLegend, qrLegendSize);
  page.drawText(qrLegend, {
    x: qrX + (qrSize - qrLegendWidth) / 2,
    y: qrY - 12,
    size: qrLegendSize,
    font: fontRegular,
    color: darkGray
  });

  // Instructor Signature Line
  const instructor = instructorName || 'Arecofix Academy';
  const sigLineWidth = 200;
  const sigLineX = 80;
  const sigLineY = 110;

  page.drawLine({
    start: { x: sigLineX, y: sigLineY },
    end: { x: sigLineX + sigLineWidth, y: sigLineY },
    thickness: 1,
    color: darkGray
  });

  const instructorText = `${instructor}`;
  const instructorSize = 12;
  const instructorWidth = fontBold.widthOfTextAtSize(instructorText, instructorSize);
  page.drawText(instructorText, {
    x: sigLineX + (sigLineWidth - instructorWidth) / 2,
    y: sigLineY - 18,
    size: instructorSize,
    font: fontBold,
    color: navy
  });

  const roleText = 'Instructor / Dirección Académica';
  const roleSize = 9;
  const roleWidth = fontOblique.widthOfTextAtSize(roleText, roleSize);
  page.drawText(roleText, {
    x: sigLineX + (sigLineWidth - roleWidth) / 2,
    y: sigLineY - 32,
    size: roleSize,
    font: fontOblique,
    color: darkGray
  });

  // Date and Certificate ID Footer
  const dateText = `Emitido el ${formattedDate}`;
  const dateSize = 10;
  page.drawText(dateText, {
    x: 80,
    y: 50,
    size: dateSize,
    font: fontRegular,
    color: darkGray
  });

  const certIdText = `ID de Verificación: ${certificateId}`;
  const certIdSize = 9;
  page.drawText(certIdText, {
    x: (width - fontRegular.widthOfTextAtSize(certIdText, certIdSize)) / 2,
    y: 35,
    size: certIdSize,
    font: fontRegular,
    color: rgb(0.4, 0.45, 0.5)
  });

  return await pdfDoc.save();
}
