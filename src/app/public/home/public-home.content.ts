
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
            title: 'AI Solutions & Global IT Consultancy',
            subtitle: 'We empower businesses in USA, Europe, and LatAm with custom Artificial Intelligence, Scalable Software, and Digital Transformation. Engineering the future.',
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
                { name: 'Python', icon: 'fab fa-python', category: 'backend' },
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
                    colorClass: 'blue'
                },
                {
                    title: 'IT Academy',
                    description: 'Training the next generation of developers in LatAm.',
                    icon: 'fas fa-graduation-cap',
                    image: 'assets/img/services/academy-illustration.webp',
                    cta: 'View Academy',
                    link: '/academy',
                    colorClass: 'green'
                }
            ]
        },
        valueProposition: {
            title: 'Why Choose Us?',
            subtitle: '',
            items: [
                {title: 'AI First', description: 'Integrating intelligence into every solution.', icon: 'fas fa-brain'},
                 {title: 'Code Quality', description: 'Clean Architecture & Scalable Patterns.', icon: 'fas fa-code'},
                 {title: 'Global Standards', description: 'World-class service for US/EU clients.', icon: 'fas fa-globe'},
                  {title: 'Agile & Fast', description: 'Rapid prototyping and delivery.', icon: 'fas fa-bolt'}
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
        title: 'Consultoría IT Global & Desarrollo de Inteligencia Artificial',
        subtitle: 'Transformamos empresas en Argentina, LatAm, USA y Europa con Software a Medida, Agentes de IA y Arquitecturas Cloud Escalables. Tu socio tecnológico estratégico.',
        ctaPrimary: 'Consultar Proyecto IA',
        ctaSecondary: 'Ver Portfolio'
      },
      businessPillars: {
        title: 'Ecosistema Tecnológico',
        subtitle: 'Soluciones Integrales 360°',
        items: [
          {
            title: 'Laboratorio de Electrónica',
            description: 'Servicio técnico especializado en microelectrónica y recuperación de dispositivos en Marcos Paz (Sede Argentina).',
            icon: 'fas fa-microchip',
            image: 'assets/img/services/repair-illustration.webp',
            cta: 'Ir al Laboratorio',
            link: '/celular',
            colorClass: 'blue'
          },
          {
            title: 'Arecofix Academy',
            description: 'Formación de talento IT de exportación. Cursos de programación y técnica.',
            icon: 'fas fa-graduation-cap',
            image: 'assets/img/services/academy-illustration.webp',
            cta: 'Ver Academia',
            link: '/academy',
            colorClass: 'green'
          }
        ]
      },
      valueProposition: {
        title: 'Ingeniería de Software Premium',
        subtitle: 'Calidad Internacional para Proyectos Ambiciosos',
        items: [
          { 
            title: 'Expertos en IA', 
            description: 'Implementamos LLMs (GPT/Llama), Computer Vision y Agentes Autónomos para optimizar tu negocio.',
            icon: 'fas fa-brain' 
          },
          { 
            title: 'Clean Architecture', 
            description: 'Código limpio, modular y testearble (Angular/Spring/Django) listo para escalar globalmente.',
            icon: 'fas fa-layer-group' 
          },
          { 
            title: 'Alcance Global', 
            description: 'Experiencia trabajando con clientes de USA, España y LatAm. Inglés fluido y cultura remota.',
            icon: 'fas fa-globe-americas' 
          },
          { 
            title: 'Innovación Continua', 
            description: 'Siempre a la vanguardia con las últimas tecnologías del mercado.',
            icon: 'fas fa-rocket' 
          }
        ]
      },
      methodology: {
        title: 'Metodología de Trabajo',
        subtitle: 'De la Idea a la Producción',
        description: 'Combinamos agilidad con robustez técnica para entregar valor desde el día uno.',
        steps: [
          { number: '01', title: 'Consultoría & Estrategia', description: 'Analizamos tu modelo de negocio para aplicar la solución de IA/IT correcta.', icon: 'fas fa-chess' },
          { number: '02', title: 'Diseño UX/UI System', description: 'Creación de interfaces modernas y experiencias de usuario fluidas.', icon: 'fas fa-palette' },
          { number: '03', title: 'Desarrollo Ágil', description: 'Sprints de desarrollo con entregables constantes y feedback activo.', icon: 'fas fa-laptop-code' },
          { number: '04', title: 'QA Automatizado', description: 'Tests unitarios y de integración para garantizar cero fallos.', icon: 'fas fa-check-double' },
          { number: '05', title: 'Despliegue Cloud', description: 'Infraestructura elástica en AWS/Google Cloud y soporte continuo.', icon: 'fas fa-cloud-arrow-up' }
        ]
      },
      faq: {
        title: 'Preguntas Frecuentes',
        items: [
          { question: '¿Trabajan para el exterior?', answer: 'Sí, somos una consultora remota con clientes en USA, España y toda Latinoamérica.' },
          { question: '¿Hacen desarrollo de IA?', answer: 'Sí, desarrollamos chatbots inteligentes, sistemas de predicción y automatización con IA.' },
          { question: '¿Qué garantía ofrecen?', answer: 'Todos nuestros desarrollos cuentan con garantía de código y soporte post-implementación.' },
          { question: '¿Siguen reparando hardware?', answer: 'Sí, mantenemos nuestro laboratorio de hardware de alta complejidad en Argentina.' }
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
                icon: 'fab fa-bitcoin',
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
            { name: 'Python', icon: 'fab fa-python', category: 'backend' },
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
