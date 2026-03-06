import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { environment } from '../../../environments/environment';
import { TrackingService } from './services/tracking.service';
import { Repair, RepairStatus } from '../../features/repairs/domain/entities/repair.entity';
import { LoggerService } from '../../core/services/logger.service';
import { SeoService } from '../../core/services/seo.service';
import { CompanyService } from '../../core/services/company.service';
import { GetRepairTrackingUseCase } from '../../features/repairs/application/usecases/get-repair-tracking.usecase';
import { PublicRepairDto } from '../../features/repairs/domain/dtos/public-repair.dto';

@Component({
    selector: 'app-tracking-page',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './tracking-page.html',
    styles: [`
        @media print {
            .no-print {
                display: none !important;
            }
            .print-only {
                display: block !important;
                visibility: visible !important;
            }
            body {
                background: white !important;
                margin: 0 !important;
                padding: 0 !important;
            }
            @page {
                size: auto;
                margin: 0mm;
            }
            .withdrawal-ticket {
                width: 80mm;
                margin: 0 auto;
                padding: 10mm;
                font-family: 'Courier New', Courier, monospace;
            }
        }
        .print-only {
            display: none;
        }
    `]
})
export class TrackingPage implements OnInit {
    private route = inject(ActivatedRoute);
    private trackingService = inject(TrackingService);
    private logger = inject(LoggerService);
    private seoService = inject(SeoService);
    private companyService = inject(CompanyService);
    private getRepairTrackingUseCase = inject(GetRepairTrackingUseCase);
    
    whatsappNumber = environment.contact.whatsappNumber;

    code: string | null = null;
    repair = signal<PublicRepairDto | null>(null);
    loading = signal(true);
    error = signal<string | null>(null);

    baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://arecofix.com.ar';

    qrCodeUrl = computed(() => {
        const r = this.repair();
        if (!r) return '';
        const trackingUrl = `${this.baseUrl}/tracking/${r.tracking_code}`;
        return `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(trackingUrl)}`;
    });

    // No longer needed as mapping is in UseCase

    async ngOnInit() {
        this.code = this.route.snapshot.paramMap.get('code');
        if (this.code) {
            await this.loadRepair();
        } else {
            this.error.set('Código de seguimiento no válido.');
            this.loading.set(false);
        }
    }

    async loadRepair() {
        const code = this.code;
        if (!code) return;

        this.getRepairTrackingUseCase.execute(code).subscribe({
            next: (repairData) => {
                this.repair.set(repairData);
                this.updateSeo(repairData);
                this.loading.set(false);
            },
            error: (err) => {
                this.logger.error('Error fetching repair:', err);
                this.error.set('No se encontró ninguna reparación con este código o hubo un problema de conexión.');
                this.loading.set(false);
            }
        });
    }

    private async updateSeo(r: PublicRepairDto) {
        const statusName = r.status_label;
        let imageUrl = 'assets/img/branding/og-services.jpg';

        try {
            const settings = await this.companyService.getSettings();
            if (settings?.logo_url) {
                imageUrl = settings.logo_url;
            }
        } catch (e) {
            this.logger.warn('Could not fetch company settings for SEO image', e);
        }

        this.seoService.setPageData({
            title: `${statusName} - Tu ${r.device_model}`,
            description: `Gracias por confiar en Arecofix. Tu equipo está en etapa de ${statusName}.`,
            imageUrl: imageUrl,
            type: 'article'
        });
    }

    // Removed old calculation methods as they are now in the logic layer


