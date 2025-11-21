import { Component } from '@angular/core';


@Component({
    selector: 'app-servicios',
    standalone: true,
    imports: [],
    templateUrl: './servicios.html',
    styleUrl: './servicios.scss'
})
export class ServiciosComponent {
    services = [
        {
            id: 1,
            title: 'Reparación de Smartphones',
            description: 'Servicio técnico especializado en todas las marcas: Samsung, iPhone, Motorola, Xiaomi, y más.',
            icon: 'fa-mobile-alt',
            features: [
                'Cambio de pantallas y displays',
                'Reemplazo de baterías',
                'Reparación de placas madre',
                'Actualización de software',
                'Liberación de equipos'
            ],
            price: 'Desde $5,000',
            image: 'assets/img/products/sam.webp'
        },
        {
            id: 2,
            title: 'Reparación de Consolas',
            description: 'Servicio técnico para PlayStation, Xbox, Nintendo Switch y consolas retro.',
            icon: 'fa-gamepad',
            features: [
                'Limpieza profunda y mantenimiento',
                'Cambio de lectores ópticos',
                'Reparación de HDMI',
                'Actualización de firmware',
                'Cambio de pasta térmica'
            ],
            price: 'Desde $8,000',
            image: 'assets/img/cursos/pro.webp'
        },
        {
            id: 3,
            title: 'Reparación de Tablets',
            description: 'Reparación especializada en tablets Android, iPad y Windows.',
            icon: 'fa-tablet-alt',
            features: [
                'Cambio de pantallas táctiles',
                'Reparación de conectores de carga',
                'Reemplazo de baterías',
                'Actualización de sistema operativo',
                'Recuperación de datos'
            ],
            price: 'Desde $6,000',
            image: 'assets/img/cursos/iph2.jpg'
        },
        {
            id: 4,
            title: 'Desarrollo de Software',
            description: 'Creamos soluciones web y móviles personalizadas para tu negocio.',
            icon: 'fa-code',
            features: [
                'Desarrollo de aplicaciones web',
                'Aplicaciones móviles (Android/iOS)',
                'E-commerce y tiendas online',
                'Sistemas de gestión empresarial',
                'Mantenimiento y soporte'
            ],
            price: 'Cotización personalizada',
            image: 'assets/img/cursos/laboratorio.webp'
        },
        {
            id: 5,
            title: 'Micro Soldadura',
            description: 'Reparaciones a nivel componente con tecnología de punta.',
            icon: 'fa-microchip',
            features: [
                'Reballing de chips',
                'Reparación de pistas',
                'Cambio de IC de carga',
                'Reparación de Face ID',
                'Recuperación de datos'
            ],
            price: 'Desde $10,000',
            image: 'assets/img/cursos/laboratorio.jpg'
        },
        {
            id: 6,
            title: 'Mantenimiento Preventivo',
            description: 'Servicio de mantenimiento para prolongar la vida útil de tus dispositivos.',
            icon: 'fa-tools',
            features: [
                'Limpieza interna completa',
                'Optimización de software',
                'Actualización de sistema',
                'Backup de datos',
                'Diagnóstico completo'
            ],
            price: 'Desde $3,000',
            image: 'assets/img/cursos/local.webp'
        }
    ];

    process = [
        { step: 1, title: 'Diagnóstico', description: 'Evaluamos tu dispositivo sin cargo', icon: 'fa-search' },
        { step: 2, title: 'Presupuesto', description: 'Te enviamos un presupuesto detallado', icon: 'fa-file-invoice-dollar' },
        { step: 3, title: 'Reparación', description: 'Realizamos el trabajo con garantía', icon: 'fa-wrench' },
        { step: 4, title: 'Entrega', description: 'Probamos y entregamos tu equipo', icon: 'fa-check-circle' }
    ];
}
