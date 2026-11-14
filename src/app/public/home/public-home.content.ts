// ═══════════════════════════════════════════════════════════
//   PUBLIC HOME — CONTENT MODEL
// ═══════════════════════════════════════════════════════════

// ─────────────────────────────────────────────────────────
//   INTERFACES
// ─────────────────────────────────────────────────────────

export interface HeroSlide {
  image: string;
  imageAlt: string;
  url: string;
  tag?: string;
  title?: string;
}

export interface HeroContent {
  availableForProjects: string;
  title: string;
  subtitle: string;
  subtitleMobile?: string;
  ctaPrimary: string;
  ctaSecondary: string;
  imageAlt: string;
  dashboardUrl: string;
  statusLabel: string;
  statusValue: string;
  uptimeValue: string;
  uptimeLabel: string;
  slides?: HeroSlide[];
}

export interface MetricItem {
  value: string;
  label: string;
}

export interface ProjectItem {
  title: string;
  description: string;
  image: string;
  tags: string[];
  link?: string;
}

export interface ServiceItem {
  icon: string;
  title: string;
  description: string;
}

export interface ValuePropItem {
  title: string;
  description: string;
  icon: string;
  guarantees: string[];
}

export interface MethodologyStep {
  number: string;
  title: string;
  description: string;
  icon: string;
}

export interface ReviewItem {
  image: string;
  name: string;
  role: string;
  company: string;
  text: string;
}

export interface TechItem {
  name: string;
  icon: string;
  category: 'frontend' | 'backend' | 'cloud' | 'tools';
  role: string;
}

export interface IndustryItem {
  title: string;
  description: string;
  icon: string;
  examples: string[];
}

export interface BusinessPillarItem {
  title: string;
  description: string;
  icon: string;
  image: string;
  cta: string;
  link: string;
  colorClass: 'blue' | 'green';
  imagePositionClass?: string;
}

