import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { PreferencesService } from '../../shared/services/preferences.service';
import { SeoService } from '../../shared/services/seo.service';
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

interface IndustrySolution {
  title: string;
  description: string;
  icon: string;
  examples: string[];
}

interface TechServiceDetailed {
  title: string;
  description: string;
  icon: string;
  image: string;
  features: string[];
}

interface MethodologyStep {
  title: string;
  description: string;
  icon?: string; // Made optional to match usage
}

interface MetricItem {
  value: string;
  label: string;
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
  novedadesFooter: {
    title: string;
    links: { text: string; url: string }[];
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
  private seoService = inject(SeoService);
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
        // Keeping EN minimal/placeholder
        hero: {
            title: 'Transform Your Business', subtitle: 'Digital Solutions', ctaPrimary: 'Explore', ctaSecondary: 'Contact'
        },
        services: { title: 'Services', subtitle: 'Our Services', items: [] },
        industries: { title: 'Industries', subtitle: 'Sectors we serve', items: [] },
        techServices: { title: 'Tech Capabilities', subtitle: 'What we build', items: [] },
        methodology: { title: 'Methodology', subtitle: 'How we work', description: '', steps: [] },
        metrics: { title: 'Metrics', subtitle: 'Our numbers', items: [] },
        techStack: { title: 'Tech Stack', subtitle: 'Technologies', items: [] },
        projects: { title: 'Projects', subtitle: 'Case Studies', items: [] },
        reviews: { title: 'Testimonials', subtitle: 'Client feedback', items: [] },
        quote: { title: 'Contact', subtitle: 'Get in touch', form: { name: '', email: '', phone: '', company: '', projectType: '', budget: '', description: '', cta: '' } },
        coursesTeaser: { title: 'Learn a New Skill', subtitle: 'Train with professionals.', cta: 'View Courses', link: '/cursos' },
        cellServicePromo: { title: 'Need Technical Service?', subtitle: 'Repair your device with warranty.', cta: 'Request Quote', link: '/celular' },
        novedadesFooter: { title: 'News', links: [] }
    },
    es: {
      hero: {
        title: 'Transforma Tu Negocio Con Soluciones Digitales Innovadoras',
        subtitle: 'Impulsa el potencial digital de tu empresa con software personalizado y tecnologías avanzadas.',
        ctaPrimary: 'Explorar Casos de Éxito',
        ctaSecondary: 'Conversemos'
      },
      services: {
        title: 'Nuestros Servicios',
        subtitle: 'Soluciones Que Impulsan el Futuro',
        items: [
          { icon: 'fas fa-laptop-code', title: 'Desarrollo Web & App', description: 'Plataformas web y aplicaciones móviles de última generación que combinan diseño excepcional con funcionalidades avanzadas a medida.' },
          { icon: 'fas fa-cogs', title: 'Automatizaciones RPA', description: 'Robots que ejecutan tareas repetitivas con precisión perfecta, liberando a los equipos humanos para el trabajo más valioso: el trabajo estratégico.' },
          { icon: 'fas fa-comments', title: 'Chatbots & Asistentes Virtuales', description: 'Asistentes multimodal que se encargan de gestionar la atención omnicanal en las redes sociales de las empresas. WhatsApp, Telegram, Messenger, Instagram, entre otras.' },
          { icon: 'fas fa-brain', title: 'Infraestructura & Agentes de IA', description: 'Sistemas cognitivos de Inteligencia Artificial que toman decisiones complejas, procesan lenguaje natural y se adaptan a los escenarios cambiantes de cada empresa para tomar acciones.' },
          { icon: 'fas fa-chart-pie', title: 'Business Intelligence & Data Analytics', description: 'Sistemas que analizan datos para generar reportes visuales, predicciones y estrategias que impulsan el rendimiento empresarial y reducen riesgos en las operaciones.' }
        ]
      },
      industries: {
        title: 'Soluciones para Tu Negocio',
        subtitle: 'Tecnología diseñada para resolver los desafíos reales de tu industria.',
        items: [
            {
                title: 'Comercios y Retail',
                description: 'Control de stock inteligente, facturación electrónica y gestión de clientes.',
                icon: 'fas fa-store',
                examples: ['Ferreterías', 'Farmacias', 'Forrajerías', 'Pet Shops']
            },
            {
                title: 'Servicios y Turnos',
                description: 'Sistemas de agendamiento de citas, recordatorios automáticos por WhatsApp y gestión de personal.',
                icon: 'fas fa-calendar-check',
                examples: ['Barberías', 'Peluquerías', 'Veterinarias', 'Consultorios']
            },
            {
                title: 'Gastronomía',
                description: 'Comandas digitales, menú QR interactivo y gestión de mesas y delivery.',
                icon: 'fas fa-utensils',
                examples: ['Restaurantes', 'Cafeterías', 'Dark Kitchens']
            },
            {
                title: 'Profesionales',
                description: 'Portfolios digitales, gestión de clientes y automatización de documentos.',
                icon: 'fas fa-user-tie',
                examples: ['Contadores', 'Abogados', 'Arquitectos']
            }
        ]
      },
      techServices: {
        title: 'Capacidades Técnicas',
        subtitle: 'Dominamos todas las plataformas para dar vida a tu idea.',
        items: [
            {
                title: 'Desarrollo Web',
                description: 'Sitios corporativos y aplicaciones web complejas, rápidas y responsive.',
                icon: 'fas fa-globe',
                image: 'assets/img/services/web-dev.svg',
                features: ['E-commerce', 'Portales de Cliente', 'Dashboards Administrativos']
            },
            {
                title: 'Aplicaciones de Escritorio',
                description: 'Software robusto para gestión interna, puntos de venta (POS) y administración.',
                icon: 'fas fa-desktop',
                image: 'assets/img/services/desktop-dev.svg',
                features: ['Java Swing/JavaFX', '.NET / C#', 'Gestión Offline']
            },
            {
                title: 'Aplicaciones Móviles',
                description: 'Llevá tu negocio al bolsillo de tus clientes con apps nativas o híbridas.',
                icon: 'fas fa-mobile-screen',
                image: 'assets/img/services/mobile-dev.svg',
                features: ['Android & iOS', 'Notificaciones Push', 'Geolocalización']
            },
            {
                title: 'Scripts & Automatización',
                description: 'Scripts a medida para conectar sistemas, APIs y bases de datos.',
                icon: 'fas fa-terminal',
                image: 'assets/img/services/scripts.svg',
                features: ['Integración de APIs', 'Web Scraping', 'Migración de Datos']
            }
        ]
      },
      methodology: {
        title: 'Nuestro Método de Trabajo',
        subtitle: 'De la Idea a la Realidad Digital',
        description: 'Construimos soluciones robustas y escalables combinando tecnología propia con componentes verificados y frameworks ágiles, garantizando eficiencia y menor riesgo en cada proyecto.',
        steps: [
            { title: 'Descubrimiento', description: 'Entendemos tu negocio.', icon: 'fas fa-search' },
            { title: 'Planificación', description: 'Diseñamos la solución.', icon: 'fas fa-map' },
            { title: 'Desarrollo', description: 'Construimos iterativamente.', icon: 'fas fa-code' },
            { title: 'Testing', description: 'Aseguramos la calidad.', icon: 'fas fa-vial' },
            { title: 'Despliegue', description: 'Lanzamos al mercado.', icon: 'fas fa-rocket' }
        ]
      },
      metrics: {
        title: 'Nuestros Números',
        subtitle: 'En un mercado en donde la complejidad es común, aportamos simplicidad y experiencia.',
        items: [
            { value: '14', label: 'Clientes confían en nosotros' },
            { value: '+125', label: 'Proyectos participados al 2025' },
            { value: '4', label: 'Años de trayectoria' },
            { value: '3', label: 'Países presentes (Perú, México, USA)' }
        ]
      },
      techStack: {
        title: 'Tecnologías',
        subtitle: 'Stack moderno y escalable.',
        items: [
            { name: 'Python', icon: 'fab fa-python', category: 'backend' },
            { name: 'Node.js', icon: 'fab fa-node', category: 'backend' },
            { name: 'Angular', icon: 'fab fa-angular', category: 'frontend' },
            { name: 'React', icon: 'fab fa-react', category: 'frontend' },
            { name: '.NET', icon: 'fab fa-microsoft', category: 'backend' },
            { name: 'AWS', icon: 'fab fa-aws', category: 'cloud' },
            { name: 'Azure', icon: 'fab fa-microsoft', category: 'cloud' }
        ]
      },
      projects: {
        title: 'Casos de Éxito',
        subtitle: 'Nuestros Clientes. Nuestra Mejor Presentación.',
        items: [
          { title: 'Universidad Continental', description: 'Participamos en el proceso de transformación del ecosistema digital educativo: Modernización de Admisiones, Aulas Virtuales, etc.', image: 'assets/img/projects/continental.jpg', tags: ['Educación', 'Desarrollo de Software'], link: '#' },
          { title: 'SUNAT', description: 'Desarrollamos mejoras críticas en los sistemas aduaneros SINE y SIGCO, automatizando procesos de carga y validación.', image: 'assets/img/projects/sunat.jpg', tags: ['Sector Público', 'Modernización'], link: '#' },
          { title: 'Copeinca', description: 'Automatizamos procesos pesqueros con RPA y web scraping, integrando plataformas Produce, SAP Solman y Wrike.', image: 'assets/img/projects/copeinca.jpg', tags: ['Pesca', 'RPA'], link: '#' },
          { title: 'SAT', description: 'Modernizamos el sistema tributario del SAT implementando procesos automatizados para arbitrios municipales e impuesto predial.', image: 'assets/img/projects/sat.jpg', tags: ['Sector Público', 'Modernización'], link: '#' }
        ]
      },
      reviews: {
        title: 'Testimonios',
        subtitle: 'Soluciones Que Marcan La Diferencia',
        items: [
          { image: 'assets/img/testimonials/fernando.jpg', name: 'Fernando Palomino', role: 'Jefe de Sistemas', company: 'Compartamos Financiera', text: 'Recomendamos a Soluciones Digitales como proveedor confiable y profesional de infraestructura tecnológica. Cumplieron con nuestras expectativas.' },
          { image: 'assets/img/testimonials/justo.jpg', name: 'Justo Pérez', role: 'Gerente de Operaciones', company: 'SUNAT', text: 'Soluciones Digitales Group ha cumplido satisfactoriamente con los objetivos propuestos, habiendo demostrado eficiencia, seriedad y mejora continua.' }
        ]
      },
      quote: {
        title: 'Contacto',
        subtitle: 'Lidera El Cambio Hoy',
        form: {
          name: 'Nombre Completo', email: 'Correo Electrónico', phone: 'Teléfono', company: 'Empresa',
          projectType: 'Tipo de Proyecto', budget: 'Presupuesto', description: 'Mensaje', cta: 'Conversemos'
        }
      },
      coursesTeaser: {
        title: 'Aprende una Nueva Habilidad',
        subtitle: 'Capacitate con los mejores profesionales y obtené una salida laboral inmediata.',
        cta: 'Ver Cursos',
        link: '/cursos'
      },
      cellServicePromo: {
        title: 'Servicio Técnico de Celulares en Marcos Paz',
        subtitle: 'Expertos en reparacion de celulares en Marcos Paz. Arreglo de celulares, tablets y consolas con repuestos originales y garantía garantizada.',
        cta: 'Solicitar Presupuesto',
        link: '/celular'
      },
      novedadesFooter: {
        title: 'Novedades',
        links: [
            { text: 'Sobre Nosotros', url: '/nosotros' },
            { text: 'Contacto', url: '/contacto' },
            { text: 'GSM', url: '/gsm' },
            { text: 'Blog', url: '/blog' }
        ]
      }
    }
  };

  content$: Observable<HomeContent>;

  constructor(public preferencesService: PreferencesService) {
    this.content$ = this.preferencesService.language$.pipe(
      map(lang => {
          // Merge missing keys for ES if needed (quick patch logic, ideally strictly typed)
          const content = this.homeContent[lang] as any;
          if (lang === 'es') {
             content.coursesTeaser = this.homeContent.es.coursesTeaser || this.homeContent['es']['coursesTeaser'];
          }
          return content;
      })
    );
  }

  ngOnInit() {
    this.setSEO();
  }

  setSEO() {
    this.seoService.setSeoData({
      title: 'Servicio Técnico de Celulares en Marcos Paz | Arecofix Software Factory',
      description: 'Líderes en reparacion de celulares en Marcos Paz. Realizamos arreglo de celulares, cambios de pantalla, baterías y software. Servicio técnico especializado con garantía.',
      keywords: 'servicio tecnico de celulares en marcos paz, reparacion de celulares en marcos paz, arreglo de celulares en marcos paz, cambio de pantalla, cambio de bateria, software factory, desarrollo web',
      ogTitle: 'Servicio Técnico de Celulares en Marcos Paz | Arecofix',
      ogDescription: 'Reparación profesional de celulares. Confía en los expertos en Marcos Paz para el arreglo de tu dispositivo. Solicita tu presupuesto online.',
      ogImage: 'assets/img/services/mobile-repair-og.jpg', // Placeholder, ideally should be a real image
      ogUrl: 'https://arecofix.com.ar/'
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