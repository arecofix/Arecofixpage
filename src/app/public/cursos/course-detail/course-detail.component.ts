import { Component, OnInit, ChangeDetectorRef, inject, ViewEncapsulation } from '@angular/core';
import { PendingTasks } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SeoService } from '@app/core/services/seo.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CoursesService, Course, Module, CourseModuleContent } from '@app/core/services/courses.service';
import { AuthService } from '@app/core/services/auth.service';
import { switchMap } from 'rxjs/operators';
import { IsLoadingComponent, IsErrorComponent } from '@app/shared/components/resource-status';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../../environments/environment';
import { firstValueFrom } from 'rxjs';

export interface ModuleWithContents extends Module {
  contents: CourseModuleContent[];
  expanded: boolean;
}

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
  private seoService = inject(SeoService);
  public authService = inject(AuthService);
  private pendingTasks = inject(PendingTasks, { optional: true });

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
  activeTab = 'info';

  // Modules with contents from DB
  modules: ModuleWithContents[] = [];
  loadingModules = false;

  // Static gallery images (facility photos - always shown)
  galleryImages = [
    'assets/img/cursos/academy/aprender.jpeg',
    'assets/img/cursos/academy/capacitaciones.jpeg',
    'assets/img/cursos/academy/cic.jpeg',
    'assets/img/cursos/academy/profe_de_reparacion-de-celulares.jpeg',
    'assets/img/cursos/academy/eddis_educativa.jpeg',
    'assets/img/cursos/academy/salida_laboral_propia.jpeg',
    'assets/img/cursos/academy/diploma.jpeg',
    'assets/img/cursos/academy/cursos.jpeg'
  ];

  pressLinks = [
    {
      title: 'Jovenes del programa Envion finalizaron el curso',
      source: 'Municipio de Marcos Paz',
      url: 'https://www.marcospaz-gob-ar.marcospaz.net/noticias/item/8551-j%C3%B3venes-del-programa-envi%C3%B3n-finalizaron-el-curso-de-reparaci%C3%B3n-de-celulares.html',
      image: 'assets/img/cursos/municipio.jpg',
      date: 'Reciente'
    },
    {
      title: 'Alumnos de Envion se capacitan en reparacion',
      source: 'A1 Noticias',
      url: 'https://a1noticias.com.ar/nota/9798/marcos-paz-jovenes-del-programa-envion-finalizaron-el-curso-de-reparacion-de-celulares',
      image: 'assets/img/cursos/academy/diploma.jpeg',
      date: 'Reciente'
    }
  ];

  // Derived from real course data
  rating = 5.0;
  reviewsCount = 120;
  publishDate = '';
  classesCount = 0;
  hoursContent = 0;
  hoursPractice = 0;
  hoursPerWeek = 'A tu ritmo';
  audienceList: string[] = [];

  // Instructor profile (from DB)
  instructorProfile = {
    name: '',
    role: '',
    bio: '',
    avatar: ''
  };

  isAuthor = false;

  // Static reviews (no reviews table yet)
  courseReviews = [
    { name: 'Juan Carlos', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=JuanCarlos', rating: 5, date: 'Hace 2 semanas', comment: 'Excelente contenido y explicacion del docente. El profesor es muy claro, se siente como si lo llevara de la mano.' },
    { name: 'Maria Gomez', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=MariaGomez', rating: 5, date: 'Hace 1 mes', comment: 'Lo mejor fue lo claro y preciso en los conceptos. 100% recomendado para entrar al mercado laboral.' },
    { name: 'Carlos Ruiz', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=CarlosRuiz', rating: 4, date: 'Hace 2 meses', comment: 'Muy buen nivel tecnico. Pude aplicar los conocimientos de inmediato. Excelente calidad.' }
  ];

  newCommentText = '';
  newCommentRating = 5;

  isInstructor(): boolean {
    const profile = this.authService.getCurrentProfile();
    if (!profile) return false;
    return ['admin', 'super_admin', 'instructor'].includes(profile.role || '');
  }

  ngOnInit() {
    let releaseTask: (() => void) | null = null;
    if (this.pendingTasks) releaseTask = this.pendingTasks.add();

    this.route.paramMap.pipe(
      switchMap(params => {
        const slug = params.get('slug');
        if (!slug) throw new Error('Curso no encontrado');
        this.loading = true;
        this.error = null;
        this.modules = [];
        return this.coursesService.getCourseBySlug(slug);
      })
    ).subscribe({
      next: async (response: { data: Course | null; error: unknown }) => {
        if (response.error || !response.data) {
          this.error = 'Curso no encontrado';
          this.loading = false;
          this.cd.detectChanges();
        } else {
          await this.processCourse(response.data);
        }
        if (releaseTask) releaseTask();
      },
      error: (err: unknown) => {
        this.error = 'Error al cargar el curso.';
        this.loading = false;
        this.cd.detectChanges();
        if (releaseTask) releaseTask();
      }
    });
  }

  async processCourse(courseData: Course) {
    this.course = courseData;
    const profile = this.authService.getCurrentProfile();
    this.isAuthor = !!profile && profile.id === this.course.author_id;

    // Stats from real DB fields
    this.rating = this.course.rating ?? 5.0;
    this.reviewsCount = this.course.reviews_count ?? 120;
    this.classesCount = this.course.classes_count ?? 0;
    this.hoursContent = this.course.hours_content ?? 0;
    this.hoursPractice = this.course.hours_practice ?? 0;
    this.hoursPerWeek = this.course.hours_per_week ?? 'A tu ritmo';
    this.publishDate = this.course.created_at
      ? new Date(this.course.created_at).toLocaleDateString('es-AR', { year: 'numeric', month: 'long', day: 'numeric' })
      : 'Recientemente actualizado';

    // Instructor profile — all from DB, no fallback images from keyword
    this.instructorProfile = {
      name: this.course.instructor_name || 'Instructor',
      role: this.course.instructor_role || 'Especialista',
      bio: this.course.instructor_bio || 'Profesional con amplia experiencia en la materia.',
      avatar: this.course.instructor_avatar || 'assets/img/cursos/academy/profe_de_reparacion-de-celulares.jpeg'
    };

    // Audience from DB
    this.audienceList = Array.isArray(this.course.audience_list) && this.course.audience_list.length > 0
      ? this.course.audience_list
      : ['Queres aprender una nueva habilidad desde cero.', 'Buscas una salida laboral rapida y rentable.', 'Deseas emprender tu propio negocio.'];

    if (this.course) this.setSEO(this.course);
    await this.loadModulesWithContents(this.course!.id);
    this.loading = false;
    this.cd.detectChanges();
  }

  async loadModulesWithContents(courseId: string) {
    this.loadingModules = true;
    try {
      const modulesRes = await firstValueFrom(this.coursesService.getModulesByCourseId(courseId));
      const rawModules = modulesRes.data || [];

      const withContents: ModuleWithContents[] = await Promise.all(
        rawModules.map(async (mod: Module) => {
          const contentsRes = await firstValueFrom(this.coursesService.getModuleContents(mod.id));
          return {
            ...mod,
            contents: contentsRes.data || [],
            expanded: true
          } as ModuleWithContents;
        })
      );
      this.modules = withContents;
    } catch (e) {
      this.modules = [];
    } finally {
      this.loadingModules = false;
      this.cd.detectChanges();
    }
  }

  toggleModule(mod: ModuleWithContents) {
    mod.expanded = !mod.expanded;
  }

  getContentIcon(type: string): string {
    const icons: Record<string, string> = {
      video: 'fa-play-circle text-blue-500',
      image: 'fa-image text-green-500',
      document: 'fa-file-pdf text-red-500',
      link: 'fa-link text-purple-500',
      exam: 'fa-clipboard-check text-orange-500',
      text: 'fa-align-left text-gray-400'
    };
    return icons[type] || 'fa-file text-gray-400';
  }

  getContentLabel(type: string): string {
    const labels: Record<string, string> = {
      video: 'Video',
      image: 'Imagen',
      document: 'PDF',
      link: 'Enlace',
      exam: 'Examen',
      text: 'Texto'
    };
    return labels[type] || 'Recurso';
  }

  submitComment() {
    if (!this.newCommentText.trim()) return;
    const profile = this.authService.getCurrentProfile();
    const name = profile?.full_name || profile?.display_name || profile?.first_name || profile?.email || 'Estudiante';
    const avatar = profile?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${name.replace(/\s+/g, '')}`;
    this.courseReviews.unshift({
      name, avatar, rating: this.newCommentRating, date: 'Hace un momento', comment: this.newCommentText
    });
    this.newCommentText = '';
    this.newCommentRating = 5;
    this.cd.detectChanges();
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
    this.cd.detectChanges();
    try {
      const response = await this.coursesService.registerStudent({
        course_id: this.course.id,
        course_title: this.course.title,
        ...this.registrationForm
      });
      if (response.error) {
        this.registrationError = 'Error al registrarse. Intenta nuevamente.';
      } else {
        this.registrationSuccess = true;
      }
    } catch (err) {
      this.registrationError = 'Error de conexion inesperado.';
    } finally {
      this.registering = false;
      this.cd.detectChanges();
    }
  }

  private setSEO(course: Course) {
    this.seoService.setPageData({
      title: `${course.title} | Arecofix Academy`,
      description: course.description || `Convertite en profesional con nuestro curso de ${course.title} en Arecofix Academy.`,
      imageUrl: course.image_url || 'assets/img/branding/og-academy.jpg',
      type: 'article'
    });
  }
}
