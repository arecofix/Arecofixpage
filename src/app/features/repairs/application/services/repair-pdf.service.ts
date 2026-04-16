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

    // Header Background
    doc.setFillColor(243, 244, 246);
    doc.rect(0, 0, 210, 45, 'F');

    // Company Name or Logo
    if (logoBase64) {
      doc.addImage(logoBase64, 'PNG', 15, 10, 30, 15);
      doc.setFontSize(18);
      doc.setTextColor(colorArray[0], colorArray[1], colorArray[2]);
      doc.text(company?.name || 'Arecofix', 48, 20);
    } else {
      doc.setFontSize(24);
      doc.setTextColor(colorArray[0], colorArray[1], colorArray[2]);
      doc.text(company?.name || 'Arecofix', 15, 20);
    }

    // Standard Text Color
    doc.setTextColor(55, 65, 81);
    
    doc.setFontSize(9);
    const contactY = logoBase64 ? 27 : 28;
    doc.text(company?.address || company?.location || 'Dirección de la Sucursal', 15, contactY);
    doc.text(`Tel: ${company?.phone || company?.contact_phone || 'Sin Teléfono'} | Email: ${company?.email || company?.contact_email || 'Sin Email'}`, 15, contactY + 5);
    
    const cuit = company?.tax_id || company?.cuit;
    if (cuit) {
      doc.text(`CUIT: ${cuit}`, 15, contactY + 10);
    }

    // Ticket Info (Right side)
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text(`ORDEN TÉCNICA # ${repair.repair_number || 'S/N'}`, 120, 20);
    
    doc.setFontSize(10);
    doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 120, 28);
    doc.text(`Código de Seguimiento:`, 120, 34);
    doc.setFontSize(11);
    doc.setTextColor(colorArray[0], colorArray[1], colorArray[2]);
    doc.text(`${repair.tracking_code || '---'}`, 162, 34);

    // Customer Details
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    doc.text('Datos del Cliente', 15, 55);
    doc.line(15, 57, 95, 57);
    doc.setFontSize(10);
    doc.text(`Nombre: ${repair.customer_name}`, 15, 65);
    doc.text(`Teléfono: ${repair.customer_phone || 'No registrado'}`, 15, 72);

    // Device Details
    doc.setFontSize(12);
    doc.text('Detalles del Equipo', 110, 55);
    doc.line(110, 57, 195, 57);
    doc.setFontSize(10);
    doc.text(`Modelo: ${repair.device_model}`, 110, 65);
    doc.text(`IMEI/Serie: ${repair.imei || 'Sin declarar'}`, 110, 72);
    doc.text(`Tipo/Marca: ${repair.device_type} / ${repair.device_brand}`, 110, 79);

    // Security & Checklist Box
    doc.setDrawColor(200, 200, 200);
    doc.setFillColor(249, 250, 251);
    doc.roundedRect(15, 87, 180, 25, 3, 3, 'FD');
    doc.text(`Seguridad - PIN: ${repair.security_pin || 'Ninguno'} | Patrón: ${repair.security_pattern || 'Ninguno'} | Passcode: ${repair.device_passcode || 'No'}`, 20, 95);
    
    const chk = repair.checklist;
    if (chk) {
      doc.text(`Accesorios: [${chk.charger ? 'X' : ' '}] Cargador  [${chk.battery ? 'X' : ' '}] Batería  [${chk.chip ? 'X' : ' '}] Chip  [${chk.sd ? 'X' : ' '}] SD  [${chk.case ? 'X' : ' '}] Funda`, 20, 105);
    }

    // Reason / Fault
    doc.setFontSize(12);
    doc.text('Motivo de Ingreso / Falla Reportada', 15, 122);
    doc.setFontSize(10);
    const splitDescription = doc.splitTextToSize(repair.issue_description || 'Sin detalles.', 180);
    doc.text(splitDescription, 15, 130);

    // Table for Parts
    const defaultTableY = splitDescription.length * 5 + 135;
    const tableData = (repair.parts || []).map(p => [
      p.product_name || 'Repuesto',
      p.quantity.toString(),
      `$ ${p.unit_price_at_time.toLocaleString('es-AR')}`,
      `$ ${(p.unit_price_at_time * p.quantity).toLocaleString('es-AR')}`
    ]);

    if (repair.technical_labor_cost && repair.technical_labor_cost > 0) {
      tableData.push([
        'Mano de Obra Técnica', 
        '1', 
        `$ ${repair.technical_labor_cost.toLocaleString('es-AR')}`, 
        `$ ${repair.technical_labor_cost.toLocaleString('es-AR')}`
      ]);
    }

    if (tableData.length > 0) {
      autoTable(doc, {
        startY: defaultTableY,
        head: [['Detalle', 'Cant', 'Precio Unitario', 'Subtotal']],
        body: tableData,
        theme: 'striped',
        headStyles: { fillColor: colorArray as [number, number, number] },
        margin: { left: 15, right: 15 }
      });
    }

    const finalY = (doc as any).lastAutoTable ? (doc as any).lastAutoTable.finalY : defaultTableY + 10;

    // Financial Totals
    doc.setFontSize(11);
    doc.text(`Presupuesto Inicial Estimado: $ ${repair.estimated_cost?.toLocaleString('es-AR') || '0'}`, 110, finalY + 10);
    doc.text(`Seña / Adelanto Pagado: $ ${repair.deposit_amount?.toLocaleString('es-AR') || '0'}`, 110, finalY + 17);
    
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    const final_cost = repair.final_cost || 0;
    const deposit = repair.deposit_amount || 0;
    doc.text(`RESTANTE A ABONAR: $ ${(final_cost - deposit).toLocaleString('es-AR')}`, 110, finalY + 27);

    // Signatures
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.line(25, finalY + 50, 85, finalY + 50);
    doc.text('Firma y Aclaración Cliente', 33, finalY + 56);

    doc.line(125, finalY + 50, 185, finalY + 50);
    doc.text('Firma Técnico / Local', 135, finalY + 56);

    // Terms and conditions
    doc.setFontSize(7);
    doc.setTextColor(100, 100, 100);
    const terminos = 'Términos y Condiciones: Pasados los 30 días de notificada la reparación, la empresa cobrará resguardo diario. Pasados los 90 días el equipo se considerará abandonado perdiendo el cliente todo derecho a reclamo y pasando a ser propiedad del local para cubrir costos. Todo presupuesto no aceptado tiene cargo de revisión técnica. NO SE ENTREGAN EQUIPOS SIN ESTA ORDEN.';
    doc.text(doc.splitTextToSize(terminos, 180), 15, 275);

    // URL tracking (Footer)
    doc.setFontSize(9);
    const trackingUrl = `${window.location.origin}/#/tracking/${repair.tracking_code}`;
    doc.text(`Sigue el estado de tu equipo online en: ${trackingUrl}`, 15, 290);

    // Save PDF
    const fileName = `Arecofix_Orden_${repair.repair_number || 'S-N'}_${(repair.customer_name || 'Cliente').replace(/\s+/g, '_')}.pdf`;
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
