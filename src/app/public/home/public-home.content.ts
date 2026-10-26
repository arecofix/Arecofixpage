
export interface QuoteForm {
  name: string;
  email: string;
  phone: string;
  company: string;
  projectType: string;
  budget: string;
  description: string;
  cta: string;
}

export interface TechItem {
  name: string;
  icon: string;
  category: 'frontend' | 'backend' | 'cloud' | 'tools';
}

export interface ServiceItem {
  icon: string;
  title: string;
  description: string;
}

export interface ProjectItem {
  title: string;
  description: string;
  image: string;
  tags: string[];
  link?: string;
}

export interface PartnerItem {
  name: string;
  logo: string;
}

export interface ReviewItem {
  image: string;
  name: string;
  role: string;
  company: string;
  text: string;
}

export interface IndustrySolution {
  title: string;
  description: string;
  icon: string;
  examples: string[];
}

export interface TechServiceDetailed {
  title: string;
  description: string;
  icon: string;
  image: string;
  features: string[];
}

export interface MethodologyStep {
  number: string;
  title: string;
  description: string;
  icon: string;
}

export interface MetricItem {
  value: string;
  label: string;
}


export interface TeamMember {
  name: string;
  role: string;
  image: string;
  bio: string;
  socials: { linkedin?: string; github?: string };
}

export interface RemoteWorkSection {
  title: string;
  subtitle: string;
  description: string;
  benefits: string[];
  cta: string;
  image: string;
}

export interface GithubSection {
  title: string;
  subtitle: string;
  repoName: string;
  repoDescription: string;
  stars: string;
  forks: string;
  link: string;
}

export interface HomeContent {
  hero: {
    badge?: string;
    title: string;
    subtitle: string;
    ctaPrimary: string;
    ctaSecondary: string;
  };
  services: {
    title: string;
    subtitle: string;
    items: ServiceItem[];
  };
  industries: {
    title: string;
    subtitle: string;
    items: IndustrySolution[];
  };
  techServices: {
    title: string;
    subtitle: string;
    items: TechServiceDetailed[];
  };
  methodology: {
    title: string;
    subtitle: string;
    description: string;
    steps: MethodologyStep[];
  };
  metrics: {
    title: string;
    subtitle: string;
    items: MetricItem[];
  };
  techStack: {
    title: string;
    subtitle: string;
    items: TechItem[];
  };
  projects: {
    title: string;
    subtitle: string;
    items: ProjectItem[];
  };
  reviews: {
    title: string;
    subtitle: string;
    items: ReviewItem[];
  };
  team: {
    title: string;
    subtitle: string;
    members: TeamMember[];
  };
  remoteWork: RemoteWorkSection;
  github: GithubSection;
  quote: {
    title: string;
    subtitle: string;
    form: QuoteForm;
  };
  coursesTeaser: {
    title: string;
    subtitle: string;
    cta: string;
    link: string;
  };
  cellServicePromo: {
    title: string;
    subtitle: string;
    cta: string;
    link: string;
  };
  businessPillars: {
    title: string;
    subtitle: string;
    items: {
      title: string;
      description: string;
      icon: string;
      image: string;
      cta: string;
      link: string;
      colorClass: string;
      imagePositionClass?: string;
    }[];
  };
  valueProposition: {
    title: string;
    subtitle: string;
    items: { title: string; description: string; icon: string }[];
  };
  faq: {
    title: string;
    items: { question: string; answer: string }[];
  };
  novedadesFooter: {
    title: string;
    links: { text: string; url: string }[];
  };
}

