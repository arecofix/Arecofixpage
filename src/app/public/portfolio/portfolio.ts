import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PreferencesService } from '../../shared/services/preferences.service';
import { CertificateGalleryComponent } from '../../shared/components/certificate-gallery/certificate-gallery.component';

interface PortfolioContent {
  name: string;
  title: string;
  location: string;
  phone: string;
  email: string;
  website: string;
  linkedin: string;
  summary: string;
  about: string;
  workExperience: WorkExperience[];
  education: Education[];
  technicalSkills: TechnicalSkill[];
  certifications: string[];
  projects: Project[];
  cvUrl: string;
}

interface WorkExperience {
  position: string;
  company: string;
  period: string;
  description?: string;
  achievements?: string[];
}

interface Education {
  degree: string;
  institution: string;
  period: string;
  details: string[];
}

interface TechnicalSkill {
  name: string;
  icon: string; // FontAwesome class or emoji for now
  description: string;
  category: 'language' | 'framework' | 'tool' | 'database' | 'os';
}

interface Project {
  title: string;
  description: string;
  image: string;
  tags: string[];
  link?: string;
  github?: string;
}

@Component({
  selector: 'app-portfolio',
  standalone: true,
  imports: [CommonModule, RouterLink, CertificateGalleryComponent],
  templateUrl: './portfolio.html',
  styleUrls: ['./portfolio.css']
})
export class PortfolioComponent implements OnInit {
  currentLanguage: 'en' | 'es' = 'es';

