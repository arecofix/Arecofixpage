import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface PortfolioContent {
  name: string;
  title: string;
  location: string;
  phone: string;
  email: string;
  website: string;
  summary: string;
  workExperience: WorkExperience[];
  education: Education[];
  technicalSkills: TechnicalSkills;
  certifications: string[];
}

interface WorkExperience {
  position: string;
  company: string;
  period: string;
  achievements: string[];
}

interface Education {
  degree: string;
  institution: string;
  period: string;
  details: string[];
}

interface TechnicalSkills {
  languages: string;
  frameworks: string;
  technologies: string;
  tools: string;
  languages_spoken: string;
}

@Component({
  selector: 'app-portfolio',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './portfolio.html',
  styleUrls: ['./portfolio.css']
})
export class PortfolioComponent implements OnInit {
  currentLanguage: 'en' | 'es' = 'es';
  currentBackground: string = 'gradient-1';
  sidebarOpen = false;
  fontSize: number = 16;
  highContrast = false;

  portfolioContent: { en: PortfolioContent; es: PortfolioContent } = {
    en: {
      name: 'EZEQUIEL ENRICO ARECO',
      title: 'Semi-Senior Backend Engineer | Buenos Aires, Argentina',
      location: 'Buenos Aires, Argentina',
      phone: '+54 11 2596-0900',
      email: 'ezequielenrico15@gmail.com',
      website: 'www.arecofix.com.ar',
      summary: 'IT Technician with 5+ years of experience in Backend development and electronic device repair. Specialized in Java, Python, and Node.js, with strong knowledge in AWS, Docker, and scalable system design. Focused on process automation, performance optimization, and implementation of cybersecurity best practices.',
      workExperience: [
        {
          position: 'Backend Developer',
          company: 'Municipality of Marcos Paz',
          period: '2022 - 2024',
          achievements: [
            'Designed and implemented a registration system for the Envión program using Python and Django, reducing administrative errors by 30%.',
            'Developed RESTful APIs for internal systems and managed PostgreSQL databases.',
            'Implemented cloud solutions (AWS) and conducted IT workshops for 50+ beneficiaries.'
          ]
        },
        {
          position: 'Mobile Repair Instructor',
          company: 'Eddis Educativa',
          period: '2023 - Present',
          achievements: [
            'Delivered theoretical and practical classes on electronics, software, and applied programming.',
            'Worked with SMD soldering, diagnostics, and software development for embedded systems.'
          ]
        },
        {
          position: 'Municipal Police Officer',
          company: 'Dr. Héctor D\'Agnillo Hospital',
          period: '2020 - 2021',
          achievements: [
            'Developed internal cybersecurity and data protection policies.',
            'Supervised personnel and managed institutional security systems.'
          ]
        }
      ],
      education: [
        {
          degree: 'Bachelor\'s Degree in Computer Science',
          institution: 'Universidad Nacional del Oeste',
          period: '2022 - Present',
          details: [
            'Key project: Institutional website "Arecofix" with e-commerce integration.'
          ]
        },
        {
          degree: 'Python Programming',
          institution: 'Argentina Programa',
          period: '2021 - 2022',
          details: [
            'GPA: 8.40 / 10'
          ]
        }
      ],
      technicalSkills: {
        languages: 'Python, Java, Node.js, TypeScript, SQL',
        frameworks: 'Django, Express, Vue.js',
        technologies: 'AWS, Docker, RESTful APIs, PostgreSQL',
        tools: 'Git, Linux, Bash, PowerShell, Google Cloud, Azure',
        languages_spoken: 'Spanish (Native), English (C1 Advanced)'
      },
      certifications: [
        'Database Fundamentals – City of Buenos Aires',
        'Home Electrical Installation',
        'Driver\'s License'
      ]
    },
    es: {
      name: 'EZEQUIEL ENRICO ARECO',
      title: 'Ingeniero Backend Semi-Senior | Buenos Aires, Argentina',
      location: 'Buenos Aires, Argentina',
      phone: '+54 11 2596-0900',
      email: 'ezequielenrico15@gmail.com',
      website: 'www.arecofix.com.ar',
      summary: 'Técnico en informática con más de 5 años de experiencia en desarrollo Backend y reparación de dispositivos electrónicos. Especializado en Java, Python y Node.js, con experiencia en AWS, Docker y desarrollo de sistemas escalables. Apasionado por la automatización, la optimización de procesos tecnológicos y la aplicación de buenas prácticas de ciberseguridad.',
      workExperience: [
        {
          position: 'Backend Developer',
          company: 'Municipio de Marcos Paz',
          period: '2022 - 2024',
          achievements: [
            'Diseñé e implementé un sistema de registro para el programa Envión utilizando Python y Django, reduciendo errores administrativos en un 30%.',
            'Desarrollé APIs RESTful para integración de sistemas internos y gestioné bases de datos en PostgreSQL.',
            'Implementé soluciones en la nube (AWS) y realicé talleres de informática para más de 50 beneficiarios.'
          ]
        },
        {
          position: 'Profesor de Reparación de Celulares',
          company: 'Eddis Educativa',
          period: '2023 - Actualidad',
          achievements: [
            'Imparto clases teóricas y prácticas sobre electrónica, software y programación aplicada.',
            'Trabajo con soldadura SMD, diagnóstico y desarrollo de software orientado a hardware.'
          ]
        },
        {
          position: 'Policía Municipal Contravencional',
          company: 'Hospital Dr. Héctor D\'Agnillo',
          period: '2020 - 2021',
          achievements: [
            'Desarrollé políticas internas de ciberseguridad y protección de datos.',
            'Supervisé personal y monitoreé sistemas de seguridad institucional.'
          ]
        }
      ],
      education: [
        {
          degree: 'Licenciatura en Informática',
          institution: 'Universidad Nacional del Oeste',
          period: '2022 - Actualidad',
          details: [
            'Proyecto destacado: Sitio web institucional "Arecofix" con integración de comercio electrónico.'
          ]
        },
        {
          degree: 'Programación en Python',
          institution: 'Argentina Programa',
          period: '2021 - 2022',
          details: [
            'Promedio: 8,40'
          ]
        }
      ],
      technicalSkills: {
        languages: 'Python, Java, Node.js, TypeScript, SQL',
        frameworks: 'Django, Express, Vue.js',
        technologies: 'AWS, Docker, RESTful APIs, PostgreSQL',
        tools: 'Git, Linux, Bash, PowerShell, Google Cloud, Azure',
        languages_spoken: 'Español (nativo), Inglés (C1 avanzado)'
      },
      certifications: [
        'Fundamentos de Bases de Datos – Ciudad de Buenos Aires',
        'Instalación Eléctrica Domiciliaria',
        'Licencia de Conducir'
      ]
    }
  };

