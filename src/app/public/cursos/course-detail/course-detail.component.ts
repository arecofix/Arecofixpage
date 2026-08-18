import { Component, OnInit, ChangeDetectorRef, inject, PLATFORM_ID, ViewEncapsulation } from '@angular/core';
import { PendingTasks } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SeoService } from '@app/core/services/seo.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CoursesService, Course, Module } from '@app/core/services/courses.service';
import { AuthService } from '@app/core/services/auth.service';
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
  public authService = inject(AuthService);

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
  benefitsList: string[] = [];
  faqs: { question: string; answer: string }[] = [];
  
  // Dynamic Platzi-like Data
  rating: number = 4.8;
  reviewsCount: number = 371;
  publishDate: string = '23 de mayo de 2025';
  classesCount: number = 24;
  hoursContent: number = 2;
  hoursPractice: number = 12;
  hoursPerWeek: string = 'A tu ritmo';
  courseModules: { title: string; lessons: { name: string; duration: string }[] }[] = [];
  courseReviews: { name: string; avatar: string; rating: number; date: string; comment: string }[] = [];
  instructorProfile = {
      name: 'Instructor a designar',
      role: 'Experto en la materia',
      bio: 'Profesional con más de 10 años de experiencia en la industria, compartiendo su conocimiento práctico y aplicado.',
      avatar: 'assets/img/cursos/academy/profe_de_reparacion-de-celulares.jpeg'
  };
  
  isAuthor = false;
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

  isInstructor(): boolean {
      const profile = this.authService.getCurrentProfile();
      if (!profile) return false;
      return ['admin', 'super_admin', 'instructor'].includes(profile.role || '');
  }

  getVideoUrl() {
      // YouTube embed with start time 45s
      return this.sanitizer.bypassSecurityTrustResourceUrl('https://www.youtube.com/embed/l93eYkGMxsI?start=45');
  }

  private pendingTasks = inject(PendingTasks, { optional: true });

  ngOnInit() {
    let releaseTask: (() => void) | null = null;
    if (this.pendingTasks) {
      releaseTask = this.pendingTasks.add();
    }

    this.route.paramMap.pipe(
      switchMap(params => {
        const slug = params.get('slug');
        if (!slug) throw new Error('Cuso no encontrado');
        this.loading = true;
        return this.coursesService.getCourseBySlug(slug);
      })
    ).subscribe({
      next: (response: { data: Course | null, error: unknown }) => {
        if (response.error || !response.data) {
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
        if (releaseTask) releaseTask();
      },
      error: (err: unknown) => {
        const currentSlug = this.route.snapshot.paramMap.get('slug') || '';
        const mockCourse = this.getMockCourseBySlug(currentSlug);
        if (mockCourse) {
            this.processCourse(mockCourse);
        } else {
            this.error = 'Error al cargar el curso.';
            this.loading = false;
            this.cd.detectChanges();
        }
        if (releaseTask) releaseTask();
      }
    });
  }

  processCourse(courseData: Course) {
      this.course = courseData;
      
      const title = this.course.title || '';
      const t = title.toLowerCase();

      // Pseudo-random but consistent stats based on title length
      const seededRandom = (seed: string) => {
          let x = 0;
          for (let i = 0; i < seed.length; i++) x += seed.charCodeAt(i);
          return Math.abs((Math.sin(x) * 10000) - Math.floor(Math.sin(x) * 10000));
      };
      
      const profile = this.authService.getCurrentProfile();
      this.isAuthor = !!profile && profile.id === this.course.author_id;

      this.rating = this.course.rating || 5.0;
      this.reviewsCount = this.course.reviews_count || 120;
      this.classesCount = this.course.classes_count || 12;
      this.hoursContent = this.course.hours_content || 10;
      this.hoursPractice = this.course.hours_practice || 20;
      this.hoursPerWeek = this.course.hours_per_week || 'A tu ritmo';
      this.publishDate = this.course.created_at ? new Date(this.course.created_at).toLocaleDateString('es-AR', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Recientemente actualizado';

      // Instructor
      this.instructorProfile = {
          name: this.course.instructor_name || 'Profesor Especializado',
          role: this.course.instructor_role || 'Experto en la materia',
          bio: this.course.instructor_bio || 'Profesional destacado con amplia trayectoria enseñando metodologías prácticas aplicadas al mercado laboral actual.',
          avatar: this.course.instructor_avatar || this.course.image_url || 'assets/img/branding/og-academy.jpg'
      };
      
      // Audience
      if (this.course.audience_list && Array.isArray(this.course.audience_list) && this.course.audience_list.length > 0) {
          this.audienceList = this.course.audience_list;
      } else {
          // Fallbacks for older courses without audience set
          if (t.includes('celular') || t.includes('microelectr')) {
              this.audienceList = [
                  'Querés aprender desde cero sin conocimientos previos.',
                  'Ya reparás celulares pero querés subir de nivel.',
                  'Buscás alta rentabilidad (Cambio de Módulo, Pines, etc.).',
                  'Querés practicar en un laboratorio real equipado con microscopios y estaciones.'
              ];
          } else if (t.includes('barber') || t.includes('corte')) {
              this.audienceList = [
                  'Buscás una salida laboral rápida y rentable.',
                  'Querés emprender tu propio negocio.',
                  'Te gusta la estética y el cuidado personal.'
              ];
          } else {
              this.audienceList = [
                  'Querés especializarte y mejorar tus ingresos.',
                  'Buscás una salida laboral con alta demanda.',
                  'Deseas aprender con clases 100% prácticas.'
              ];
          }
      }

      // Modules (Syllabus)
      if (t.includes('angular') || t.includes('programación') || t.includes('software') || t.includes('web')) {
          this.courseModules = [
              { title: 'Contexto e Introducción', lessons: [{ name: 'Fundamentos de la tecnología', duration: '05:30 min' }, { name: 'Configuración del entorno', duration: '10:15 min' }, { name: 'Arquitectura base', duration: '08:45 min' }] },
              { title: 'Estructura y Componentes', lessons: [{ name: 'Creación de componentes', duration: '12:00 min' }, { name: 'Comunicación entre capas', duration: '15:20 min' }, { name: 'Manejo de estado', duration: '09:10 min' }] },
              { title: 'Diseño y Patrones', lessons: [{ name: 'Principios SOLID', duration: '18:40 min' }, { name: 'Patrones de diseño aplicados', duration: '14:15 min' }] },
              { title: 'Proyecto Final', lessons: [{ name: 'Construcción del proyecto', duration: '25:00 min' }, { name: 'Despliegue a producción', duration: '11:30 min' }] }
          ];
      } else if (t.includes('barber') || t.includes('corte')) {
          this.courseModules = [
              { title: 'Introducción a la Barbería', lessons: [{ name: 'Herramientas del barbero', duration: '08:00 min' }, { name: 'Higiene y seguridad', duration: '06:30 min' }] },
              { title: 'Técnicas de Corte', lessons: [{ name: 'Corte a máquina y peines', duration: '15:45 min' }, { name: 'Técnica de Fade (Degradado)', duration: '22:10 min' }] },
              { title: 'Perfilado y Barba', lessons: [{ name: 'Diseño de barba', duration: '12:20 min' }, { name: 'Uso de la navaja', duration: '10:15 min' }] },
              { title: 'Práctica Profesional', lessons: [{ name: 'Atención al cliente', duration: '07:30 min' }, { name: 'Administración de la barbería', duration: '09:00 min' }] }
          ];
      } else if (t.includes('celular') || t.includes('microelectr')) {
          this.courseModules = [
              { title: 'Fundamentos', lessons: [{ name: 'Reconocimiento de partes', duration: '10:00 min' }, { name: 'Uso del multímetro', duration: '14:20 min' }] },
              { title: 'Desarme y Ensamblaje', lessons: [{ name: 'Apertura de equipos', duration: '18:15 min' }, { name: 'Cambio de módulos (Pantallas)', duration: '25:00 min' }] },
              { title: 'Microelectrónica', lessons: [{ name: 'Soldadura SMD', duration: '20:45 min' }, { name: 'Diagnóstico de placas', duration: '30:00 min' }] },
              { title: 'Software', lessons: [{ name: 'Flasheo y sistemas operativos', duration: '15:30 min' }, { name: 'Bypass y seguridad', duration: '12:00 min' }] }
          ];
      } else {
          // Generic dynamic modules
          this.courseModules = [
              { title: 'Introducción al curso', lessons: [{ name: 'Conceptos básicos', duration: '05:00 min' }, { name: 'Preparación', duration: '07:30 min' }] },
              { title: 'Desarrollo de habilidades', lessons: [{ name: 'Técnicas fundamentales', duration: '15:00 min' }, { name: 'Aplicación práctica', duration: '20:00 min' }] },
              { title: 'Especialización', lessons: [{ name: 'Casos avanzados', duration: '18:30 min' }, { name: 'Resolución de problemas', duration: '12:15 min' }] },
              { title: 'Cierre', lessons: [{ name: 'Proyecto final', duration: '25:00 min' }, { name: 'Conclusión', duration: '05:00 min' }] }
          ];
      }

      // Reviews
      this.courseReviews = [
          { name: 'Juan Carlos', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Juan' + seededRandom(t), rating: 5, date: 'Hace 2 semanas', comment: 'Excelente contenido y explicación del docente. El profesor es muy claro en lo que enseña, literal se siente como si lo llevara a uno de la mano.' },
          { name: 'María Gómez', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maria' + seededRandom(t), rating: 5, date: 'Hace 1 mes', comment: 'Lo mejor fue lo claro y preciso en los conceptos que el profesor expresó a lo largo de este maravilloso curso. 100% recomendado para entrar al mercado laboral.' },
          { name: 'Carlos Ruíz', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos' + seededRandom(t), rating: 4, date: 'Hace 2 meses', comment: 'Muy buen nivel técnico. Pude aplicar los conocimientos de inmediato en mi trabajo. Me gustaría que dure un poco más, pero la calidad es excelente.' }
      ];

      if (this.course) this.setSEO(this.course);
      this.loadModules(this.course!.id);
      this.loading = false;
      this.cd.detectChanges();
  }

  newCommentText = '';
  newCommentRating = 5;

  submitComment() {
      if (!this.newCommentText.trim()) return;

      const profile = this.authService.getCurrentProfile();
      let name = 'Estudiante';
      if (profile) {
          name = profile.full_name || profile.display_name || profile.first_name || profile.email || 'Estudiante';
      }
      
      const avatar = profile?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${name.replace(/\s+/g, '')}`;

      this.courseReviews.unshift({
          name,
          avatar,
          rating: this.newCommentRating,
          date: 'Hace un momento',
          comment: this.newCommentText
      });

      this.newCommentText = '';
      this.newCommentRating = 5;
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
              status: 'PUBLISHED',
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
              status: 'PUBLISHED',
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
              status: 'PUBLISHED',
              is_active: true
          },
          {
              id: '44444444-4444-4444-4444-444444444444',
              title: 'Curso de Barbería Profesional',
              slug: 'curso-de-barberia',
              description: 'Convertite en barbero profesional con nuestro curso práctico. Aprendé técnicas de corte, perfilado de barba, diseño y colorimetría. ¡Salida laboral inmediata!',
              duration: '3 Meses',
              schedule: 'A confirmar',
              price: 35000,
              image_url: 'assets/img/branding/og-academy.jpg',
              level: CourseLevel.BASIC,
              students: 80,
              rating: 4.9,
              status: 'PUBLISHED',
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
          '33333333-3333-3333-3333-333333333333',
          '44444444-4444-4444-4444-444444444444'
      ];
      if (mockIds.includes(courseId)) {
          this.modules = [];
          return;
      }

      this.loadingModules = true;
      this.coursesService.getModulesByCourseId(courseId).subscribe({
          next: (res: { data: Module[], error: unknown }) => {
              this.modules = res.data || [];
              this.loadingModules = false;
              this.cd.detectChanges();
          },
          error: (err: unknown) => {
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
