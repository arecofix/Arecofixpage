import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Title, Meta } from '@angular/platform-browser';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { PreferencesService } from '../../shared/services/preferences.service';
import { environment } from '../../../environments/environment';
import { AuthService } from '@app/core/services/auth.service';

// Interface for Quote Form
interface QuoteForm {
  name: string;
  email: string;
  phone: string;
  company: string;
  projectType: string;
  budget: string;
  description: string;
}

interface TechItem {
  name: string;
  icon: string; // FontAwesome class or image path
  category: 'frontend' | 'backend' | 'cloud' | 'tools';
}

interface ServiceItem {
  icon: string;
  title: string;
  description: string;
}

interface ProjectItem {
  title: string;
  description: string;
  image: string;
  tags: string[];
  link?: string;
}

interface PartnerItem {
  name: string;
  logo: string; // URL/Path
}

interface ReviewItem {
  image: string;
  name: string;
  role: string;
  company: string;
  text: string;
}

interface HomeContent {
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
  partners: {
    title: string;
    subtitle: string;
    items: PartnerItem[];
  };
  reviews: {
    title: string;
    items: ReviewItem[];
  };
  quote: {
    title: string;
    subtitle: string;
    form: {
      name: string;
      email: string;
      phone: string;
      company: string;
      projectType: string;
      budget: string;
      description: string;
      cta: string;
    }
  };
}

