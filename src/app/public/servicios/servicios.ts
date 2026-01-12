import { Component, inject, OnInit } from '@angular/core';
import { SeoService } from '../../shared/services/seo.service';
import { environment } from '../../../environments/environment';
import { PreferencesService } from '../../shared/services/preferences.service';
import { CommonModule } from '@angular/common';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
/* Import Data */
import { Service, SERVICIOS_CONTENT, ServiciosContent } from './servicios.data';

@Component({
    selector: 'app-servicios',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './servicios.html',
    styleUrl: './servicios.scss'
})
export class ServiciosComponent implements OnInit {
    whatsappNumber = environment.contact.whatsappNumber;
    private seoService = inject(SeoService);

    ngOnInit() {
        this.seoService.setSeoData({
            title: 'Servicios Técnicos Especializados | Arecofix',
            description: 'Reparación de celulares, consolas, tablets y desarrollo de software. Soluciones profesionales en Marcos Paz con garantía escrita.',
            keywords: 'servicios tecnicos, reparacion celulares, consolas, tablets, desarrollo software, marcos paz, arecofix, micro soldadura',
            ogTitle: 'Servicios Profesionales Arecofix',
            ogDescription: 'Descubre nuestra gama de servicios técnicos y digitales. Diagnóstico sin cargo.',
            ogImage: 'assets/img/branding/og-services.jpg',
            ogUrl: `${environment.baseUrl}/#/servicios`
        });
    }

    content$: Observable<ServiciosContent>;

    // Modal State
    public showModal = false;
    public selectedService: Service | null = null;
    
    // Exact list provided by user for the modal
    public otherServicesList = [
        'Reparación de Electrónica',
        'Diagnóstico Eléctrico y Electrónico de Ecus AutoMotriz',
        'Electricidad de Motos',
        'Alquiler de Trajes',
        'Desarrollo de Software a Medida'
    ];

    constructor(public preferencesService: PreferencesService) {
        this.content$ = this.preferencesService.language$.pipe(
            map(lang => SERVICIOS_CONTENT[lang])
        );
    }

    openService(service: Service, event: Event) {
        // If it's the "Other Services" card (ID 12), open modal
        if (service.id === 12) {
            event.preventDefault();
            this.selectedService = service;
            this.showModal = true;
        }
    }

    closeModal() {
        this.showModal = false;
        this.selectedService = null;
    }
}

