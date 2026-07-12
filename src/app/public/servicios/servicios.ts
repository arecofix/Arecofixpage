import { Component, inject, OnInit, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { RouterModule } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';

import { SeoService } from '@app/core/services/seo.service';
import { PreferencesService } from '../../shared/services/preferences.service';
import { environment } from '../../../environments/environment';
import { Service, SERVICIOS_CONTENT, ServiciosContent } from './servicios.data';
import { AppCatalogService } from '@app/features/products/application/services/app-catalog.service';

@Component({
    selector: 'app-servicios',
    standalone: true,
    imports: [RouterModule, NgOptimizedImage],
    templateUrl: './servicios.html',
    styles: [],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ServiciosComponent implements OnInit {
    private seoService = inject(SeoService);
    public preferencesService = inject(PreferencesService);
    private catalogService = inject(AppCatalogService);
    
    whatsappNumber = environment.contact.whatsappNumber;

    // Signals
    currentLang = toSignal(this.preferencesService.language$, { initialValue: 'es' });
    
    // Database Services Signal
    dbServices = signal<Service[]>([]);

    // Computed Content based on Language (for headers, guarantees, steps, process, etc.)
    content = computed<ServiciosContent>(() => {
        const lang = this.currentLang() as 'es' | 'en';
        return SERVICIOS_CONTENT[lang] || SERVICIOS_CONTENT['es'];
    });

    // Modal State
    showModal = signal(false);
    selectedService = signal<Service | null>(null);

    // Other Services List
    otherServicesList = signal([
        'Reparación de Electrónica',
        'Diagnóstico Eléctrico y Electrónico de Ecus AutoMotriz',
        'Electricidad de Motos',
        'Alquiler de Trajes',
        'Desarrollo de Software a Medida'
    ]);

    async ngOnInit() {
        this.seoService.setPageData({
            title: 'Soluciones Tecnológicas Integrales | Arecofix Servicios',
            description: 'Experiencia y tecnología al servicio de tu empresa. Desarrollo de Software, Soporte IT, Ciberseguridad y Reparación de Hardware Especializada.',
            imageUrl: 'assets/img/branding/og-services.png'
        });

        await this.loadDatabaseServices();
    }

    async loadDatabaseServices() {
        try {
            const dbData = await this.catalogService.getAll();
            const activeDbServices = dbData.filter(s => s.is_active);
            if (activeDbServices.length > 0) {
                const mapped = activeDbServices.map((s, idx) => {
                    let desc = s.description || '';
                    let icon = 'fa-tools';
                    let features: string[] = [];
                    
                    if (desc.trim().startsWith('{') && desc.trim().endsWith('}')) {
                        try {
                            const parsed = JSON.parse(desc);
                            desc = parsed.description || '';
                            icon = parsed.icon || 'fa-tools';
                            features = parsed.features || [];
                        } catch (e) {
                            // ignore
                        }
                    }
                    
                    return {
                        id: s.id as any,
                        title: s.name,
                        slug: s.slug || this.slugify(s.name),
                        description: desc,
                        icon: icon,
                        features: features,
                        price: s.price ? `Desde $${Number(s.price).toLocaleString('es-AR')}` : 'Consultar',
                        image: s.image_url || 'assets/img/services/repair-illustration.webp',
                        link: `/servicios/${s.slug || this.slugify(s.name)}`
                    };
                });
                this.dbServices.set(mapped);
            }
        } catch (e) {
            console.error('Error fetching database services:', e);
        }
    }

    private slugify(text: string): string {
        return text
            .toString()
            .toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^\w\-]+/g, '')
            .replace(/\-\-+/g, '-')
            .replace(/^-+/, '')
            .replace(/-+$/, '');
    }

    openService(service: Service, event: Event) {
        // If it's the "Other Services" card or specific logic requires modal
        if (service.id === 12 || service.slug === 'otros-servicios') { 
            event.preventDefault();
            this.selectedService.set(service);
            this.showModal.set(true);
        }
        // Otherwise RouterLink in HTML handles navigation
    }

    closeModal() {
        this.showModal.set(false);
        this.selectedService.set(null);
    }
}

