import { Component, OnInit, computed, signal, inject } from '@angular/core';
import { SeoService } from '@app/shared/services/seo.service';
// Trigger rebuild
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CoursesService, Course } from '@app/core/services/courses.service';
import { timeout, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { rxResource } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs';
import { IsEmptyComponent, IsErrorComponent, IsLoadingComponent } from '@app/shared/components/resource-status';
import { CategoryService } from '@app/public/categories/services';
import { ProductService } from '@app/public/products/services';
import { ProductCard } from '@app/public/products/components';
import { Pagination, PaginationService, iPagination } from '@app/shared/components/pagination';
import { iCategoriesResponse } from '@app/public/categories/interfaces';
import { ProductsResponse } from '@app/public/products/interfaces';
import { environment } from '../../../environments/environment';

@Component({
    selector: 'app-cursos',
    standalone: true,
    imports: [CommonModule, RouterModule, IsEmptyComponent, IsErrorComponent, IsLoadingComponent, ProductCard, Pagination, FormsModule],
    templateUrl: './cursos.html',
    styleUrls: ['./cursos.scss']
})
export class CursosComponent implements OnInit {
    whatsappNumber = environment.contact.whatsappNumber;
    courses: Course[] = [];
    loading = true;
    error: string | null = null;

    // Sorting signals
    sort = signal('created_at');
    order = signal<'asc' | 'desc'>('desc');

    benefits = [
        { icon: 'fa-certificate', title: 'Certificación Oficial', description: 'Título avalado por el municipio' },
        { icon: 'fa-tools', title: 'Equipamiento Profesional', description: 'Acceso a herramientas de última generación' },
        { icon: 'fa-users', title: 'Clases Reducidas', description: 'Máximo 15 alumnos por curso' },
        { icon: 'fa-briefcase', title: 'Salida Laboral', description: 'Bolsa de trabajo y prácticas profesionales' }
    ];

    private seoService = inject(SeoService);

    constructor(private coursesService: CoursesService, private route: ActivatedRoute, private categoryService: CategoryService, private productService: ProductService, public paginationService: PaginationService) { }

    ngOnInit() {
        this.setSEO();
        this.loadCourses();
    }

    setSEO() {
        this.seoService.setSeoData({
            title: 'Cursos de Reparación y Oficios | Arecofix Academy',
            description: 'Capacítate con los mejores. Cursos prácticos de reparación de celulares, electrónica y más en Marcos Paz. Salida laboral inmediata.',
            keywords: 'cursos reparacion celulares, curso oficios, marcos paz, arecofix academy, capacitacion tecnica, salida laboral',
            ogTitle: 'Arecofix Academy | Cursos Profesionales',
            ogDescription: 'Tu futuro técnico empieza acá. Inscríbete en nuestros cursos presenciales.',
            ogImage: 'assets/img/branding/og-courses.jpg',
            ogUrl: 'https://arecofix.com/#/academy'
        });
    }

    loadCourses() {
        this.loading = true;
        // Remove ordering by created_at as it might be causing issues if the column is missing or unindexed
        this.coursesService.getCourses().pipe(
            timeout(5000), // Timeout after 5 seconds
            catchError((err: any) => {
                console.error('Timeout or error fetching courses:', err);
                return of({ error: err, data: null });
            })
        ).subscribe({
            next: (response: { data: Course[] | null, error: any }) => {
                if (response.error) {
                    console.error('Error fetching courses:', response.error);
                    // Don't show error to user immediately, try fallback
                    this.courses = this.getMockCourses();
                } else {
                    this.courses = response.data || [];
                    // Add mock data for fields not yet in DB or if DB is empty for demo
                    if (this.courses.length === 0) {
                        this.courses = this.getMockCourses(); // Fallback to mock if DB is empty
                    } else {
                        // Map optional fields if missing in DB
                        this.courses = this.courses.map(c => ({
                            ...c,
                            rating: c.rating || 4.8,
                            students: c.students || 0,
                            duration: c.duration || '4 Meses',
                            schedule: c.schedule || 'Sábados 10 a 13hs',
                            image_url: (c.image_url && c.image_url.includes('curso-reparacion-de-celulares.jpg'))
                                ? 'assets/img/cursos/academy/curso-reparacion-de-celulares.jpg' 
                                : c.image_url
                        }));
                    }
                }
                this.loading = false;
            },
            error: (err: any) => {
                console.error('Unexpected error:', err);
                this.error = 'Error de conexión.';
                this.loading = false;
                this.courses = this.getMockCourses(); // Fallback
            }
        });
    }

    getMockCourses() {
        return [
            {
                id: '1',
                title: 'Curso Inicial - Nivel Principiante',
                slug: 'curso-inicial-reparacion',
                description: 'Aprende los fundamentos de la reparación de smartphones. Incluye diagnóstico, cambio de pantallas y baterías.',
                duration: '3 Meses',
                schedule: 'Sábados 10hs',
                price: 45000,
                image_url: 'assets/img/cursos/alumno3.jpg',
                level: 'Principiante',
                students: 120,
                rating: 4.8
            },
            {
                id: '2',
                title: 'Curso Avanzado - Microelectrónica',
                slug: 'curso-avanzado-microelectronica',
                description: 'Especialización en diagnóstico de placas, soldadura de precisión y esquemáticos.',
                duration: '4 Meses',
                schedule: 'Miércoles 18hs',
                price: 65000,
                image_url: 'assets/img/cursos/alumno2.jpg',
                level: 'Avanzado',
                students: 85,
                rating: 4.9
            },
            {
                id: '3',
                title: 'Curso de Electricidad Domiciliaria',
                slug: 'curso-electricidad',
                description: 'Aprende a realizar instalaciones, reparaciones y mantenimiento eléctrico en hogares y comercios desde cero.',
                duration: '5 Meses',
                schedule: 'Martes y Jueves 19hs',
                price: 40000,
                image_url: 'assets/img/cursos/electricity.jpg',
                level: 'Principiante',
                students: 40,
                rating: 4.7
            }
        ];
    }

    // Productos vinculados a la categoría "cursos"
    productsRs = rxResource({
        stream: () => this.categoryService.getDataBySlug('cursos').pipe(
            switchMap((category: iCategoriesResponse) => this.productService.getData({
                category_id: category.data?.[0]?.id,
                _page: this.paginationService.currentPage() || 1,
                _sort: this.sort(),
                _order: this.order()
            }))
        )
    });

    // Registration Form
    showRegistrationModal = false;
    selectedCourse: Course | null = null;
    registrationForm = {
        full_name: '',
        email: '',
        phone: ''
    };
    registering = false;
    registrationSuccess = false;
    registrationError: string | null = null;

    // Modules
    expandedCourseId: string | null = null;
    courseModules: { [key: string]: any[] } = {};
    loadingModules: { [key: string]: boolean } = {};

    toggleModules(courseId: string) {
        if (this.expandedCourseId === courseId) {
            this.expandedCourseId = null;
            return;
        }

        this.expandedCourseId = courseId;
        if (!this.courseModules[courseId]) {
            this.loadingModules[courseId] = true;
            this.coursesService.getModulesByCourseId(courseId).subscribe({
                next: (response: { data: any[], error: any }) => {
                    this.courseModules[courseId] = response.data || [];
                    this.loadingModules[courseId] = false;
                },
                error: (err: any) => {
                    console.error('Error loading modules:', err);
                    this.loadingModules[courseId] = false;
                }
            });
        }
    }

    openRegistration(course: Course) {
        this.selectedCourse = course;
        this.showRegistrationModal = true;
        this.registrationSuccess = false;
        this.registrationError = null;
        this.registrationForm = { full_name: '', email: '', phone: '' };
    }

    closeRegistration() {
        this.showRegistrationModal = false;
        this.selectedCourse = null;
    }

    submitRegistration() {
        if (!this.selectedCourse || !this.registrationForm.full_name || !this.registrationForm.email || !this.registrationForm.phone) {
            this.registrationError = 'Por favor completa todos los campos.';
            return;
        }

        this.registering = true;
        this.registrationError = null;

        this.coursesService.registerStudent({
            course_id: this.selectedCourse.id,
            ...this.registrationForm
        }).then((response) => {
            this.registering = false;
            if (response.error) {
                this.registrationError = 'Error al registrarse. Intenta nuevamente.';
            } else {
                this.registrationSuccess = true;
                // Removed auto-close
            }
        }).catch((err) => {
            console.error('Registration error:', err);
            this.registering = false;
            this.registrationError = 'Error de conexión. Intenta nuevamente.';
        });
    }

    paginationData = computed<iPagination | null>(() => {
        const data = this.productsRs.value();
        if (!data) return null;
        const {
            first,
            prev,
            next,
            last,
            pages,
            items
        } = data as any; // Cast to any to avoid strict type checking on unknown

        return {
            first,
            prev,
            next,
            last,
            pages,
            items
        } as iPagination;
    });
}
