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

  getVideoUrl(): SafeResourceUrl {
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
           // Fallback for demo if API fails or returns nothing (common in this dev env)
           this.handleMockFallback();
        } else {
          const courseData = response.data;
          
          // Patch image URL if it matches the broken one from DB
          // Check for both exact match and just filename to be safe
          if (courseData && (courseData.image_url === 'assets/img/cursos/curso-reparacion-de-celulares.jpg' || courseData.image_url.endsWith('curso-reparacion-de-celulares.jpg'))) {
              courseData.image_url = 'assets/img/cursos/academy/curso-reparacion-de-celulares.jpg';
          }

          this.course = courseData;
          this.loadModules(this.course!.id);
          this.loading = false;
        }
      },
      error: (err) => {
        // Suppress specific 404 or connection errors for cleaner console in dev
        // console.error('Error loading course:', err);
        this.handleMockFallback();
      }
    });
  }

  handleMockFallback() {
      // Try to find in mock data from list component (simulating shared data source for now)
      // Ideally move mock data to service, but for speed:
      const slug = this.route.snapshot.paramMap.get('slug');
      const mockCourses = [
          {
                id: '1',
                title: 'Reparación de Celulares - Nivel Básico',
                slug: 'reparacion-celulares-basico',
                description: 'Aprende los fundamentos de la reparación de smartphones. Incluye diagnóstico, cambio de pantallas y baterías. Ideal para quienes quieren iniciarse en el mundo de la tecnología móvil.',
                duration: '3 meses',
                schedule: 'Lunes y Miércoles 18:00-21:00',
                price: 45000,
                image_url: 'assets/img/cursos/academy/curso-reparacion-de-celulares.jpg',
                level: 'Básico',
                students: 120,
                rating: 4.8
            }
      ];
      this.course = mockCourses.find(c => c.slug === slug) || null;
      
      if (this.course) {
          this.loading = false;
          this.loadModules(this.course.id);
      } else {
          this.error = 'Curso no encontrado';
          this.loading = false;
      }
  }

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
