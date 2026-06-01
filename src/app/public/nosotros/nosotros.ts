import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { PreferencesService } from '../../shared/services/preferences.service';
import { SeoService } from '@app/core/services/seo.service';
import { CertificateGalleryComponent } from '../../shared/components/certificate-gallery/certificate-gallery.component';
import { environment } from '../../../environments/environment';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

interface Achievement {
  number: string;
  label: string;
  description: string;
}

interface Value {
  title: string;
  description: string;
  icon: string;
}

interface TeamMember {
  name: string;
  role: string;
  bio: string;
  image?: string;
  linkedin?: string;
}

interface FAQ {
  question: string;
  answer: string;
  open?: boolean;
}

interface NosotrosContent {
  title: string;
  subtitle: string;
  intro: string;
  achievements: Achievement[];
  history: string;
  historyText: string;
  foundation: string;
  foundationText: string;
  mission: string;
  missionText: string;
  vision: string;
  visionText: string;
  valuesTitle: string;
  values: Value[];
  teamTitle: string;
  teamSubtitle: string;
  teamMembers: TeamMember[];
  faqTitle: string;
  faqs: FAQ[];
  ctaTitle: string;
  ctaText: string;
  ctaWhatsapp: string;
  ctaContact: string;
}

@Component({
  selector: 'app-nosotros',
  standalone: true,
  imports: [CommonModule, CertificateGalleryComponent, NgOptimizedImage],
  templateUrl: './nosotros.html',
  styleUrls: ['./nosotros.css']
})
export class NosotrosComponent implements OnInit {
  private seoService = inject(SeoService);
  private sanitizer = inject(DomSanitizer);