    async printTicket() {
        if (!this.repair()) return;
        const r = this.repair()!;
        
        // Dynamically import jsPDF
        const { jsPDF } = await import('jspdf');
        
        const doc = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: [80, 150] // Ticket format (receipt width)
        });

        const primaryColor: [number, number, number] = [22, 163, 74]; // Emerald 600
        
        let y = 10;
        
        // Header
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(0, 0, 0);
        doc.text('ARECOFIX', 40, y, { align: 'center' });
        
        y += 5;
        doc.setFontSize(8);
        doc.text('SERVICIO TÉCNICO ESPECIALIZADO', 40, y, { align: 'center' });
        
        y += 4;
        doc.setFontSize(7);
        doc.setFont('helvetica', 'normal');
        doc.text('WhatsApp: +54 9 2326 123456', 40, y, { align: 'center' });
        
        y += 8;
        doc.setDrawColor(0);
        doc.setLineWidth(0.5);
        (doc as any).setLineDash([2, 2], 0);
        doc.line(5, y, 75, y);
        (doc as any).setLineDash([], 0); // Reset dash
        
        y += 8;
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text(`TALÓN DE RETIRO # ${r.repair_number || 'S/N'}`, 40, y, { align: 'center' });
        
        y += 8;
        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.text(`Fecha:`, 5, y);
        doc.setFont('helvetica', 'bold');
        doc.text(`${new Date(r.received_at).toLocaleDateString()}`, 75, y, { align: 'right' });
        
        y += 5;
        doc.setFont('helvetica', 'normal');
        doc.text(`Cliente:`, 5, y);
        doc.setFont('helvetica', 'bold');
        doc.text(`${(r.customer_name || 'Particular').toUpperCase()}`, 75, y, { align: 'right' });
        
        y += 5;
        doc.setFont('helvetica', 'normal');
        doc.text(`Equipo:`, 5, y);
        doc.setFont('helvetica', 'bold');
        doc.text(`${r.device_model.toUpperCase()}`, 75, y, { align: 'right' });
        
        y += 5;
        doc.setFont('helvetica', 'normal');
        doc.text(`Motivo:`, 5, y);
        doc.setFont('helvetica', 'italic');
        const splitIssue = doc.splitTextToSize(`"${r.issue_description}"`, 55);
        doc.text(splitIssue, 75, y, { align: 'right' });
        
        y += (splitIssue.length * 4) + 2;
        doc.setFont('helvetica', 'normal');
        doc.text(`Cód. Seguimiento:`, 5, y);
        doc.setFont('helvetica', 'bold');
        doc.text(`${r.tracking_code}`, 75, y, { align: 'right' });

        y += 8;
        (doc as any).setLineDash([2, 2], 0);
        doc.line(5, y, 75, y);
        (doc as any).setLineDash([], 0);
        
        y += 8;
        doc.setFontSize(7);
        doc.setFont('helvetica', 'bold');
        doc.text('SALDO A CANCELAR AL RETIRAR', 40, y, { align: 'center' });
        
        y += 8;
        doc.setFontSize(16);
        doc.text(`$ ${r.balance_to_pay.toLocaleString('es-AR')}`, 40, y, { align: 'center' });
        
        if (r.deposit_amount > 0) {
            y += 4;
            doc.setFontSize(6);
            doc.setFont('helvetica', 'italic');
            doc.text(`(Incluye seña descontada de $ ${r.deposit_amount.toLocaleString('es-AR')})`, 40, y, { align: 'center' });
        }
        
        y += 8;
        (doc as any).setLineDash([2, 2], 0);
        doc.line(5, y, 75, y);
        (doc as any).setLineDash([], 0);
        
        y += 8;
        doc.setFontSize(5);
        doc.setFont('helvetica', 'normal');
        doc.text('1. Presente este talón obligatorio para el retiro.', 5, y);
        y += 3;
        doc.text('2. Las reparaciones tienen 30 días de garantía.', 5, y);
        y += 3;
        doc.text('3. Equipos no retirados en 60 días se consideran en abandono.', 5, y);
        y += 3;
        doc.text('4. No nos responsabilizamos por pérdida de datos.', 5, y);
        
        y += 15;
        doc.line(15, y, 65, y);
        y += 4;
        doc.setFontSize(6);
        doc.text('ARECOFIX', 40, y, { align: 'center' });
        
        y += 6;
        doc.setFontSize(6);
        doc.setFont('helvetica', 'bold');
        doc.text('arecofix.com.ar', 40, y, { align: 'center' });

        doc.save(`Arecofix_Talon_${r.repair_number || 'S-N'}_${r.tracking_code}.pdf`);
    }

    openImage(url: string) {
        if (typeof window !== 'undefined') {
            window.open(url, '_blank');
        }
    }
}
