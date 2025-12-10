import { Component } from '@angular/core';
import { environment } from '../../../environments/environment';
import { PreferencesService } from '../../shared/services/preferences.service';
import { CommonModule } from '@angular/common';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

interface Service {
    id: number;
    title: string;
    description: string;
    icon: string;
    features: string[];
    price: string;
    image: string;
    link?: string;
}

interface ProcessStep {
    step: number;
    title: string;
    description: string;
    icon: string;
}

interface Guarantee {
    icon: string;
    title: string;
    description: string;
}

interface ServiciosContent {
    heroTitle: string;
    heroSubtitle: string;
    heroDescription: string;
    heroCtaWhatsapp: string;
    heroCtaAll: string;
    processTitle: string;
    process: ProcessStep[];
    servicesTitle: string;
    servicesDescription: string;
    services: Service[];
    servicesCta: string;
    guarantees: Guarantee[];
    ctaTitle: string;
    ctaDescription: string;
    ctaWhatsapp: string;
    ctaForm: string;
}

@Component({
    selector: 'app-servicios',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './servicios.html',
    styleUrl: './servicios.scss'
})
export class ServiciosComponent {
    whatsappNumber = environment.contact.whatsappNumber;

    serviciosContent: { en: ServiciosContent; es: ServiciosContent } = {
        es: {
            heroTitle: 'Servicios Técnicos',
            heroSubtitle: 'Profesionales',
            heroDescription: 'Reparación especializada de smartphones, tablets, consolas y desarrollo de software',
            heroCtaWhatsapp: 'Solicitar Servicio',
            heroCtaAll: 'Ver Todos los Servicios',
            processTitle: 'Nuestro Proceso',
            process: [
                { step: 1, title: 'Diagnóstico', description: 'Evaluamos tu dispositivo sin cargo', icon: 'fa-search' },
                { step: 2, title: 'Presupuesto', description: 'Te enviamos un presupuesto detallado', icon: 'fa-file-invoice-dollar' },
                { step: 3, title: 'Reparación', description: 'Realizamos el trabajo con garantía', icon: 'fa-wrench' },
                { step: 4, title: 'Entrega', description: 'Probamos y entregamos tu equipo', icon: 'fa-check-circle' }
            ],
            servicesTitle: 'Nuestros Servicios',
            servicesDescription: 'Soluciones técnicas profesionales con garantía y atención personalizada',
            services: [
                {
                    id: 1,
                    title: 'Reparación de Celulares',
                    description: 'Servicio técnico especializado en todas las marcas: Samsung, iPhone, Motorola, Xiaomi, y más.',
                    icon: 'fa-mobile-alt',
                    features: ['Cambio de pantallas y displays', 'Reemplazo de baterías', 'Reparación de placas madre', 'Actualización de software', 'Liberación de equipos'],
                    price: 'Desde $5,000',
                    image: 'assets/img/products/sam.webp',
                    link: '/#/posts/servicio-tcnico-de-celulares-en-marcos-paz'
                },
                {
                    id: 2,
                    title: 'Reparación de Consolas',
                    description: 'Servicio técnico para PlayStation, Xbox, Nintendo Switch y consolas retro.',
                    icon: 'fa-gamepad',
                    features: ['Limpieza profunda y mantenimiento', 'Cambio de lectores ópticos', 'Reparación de HDMI', 'Actualización de firmware', 'Cambio de pasta térmica'],
                    price: 'Desde $8,000',
                    image: 'assets/img/cursos/pro.webp'
                },
                {
                    id: 3,
                    title: 'Reparación de Tablets',
                    description: 'Reparación especializada en tablets Android, iPad y Windows.',
                    icon: 'fa-tablet-alt',
                    features: ['Cambio de pantallas táctiles', 'Reparación de conectores de carga', 'Reemplazo de baterías', 'Actualización de sistema operativo', 'Recuperación de datos'],
                    price: 'Desde $6,000',
                    image: 'assets/img/cursos/iph2.jpg'
                },
                {
                    id: 4,
                    title: 'Desarrollo de Software',
                    description: 'Creamos soluciones web y móviles personalizadas para tu negocio.',
                    icon: 'fa-code',
                    features: ['Desarrollo de aplicaciones web', 'Aplicaciones móviles (Android/iOS)', 'E-commerce y tiendas online', 'Sistemas de gestión empresarial', 'Mantenimiento y soporte'],
                    price: 'Cotización personalizada',
                    image: 'assets/img/cursos/laboratorio.webp'
                },
                {
                    id: 5,
                    title: 'Micro Soldadura',
                    description: 'Reparaciones a nivel componente con tecnología de punta.',
                    icon: 'fa-microchip',
                    features: ['Reballing de chips', 'Reparación de pistas', 'Cambio de IC de carga', 'Reparación de Face ID', 'Recuperación de datos'],
                    price: 'Desde $10,000',
                    image: 'assets/img/cursos/laboratorio.jpg'
                },
                {
                    id: 6,
                    title: 'Mantenimiento Preventivo',
                    description: 'Servicio de mantenimiento para prolongar la vida útil de tus dispositivos.',
                    icon: 'fa-tools',
                    features: ['Limpieza interna completa', 'Optimización de software', 'Actualización de sistema', 'Backup de datos', 'Diagnóstico completo'],
                    price: 'Desde $3,000',
                    image: 'assets/img/cursos/local.webp'
                },
                {
                    id: 7,
                    title: 'Instalación de Cámaras de Seguridad',
                    description: 'Sistemas de vigilancia para hogares y comercios.',
                    icon: 'fa-video',
                    features: ['Instalación de cámaras IP y CCTV', 'Configuración de DVR/NVR', 'Monitoreo remoto', 'Mantenimiento de sistemas', 'Asesoramiento de seguridad'],
                    price: 'Consultar',
                    image: 'assets/img/cursos/local.webp'
                },
                {
                    id: 8,
                    title: 'Electricidad y Plomería',
                    description: 'Soluciones integrales para el hogar y la industria.',
                    icon: 'fa-bolt',
                    features: ['Instalaciones eléctricas', 'Reparaciones de plomería', 'Mantenimiento general', 'Urgencias 24hs', 'Certificaciones'],
                    price: 'Consultar',
                    image: 'assets/img/cursos/local.webp'
                },
                {
                    id: 9,
                    title: 'Trading',
                    description: 'Aprende a operar en los mercados financieros.',
                    icon: 'fa-chart-line',
                    features: ['Cursos introductorios', 'Análisis técnico', 'Gestión de riesgo', 'Psicotrading', 'Mentoria personalizada'],
                    price: 'Consultar',
                    image: 'assets/img/cursos/pro.webp'
                },
                {
                    id: 10,
                    title: 'Creación de Sitios Web',
                    description: 'Tu presencia online profesional y efectiva.',
                    icon: 'fa-laptop-code',
                    features: ['Diseño web responsive', 'Tiendas online (E-commerce)', 'Landing pages', 'Optimización SEO', 'Integración con redes sociales'],
                    price: 'Consultar',
                    image: 'assets/img/cursos/laboratorio.webp'
                },
                {
                    id: 11,
                    title: 'Reparación de Impresoras',
                    description: 'Servicio técnico especializado para impresoras láser, inkjet y matriciales.',
                    icon: 'fa-print',
                    features: ['Limpieza de cabezales', 'Reparación de sistema continuo', 'Cambio de rodillos', 'Mantenimiento preventivo', 'Configuración de red'],
                    price: 'Desde $12,000',
                    image: 'assets/img/cursos/local.webp'
                }
            ],
            servicesCta: 'Solicitar Ahora',
            guarantees: [
                { icon: 'fa-shield-alt', title: 'Garantía de 30 Días', description: 'Todas nuestras reparaciones incluyen garantía escrita' },
                { icon: 'fa-clock', title: 'Servicio Rápido', description: 'La mayoría de reparaciones en 24-48 horas' },
                { icon: 'fa-certificate', title: 'Técnicos Certificados', description: 'Personal capacitado y con años de experiencia' }
            ],
            ctaTitle: '¿Necesitas reparar tu dispositivo?',
            ctaDescription: 'Contáctanos ahora y obtén un diagnóstico gratuito',
            ctaWhatsapp: 'Diagnóstico Gratuito',
            ctaForm: 'Formulario de Contacto'
        },
        en: {
            heroTitle: 'Technical Services',
            heroSubtitle: 'Professionals',
            heroDescription: 'Specialized repair of smartphones, tablets, consoles, and software development',
            heroCtaWhatsapp: 'Request Service',
            heroCtaAll: 'View All Services',
            processTitle: 'Our Process',
            process: [
                { step: 1, title: 'Diagnosis', description: 'We evaluate your device free of charge', icon: 'fa-search' },
                { step: 2, title: 'Quote', description: 'We send you a detailed quote', icon: 'fa-file-invoice-dollar' },
                { step: 3, title: 'Repair', description: 'We perform the work with warranty', icon: 'fa-wrench' },
                { step: 4, title: 'Delivery', description: 'We test and deliver your equipment', icon: 'fa-check-circle' }
            ],
            servicesTitle: 'Our Services',
            servicesDescription: 'Professional technical solutions with warranty and personalized attention',
            services: [
                {
                    id: 1,
                    title: 'Cell Phone Repair',
                    description: 'Specialized technical service for all brands: Samsung, iPhone, Motorola, Xiaomi, and more.',
                    icon: 'fa-mobile-alt',
                    features: ['Screen and display replacement', 'Battery replacement', 'Motherboard repair', 'Software update', 'Unlocking'],
                    price: 'From $5,000',
                    image: 'assets/img/products/sam.webp',
                    link: '/#/posts/servicio-tcnico-de-celulares-en-marcos-paz'
                },
                {
                    id: 2,
                    title: 'Console Repair',
                    description: 'Technical service for PlayStation, Xbox, Nintendo Switch, and retro consoles.',
                    icon: 'fa-gamepad',
                    features: ['Deep cleaning and maintenance', 'Optical drive replacement', 'HDMI repair', 'Firmware update', 'Thermal paste replacement'],
                    price: 'From $8,000',
                    image: 'assets/img/cursos/pro.webp'
                },
                {
                    id: 3,
                    title: 'Tablet Repair',
                    description: 'Specialized repair for Android tablets, iPad, and Windows.',
                    icon: 'fa-tablet-alt',
                    features: ['Touch screen replacement', 'Charging port repair', 'Battery replacement', 'OS update', 'Data recovery'],
                    price: 'From $6,000',
                    image: 'assets/img/cursos/iph2.jpg'
                },
                {
                    id: 4,
                    title: 'Software Development',
                    description: 'We create custom web and mobile solutions for your business.',
                    icon: 'fa-code',
                    features: ['Web application development', 'Mobile apps (Android/iOS)', 'E-commerce and online stores', 'Business management systems', 'Maintenance and support'],
                    price: 'Custom Quote',
                    image: 'assets/img/cursos/laboratorio.webp'
                },
                {
                    id: 5,
                    title: 'Micro Soldering',
                    description: 'Component-level repairs with state-of-the-art technology.',
                    icon: 'fa-microchip',
                    features: ['Chip reballing', 'Trace repair', 'Charging IC replacement', 'Face ID repair', 'Data recovery'],
                    price: 'From $10,000',
                    image: 'assets/img/cursos/laboratorio.jpg'
                },
                {
                    id: 6,
                    title: 'Preventive Maintenance',
                    description: 'Maintenance service to prolong the lifespan of your devices.',
                    icon: 'fa-tools',
                    features: ['Complete internal cleaning', 'Software optimization', 'System update', 'Data backup', 'Full diagnosis'],
                    price: 'From $3,000',
                    image: 'assets/img/cursos/local.webp'
                },
                {
                    id: 7,
                    title: 'Security Camera Installation',
                    description: 'Surveillance systems for homes and businesses.',
                    icon: 'fa-video',
                    features: ['IP and CCTV camera installation', 'DVR/NVR configuration', 'Remote monitoring', 'System maintenance', 'Security advice'],
                    price: 'Consult',
                    image: 'assets/img/cursos/local.webp'
                },
                {
                    id: 8,
                    title: 'Electricity and Plumbing',
                    description: 'Comprehensive solutions for home and industry.',
                    icon: 'fa-bolt',
                    features: ['Electrical installations', 'Plumbing repairs', 'General maintenance', '24h emergencies', 'Certifications'],
                    price: 'Consult',
                    image: 'assets/img/cursos/local.webp'
                },
                {
                    id: 9,
                    title: 'Trading',
                    description: 'Learn to trade in financial markets.',
                    icon: 'fa-chart-line',
                    features: ['Introductory courses', 'Technical analysis', 'Risk management', 'Psychotrading', 'Personalized mentorship'],
                    price: 'Consult',
                    image: 'assets/img/cursos/pro.webp'
                },
                {
                    id: 10,
                    title: 'Website Creation',
                    description: 'Your professional and effective online presence.',
                    icon: 'fa-laptop-code',
                    features: ['Responsive web design', 'Online stores (E-commerce)', 'Landing pages', 'SEO optimization', 'Social media integration'],
                    price: 'Consult',
                    image: 'assets/img/cursos/laboratorio.webp'
                },
                {
                    id: 11,
                    title: 'Printer Repair',
                    description: 'Specialized technical service for laser, inkjet, and dot matrix printers.',
                    icon: 'fa-print',
                    features: ['Printhead cleaning', 'CISS repair', 'Roller replacement', 'Preventive maintenance', 'Network configuration'],
                    price: 'From $12,000',
                    image: 'assets/img/cursos/local.webp'
                }
            ],
            servicesCta: 'Request Now',
            guarantees: [
                { icon: 'fa-shield-alt', title: '30-Day Warranty', description: 'All our repairs include a written warranty' },
                { icon: 'fa-clock', title: 'Fast Service', description: 'Most repairs in 24-48 hours' },
                { icon: 'fa-certificate', title: 'Certified Technicians', description: 'Trained staff with years of experience' }
            ],
            ctaTitle: 'Need to repair your device?',
            ctaDescription: 'Contact us now and get a free diagnosis',
            ctaWhatsapp: 'Free Diagnosis',
            ctaForm: 'Contact Form'
        }
    };

    content$: Observable<ServiciosContent>;

    constructor(public preferencesService: PreferencesService) {
        this.content$ = this.preferencesService.language$.pipe(
            map(lang => this.serviciosContent[lang])
        );
    }
}