  /** Pre-sanitized YouTube embed URL so Angular trusts the iframe src binding */
  youtubeUrl: SafeResourceUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
    'https://www.youtube.com/embed/l93eYkGMxsI?start=58&rel=0'
  );

  ngOnInit() {
    this.seoService.setPageData({
      title: 'Sobre Nosotros',
      description: 'Más que una empresa de software. Somos un equipo apasionado por transformar negocios a través de la tecnología en Marcos Paz y el mundo.',
      imageUrl: 'assets/img/branding/og-nosotros.jpg'
    });
  }

  expandedFAQ: number | null = null;

  nosotrosContent: { en: NosotrosContent; es: NosotrosContent } = {
    es: {
      title: 'Más que un Servicio Técnico',
      subtitle: 'Somos Arecofix',
      intro: 'En Arecofix, fusionamos la precisión técnica con la pasión por enseñar. No solo reparamos dispositivos; construimos confianza y formamos futuro en Marcos Paz.',
      achievements: [
        { number: '5+', label: 'Años de Trayectoria', description: 'Innovando en Marcos Paz' },
        { number: '2500+', label: 'Dispositivos Recuperados', description: 'Extendiendo la vida útil de la tecnología' },
        { number: '500+', label: 'Alumnos Capacitados', description: 'Formando la próxima generación de técnicos' },
        { number: '100%', label: 'Garantía Asegurada', description: 'Respaldo total en cada servicio' }
      ],
      history: 'Nuestra Historia',
      historyText: 'Lo que comenzó en 2020 como un emprendimiento personal impulsado por la curiosidad y las ganas de resolver problemas, hoy es un referente tecnológico en la zona. Arecofix nació de la necesidad de un servicio técnico honesto y profesional. Con el tiempo, esa misión evolucionó: nos dimos cuenta de que podíamos hacer más que arreglar pantallas; podíamos brindar oportunidades a través de la educación.',
      foundation: 'Nuestra Esencia',
      foundationText: 'Creemos que la tecnología debe ser una herramienta de progreso, no de frustración. Por eso, cada reparación es una oportunidad para demostrar que las cosas se pueden hacer bien, con transparencia y dedicación.',
      mission: 'Misión',
      missionText: 'Brindar soluciones tecnológicas integrales que extiendan la vida útil de los dispositivos, mientras empoderamos a nuestra comunidad a través de la educación técnica y el acceso a herramientas de calidad.',
      vision: 'Visión',
      visionText: 'Ser el centro tecnológico líder de la región, reconocido no solo por la excelencia en reparaciones, sino como un semillero de talento técnico y un impulsor de la cultura de la reparación y la sostenibilidad.',
      valuesTitle: 'Valores que nos Guían',
      values: [
        { title: 'Transparencia Radical', description: 'Sin letras chicas. Te explicamos exactamente qué tiene tu equipo y cuánto costará arreglarlo antes de empezar.', icon: '🔍' },
        { title: 'Pasión por Educar', description: 'No solo reparamos, enseñamos. Creemos en compartir el conocimiento para empoderar a nuestra comunidad.', icon: '📚' },
        { title: 'Excelencia Técnica', description: 'Nos capacitamos constantemente para estar a la vanguardia de las últimas tecnologías y métodos de reparación.', icon: '🛠️' },
        { title: 'Compromiso Local', description: 'Orgullosamente de Marcos Paz, trabajamos para impulsar el desarrollo tecnológico de nuestra ciudad.', icon: '🏙️' },
        { title: 'Sostenibilidad', description: 'Reparar es reciclar. Ayudamos a reducir la basura electrónica dando una segunda vida a tus dispositivos.', icon: '🌱' },
        { title: 'Empatía', description: 'Entendemos lo importante que es tu dispositivo para vos. Lo tratamos con el mismo cuidado que si fuera nuestro.', icon: '❤️' }
      ],
      teamTitle: 'Quienes Hacen Arecofix',
      teamSubtitle: 'Conoce a las personas detrás de la tecnología.',
      teamMembers: [
        {
          name: 'Ezequiel Enrico Areco',
          role: 'Fundador & Ingeniero de Software',
          bio: 'Desarrollador Full Stack y experto en Ciberseguridad e Infraestructura (DevOps). Con una sólida trayectoria construyendo sistemas empresariales (Spring Boot, Node, Supabase, AWS), Ezequiel aplica rigurosos estándares de ingeniería para garantizar reparaciones de alta complejidad y arquitecturas de software inquebrantables. Nivel de inglés C1 y estudiante universitario destacado.',
          image: 'assets/img/portfolio/ezequiel-enrico-areco.jpeg',
          linkedin: environment.contact.socialMedia.linkedin
        }
      ],
      faqTitle: 'Preguntas Frecuentes',
      faqs: [
        { question: '¿Cuánto tiempo demora una reparación típica?', answer: 'Entendemos que tu tiempo vale. Cambios de batería o pantalla suelen estar listos en el día (1-3 horas). Diagnósticos más complejos pueden tomar 24-48 horas. Siempre te mantendremos informado del estado vía WhatsApp.', open: false },
        { question: '¿Qué garantía ofrecen?', answer: 'Ofrecemos una garantía escrita de 90 días sobre la mano de obra y los repuestos utilizados. Si la falla persiste por motivos no relacionados a nuevo daño físico o líquido, lo solucionamos sin cargo.', open: false },
        { question: '¿Mis datos están seguros?', answer: 'Absolutamente. La privacidad es prioridad. No accedemos a tu información personal a menos que sea estrictamente necesario para la reparación (ej. backup) y siempre con tu consentimiento previo.', open: false },
        { question: '¿Venden repuestos para que yo lo repare?', answer: '¡Sí! Apoyamos el derecho a reparar. Vendemos repuestos de calidad y herramientas. Además, si te interesa aprender, te invitamos a conocer nuestros cursos de reparación.', open: false },
        { question: '¿Hacen servicio a domicilio?', answer: 'Sí, contamos con servicio de retiro y entrega en Marcos Paz. Coordinamos el horario que más te convenga para que no tengas que moverte de tu casa o trabajo.', open: false }
      ],
      ctaTitle: '¿Listo para recuperar tu dispositivo?',
      ctaText: 'Contacta con nosotros hoy y descubre por qué miles de clientes confían en Arecofix.',
      ctaWhatsapp: 'Contactar por WhatsApp',
      ctaContact: 'Enviar Consulta'
    },
    en: {
      title: 'More Than Tech Support',
      subtitle: 'We Are Arecofix',
      intro: 'At Arecofix, we merge technical precision with a passion for teaching. We don\'t just repair devices; we build trust and shape the future in Marcos Paz.',
      achievements: [
        { number: '5+', label: 'Years of Experience', description: 'Innovating in Marcos Paz' },
        { number: '2500+', label: 'Devices Recovered', description: 'Extending technology lifespan' },
        { number: '500+', label: 'Students Trained', description: 'Training the next generation of technicians' },
        { number: '100%', label: 'Guaranteed Warranty', description: 'Total backing in every service' }
      ],
      history: 'Our History',
      historyText: 'What started in 2020 as a personal venture driven by curiosity and a desire to solve problems, is now a tech benchmark in the area. Arecofix was born from the need for honest and professional technical service. Over time, that mission evolved: we realized we could do more than fix screens; we could provide opportunities through education.',
      foundation: 'Our Essence',
      foundationText: 'We believe technology should be a tool for progress, not frustration. That\'s why every repair is a chance to show things can be done right, with transparency and dedication.',
      mission: 'Mission',
      missionText: 'To provide integral tech solutions that extend device lifespan, while empowering our community through technical education and access to quality tools.',
      vision: 'Vision',
      visionText: 'To be the leading tech hub in the region, recognized not only for repair excellence but as a nursery for technical talent and a driver of repair culture and sustainability.',
      valuesTitle: 'Values That Guide Us',
      values: [
        { title: 'Radical Transparency', description: 'No fine print. We explain exactly what your device needs and how much it will cost before starting.', icon: '🔍' },
        { title: 'Passion for Teaching', description: 'We don\'t just repair, we teach. We believe in sharing knowledge to empower our community.', icon: '📚' },
        { title: 'Technical Excellence', description: 'We constantly train to be at the forefront of the latest technologies and repair methods.', icon: '🛠️' },
        { title: 'Local Commitment', description: 'Proudly from Marcos Paz, we work to boost the technological development of our city.', icon: '🏙️' },
        { title: 'Sustainability', description: 'Repairing is recycling. We help reduce e-waste by giving a second life to your devices.', icon: '🌱' },
        { title: 'Empathy', description: 'We understand how important your device is to you. We treat it with the same care as if it were ours.', icon: '❤️' }
      ],
      teamTitle: 'Who Makes Arecofix',
      teamSubtitle: 'Meet the people behind the technology.',
      teamMembers: [
        {
          name: 'Ezequiel Enrico Areco',
          role: 'Founder & Technical Director',
          bio: 'Passionate about technology since young. Founded Arecofix with the vision of professionalizing technical service in the region. Software engineer and microelectronics expert, leads the team with a focus on quality and continuous education.',
          image: '/assets/img/perfil.jpeg',
          linkedin: environment.contact.socialMedia.linkedin
        }
      ],
      faqTitle: 'Frequently Asked Questions',
      faqs: [
        { question: 'How long does a typical repair take?', answer: 'We understand your time is valuable. Battery or screen replacements are usually ready within the day (1-3 hours). More complex diagnostics can take 24-48 hours. We will always keep you updated via WhatsApp.', open: false },
        { question: 'What warranty do you offer?', answer: 'We offer a 90-day written warranty on labor and parts used. If the fault persists for reasons unrelated to new physical or liquid damage, we fix it free of charge.', open: false },
        { question: 'Are my data safe?', answer: 'Absolutely. Privacy is a priority. We do not access your personal information unless strictly necessary for the repair (e.g., backup) and always with your prior consent.', open: false },
        { question: 'Do you sell parts for me to repair it?', answer: 'Yes! We support the right to repair. We sell quality parts and tools. Also, if you are interested in learning, we invite you to check out our repair courses.', open: false },
        { question: 'Do you offer home service?', answer: 'Yes, we have pickup and delivery service in Marcos Paz. We coordinate the time that suits you best so you don\'t have to move from your home or work.', open: false }
      ],
      ctaTitle: 'Ready to recover your device?',
      ctaText: 'Contact us today and discover why thousands of customers trust Arecofix.',
      ctaWhatsapp: 'Contact via WhatsApp',
      ctaContact: 'Send Inquiry'
    }
  };

  content$: Observable<NosotrosContent>;

  constructor(public preferencesService: PreferencesService) {
    this.content$ = this.preferencesService.language$.pipe(
      map(lang => this.nosotrosContent[lang])
    );
  }

  toggleFAQ(index: number) {
    this.expandedFAQ = this.expandedFAQ === index ? null : index;
  }
}
