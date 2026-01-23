import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CoursesService, Course, Module } from '@app/core/services/courses.service';
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
  audienceList = [
      'No tenés experiencia pero querés una salida laboral rápida.',
      'Ya reparás celulares pero querés subir de nivel.',
      'Querés trabajar desde tu casa o armar tu propio taller.',
      'Buscás independizarte y tener horarios flexibles.',
      'Querés un trabajo rentable sin depender de terceros.'
  ];

  benefitsList = [
      { icon: 'fas fa-microscope', text: 'Laboratorio real equipado con microscopios y estaciones.' },
      { icon: 'fas fa-hands-on', text: 'Clases 100% prácticas desde el día 1.' },
      { icon: 'fas fa-user-tie', text: 'Instructor con experiencia real en taller.' },
      { icon: 'fas fa-certificate', text: 'Certificado con validez y matrícula.' },
      { icon: 'fas fa-users', text: 'Bolsa de trabajo y comunidad de alumnos.' },
      { icon: 'fas fa-video', text: 'Acceso a Aula Virtual con material premium.' }
  ];

  syllabusTimeline = [
      { week: 'Semana 1', title: 'Fundamentos y Desarme', desc: 'Conceptos, herramientas, seguridad y desarme de equipos.' },
      { week: 'Semana 2', title: 'Diagnóstico Inicial', desc: 'Manejo de multímetro, fuentes y detección de fallas comunes.' },
      { week: 'Semana 3', title: 'Reparaciones Modulares', desc: 'Cambio de pantallas, baterías, cámaras y periféricos.' },
      { week: 'Semana 4', title: 'Electrónica Aplicada', desc: 'Medición de componentes, cortos y fugas en placa.' },
      { week: 'Semana 5', title: 'Microsoldadura I', desc: 'Pin de carga, botones, micrófonos y técnica de soldado.' },
      { week: 'Semana 6', title: 'Software', desc: 'Flasheo, desbloqueo, cuentas Google y sistemas operativos.' },
      { week: 'Semana 7', title: 'Práctica Real', desc: 'Trabajos con equipos reales traídos por los alumnos.' },
      { week: 'Semana 8', title: 'Examen Final', desc: 'Evaluación teórica-práctica y entrega de certificados.' }
  ];

  roiExamples = [
      { job: 'Cambio de Módulo', range: '$15.000 – $40.000', earning: true },
      { job: 'Cambio de Batería', range: '$8.000 – $20.000', earning: true },
      { job: 'Cambio de Pin de Carga', range: '$10.000 – $30.000', earning: true },
      { job: 'Limpieza de Software/Flasheo', range: '$5.000 – $15.000', earning: true }
  ];

  inclusions = [
      { icon: 'fas fa-laptop', text: 'Aula Virtual 24/7' },
      { icon: 'fas fa-file-pdf', text: 'Material PDF' },
      { icon: 'fas fa-video', text: 'Clases Grabadas' },
      { icon: 'fas fa-certificate', text: 'Certificado Oficial' },
      { icon: 'fas fa-users', text: 'Comunidad VIP' },
      { icon: 'fas fa-briefcase', text: 'Bolsa de Trabajo' }
  ];

  faqs = [
      { question: '¿Necesito experiencia previa?', answer: 'No, el curso inicia desde cero absoluto. Te guiamos paso a paso.' },
      { question: '¿Qué herramientas necesito?', answer: 'Durante la cursada proveemos todo en el taller. Solo necesitas ganas de aprender.' },
      { question: '¿Realmente voy a poder reparar después?', answer: 'Sí. El enfoque es 100% práctico para que salgas con la confianza de trabajar.' },
      { question: '¿Entregan certificado?', answer: 'Sí, entregamos certificado de asistencia y aprobación al finalizar el curso.' },
      { question: '¿Puedo pagar en cuotas?', answer: 'Sí, aceptamos todas las tarjetas y ofrecemos financiación propia.' }
  ];

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
      next: (response) => {
        if (response.error || !response.data) {
           this.error = 'Curso no encontrado';
           this.loading = false;
           this.cd.detectChanges();
        } else {
          const courseData = response.data;
          
          // Patch image URL if it matches the broken one from DB
          if (courseData && courseData.image_url && courseData.image_url.includes('curso-reparacion-de-celulares.jpg')) {
              courseData.image_url = 'assets/img/cursos/academy/curso-reparacion-de-celulares.jpg';
          }
          
          // HARDCODED CONTENT OVERRIDES (User Request)
          // Since we can't easily update the DB row from here and this is a specific request for this course:
          if (courseData && courseData.slug === 'reparacion-celulares-basico') {
              courseData.schedule = 'Lunes y Miércoles 18:00-21:00'; // Changed from 16 to 18
          }

          this.course = courseData;
          this.loadModules(this.course!.id);
          this.loading = false;
          this.cd.detectChanges();
        }
      },
      error: (err) => {
        this.error = 'Error al cargar el curso.';
        this.loading = false;
        this.cd.detectChanges();
      }
    });
  }

  loadModules(courseId: string) {
      this.loadingModules = true;
      this.coursesService.getModulesByCourseId(courseId).subscribe({
          next: (res) => {
              this.modules = res.data || [];
              this.loadingModules = false;
              this.cd.detectChanges();
          },
          error: (err) => {
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
}
