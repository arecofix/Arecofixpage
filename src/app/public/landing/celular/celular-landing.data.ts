export const SPECIAL_OFFERS = [
    {
      image: 'assets/img/products/a06.webp',
      name: 'Samsung Galaxy A06',
      description: 'Lo último de Samsung | Diseño Elegante | $320',
      price: '$320',
      category: 'Celulares',
      link: '/productos',
    },
    {
      image: 'assets/img/products/arreglo-consolas.webp',
      name: 'Auriculares P9 Pro Max',
      description: 'Sonido Premium | Cancelación de Ruido | $19.000',
      price: '$19000',
      category: 'Celulares',
      link: '/productos',
    },
    {
      image: 'assets/img/products/servicio-tecnico-consolas.webp',
      name: 'Parlante Cargador Inalámbrico',
      description: '2 en 1: Bluetooth + Carga Qi | Sonido 360° | $27.000',
      price: '$27000',
      category: 'Celulares',
      link: '/productos',
    },
    {
      image: 'assets/img/products/reparacion-consolas.webp',
      name: 'Joystick Play Station 4',
      description: 'Original Sony PS4 | Precisión Total | $47.800',
      price: '$47800',
      category: 'Consoles',
      link: '/productos',
    },
  ];

export const TECH_BEST = [
    {
      image: 'assets/img/products/sam.webp',
      name: 'Samsung Galaxy A31',
      description: 'Oportunidad: Pantalla Super AMOLED | Azul | $79.000',
      price: '$79000',
      category: 'Celulares',
      link: '/productos',
    },
    {
      image: 'assets/img/products/iphx.webp',
      name: 'iPhone X',
      description: 'Diseño Todo Pantalla | Face ID | ¡Consultar Precio!',
      price: 'Consultar',
      category: 'Celulares',
      link: '/productos',
    },
    {
      image: 'assets/img/products/iph8plus.webp',
      name: 'iPhone 8 Plus',
      description: 'Clásico Potente | Doble Cámara | $290 USD',
      price: '$290 USD',
      category: 'Celulares',
      link: '/productos',
    },
    {
      image: 'assets/img/products/motorola.webp',
      name: 'Motorola Moto E22',
      description: 'Parlantes Stereo Dolby Atmos | 90Hz | $69.800',
      price: '$69800',
      category: 'Celulares',
      link: '/productos',
    },
    {
      image: 'assets/img/products/j2.webp',
      name: 'Samsung Galaxy J2 Prime',
      description: 'Económico y Funcional | Ideal Primer Celular | Consultar',
      price: 'Consultar',
      category: 'Celulares',
      link: '/productos',
    },
  ];

export const COURSES_LIST = [
    {
      img: 'assets/img/cursos/egresado-2025.jpg',
      title: 'Tobias Marchi',
      subtitle: 'Egresado 2025',
      slug: '',
    },
    {
      img: 'assets/img/cursos/alumno3.jpg',
      title: 'Curso Inicial',
      subtitle: 'Nivel Principiante',
      duration: '3 Meses',
      days: 'Sábados 10hs',
      slug: 'reparacion-celulares-basico',
    },
    {
      img: 'assets/img/cursos/alumno2.jpg',
      title: 'Curso Avanzado',
      subtitle: 'Microelectrónica',
      duration: '4 Meses',
      days: 'Miércoles 18hs',
      slug: 'curso-avanzado-microelectronica',
    },
    {
      img: 'assets/img/cursos/aprendizaje-practico.jpg',
      title: 'Aprendizaje Práctico',
      subtitle: '85% práctica - 15% teoría',
      duration: '',
      days: '',
      slug: 'aprendizaje-practico',
    },
  ];

export const FAQS = [
        {
            question: '¿Cuánto tiempo tarda la reparación de un celular?',
            answer: 'La mayoría de las reparaciones como cambio de módulo (pantalla) o batería se realizan en el día, generalmente entre 1 a 3 horas.'
        },
        {
            question: '¿Tienen garantía los arreglos?',
            answer: 'Sí, todas nuestras reparaciones cuentan con garantía escrita de 30 a 90 días sobre el repuesto y la mano de obra.'
        },
        {
            question: '¿Se pierden mis datos al reparar el equipo?',
            answer: 'No. En cambios de pantalla, batería y reparaciones de hardware, tus fotos y datos permanecen intactos.'
        },
        {
            question: '¿Aceptan tarjetas de crédito/débito?',
            answer: 'Sí, aceptamos efectivo, transferencia, tarjetas de crédito y débito, y Mercado Pago.'
        }
    ];

