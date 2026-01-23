import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PreferencesService } from '../../shared/services/preferences.service';
import { CertificateGalleryComponent } from '../../shared/components/certificate-gallery/certificate-gallery.component';
import { interval, Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';

interface BackendHighlight {
  title: string;
  icon: string;
  description: string;
  stats: { label: string; value: string }[];
}

interface CodeSnippet {
  title: string;
  language: string;
  code: string;
  description: string;
}

interface SystemStatus {
  name: string;
  status: 'operational' | 'degraded' | 'maintenance';
  latency: number;
  uptime: string;
}

interface PortfolioContent {
  name: string;
  role: string;
  tagline: string;
  location: string;
  email: string;
  linkedin: string;
  github: string;
  cvUrl: string;
  about: string;
  backendHighlights: BackendHighlight[];
  codeSnippets: CodeSnippet[];
  technicalSkills: TechnicalSkill[];
  projects: Project[];
  workExperience: WorkExperience[];
}

interface WorkExperience {
  position: string;
  company: string;
  period: string;
  description: string;
  techStack: string[];
}

interface TechnicalSkill {
  category: string;
  skills: { name: string; icon: string; description: string }[];
}

interface Project {
  title: string;
  description: string;
  image: string;
  techStack: string[];
  features: string[];
  link?: string;
  github?: string;
}

@Component({
  selector: 'app-portfolio',
  standalone: true,
  imports: [CommonModule, RouterLink, CertificateGalleryComponent, NgOptimizedImage],
  templateUrl: './portfolio.html',
  styleUrls: ['./portfolio.css']
})
export class PortfolioComponent implements OnInit, OnDestroy {
  currentLanguage: 'en' | 'es' = 'es';
  activeSnippetIndex = 0;
  terminalOutput: string[] = [];
  systemStatuses: SystemStatus[] = [
    { name: 'Supabase Auth', status: 'operational', latency: 45, uptime: '99.99%' },
    { name: 'PostgreSQL DB', status: 'operational', latency: 12, uptime: '99.95%' },
    { name: 'Node.js API', status: 'operational', latency: 28, uptime: '99.90%' },
    { name: 'Redis Cache', status: 'operational', latency: 5, uptime: '99.99%' }
  ];
  
  private simulationSubscription?: Subscription;

  portfolioContent: { en: PortfolioContent; es: PortfolioContent } = {
    es: {
      name: 'EZEQUIEL ENRICO ARECO',
      role: 'Senior Backend & Fullstack Engineer',
      tagline: 'Arquitecto de Soluciones Escalables | Experto en Node.js & Cloud',
      location: 'Buenos Aires, Argentina',
      email: 'ezequielenrico15@gmail.com',
      linkedin: environment.contact.socialMedia.linkedin,
      github: environment.contact.socialMedia.github,
      cvUrl: environment.externalUrls.portfolio.cv,
      about: 'Ingeniero de Software con profunda especialización en arquitectura de backend, diseño de APIs RESTful de alto rendimiento y optimización de bases de datos. Mi enfoque combina la robustez de la ingeniería de sistemas con metodologías modernas como Clean Architecture y TDD. Comprometido con la excelencia técnica, la seguridad y la escalabilidad.',
      backendHighlights: [
        {
          title: 'Arquitectura de Microservicios',
          icon: 'fas fa-server',
          description: 'Diseño e implementación de sistemas distribuidos desacoplados utilizando Node.js y comunicación por eventos.',
          stats: [{ label: 'Escalabilidad', value: 'Alta' }, { label: 'Disponibilidad', value: '99.9%' }]
        },
        {
          title: 'Optimización de Bases de Datos',
          icon: 'fas fa-database',
          description: 'Tuning avanzado de consultas SQL, indexación estratégica y modelado de datos eficiente en PostgreSQL y Supabase.',
          stats: [{ label: 'Query Time', value: '-60%' }, { label: 'Throughput', value: '2x' }]
        },
        {
          title: 'Seguridad & Auth',
          icon: 'fas fa-shield-alt',
          description: 'Implementación de esquemas robustos de autenticación (JWT, OAuth2) y políticas de seguridad Row Level Security (RLS) con enfoque en DevSecOps.',
          stats: [{ label: 'Compliance', value: 'OWASP' }, { label: 'Seguridad', value: 'A+' }]
        }
      ],
      codeSnippets: [
        {
          title: 'Node.js Clean Architecture Controller',
          language: 'typescript',
          description: 'Implementación de un controlador genérico siguiendo principios SOLID y manejo de errores centralizado.',
          code: `
export class BaseController {
  protected async execute(req: Request, res: Response): Promise<void | any> {
    try {
      await this.executeImpl(req, res);
    } catch (error) {
      console.error(\`[BaseController]: Uncaught controller error\`);
      console.error(error);
      this.fail(res, 'An unexpected error occurred');
    }
  }

  public static jsonResponse(res: Response, code: number, message: string) {
    return res.status(code).json({ message });
  }
}`
        },
        {
          title: 'Supabase RLS Policy (SQL)',
          language: 'sql',
          description: 'Política de seguridad a nivel de fila para asegurar aislamiento de datos por tenant.',
          code: `
-- Enable RLS
ALTER TABLE "orders" ENABLE ROW LEVEL SECURITY;

-- Create Policy
CREATE POLICY "Tenant Isolation Policy"
ON "orders"
FOR ALL
USING (
  tenant_id = auth.jwt() ->> 'tenant_id'
);`
        }
      ],
      technicalSkills: [
        { 
          category: 'High-Performance Backend', 
          skills: [
            { name: 'Java Enterprise', icon: 'fa-brands fa-java', description: 'Desarrollo de sistemas distribuidos robustos, multithreading y gestión de memoria avanzada.' },
            { name: 'Spring Boot', icon: 'fa-brands fa-envira', description: 'Arquitectura de microservicios, Spring Cloud, Spring Security y DI para aplicaciones empresariales.' },
            { name: 'Node.js', icon: 'fa-brands fa-node', description: 'Event-driven, Streams API y escalabilidad horizontal para servicios de alta concurrencia.' },
            { name: 'C# .NET', icon: 'fa-brands fa-microsoft', description: 'Desarrollo de soluciones corporativas, LINQ, Entity Framework y optimización de rendimiento.' },
            { name: 'Python', icon: 'fa-brands fa-python', description: 'Scripting de automatización, análisis de datos y desarrollo backend con Django/FastAPI.' }
          ] 
        },
        { 
          category: 'Cloud Infrastructure & DevOps', 
          skills: [
            { name: 'Docker & Kubernetes', icon: 'fa-brands fa-docker', description: 'Orquestación de contendores, CI/CD pipelines y gestión de entornos aislados.' },
            { name: 'Supabase / Postgres', icon: 'fas fa-database', description: 'Diseño de esquemas complejos, Stored Procedures, Triggers y optimización de índices.' },
            { name: 'Redis', icon: 'fas fa-server', description: 'Estrategias de caching distribuido, Pub/Sub y gestión de sesiones de alta velocidad.' },
            { name: 'Linux Hardening', icon: 'fa-brands fa-linux', description: 'Administración de servidores, scripting bash y seguridad de nivel kernel.' }
          ] 
        },
        { 
          category: 'Modern Frontend & Architecture', 
          skills: [
            { name: 'Angular', icon: 'fa-brands fa-angular', description: 'Aplicaciones SPA escalables, RxJS avanzado, señales y gestión de estado reactivo.' },
            { name: 'Clean Architecture', icon: 'fas fa-project-diagram', description: 'Implementación estricta de principios SOLID, DDD y separación de responsabilidades.' },
            { name: 'System Design', icon: 'fas fa-sitemap', description: 'Diseño de sistemas de alto nivel, patrones de diseño y diagramado de arquitectura.' }
          ] 
        }
      ],
      projects: [
        {
          title: 'Sistema de Gestión para Ecommerce',
          description: 'Sistema integral de gestión para E-commerce y Servicios Técnicos. Panel de administración robusto con control de inventario en tiempo real, gestión de ventas, seguimiento de órdenes de servicio, clientes, y reportes financieros detallados. Incluye facturación automatizada, integración con pasarelas de pago, y módulos de logística.',
          image: 'assets/img/projects/panel.png',
          techStack: ['Node.js', 'Angular', 'Supabase', 'Redis', 'Docker'],
          features: ['Gestión de Inventario', 'CRM & Ventas', 'Reportes Financieros', 'Trazabilidad de Servicio'],
          link: environment.baseUrl
        },
        {
          title: 'Enterprise ERP System with Java Spring',
          description: 'Reingeniería de legacy a microservicios. Sistema distribuido para gestión de recursos empresariales en tiempo real.',
          image: 'assets/img/projects/panel.png',
          techStack: ['Java 21', 'Spring Boot 3', 'Kafka', 'PostgreSQL'],
          features: ['Event Sourcing', 'Distributed Tracing', 'CQRS Partner Integration']
        }
      ],
      workExperience: [
        {
          position: 'Profesor de Reparación de Artículos Electrónicos',
          company: 'IAP Marcos Paz',
          period: '2025 - Presente',
          description: 'Principalmente Reparación de Celulares. Dictado de cursos especializados en reparación de hardware, microelectrónica y diagnóstico de fallas. Formación técnica práctica y teórica para futuros técnicos.',
          techStack: ['Microelectrónica', 'Hardware', 'Diagnóstico Avanzado']
        },
        {
          position: 'Líder Técnico & Desarrollador Fullstack',
          company: 'Arecofix',
          period: '2020 - 2023',
          description: 'Lideré la transformación digital del negocio, diseñando la arquitectura completa del sistema de gestión y ventas. Implementé CI/CD pipelines y optimicé el rendimiento del servidor en un 300%.',
          techStack: ['Node.js', 'Angular', 'Supabase', 'Docker']
        },
        {
          position: 'Instructor de Desarrollo de Software',
          company: 'Eddis Educativa',
          period: '2022 - Presente',
          description: 'Capacitación de más de 50 alumnos en tecnologías web modernas, mentoreando proyectos finales y enseñando mejores prácticas de la industria.',
          techStack: ['HTML/CSS/JS', 'Programación Lógica']
        },
        {
          position: 'Equipo Técnico de Sistemas',
          company: 'Municipio de Marcos Paz',
          period: 'Until 2023', 
          description: 'Mantenimiento y evolución de sistemas gubernamentales críticos. Gestión de bases de datos y soporte de infraestructura.',
          techStack: ['Soporte IT', 'Redes', 'Sistemas Legacy']
        }
      ]
    },
    en: {
      name: 'EZEQUIEL ENRICO ARECO',
      role: 'Senior Backend & Fullstack Engineer',
      tagline: 'Scalable Solutions Architect | Node.js & Cloud Expert',
      location: 'Buenos Aires, Argentina',
      email: 'ezequielenrico15@gmail.com',
      linkedin: environment.contact.socialMedia.linkedin,
      github: environment.contact.socialMedia.github,
      cvUrl: environment.externalUrls.portfolio.cv,
      about: 'Software Engineer with deep specialization in backend architecture, high-performance RESTful API design, and database optimization. My approach combines systems engineering robustness with modern methodologies like Clean Architecture and TDD. Committed to technical excellence, security, and scalability.',
      backendHighlights: [
        {
          title: 'Microservices Architecture',
          icon: 'fas fa-server',
          description: 'Design and implementation of decoupled distributed systems using Node.js and event-driven communication.',
          stats: [{ label: 'Scalability', value: 'High' }, { label: 'Availability', value: '99.9%' }]
        },
        {
          title: 'Database Optimization',
          icon: 'fas fa-database',
          description: 'Advanced SQL query tuning, strategic indexing, and efficient data modeling in PostgreSQL and Supabase.',
          stats: [{ label: 'Query Time', value: '-60%' }, { label: 'Throughput', value: '2x' }]
        },
        {
          title: 'Security & Auth',
          icon: 'fas fa-shield-alt',
          description: 'Implementation of robust authentication schemes (JWT, OAuth2) and Row Level Security (RLS) policies with a DevSecOps focus.',
          stats: [{ label: 'Compliance', value: 'OWASP' }, { label: 'Security', value: 'A+' }]
        }
      ],
      codeSnippets: [
        {
          title: 'Node.js Clean Architecture Controller',
          language: 'typescript',
          description: 'Implementation of a generic controller following SOLID principles and centralized error handling.',
          code: `
export class BaseController {
  protected async execute(req: Request, res: Response): Promise<void | any> {
    try {
      await this.executeImpl(req, res);
    } catch (error) {
      console.error(\`[BaseController]: Uncaught controller error\`);
      console.error(error);
      this.fail(res, 'An unexpected error occurred');
    }
  }

  public static jsonResponse(res: Response, code: number, message: string) {
    return res.status(code).json({ message });
  }
}`
        },
        {
          title: 'Supabase RLS Policy (SQL)',
          language: 'sql',
          description: 'Row Level Security policy to ensure data isolation by tenant.',
          code: `
-- Enable RLS
ALTER TABLE "orders" ENABLE ROW LEVEL SECURITY;

-- Create Policy
CREATE POLICY "Tenant Isolation Policy"
ON "orders"
FOR ALL
USING (
  tenant_id = auth.jwt() ->> 'tenant_id'
);`
        }
      ],
      technicalSkills: [
        { 
          category: 'High-Performance Backend', 
          skills: [
            { name: 'Java Enterprise', icon: 'fa-brands fa-java', description: 'Robust distributed systems, multithreading, and advanced memory management.' },
            { name: 'Spring Boot', icon: 'fa-brands fa-envira', description: 'Microservices architecture, Spring Cloud, Spring Security, and Enterprise DI.' },
            { name: 'Node.js', icon: 'fa-brands fa-node', description: 'Event-driven architecture, Streams API, and horizontal scalability for high-concurrency services.' },
            { name: 'C# .NET', icon: 'fa-brands fa-microsoft', description: 'Corporate solutions development, LINQ, Entity Framework, and performance optimization.' },
            { name: 'Python', icon: 'fa-brands fa-python', description: 'Automation scripting, data analysis, and backend development with Django/FastAPI.' }
          ] 
        },
        { 
          category: 'Cloud Infrastructure & DevOps', 
          skills: [
            { name: 'Docker & Kubernetes', icon: 'fa-brands fa-docker', description: 'Container orchestration, CI/CD pipelines, and isolated environment management.' },
            { name: 'Supabase / Postgres', icon: 'fas fa-database', description: 'Complex schema design, Stored Procedures, Triggers, and index optimization.' },
            { name: 'Redis', icon: 'fas fa-server', description: 'Distributed caching strategies, Pub/Sub, and high-speed session management.' },
            { name: 'Linux Hardening', icon: 'fa-brands fa-linux', description: 'Server administration, bash scripting, and kernel-level security.' }
          ] 
        },
        { 
          category: 'Modern Frontend & Architecture', 
          skills: [
            { name: 'Angular', icon: 'fa-brands fa-angular', description: 'Scalable SPA applications, advanced RxJS, signals, and reactive state management.' },
            { name: 'Clean Architecture', icon: 'fas fa-project-diagram', description: 'Strict implementation of SOLID principles, DDD, and separation of concerns.' },
            { name: 'System Design', icon: 'fas fa-sitemap', description: 'High-level system design, design patterns, and architectural diagramming.' }
          ] 
        }
      ],
      projects: [
        {
          title: 'System Management for Ecommerce',
          description: 'Comprehensive management system for E-commerce and Technical Services. Robust admin panel with real-time inventory control, sales management, service order tracking, clients, and detailed financial reports. Includes automated invoicing, payment gateway integration, and logistics modules.',
          image: 'assets/img/projects/panel.png',
          techStack: ['Node.js', 'Angular', 'Supabase', 'Redis', 'Docker'],
          features: ['Inventory Management', 'CRM & Sales', 'Financial Reports', 'Service Traceability'],
          link: environment.baseUrl
        },
        {
          title: 'Enterprise ERP System with Java Spring',
          description: 'Legacy to microservices re-engineering. Distributed system for real-time enterprise resource management.',
          image: 'assets/img/projects/panel.png',
          techStack: ['Java 21', 'Spring Boot 3', 'Kafka', 'PostgreSQL'],
          features: ['Event Sourcing', 'Distributed Tracing', 'CQRS Partner Integration']
        }
      ],
      workExperience: [
        {
          position: 'Electronics Repair Professor',
          company: 'IAP Marcos Paz',
          period: '2025 - Present',
          description: 'Mainly Cell Phone Repair. Teaching specialized courses in hardware repair, microelectronics, and fault diagnosis. Practical and theoretical technical training for future technicians.',
          techStack: ['Microelectronics', 'Hardware', 'Advanced Diagnosis']
        },
        {
          position: 'Technical Lead & Fullstack Developer',
          company: 'Arecofix',
          period: '2020 - 2023',
          description: 'Led the digital transformation of the business, designing the complete architecture of the management and sales system. Implemented CI/CD pipelines and optimized server performance by 300%.',
          techStack: ['Node.js', 'Angular', 'Supabase', 'Docker']
        },
        {
          position: 'Software Development Instructor',
          company: 'Eddis Educativa',
          period: '2022 - Present',
          description: 'Training over 50 students in modern web technologies, mentoring final projects, and teaching industry best practices.',
          techStack: ['HTML/CSS/JS', 'Logic Programming']
        },
        {
          position: 'Systems Technical Team',
          company: 'Municipality of Marcos Paz',
          period: 'Until 2023',
          description: 'Maintenance and evolution of critical government systems. Database management and infrastructure support.',
          techStack: ['IT Support', 'Networking', 'Legacy Systems']
        }
      ]
    }
  };

  backgroundOptions = [
    { id: 'gradient-5', name: 'Dark Gray', class: 'bg-surface-dark' },
  ];

  constructor(public preferencesService: PreferencesService) {}

  get currentContent(): PortfolioContent {
    return this.portfolioContent[this.currentLanguage];
  }

  ngOnInit(): void {
    this.preferencesService.language$.subscribe(lang => {
      this.currentLanguage = lang;
    });

    // Simulate realtime terminal updates
    this.simulationSubscription = interval(2000).subscribe(() => {
      this.simulateSystemActivity();
    });
    
    this.terminalOutput = [
      '> Initializing system...',
      '> Connected to Supabase Engine v2.0',
      '> Loading modules...',
      '> System ready.'
    ];
  }

  ngOnDestroy(): void {
    if (this.simulationSubscription) {
      this.simulationSubscription.unsubscribe();
    }
  }

  simulateSystemActivity() {
    // Randomly update latencies
    this.systemStatuses.forEach(stat => {
      const variation = Math.floor(Math.random() * 10) - 5;
      stat.latency = Math.max(1, stat.latency + variation);
    });

    // Add random log
    const logs = [
      '[INFO] GET /api/v1/products 200 OK',
      '[INFO] Auth Check: Token Valid',
      '[DEBUG] Cache Hit: user_profile_123',
      '[INFO] Supabase: Realtime subscription active',
      '[WARN] High CPU load on Node-Worker-1 (transient)',
    ];
    const randomLog = logs[Math.floor(Math.random() * logs.length)];
    this.terminalOutput.push(`> ${new Date().toLocaleTimeString()} ${randomLog}`);
    if (this.terminalOutput.length > 8) this.terminalOutput.shift();
  }
}
