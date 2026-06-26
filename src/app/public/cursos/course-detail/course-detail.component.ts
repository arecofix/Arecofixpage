import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SeoService } from '@app/core/services/seo.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CoursesService, Course, Module } from '@app/core/services/courses.service';
import { CourseLevel } from '@app/features/courses/domain/entities/course.entity';
import { switchMap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { IsLoadingComponent, IsErrorComponent } from '@app/shared/components/resource-status';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../../environments/environment';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-course-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, IsLoadingComponent, IsErrorComponent, FormsModule],
  templateUrl: './course-detail.component.html'
})
export class CourseDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private coursesService = inject(CoursesService);
  private cd = inject(ChangeDetectorRef);
  private sanitizer = inject(DomSanitizer);
  private seoService = inject(SeoService);

  course: Course | null = null;
  loading = true;
  error: string | null = null;
  
  // Registration
  whatsappNumber = environment.contact.whatsappNumber;
  showRegistrationModal = false;
  registrationForm = { full_name: '', email: '', phone: '' };
  registering = false;
  registrationSuccess = false;
  registrationError: string | null = null;

  // Tabs
  activeTab = 'info'; // info, temario, galeria, testimonios

  // Modules (Syllabus)
  modules: Module[] = [];
  loadingModules = false;

  // Static Content
  galleryImages = [
    'assets/img/cursos/academy/aprender.jpeg',
    'assets/img/cursos/academy/capacitaciones.jpeg',
    'assets/img/cursos/academy/cic.jpeg',
    'assets/img/cursos/academy/profe_de_reparacion-de-celulares.jpeg',
    'assets/img/cursos/academy/eddis_educativa.jpeg',
    'assets/img/cursos/academy/salida_laboral_propia.jpeg',
    'assets/img/cursos/academy/diploma.jpeg',
    'assets/img/cursos/academy/cursos.jpeg',
    'assets/img/cursos/academy/donde_enseñan_reparacion_de_celulares.jpeg'
  ];

  pressLinks = [
    {
      title: 'Jóvenes del programa Envión finalizaron el curso',
      source: 'Municipio de Marcos Paz',
      url: 'https://www.marcospaz-gob-ar.marcospaz.net/noticias/item/8551-j%C3%B3venes-del-programa-envi%C3%B3n-finalizaron-el-curso-de-reparaci%C3%B3n-de-celulares.html',
      image: 'assets/img/cursos/municipio.jpg', // Verified as existing in root cursos folder
      date: 'Reciente'
    },
    {
      title: 'Alumnos de Envión se capacitan en reparación',
      source: 'A1 Noticias',
      url: 'https://a1noticias.com.ar/nota/9798/marcos-paz-jovenes-del-programa-envion-finalizaron-el-curso-de-reparacion-de-celulares',
      image: 'assets/img/cursos/academy/diploma.jpeg', // Verified as in academy folder
      date: 'Reciente'
    }
  ];

  // Sales Content Types
  audienceList: string[] = [];
  benefitsList: any[] = [];
  syllabusTimeline: any[] = [];
  roiExamples: any[] = [];
  inclusions: any[] = [];
  faqs: any[] = [];
  
  get isCelularCourse(): boolean {
      if (!this.course) return false;
      const title = (this.course.title || '').toLowerCase();
      const slug = (this.course.slug || '').toLowerCase();
      return title.includes('celular') || slug.includes('celular') || title.includes('microelectr');
  }

  get facilityImage(): string {
      return this.isCelularCourse 
          ? 'assets/img/cursos/academy/profe_de_reparacion-de-celulares.jpeg' 
          : (this.course?.image_url || 'assets/img/cursos/academy/capacitaciones.jpeg');
  }

  getVideoUrl() {
      // YouTube embed with start time 45s
      return this.sanitizer.bypassSecurityTrustResourceUrl('https://www.youtube.com/embed/l93eYkGMxsI?start=45');
  }

  ngOnInit() {
    this.route.paramMap.pipe(
      switchMap(params => {
        const slug = params.get('slug');
        if (!slug) throw new Error('Cuso no encontrado');
        this.loading = true;
        return this.coursesService.getCourseBySlug(slug);
      })
    ).subscribe({
      next: (response: { data: Course | null, error: any }) => {
        if (response.error || !response.data) {
           // Fallback to mock data
           const currentSlug = this.route.snapshot.paramMap.get('slug') || '';
           const mockCourse = this.getMockCourseBySlug(currentSlug);
           if (mockCourse) {
               this.processCourse(mockCourse);
           } else {
               this.error = 'Curso no encontrado';
               this.loading = false;
               this.cd.detectChanges();
           }
        } else {
          this.processCourse(response.data);
        }
      },
      error: (err: any) => {
        const currentSlug = this.route.snapshot.paramMap.get('slug') || '';
        const mockCourse = this.getMockCourseBySlug(currentSlug);
        if (mockCourse) {
            this.processCourse(mockCourse);
        } else {
            this.error = 'Error al cargar el curso.';
            this.loading = false;
            this.cd.detectChanges();
        }
      }
    });
  }

  processCourse(courseData: Course) {
      // Patch image URL if it matches the broken one from DB
      if (courseData && courseData.image_url && courseData.image_url.includes('curso-reparacion-de-celulares.jpg')) {
          courseData.image_url = 'assets/img/cursos/academy/curso-reparacion-de-celulares.jpg';
      }
      
      // HARDCODED CONTENT OVERRIDES (User Request)
      if (courseData && courseData.slug === 'reparacion-celulares-basico') {
          courseData.schedule = 'Lunes y Miércoles 18:00-21:00'; 
      }

      this.course = courseData;
      
      // Update dynamic arrays based on course
      this.audienceList = this.isCelularCourse ? [
          'No tenés experiencia pero querés una salida laboral rápida.',
          'Ya reparás celulares pero querés subir de nivel.',
          'Querés trabajar desde tu casa o armar tu propio taller.',
          'Buscás independizarte y tener horarios flexibles.',
          'Querés un trabajo rentable sin depender de terceros.'
      ] : [
          'Buscás una salida laboral rápida y rentable.',
          'Querés emprender tu propio negocio.',
          'Buscás independizarte y tener horarios flexibles.',
          'Te apasiona la temática del curso y querés profesionalizarte.'
      ];

      this.benefitsList = this.isCelularCourse ? [
          { icon: 'fas fa-microscope', text: 'Laboratorio real equipado con microscopios y estaciones.' },
          { icon: 'fas fa-hands-on', text: 'Clases 100% prácticas desde el día 1.' },
          { icon: 'fas fa-user-tie', text: 'Instructor con experiencia real en taller.' },
          { icon: 'fas fa-certificate', text: 'Certificado con validez y matrícula.' },
          { icon: 'fas fa-users', text: 'Bolsa de trabajo y comunidad de alumnos.' },
          { icon: 'fas fa-video', text: 'Acceso a Aula Virtual con material premium.' }
      ] : [
          { icon: 'fas fa-hands-on', text: 'Clases 100% prácticas y dinámicas.' },
          { icon: 'fas fa-user-tie', text: 'Instructores expertos y capacitados.' },
          { icon: 'fas fa-certificate', text: 'Certificado oficial con validez.' },
          { icon: 'fas fa-users', text: 'Bolsa de trabajo y comunidad activa.' },
          { icon: 'fas fa-video', text: 'Acceso a material exclusivo y clases grabadas.' }
      ];

      this.syllabusTimeline = this.isCelularCourse ? [
          { week: 'Semana 1', title: 'Fundamentos y Desarme', desc: 'Conceptos, herramientas, seguridad y desarme de equipos.' },
          { week: 'Semana 2', title: 'Diagnóstico Inicial', desc: 'Manejo de multímetro, fuentes y detección de fallas comunes.' },
          { week: 'Semana 3', title: 'Reparaciones Modulares', desc: 'Cambio de pantallas, baterías, cámaras y periféricos.' },
          { week: 'Semana 4', title: 'Electrónica Aplicada', desc: 'Medición de componentes, cortos y fugas en placa.' },
          { week: 'Semana 5', title: 'Microsoldadura I', desc: 'Pin de carga, botones, micrófonos y técnica de soldado.' },
          { week: 'Semana 6', title: 'Software', desc: 'Flasheo, desbloqueo, cuentas Google y sistemas operativos.' },
          { week: 'Semana 7', title: 'Práctica Real', desc: 'Trabajos con equipos reales traídos por los alumnos.' },
          { week: 'Semana 8', title: 'Examen Final', desc: 'Evaluación teórica-práctica y entrega de certificados.' }
      ] : [];

      this.roiExamples = this.isCelularCourse ? [
          { job: 'Cambio de Módulo', range: '$15.000 – $40.000', earning: true },
          { job: 'Cambio de Batería', range: '$8.000 – $20.000', earning: true },
          { job: 'Cambio de Pin de Carga', range: '$10.000 – $30.000', earning: true },
          { job: 'Limpieza de Software/Flasheo', range: '$5.000 – $15.000', earning: true }
      ] : [];

      if (!this.isCelularCourse) {
          this.pressLinks = [];
          this.galleryImages = [
              this.course.image_url || 'assets/img/cursos/academy/cursos.jpeg'
          ];
      }

      this.inclusions = [
          { icon: 'fas fa-laptop', text: 'Aula Virtual 24/7' },
          { icon: 'fas fa-file-pdf', text: 'Material PDF' },
          { icon: 'fas fa-video', text: 'Clases Grabadas' },
          { icon: 'fas fa-certificate', text: 'Certificado Oficial' },
          { icon: 'fas fa-users', text: 'Comunidad VIP' },
          { icon: 'fas fa-briefcase', text: 'Bolsa de Trabajo' }
      ];

      this.faqs = [
          { question: '¿Necesito experiencia previa?', answer: 'No, el curso inicia desde cero absoluto. Te guiamos paso a paso.' },
          { question: '¿Qué herramientas necesito?', answer: 'Durante la cursada proveemos todo lo necesario en clase. Solo necesitas ganas de aprender.' },
          { question: '¿Realmente voy a poder trabajar de esto después?', answer: 'Sí. El enfoque es 100% práctico para que salgas con la confianza de trabajar de forma autónoma.' },
          { question: '¿Entregan certificado?', answer: 'Sí, entregamos certificado de asistencia y aprobación al finalizar el curso.' },
          { question: '¿Puedo pagar en cuotas?', answer: 'Sí, aceptamos todas las tarjetas y ofrecemos financiación propia.' }
      ];

      if (this.course) this.setSEO(this.course);
      this.loadModules(this.course!.id);
      this.loading = false;
      this.cd.detectChanges();
  }

  getMockCourseBySlug(slug: string): Course | null {
      const mocks: Course[] = [
          {
              id: '11111111-1111-1111-1111-111111111111',
              title: 'Técnico en Reparación de Celulares',
              slug: 'reparacion-celulares-basico',
              description: 'Dominá el hardware y software de smartphones. Diagnóstico, cambio de módulos, baterías, pines de carga y solución de fallas comunes.',
              duration: '4 Meses',
              schedule: 'Sábados 10:00 - 13:00hs',
              price: 45000,
              image_url: 'assets/img/cursos/pro.webp',
              level: CourseLevel.INTERMEDIATE,
              students: 230,
              rating: 4.9,
              status: 'published',
              is_active: true
          },
          {
              id: '22222222-2222-2222-2222-222222222222',
              title: 'Microelectrónica Aplicada',
              slug: 'curso-avanzado-microelectronica',
              description: 'Especialización avanzada. Lectura de esquemáticos, soldadura microscópica, reballing y reparación de placas base (iPhone/Android).',
              duration: '3 Meses',
              schedule: 'Miércoles 18:00 - 21:00hs',
              price: 65000,
              image_url: 'assets/img/cursos/laboratorio.jpg',
              level: CourseLevel.ADVANCED,
              students: 85,
              rating: 5.0,
              status: 'published',
              is_active: true
          },
          {
              id: '33333333-3333-3333-3333-333333333333',
              title: 'Reparación de Notebooks y PC',
              slug: 'reparacion-pc',
              description: 'Aprendé a diagnosticar, reparar y optimizar computadoras. Hardware, instalación de sistemas, mantenimiento térmico y upgrades.',
              duration: '4 Meses',
              schedule: 'Martes 19:00 - 21:00hs',
              price: 42000,
              image_url: 'assets/img/cursos/pc-repair.jpg',
              level: CourseLevel.BASIC,
              students: 60,
              rating: 4.8,
              status: 'published',
              is_active: true
          }
      ];
      return mocks.find(m => m.slug === slug) || null;
  }

  loadModules(courseId: string) {
      // Avoid querying DB for mock courses to prevent RLS errors
      const mockIds = [
          '11111111-1111-1111-1111-111111111111', 
          '22222222-2222-2222-2222-222222222222', 
          '33333333-3333-3333-3333-333333333333'
      ];
      if (mockIds.includes(courseId)) {
          this.modules = [];
          return;
      }

      this.loadingModules = true;
      this.coursesService.getModulesByCourseId(courseId).subscribe({
          next: (res: { data: Module[], error: any }) => {
              this.modules = res.data || [];
              this.loadingModules = false;
              this.cd.detectChanges();
          },
          error: (err: any) => {
              this.loadingModules = false;
              this.cd.detectChanges();
          }
      });
  }

  /*
  loadModules(courseId: string) {
      this.loadingModules = true;
      this.coursesService.getModulesByCourseId(courseId).subscribe({
          next: (res) => {
              this.modules = res.data || [];
              this.loadingModules = false;
          },
          error: (err) => {
              // Suppress error to avoid console noise for missing table
              // console.error('Error loading modules:', err);
              this.loadingModules = false;
          }
      });
  }
  */

  openRegistration() {
    this.showRegistrationModal = true;
    this.registrationSuccess = false;
    this.registrationError = null;
    this.registrationForm = { full_name: '', email: '', phone: '' };
  }

  closeRegistration() {
    this.showRegistrationModal = false;
  }

  async submitRegistration() {
      if (!this.course || !this.registrationForm.full_name || !this.registrationForm.email || !this.registrationForm.phone) {
          this.registrationError = 'Por favor completa todos los campos.';
          return;
      }

      this.registering = true;
      this.registrationError = null;
      this.cd.detectChanges(); // Force update to show loading state

      try {
          const response = await this.coursesService.registerStudent({
                course_id: this.course.id,
                course_title: this.course.title,
                ...this.registrationForm
          });
          
          if (response.error) {
              this.registrationError = 'Error al registrarse. Intenta nuevamente.';
              console.error('Registration failed:', response.error);
          } else {
              this.registrationSuccess = true;
          }
      } catch (err) {
          console.error('Registration unexpected error:', err);
          this.registrationError = 'Error de conexión/inesperado.';
      } finally {
          this.registering = false;
          this.cd.detectChanges(); // Force update to hide loading state
      }
  }

  private setSEO(course: Course) {
    const description = course.description || `Convertite en profesional con nuestro curso de ${course.title} en Arecofix Academy.`;
    const imageUrl = course.image_url || 'assets/img/branding/og-academy.jpg';

    this.seoService.setPageData({
      title: `${course.title} | Arecofix Academy`,
      description: description,
      imageUrl: imageUrl,
      type: 'article'
    });
  }
}