export const REVIEWS = [
        {
            name: 'Marcela Pita',
            date: 'hace 2 días',
            stars: 5,
            initial: 'M',
            bgColor: 'bg-orange-500',
            text: 'La verdad exelente trabajo ,responsable muy educado y sobre todo muy honesto Gracias Ezequiel !!!!!'
        },
        {
            name: 'Martín Rodriguez',
            date: 'hace 1 semana',
            stars: 5,
            initial: 'M',
            bgColor: 'bg-blue-600',
            text: 'Fui por un problema de carga en mi iPhone 11. Pensé que era el pin de carga pero me lo limpiaron y funcionó perfecto. Honestidad total, no me cobraron de más.'
        },
        {
            name: 'Sofía Mendez',
            date: 'hace 3 semanas',
            stars: 4,
            initial: 'S',
            bgColor: 'bg-green-600',
            text: 'Buena atención y rapidez. Compré un cargador original y funciona bárbaro. Lo único que hay un poco de espera, pero vale la pena.'
        },
        {
            name: 'Carlos Alberto',
            date: 'hace 1 mes',
            stars: 5,
            initial: 'C',
            bgColor: 'bg-green-600',
            text: 'Llevé una notebook y un celular. Los dos quedaron perfectos. Son técnicos de verdad, saben lo que hacen. El local está muy bien puesto.'
        }
    ];

export const PROCESS_STEPS = [
        {
            title: '1. Recepción',
            desc: 'Traés tu equipo a nuestra sede. Te generamos una orden de servicio única.',
            icon: 'fas fa-store',
            color: 'text-indigo-600',
            bg: 'bg-white'
        },
        {
            title: '2. Reparación',
            desc: 'Experiencia pura. Nuestros técnicos trabajan en tu equipo con repuestos de calidad.',
            icon: 'fas fa-tools',
            color: 'text-indigo-400',
            bg: 'bg-gray-800'
        },
        {
            title: '3. Seguimiento App',
            desc: '¡Exclusivo! Seguí el estado de tu reparación en tiempo real desde nuestra App web.',
            icon: 'fas fa-mobile-alt',
            color: 'text-green-400',
            bg: 'bg-gray-800'
        },
        {
            title: '4. A Disfrutar',
            desc: 'Retirás tu equipo funcionando como nuevo y con garantía escrita.',
            icon: 'fas fa-smile-beam',
            color: 'text-yellow-500',
            bg: 'bg-white'
        }
    ];

export const GALLERY_ITEMS = [
        { type: 'video', src: 'assets/img/repair/4.mp4', poster: 'assets/img/repair/iphone.jpg', alt: 'Reparación iPhone', span: 'col-span-2 row-span-2' },
        { type: 'image', src: 'assets/img/repair/13.jpg', alt: 'Diagnóstico avanzado', span: '' },
        { type: 'image', src: 'assets/img/repair/1.jpg', alt: 'Laboratorio técnico', span: '' },
        { type: 'image', src: 'assets/img/repair/19.jpg', alt: 'Microsoldadura profesional', span: '' },
        { type: 'image', src: 'assets/img/repair/3.jpg', alt: 'Cambio de pantalla', span: '' }
    ];

export const PARTNERS = [
        { name: 'MobiDoc', icon: 'fas fa-user-md', color: 'text-cyan-500', url: 'https://mobidoc.com.ar' },
        { name: 'La Clinica de tu celular', icon: 'fas fa-hand-holding-usd', color: 'text-blue-400' },
        { name: 'Doctor de tu celular', icon: 'fas fa-hand-holding-usd', color: 'text-blue-400' }
    ];

export const MENTIONS = [
        { name: 'La Electrónica Online', url: 'https://laelectronicaonline.com.ar/casa-electronica/arecofix-servicio-tecnico-de-celulares-venta-de-repuestos/' },
        { name: 'Municipio Marcos Paz', url: 'https://www.marcospaz.gov.ar/noticias/item/8551-j%C3%B3venes-del-programa-envi%C3%B3n-finalizaron-el-curso-de-reparaci%C3%B3n-de-celulares.html' },
        { name: 'A1 Noticias', url: 'https://a1noticias.com.ar/nota/9798/marcos-paz-jovenes-del-programa-envion-finalizaron-el-curso-de-reparacion-de-celulares' },
        { name: 'Mobidoc', url: 'https://mobidoc.com.ar/servicio-tecnico/arecofix-soluciones-digitales/' },
        { name: 'Red Argentina', url: 'https://www.redargentina.com.ar/arecofix-servicio-tecnico-de-celulares-en-marcos-paz-F120EC10E1AD945' },
        { name: 'Marcos Paz Conectada', url: 'https://noticias.marcospazconectada.com/2023/02/09/termino-el-curso-de-reparacion-de-celulares-del-programa-envion/' }
    ];

export const BLOG_FEATURES = [
        {
             title: 'Servicio Técnico en Marcos Paz',
             desc: 'Conocé en detalle cómo trabajamos y por qué somos los elegidos en la zona.',
             img: 'assets/img/repair/10.jpg',
             link: '/gsm'
        },
        {
             title: 'Cursos de Reparación',
             desc: 'Capacitate con nosotros. Salida laboral inmediata y certificación.',
             img: 'assets/img/cursos/egresado-2025.jpg',
             link: '/academy'
        },
        {
             title: 'Venta de Repuestos',
             desc: 'Catálogo completo de módulos, baterías y herramientas para el técnico.',
             img: 'assets/img/repuestos/1.webp',
             link: '/productos/categoria/repuestos'
        }
    ];

