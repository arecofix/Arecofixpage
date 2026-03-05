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


    printTicket() {
        if (typeof window !== 'undefined') {
            window.print();
        }
    }

    openImage(url: string) {
        if (typeof window !== 'undefined') {
            window.open(url, '_blank');
        }
    }
}