  portfolioContent: { en: PortfolioContent; es: PortfolioContent } = {
    en: {
      name: 'EZEQUIEL ENRICO ARECO',
      title: 'Fullstack Developer',
      location: 'Buenos Aires, Argentina',
      phone: '+54 11 2596-0900',
      email: 'ezequielenrico15@gmail.com',
      website: 'www.arecofix.com.ar',
      linkedin: 'https://www.linkedin.com/in/ezequiel-enrico/',
      cvUrl: 'assets/img/portfolio/Ezequiel_Enrico_CV.pdf',
      summary: 'Systems professional, Full-Stack developer. Currently working in the government technical team and experienced as an IT instructor. I enjoy teamwork and value collaboration. Seeking new professional opportunities in IT.',
      about: 'Welcome to my online portfolio. Here you will see examples of the tools I work with as a fullstack developer. I specialize in web development using modern technologies like HTML, CSS, JavaScript, and frameworks like Django and React.',
      workExperience: [
        {
          position: 'Technical Team',
          company: 'Envión Program, Municipality of Marcos Paz',
          period: '2022 - Present',
          description: 'Part of the technical team, managing systems and providing support.'
        },
        {
          position: 'Contraventional Police',
          company: 'Security Secretariat',
          period: '2020 - 2021',
          description: 'Served in the security secretariat.'
        },
        {
          position: 'Instructor',
          company: 'Eddis Educativa (Morón & Marcos Paz)',
          period: '2023 - Present',
          description: 'Teaching IT courses including Cell Phone Repair.'
        }
      ],
      education: [
        {
          degree: 'Bachelors in computer science',
          institution: 'Universidad Nacional del Oeste (UNO)',
          period: 'Expected 2024',
          details: [
            'Currently finishing final subjects.',
            'Acquired knowledge in C#, HTML, CSS, JS, Python, PHP, ReactJS, SQL.'
          ]
        }
      ],
      technicalSkills: [
        { name: 'Python', icon: 'fab fa-python', category: 'language', description: 'Passionate about Python development, focusing on AI and Machine Learning.' },
        { name: 'JavaScript', icon: 'fab fa-js', category: 'language', description: 'Building interactive and dynamic web applications, DOM manipulation, and API interactions.' },
        { name: 'C# .NET', icon: 'fab fa-microsoft', category: 'language', description: 'Developed business management applications using Windows Forms and OOP.' },
        { name: 'Django', icon: 'fas fa-leaf', category: 'framework', description: 'Creating robust dynamic websites with URL routing, templates, and DB management.' },
        { name: 'Node.js', icon: 'fab fa-node', category: 'framework', description: 'Building REST APIs, CRUD systems, and handling authentication.' },
        { name: 'PHP', icon: 'fab fa-php', category: 'language', description: 'Developing robust web apps with frameworks like Laravel.' },
        { name: 'Docker', icon: 'fab fa-docker', category: 'tool', description: 'Containerization for consistent development and deployment environments.' },
        { name: 'Git', icon: 'fab fa-git-alt', category: 'tool', description: 'Version control and collaboration.' },
        { name: 'MySQL', icon: 'fas fa-database', category: 'database', description: 'Relational database management.' },
        { name: 'Linux', icon: 'fab fa-linux', category: 'os', description: 'Server management and command line proficiency.' }
      ],
      certifications: [
        'Codo a Codo Fullstack Python (2022)',
        'JavaScript, ReactJS, SQL - Coderhouse (2021)',
        'Database Course - Udemy (2021)',
        'Full-Stack Web Developer - LinkedIn Learning (2020)',
        'English B2 (Advanced)'
      ],
      projects: [
        {
          title: 'Arecofix Page',
          description: 'Institutional website and e-commerce for Arecofix. Built with Angular and Tailwind CSS.',
          image: '/assets/img/projects/arecofix.png',
          tags: ['Angular', 'Tailwind', 'TypeScript'],
          link: 'https://arecofix.com.ar'
        },
        {
          title: 'Management System',
          description: 'Desktop application for business management developed in C# .NET.',
          image: 'assets/img/projects/panel.png',
          tags: ['C#', '.NET', 'SQL Server']
        },
        {
          title: 'Envión Registration',
          description: 'Web platform for beneficiary registration using Django and Python.',
          image: 'assets/img/projects/data.png',
          tags: ['Django', 'Python', 'PostgreSQL']
        }
      ]
    },
    es: {
      name: 'EZEQUIEL ENRICO ARECO',
      title: 'Desarrollador Fullstack',
      location: 'Buenos Aires, Argentina',
      phone: '+54 11 2596-0900',
      email: 'ezequielenrico15@gmail.com',
      website: 'www.arecofix.com.ar',
      linkedin: 'https://www.linkedin.com/in/ezequiel-enrico/',
      cvUrl: 'assets/img/portfolio/Ezequiel_Enrico_CV.pdf',
      summary: 'Profesional de sistemas, desarrollador Full-Stack. Actualmente trabajo en el sector gubernamental de equipo técnico y tengo experiencia como profesor de informática y tutor en cursos de Reparación de Celulares. Disfruto trabajando en equipo y valoro la colaboración y el intercambio de ideas. Busco nuevas oportunidades profesionales en el campo de la tecnología de la información.',
      about: 'Bienvenido a mi portafolio en línea. Recuerda que en la sección acerca de encontrarás mi información personal. Aquí verás ejemplos de las herramientas con las que trabajo como desarrollador fullstack. Estoy especializado en el desarrollo web, utilizando tecnologías modernas como Angular, Tailwind CSS, TypeScript y frameworks como Django y Node.js.',
      workExperience: [
        {
          position: 'Equipo Técnico',
          company: 'Programa Envión, Municipio de Marcos Paz',
          period: '2022 - Presente',
          description: 'Formo parte del equipo técnico, gestionando sistemas y brindando soporte.'
        },
        {
          position: 'Policía Contravencional',
          company: 'Secretaría de Seguridad',
          period: '2020 - 2021',
          description: 'Desempeño en la secretaría de seguridad.'
        },
        {
          position: 'Docente',
          company: 'Eddis Educativa (Sede Morón y Marcos Paz)',
          period: '2023 - Presente',
          description: 'Dictado de cursos de informática y Reparación de Celulares.'
        }
      ],
      education: [
        {
          degree: 'Licenciatura en Informática',
          institution: 'Universidad Nacional del Oeste (UNO)',
          period: 'Proyección 2024',
          details: [
            'Actualmente cursando las últimas materias.',
            'Conocimientos en C#, HTML, CSS, JS, Python, PHP, ReactJS, SQL.',
            'Frameworks: Bootstrap, Tailwind, Django.',
            'Paquete Office (Avanzado).'
          ]
        }
      ],
      technicalSkills: [
        { name: 'Python', icon: 'fab fa-python', category: 'language', description: 'Me apasiona el desarrollo de Python, enfocándome en machine learning e inteligencia artificial.' },
        { name: 'JavaScript', icon: 'fab fa-js', category: 'language', description: 'Creación de aplicaciones web interactivas, manipulación del DOM e interacción con APIs.' },
        { name: 'C# .NET', icon: 'fab fa-microsoft', category: 'language', description: 'Desarrollo de aplicaciones de gestión empresarial utilizando Windows Forms y POO.' },
        { name: 'Django', icon: 'fas fa-leaf', category: 'framework', description: 'Sitios web dinámicos y robustos con enrutamiento de URL, plantillas y gestión de BD.' },
        { name: 'Node.js', icon: 'fab fa-node', category: 'framework', description: 'Construcción de APIs REST y CRUD, autenticación y bases de datos.' },
        { name: 'PHP', icon: 'fab fa-php', category: 'language', description: 'Desarrollo de aplicaciones web robustas con frameworks como Laravel.' },
        { name: 'Docker', icon: 'fab fa-docker', category: 'tool', description: 'Contenedorización para entornos de desarrollo y despliegue consistentes.' },
        { name: 'Git', icon: 'fab fa-git-alt', category: 'tool', description: 'Control de versiones y trabajo colaborativo.' },
        { name: 'MySQL', icon: 'fas fa-database', category: 'database', description: 'Gestión de bases de datos relacionales.' },
        { name: 'Linux', icon: 'fab fa-linux', category: 'os', description: 'Manejo de servidores y línea de comandos.' }
      ],
      certifications: [
        'Capacitación Codo a Codo Fullstack Python (2022)',
        'Cursos JavaScript, ReactJS y SQL - Coderhouse (2021)',
        'Curso de Base de Datos - Udemy (2021)',
        'Curso Desarrollador Web Full-Stack - LinkedIn Learning (2020)',
        'Inglés B2 (Avanzado)'
      ],
      projects: [
        {
          title: 'Arecofix Page',
          description: 'Sitio institucional y e-commerce para Arecofix. Construido con Angular y Tailwind CSS.',
          image: 'assets/img/projects/arecofix.png',
          tags: ['Angular', 'Tailwind', 'TypeScript'],
          link: 'https://arecofix.com.ar'
        },
        {
          title: 'Sistema de Gestión',
          description: 'Aplicación de escritorio para gestión empresarial desarrollada en C# .NET.',
          image: 'assets/img/projects/panel.png',
          tags: ['C#', '.NET', 'SQL Server']
        },
        {
          title: 'Registro Envión',
          description: 'Plataforma web para registro de beneficiarios utilizando Django y Python.',
          image: 'assets/img/projects/data.png',
          tags: ['Django', 'Python', 'PostgreSQL']
        }
      ]
    }
  };

  backgroundOptions = [
    { id: 'gradient-5', name: 'Dark Gray', class: 'bg-gradient-to-br from-gray-900 via-gray-800 to-black' },
    { id: 'gradient-1', name: 'Blue Gradient', class: 'bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900' }
  ];

  constructor(public preferencesService: PreferencesService) {}

  get currentContent(): PortfolioContent {
    return this.portfolioContent[this.currentLanguage];
  }

  get backgroundClass(): string {
    const selected = this.backgroundOptions.find(bg => bg.id === this.preferencesService.getCurrentTheme());
    return selected?.class || this.backgroundOptions[0].class;
  }

  ngOnInit(): void {
    this.preferencesService.language$.subscribe(lang => {
      this.currentLanguage = lang;
    });
  }
}