export const APP_INFO = {
        title: 'Llevá Arecofix en tu bolsillo',
        desc: 'Seguí tus reparaciones en tiempo real, pedí presupuestos y accedé a descuentos exclusivos desde nuestra App.',
        features: ['Seguimiento de Orden', 'Historial de Reparaciones', 'Turnos Prioritarios'],
        downloadLink: 'https://play.google.com/store/apps/details?id=com.arecofix.app&hl=es_AR&gl=US'
    };

export const RELATED_SERVICES = [
        {
            title: 'Reparación de Tablets',
            desc: 'Reparación especializada en tablets Android, iPad y Windows.',
            icon: 'fa-tablet-alt',
            link: '/servicios/reparacion-tablets'
        },
        {
            title: 'Reparación de Consolas',
            desc: 'Servicio técnico para PlayStation, Xbox y Nintendo Switch.',
            icon: 'fa-gamepad',
            link: '/servicios/reparacion-de-consolas'
        },
        {
            title: 'Micro Soldadura',
            desc: 'Reparaciones a nivel componente (IC, Pistas) con tecnología de punta.',
            icon: 'fa-microchip',
            link: '/servicios/servicio-tecnico-de-celulares-en-marcos-paz'
        }
    ];
    
 export const LOCATION_DATA = {
        address: 'Jorge Newbery 69, Marcos Paz, Bs. As.',
        hours: 'Lun a Sab: 09:00 - 13:00 / 16:00 - 20:00',
        phone: '11 2596-0900',
        mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3277.539502732569!2d-58.81797292339245!3d-34.76719126615129!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95bceb46770c86eb%3A0x73b48d51a83e8107!2sARECOFIX%20Servicio%20t%C3%A9cnico%20de%20celulares%20%7C%20Venta%20de%20Repuestos.!5e0!3m2!1ses-419!2sar!4v1771631396545!5m2!1ses-419!2sar'
    };
    
 export const WHY_US = [
        {
            title: '7+ Años de Experiencia',
            desc: 'Conocemos cada tornillo de tu equipo. Trayectoria comprobable en Marcos Paz.',
            icon: 'fas fa-medal',
            color: 'text-blue-600',
            bg: 'bg-blue-100'
        },
        {
            title: 'Garantía Real (30-90 días)',
            desc: 'Te damos un comprobante escrito. Si algo falla, respondemos sin vueltas.',
            icon: 'fas fa-shield-alt',
            color: 'text-green-600',
            bg: 'bg-green-100'
        },
        {
            title: 'Laboratorio Propio',
            desc: 'Tu equipo no "viaja" a otros lados. Se repara acá, con nuestras herramientas.',
            icon: 'fas fa-microscope',
            color: 'text-green-600',
            bg: 'bg-green-100'
        }
    ];
    
 export const SEO_CONTENT = {
        title: 'Servicio Técnico y Arreglo de Celulares en Marcos Paz',
        intro: '¿Buscas donde arreglar tu celular cerca de Marcos Paz? En Arecofix somos líderes en reparación de celulares en Marcos Paz, ofreciendo un servicio rápido, transparente y garantizado. No importa si tenés un iPhone, Samsung, Motorola o Xiaomi, nuestros técnicos certificados están listos para ayudarte.',
        sections: [
            {
                title: 'Expertos en Reparación de Celulares',
                content: 'Sabemos lo importante que es tu dispositivo para vos. Por eso, nos especializamos en brindar soluciones efectivas para todo tipo de fallas. Desde un simple cambio de módulo hasta reparaciones complejas de microelectrónica. Si necesitás un arreglo de celulares en Marcos Paz de confianza, somos tu mejor opción. Usamos repuestos originales y premium para asegurar la durabilidad de tu equipo.'
            },
            {
                title: '¿Por qué elegir Arecofix en Marcos Paz?',
                content: 'Nos destacamos por nuestra honestidad y profesionalismo. Te ofrecemos un diagnóstico sin cargo para que sepas exactamente qué tiene tu equipo antes de invertir. Además, todas nuestras reparaciones cuentan con garantía escrita de hasta 3 meses. No busques más "donde arreglar mi celular", vení a Arecofix en Jorge Newbery 69.'
            }
        ],
        features: [
            { label: 'Reparaciones en el día:', value: 'La mayoría de los cambios de pantalla y batería se realizan en menos de 2 horas.' },
            { label: 'Precios Competitivos:', value: 'La mejor relación precio-calidad en servicio técnico de la zona.' },
            { label: 'Atención Personalizada:', value: 'Te mantenemos informado del estado de tu reparación vía WhatsApp.' },
            { label: 'Venta de Accesorios:', value: 'Protegé tu inversión con nuestras fundas y vidrios templados de alta calidad.' }
        ]
    };
