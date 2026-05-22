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
  tags: string[];
}

interface SystemStatus {
  name: string;
  status: 'operational' | 'degraded' | 'maintenance';
  latency: number;
  uptime: string;
}

interface QuickScan {
  title: string;
  roleLabel: string;
  roleValue: string;
  primaryTechLabel: string;
  primaryTechValue: string;
  primaryTechIcon: string;
  complementaryLabel: string;
  complementaryValue: string;
  cloudDbLabel: string;
  cloudDbValue: string;
  keyStrengthsLabel: string;
  keyStrengths: string[];
}

interface PortfolioContent {
  image?: string;
  name: string;
  role: string;
  tagline: string;
  location: string;
  email: string;
  linkedin: string;
  github: string;
  cvUrl: string;
  about: string;
  quickScan: QuickScan;
  backendHighlights: BackendHighlight[];
  codeSnippets: CodeSnippet[];
  technicalSkills: TechnicalSkill[];
  projects: Project[];
  workExperience: WorkExperience[];
  downloadCvLabel: string;
  availableForHireLabel: string;
  projectsTitleHtml: string;
  technicalMasteryTitleHtml: string;
  engineeringExcellenceTitleHtml: string;
  experienceLogTitleHtml: string;
  githubPinsTitleHtml: string;
  githubPinsSubLabel: string;
  allReposLabel: string;
  viewProjectLabel: string;
  liveDemoLabel: string;
  sourceCodeLabel: string;
  dragToPanLabel: string;
  readyToScaleTitle: string;
  initializeContactLabel: string;
  verifiedCredentialsLabel: string;
  resetLabel: string;
  keyAchievementsLabel: string;
  hoverToSeeAchievementsLabel: string;
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
  isCore?: boolean;
  skills: { name: string; icon: string; description: string; isPrimary?: boolean }[];
}

