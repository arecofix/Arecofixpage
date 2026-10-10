import { Injectable } from '@angular/core';
import { Repair, RepairStatus } from '../../domain/entities/repair.entity';

@Injectable({
  providedIn: 'root'
})
export class RepairPdfService {
  
  /**
   * Generates and saves a PDF for a repair order
   */
  async generateOrderPdf(repair: Repair, company: any): Promise<void> {
    const { jsPDF } = await import('jspdf') as any;
    const { default: autoTable } = await import('jspdf-autotable') as any;

    // A4 format (210 x 297 mm)
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const primaryColor = company?.branding_settings?.primary_color || '#16a34a';

    // Convert logo URL to base64
    let logoBase64 = '';
    if (company?.logo_url) {
      try {
        logoBase64 = await this.getBase64ImageFromURL(company.logo_url);
      } catch (e) {
        console.warn('Could not load company logo for PDF', e);
      }
    }

    const colorArray = this.hexToRgb(primaryColor);

    // --- ENTIRE CONTENT MUST FIT IN TOP HALF (Y < 148mm) ---

    // Header Background (Height 22)
    doc.setFillColor(243, 244, 246);
    doc.rect(0, 0, 210, 22, 'F');

    // Company Name or Logo
    if (logoBase64) {
      // Dibujar logo medio chico en la esquina (e.g. 12x12 mm)
      doc.addImage(logoBase64, 'PNG', 10, 4, 12, 12);
      doc.setFontSize(14);
      doc.setTextColor(colorArray[0], colorArray[1], colorArray[2]);
      // Texto pegado al logo
      doc.text(company?.name || 'Arecofix', 25, 12);
    } else {
      doc.setFontSize(16);
      doc.setTextColor(colorArray[0], colorArray[1], colorArray[2]);
      doc.text(company?.name || 'Arecofix', 10, 12);
    }

    // Company Contact
    doc.setTextColor(55, 65, 81);
    doc.setFontSize(8);
    const contactY = logoBase64 ? 18 : 16;
    doc.text(company?.address || company?.location || 'Dirección de la Sucursal', 10, contactY);
    doc.text(`Tel: ${company?.phone || company?.contact_phone || 'Sin Teléfono'}`, 80, contactY);
    doc.text(`CUIT: ${company?.cuit || 'N/A'}`, 10, contactY + 4);

    // Ticket Info (Right side)
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`ORDEN TÉCNICA # ${repair.repair_number || 'S/N'}`, 140, 8);
    