export const HOME_CONTENT: { en: HomeContent; es: HomeContent } = {
  en: {
    hero: {
      title: 'IT Consulting. Tailored technology solving your business challenges.',
      subtitle: 'If you feel you waste time jotting data everywhere or using software that nobody understands, we solve it for you. We build a unique, ultra-easy-to-use system for you with zero jargon. Whether your business is small or large, we deliver a tool so you keep everything organized and scale smoothly. We handle the system, you focus on sales.',
      ctaPrimary: 'Start AI Project',
      ctaSecondary: 'View Portfolio'
    },
    services: {
      title: 'High-Tech Services',
      subtitle: 'From AI Agents to Corporate Software',
      items: [
        { icon: 'fas fa-brain', title: 'AI & Machine Learning', description: 'Custom LLMs, Predictive Models, and Intelligent Agents for business automation.' },
        { icon: 'fas fa-laptop-code', title: 'Full Stack Development', description: 'Enterprise-grade Web & Mobile applications using Angular, React, and Node.js.' },
        { icon: 'fas fa-server', title: 'Cloud Architecture', description: 'Scalable infrastructure on AWS/Azure, DevOps automation, and System Integration.' },
        { icon: 'fas fa-eye', title: 'Computer Vision', description: 'Image recognition systems for security, quality control, and healthcare.' },
        { icon: 'fas fa-shield-halved', title: 'Cybersecurity & Audits', description: 'Protecting your digital assets with advanced security protocols and ethical hacking.' }
      ]
    },
    industries: {
      title: 'Industries We Audit',
      subtitle: 'Deep Tech Expertise',
      items: [
        {
          title: 'Fintech & Banking',
          description: 'Fraud detection AI & secure ledgers.',
          icon: 'fas fa-coins',
          examples: ['Trading Bots', 'Risk Analysis']
        },
        {
          title: 'AgroTech',
          description: 'Smart farming solutions for LatAm.',
          icon: 'fas fa-tractor',
          examples: ['Crop Monitoring', 'Yield Prediction']
        },
        {
          title: 'Healthcare',
          description: 'AI diagnostics & telemedicine.',
          icon: 'fas fa-heart-pulse',
          examples: ['Patient Data', 'Imaging AI']
        },
        {
          title: 'E-commerce',
          description: 'Recommendation engines & chatbots.',
          icon: 'fas fa-cart-shopping',
          examples: ['Personalization', 'Auto-Support']
        }
      ]
    },
    techServices: {
      title: 'Tech Stack',
      subtitle: 'Cutting-edge Tools',
      items: [
        {
          title: 'Artificial Intelligence',
          description: 'Python Powerhouse',
          icon: 'fas fa-brain',
          image: '',
          features: ['TensorFlow', 'PyTorch', 'OpenAI API', 'LangChain']
        },
        {
          title: 'Modern Frontend',
          description: 'Responsive & Fast',
          icon: 'fab fa-react',
          image: '',
          features: ['Angular', 'React', 'Next.js', 'Tailwind']
        },
        {
          title: 'Robust Backend',
          description: 'High Availability',
          icon: 'fas fa-server',
          image: '',
          features: ['Node.js', 'Python/Django', 'Java Spring Boot', 'PostgreSQL']
        },
        {
          title: 'Cloud & DevOps',
          description: 'Scalable Infra',
          icon: 'fas fa-cloud',
          image: '',
          features: ['AWS', 'Docker', 'Kubernetes', 'CI/CD']
        }
      ]
    },
    methodology: {
      title: 'Our Methodology',
      subtitle: 'Excellence in Every Step',
      description: 'We combine strategy, design, and technology to deliver exceptional digital products.',
      steps: [
        { number: '01', title: 'Discovery & Strategy', description: 'We analyze your data and business goals to define the AI strategy.', icon: 'fas fa-magnifying-glass-chart' },
        { number: '02', title: 'Design & Prototyping', description: 'Designing intuitive interfaces and data architectures.', icon: 'fas fa-pen-nib' },
        { number: '03', title: 'Agile Development', description: 'Iterative coding sprints with continuous feedback loops.', icon: 'fas fa-code-branch' },
        { number: '04', title: 'QA & Testing', description: 'Rigorous automated testing for robust performance.', icon: 'fas fa-vial' },
        { number: '05', title: 'Deploy & Optimize', description: 'Cloud deployment and continuous model training.', icon: 'fas fa-rocket' }
      ]
    },
    metrics: {
      title: 'Global Impact',
      subtitle: 'Proven Results',
      items: [
        { value: '+50', label: 'Global Clients' },
        { value: '3', label: 'Continents Served' },
        { value: '+10', label: 'AI Models Deployed' },
        { value: '24/7', label: 'Support Coverage' }
      ]
    },
    techStack: {
      title: 'Technology Stack',
      subtitle: 'Our Engineering Core',
      items: [
        { name: 'Python', icon: 'fa-brands fa-python fa-fw', category: 'backend' },
        { name: 'TensorFlow', icon: 'fas fa-brain', category: 'backend' },
        { name: 'Angular', icon: 'fab fa-angular', category: 'frontend' },
        { name: 'Node.js', icon: 'fab fa-node', category: 'backend' },
        { name: 'AWS', icon: 'fab fa-aws', category: 'cloud' },
        { name: 'Java', icon: 'fab fa-java', category: 'backend' }
      ]
    },
    projects: {
      title: 'Featured Projects',
      subtitle: 'Innovation in Action',
      items: [
        { title: 'AI Management Dashboard', description: 'Smart analytics platform for business intelligence using Python & React.', image: 'assets/img/projects/panel.png', tags: ['AI', 'React', 'Python'], link: '/portfolio' },
        { title: 'GovTech Platform', description: 'Large scale beneficiary system for local government.', image: 'assets/img/projects/data.png', tags: ['Django', 'PostgreSQL', 'Security'], link: '/portfolio' }
      ]
    },
    reviews: {
      title: 'Testimonials',
      subtitle: 'What Clients Say',
      items: [
        { image: 'assets/img/utils/profile-placeholder.png', name: 'Municipality of Marcos Paz', role: 'Government', company: 'Envión Program', text: 'Excellent technical team, providing robust support and system management.' },
        { image: 'assets/img/utils/profile-placeholder.png', name: 'International Client', role: 'CEO', company: 'Tech Startup', text: 'Arecofix delivered a world-class AI solution suitable for the US market.' }
      ]
    },
    team: {
      title: 'Our Team',
      subtitle: 'Passionate Experts',
      members: [
        { name: 'Ezequiel Enrico Areco', role: 'Lead Software Engineer & AI Specialist', image: 'assets/img/hero-illustration.svg', bio: 'Specialist in AI Development, Full Stack Engineering using Angular/Spring/Python.', socials: { linkedin: 'https://www.linkedin.com/in/ezequiel-enrico/', github: 'https://github.com/arecofix' } }
      ]
    },
    remoteWork: {
      title: 'Global Talent',
      subtitle: 'Remote Work Specialists',
      description: 'We collaborate with companies worldwide, offering top-tier talent in your time zone. Fluent English and Agile culture.',
      benefits: ['Fluent English', 'Agile Process', 'Full Commitment', 'International Quality'],
      cta: 'Hire Us',
      image: 'assets/img/services/software-illustration.webp'
    },
    github: {
      title: 'Open Source',
      subtitle: 'Contributing to the Future',
      repoName: 'arecofix-ai-core',
      repoDescription: 'Libraries for AI integration and clean architecture.',
      stars: '150+',
      forks: '40+',
      link: 'https://github.com/arecofix'
    },
    quote: {
      title: 'Let\'s Talk',
      subtitle: 'Ready to transform your business?',
      form: {
        name: 'Name', email: 'Email', phone: 'Phone', company: 'Company',
        projectType: 'Service of Interest', budget: 'Estimated Budget', description: 'Tell us about your project', cta: 'Send Inquiry'
      }
    },
    coursesTeaser: { title: 'New Skill?', subtitle: 'Train with pros.', cta: 'View Courses', link: '/academy' },
    cellServicePromo: { title: 'Hardware Lab', subtitle: 'Expert device repair.', cta: 'Visit Lab', link: '/celular' },
    businessPillars: {
      title: 'Arecofix Ecosystem',
      subtitle: 'Comprehensive Tech Solutions',
      items: [
        {
          title: 'Hardware Lab',
          description: 'Specialized Lab for mobile & console repairs (Argentina).',
          icon: 'fas fa-microchip',
          image: 'assets/img/services/repair-illustration.webp',
          cta: 'Go to Lab',
          link: '/celular',
          colorClass: 'blue',
          imagePositionClass: 'object-[center_35%]'
        },
        {
          title: 'IT Academy',
          description: 'High-level training for the tech industry. Practical courses in software development, electronics and IT trades.',
          icon: 'fas fa-graduation-cap',
          image: 'assets/img/cursos/profesor.png',
          cta: 'View Academy',
          link: '/academy',
          colorClass: 'green',
          imagePositionClass: 'object-[center_20%]'
        }
      ]
    },
    valueProposition: {
      title: 'Why Choose Us?',
      subtitle: '',
      items: [
        { title: 'AI First', description: 'Integrating intelligence into every solution.', icon: 'fas fa-brain' },
        { title: 'Code Quality', description: 'Clean Architecture & Scalable Patterns.', icon: 'fas fa-code' },
        { title: 'Global Standards', description: 'World-class service for US/EU clients.', icon: 'fas fa-globe' },
        { title: 'Agile & Fast', description: 'Rapid prototyping and delivery.', icon: 'fas fa-bolt' }
      ]
    },
    faq: {
      title: 'FAQ',
      items: [
        { question: 'Do you work with US clients?', answer: 'Yes, we specialize in remote consulting for US and European markets.' },
        { question: 'What AI services do you offer?', answer: 'We build custom Agents, LLM integrations, and predictive models.' }
      ]
    },
    novedadesFooter: {
      title: 'Quick Links',
      links: [
        { text: 'Home', url: '/' },
        { text: 'Services', url: '/servicios' },
        { text: 'Contact', url: '/contacto' }
      ]
    }
  },
  es: {
    hero: {
      title: 'Consultoría IT. Tecnología a medida que resuelve los problemas de tu negocio.',
      subtitle: 'Si sentís que perdés tiempo anotando datos por todos lados o usando programas que no se entienden, nosotros te lo resolvemos. Armamos un sistema único para vos, súper fácil de usar y sin palabras raras. No importa si tu negocio es chico o grande: te entregamos una herramienta para que tengas todo ordenado y puedas crecer sin volverte loco. Nosotros nos ocupamos del sistema, vos de tus ventas.',
      ctaPrimary: 'Agendar una asesoría gratuita',
      ctaSecondary: 'Descubrir cómo pueden ayudarme'
    },
    businessPillars: {
      title: 'Sistemas Embebidos & IoT',
      subtitle: 'Del código al componente: Soluciones Tecnológicas a Medida',
      items: [
        {
          title: 'Laboratorio de Microelectrónica',
          description: 'Servicio técnico especializado en Marcos Paz. Diagnosticamos a nivel componente para revivir tu equipo y recuperar tu información vital, incluso cuando otros lo dan por perdido.',
          icon: 'fas fa-microchip',
          image: 'assets/img/cursos/medicion.png',
          cta: 'Cotizar reparación',
          link: '/celular',
          colorClass: 'blue',
          imagePositionClass: 'object-[center_60%]'
        },
        {
          title: 'Arecofix Academy',
          description: 'Preparate para la industria tecnológica con capacitaciónes de alto nivel. Cursos prácticos de desarrollo de software, programación y distintos oficios.',
          icon: 'fas fa-graduation-cap',
          image: 'assets/img/cursos/profesor.png',
          cta: 'Ver Academia',
          link: '/academy',
          colorClass: 'green',
          imagePositionClass: 'object-[center_20%]'
        }
      ]
    },
    valueProposition: {
      title: 'Ingeniería de Software Aplicada',
      subtitle: 'Arquitecturas Escalables para Proyectos Complejos',
      items: [
        {
          title: 'Integración de Inteligencia Artificial',
          description: 'Implementación técnica de LLMs, Computer Vision RAG y agentes autónomos. Integramos modelos de inteligencia artificial en tus sistemas para automatizar procesos y escalar la capacidad operativa.',
          icon: 'fas fa-brain'
        },
        {
          title: 'Sistemas Estables y Confiables',
          description: 'Olvidate de los programas que se cuelgan o son imposibles de actualizar. Construimos software robusto y probado, diseñado para operar sin interrupciones y acompañar el crecimiento de tu empresa sin rehacer todo desde cero.',
          icon: 'fas fa-layer-group'
        },
        {
          title: 'Operación Centralizada',
          description: 'Conectá todas tus sucursales y equipos de trabajo en tiempo real. Desarrollamos infraestructuras web que centralizan tu información, eliminando los desfasajes de datos y optimizando la toma de decisiones',
          icon: 'fas fa-globe-americas'
        },
        {
          title: 'Sistemas que Crecen con Vos',
          description: 'Empezá con lo que necesitás hoy y sumá funciones mañana. Nuestro software se adapta paso a paso al ritmo de tus ventas, sin obligarte a pagar por herramientas que todavía no usás.',
          icon: 'fas fa-rocket'
        }
      ]
    },
    methodology: {
      title: 'Cómo Trabajamos',
      subtitle: 'Paso a paso, de la idea a la realidad',
      description: 'Te acompañamos en todo el proceso para que sepas exactamente qué estamos haciendo, sin lenguaje técnico complicado y con resultados visibles desde el primer día.',
      steps: [
        { number: '01', title: 'Análisis del Negocio', description: 'Nos sentamos a entender cómo funciona tu empresa hoy, cuáles son los problemas a resolver y qué herramienta exacta necesitás.', icon: 'fas fa-comments' },
        { number: '02', title: 'Diseño a Medida', description: 'Armamos los bocetos visuales del sistema. Nos aseguramos de que sea intuitivo y muy fácil de usar para vos y tus empleados.', icon: 'fas fa-palette' },
        { number: '03', title: 'Desarrollo en Etapas', description: 'Programamos el sistema mostrándote avances reales semana a semana, para que veas cómo toma forma y podamos hacer ajustes a tiempo.', icon: 'fas fa-laptop-code' },
        { number: '04', title: 'Control de Calidad', description: 'Sometemos el programa a pruebas exhaustivas antes de entregarlo. Nos aseguramos de que no haya errores y de que todo funcione perfecto.', icon: 'fas fa-check-double' },
        { number: '05', title: 'Lanzamiento y Soporte', description: 'Subimos el sistema a servidores seguros en la nube para que empieces a usarlo, y seguimos a tu lado para brindar soporte y mantenimiento.', icon: 'fas fa-cloud-arrow-up' }
      ]
    },
    faq: {
      title: 'Preguntas Frecuentes',
      items: [
        { question: '¿Trabajan para el exterior?', answer: 'Ayudamos a empresas de EE. UU., España y Latinoamérica a optimizar sus procesos y potenciar su crecimiento mediante soluciones tecnológicas efectivas. Trabajamos de forma 100% remota.' },
        { question: '¿Hacen desarrollo de IA?', answer: 'Desarrollamos soluciones de IA que transforman negocios. Nos especializamos en chatbots inteligentes que optimizan la atención, sistemas de predicción que mejoran la toma de decisiones y automatizaciones eficientes. Actualmente, lideramos la creación de un asistente inteligente para la gestión académica de la Universidad Nacional del Oeste.' },
        { question: '¿Qué garantía ofrecen?', answer: 'Todos nuestros desarrollos cuentan con garantía de código y soporte post-implementación.' },
        { question: 'Cómo pasaron de arreglar computadoras a crear Inteligencia Artificial?', answer: 'Sí, mantenemos nuestro laboratorio de electronica de alta complejidad en Argentina.' }
      ]
    },
    services: {
      title: 'Servicios de Alta Tecnología',
      subtitle: 'Soluciones Digitales de Punta a Punta',
      items: [
        { icon: 'fas fa-brain', title: 'Consultoría en IA', description: 'Integración de Inteligencia Artificial Generativa y Machine Learning en tus procesos.' },
        { icon: 'fas fa-code', title: 'Software Factory', description: 'Desarrollo a medida de aplicaciones Web y Móviles (Angular, React, Python, Java).' },
        { icon: 'fas fa-users-gear', title: 'Staff Augmentation', description: 'Producimos talento IT de alto nivel para sumarse a tus equipos (Devs, QA, DevOps).' },
        { icon: 'fas fa-robot', title: 'Automatización Inteligente', description: 'RPA y bots para reducir costos operativos y eliminar tareas manuales.' },
        { icon: 'fas fa-server', title: 'Cloud & Ciberseguridad', description: 'Migraciones a la nube y auditorías de seguridad informática.' }
      ]
    },
    industries: {
      title: 'Sectores que Potenciamos',
      subtitle: 'Experiencia Multisectorial',
      items: [
        {
          title: 'Fintech & Cripto',
          description: 'Seguridad y transacciones rápidas.',
          icon: 'fas fa-coins',
          examples: ['Wallets', 'Bots de Trading']
        },
        {
          title: 'Agro & Industria',
          description: 'Tecnología para el campo y fábricas.',
          icon: 'fas fa-tractor',
          examples: ['Monitoreo Satelital', 'IoT']
        },
        {
          title: 'Salud (HealthTech)',
          description: 'Digitalización médica segura.',
          icon: 'fas fa-user-doctor',
          examples: ['Turneros', 'Telemedicina']
        },
        {
          title: 'Retail & E-commerce',
          description: 'Ventas online inteligentes.',
          icon: 'fas fa-store',
          examples: ['Recomendadores', 'Stock AI']
        }
      ]
    },
    techServices: {
      title: 'Stack Tecnológico',
      subtitle: 'Herramientas de Clase Mundial',
      items: [
        {
          title: 'Inteligencia Artificial',
          description: 'Python & Modelos',
          icon: 'fas fa-head-side-virus',
          image: '',
          features: ['TensorFlow', 'OpenAI', 'LangChain', 'Computer Vision']
        },
        {
          title: 'Frontend & UI',
          description: 'Velocidad y Diseño',
          icon: 'fas fa-palette',
          image: '',
          features: ['Angular 17+', 'React', 'Tailwind CSS', 'Figma']
        },
        {
          title: 'Backend Enterprise',
          description: 'Escalabilidad Pura',
          icon: 'fas fa-network-wired',
          image: '',
          features: ['Java Spring Boot', 'Node.js', 'Python Django', 'Go']
        },
        {
          title: 'Infraestructura',
          description: 'Cloud Native',
          icon: 'fas fa-server',
          image: '',
          features: ['AWS', 'Google Cloud', 'Docker', 'Terraform']
        }
      ]
    },
    metrics: {
      title: 'Nuestro Impacto',
      subtitle: 'Métricas Reales',
      items: [
        { value: '+60', label: 'Proyectos Exitosos' },
        { value: '4', label: 'Países Alcanzados' },
        { value: '+15', label: 'Soluciones de IA' },
        { value: '100%', label: 'Compromiso' }
      ]
    },
    techStack: {
      title: 'Tecnologías Principales',
      subtitle: 'Dominamos el ecosistema moderno',
      items: [
        { name: 'Python', icon: 'fa-brands fa-python fa-fw', category: 'backend' },
        { name: 'Java', icon: 'fab fa-java', category: 'backend' },
        { name: 'Angular', icon: 'fab fa-angular', category: 'frontend' },
        { name: 'React', icon: 'fab fa-react', category: 'frontend' },
        { name: 'AWS', icon: 'fab fa-aws', category: 'cloud' },
        { name: 'Postgres', icon: 'fas fa-database', category: 'backend' }
      ]
    },
    projects: {
      title: 'Portfolio Destacado',
      subtitle: 'Innovación aplicada al mundo real',
      items: [
        { title: 'Dashboard de IA', description: 'Plataforma de análisis de datos con modelos predictivos personalizados en Python.', image: 'assets/img/projects/panel.png', tags: ['AI', 'Python', 'React'], link: '/portfolio' },
        { title: 'Sistema de Gobierno', description: 'Plataforma de gestión masiva para el sector público (GovTech).', image: 'assets/img/projects/data.png', tags: ['Java', 'Spring Boot', 'Angular'], link: '/portfolio' }
      ]
    },
    reviews: {
      title: 'Testimonios',
      subtitle: 'Confían en Nosotros',
      items: [
        { image: 'assets/img/utils/profile-placeholder.png', name: 'Municipio de Marcos Paz', role: 'Gobierno', company: 'Sec. de Modernización', text: 'Arecofix modernizó nuestros sistemas legados con una eficiencia increíble.' },
        { image: 'assets/img/utils/profile-placeholder.png', name: 'Startup USA', role: 'CTO', company: 'Fintech', text: 'Gran equipo de desarrollo, excelente comunicación en inglés y calidad de código top.' }
      ]
    },
    team: {
      title: 'Liderazgo Técnico',
      subtitle: 'Visión y Ejecución',
      members: [
        { name: 'Ezequiel Enrico Areco', role: 'Lead Software Engineer & AI Architect', image: 'assets/img/hero-illustration.svg', bio: 'Ingeniero de Software especializado en Inteligencia Artificial, Java Spring Boot y Desarrollo Web Fullstack. Instructor IT.', socials: { linkedin: 'https://www.linkedin.com/in/ezequiel-enrico/', github: 'https://github.com/arecofix' } }
      ]
    },
    remoteWork: {
      title: 'Consultora IT Global',
      subtitle: 'Servicios para USA, Europa y LatAm',
      description: 'Somos tu partner tecnológico ideal. Ofrecemos desarrollo de software de calidad internacional, comunicación fluida y alineación horaria. Llevamos la ingeniería argentina al mundo.',
      benefits: ['Soporte Bilingüe', 'Zona Horaria GMT-3', 'Talento Senior', 'Costos Competitivos'],
      cta: 'Agendar Reunión',
      image: 'assets/img/services/software-illustration.webp'
    },
    github: {
      title: 'Código Abierto',
      subtitle: 'Creamos comunidad',
      repoName: 'arecofix-core',
      repoDescription: 'Nuestras librerías base para acelerar el desarrollo de software seguro.',
      stars: '150+',
      forks: '40+',
      link: 'https://github.com/arecofix'
    },
    quote: {
      title: 'Iniciá tu Transformación',
      subtitle: 'Lleva tu empresa al siguiente nivel con IA',
      form: {
        name: 'Nombre y Apellido', email: 'Email Corporativo', phone: 'WhatsApp / Teléfono', company: 'Empresa / Organización',
        projectType: 'Servicio de Interés', budget: 'Presupuesto Estimado (USD)', description: 'Detanos tu desafío o idea...', cta: 'Solicitar Consultoría'
      }
    },
    coursesTeaser: {
      title: 'Arecofix Academy',
      subtitle: 'Aprende a programar IA y Web con nuestros expertos.',
      cta: 'Ver Cursos',
      link: '/academy'
    },
    cellServicePromo: {
      title: 'Laboratorio Técnico',
      subtitle: 'Reparación de hardware (Celulares, Notebooks, Consolas) en Argentina.',
      cta: 'Ir al Lab',
      link: '/celular'
    },
    novedadesFooter: {
      title: 'Explorar',
      links: [
        { text: 'Servicios', url: '/servicios' },
        { text: 'Portfolio', url: '/portfolio' },
        { text: 'Contacto', url: '/contacto' },
        { text: 'Sitemap', url: '/sitemap' }
      ]
    }
  }
};
