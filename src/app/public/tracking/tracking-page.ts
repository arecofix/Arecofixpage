import { Component, inject, OnInit, OnDestroy, signal, computed, ViewChild, ElementRef, PLATFORM_ID } from '@angular/core';
import { CommonModule, DOCUMENT, isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, RouterLink, Router, NavigationEnd } from '@angular/router';
import { FormsModule } from '@angular/forms';
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
    imports: [CommonModule, RouterLink, FormsModule],
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
        /* Hide scrollbar for accessory carousel but allow custom styles if needed */
        .accessory-carousel::-webkit-scrollbar {
            height: 6px;
        }
        .accessory-carousel::-webkit-scrollbar-thumb {
            background-color: #cbd5e1;
            border-radius: 4px;
        }
        .dark .accessory-carousel::-webkit-scrollbar-thumb {
            background-color: #475569;
        }
    `]
})
export class TrackingPage implements OnInit, OnDestroy {
    @ViewChild('accessoryCarousel') accessoryCarousel?: ElementRef<HTMLDivElement>;

    private document = inject(DOCUMENT);
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private trackingService = inject(TrackingService);
    private logger = inject(LoggerService);
    private seoService = inject(SeoService);
    private companyService = inject(CompanyService);
    // Services
    platformId = inject(PLATFORM_ID);
    getRepairTrackingUseCase = inject(GetRepairTrackingUseCase);
    
    whatsappNumber = environment.contact.whatsappNumber;
    currentYear = new Date().getFullYear();

    code: string | null = null;
    repair = signal<PublicRepairDto | null>(null);
    loading = signal(true);
    error = signal<string | null>(null);
    showUpsellModal = signal(false);
    recommendedAccessories = signal<any[]>([]);
    buyingAccessory = signal<string | null>(null);

    // Lookup Mode properties
    isLookupMode = signal(false);
    searchCodeInput = signal('');

    baseUrl = environment.baseUrl;

    // Tracking steps definition â€” 5 main repair stages
    trackingSteps = [
        { id: 1, shortLabel: 'Diagnóstico', label: 'Proceso de Diagnóstico', icon: 'fas fa-microscope' },
        { id: 2, shortLabel: 'Repuestos',   label: 'Logística de Repuestos',  icon: 'fas fa-boxes' },
        { id: 3, shortLabel: 'Reparación',  label: 'En Reparación',           icon: 'fas fa-tools' },
        { id: 4, shortLabel: 'Revisión',    label: 'Revisión del Arreglo',    icon: 'fas fa-clipboard-check' },
        { id: 5, shortLabel: 'Finalizado',  label: 'Reparación Finalizada',   icon: 'fas fa-check-circle' }
    ];

    /** Returns % width for the progress bar (0-100) for steps 1-5 */
    getProgressPercent(statusId: number): number {
        if (statusId <= 1) return 0;
        if (statusId >= 5) return 100;
        return (statusId - 1) * 25;
    }

    /** Returns the label of the current active step for mobile view */
    getCurrentStepLabel(statusId: number): string {
        const step = this.trackingSteps.find(s => s.id === statusId);
        return step ? step.label : '';
    }

    qrCodeUrl = computed(() => {
        const r = this.repair();
        if (!r) return '';
        const trackingUrl = `${this.baseUrl}/tracking/${r.tracking_code}`;
        return `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(trackingUrl)}`;
    });

    ngOnInit() {
        this.document.body.classList.add('hide-floating-widgets');
        
        this.route.paramMap.subscribe(async (params) => {
            const rawCode = params.get('code');
            this.code = rawCode ? rawCode.trim().toUpperCase() : null;
            if (this.code && this.code !== 'CONSULTA') {
                this.isLookupMode.set(false);
                this.loading.set(true);
                this.error.set(null);
                await this.loadRepair();
            } else {
                this.isLookupMode.set(true);
                this.loading.set(false);
                this.error.set(null);
                this.repair.set(null);
            }
        });
    }

    ngOnDestroy() {
        this.document.body.classList.remove('hide-floating-widgets');
    }

    async loadRepair() {
        const code = this.code;
        if (!code) return;

        this.getRepairTrackingUseCase.execute(code).subscribe({
            next: (repairData) => {
                if (repairData) {
                    this.repair.set(repairData);
                    this.updateSeo(repairData);
                    this.error.set(null);
                    
                    if (isPlatformBrowser(this.platformId)) {
                        if (!repairData.glass_upsell && !localStorage.getItem(`upsellDismissed_${code}`)) {
                            setTimeout(() => this.showUpsellModal.set(true), 2500);
                        }
                    }
                    
                    this.loadRecommendations(code);
                } else {
                    this.error.set('No se encontró ninguna reparación con este código.');
                    this.repair.set(null);
                }
                this.loading.set(false);
            },
            error: (err) => {
                this.logger.error('Error fetching repair:', err);
                this.error.set('Hubo un problema de conexión al buscar tu reparación.');
                this.loading.set(false);
            }
        });
    }

    onSearchCode(event: Event) {
        event.preventDefault();
        const code = this.searchCodeInput().trim().toUpperCase();
        if (code) {
            this.router.navigate(['/tracking', code]);
        }
    }

    private async updateSeo(r: PublicRepairDto) {
        const statusName = r.status_label;
        // Default: branded tracking image (absolute URL, required for WhatsApp/Telegram previews)
        const trackingOgImage = `${this.baseUrl}/assets/img/branding/og-tracking.png`;
        let imageUrl = trackingOgImage;

        try {
            const settings = await this.companyService.getSettings();
            if (settings?.logo_url) {
                const raw = settings.logo_url;
                // Ensure URL is absolute — bots require absolute URLs for OG images
                if (raw.startsWith('http://') || raw.startsWith('https://')) {
                    imageUrl = raw;
                } else if (raw.startsWith('/') || raw.startsWith('assets/')) {
                    imageUrl = `${this.baseUrl}/${raw.replace(/^\//, '')}`;
                }
                // If logo_url looks like a generic small icon, prefer the branded OG image
                const tooSmall = raw.includes('16x16') || raw.includes('32x32') || raw.includes('favicon');
                if (tooSmall) imageUrl = trackingOgImage;
            }
        } catch (e) {
            this.logger.warn('Could not fetch company settings for SEO image', e);
        }

        this.seoService.setPageData({
            title: `${statusName} - Tu ${r.device_model} | Arecofix`,
            description: `Tu equipo está en etapa de ${statusName}. Seguí el avance de tu reparación en tiempo real con Arecofix.`,
            imageUrl,
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
        doc.text(`WhatsApp: +54 1125960900`, 40, y, { align: 'center' });
        
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

    async acceptUpsell() {
        if (!this.code) return;
        try {
            await this.trackingService.acceptUpsell(this.code);
            this.repair.update(r => r ? { ...r, glass_upsell: true } : r);
            this.showUpsellModal.set(false);
            
            const r = this.repair();
            const identifier = r?.repair_number ? `#${r.repair_number}` : (r?.tracking_code || this.code);
            const msg = encodeURIComponent(`Hola! Quiero incluir un vidrio templado con mi reparación del equipo ${identifier}`);
            window.open(`https://wa.me/${this.whatsappNumber}?text=${msg}`, '_blank');
        } catch (e) {
            this.logger.error('Failed to accept upsell', e);
        }
    }

    dismissUpsell() {
        if (this.code) {
            localStorage.setItem(`upsellDismissed_${this.code}`, 'true');
        }
        this.showUpsellModal.set(false);
    }

    async loadRecommendations(code: string) {
        try {
            const r = this.repair();
            const brand = r?.device_model ? r.device_model.split(' ')[0] : 'generic';
            const { data, error } = await this.trackingService.getRecommendedAccessories(code, brand);
            if (!error && data) {
                this.recommendedAccessories.set(data as any[]);
            }
        } catch (e) {
            this.logger.error('Failed to load recommendations', e);
        }
    }

    scrollCarousel(direction: 'left' | 'right') {
        if (!this.accessoryCarousel?.nativeElement) return;
        const container = this.accessoryCarousel.nativeElement;
        const scrollAmount = 300;
        container.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    }

    async buyAccessory(product: any) {
        if (!this.code) return;
        
        this.buyingAccessory.set(product.id);
        
        try {
            const { error } = await this.trackingService.addAccessoryUpsell(this.code, product.id);
            if (error) throw error;
            
            // Reload repair completely to get updated final_cost
            await this.loadRepair();
            
            // Remove the product from recommendations visually or keep it? Let's keep it but they can just see final cost elevated.
            const r = this.repair();
            const identifier = r?.repair_number ? `#${r.repair_number}` : (r?.tracking_code || this.code);
            const msg = encodeURIComponent(`Hola! Acabo de agregar a mi reparación (Orden ${identifier}) el accesorio: "${product.name}". ¡Gracias!`);
            window.open(`https://wa.me/${this.whatsappNumber}?text=${msg}`, '_blank');
            
        } catch(e) {
            this.logger.error('Failed to buy accessory', e);
            alert('No pudimos procesar la solicitud en este momento. Inténtelo más tarde.');
        } finally {
            this.buyingAccessory.set(null);
        }
    }

    getChecklistSummary(checklist: any): string {
        if (!checklist) return 'Ninguno';
        const items = [];
        if (checklist.charger) items.push('Cargador');
        if (checklist.battery) items.push('Batería');
        if (checklist.chip) items.push('Chip/SIM');
        if (checklist.sd) items.push('MicroSD');
        if (checklist.case) items.push('Funda');
        return items.length > 0 ? items.join(', ') : 'Ninguno';
    }
}
