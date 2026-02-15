import { Component, inject, OnInit, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { RouterModule } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';

import { SeoService } from '@app/core/services/seo.service';
import { PreferencesService } from '../../shared/services/preferences.service';
import { environment } from '../../../environments/environment';
import { Service, SERVICIOS_CONTENT, ServiciosContent } from './servicios.data';

@Component({
    selector: 'app-servicios',
    standalone: true,
    imports: [CommonModule, RouterModule, NgOptimizedImage],
    templateUrl: './servicios.html',
    styles: [],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ServiciosComponent implements OnInit {
    private seoService = inject(SeoService);
    public preferencesService = inject(PreferencesService);
    
    whatsappNumber = environment.contact.whatsappNumber;

    // Signals
    currentLang = toSignal(this.preferencesService.language$, { initialValue: 'es' });
    
    // Computed Content based on Language
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

    ngOnInit() {
        this.seoService.setPageData({
            title: 'Soluciones Tecnológicas Integrales | Arecofix Servicios',
            description: 'Experiencia y tecnología al servicio de tu empresa. Desarrollo de Software, Soporte IT, Ciberseguridad y Reparación de Hardware Especializada.',
            imageUrl: 'assets/img/branding/og-services.jpg'
        });
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
