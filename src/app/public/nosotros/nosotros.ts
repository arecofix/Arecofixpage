import { Component, OnInit } from '@angular/core';

interface TeamMember {
  name: string;
  role: string;
  bio: string;
  image?: string;
}

interface FAQ {
  question: string;
  answer: string;
  open?: boolean;
}

interface Value {
  title: string;
  description: string;
  icon: string;
}

interface Achievement {
  number: string;
  label: string;
  description: string;
}

@Component({
  selector: 'app-nosotros',
  standalone: true,
  imports: [],
  templateUrl: './nosotros.html',
  styleUrls: ['./nosotros.css']
})
export class NosotrosComponent implements OnInit {
  currentLanguage: 'en' | 'es' = 'es';
  expandedFAQ: number | null = null;

  achievements: Achievement[] = [
    {
      number: '5+',
      label: 'Años de Experiencia',
      description: 'Sirviendo a clientes con excelencia'
    },
    {
      number: '1000+',
      label: 'Clientes Satisfechos',
      description: 'En toda la región'
    },
    {
      number: '500+',
      label: 'Equipos Reparados',
      description: 'Cada mes'
    },
    {
      number: '99%',
      label: 'Satisfacción',
      description: 'De nuestros clientes'
    }
  ];

  values: Value[] = [
    {
      title: 'Confianza',
      description: 'Transparencia total en cada transacción y servicio que brindamos a nuestros clientes.',
      icon: '🤝'
    },
    {
      title: 'Calidad',
      description: 'Excelencia en reparación y venta de productos tecnológicos de primera línea.',
      icon: '⭐'
    },
    {
      title: 'Innovación',
      description: 'Constantemente actualizamos nuestros servicios y productos con la tecnología más reciente.',
      icon: '🚀'
    },
    {
      title: 'Compromiso',
      description: 'Dedicados a resolver tus problemas tecnológicos de manera rápida y eficiente.',
      icon: '💪'
    },
    {
      title: 'Sostenibilidad',
      description: 'Reciclaje responsable de dispositivos electrónicos para cuidar el medio ambiente.',
      icon: '🌱'
    },
    {
      title: 'Comunidad',
      description: 'Apoyamos el crecimiento tecnológico de Buenos Aires y sus alrededores.',
      icon: '🌐'
    }
  ];

  faqs: FAQ[] = [
    {
      question: '¿Cuánto tiempo tarda una reparación?',
      answer: 'El tiempo depende del tipo de daño. Las reparaciones simples (cambio de batería, pantalla) se hacen entre 30 minutos a 2 horas. Las reparaciones más complejas pueden tardar 1-3 días. Siempre te informamos el tiempo estimado antes de comenzar.',
      open: false
    },
    {
      question: '¿Qué garantía tienen sus reparaciones?',
      answer: 'Todas nuestras reparaciones cuentan con garantía de 6 meses en mano de obra y 1 año en piezas de reemplazo. Si el problema persiste dentro de este período, lo reparamos sin costo adicional.',
      open: false
    },
    {
      question: '¿Utilizan piezas originales?',
      answer: 'Utilizamos piezas originales y de primera calidad certificadas. Para algunos modelos también ofrecemos piezas compatibles de excelente calidad a un mejor precio. El cliente siempre elige qué opción prefiere.',
      open: false
    },
    {
      question: '¿Cuál es el costo promedio de una reparación?',
      answer: 'Los costos varían según el dispositivo y el daño. Ofrecemos diagnóstico gratuito para proporcionarte un presupuesto exacto antes de cualquier trabajo. Contamos con opciones para todos los presupuestos.',
      open: false
    },
    {
      question: '¿Venden equipos nuevos o reacondicionados?',
      answer: 'Vendemos equipos nuevos de marcas reconocidas (Samsung, Apple, Xiaomi, etc.) y también ofrecemos equipos reacondicionados con garantía. Todos pasan por riguroso control de calidad.',
      open: false
    },
    {
      question: '¿Realizan reparaciones a domicilio?',
      answer: 'Para casos especiales sí. Consulta sobre nuestro servicio de visitas a domicilio para reparaciones urgentes en equipos de escritorio o situaciones especiales.',
      open: false
    },
    {
      question: '¿Cómo puedo contactar el soporte técnico?',
      answer: 'Puedes contactarnos por WhatsApp, teléfono, email o visitando nuestro local. Respondemos en máximo 2 horas durante horario laboral. Atención de lunes a sábados.',
      open: false
    },
    {
      question: '¿Ofrecen cursos o capacitación?',
      answer: 'Sí, ofrecemos cursos de reparación de celulares y electrónica básica. También brindamos charlas sobre cuidado de equipos. Consulta nuestras opciones de capacitación.',
      open: false
    }
  ];

  teamMembers: TeamMember[] = [
    {
      name: 'Ezequiel Enrico Areco',
      role: 'Fundador & Ingeniero Backend',
      bio: 'Pionero en soluciones tecnológicas con 5+ años de experiencia. Experto en reparación de dispositivos y desarrollo de sistemas.'
    }
  ];