  backgroundOptions = [
    { id: 'gradient-1', name: 'Blue Gradient', class: 'bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900' },
    { id: 'gradient-2', name: 'Purple Gradient', class: 'bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900' },
    { id: 'gradient-3', name: 'Dark Blue', class: 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900' },
    { id: 'gradient-4', name: 'Teal Gradient', class: 'bg-gradient-to-br from-teal-900 via-cyan-800 to-blue-900' },
    { id: 'gradient-5', name: 'Dark Gray', class: 'bg-gradient-to-br from-gray-900 via-gray-800 to-black' }
  ];

  get currentContent(): PortfolioContent {
    return this.portfolioContent[this.currentLanguage];
  }

  get backgroundClass(): string {
    const selected = this.backgroundOptions.find(bg => bg.id === this.currentBackground);
    return selected?.class || this.backgroundOptions[0].class;
  }

  ngOnInit(): void {
    this.loadPreferences();
  }

  toggleLanguage(lang: 'en' | 'es'): void {
    this.currentLanguage = lang;
    this.savePreferences();
  }

  changeBackground(bgId: string): void {
    this.currentBackground = bgId;
    this.savePreferences();
  }

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }

  closeSidebar(): void {
    this.sidebarOpen = false;
  }

  increaseFontSize(): void {
    if (this.fontSize < 24) {
      this.fontSize += 2;
      this.saveFontSize();
    }
  }

  decreaseFontSize(): void {
    if (this.fontSize > 12) {
      this.fontSize -= 2;
      this.saveFontSize();
    }
  }

  toggleHighContrast(): void {
    this.highContrast = !this.highContrast;
    this.saveAccessibility();
  }

  private saveFontSize(): void {
    localStorage.setItem('portfolio-font-size', this.fontSize.toString());
  }

  private saveAccessibility(): void {
    localStorage.setItem('portfolio-high-contrast', this.highContrast.toString());
  }

  private savePreferences(): void {
    localStorage.setItem('portfolio-language', this.currentLanguage);
    localStorage.setItem('portfolio-background', this.currentBackground);
  }

  private loadPreferences(): void {
    const savedLanguage = localStorage.getItem('portfolio-language') as 'en' | 'es' | null;
    const savedBackground = localStorage.getItem('portfolio-background');
    const savedFontSize = localStorage.getItem('portfolio-font-size');
    const savedContrast = localStorage.getItem('portfolio-high-contrast');
    
    if (savedLanguage) {
      this.currentLanguage = savedLanguage;
    }
    if (savedBackground) {
      this.currentBackground = savedBackground;
    }
    if (savedFontSize) {
      this.fontSize = parseInt(savedFontSize, 10);
    }
    if (savedContrast) {
      this.highContrast = savedContrast === 'true';
    }
  }
}
