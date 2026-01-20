import { environment } from '../../../environments/environment';

export interface Service {
    id: number;
    title: string;
    slug?: string;
    description: string;
    icon: string;
    features: string[];
    price: string;
    image: string;
    link?: string;
}

export interface ProcessStep {
    step: number;
    title: string;
    description: string;
    icon: string;
  }

export interface Guarantee {
    icon: string;
    title: string;
    description: string;
}

export interface ServiciosContent {
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

export const SERVICIOS_CONTENT: { en: ServiciosContent; es: ServiciosContent } = {
    es: {
        heroTitle: 'Servicios de Consultoría & Tecnología',
        heroSubtitle: 'Soluciones Empresariales',
        heroDescription: 'Desde Inteligencia Artificial hasta Reparación de Hardware Crítico. Un ecosistema completo para tu negocio.',
        heroCtaWhatsapp: 'Hablar con Especialista',
        heroCtaAll: 'Explorar Servicios',
        processTitle: 'Metodología de Servicios',
        process: [
            { step: 1, title: 'Análisis', description: 'Evaluamos tus necesidades y objetivos comerciales', icon: 'fa-chart-pie' },
            { step: 2, title: 'Estrategia', description: 'Diseñamos la solución técnica más eficiente', icon: 'fa-chess-board' },
            { step: 3, title: 'Ejecución', description: 'Desarrollo e implementación ágil', icon: 'fa-rocket' },
            { step: 4, title: 'Soporte', description: 'Mantenimiento y mejora continua', icon: 'fa-headset' }
        ],
        servicesTitle: 'Catálogo de Soluciones',
        servicesDescription: 'Ingeniería de software de clase mundial y soporte técnico especializado.',
        services: [
            {
                id: 101,
                title: 'Instalación de Cámaras de Seguridad',
                slug: 'instalacion-camaras-seguridad',
                description: 'Sistemas de videovigilancia CCTV e IP. Monitoreo remoto 24/7.',
                icon: 'fa-video',
                features: ['Cámaras IP/WiFi', 'Configuración DVR/NVR', 'Acceso Móvil', 'Detección de Movimiento', 'Mantenimiento'],
                price: 'A Medida',
                image: 'assets/img/services/software-illustration.png',
                link: '/servicios/instalacion-camaras-seguridad'
            },
            {
                id: 102,
                title: 'Electricidad y Plomería',
                slug: 'electricidad-plomeria',
                description: 'Servicios integrales de mantenimiento y urgencias para hogar y comercio.',
                icon: 'fa-tools',
                features: ['Instalaciones Eléctricas', 'Reparación de Fugas', 'Tableros', 'Grifería', 'Urgencias 24hs'],
                price: 'A Medida',
                image: 'assets/img/services/repair-illustration.png',
                link: '/servicios/electricidad-plomeria'
            },
            {
                id: 103,
                title: 'Reparación de Drones',
                slug: 'reparacion-drones',
                description: 'Servicio técnico especializado para drones DJI y multirrotores.',
                icon: 'fa-helicopter',
                features: ['Calibración de Gimbal', 'Reemplazo de Motores', 'Actualización de Firmware', 'Reparación de Carcasas', 'Diagnóstico de Vuelo'],
                price: 'Consultar',
                image: 'assets/img/services/repair-illustration.png',
                link: '/servicios/reparacion-drones'
            },
            {
                id: 104,
                title: 'Diagnóstico y Reparación de Ecus Automotriz',
                slug: 'reparacion-ecus',
                description: 'Laboratorio electrónico automotriz. Reprogramación y clonación.',
                icon: 'fa-car-battery',
                features: ['Diagnóstico por Scanner', 'Reprogramación (Chiptuning)', 'Clonación de ECUs', 'Inmovilizadores', 'Airbag Reset'],
                price: 'Consultar',
                image: 'assets/img/services/repair-illustration.png',
                link: '/servicios/reparacion-ecus'
            },
            {
                id: 105,
                title: 'Electricidad de Motos',
                slug: 'electricidad-motos',
                description: 'Soluciones eléctricas especializadas para motocicletas de todas las cilindradas.',
                icon: 'fa-motorcycle',
                features: ['Bobinados', 'Encendido Electrónico', 'Luces LED', 'Baterías', 'Sistemas de Carga'],
                price: 'Consultar',
                image: 'assets/img/services/repair-illustration.png',
                link: '/servicios/electricidad-motos'
            },
            {
                id: 4,
                title: 'Desarrollo de Aplicaciones a Medida',
                slug: 'desarrollo-de-software',
                description: 'Desarrollo de aplicaciones web y móviles escalables para startups y corporaciones.',
                icon: 'fa-mobile-alt',
                features: ['Apps Móviles (iOS/Android)', 'Plataformas Web (Angular/React)', 'Sistemas de Gestión (ERP/CRM)', 'APIs & Microservicios', 'Modernización de Legacy'],
                price: 'A Medida',
                image: 'assets/img/cursos/laboratorio.webp',
                link: '/servicios/desarrollo-de-software'
            },
            {
                id: 20,
                title: 'Consultoría en Inteligencia Artificial',
                slug: 'consultoria-ia',
                description: 'Implementación de LLMs, Chatbots y Automatización Inteligente para empresas.',
                icon: 'fa-brain',
                features: ['Integración OpenAI/DeepSeek', 'Agentes Autónomos', 'Análisis Predictivo', 'Automatización de Procesos', 'RPA'],
                price: 'Consultar',
                image: 'assets/img/services/academy-illustration.png',
                link: '/servicios/consultoria-ia'
            },
            {
                id: 22,
                title: 'Cloud & DevOps',
                slug: 'cloud-devops',
                description: 'Arquitectura en la nube y optimización de infraestructura.',
                icon: 'fa-cloud',
                features: ['Migración AWS/Azure', 'Docker & Kubernetes', 'CI/CD Pipelines', 'Optimización de Costos', 'Seguridad Cloud'],
                price: 'Consultar',
                image: 'assets/img/services/software-illustration.png',
                link: '/servicios/cloud-devops'
            },
            {
                id: 1,
                title: 'Laboratorio de Electronica | Servicio Tecnico de Celulares en Marcos paz',
                slug: 'servicio-tecnico-de-celulares-en-marcos-paz',
                description: 'Servicio técnico especializado en microelectrónica para móviles y laptops.',
                icon: 'fa-microchip',
                features: ['Reparación de Placas', 'Cambio de Pantallas', 'Recuperación de Datos', 'Reballing', 'Soldadura SMD'],
                price: 'Desde $15,000',
                image: 'assets/img/products/sam.webp',
                link: '/posts/servicio-tecnico-de-celulares-en-marcos-paz'
            },
            {
                id: 2,
                title: 'Reparación de Consolas',
                slug: 'reparacion-de-consolas',
                description: 'Servicio técnico para PlayStation, Xbox y Nintendo Switch.',
                icon: 'fa-gamepad',
                features: ['Mantenimiento Térmico', 'Reparación de HDMI', 'Reballing GPU', 'Fuentes de Poder', 'Joysticks'],
                price: 'Desde $12,000',
                image: 'assets/img/cursos/pro.webp',
                link: '/servicios/reparacion-de-consolas'
            }
        ],
        servicesCta: 'Solicitar Cotización',
        guarantees: [
            { icon: 'fa-shield-alt', title: 'Garantía Escrita', description: 'Todos nuestros desarrollos y reparaciones están garantizados.' },
            { icon: 'fa-code-branch', title: 'Código Propio', description: 'Entregamos el código fuente de tu software.' },
            { icon: 'fa-lock', title: 'Seguridad', description: 'Implementamos estándares de ciberseguridad industrial.' }
        ],
        ctaTitle: '¿Listo para escalar tu negocio?',
        ctaDescription: 'Agenda una llamada de 15 minutos gratuita con nuestros expertos.',
        ctaWhatsapp: 'Agendar Llamada',
        ctaForm: 'Solicitar Presupuesto'
    },
    en: {
        heroTitle: 'Tech Consulting & Services',
        heroSubtitle: 'Enterprise Solutions',
        heroDescription: 'From Artificial Intelligence to Critical Hardware Repair. A complete ecosystem for your business.',
        heroCtaWhatsapp: 'Talk to Expert',
        heroCtaAll: 'Explore Services',
        processTitle: 'Service Methodology',
        process: [
            { step: 1, title: 'Analysis', description: 'We evaluate your needs and business goals', icon: 'fa-chart-pie' },
            { step: 2, title: 'Strategy', description: 'We design the most efficient technical solution', icon: 'fa-chess-board' },
            { step: 3, title: 'Execution', description: 'Agile development and implementation', icon: 'fa-rocket' },
            { step: 4, title: 'Support', description: 'Maintenance and continuous improvement', icon: 'fa-headset' }
        ],
        servicesTitle: 'Solutions Catalog',
        servicesDescription: 'World-class software engineering and specialized technical support.',
        services: [
            {
                id: 20,
                title: 'AI Consulting',
                slug: 'consultoria-ia',
                description: 'Implementation of LLMs, Chatbots, and Intelligent Automation for companies.',
                icon: 'fa-brain',
                features: ['OpenAI/DeepSeek Integration', 'Autonomous Agents', 'Predictive Analysis', 'Process Automation', 'RPA'],
                price: 'Consult',
                image: 'assets/img/services/academy-illustration.png',
                link: '/servicios/consultoria-ia'
            },
            {
                id: 4,
                title: 'Software Factory & Apps',
                slug: 'desarrollo-de-software',
                description: 'Development of scalable web and mobile applications for startups and corporations.',
                icon: 'fa-code',
                features: ['Mobile Apps (iOS/Android)', 'Web Platforms (Angular/React)', 'Management Systems (ERP/CRM)', 'APIs & Microservices', 'Legacy Modernization'],
                price: 'Custom',
                image: 'assets/img/cursos/laboratorio.webp',
                link: '/servicios/desarrollo-de-software'
            },
            {
                id: 21,
                title: 'IT Staff Augmentation',
                slug: 'staff-augmentation',
                description: 'We add senior talent to your team in less than 72 hours.',
                icon: 'fa-users',
                features: ['Fullstack Developers', 'DevOps Engineers', 'QA Automation', 'UX/UI Designers', 'Scrum Masters'],
                price: 'Per Hour/Month',
                image: 'assets/img/services/software-illustration.png',
                link: '/servicios/staff-augmentation'
            },
            {
                id: 22,
                title: 'Cloud & DevOps',
                slug: 'cloud-devops',
                description: 'Cloud architecture and infrastructure optimization.',
                icon: 'fa-cloud',
                features: ['AWS/Azure Migration', 'Docker & Kubernetes', 'CI/CD Pipelines', 'Cost Optimization', 'Cloud Security'],
                price: 'Consult',
                image: 'assets/img/services/software-illustration.png',
                link: '/servicios/cloud-devops'
            },
            {
                id: 1,
                title: 'Hardware Lab (Argentina)',
                slug: 'servicio-tecnico-de-celulares-en-marcos-paz',
                description: 'Specialized technical service in microelectronics for mobiles and laptops.',
                icon: 'fa-microchip',
                features: ['Board Repair', 'Screen Replacement', 'Data Recovery', 'Reballing', 'SMD Soldering'],
                price: 'From $15,000',
                image: 'assets/img/products/sam.webp',
                link: '/celular'
            },
            {
                id: 2,
                title: 'Console Repair',
                slug: 'reparacion-de-consolas',
                description: 'Technical service for PlayStation, Xbox, and Nintendo Switch.',
                icon: 'fa-gamepad',
                features: ['Thermal Maintenance', 'HDMI Repair', 'GPU Reballing', 'Power Supplies', 'Controllers'],
                price: 'From $12,000',
                image: 'assets/img/cursos/pro.webp',
                link: '/servicios/reparacion-de-consolas'
            }
        ],
        servicesCta: 'Request Quote',
        guarantees: [
            { icon: 'fa-shield-alt', title: 'Written Warranty', description: 'All our developments and repairs are guaranteed.' },
            { icon: 'fa-code-branch', title: 'Source Code', description: 'We deliver the source code of your software.' },
            { icon: 'fa-lock', title: 'Security', description: 'We implement industrial cybersecurity standards.' }
        ],
        ctaTitle: 'Ready to scale your business?',
        ctaDescription: 'Schedule a free 15-minute call with our experts.',
        ctaWhatsapp: 'Schedule Call',
        ctaForm: 'Request Budget'
    }
};
