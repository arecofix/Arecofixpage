import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

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

interface Value {
  title: string;
  description: string;
  icon: string;
}

interface Achievement {
  number: string;
  label: string;
  description: string;
}

@Component({
  selector: 'app-nosotros',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './nosotros.html',
  styleUrls: ['./nosotros.css']
})
export class NosotrosComponent implements OnInit {
  currentLanguage: 'en' | 'es' = 'es';
  expandedFAQ: number | null = null;

  achievements: Achievement[] = [
    {
      number: '5+',
      label: 'Años de Trayectoria',
      description: 'Innovando en Marcos Paz'
    },
    {
      number: '2500+',
      label: 'Dispositivos Recuperados',
      description: 'Extendiendo la vida útil de la tecnología'
    },
    {
      number: '500+',
      label: 'Alumnos Capacitados',
      description: 'Formando la próxima generación de técnicos'
    },
    {
      number: '100%',
      label: 'Garantía Asegurada',
      description: 'Respaldo total en cada servicio'
    }
  ];

  values: Value[] = [
    {
      title: 'Transparencia Radical',
      description: 'Sin letras chicas. Te explicamos exactamente qué tiene tu equipo y cuánto costará arreglarlo antes de empezar.',
      icon: '🔍'
    },
    {
      title: 'Pasión por Educar',
      description: 'No solo reparamos, enseñamos. Creemos en compartir el conocimiento para empoderar a nuestra comunidad.',
      icon: '📚'
    },
    {
      title: 'Excelencia Técnica',
      description: 'Nos capacitamos constantemente para estar a la vanguardia de las últimas tecnologías y métodos de reparación.',
      icon: '🛠️'
    },
    {
      title: 'Compromiso Local',
      description: 'Orgullosamente de Marcos Paz, trabajamos para impulsar el desarrollo tecnológico de nuestra ciudad.',
      icon: '🏙️'
    },
    {
      title: 'Sostenibilidad',
      description: 'Reparar es reciclar. Ayudamos a reducir la basura electrónica dando una segunda vida a tus dispositivos.',
      icon: '🌱'
    },
    {
      title: 'Empatía',
      description: 'Entendemos lo importante que es tu dispositivo para vos. Lo tratamos con el mismo cuidado que si fuera nuestro.',
      icon: '❤️'
    }
  ];

  faqs: FAQ[] = [
    {
      question: '¿Cuánto tiempo demora una reparación típica?',
      answer: 'Entendemos que tu tiempo vale. Cambios de batería o pantalla suelen estar listos en el día (1-3 horas). Diagnósticos más complejos pueden tomar 24-48 horas. Siempre te mantendremos informado del estado vía WhatsApp.',
      open: false
    },
    {
      question: '¿Qué garantía ofrecen?',
      answer: 'Ofrecemos una garantía escrita de 90 días sobre la mano de obra y los repuestos utilizados. Si la falla persiste por motivos no relacionados a nuevo daño físico o líquido, lo solucionamos sin cargo.',
      open: false
    },
    {
      question: '¿Mis datos están seguros?',
      answer: 'Absolutamente. La privacidad es prioridad. No accedemos a tu información personal a menos que sea estrictamente necesario para la reparación (ej. backup) y siempre con tu consentimiento previo.',
      open: false
    },
    {
      question: '¿Venden repuestos para que yo lo repare?',
      answer: '¡Sí! Apoyamos el derecho a reparar. Vendemos repuestos de calidad y herramientas. Además, si te interesa aprender, te invitamos a conocer nuestros cursos de reparación.',
      open: false
    },
    {
      question: '¿Hacen servicio a domicilio?',
      answer: 'Sí, contamos con servicio de retiro y entrega en Marcos Paz. Coordinamos el horario que más te convenga para que no tengas que moverte de tu casa o trabajo.',
      open: false
    }
  ];

  teamMembers: TeamMember[] = [
    {
      name: 'Ezequiel Enrico Areco',
      role: 'Fundador & Director Técnico',
      bio: 'Apasionado por la tecnología desde joven. Fundó Arecofix con la visión de profesionalizar el servicio técnico en la región. Ingeniero de software y experto en microelectrónica, lidera el equipo con un enfoque en calidad y educación continua.',
      image: '/assets/img/perfil.jpeg' // Placeholder path
    }
  ];

  ngOnInit(): void {
    this.loadLanguage();
  }

  toggleFAQ(index: number): void {
    this.expandedFAQ = this.expandedFAQ === index ? null : index;
  }

  private loadLanguage(): void {
    const saved = localStorage.getItem('portfolio-language');
    if (saved === 'en') {
      this.currentLanguage = 'en';
    }
  }