    doc.setFontSize(8);
    doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 140, 14);
    doc.text(`Cód. Seg.:`, 140, 19);
    doc.setFontSize(9);
    doc.setTextColor(colorArray[0], colorArray[1], colorArray[2]);
    doc.text(`${repair.tracking_code || '---'}`, 160, 19);

    // Customer & Device Details (Side by side to save height)
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(9);
    doc.text('Datos del Cliente', 10, 28);
    doc.line(10, 29, 95, 29);
    doc.setFontSize(8);
    doc.text(`Nombre: ${repair.customer_name}`, 10, 34);
    doc.text(`Teléfono: ${repair.customer_phone || 'No registrado'}`, 10, 39);

    doc.setFontSize(9);
    doc.text('Detalles del Equipo', 110, 28);
    doc.line(110, 29, 195, 29);
    doc.setFontSize(8);
    doc.text(`Modelo: ${repair.device_model}`, 110, 34);
    doc.text(`IMEI/Serie: ${repair.imei || 'Sin declarar'}`, 110, 39);
    doc.text(`Tipo/Marca: ${repair.device_type} / ${repair.brand_name || 'No especificada'}`, 110, 44);

    // Security & Checklist Box (Very compact)
    doc.setDrawColor(200, 200, 200);
    doc.setFillColor(249, 250, 251);
    doc.roundedRect(10, 47, 190, 12, 1, 1, 'FD');
    doc.setFontSize(7);
    doc.text(`Seguridad - PIN: ${repair.security_pin || 'Ninguno'} | Patrón: ${repair.security_pattern || 'Ninguno'} | Passcode: ${repair.device_passcode || 'No'}`, 13, 52);
    
    const chk = repair.checklist as any;
    if (chk) {
      doc.text(`Accesorios: [${chk.charger ? 'X' : ' '}] Cargador  [${chk.battery ? 'X' : ' '}] Batería  [${chk.chip ? 'X' : ' '}] Chip  [${chk.sd ? 'X' : ' '}] SD  [${chk.case ? 'X' : ' '}] Funda`, 13, 57);
      if (chk.physical_condition) {
        doc.text(`Estado físico al ingresar: ${chk.physical_condition}`, 13, 61);
      }
    }

    // Reason / Fault
    doc.setFontSize(9);
    doc.text('Motivo de Ingreso / Falla Reportada', 10, 68);
    doc.setFontSize(8);
    // Limit to fewer lines
    const splitDescription = doc.splitTextToSize(repair.issue_description || 'Sin detalles.', 190);
    doc.text(splitDescription, 10, 73);

    // Table for Parts (Highly compressed)
    const defaultTableY = 73 + (splitDescription.length * 3) + 2;
    let partsTotal = 0;
    const tableData = (repair.parts || []).map(p => {
      const sub = p.unit_price_at_time * p.quantity;
      partsTotal += sub;
      return [
        p.product_name || 'Repuesto',
        p.quantity.toString(),
        `$ ${p.unit_price_at_time.toLocaleString('es-AR')}`,
        `$ ${sub.toLocaleString('es-AR')}`
      ];
    });

    const total = repair.estimated_cost || repair.final_cost || 0;
    const laborToDisplay = repair.technical_labor_cost || (total > partsTotal ? (total - partsTotal) : 0);

    if (laborToDisplay > 0) {
      tableData.push([
        'Mano de Obra Técnica / Servicio Técnico', 
        '1', 
        `$ ${laborToDisplay.toLocaleString('es-AR')}`, 
        `$ ${laborToDisplay.toLocaleString('es-AR')}`
      ]);
    }

    if (tableData.length > 0) {
      autoTable(doc, {
        startY: defaultTableY,
        head: [['Detalle', 'Cant', 'Precio Unitario', 'Subtotal']],
        body: tableData,
        theme: 'striped',
        headStyles: { fillColor: colorArray as [number, number, number], fontSize: 7, halign: 'center' },
        bodyStyles: { fontSize: 7, cellPadding: 1 },
        margin: { left: 10, right: 10 },
        tableWidth: 'auto'
      });
    }

    // Check if table exceeded half page, though it's unlikely for normal receipts
    const finalY = (doc as any).lastAutoTable ? (doc as any).lastAutoTable.finalY : defaultTableY + 5;

    // Financial Totals
    doc.setFontSize(8);
    doc.text(`Presupuesto Inicial Estimado: $ ${repair.estimated_cost?.toLocaleString('es-AR') || '0'}`, 120, finalY + 6);
    doc.text(`Seña / Adelanto Pagado: $ ${repair.deposit_amount?.toLocaleString('es-AR') || '0'}`, 120, finalY + 11);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    const final_cost = repair.final_cost || 0;
    const deposit = repair.deposit_amount || 0;
    doc.text(`RESTANTE A ABONAR: $ ${(final_cost - deposit).toLocaleString('es-AR')}`, 120, finalY + 18);

    // Signatures
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.line(15, finalY + 25, 75, finalY + 25);
    doc.text('Firma y Aclaración Cliente', 25, finalY + 29);

    // Terms and conditions
    doc.setFontSize(5);
    doc.setTextColor(100, 100, 100);
    const terminos = 'Términos y Condiciones: Pasados los 30 días de notificada la reparación, la empresa cobrará resguardo diario. Pasados los 90 días el equipo se considerará abandonado perdiendo el cliente todo derecho a reclamo y pasando a ser propiedad del local para cubrir costos. Todo presupuesto no aceptado tiene cargo de revisión técnica. NO SE ENTREGAN EQUIPOS SIN ESTA ORDEN.';
    doc.text(doc.splitTextToSize(terminos, 190), 10, 137);

    // URL tracking (Footer)
    doc.setFontSize(7);
    const trackingUrl = `${window.location.origin}/tracking/${repair.tracking_code}`;
    doc.text(`Sigue tu equipo en: ${trackingUrl}`, 10, 145);

    // Cut line (Optional, to show where the half page is)
    doc.setDrawColor(200, 200, 200);
    doc.setLineDashPattern([2, 2], 0);
    doc.line(0, 148.5, 210, 148.5);
    doc.setLineDashPattern([], 0); // reset

    // Save PDF
    const fileName = `Arecofix_Orden_${repair.repair_number || 'S-N'}_${(repair.customer_name || 'Cliente').replace(/\s+/g, '_')}.pdf`;
    doc.save(fileName);
  }

  private async initJsPdf(): Promise<any> {
    const { jsPDF } = await import('jspdf') as any;
    const { default: autoTable } = await import('jspdf-autotable') as any;
    return { jsPDF, autoTable };
  }

  /**
   * Generates and saves a formal PDF Quote (Presupuesto) for the client.
   */
  async generateQuotePdf(repair: Repair, company: any): Promise<void> {
    const { jsPDF, autoTable } = await this.initJsPdf();
    
    // A4 format (210 x 297 mm)
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const primaryColor = company?.branding_settings?.primary_color || '#16a34a';
    const colorArray = this.hexToRgb(primaryColor);
    
    // Header Background
    doc.setFillColor(...colorArray);
    doc.rect(0, 0, 210, 35, 'F');

    // Logo & Header Text
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.text('PRESUPUESTO FORMAL', 15, 20);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Fecha: ${new Date().toLocaleDateString('es-AR')}`, 150, 20);
    doc.text(`Válido por 7 días`, 150, 26);

    // Business info
    doc.setTextColor(50, 50, 50);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(company?.name || 'Arecofix - Centro de Servicios', 15, 50);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const addressLine = company?.address ? `Dirección: ${company.address}` : 'Centro de Servicios';
    doc.text(addressLine, 15, 56);
    doc.text(`Teléfono: ${company?.phone || company?.contact_phone || 'No registrado'}`, 15, 62);
    const emailStr = company?.email || company?.contact_email || 'No registrado';
    doc.text(`Mail: ${emailStr}`, 15, 68);
    if (company?.cuit || company?.tax_id) {
       doc.text(`CUIT: ${company.cuit || company.tax_id}`, 15, 74);
    }
    
    // Client Info Box
    doc.setDrawColor(220, 220, 220);
    doc.setFillColor(249, 250, 251);
    doc.roundedRect(110, 45, 85, 34, 2, 2, 'FD');
    doc.setFont('helvetica', 'bold');
    doc.text('Presupuestado a:', 115, 52);
    doc.setFont('helvetica', 'normal');
    doc.text(`Cliente: ${repair.customer_name || 'Consumidor Final'}`, 115, 59);
    doc.text(`Teléfono: ${repair.customer_phone || '-'}`, 115, 66);
    doc.setFont('helvetica', 'bold');
    doc.text(`Nro. de Presupuesto: ${repair.repair_number || repair.tracking_code}`, 115, 74);

    // Device Info
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('Información del Equipo:', 15, 85);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Equipo: ${repair.brand_name || ''} ${repair.device_model}`, 15, 92);
    doc.text(`IMEI/Serie: ${repair.imei || 'Sin especificar'}`, 150, 92);
    doc.text(`Falla reportada: ${repair.issue_description || 'No detallada'}`, 15, 99);
    doc.text(`Tiempo estimado: 2 a 5 días hábiles`, 15, 106);

    // Table of costs
    const tableBody = [];
    let partsTotal = 0;
    
    if (repair.parts && repair.parts.length > 0) {
        repair.parts.forEach(p => {
            const sub = (p.quantity * Number(p.unit_price_at_time || 0));
            partsTotal += sub;
            tableBody.push([
                p.product_name || p.name || 'Repuesto', 
                p.quantity.toString(), 
                `$ ${Number(p.unit_price_at_time || 0).toLocaleString('es-AR')}`,
                `$ ${sub.toLocaleString('es-AR')}`
            ]);
        });
    }

    const total = repair.estimated_cost || repair.final_cost || 0;
    const laborToDisplay = repair.technical_labor_cost || (total > partsTotal ? (total - partsTotal) : 0);

    if (laborToDisplay > 0) {
        tableBody.push([
            'Mano de obra técnica / Servicio Técnico',
            '1',
            `$ ${Number(laborToDisplay).toLocaleString('es-AR')}`,
            `$ ${Number(laborToDisplay).toLocaleString('es-AR')}`
        ]);
    }

    if (tableBody.length === 0) {
        // Fallback si no hay desglose, usa costo estimado
        tableBody.push([
            'Reparación General (Diagnóstico/Presupuesto)',
            '1',
            `$ ${Number(total).toLocaleString('es-AR')}`,
            `$ ${Number(total).toLocaleString('es-AR')}`
        ]);
    }

    autoTable(doc, {
      startY: 110,
      head: [['Descripción', 'Cant.', 'Precio Unit.', 'Subtotal']],
      body: tableBody,
      headStyles: { fillColor: colorArray, textColor: [255, 255, 255] },
      styles: { fontSize: 9 },
      alternateRowStyles: { fillColor: [249, 250, 251] }
    });

    const finalY = (doc as any).lastAutoTable.finalY || 110;

    // Totals Box
    doc.setDrawColor(200, 200, 200);
    doc.setFillColor(243, 244, 246);
    doc.rect(120, finalY + 10, 75, 20, 'FD');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text(`TOTAL PRESUPUESTO:`, 125, finalY + 18);
    doc.setTextColor(...colorArray);
    doc.text(`$ ${total.toLocaleString('es-AR')}`, 125, finalY + 25);
    
    // Notes
    doc.setTextColor(100, 100, 100);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text('Los precios están expresados en Pesos Argentinos (ARS) y pueden variar sin previo aviso si el equipo presenta daños', 15, finalY + 40);
    doc.text('no detectados durante el diagnóstico inicial.', 15, finalY + 44);

    // Save
    const fileName = `Presupuesto_${repair.repair_number || 'S-N'}_${(repair.customer_name || 'Cliente').replace(/\s+/g, '_')}.pdf`;
    doc.save(fileName);
  }

  private getBase64ImageFromURL(url: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.setAttribute('crossOrigin', 'anonymous');
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0);
        const dataURL = canvas.toDataURL('image/png');
        resolve(dataURL);
      };
      img.onerror = (error) => reject(error);
      img.src = url;
    });
  }

  private hexToRgb(hex: string): [number, number, number] {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? [
      parseInt(result[1], 16),
      parseInt(result[2], 16),
      parseInt(result[3], 16)
    ] : [22, 163, 74];
  }
}