export interface GithubContent {
  title: string;
  subtitle: string;
  repoName: string;
  repoDescription: string;
  stars: string;
  forks: string;
  link: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface QuoteOption {
  value: string;
  label: string;
  description: string;
  icon: string;
}

export interface QuoteFaqItem {
  question: string;
  answer: string;
  icon: string;
}

export interface QuoteSteps {
  stepLabel: string;
  problemQuestion: string;
  problemOptions: QuoteOption[];
  sizeQuestion: string;
  sizeOptions: QuoteOption[];
  contactQuestion: string;
  contactHint: string;
  phonePlaceholder: string;
  submitLabel: string;
  submittingLabel: string;
  backLabel: string;
  successTitle: string;
  successMessage: string;
  successCta: string;
  errorMessage: string;
}

export interface QuoteContent {
  title: string;
  subtitle: string;
  image: string;
  faqs: QuoteFaqItem[];
  steps: QuoteSteps;
}

export interface HomeContent {
  hero: HeroContent;
  metrics: { title: string; subtitle: string; items: MetricItem[] };
  projects: { title: string; subtitle: string; items: ProjectItem[] };
  services: { title: string; subtitle: string; items: ServiceItem[] };
  valueProposition: { title: string; subtitle: string; items: ValuePropItem[] };
  methodology: {
    title: string;
    subtitle: string;
    description: string;
    steps: MethodologyStep[];
  };
  reviews: { title: string; subtitle: string; items: ReviewItem[] };
  techStack: { title: string; subtitle: string; items: TechItem[] };
  industries: { title: string; subtitle: string; items: IndustryItem[] };
  businessPillars: {
    title: string;
    subtitle: string;
    items: BusinessPillarItem[];
  };
  github: GithubContent;
  faq: { title: string; items: FaqItem[] };
  quote: QuoteContent;
}

// ─────────────────────────────────────────────────────────
//   CONTENT
// ─────────────────────────────────────────────────────────

export const HOME_CONTENT: Record<'en' | 'es', HomeContent> = {
  en: {
    hero: {
      availableForProjects: 'Available for new projects',
      title: 'IT Consulting. Tailored technology solving your business challenges.',
      subtitle:
        'If you lose time with confusing software or scattered spreadsheets, we build custom, intuitive solutions tailored for your business. We handle the tech so you can focus on scaling sales.',
      subtitleMobile:
        'If you lose time with confusing software, we build custom, easy-to-use systems designed for scalable growth.',
      ctaPrimary: 'Book a free consultation',
      ctaSecondary: 'See how we can help',
      imageAlt: 'Arecofix dashboard preview with real-time project metrics',
      dashboardUrl: 'app.arecofix.com',
      statusLabel: 'System',
      statusValue: '100% Operational',
      uptimeValue: '99.9%',
      uptimeLabel: 'Guaranteed Uptime',
      slides: [
        {
          image: 'assets/img/services/software-illustration.webp',
          imageAlt: 'Arecofix dashboard preview with real-time project metrics',
          url: 'app.arecofix.com',
          tag: 'Main Dashboard',
          title: 'Real-time metrics & management',
        },
        {
          image: 'assets/img/gsm/are.webp',
          imageAlt: 'Operations and business intelligence panel',
          url: 'panel.arecofix.com',
          tag: 'Operations Panel',
          title: 'Total business operational control',
        },
      ],
    },

    metrics: {
      title: 'Global Impact',
      subtitle: 'Proven Results',
      items: [
        { value: '+60', label: 'Delivered projects' },
        { value: '4', label: 'Countries served' },
        { value: '+15', label: 'AI solutions shipped' },
        { value: '100%', label: 'Commitment' },
      ],
    },

    projects: {
      title: 'Featured Projects',
      subtitle: 'Innovation in Action',
      items: [
        {
          title: 'ZARX — C4ISR Civil Defense & Emergency Response System',
          description:
            'platform that turns crisis uncertainty into actionable information. ZARX integrates real-time geolocation, secure communication and critical infrastructure monitoring (fires, IoT) in a single interface. Built to work even when the network fails (offline-first), it enables civil defense and security forces to coordinate resources and save lives with precise data in seconds, not hours.',
          image: 'assets/img/gsm/zarx.webp',
          tags: ['C4ISR', 'Offline-First', 'Angular', 'Supabase'],
          link: '/portfolio',
        },
        {
          title: 'Business Intelligence Dashboard (ERP)',
          description:
            'Unified command center that centralizes operations, finances and customer service in a single screen. Designed to scale businesses with multiple branches, unifying E-commerce, Technical Service, Academy and Cash in real time with actionable metrics.',
          image: 'assets/img/projects/are.webp',
          tags: ['Java', 'Spring Boot', 'Angular'],
          link: '/portfolio',
        },
      ],
    },

    services: {
      title: 'High-Tech Services',
      subtitle: 'From AI Agents to Corporate Software',
      items: [
        {
          icon: 'fas fa-brain',
          title: 'AI & Machine Learning',
          description:
            'Custom LLMs, Predictive Models, and Intelligent Agents for business automation.',
        },
        {
          icon: 'fas fa-laptop-code',
          title: 'Full Stack Development',
          description:
            'Enterprise-grade Web & Mobile applications using Angular, React, and Node.js.',
        },
        {
          icon: 'fas fa-server',
          title: 'Cloud Architecture',
          description:
            'Scalable infrastructure on AWS/Azure, DevOps automation, and System Integration.',
        },
        {
          icon: 'fas fa-eye',
          title: 'Computer Vision',
          description:
            'Image recognition systems for security, quality control, and healthcare.',
        },
        {
          icon: 'fas fa-shield-halved',
          title: 'Cybersecurity & Audits',
          description:
            'Protecting your digital assets with advanced security protocols and ethical hacking.',
        },
      ],
    },

    valueProposition: {
      title: 'Why Work With Us?',
      subtitle: 'The four questions every client asks us — answered upfront.',
      items: [
        {
          title: 'Fixed Price. No Surprises.',
          description:
            'You know exactly what you will pay before we start writing a single line of code.',
          icon: 'fas fa-handshake',
          guarantees: [
            'Quote approved before kickoff',
            'Zero hidden costs',
            'No scope creep charges',
          ],
        },
        {
          title: 'We Stay After Launch.',
          description:
            'Our job does not end when we deploy. We monitor, fix and improve your system post-release.',
          icon: 'fas fa-headset',
          guarantees: [
            '3 months of support included',
            'Response within 24h',
            'Free bug fixes post-launch',
          ],
        },
        {
          title: 'Your Code Is Yours. Forever.',
          description:
            'No vendor lock-in. You get the full source code, documentation and a handover session.',
          icon: 'fas fa-key',
          guarantees: [
            'Full repo ownership',
            'Documentation in Spanish & English',
            '1:1 handover session',
          ],
        },
        {
          title: 'Real Progress Every Week.',
          description:
            'You see working software every Friday — not just status updates or slide decks.',
          icon: 'fas fa-chart-line',
          guarantees: [
            'Weekly live demo',
            'Repo access from day 1',
            'Slack/WhatsApp direct channel',
          ],
        },
      ],
    },

    methodology: {
      title: 'Our Methodology',
      subtitle: 'Excellence in Every Step',
      description:
        'We combine strategy, design, and technology to deliver exceptional digital products.',
      steps: [
        {
          number: '01',
          title: 'Discovery & Strategy',
          description:
            'We analyze your data and business goals to define the AI strategy.',
          icon: 'fas fa-magnifying-glass-chart',
        },
        {
          number: '02',
          title: 'Design & Prototyping',
          description: 'Designing intuitive interfaces and data architectures.',
          icon: 'fas fa-pen-nib',
        },
        {
          number: '03',
          title: 'Agile Development',
          description:
            'Iterative coding sprints with continuous feedback loops.',
          icon: 'fas fa-code-branch',
        },
        {
          number: '04',
          title: 'QA & Testing',
          description: 'Rigorous automated testing for robust performance.',
          icon: 'fas fa-vial',
        },
        {
          number: '05',
          title: 'Deploy & Optimize',
          description: 'Cloud deployment and continuous model training.',
          icon: 'fas fa-rocket',
        },
      ],
    },

    reviews: {
      title: 'Testimonials',
      subtitle: 'What Clients Say',
      items: [
        {
          image: 'assets/img/utils/profile-placeholder.png',
          name: 'Municipality of Marcos Paz',
          role: 'Government',
          company: 'Envion Program',
          text: 'Excellent technical team, providing robust support and system management.',
        },
        {
          image: 'assets/img/utils/profile-placeholder.png',
          name: 'International Client',
          role: 'CEO',
          company: 'Tech Startup',
          text: 'Arecofix delivered a world-class AI solution suitable for the US market.',
        },
      ],
    },

    techStack: {
      title: 'Technology Stack',
      subtitle: 'Our Engineering Core',
      items: [
        { name: 'Python', icon: 'fa-brands fa-python fa-fw', category: 'backend', role: 'AI & Data' },
        { name: 'TensorFlow', icon: 'fas fa-brain', category: 'backend', role: 'Machine Learning' },
        { name: 'Angular', icon: 'fab fa-angular', category: 'frontend', role: 'Web Apps' },
        { name: 'Node.js', icon: 'fab fa-node', category: 'backend', role: 'APIs & Microservices' },
        { name: 'AWS', icon: 'fab fa-aws', category: 'cloud', role: 'Cloud Infrastructure' },
        { name: 'Java', icon: 'fab fa-java', category: 'backend', role: 'Enterprise Backend' },
      ],
    },

    industries: {
      title: 'Industries We Serve',
      subtitle: 'Deep Tech Expertise',
      items: [
        {
          title: 'Fintech & Banking',
          description: 'Fraud detection AI & secure ledgers.',
          icon: 'fas fa-coins',
          examples: ['Trading Bots', 'Risk Analysis'],
        },
        {
          title: 'AgroTech',
          description: 'Smart farming solutions for LatAm.',
          icon: 'fas fa-tractor',
          examples: ['Crop Monitoring', 'Yield Prediction'],
        },
        {
          title: 'Healthcare',
          description: 'AI diagnostics & telemedicine.',
          icon: 'fas fa-heart-pulse',
          examples: ['Patient Data', 'Imaging AI'],
        },
        {
          title: 'E-commerce',
          description: 'Recommendation engines & chatbots.',
          icon: 'fas fa-cart-shopping',
          examples: ['Personalization', 'Auto-Support'],
        },
      ],
    },

    businessPillars: {
      title: 'Arecofix Ecosystem',
      subtitle: 'Comprehensive Tech Solutions',
      items: [
        {
          title: 'Hardware Lab',
          description:
            'Specialized Lab for mobile & console repairs (Argentina).',
          icon: 'fas fa-microchip',
          image: 'assets/img/cursos/medicion.webp',
          cta: 'Go to Lab',
          link: '/celular',
          colorClass: 'blue',
          imagePositionClass: 'object-[center_35%]',
        },
        {
          title: 'IT Academy',
          description:
            'High-level training for the tech industry. Practical courses in software development, electronics and IT trades.',
          icon: 'fas fa-graduation-cap',
          image: 'assets/img/cursos/profesor.png',
          cta: 'View Academy',
          link: '/academy',
          colorClass: 'green',
          imagePositionClass: 'object-[center_20%]',
        },
      ],
    },

    github: {
      title: 'Open Source',
      subtitle: 'Contributing to the Future',
      repoName: 'arecofix-ai-core',
      repoDescription:
        'Libraries for AI integration and clean architecture.',
      stars: '150+',
      forks: '40+',
      link: 'https://github.com/arecofix',
    },

    // EN
    faq: {
      title: 'Frequently Asked Questions',
      items: [
        {
          question: 'What does Arecofix actually do?',
          answer: 'We build high-end custom software and AI solutions that solve real business problems. We do not sell hours of code; we build tools designed to optimize your operations, scale your revenue, and give you a competitive advantage.',
        },
        {
          question: 'Why choose a software factory over a freelancer?',
          answer: 'A freelancer disappears when the project ends. As a software factory with a dedicated team, we guarantee code ownership, full documentation, and 3 months of post-launch support. You get a technical partner, not just a developer.',
        },
        {
          question: 'How long does it take to see real results?',
          answer: 'We work with weekly sprints. You will see real, working software every Friday. A standard MVP takes 4 to 6 weeks. Our methodology is designed to give you time-to-market faster than the industry average.',
        },
        {
          question: 'What happens if I need changes or the system fails?',
          answer: 'Your code is 100% yours. We include 3 months of post-launch support with a 24-hour SLA. After that, we offer continuous maintenance plans so your system never becomes obsolete.',
        },
      ],
    },


    quote: {
      title: "Let's Build Something Real",
      subtitle:
        'Answer 3 quick questions. We reply via WhatsApp in under 24 hours.',
      image: 'assets/img/services/software-illustration.webp',
      faqs: [
        {
          question: 'What do we do?',
          answer:
            'Custom software that solves real business problems. No templates, no generic code.',
          icon: 'fas fa-bullseye',
        },
        {
          question: 'What do you get?',
          answer:
            'A working product, full source code, documentation, and 3 months of included support.',
          icon: 'fas fa-box-open',
        },
        {
          question: 'Can you trust us?',
          answer:
            'Written guarantees. No vendor lock-in. Real cases: ZARX and Marcos Paz Municipality.',
          icon: 'fas fa-shield-halved',
        },
        {
          question: 'What now?',
          answer:
            'Answer 3 quick questions. We contact you via WhatsApp within 24 hours.',
          icon: 'fas fa-arrow-right',
        },
      ],
      steps: {
        stepLabel: 'Step',
        problemQuestion: 'What do you need to build?',
        problemOptions: [
          {
            value: 'web',
            label: 'Web Application',
            description: 'Dashboards, portals, SaaS, e-commerce',
            icon: 'fas fa-globe',
          },
          {
            value: 'mobile',
            label: 'Mobile App',
            description: 'iOS & Android with shared codebase',
            icon: 'fas fa-mobile-screen',
          },
          {
            value: 'desktop',
            label: 'Desktop Software',
            description: 'Internal tools, POS, offline-first',
            icon: 'fas fa-desktop',
          },
        ],
        sizeQuestion: 'How big is the project?',
        sizeOptions: [
          {
            value: 'mvp',
            label: 'Just an idea',
            description: 'MVP in 4-6 weeks',
            icon: 'fas fa-lightbulb',
          },
          {
            value: 'growth',
            label: 'Already running',
            description: 'Scale, refactor or add features',
            icon: 'fas fa-rocket',
          },
          {
            value: 'enterprise',
            label: 'Enterprise',
            description: 'Multi-branch, integrations, high traffic',
            icon: 'fas fa-building',
          },
        ],
        contactQuestion: 'Where should we reach you?',
        contactHint: 'WhatsApp or phone. We reply in under 24h.',
        phonePlaceholder: '+54 9 11 1234-5678',
        submitLabel: 'Send & get my quote',
        submittingLabel: 'Sending...',
        backLabel: 'Back',
        successTitle: 'Perfect. We got it.',
        successMessage:
          'We will contact you via WhatsApp in under 24 hours with a tailored quote.',
        successCta: 'Chat on WhatsApp now',
        errorMessage: 'Something went wrong. Please try again or message us on WhatsApp.',
      },
    },
  },

  es: {
    hero: {
      availableForProjects: 'Disponible para nuevos proyectos',
      title:
        'Consultoría IT. Tecnología a medida que resuelve los problemas de tu negocio.',
      subtitle:
        'Si sentís que perdés tiempo con programas que no se entienden o anotando datos por todos lados, te desarrollamos un sistema a medida: fácil de usar, sin tecnicismos y pensado para escalar. Nosotros nos ocupamos de la tecnología, vos de tus ventas.',
      subtitleMobile:
        'Si sentís que perdés tiempo con programas que no se entienden, nosotros te desarrollamos un sistema a medida, fácil de usar y pensado para que crezcas de forma escalable.',
      ctaPrimary: 'Agendar una asesoría gratuita',
      ctaSecondary: 'Descubrir cómo pueden ayudarme',
      imageAlt:
        'Vista previa del dashboard de Arecofix con métricas de proyectos en tiempo real',
      dashboardUrl: 'app.arecofix.com',
      statusLabel: 'Sistema',
      statusValue: '100% Operativo',
      uptimeValue: '99.9%',
      uptimeLabel: 'Uptime Garantizado',
      slides: [
        {
          image: 'assets/img/services/software-illustration.webp',
          imageAlt:
            'Vista previa del dashboard de Arecofix con métricas de proyectos en tiempo real',
          url: 'app.arecofix.com',
          tag: 'Dashboard Principal',
          title: 'Gestión y métricas en tiempo real',
        },
        {
          image: 'assets/img/gsm/are.webp',
          imageAlt: 'Panel integral de operaciones y business intelligence',
          url: 'panel.arecofix.com',
          tag: 'Panel de Operaciones',
          title: 'Operaciones centralizadas y analíticas',
        },
      ],
    },

    metrics: {
      title: 'Nuestro Impacto',
      subtitle: 'Métricas Reales',
      items: [
        { value: '+60', label: 'Proyectos exitosos' },
        { value: '4', label: 'Países alcanzados' },
        { value: '+15', label: 'Soluciones de IA' },
        { value: '100%', label: 'Compromiso' },
      ],
    },

    projects: {
      title: 'Portfolio Destacado',
      subtitle: 'Innovación aplicada al mundo real',
      items: [
        {
          title: 'ZARX — Sistema C4ISR de Defensa Civil y Respuesta a Emergencias',
          description:
            'Plataforma que convierte la incertidumbre de una crisis en un flujo de información accionable. ZARX integra geolocalización en tiempo real, comunicación segura y monitoreo de infraestructura crítica (inundaciones, IoT) en una sola interfaz. Diseñada para funcionar incluso cuando la red falla (offline-first), permite a defensa civil y fuerzas de seguridad coordinar recursos y salvar vidas con datos precisos en segundos, no en horas.',
          image: 'assets/img/gsm/zarx.webp',
          tags: ['C4ISR', 'Offline-First', 'Angular', 'Supabase'],
          link: '/portfolio',
        },
        {
          title: 'Dashboard Integral de Negocio (ERP & BI)',
          description:
            'Centro de comando unificado que centraliza operaciones, finanzas y atención al cliente en una sola pantalla. Diseñado para escalar negocios con múltiples sucursales, unificando E-commerce, Servicio Técnico, Academia y Caja en tiempo real con métricas accionables.',
          image: 'assets/img/gsm/are.webp',
          tags: ['Java', 'Spring Boot', 'Angular'],
          link: '/portfolio',
        },
      ],
    },

    services: {
      title: 'Servicios de Alta Tecnología',
      subtitle: 'Soluciones Digitales de Punta a Punta',
      items: [
        {
          icon: 'fas fa-brain',
          title: 'Consultoría en IA',
          description:
            'Integración de Inteligencia Artificial Generativa y Machine Learning en tus procesos.',
        },
        {
          icon: 'fas fa-code',
          title: 'Software Factory',
          description:
            'Desarrollo a medida de aplicaciones Web y Móviles (Angular, React, Python, Java).',
        },
        {
          icon: 'fas fa-users-gear',
          title: 'Staff Augmentation',
          description:
            'Producimos talento IT de alto nivel para sumarse a tus equipos (Devs, QA, DevOps).',
        },
        {
          icon: 'fas fa-robot',
          title: 'Automatización Inteligente',
          description:
            'RPA y bots para reducir costos operativos y eliminar tareas manuales.',
        },
        {
          icon: 'fas fa-server',
          title: 'Cloud & Ciberseguridad',
          description:
            'Migraciones a la nube y auditorías de seguridad informática.',
        },
      ],
    },

    valueProposition: {
      title: '¿Por Qué Trabajar con Nosotros?',
      subtitle:
        'Las 4 preguntas que todo cliente nos hace — respondidas de antemano.',
      items: [
        {
          title: 'Precio cerrado. Sin sorpresas.',
          description:
            'Sabés exactamente cuánto vas a pagar antes de que escribamos una sola línea de código.',
          icon: 'fas fa-handshake',
          guarantees: [
            'Presupuesto aprobado antes de arrancar',
            'Cero costos ocultos',
            'Sin recargos por cambios menores',
          ],
        },
        {
          title: 'Seguimos después del lanzamiento.',
          description:
            'Nuestro trabajo no termina cuando entregamos. Monitoreamos, corregimos y mejoramos tu sistema.',
          icon: 'fas fa-headset',
          guarantees: [
            '3 meses de soporte incluidos',
            'Respuesta en menos de 24h',
            'Corrección de bugs sin costo',
          ],
        },
        {
          title: 'Tu código es tuyo. Para siempre.',
          description:
            'Sin dependencias ocultas. Te entregamos el código fuente, la documentación y una sesión de transferencia.',
          icon: 'fas fa-key',
          guarantees: [
            'Repo completo es tu propiedad',
            'Documentación en español e inglés',
            'Sesión 1:1 de transferencia',
          ],
        },
        {
          title: 'Avances reales cada semana.',
          description:
            'Ves software funcionando cada viernes — no solo reportes de estado o presentaciones.',
          icon: 'fas fa-chart-line',
          guarantees: [
            'Demo en vivo semanal',
            'Acceso al repo desde el día 1',
            'Canal directo de Slack/WhatsApp',
          ],
        },
      ],
    },

    methodology: {
      title: 'Cómo Trabajamos',
      subtitle: 'Paso a paso, de la idea a la realidad',
      description:
        'Te acompañamos en todo el proceso para que sepas exactamente qué estamos haciendo, sin lenguaje técnico complicado y con resultados visibles desde el primer día.',
      steps: [
        {
          number: '01',
          title: 'Análisis del Negocio',
          description:
            'Nos sentamos a entender cómo funciona tu empresa hoy, cuáles son los problemas a resolver y qué herramienta exacta necesitás.',
          icon: 'fas fa-comments',
        },
        {
          number: '02',
          title: 'Diseño a Medida',
          description:
            'Armamos los bocetos visuales del sistema. Nos aseguramos de que sea intuitivo y muy fácil de usar.',
          icon: 'fas fa-palette',
        },
        {
          number: '03',
          title: 'Desarrollo en Etapas',
          description:
            'Programamos el sistema mostrándote avances reales semana a semana, para que veas cómo toma forma.',
          icon: 'fas fa-laptop-code',
        },
        {
          number: '04',
          title: 'Control de Calidad',
          description:
            'Sometemos el programa a pruebas exhaustivas antes de entregarlo. Nos aseguramos de que todo funcione perfecto.',
          icon: 'fas fa-check-double',
        },
        {
          number: '05',
          title: 'Lanzamiento y Soporte',
          description:
            'Subimos el sistema a servidores seguros en la nube y seguimos a tu lado para brindar soporte y mantenimiento.',
          icon: 'fas fa-cloud-arrow-up',
        },
      ],
    },

    reviews: {
      title: 'Testimonios',
      subtitle: 'Confían en Nosotros',
      items: [
        {
          image: 'assets/img/utils/profile-placeholder.png',
          name: 'Municipio de Marcos Paz',
          role: 'Gobierno',
          company: 'Sec. de Modernización',
          text: 'Arecofix modernizó nuestros sistemas legados con una eficiencia increíble.',
        },
        {
          image: 'assets/img/utils/profile-placeholder.png',
          name: 'Startup USA',
          role: 'CTO',
          company: 'Fintech',
          text: 'Gran equipo de desarrollo, excelente comunicación en inglés y calidad de código top.',
        },
      ],
    },

    techStack: {
      title: 'Tecnologías Principales',
      subtitle: 'Dominamos el ecosistema moderno',
      items: [
        { name: 'Python', icon: 'fa-brands fa-python fa-fw', category: 'backend', role: 'IA & Datos' },
        { name: 'Java', icon: 'fab fa-java', category: 'backend', role: 'Backend Empresarial' },
        { name: 'Angular', icon: 'fab fa-angular', category: 'frontend', role: 'Aplicaciones Web' },
        { name: 'React', icon: 'fab fa-react', category: 'frontend', role: 'Interfaces UI' },
        { name: 'AWS', icon: 'fab fa-aws', category: 'cloud', role: 'Infraestructura Cloud' },
        { name: 'Postgres', icon: 'fas fa-database', category: 'backend', role: 'Bases de Datos' },
      ],
    },

    industries: {
      title: 'Sectores que Potenciamos',
      subtitle: 'Experiencia Multisectorial',
      items: [
        {
          title: 'Fintech & Cripto',
          description: 'Seguridad y transacciones rápidas.',
          icon: 'fas fa-coins',
          examples: ['Wallets', 'Bots de Trading'],
        },
        {
          title: 'Agro & Industria',
          description: 'Tecnología para el campo y fábricas.',
          icon: 'fas fa-tractor',
          examples: ['Monitoreo Satelital', 'IoT'],
        },
        {
          title: 'Salud (HealthTech)',
          description: 'Digitalización médica segura.',
          icon: 'fas fa-user-doctor',
          examples: ['Turneros', 'Telemedicina'],
        },
        {
          title: 'Retail & E-commerce',
          description: 'Ventas online inteligentes.',
          icon: 'fas fa-store',
          examples: ['Recomendadores', 'Stock AI'],
        },
      ],
    },

    businessPillars: {
      title: 'Sistemas Embebidos & IoT',
      subtitle:
        'Del código al componente: Soluciones Tecnológicas a Medida',
      items: [
        {
          title: 'Laboratorio de Electrónica',
          description:
            'Servicio técnico especializado en Marcos Paz. Diagnosticamos a nivel componente para restaurar tu equipo y recuperar datos críticos, incluso cuando otros ya lo dieron por perdido.',
          icon: 'fas fa-microchip',
          image: 'assets/img/cursos/medicion.webp',
          cta: 'Cotizar reparación',
          link: '/celular',
          colorClass: 'blue',
          imagePositionClass: 'object-[center_65%]',
        },
        {
          title: 'Arecofix Academy',
          description:
            'Preparate para la industria tecnológica con capacitaciones de alto nivel. Cursos prácticos de desarrollo de software, programación y oficios.',
          icon: 'fas fa-graduation-cap',
          image: 'assets/img/cursos/profesor.png',
          cta: 'Ver Academia',
          link: '/academy',
          colorClass: 'green',
          imagePositionClass: 'object-[center_20%]',
        },
      ],
    },

    github: {
      title: 'Código Abierto',
      subtitle: 'Creamos comunidad',
      repoName: 'arecofix-core',
      repoDescription:
        'Nuestras librerías base para acelerar el desarrollo de software seguro.',
      stars: '150+',
      forks: '40+',
      link: 'https://github.com/arecofix',
    },


    // ES
    faq: {
      title: 'Preguntas Frecuentes',
      items: [
        {
          question: '¿Qué hace exactamente Arecofix?',
          answer: 'Construimos software a medida de alta gama y soluciones de IA que resuelven problemas reales de negocio. No vendemos horas de código; construimos herramientas diseñadas para optimizar tus operaciones, escalar tu facturación y darte ventaja competitiva.',
        },
        {
          question: '¿Por qué elegir una software factory y no un freelancer?',
          answer: 'Un freelancer desaparece cuando termina el proyecto. Como software factory con equipo dedicado, te garantizamos la propiedad del código, documentación completa y 3 meses de soporte post-lanzamiento. Tenés un socio tecnológico, no solo un programador.',
        },
        {
          question: '¿Cuánto tarda en estar listo mi sistema?',
          answer: 'Trabajamos con sprints semanales. Vas a ver software real funcionando todos los viernes. Un MVP estándar toma de 4 a 6 semanas. Nuestra metodología está diseñada para que salgas al mercado más rápido que el promedio de la industria.',
        },
        {
          question: '¿Qué pasa si necesito cambios o el sistema falla?',
          answer: 'El código es 100% tuyo. Incluimos 3 meses de soporte post-lanzamiento con SLA de 24 horas. Después de eso, ofrecemos planes de mantenimiento continuo para que tu sistema nunca quede obsoleto.',
        },
      ],
    },

    quote: {
      title: 'Construyamos algo real',
      subtitle:
        'Respondé 3 preguntas rápidas. Te contactamos por WhatsApp en menos de 24 horas.',
      image: 'assets/img/services/software-illustration.webp',
      faqs: [
        {
          question: '¿Qué hacemos?',
          answer:
            'Software a medida que resuelve problemas reales. Sin plantillas, sin código genérico.',
          icon: 'fas fa-bullseye',
        },
        {
          question: '¿Qué te llevás?',
          answer:
            'Un producto funcionando, el código completo, documentación y 3 meses de soporte incluidos.',
          icon: 'fas fa-box-open',
        },
        {
          question: '¿Podés confiar?',
          answer:
            'Garantías por escrito. Sin lock-in. Casos reales: ZARX y Municipalidad de Marcos Paz.',
          icon: 'fas fa-shield-halved',
        },
        {
          question: '¿Y ahora qué?',
          answer:
            'Respondés 3 preguntas rápidas. Te contactamos por WhatsApp en menos de 24 horas.',
          icon: 'fas fa-arrow-right',
        },
      ],
      steps: {
        stepLabel: 'Paso',
        problemQuestion: '¿Qué necesitás construir?',
        problemOptions: [
          {
            value: 'web',
            label: 'Aplicación Web',
            description: 'Dashboards, portales, SaaS, e-commerce',
            icon: 'fas fa-globe',
          },
          {
            value: 'mobile',
            label: 'App Mobile',
            description: 'iOS y Android con código compartido',
            icon: 'fas fa-mobile-screen',
          },
          {
            value: 'desktop',
            label: 'Software de Escritorio',
            description: 'Herramientas internas, POS, offline-first',
            icon: 'fas fa-desktop',
          },
        ],
        sizeQuestion: '¿Qué tan grande es el proyecto?',
        sizeOptions: [
          {
            value: 'mvp',
            label: 'Solo una idea',
            description: 'MVP en 4-6 semanas',
            icon: 'fas fa-lightbulb',
          },
          {
            value: 'growth',
            label: 'Ya en marcha',
            description: 'Escalar, refactorizar o sumar features',
            icon: 'fas fa-rocket',
          },
          {
            value: 'enterprise',
            label: 'Enterprise',
            description: 'Multi-sucursal, integraciones, alto tráfico',
            icon: 'fas fa-building',
          },
        ],
        contactQuestion: '¿A qué número te escribimos?',
        contactHint: 'WhatsApp o teléfono. Respondemos en menos de 24h.',
        phonePlaceholder: '+54 9 11 1234-5678',
        submitLabel: 'Enviar y recibir cotización',
        submittingLabel: 'Enviando...',
        backLabel: 'Volver',
        successTitle: 'Perfecto. Lo recibimos.',
        successMessage:
          'Te contactamos por WhatsApp en menos de 24 horas con una cotización a medida.',
        successCta: 'Hablar por WhatsApp ahora',
        errorMessage:
          'Algo salió mal. Reintentá o escribinos por WhatsApp.',
      },
    },
  },
};