  ngOnInit(): void {
    this.loadLanguage();
  }

  toggleFAQ(index: number): void {
    this.expandedFAQ = this.expandedFAQ === index ? null : index;
  }

  private loadLanguage(): void {
    const saved = localStorage.getItem('portfolio-language');
    if (saved === 'en') {
      this.currentLanguage = 'en';
    }
  }

  get content() {
    return {
      es: {
        title: 'Sobre Nosotros',
        subtitle: 'Tu Aliado en Soluciones Tecnológicas',
        intro: 'Somos una empresa dedicada a brindar soluciones tecnológicas integrales en Buenos Aires y alrededores.',
        history: 'Nuestra Historia',
        historyText: 'Arecofix nació en 2020 con una misión clara: democratizar el acceso a servicios tecnológicos de calidad. Comenzamos como un pequeño taller de reparaciones en el corazón de Buenos Aires y hemos crecido hasta convertirnos en una referencia confiable en la industria. Nuestro compromiso con la excelencia y la satisfacción del cliente ha sido el motor de nuestro crecimiento.',
        foundation: 'Fundación & Valores',
        foundationText: 'Fundada en 2020, Arecofix fue creada con la visión de transformar la experiencia de los clientes con la tecnología. Nos enfocamos en ser transparentes, eficientes y siempre poner al cliente primero.',
        mission: 'Misión',
        missionText: 'Proporcionar soluciones tecnológicas accesibles, confiables y de alta calidad que empoderen a nuestros clientes para aprovechar al máximo sus dispositivos.',
        vision: 'Visión',
        visionText: 'Ser la empresa líder en soluciones tecnológicas en Buenos Aires, reconocida por nuestra excelencia, innovación y compromiso con la satisfacción del cliente.',
        objectives: 'Nuestros Objetivos',
        objectivesText: 'Buscamos crecimiento sostenible, satisfacción 100% del cliente, adopción de tecnologías emergentes y expansión geográfica.',
        commitments: 'Compromisos',
        commitmentsList: [
          'Atención al cliente en máximo 2 horas',
          'Garantía completa en todas nuestras reparaciones',
          'Precios justos y transparentes',
          'Capacitación continua de nuestro equipo',
          'Responsabilidad ambiental',
          'Innovación constante'
        ],
        values: 'Nuestros Valores',
        achievements: 'Logros & Reconocimientos',
        team: 'Nuestro Equipo',
        faq: 'Preguntas Frecuentes',
        trust: 'Por Qué Confiar en Nosotros',
        trustPoints: [
          {
            title: '5+ Años de Trayectoria',
            description: 'Experiencia probada en soluciones tecnológicas'
          },
          {
            title: 'Equipo Certificado',
            description: 'Profesionales capacitados y especializados'
          },
          {
            title: 'Garantía Completa',
            description: 'Respaldo total en todas nuestras reparaciones'
          },
          {
            title: 'Atención Personalizada',
            description: 'Soluciones adaptadas a tus necesidades'
          }
        ]
      },
      en: {
        title: 'About Us',
        subtitle: 'Your Ally in Technology Solutions',
        intro: 'We are a company dedicated to providing comprehensive technology solutions in Buenos Aires and surroundings.',
        history: 'Our History',
        historyText: 'Arecofix was born in 2020 with a clear mission: to democratize access to quality technology services. We started as a small repair shop in the heart of Buenos Aires and have grown to become a trusted reference in the industry. Our commitment to excellence and customer satisfaction has been the engine of our growth.',
        foundation: 'Foundation & Values',
        foundationText: 'Founded in 2020, Arecofix was created with the vision of transforming customer experience with technology. We focus on being transparent, efficient, and always putting the customer first.',
        mission: 'Mission',
        missionText: 'To provide accessible, reliable, and high-quality technology solutions that empower our customers to maximize their devices.',
        vision: 'Vision',
        visionText: 'To be the leading company in technology solutions in Buenos Aires, recognized for our excellence, innovation, and commitment to customer satisfaction.',
        objectives: 'Our Objectives',
        objectivesText: 'We seek sustainable growth, 100% customer satisfaction, adoption of emerging technologies, and geographic expansion.',
        commitments: 'Commitments',
        commitmentsList: [
          'Customer service within 2 hours maximum',
          'Complete guarantee on all our repairs',
          'Fair and transparent prices',
          'Continuous training of our team',
          'Environmental responsibility',
          'Constant innovation'
        ],
        values: 'Our Values',
        achievements: 'Achievements & Recognition',
        team: 'Our Team',
        faq: 'Frequently Asked Questions',
        trust: 'Why Trust Us',
        trustPoints: [
          {
            title: '5+ Years Track Record',
            description: 'Proven experience in technology solutions'
          },
          {
            title: 'Certified Team',
            description: 'Trained and specialized professionals'
          },
          {
            title: 'Complete Guarantee',
            description: 'Full backing on all our repairs'
          },
          {
            title: 'Personalized Attention',
            description: 'Solutions tailored to your needs'
          }
        ]
      }
    };
  }

  get currentContent() {
    return this.content[this.currentLanguage];
  }
}