@Component({
  selector: 'app-public-home-page',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './public-home-page.html',
  styles: `
    .tech-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
      gap: 2rem;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PublicHomePage implements OnInit {
  private titleService = inject(Title);
  private metaService = inject(Meta);
  private auth = inject(AuthService);

  whatsappNumber = environment.contact.whatsappNumber;

  // Quote Form State
  quoteModel: QuoteForm = {
    name: '',
    email: '',
    phone: '',
    company: '',
    projectType: 'web',
    budget: 'mid',
    description: ''
  };
  sendingQuote = false;

  homeContent: { en: HomeContent; es: HomeContent } = {
    en: {
      hero: {
        title: 'High Impact Digital Solutions',
        subtitle: 'Custom Software Development, IT Consulting, and Cloud Solutions for Companies and SMEs.',
        ctaPrimary: 'Get a Quote',
        ctaSecondary: 'View Portfolio'
      },
      services: {
        title: 'Our Services',
        subtitle: 'We transform your business with technology.',
        items: [
          { icon: 'fas fa-code', title: 'Custom Software', description: 'Web, mobile, and desktop applications tailored to your specific needs using modern scalable architectures.' },
          { icon: 'fas fa-cloud', title: 'Cloud Solutions', description: 'Migration and management on Azure/AWS. Scalable infrastructure and containerization with Docker.' },
          { icon: 'fas fa-chart-line', title: 'IT Consulting', description: 'Digital transformation strategies, process optimization, and technical advisory for startups and enterprises.' },
          { icon: 'fas fa-mobile-alt', title: 'Mobile Development', description: 'Native and cross-platform apps (React Native/Ionic) that engage users and drive growth.' }
        ]
      },
      techStack: {
        title: 'Technologies',
        subtitle: 'We master the modern ecosystem.',
        items: [
          { name: 'Python', icon: 'fab fa-python', category: 'backend' },
          { name: 'Node.js', icon: 'fab fa-node', category: 'backend' },
          { name: 'Angular', icon: 'fab fa-angular', category: 'frontend' },
          { name: 'React', icon: 'fab fa-react', category: 'frontend' },
          { name: 'C# .NET', icon: 'fab fa-microsoft', category: 'backend' },
          { name: 'Docker', icon: 'fab fa-docker', category: 'tools' },
          { name: 'Azure', icon: 'fab fa-microsoft', category: 'cloud' },
          { name: 'AWS', icon: 'fab fa-aws', category: 'cloud' }
        ]
      },
      projects: {
        title: 'Featured Projects',
        subtitle: 'Success stories and delivered solutions.',
        items: [
          { title: 'Envión Management Platform', description: 'Registration and management system for government social program.', image: 'assets/img/projects/data.png', tags: ['Django', 'Python', 'PostgreSQL'] },
          { title: 'Business ERP System', description: 'Desktop application for stock, sales, and personnel management.', image: 'assets/img/projects/panel.png', tags: ['.NET', 'C#', 'SQL Server'] },
          { title: 'Arecofix E-commerce', description: 'Full-featured e-commerce and booking platform.', image: 'assets/img/projects/arecofix.png', tags: ['Angular', 'Node.js', 'Supabase'] }
        ]
      },
      partners: {
        title: 'Strategic Alliances',
        subtitle: 'Companies we collaborate and innovate with.',
        items: [
          { name: 'Globant', logo: 'assets/img/partners/globant.png' }, // Placeholder paths, need to ensure assets exist or use text/CDN
          { name: 'Microsoft Azure', logo: 'assets/img/partners/azure.png' },
          { name: 'Accenture', logo: 'assets/img/partners/accenture.png' }
        ]
      },
      reviews: {
        title: 'What our clients say',
        items: [
          { image: 'https://randomuser.me/api/portraits/men/45.jpg', name: 'Roberto Mendez', role: 'CTO', company: 'Logistica Interior', text: 'The custom ERP system they built transformed our logistics operation completely. Highly recommended.' },
          { image: 'https://randomuser.me/api/portraits/women/68.jpg', name: 'Laura Gomez', role: 'Founder', company: 'StartApp', text: 'Excellent consulting on our cloud architecture. Migrating to Azure was seamless thanks to their team.' }
        ]
      },
      quote: {
        title: 'Start your Project',
        subtitle: 'Tell us about your idea and we will provide a detailed proposal.',
        form: {
          name: 'Name', email: 'Email', phone: 'Phone', company: 'Company',
          projectType: 'Project Type', budget: 'Estimated Budget', description: 'Project Details', cta: 'Request Quote'
        }
      }
    },
    es: {
      hero: {
        title: 'Soluciones Digitales de Alto Impacto',
        subtitle: 'Desarrollo de Software a Medida, Consultoría IT y Soluciones Cloud para Empresas y PyMEs.',
        ctaPrimary: 'Cotizar Proyecto',
        ctaSecondary: 'Ver Portfolio'
      },
      services: {
        title: 'Nuestros Servicios',
        subtitle: 'Transformamos tu negocio con tecnología de punta.',
        items: [
          { icon: 'fas fa-code', title: 'Software a Medida', description: 'Aplicaciones web, móviles y de escritorio adaptadas a tus necesidades reales con arquitecturas escalables.' },
          { icon: 'fas fa-cloud', title: 'Soluciones Cloud', description: 'Migración y gestión en Azure/AWS. Infraestructura escalable y containerización con Docker.' },
          { icon: 'fas fa-chart-line', title: 'Consultoría IT', description: 'Estrategias de transformación digital, optimización de procesos y asesoría técnica para startups y empresas.' },
          { icon: 'fas fa-database', title: 'Gestión de Datos', description: 'Diseño de bases de datos, APIs RESTful y sistemas de backend robustos y seguros.' }
        ]
      },
      techStack: {
        title: 'Stack Tecnológico',
        subtitle: 'Dominamos el ecosistema moderno.',
        items: [
          { name: 'Python', icon: 'fab fa-python', category: 'backend' },
          { name: 'Node.js', icon: 'fab fa-node', category: 'backend' },
          { name: 'Angular', icon: 'fab fa-angular', category: 'frontend' },
          { name: 'React', icon: 'fab fa-react', category: 'frontend' },
          { name: 'C# .NET', icon: 'fab fa-microsoft', category: 'backend' },
          { name: 'Docker', icon: 'fab fa-docker', category: 'tools' },
          { name: 'Azure', icon: 'fas fa-cloud', category: 'cloud' }, // FA doesn't have azure branding always free, using cloud generic or specific if avail
          { name: 'SQL / Postgres', icon: 'fas fa-database', category: 'backend' }
        ]
      },
      projects: {
        title: 'Proyectos Destacados',
        subtitle: 'Casos de éxito y soluciones entregadas.',
        items: [
          { title: 'Plataforma de Gestión Envión', description: 'Sistema de registro y administración para programa social gubernamental.', image: 'assets/img/projects/data.png', tags: ['Django', 'Python', 'PostgreSQL'] },
          { title: 'Sistema ERP Empresarial', description: 'Aplicación de escritorio para control de stock, ventas y personal.', image: 'assets/img/projects/panel.png', tags: ['.NET', 'C#', 'SQL Server'] },
          { title: 'Arecofix E-commerce', description: 'Plataforma completa de e-commerce y reservas.', image: 'assets/img/projects/arecofix.png', tags: ['Angular', 'Node.js', 'Supabase'] }
        ]
      },
      partners: {
        title: 'Alianzas Estratégicas',
        subtitle: 'Empresas con las que colaboramos e innovamos.',
        items: [
          { name: 'Globant', logo: '' }, // We will use text or generic placeholder if img missing
          { name: 'Microsoft Azure', logo: '' },
          { name: 'Accenture', logo: '' }
        ]
      },
      reviews: {
        title: 'Lo que dicen nuestros clientes corporativos',
        items: [
          { image: 'https://randomuser.me/api/portraits/men/45.jpg', name: 'Roberto Mendez', role: 'CTO', company: 'Logistica Interior', text: 'El sistema ERP a medida transformó nuestra operación logística. Altamente recomendados por su profesionalismo.' },
          { image: 'https://randomuser.me/api/portraits/women/68.jpg', name: 'Laura Gomez', role: 'Fundadora', company: 'StartApp', text: 'Excelente consultoría en arquitectura cloud. La migración a Azure fue transparente gracias a su equipo.' },
          { image: 'https://randomuser.me/api/portraits/men/32.jpg', name: 'Carlos Ruiz', role: 'Gerente', company: 'Distribuidora Oeste', text: 'Gran capacidad para entender nuestros problemas de negocio y plantear soluciones de software efectivas.' }
        ]
      },
      quote: {
        title: 'Comenzá tu Proyecto',
        subtitle: 'Contanos tu idea y te armamos una propuesta detallada.',
        form: {
          name: 'Nombre Completo', email: 'Correo Electrónico', phone: 'Teléfono', company: 'Empresa',
          projectType: 'Tipo de Proyecto', budget: 'Presupuesto Estimado', description: 'Detales del Proyecto', cta: 'Solicitar Cotización'
        }
      }
    }
  };

  content$: Observable<HomeContent>;

  constructor(public preferencesService: PreferencesService) {
    this.content$ = this.preferencesService.language$.pipe(
      map(lang => this.homeContent[lang])
    );
  }

  ngOnInit() {
    this.setSEO();
  }

  setSEO() {
    const title = 'Arecofix Software Factory | Desarrollo de Software a Medida Buenos Aires & Córdoba';
    const description = 'Empresa de desarrollo de software, consultoría IT y soluciones digitales para empresas y PyMEs. Especialistas en Python, .NET, Angular y Cloud Services. Buenos Aires, Córdoba.';

    this.titleService.setTitle(title);
    this.metaService.updateTag({ name: 'description', content: description });
    this.metaService.updateTag({
      name: 'keywords',
      content: 'software factory, desarrollo de software, programacion a medida, consultoria it, sistemas erp, desarrollo web argentina, buenos aires, cordoba, contratar programadores'
    });
  }

  async sendQuote() {
    if (!this.quoteModel.name || !this.quoteModel.email || !this.quoteModel.description) {
      alert('Por favor completa los campos principales.');
      return;
    }

    this.sendingQuote = true;
    try {
      const supabase = this.auth.getSupabaseClient();

      await supabase.from('contact_messages').insert({
        name: this.quoteModel.name,
        email: this.quoteModel.email,
        phone: this.quoteModel.phone,
        subject: `Presupuesto IT: ${this.quoteModel.projectType} - ${this.quoteModel.company}`,
        message: `Presupuesto: ${this.quoteModel.budget}\nDescripción: ${this.quoteModel.description}`,
        is_read: false
      });

      alert('Solicitud enviada. Nos pondremos en contacto pronto.');
      // Reset form
      this.quoteModel = { ...this.quoteModel, name: '', email: '', phone: '', company: '', description: '' };
    } catch (error) {
      console.error(error);
      alert('Error al enviar. Por favor intenta por WhatsApp.');
      const text = `Hola, quiero cotizar un proyecto de ${this.quoteModel.projectType}. Mi presupuesto es ${this.quoteModel.budget}.`;
      window.open(`https://wa.me/${this.whatsappNumber}?text=${encodeURIComponent(text)}`, '_blank');
    } finally {
      this.sendingQuote = false;
    }
  }
}