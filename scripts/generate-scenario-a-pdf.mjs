import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import QRCode from 'qrcode';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';

// Asegurar directorio de salida
const outputDir = join(process.cwd(), 'docs', 'facturas_auditoria');
if (!existsSync(outputDir)) {
  mkdirSync(outputDir, { recursive: true });
}

async function generateA4Invoice() {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = 210;
  const marginLeft = 14;
  const marginRight = 14;
  const marginTop = 12;
  const contentWidth = pageWidth - marginLeft - marginRight;

  // 1. Banner de Homologación / Simulado
  doc.setFillColor(171, 73, 72); // #AB4948 Rojo error oficial Arecofix
  doc.rect(marginLeft, marginTop - 5, contentWidth, 5, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(255, 255, 255);
  doc.text('DOCUMENTO NO FISCAL — CAE SIMULADO EN HOMOLOGACIÓN / STAGING — NO VÁLIDO COMO FACTURA', marginLeft + contentWidth / 2, marginTop - 1.5, { align: 'center' });

  // 1. Marco exterior
  doc.setDrawColor(60, 60, 60);
  doc.setLineWidth(0.4);
  doc.rect(marginLeft, marginTop, contentWidth, 48);

  // Recuadro central de Letra B
  const boxW = 16;
  const boxH = 16;
  const boxX = marginLeft + contentWidth / 2 - boxW / 2;
  const boxY = marginTop;
  doc.setFillColor(255, 255, 255);
  doc.rect(boxX, boxY, boxW, boxH, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(24);
  doc.setTextColor(30, 30, 30);
  doc.text('B', boxX + boxW / 2, boxY + 11, { align: 'center' });

  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.text('COD. 006', boxX + boxW / 2, boxY + 15, { align: 'center' });

  // Línea vertical que divide emisor de datos de factura
  doc.line(boxX + boxW / 2, marginTop + boxH, boxX + boxW / 2, marginTop + 48);

  // 2. Columna Izquierda: Emisor
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('ARECOFIX SERVICES S.A.S.', marginLeft + 4, marginTop + 12);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(60, 60, 60);
  doc.text('Soluciones Integrales de Taller y Electrónica', marginLeft + 4, marginTop + 18);
  doc.text('Av. San Martín 450, San Antonio de Areco', marginLeft + 4, marginTop + 23);
  doc.text('IVA Responsable Inscripto', marginLeft + 4, marginTop + 28);
  doc.text('contacto@arecofix.com.ar | Tel: (02326) 45-1234', marginLeft + 4, marginTop + 33);

  // 3. Columna Derecha: Datos de Factura
  const rightColX = boxX + boxW / 2 + 6;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(30, 30, 30);
  doc.text('FACTURA B', rightColX, marginTop + 12);

  doc.setFontSize(10);
  doc.text('N° 0004-00000101', rightColX, marginTop + 18);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.text('Fecha de Emisión: 27/10/2026', rightColX, marginTop + 24);
  doc.text('CUIT: 30-71649201-9', rightColX, marginTop + 29);
  doc.text('Ingresos Brutos: 30-71649201-9 (Convenio Multilateral)', rightColX, marginTop + 34);
  doc.text('Inicio de Actividades: 01/03/2024', rightColX, marginTop + 39);

  // 4. Datos del Cliente y Equipo
  const clientBoxY = marginTop + 52;
  doc.rect(marginLeft, clientBoxY, contentWidth, 24);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text('Cliente: ', marginLeft + 4, clientBoxY + 6);
  doc.setFont('helvetica', 'normal');
  doc.text('Juan Pérez', marginLeft + 20, clientBoxY + 6);

  doc.setFont('helvetica', 'bold');
  doc.text('DNI / CUIT: ', marginLeft + 80, clientBoxY + 6);
  doc.setFont('helvetica', 'normal');
  doc.text('35.987.654 (CUIT 20-35987654-3)', marginLeft + 102, clientBoxY + 6);

  doc.setFont('helvetica', 'bold');
  doc.text('Condición IVA: ', marginLeft + 4, clientBoxY + 12);
  doc.setFont('helvetica', 'normal');
  doc.text('Consumidor Final', marginLeft + 30, clientBoxY + 12);

  doc.setFont('helvetica', 'bold');
  doc.text('Condición de Venta: ', marginLeft + 90, clientBoxY + 12);
  doc.setFont('helvetica', 'normal');
  doc.text('Contado / Efectivo Mostrador', marginLeft + 122, clientBoxY + 12);

  // Datos específicos del taller
  doc.setFont('helvetica', 'bold');
  doc.text('Orden de Taller: ', marginLeft + 4, clientBoxY + 18);
  doc.setFont('helvetica', 'normal');
  doc.text('AF-2026-101 (Nº Int: 101)', marginLeft + 30, clientBoxY + 18);

  doc.setFont('helvetica', 'bold');
  doc.text('Vehículo / Equipo: ', marginLeft + 90, clientBoxY + 18);
  doc.setFont('helvetica', 'normal');
  doc.text('Moto Honda XR 250 Tornado (Patente A123BCD)', marginLeft + 122, clientBoxY + 18);

  // 5. Tabla de Ítems
  const tableData = [
    ['1', 'LAB-01', 'Mano de Obra Especializada - Taller (Mantenimiento Integral)', '1,00', 'u', '4.500,00', '0,00', '4.500,00'],
    ['2', 'FILT-001', 'Filtro de Aceite Original Honda XR 250 (OEM)', '1,00', 'u', '3.200,00', '0,00', '3.200,00']
  ];

  autoTable(doc, {
    startY: clientBoxY + 28,
    margin: { left: marginLeft, right: marginRight },
    head: [['#', 'Código', 'Descripción del Producto / Servicio', 'Cant.', 'U.M.', 'Precio Unit.', 'Bonif.', 'Subtotal']],
    body: tableData,
    theme: 'grid',
    headStyles: {
      fillColor: [24, 54, 22], // #183616 Superficie oficial Arecofix
      textColor: [255, 255, 255],
      fontSize: 8,
      fontStyle: 'bold',
      halign: 'center'
    },
    columnStyles: {
      0: { cellWidth: 8, halign: 'center' },
      1: { cellWidth: 20 },
      2: { cellWidth: 84 },
      3: { cellWidth: 14, halign: 'right' },
      4: { cellWidth: 12, halign: 'center' },
      5: { cellWidth: 22, halign: 'right' },
      6: { cellWidth: 12, halign: 'right' },
      7: { cellWidth: 24, halign: 'right' }
    },
    styles: {
      fontSize: 8,
      cellPadding: 2.5
    }
  });

  const finalY = doc.lastAutoTable.finalY + 4;

  // 6. Cuadro de Totales y Desglose Contable
  const totalsBoxX = marginLeft + contentWidth - 85;
  doc.rect(totalsBoxX, finalY, 85, 34);

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.text('Subtotal:', totalsBoxX + 4, finalY + 6);
  doc.text('$ 7.700,00', totalsBoxX + 81, finalY + 6, { align: 'right' });

  doc.setFont('helvetica', 'bold');
  doc.text('TOTAL FACTURADO:', totalsBoxX + 4, finalY + 13);
  doc.text('$ 7.700,00', totalsBoxX + 81, finalY + 13, { align: 'right' });

  doc.setFont('helvetica', 'normal');
  doc.text('(-) Seña / Anticipo Previo:', totalsBoxX + 4, finalY + 20);
  doc.text('-$ 2.000,00', totalsBoxX + 81, finalY + 20, { align: 'right' });

  doc.line(totalsBoxX, finalY + 23, totalsBoxX + 85, finalY + 23);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(76, 170, 71); // #4CAA47 Primario oficial Arecofix
  doc.text('SALDO PENDIENTE (A COBRAR):', totalsBoxX + 4, finalY + 29);
  doc.text('$ 5.700,00', totalsBoxX + 81, finalY + 29, { align: 'right' });
  doc.setTextColor(30, 30, 30);

  // Leyenda de Factura B (Sin IVA discriminado por ley)
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(8);
  doc.setTextColor(90, 90, 90);
  doc.text('Régimen de Factura B a Consumidor Final: El IVA se encuentra incluido en el precio final.', marginLeft + 4, finalY + 8);
  doc.text('Comprobante autorizado por ARCA / AFIP conforme RG 1415 y modif.', marginLeft + 4, finalY + 13);
  doc.text('Anticipo de $2.000,00 imputado mediante Recibo de Taller Nº RC-0001-00000482.', marginLeft + 4, finalY + 18);

  // 7. Pie de Factura con QR AFIP y CAE
  const footerY = 245;
  doc.rect(marginLeft, footerY, contentWidth, 38);

  // Generar QR oficial ARCA
  const qrData = {
    ver: 1,
    fecha: "2026-10-27",
    cuit: 30716492019,
    ptoVta: 4,
    tipoCmp: 6, // Factura B
    nroCmp: 101,
    importe: 7700.00,
    moneda: "PES",
    ctz: 1,
    tipoDocRec: 96,
    nroDocRec: 32405918,
    tipoCodAut: "E",
    codAut: 74102983419012
  };
  const qrBase64 = Buffer.from(JSON.stringify(qrData)).toString('base64');
  const qrUrl = `https://www.afip.gob.ar/fe/qr/?p=${qrBase64}`;
  const qrImage = await QRCode.toDataURL(qrUrl, { margin: 1, width: 140 });

  doc.addImage(qrImage, 'PNG', marginLeft + 4, footerY + 3, 32, 32);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('ARCA / AFIP — Comprobante Electrónico', marginLeft + 42, footerY + 10);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('CAE Nº: ', marginLeft + 42, footerY + 18);
  doc.setFont('helvetica', 'normal');
  doc.text('74102983419012', marginLeft + 60, footerY + 18);

  doc.setFont('helvetica', 'bold');
  doc.text('Fecha Vto. CAE: ', marginLeft + 42, footerY + 24);
  doc.setFont('helvetica', 'normal');
  doc.text('06/11/2026', marginLeft + 72, footerY + 24);

  doc.setFontSize(7.5);
  doc.setTextColor(100, 100, 100);
  doc.text('Código de Verificación QR Oficial RG 4892/2020:', marginLeft + 42, footerY + 30);
  doc.text(qrUrl.substring(0, 75) + '...', marginLeft + 42, footerY + 34);

  const pdfPath = join(outputDir, 'factura_af_2026_101_a4.pdf');
  const buffer = Buffer.from(doc.output('arraybuffer'));
  writeFileSync(pdfPath, buffer);
  console.log('Factura A4 generada exitosamente en:', pdfPath);
}

async function generate80mmTicket() {
  // Ticket de 80mm de ancho x 190mm de alto
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: [80, 190]
  });

  const margin = 4;
  const contentWidth = 72;
  let y = 8;

  doc.setFont('courier', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(171, 73, 72);
  doc.text('** DOCUMENTO NO FISCAL **', 40, y, { align: 'center' });
  y += 3.5;
  doc.setFontSize(6.5);
  doc.text('CAE SIMULADO - AMBIENTE PRUEBAS', 40, y, { align: 'center' });
  y += 4;
  doc.setTextColor(0, 0, 0);

  doc.setFont('courier', 'bold');
  doc.setFontSize(12);
  doc.text('ARECOFIX SERVICES S.A.S.', 40, y, { align: 'center' });
  y += 4.5;

  doc.setFont('courier', 'normal');
  doc.setFontSize(8);
  doc.text('CUIT: 30-71649201-9', 40, y, { align: 'center' });
  y += 3.5;
  doc.text('IVA Resp. Inscripto | P.V.: 0004', 40, y, { align: 'center' });
  y += 3.5;
  doc.text('Av. San Martin 450 - San A. de Areco', 40, y, { align: 'center' });
  y += 4;

  doc.line(margin, y, margin + contentWidth, y);
  y += 4;

  doc.setFont('courier', 'bold');
  doc.setFontSize(10);
  doc.text('FACTURA B   N° 0004-00000101', 40, y, { align: 'center' });
  y += 4;

  doc.setFont('courier', 'normal');
  doc.setFontSize(7.5);
  doc.text('Fecha: 27/10/2026 18:45 Hs. (COD. 006)', 40, y, { align: 'center' });
  y += 4;

  doc.line(margin, y, margin + contentWidth, y);
  y += 4;

  doc.text('Cliente: Juan Perez', margin, y);
  y += 3.5;
  doc.text('Doc: DNI 35.987.654 (Cons. Final)', margin, y);
  y += 3.5;
  doc.text('CUIT: 20-35987654-3', margin, y);
  y += 3.5;
  doc.text('Orden Taller: AF-2026-101', margin, y);
  y += 3.5;
  doc.text('Vehiculo: Moto Honda XR 250', margin, y);
  y += 3.5;
  doc.text('Patente: A123BCD (eq-moto-001)', margin, y);
  y += 4;

  doc.line(margin, y, margin + contentWidth, y);
  y += 4;

  doc.setFont('courier', 'bold');
  doc.text('DESCRIPCION             CANT   IMPORTE', margin, y);
  y += 3.5;
  doc.setFont('courier', 'normal');
  doc.text('----------------------------------------', margin, y);
  y += 3.5;

  doc.text('Mano Obra Espec. Taller', margin, y);
  y += 3.5;
  doc.text('1 x $4.500,00                    $4.500,00', margin, y);
  y += 4;

  doc.text('Filtro Aceite Honda OEM', margin, y);
  y += 3.5;
  doc.text('1 x $3.200,00                    $3.200,00', margin, y);
  y += 4;

  doc.line(margin, y, margin + contentWidth, y);
  y += 4;

  doc.setFont('courier', 'normal');
  doc.text('SUBTOTAL FACTURADO:             $7.700,00', margin, y);
  y += 3.5;
  doc.setFont('courier', 'italic');
  doc.setFontSize(6.5);
  doc.text('* IVA incluido en el precio segun ley *', 40, y, { align: 'center' });
  y += 3.5;

  doc.setFont('courier', 'bold');
  doc.setFontSize(8.5);
  doc.text('TOTAL COMPROBANTE FISCAL:       $7.700,00', margin, y);
  y += 4;

  doc.setFont('courier', 'normal');
  doc.setFontSize(7.5);
  doc.text('(-) Senia Previa (RC-00482):   -$2.000,00', margin, y);
  y += 4;

  doc.line(margin, y, margin + contentWidth, y);
  y += 4.5;

  doc.setFont('courier', 'bold');
  doc.setFontSize(9.5);
  doc.text('SALDO FINAL A COBRAR:           $5.700,00', margin, y);
  y += 5;

  doc.line(margin, y, margin + contentWidth, y);
  y += 4;

  // QR oficial
  const qrData = {
    ver: 1,
    fecha: "2026-10-27",
    cuit: 30716492019,
    ptoVta: 4,
    tipoCmp: 6,
    nroCmp: 101,
    importe: 7700.00,
    moneda: "PES",
    ctz: 1,
    tipoDocRec: 96,
    nroDocRec: 32405918,
    tipoCodAut: "E",
    codAut: 74102983419012
  };
  const qrBase64 = Buffer.from(JSON.stringify(qrData)).toString('base64');
  const qrUrl = `https://www.afip.gob.ar/fe/qr/?p=${qrBase64}`;
  const qrImage = await QRCode.toDataURL(qrUrl, { margin: 0, width: 90 });

  doc.addImage(qrImage, 'PNG', 40 - 14, y, 28, 28);
  y += 30;

  doc.setFont('courier', 'bold');
  doc.setFontSize(7.5);
  doc.text('CAE: 74102983419012', 40, y, { align: 'center' });
  y += 3.5;
  doc.text('Vto. CAE: 06/11/2026', 40, y, { align: 'center' });
  y += 4;
  doc.setFont('courier', 'normal');
  doc.setFontSize(6.5);
  doc.text('Comprobante Autorizado por AFIP', 40, y, { align: 'center' });

  const ticketPath = join(outputDir, 'ticket_80mm_af_2026_101.pdf');
  const buffer = Buffer.from(doc.output('arraybuffer'));
  writeFileSync(ticketPath, buffer);
  console.log('Ticket 80mm generado exitosamente en:', ticketPath);
}

async function main() {
  await generateA4Invoice();
  await generate80mmTicket();
}

main().catch(err => {
  console.error('Error generando comprobantes:', err);
  process.exit(1);
});