interface Project {
  title: string;
  description: string;
  image: string;
  techStack: string[];
  features: string[];
  link?: string;
  github?: string;
  featured?: boolean;
  achievements?: string[];
  impact?: string;
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
    { name: 'Nginx Gateway', status: 'operational', latency: 15, uptime: '99.99%' },
    { name: 'PostgreSQL DB (RLS)', status: 'operational', latency: 8, uptime: '99.95%' },
    { name: 'Docker Host', status: 'operational', latency: 18, uptime: '99.95%' },
    { name: 'Backup Daemon', status: 'operational', latency: 5, uptime: '99.99%' }
  ];

  private simulationSubscription?: Subscription;

  portfolioContent: { en: PortfolioContent; es: PortfolioContent } = {
    es: {
      image: 'assets/img/portfolio/ezequiel-enrico-areco.jpeg',
      name: 'EZEQUIEL ENRICO ARECO',
      role: 'Software Developer & DevOps | Backend, Infrastructure & Cybersecurity',
      tagline: 'Desarrollador enfocado en construir arquitecturas escalables y seguras. Combino la automatizacion de infraestructura (CI/CD) y la administración de sistemas Linux para desplegar productos SaaS y aplicaciones de seguridad de alto rendimiento. Actualmente complementando mi perfil tecnico con la Licenciatura en Informatica (UNO)',
      location: 'Buenos Aires, Argentina',
      email: 'ezequielenrico15@gmail.com',
      linkedin: environment.contact.socialMedia.linkedin,
      github: environment.contact.socialMedia.github,
      cvUrl: environment.externalUrls.portfolio.cv,
      about: 'Soy desarrollador y estudiante de la Licenciatura en Informática en la Universidad Nacional del Oeste (Promedio: 8.40). Me especializo en DevOps y Ciberseguridad, con fuerte enfoque en automatización de infraestructura, seguridad en bases de datos (políticas RLS/RBAC) e implementación de pipelines CI/CD. Cuento con experiencia administrando servidores Linux, optimizando contenedores Docker y aplicando auditorías de seguridad como HaveIBeenPwned en sistemas empresariales. Nivel de inglés C1 certificado para integración en equipos globales.',
      quickScan: {
        title: 'Sobre mí',
        roleLabel: 'Especialización',
        roleValue: 'Python',
        primaryTechLabel: 'Foco Principal',
        primaryTechValue: 'Terraform, Docker, Linux, CI/CD',
        primaryTechIcon: 'fa-solid fa-shield-halved',
        complementaryLabel: 'Base de datos & Seguridad',
        complementaryValue: 'Bash/Shell, Powershell, AWS, PostgreSQL RLS, Github',
        cloudDbLabel: 'Backend & Cloud',
        cloudDbValue: 'Java, Node.js, Supabase, Firebase',
        keyStrengthsLabel: 'Fortalezas Clave',
        keyStrengths: ['Licenciatura en Informática (UNO)', 'Promedio Académico: 8.40', 'Inglés Avanzado C1 (Global Teams)', 'Automatización & Hardening de Servidores']
      },
      backendHighlights: [
        {
          title: 'Infraestructura & Automatización',
          icon: 'fas fa-server',
          description: 'Diseño y administración de entornos virtualizados con Docker, automatización de tareas con scripting Bash/Powershell y configuración de servidores web (Nginx).',
          stats: [{ label: 'Contenedores', value: 'Docker' }, { label: 'Scripting', value: 'Bash / Powershell' }]
        },
        {
          title: 'Ciberseguridad y SecOps',
          icon: 'fas fa-shield-alt',
          description: 'Seguridad a nivel de base de datos (PostgreSQL RLS), control de acceso basado en roles (RBAC), autenticación JWT y auditorías de vulnerabilidad con HaveIBeenPwned API.',
          stats: [{ label: 'Políticas', value: 'RLS / RBAC' }, { label: 'Auditoría', value: 'HIBP API' }]
        },
        {
          title: 'CI/CD & Flujos Git',
          icon: 'fas fa-sync-alt',
          description: 'Implementación de flujos de integración y despliegue continuo (CI/CD) combinando metodologías Gitflow para desarrollo ordenado y despliegues estables.',
          stats: [{ label: 'Metodología', value: 'Gitflow' }, { label: 'Integración', value: 'CI/CD Pipelines' }]
        }
      ],
      codeSnippets: [
        {
          title: 'Políticas de Seguridad a Nivel de Fila (PostgreSQL RLS)',
          language: 'sql',
          description: 'Definición de políticas RLS para garantizar el aislamiento multi-tenant y control de accesos a nivel de filas.',
          code: `
-- Habilitar seguridad a nivel de fila (RLS)
ALTER TABLE tenant_records ENABLE ROW LEVEL SECURITY;

-- Política para aislar accesos de inquilinos (Multi-tenant isolation)
CREATE POLICY tenant_isolation_policy ON tenant_records
FOR ALL
USING (tenant_id = auth.jwt() ->> 'tenant_id')
WITH CHECK (tenant_id = auth.jwt() ->> 'tenant_id');

-- Política restrictiva para Administradores de Seguridad
CREATE POLICY security_admin_policy ON security_logs
FOR SELECT
TO security_admin
USING (true);`,
          tags: ['SQL', 'PostgreSQL', 'RLS', 'Security']
        },
        {
          title: 'Respaldo y Rotación de Contenedores Docker (Bash)',
          language: 'bash',
          description: 'Script de automatización en Bash para realizar copias de seguridad de contenedores de base de datos Docker con rotación y compresión.',
          code: `
#!/bin/bash
CONTAINER_NAME="db_postgres_prod"
BACKUP_DIR="/var/backups/db"
RETENTION_DAYS=7
TIMESTAMP=\$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="\${BACKUP_DIR}/backup_\${TIMESTAMP}.sql.gz"

# Asegurar directorio de destino
mkdir -p "\${BACKUP_DIR}"

# Ejecutar volcado de base de datos comprimido
echo "Iniciando respaldo de \${CONTAINER_NAME}..."
docker exec -t "\${CONTAINER_NAME}" pg_dumpall -U postgres | gzip > "\${BACKUP_FILE}"

if [ \$? -eq 0 ]; then
    echo "Respaldo exitoso: \${BACKUP_FILE}"
else
    echo "ERROR: Falló el respaldo de la base de datos" >&2
    exit 1
fi

# Rotación de respaldos antiguos (retener sólo RETENTION_DAYS)
echo "Eliminando respaldos de más de \${RETENTION_DAYS} días..."
find "\${BACKUP_DIR}" -name "backup_*.sql.gz" -mtime +\${RETENTION_DAYS} -delete`,
          tags: ['Bash', 'DevOps', 'Docker', 'Automation']
        }
      ],
      technicalSkills: [
        {
          category: 'DevOps & Automatización (Core Focus)',
          isCore: true,
          skills: [
            { name: 'Docker & Contenedores', icon: 'fa-brands fa-docker', description: 'Contenedorización de aplicaciones, optimización de builds multi-etapa y orquestación de servicios en producción.', isPrimary: true },
            { name: 'Scripting & Linux (Bash)', icon: 'fas fa-terminal', description: 'Automatización de tareas con scripting Bash/Powershell, tareas programadas (cron), monitoreo y SysAdmin general.', isPrimary: true },
            { name: 'Angular', icon: 'fa-brands fa-git-alt', description: 'Desarrollo de aplicaciones PWA Utilizando Frameworks para el Frontend Manejo de Git y Control de versiones profesional, administración de flujos de trabajo e integración en pipelines bajo metodologías ágiles.', isPrimary: true }
          ]
        },
        {
          category: 'Ciberseguridad & SecOps',
          skills: [
            { name: 'Seguridad de Datos (RLS/RBAC)', icon: 'fas fa-shield-alt', description: 'Definición de políticas de acceso granular Row-Level Security en PostgreSQL y control basado en roles en APIs.' },
            { name: 'Autenticación & Criptografía', icon: 'fas fa-key', description: 'Autenticación segura con JWT, OAuth2 y auditoría activa de credenciales vulnerables contra la base de datos de HaveIBeenPwned.' },
            { name: 'Monitoreo & Auditoría', icon: 'fas fa-eye', description: 'Supervisión de logs de accesos de infraestructura, escaneo de vulnerabilidades en contenedores y normativas de protección de datos.' }
          ]
        },
        {
          category: 'Backend & Persistencia',
          skills: [
            { name: 'Bases de Datos Relacionales (SQL)', icon: 'fas fa-database', description: 'Diseño lógico, optimización de consultas complejas, normalización, indexación y administración de Postgres y MySQL.' },
            { name: 'Frameworks Backend', icon: 'fa-solid fa-code', description: 'Desarrollo de APIs y microservicios robustos aplicando Python (Django, Flask), Java (Spring Boot) o Node.js.' }
          ]
        },
        {
          category: 'Educación & Certificaciones',
          skills: [
            { name: 'Licenciatura en Informática (UNO)', icon: 'fas fa-graduation-cap', description: 'Estudiante universitario (Promedio: 8.40) con bases teóricas sólidas en redes, criptografía y algoritmos.' },
            { name: 'Inglés Avanzado B2', icon: 'fas fa-language', description: 'Nivel C1 certificado. Fluidez en conversación y documentación técnica para integración inmediata en equipos internacionales.' }
          ]
        }
      ],
      projects: [
        {
          title: 'Arecofixpage',
          description: 'Sitio web oficial y portal web de Arecofix. Plataforma SPA profesional para la gestión de soporte técnico, comercio electrónico de repuestos, reserva de turnos en línea y catálogo de cursos de capacitación electrónica.',
          image: 'assets/img/readme/1.png',
          techStack: ['Angular 17', 'TypeScript', 'Tailwind CSS', 'Supabase', 'RxJS', 'Firebase'],
          features: ['Plataforma Multiusuario y Reservas', 'Catálogo de Repuestos y E-Commerce', 'Sección Dinámica de Cursos Técnicos', 'Diseño Responsivo e Interactivo'],
          github: 'https://github.com/arecofix/Arecofixpage',
          link: 'https://arecofix.com.ar',
          impact: '100% PWA',
          achievements: [
            'Desarrollo de una PWA rápida y optimizada para SEO (SSR y Prerendering) con 100% de accesibilidad.',
            'Integración de pasarela de pago para reserva de turnos en línea y matriculación automatizada a cursos.'
          ]
        },
        {
          title: 'Django Portfolio',
          description: 'Sitio web de portafolio dinámico desarrollado con el framework web Django en Python. Incluye un sistema de gestión de contenidos (CMS) a través de Django Admin para administrar proyectos, habilidades y CV en tiempo real.',
          image: 'assets/img/projects/django_portfolio.png',
          techStack: ['Python', 'Django', 'SQLite/PostgreSQL', 'Django Admin', 'HTML5 / CSS3', 'JavaScript'],
          features: ['Panel de Administración Integrado', 'Modelado Relacional de Datos', 'Vistas y Renders Dinámicos', 'Formularios con Validación Integrada'],
          github: 'https://github.com/arecofix/portfolio-django',
          impact: '<1 min CMS',
          achievements: [
            'Panel de administración personalizado (CMS) para actualizaciones de contenido en tiempo real en menos de 1 minuto.',
            'Diseño responsivo y adaptado para dispositivos móviles, aumentando la tasa de conversión de reclutadores.'
          ]
        },
        {
          title: 'Zarx System',
          description: 'Robusto panel administrativo multi-tenant de nivel empresarial. Cuenta con estrictas políticas de seguridad a nivel de filas (RLS), validación de credenciales filtradas (HaveIBeenPwned), e importador transaccional masivo vía RPC SQL.',
          image: 'assets/img/readme/gestiondesucursales.png',
          techStack: ['Angular 17', 'Supabase (Auth & Database)', 'Node.js', 'PostgreSQL', 'Tailwind CSS', 'Docker'],
          features: ['Seguridad Endurecida (RLS y HIBP)', 'Importador Masivo CSV vía RPC', 'Cumplimiento de Accesibilidad WCAG AA', 'Arquitectura Multi-tenant Escalable'],
          github: 'https://github.com/arecofix/zarx',
          impact: 'Postgres RLS',
          achievements: [
            'Seguridad de nivel bancario con políticas RLS de PostgreSQL y chequeo de contraseñas vulnerables en tiempo real.',
            'Procesamiento masivo de datos mediante RPC SQL, permitiendo importar miles de registros en segundos.'
          ]
        },
        {
          title: 'Embeddable AI Chatbot',
          description: 'Widget de chatbot inteligente e interactivo impulsado por IA que se puede embeber en cualquier sitio web agregando una sola línea de script. Diseñado para integrarse con modelos de lenguaje a través de llamadas de API optimizadas.',
          image: 'assets/img/projects/ai_chatbot.png',
          techStack: ['TypeScript', 'Web Components', 'CSS Variables', 'OpenAI/Gemini APIs', 'Webpack'],
          features: ['Integración Ultra Rápía (Embed)', 'Respuestas Contextuales Automáticas', 'Diseño Modular y Estilos Personalizables', 'Carga Asíncrona sin Bloquear el Hilo Principal'],
          github: 'https://github.com/arecofix/embeddable-ai-chatbot',
          impact: '-60% Soporte',
          achievements: [
            'Widget ligero (<15KB comprimido) integrable con una sola línea de script en cualquier plataforma.',
            'Reducción del 60% en el tiempo de soporte al cliente automatizando las preguntas frecuentes mediante IA.'
          ]
        },
        {
          title: 'Enterprise ERP System with Java Spring',
          description: 'Reingeniería y migración de arquitectura legacy a microservicios empresariales robustos. Sistema distribuido para gestión de recursos empresariales en tiempo real, utilizando Project Loom para un manejo eficiente de la concurrencia y optimizacion del uso de hilos del procesador.',
          image: 'assets/img/readme/4.png',
          techStack: ['Java 21', 'Spring Boot 3', 'Project Loom', 'Kafka', 'PostgreSQL', 'Hibernate'],
          features: ['Arquitectura de Microservicios', 'Concurrencia con Virtual Threads', 'Persistencia Hibernate / JPA', 'Mensajería Asíncrona con Kafka'],
          github: 'https://github.com/arecofix',
          impact: '-50% Latency',
          achievements: [
            'Reducción del 50% en el tiempo de respuesta del servidor mediante el uso de hilos virtuales de Java 21.',
            'Procesamiento de más de 10,000 transacciones concurrentes por minuto sin degradación de rendimiento.'
          ]
        },
        {
          title: 'Sistema de Gestión para Ecommerce',
          description: 'Sistema integral de gestión para E-commerce y Servicios Técnicos. Panel de administración robusto con control de inventario en tiempo real, gestión de ventas, seguimiento de órdenes de servicio, clientes, y reportes financieros detallados. Incluye facturación automatizada, integración con pasarelas de pago, y módulos de logística.',
          image: 'assets/img/readme/6.png',
          techStack: ['Node.js', 'Angular', 'Supabase', 'Redis', 'Docker'],
          features: ['Gestión de Inventario', 'CRM & Ventas', 'Reportes Financieros', 'Trazabilidad de Servicio'],
          github: 'https://github.com/arecofix/Arecofixpage',
          link: environment.baseUrl,
          impact: '+40% Control',
          achievements: [
            'Monitoreo en tiempo real de la economía de la empresa mediante gráficos financieros interactivos.',
            'Mejora del 40% en el manejo de clientes y trazabilidad de órdenes de servicio técnico.',
            'Optimización del control de inventario de repuestos y reducción de pérdidas por stock en un 30%.'
          ]
        },
        {
          title: 'API Carrito Flask',
          description: 'API RESTful completa para un carrito de compras construida con Flask. Diseñada para gestionar el flujo completo de un e-commerce: catálogo de productos, registro/autenticación de usuarios y procesamiento del carrito.',
          image: 'assets/img/readme/5.png',
          techStack: ['Python', 'Flask', 'SQLAlchemy', 'JWT', 'SQLite/PostgreSQL', 'REST API'],
          features: ['Autenticación Segura con JWT', 'Relaciones de Modelos Complejas', 'Endpoints de Compra y Transacciones', 'Manejo de Errores y Validaciones'],
          github: 'https://github.com/arecofix/API-carrito-Flask',
          impact: '-25% Latency',
          achievements: [
            'Diseño de API RESTful segura con JWT, protegiendo los datos sensibles de los usuarios.',
            'Optimización de consultas de base de datos con SQLAlchemy, reduciendo latencia en un 25%.'
          ]
        },
        {
          title: 'Node Microservices',
          description: 'Conjunto de APIs backend modulares y scalables construidas sobre Node.js y Express. Demuestra la implementación de control de acceso basado en roles (RBAC), manejo avanzado de concurrencia y conexiones robustas de base de datos.',
          image: 'assets/img/readme/2-1.png',
          techStack: ['Node.js', 'Express', 'TypeScript', 'JWT (RBAC)', 'MongoDB/PostgreSQL', 'Gitflow'],
          features: ['Autenticación y Autorización por Roles', 'APIs Altamente Modulares y Escalables', 'EndPoints Documentados y Seguros', 'Estrategias de Caché y Rendimiento'],
          github: 'https://github.com/arecofix/Node',
          impact: '+200% Escala',
          achievements: [
            'Arquitectura desacoplada basada en microservicios, mejorando la escalabilidad del sistema en un 200%.',
            'Control de acceso seguro basado en roles (RBAC) para diferentes niveles de permisos en la organización.'
          ]
        },
        {
          title: 'Python Objetos',
          description: 'Repositorio de recursos avanzados y patrones de diseño enfocado en la Programación Orientada a Objetos (POO) con Python. Incluye aplicaciones prácticas de herencia, polimorfismo, encapsulación y principios SOLID.',
          image: 'assets/img/projects/python_objetos.png',
          techStack: ['Python 3', 'OOP', 'Design Patterns', 'SOLID Principles', 'Unit Testing'],
          features: ['Estructuras de Clases Complejas', 'Patrones de Diseño Implementados', 'Pruebas Unitarias Integradas', 'Ejemplos de Arquitectura Limpia'],
          github: 'https://github.com/arecofix/Python_Objetos',
          impact: '95% PyTest',
          achievements: [
            'Implementación de patrones de diseño avanzados, reduciendo la duplicación de código en un 40%.',
            'Cobertura de pruebas unitarias superior al 95% utilizando PyTest para asegurar estabilidad.'
          ]
        }
      ],

      workExperience: [
        {
          position: 'Profesor de Microelectrónica',
          company: 'IAP Marcos Paz',
          period: '2025 - Presente',
          description: 'Gestión y formación de una comunidad activa de más de 90 técnicos y estudiantes. Dictado de módulos avanzados de diagnóstico de fallas, soldadura SMD y análisis lógico de circuitos. Esta experiencia docente potenció mi capacidad para traducir conceptos técnicos complejos a un lenguaje accesible, aportando al equipo la habilidad de comunicar objetivos con claridad, destrabar bloqueos técnicos y facilitar la curva de aprendizaje de otros desarrolladores.',
          techStack: ['Electrónica', 'Troubleshooting', 'Liderazgo', 'Análisis Lógico']
        },
        {
          position: 'Instructor de Desarrollo de Software',
          company: 'Eddis Educativa',
          period: '2023 - 2026',
          description: 'Capacitación técnica y mentoría de más de 50 alumnos en desarrollo de software y bases de datos. Diseño de currícula enfocada en Clean Code, arquitecturas escalables, fundamentos de desarrollo seguro (DevSecOps) y flujos de trabajo colaborativos bajo el estándar Git/Gitflow.',
          techStack: ['Gitflow', 'Clean Code', 'DevSecOps', 'Mentoría Técnica']
        },
        {
          position: 'Equipo Técnico de Sistemas y SysAdmin',
          company: 'Municipio de Marcos Paz',
          period: '2022 - 2023',
          description: 'Soporte y administración de infraestructura, bases de datos y gestión de identidades y accesos (IAM) para registros gubernamentales. Automatización de flujos de datos y diseño de políticas de respaldo (backups) garantizando la alta disponibilidad, integridad y confidencialidad de la información pública.',
          techStack: ['SysAdmin', 'Gestión de Accesos (IAM)', 'Bases de Datos', 'Infraestructura']
        },
        {
          position: 'Operador de Telecomunicaciones y CCTV (911)',
          company: 'Policía Municipal Contravencional',
          period: '2019 - 2021',
          description: 'Monitoreo de sistemas críticos y CCTV para la prevención de incidentes. Gestión de redes de radiofrecuencia (VHF/UHF) y coordinación logística con centros de emergencia. Toma de decisiones bajo presión y aplicación de protocolos de seguridad en infraestructuras de alta sensibilidad.',
          techStack: ['Monitoreo CCTV', 'Telecomunicaciones', 'Gestión de Crisis', 'Trabajo bajo presión']
        }
      ],


      downloadCvLabel: 'Descargar CV',
      availableForHireLabel: 'Disponible para trabajar',
      projectsTitleHtml: 'Proyectos <span class="text-cyan-500">Realizados</span>',
      technicalMasteryTitleHtml: 'Dominio <span class="text-cyan-500">Técnico</span>',
      engineeringExcellenceTitleHtml: 'Excelencia en <span class="text-cyan-500">Ingeniería</span>',
      experienceLogTitleHtml: 'Trayectoria <span class="text-cyan-500">Profesional</span>',
      githubPinsTitleHtml: 'Proyectos y Repositorios en <span class="text-cyan-500">GitHub</span>',
      githubPinsSubLabel: 'Sincronización en tiempo real desde',
      allReposLabel: 'Todos los Repositorios Públicos',
      viewProjectLabel: 'Ver Proyecto',
      liveDemoLabel: 'Demostración',
      sourceCodeLabel: 'Código Fuente',
      dragToPanLabel: 'Arrastra para mover cuando hay zoom.',
      readyToScaleTitle: '¿Listo para impulsar tu equipo?',
      initializeContactLabel: 'Iniciar Protocolo de Contacto',
      verifiedCredentialsLabel: 'Credenciales Verificadas',
      resetLabel: 'Restablecer',
      keyAchievementsLabel: 'Logros Clave',
      hoverToSeeAchievementsLabel: 'Haz clic en las capturas para ampliarlas y ver detalles'
    },
    en: {
      image: 'assets/img/profile.png',
      name: 'EZEQUIEL ENRICO ARECO',
      role: 'DevOps & Cybersecurity Specialist | Infrastructure, Automation & SecOps',
      tagline: 'Computer Science Student with a strong academic foundation. Passionate about infrastructure automation, application security (SecOps), and Linux systems administration.',
      location: 'Buenos Aires, Argentina',
      email: 'ezequielenrico15@gmail.com',
      linkedin: environment.contact.socialMedia.linkedin,
      github: environment.contact.socialMedia.github,
      cvUrl: environment.externalUrls.portfolio.cv,
      about: 'I am a developer and Computer Science student at Universidad Nacional del Oeste (GPA: 8.40) specializing in DevOps and Cybersecurity. I focus heavily on infrastructure automation, database security (RLS/RBAC policies), and CI/CD pipelines deployment. I have solid experience managing Linux servers, optimizing Docker containers, and implementing security audits (such as HaveIBeenPwned API) in enterprise systems. C1 English certified for seamless integration into global teams.',
      quickScan: {
        title: 'About Me',
        roleLabel: 'Specialization',
        roleValue: 'DevOps & Cybersecurity',
        primaryTechLabel: 'Core Focus',
        primaryTechValue: 'Docker, Linux, CI/CD',
        primaryTechIcon: 'fa-solid fa-shield-halved',
        complementaryLabel: 'Infrastructure & Scripting',
        complementaryValue: 'Bash/Shell, Powershell, Nginx, PostgreSQL RLS, Gitflow',
        cloudDbLabel: 'Backend & Cloud',
        cloudDbValue: 'Python, Java, Node.js, Supabase, Firebase',
        keyStrengthsLabel: 'Key Strengths',
        keyStrengths: ['Computer Science Student (UNO)', 'GPA: 8.40', 'Advanced English C1 (Global Teams)', 'Automation & Server Hardening']
      },
      backendHighlights: [
        {
          title: 'Infrastructure & Automation',
          icon: 'fas fa-server',
          description: 'Design and management of virtualized environments using Docker, task automation via Bash/Powershell scripting, and web server configuration (Nginx).',
          stats: [{ label: 'Containers', value: 'Docker' }, { label: 'Scripting', value: 'Bash / Powershell' }]
        },
        {
          title: 'Cybersecurity & SecOps',
          icon: 'fas fa-shield-alt',
          description: 'Database-level security (PostgreSQL RLS), role-based access control (RBAC), JWT authentication, and vulnerability audits with the HaveIBeenPwned API.',
          stats: [{ label: 'Policies', value: 'RLS / RBAC' }, { label: 'Audit', value: 'HIBP API' }]
        },
        {
          title: 'CI/CD & Git Workflows',
          icon: 'fas fa-sync-alt',
          description: 'Implementation of continuous integration and continuous deployment (CI/CD) flows combining Gitflow methodologies for orderly development and stable releases.',
          stats: [{ label: 'Methodology', value: 'Gitflow' }, { label: 'Integration', value: 'CI/CD Pipelines' }]
        }
      ],
      codeSnippets: [
        {
          title: 'Row-Level Security Policies (PostgreSQL RLS)',
          language: 'sql',
          description: 'Implementation of RLS policies to guarantee multi-tenant isolation and role-based access control at the database level.',
          code: `
-- Enable Row-Level Security (RLS)
ALTER TABLE tenant_records ENABLE ROW LEVEL SECURITY;

-- Policy to isolate tenant access (Multi-tenant isolation)
CREATE POLICY tenant_isolation_policy ON tenant_records
FOR ALL
USING (tenant_id = auth.jwt() ->> 'tenant_id')
WITH CHECK (tenant_id = auth.jwt() ->> 'tenant_id');

-- Restrictive policy for Security Administrators
CREATE POLICY security_admin_policy ON security_logs
FOR SELECT
TO security_admin
USING (true);`,
          tags: ['SQL', 'PostgreSQL', 'RLS', 'Security']
        },
        {
          title: 'Automated Docker Backup & Rotation (Bash)',
          language: 'bash',
          description: 'Bash automation script for backing up Docker database containers with rotation and compression.',
          code: `
#!/bin/bash
CONTAINER_NAME="db_postgres_prod"
BACKUP_DIR="/var/backups/db"
RETENTION_DAYS=7
TIMESTAMP=\$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="\${BACKUP_DIR}/backup_\${TIMESTAMP}.sql.gz"

# Ensure destination directory exists
mkdir -p "\${BACKUP_DIR}"

# Execute compressed database dump
echo "Starting backup of \${CONTAINER_NAME}..."
docker exec -t "\${CONTAINER_NAME}" pg_dumpall -U postgres | gzip > "\${BACKUP_FILE}"

if [ \$? -eq 0 ]; then
    echo "Backup successful: \${BACKUP_FILE}"
else
    echo "ERROR: Database backup failed" >&2
    exit 1
fi

# Rotate old backups (keep only RETENTION_DAYS)
echo "Removing backups older than \${RETENTION_DAYS} days..."
find "\${BACKUP_DIR}" -name "backup_*.sql.gz" -mtime +\dots\${RETENTION_DAYS} -delete`,
          tags: ['Bash', 'DevOps', 'Docker', 'Automation']
        }
      ],
      technicalSkills: [
        {
          category: 'DevOps & Automation (Core Focus)',
          isCore: true,
          skills: [
            { name: 'Docker & Containers', icon: 'fa-brands fa-docker', description: 'Application containerization, multi-stage build optimization, and container environment orchestration.', isPrimary: true },
            { name: 'Linux & Bash Scripting', icon: 'fas fa-terminal', description: 'Task automation using shell scripting (cron jobs), service monitoring, and general SysAdmin operations.', isPrimary: true },
            { name: 'Git & Gitflow', icon: 'fa-brands fa-git-alt', description: 'Professional version control and repository workflow management under agile methodologies.', isPrimary: true }
          ]
        },
        {
          category: 'Cybersecurity & SecOps',
          skills: [
            { name: 'Data Security (RLS/RBAC)', icon: 'fas fa-shield-alt', description: 'Implementation of Row-Level Security in PostgreSQL databases and Role-Based Access Control APIs.' },
            { name: 'Auth & Cryptography', icon: 'fas fa-key', description: 'Implementation of JSON Web Tokens (JWT), OAuth2 authorization, and password vulnerability auditing.' },
            { name: 'Monitoring & Auditing', icon: 'fas fa-eye', description: 'System log auditing, Docker environment analysis, and data compliance standards auditing.' }
          ]
        },
        {
          category: 'Backend & Persistence',
          skills: [
            { name: 'Relational Databases (SQL)', icon: 'fas fa-database', description: 'Relational schema design, query optimization, indexing, and administration of PostgreSQL and MySQL.' },
            { name: 'Backend Frameworks', icon: 'fa-solid fa-code', description: 'Development of robust RESTful APIs using Python (Django/Flask), Java (Spring Boot), and Node.js.' }
          ]
        },
        {
          category: 'Education & Key Skills',
          skills: [
            { name: 'Computer Science Student (UNO)', icon: 'fas fa-graduation-cap', description: 'University student (GPA: 8.40) with a strong foundation in algorithms, networks, and computer science theory.' },
            { name: 'Advanced English C1', icon: 'fas fa-language', description: 'Certified C1 level. Fluency in technical writing and communication for direct integration into international teams.' }
          ]
        }
      ],
      projects: [
        {
          title: 'Arecofixpage',
          description: 'Official website and web portal of Arecofix. Professional SPA platform for managing technical support, spare parts e-commerce, online appointment booking, and an electronics training courses catalog.',
          image: 'assets/img/readme/1.png',
          techStack: ['Angular 17', 'TypeScript', 'Tailwind CSS', 'Supabase', 'RxJS', 'Firebase'],
          features: ['Multi-User Platform & Bookings', 'Spare Parts Catalog & E-Commerce', 'Dynamic Training Courses Section', 'Responsive & Interactive Layout'],
          github: 'https://github.com/arecofix/Arecofixpage',
          link: 'https://arecofix.com.ar',
          impact: '100% PWA',
          achievements: [
            'Developed a fast, SEO-optimized PWA (SSR and Prerendering) with 100% accessibility score.',
            'Integrated payment gateway for online bookings and automated course enrollments.'
          ]
        },
        {
          title: 'Django Portfolio',
          description: 'Dynamic portfolio website developed with the Django Python web framework. Includes an integrated CMS via Django Admin to manage projects, skills, and CV details in real time.',
          image: 'assets/img/projects/django_portfolio.png',
          techStack: ['Python', 'Django', 'SQLite/PostgreSQL', 'Django Admin', 'HTML5 / CSS3', 'JavaScript'],
          features: ['Integrated CMS Admin Panel', 'Relational Data Modeling', 'Dynamic Views & Templates', 'Built-in Form Validations'],
          github: 'https://github.com/arecofix/portfolio-django',
          impact: '<1 min CMS',
          achievements: [
            'Custom administration panel (CMS) for real-time content updates in under 1 minute.',
            'Fully responsive layout optimized for mobile devices, increasing recruiter conversion rates.'
          ]
        },
        {
          title: 'Zarx System',
          description: 'Robust, enterprise-grade multi-tenant administrative dashboard. Features strict row-level security (RLS) policies, password leak check integration (HaveIBeenPwned), and transactional bulk CSV importing via SQL RPC.',
          image: 'assets/img/readme/gestiondesucursales.png',
          techStack: ['Angular 17', 'Supabase (Auth & Database)', 'Node.js', 'PostgreSQL', 'Tailwind CSS', 'Docker'],
          features: ['Hardened Security (RLS & HIBP)', 'CSV Bulk Importer via RPC', 'WCAG AA Accessibility Compliance', 'Scalable Multi-tenant Architecture'],
          github: 'https://github.com/arecofix/zarx',
          impact: 'Postgres RLS',
          achievements: [
            'Bank-grade security with PostgreSQL RLS policies and real-time breached password checks.',
            'Bulk data import processing via SQL RPC, importing thousands of records in seconds.'
          ]
        },
        {
          title: 'Embeddable AI Chatbot',
          description: 'Intelligent, interactive AI-powered chatbot widget that can be embedded into any website by adding a single line of script. Designed to integrate with language models via optimized API calls.',
          image: 'assets/img/projects/ai_chatbot.png',
          techStack: ['TypeScript', 'Web Components', 'CSS Variables', 'OpenAI/Gemini APIs', 'Webpack'],
          features: ['Ultra Fast Integration (Embed)', 'Automated Contextual Responses', 'Modular Design & Custom Styling', 'Non-blocking Async Script Loading'],
          github: 'https://github.com/arecofix/embeddable-ai-chatbot',
          impact: '-60% Support',
          achievements: [
            'Lightweight widget (<15KB compressed) embeddable via a single script tag on any platform.',
            '60% reduction in customer support load by automating FAQs through AI responses.'
          ]
        },
        {
          title: 'Enterprise ERP System with Java Spring',
          description: 'Legacy re-engineering and migration to robust enterprise microservices. Distributed system for real-time enterprise resource management, leveraging Project Loom for efficient concurrency management and CPU thread optimization.',
          image: 'assets/img/readme/4.png',
          techStack: ['Java 21', 'Spring Boot 3', 'Project Loom', 'Kafka', 'PostgreSQL', 'Hibernate'],
          features: ['Microservices Architecture', 'Concurrency with Virtual Threads', 'Hibernate / JPA Persistence', 'Async Messaging via Kafka'],
          github: 'https://github.com/arecofix',
          impact: '-50% Latency',
          achievements: [
            '50% reduction in server response times utilizing Java 21 virtual threads.',
            'Processing over 10,000 concurrent transactions per minute with zero performance degradation.'
          ]
        },
        {
          title: 'System Management for Ecommerce',
          description: 'Comprehensive management system for E-commerce and Technical Services. Robust admin panel with real-time inventory control, sales management, service order tracking, clients, and detailed financial reports. Includes automated invoicing, payment gateway integration, and logistics modules.',
          image: 'assets/img/readme/6.png',
          techStack: ['Node.js', 'Angular', 'Supabase', 'Redis', 'Docker'],
          features: ['Inventory Management', 'CRM & Sales', 'Financial Reports', 'Service Traceability'],
          github: 'https://github.com/arecofix/Arecofixpage',
          link: environment.baseUrl,
          impact: '+40% Control',
          achievements: [
            'Real-time monitoring of business financials and economics via integrated dynamic charts.',
            '40% improvement in customer management and repair service order traceability.',
            'Optimized spare parts inventory control, reducing stock losses by 30%.'
          ]
        },
        {
          title: 'Flask Cart API',
          description: 'Complete RESTful API for an e-commerce shopping cart built with Flask. Designed to manage the entire sales pipeline: product catalog, user registration/authentication, and shopping cart processing.',
          image: 'assets/img/readme/5.png',
          techStack: ['Python', 'Flask', 'SQLAlchemy', 'JWT', 'SQLite/PostgreSQL', 'REST API'],
          features: ['Secure JWT Authentication', 'Complex Model Relationships', 'Checkout & Transaction Endpoints', 'Robust Error Handling & Validation'],
          github: 'https://github.com/arecofix/API-carrito-Flask',
          impact: '-25% Latency',
          achievements: [
            'Designed secure RESTful API using JWT, protecting sensitive user data.',
            'Optimized database queries with SQLAlchemy, reducing latency by 25%.'
          ]
        },
        {
          title: 'Node Microservices',
          description: 'Collection of modular and scalable backend APIs built with Node.js and Express. Demonstrates the implementation of role-based access control (RBAC), advanced concurrency handling, and robust database connections.',
          image: 'assets/img/readme/2-1.png',
          techStack: ['Node.js', 'Express', 'TypeScript', 'JWT (RBAC)', 'MongoDB/PostgreSQL', 'Gitflow'],
          features: ['Role-Based Auth & Permissions', 'Highly Modular & Scalable APIs', 'Fully Documented & Secure Endpoints', 'Caching & Performance Optimization'],
          github: 'https://github.com/arecofix/Node',
          impact: '+200% Scale',
          achievements: [
            'Decoupled microservice-based architecture, improving system scalability by 200%.',
            'Secure Role-Based Access Control (RBAC) for granular permission management.'
          ]
        },
        {
          title: 'Python Objects',
          description: 'Repository of advanced resources and design patterns focused on Object-Oriented Programming (OOP) with Python. Includes practical implementations of inheritance, polymorphism, encapsulation, and SOLID principles.',
          image: 'assets/img/projects/python_objetos.png',
          techStack: ['Python 3', 'OOP', 'Design Patterns', 'SOLID Principles', 'Unit Testing'],
          features: ['Complex Class Structuring', 'Implemented Design Patterns', 'Integrated Unit Testing', 'Clean Architecture Examples'],
          github: 'https://github.com/arecofix/Python_Objects',
          impact: '95% PyTest',
          achievements: [
            'Implemented advanced design patterns, reducing code duplication by 40%.',
            'Over 95% unit test coverage utilizing PyTest to ensure code stability.'
          ]
        }
      ],
      workExperience: [
        {
          position: 'Electronics Repair Professor',
          company: 'IAP Marcos Paz',
          period: '2025 - Present',
          description: 'Instruction of advanced theoretical and practical classes on microelectronics and logical circuit analysis. Leading student training and mentoring, facilitating complex systems comprehension and building key soft skills like leadership, technical communication, and systematic logic troubleshooting.',
          techStack: ['Microelectronics', 'Logical Analysis', 'Problem Solving', 'Technical Security']
        },
        {
          position: 'Security & Data Protection Officer',
          company: 'Secretariat of Security',
          period: '2023 - 2024',
          description: 'Information security auditing and personal data protection. Defined and controlled access policies, monitored security logs, and designed contingency plans for critical municipal security systems.',
          techStack: ['Cybersecurity', 'Data Protection', 'Systems Auditing', 'Security Policies']
        },
        {
          position: 'Systems Technical Team',
          company: 'Municipality of Marcos Paz',
          period: 'Until 2023',
          description: 'Technical support and maintenance of critical database systems and government records. Infrastructure access control management (IAM). Automated and optimized data ingestion workflows and backup policies for public databases ensuring confidentiality and integrity.',
          techStack: ['SysAdmin', 'Database Management', 'Access Control', 'Backups & Integrity']
        },
        {
          position: 'Software Development Instructor',
          company: 'Eddis Educativa',
          period: '2022 - Present',
          description: 'Training and mentoring over 50 students in software development and databases. Methodological focus on Clean Code, secure development best practices (basic DevSecOps concepts), and professional version control workflows with Git/Gitflow.',
          techStack: ['HTML/CSS/JS', 'Programming Logic', 'Clean Code', 'Project Mentoring']
        },
        {
          position: 'Technical Lead & DevOps / Infrastructure',
          company: 'Arecofix',
          period: '2020 - 2023',
          description: 'Led infrastructure deployment and operations. Virtualized and containerized services using Docker, achieved a 300% improvement in server response times by implementing caching and Nginx load balancing, and automated backups.',
          techStack: ['Node.js', 'Angular', 'Supabase', 'Docker']
        }
      ],
      downloadCvLabel: 'Download CV',
      availableForHireLabel: 'Available for Hire',
      projectsTitleHtml: 'Deployed <span class="text-cyan-500">Systems</span>',
      technicalMasteryTitleHtml: 'Technical <span class="text-cyan-500">Mastery</span>',
      engineeringExcellenceTitleHtml: 'Engineering <span class="text-cyan-500">Excellence</span>',
      experienceLogTitleHtml: 'Experience <span class="text-cyan-500">Log</span>',
      githubPinsTitleHtml: 'GitHub <span class="text-cyan-500">Pins & Repositories</span>',
      githubPinsSubLabel: 'Live repository sync from',
      allReposLabel: 'All Public Repositories',
      viewProjectLabel: 'View Project',
      liveDemoLabel: 'Live Demo',
      sourceCodeLabel: 'Source Code',
      dragToPanLabel: 'Drag to pan when zoomed.',
      readyToScaleTitle: 'Ready to Scale Your Team?',
      initializeContactLabel: 'Initialize Contact Protocol',
      verifiedCredentialsLabel: 'Verified Credentials',
      resetLabel: 'Reset',
      keyAchievementsLabel: 'Key Achievements',
      hoverToSeeAchievementsLabel: 'Click on screenshots to enlarge and view details'
    }
  };

  backgroundOptions = [
    { id: 'gradient-5', name: 'Dark Gray', class: 'bg-surface-dark' },
  ];

  isImageModalOpen = false;
  selectedImageUrl = '';
  zoomScale = 1.0;
  translateX = 0;
  translateY = 0;
  isDragging = false;
  startX = 0;
  startY = 0;

  gitHubRepos: any[] = [];
  isLoadingRepos = true;

  constructor(public preferencesService: PreferencesService) { }

  get currentContent(): PortfolioContent {
    return this.portfolioContent[this.currentLanguage];
  }

  ngOnInit(): void {
    this.preferencesService.language$.subscribe(lang => {
      this.currentLanguage = lang;
    });

    // Fetch live repos from github
    this.fetchGitHubRepos();

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

  fetchGitHubRepos(): void {
    this.isLoadingRepos = true;
    fetch('https://api.github.com/users/arecofix/repos')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          this.gitHubRepos = data
            .filter(repo => repo.name !== 'areco' && repo.name !== 'home')
            .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
        }
        this.isLoadingRepos = false;
      })
      .catch(err => {
        console.error('Error fetching GitHub repos:', err);
        this.isLoadingRepos = false;
      });
  }

  simulateSystemActivity() {
    // Randomly update latencies
    this.systemStatuses.forEach(stat => {
      const variation = Math.floor(Math.random() * 6) - 3;
      stat.latency = Math.max(1, stat.latency + variation);
    });

    // Add random log
    const logs = [
      '[SEC] Intrusion Detection System: 0 threats detected',
      '[SEC] JWT signature verification successful',
      '[OPS] Backup completed successfully in 0.35s',
      '[OPS] PostgreSQL RLS Policy cache reloaded',
      '[INFO] Nginx proxy request: /api/v1/health - 200 OK',
      '[SEC] HIBP API audit completed: 0 breached credentials found',
      '[OPS] Docker container heap health: OK'
    ];
    const randomLog = logs[Math.floor(Math.random() * logs.length)];
    this.terminalOutput.push(`> ${new Date().toLocaleTimeString()} ${randomLog}`);
    if (this.terminalOutput.length > 8) this.terminalOutput.shift();
  }

  // Lightbox Modal Controls with Drag/Pan and Zoom
  openImageModal(imageUrl: string) {
    this.selectedImageUrl = imageUrl;
    this.isImageModalOpen = true;
    this.zoomScale = 1.0;
    this.translateX = 0;
    this.translateY = 0;
  }

  closeImageModal() {
    this.isImageModalOpen = false;
    this.selectedImageUrl = '';
  }

  zoomIn(event?: MouseEvent) {
    if (event) event.stopPropagation();
    if (this.zoomScale < 5.0) {
      this.zoomScale += 0.25;
    }
  }

  zoomOut(event?: MouseEvent) {
    if (event) event.stopPropagation();
    if (this.zoomScale > 0.5) {
      this.zoomScale -= 0.25;
    }
  }

  resetZoom(event?: MouseEvent) {
    if (event) event.stopPropagation();
    this.zoomScale = 1.0;
    this.translateX = 0;
    this.translateY = 0;
  }

  // Mouse Drag Event Handlers for Panning
  onMouseDown(event: MouseEvent) {
    if (this.zoomScale <= 1.0) return;
    this.isDragging = true;
    this.startX = event.clientX - this.translateX;
    this.startY = event.clientY - this.translateY;
    event.preventDefault();
  }

  onMouseMove(event: MouseEvent) {
    if (!this.isDragging) return;
    this.translateX = event.clientX - this.startX;
    this.translateY = event.clientY - this.startY;
  }

  onMouseUp() {
    this.isDragging = false;
  }

  // Touch Event Handlers for Panning on Mobile
  onTouchStart(event: TouchEvent) {
    if (this.zoomScale <= 1.0 || event.touches.length !== 1) return;
    this.isDragging = true;
    this.startX = event.touches[0].clientX - this.translateX;
    this.startY = event.touches[0].clientY - this.translateY;
  }

  onTouchMove(event: TouchEvent) {
    if (!this.isDragging || event.touches.length !== 1) return;
    this.translateX = event.touches[0].clientX - this.startX;
    this.translateY = event.touches[0].clientY - this.startY;
  }

  onTouchEnd() {
    this.isDragging = false;
  }

  getTechIcon(tech: string): string {
    const t = tech.toLowerCase().trim();
    if (t.includes('java 21') || t === 'java') return 'fab fa-java text-[#ec2025]';
    if (t.includes('spring')) return 'fas fa-leaf text-[#6db33f]';
    if (t.includes('kafka')) return 'fas fa-exchange-alt text-[#3776ab]';
    if (t.includes('postgresql') || t === 'postgres' || t.includes('sql') || t.includes('bases de datos') || t.includes('database')) return 'fas fa-database text-[#336791]';
    if (t.includes('hibernate')) return 'fas fa-layer-group text-[#b58f55]';
    if (t.includes('node')) return 'fab fa-node-js text-[#68a063]';
    if (t.includes('angular')) return 'fab fa-angular text-[#dd0031]';
    if (t.includes('supabase')) return 'fas fa-bolt text-[#3cfcf8]';
    if (t.includes('redis')) return 'fas fa-server text-[#d82c20]';
    if (t.includes('docker') || t.includes('contenedores') || t.includes('virtualización')) return 'fab fa-docker text-[#2496ed]';
    if (t.includes('typescript')) return 'fas fa-code text-[#3178c6]';
    if (t.includes('tailwind')) return 'fab fa-css3-alt text-[#38bdf8]';
    if (t.includes('firebase')) return 'fas fa-fire text-[#ffca28]';
    if (t.includes('rxjs')) return 'fas fa-sync text-[#c2185b]';
    if (t.includes('python')) return 'fab fa-python text-[#3776ab]';
    if (t.includes('flask')) return 'fas fa-flask text-[#e5e5e5]';
    if (t.includes('django')) return 'fas fa-server text-[#092e20]';
    if (t.includes('sqlite')) return 'fas fa-database text-[#003b57]';
    if (t.includes('jwt') || t.includes('autenticación') || t.includes('auth') || t.includes('accesos')) return 'fas fa-key text-[#d63aff]';
    if (t.includes('openai') || t.includes('gemini') || t.includes('ai')) return 'fas fa-robot text-[#10a37f]';
    if (t.includes('components')) return 'fas fa-cubes text-[#f16529]';
    if (t.includes('patterns') || t.includes('solid')) return 'fas fa-project-diagram text-[#ff5722]';
    if (t.includes('test')) return 'fas fa-vial text-[#9c27b0]';
    if (t.includes('jpa')) return 'fas fa-database text-[#e28743]';
    if (t.includes('oop')) return 'fas fa-cube text-[#ff9800]';
    if (t.includes('javascript') || t === 'js') return 'fab fa-js text-[#f7df1e]';
    if (t.includes('ciberseguridad') || t.includes('seguridad') || t.includes('security') || t.includes('protección') || t.includes('secops')) return 'fas fa-shield-alt text-[#38bdf8]';
    if (t.includes('bash') || t.includes('linux') || t.includes('scripting') || t.includes('sysadmin') || t.includes('terminal')) return 'fas fa-terminal text-[#4ebd4f]';
    if (t.includes('git') || t.includes('gitflow')) return 'fab fa-git-alt text-[#f05032]';
    if (t.includes('excel')) return 'fas fa-file-excel text-[#107c41]';
    return 'fas fa-cog text-cyan-400';
  }
}