  get content() {
    return {
      es: {
        title: 'Más que un Servicio Técnico',
        subtitle: 'Somos Arecofix',
        intro: 'En Arecofix, fusionamos la precisión técnica con la pasión por enseñar. No solo reparamos dispositivos; construimos confianza y formamos futuro en Marcos Paz.',
        history: 'Nuestra Historia',
        historyText: 'Lo que comenzó en 2020 como un emprendimiento personal impulsado por la curiosidad y las ganas de resolver problemas, hoy es un referente tecnológico en la zona. Arecofix nació de la necesidad de un servicio técnico honesto y profesional. Con el tiempo, esa misión evolucionó: nos dimos cuenta de que podíamos hacer más que arreglar pantallas; podíamos brindar oportunidades a través de la educación.',
        foundation: 'Nuestra Esencia',
        foundationText: 'Creemos que la tecnología debe ser una herramienta de progreso, no de frustración. Por eso, cada reparación es una oportunidad para demostrar que las cosas se pueden hacer bien, con transparencia y dedicación.',
        mission: 'Misión',
        missionText: 'Brindar soluciones tecnológicas integrales que extiendan la vida útil de los dispositivos, mientras empoderamos a nuestra comunidad a través de la educación técnica y el acceso a herramientas de calidad.',
        vision: 'Visión',
        visionText: 'Ser el centro tecnológico líder de la región, reconocido no solo por la excelencia en reparaciones, sino como un semillero de talento técnico y un impulsor de la cultura de la reparación y la sostenibilidad.',
        objectives: 'Nuestros Objetivos',
        objectivesText: 'Buscamos la excelencia operativa, la satisfacción total del cliente y el crecimiento constante de nuestra oferta educativa.',
        commitments: 'Nuestros Compromisos',
        commitmentsList: [
          'Diagnósticos honestos y sin costo oculto',
          'Uso de repuestos de la mejor calidad disponible',
          'Atención personalizada y humana',
          'Fomento de la economía circular',
          'Formación continua de nuestro equipo y alumnos'
        ],
        values: 'Valores que nos Guían',
        achievements: 'Impacto en Números',
        team: 'Quienes Hacen Arecofix',
        faq: 'Preguntas Frecuentes',
        trust: 'Por Qué Elegirnos',
        trustPoints: [
          {
            title: 'Experiencia Comprobada',
            description: 'Miles de dispositivos reparados exitosamente avalan nuestro conocimiento.'
          },
          {
            title: 'Garantía Real',
            description: 'Si algo no queda bien, nos hacemos cargo. Tu satisfacción es nuestra prioridad.'
          },
          {
            title: 'Educación y Servicio',
            description: 'Somos técnicos que enseñan. Conocemos los dispositivos por dentro y por fuera.'
          },
          {
            title: 'Tecnología de Punta',
            description: 'Invertimos en las mejores herramientas para diagnósticos precisos y reparaciones duraderas.'
          }
        ]
      },
      en: {
        // Keeping English structure similar but simplified for now as requested focus is Spanish
        title: 'More Than Tech Support',
        subtitle: 'We Are Arecofix',
        intro: 'At Arecofix, we merge technical precision with a passion for teaching. We don\'t just repair devices; we build trust and shape the future in San Antonio de Areco.',
        history: 'Our History',
        historyText: 'What started in 2020 as a personal venture driven by curiosity, is now a tech benchmark in the area. Arecofix was born from the need for honest and professional technical service.',
        foundation: 'Our Essence',
        foundationText: 'We believe technology should be a tool for progress. Every repair is a chance to show things can be done right, with transparency and dedication.',
        mission: 'Mission',
        missionText: 'To provide integral tech solutions that extend device lifespan, while empowering our community through technical education.',
        vision: 'Vision',
        visionText: 'To be the leading tech hub in the region, recognized for repair excellence and as a nursery for technical talent.',
        objectives: 'Our Objectives',
        objectivesText: 'Operational excellence, total customer satisfaction, and constant growth of our educational offer.',
        commitments: 'Our Commitments',
        commitmentsList: [
          'Honest diagnostics, no hidden costs',
          'Top quality parts',
          'Personalized, human attention',
          'Promoting circular economy',
          'Continuous training'
        ],
        values: 'Values That Guide Us',
        achievements: 'Impact in Numbers',
        team: 'Who Makes Arecofix',
        faq: 'Frequently Asked Questions',
        trust: 'Why Choose Us',
        trustPoints: [
          {
            title: 'Proven Experience',
            description: 'Thousands of successfully repaired devices back our knowledge.'
          },
          {
            title: 'Real Warranty',
            description: 'If it\'s not right, we fix it. Your satisfaction is priority.'
          },
          {
            title: 'Education & Service',
            description: 'We are technicians who teach. We know devices inside out.'
          },
          {
            title: 'High Tech',
            description: 'We invest in the best tools for precise diagnostics.'
          }
        ]
      }
    };
  }

  get currentContent() {
    return this.content[this.currentLanguage];
  }
}
