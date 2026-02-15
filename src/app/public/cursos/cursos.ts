import { Component, OnInit, computed, signal, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { rxResource } from '@angular/core/rxjs-interop';
import { switchMap, timeout, catchError, of } from 'rxjs';

import { SeoService } from '@app/core/services/seo.service';
import { CoursesService, Course } from '@app/core/services/courses.service';
import { CategoryService } from '@app/public/categories/services';
import { ProductService } from '@app/public/products/services';
import { PaginationService, iPagination } from '@app/shared/components/pagination';
import { environment } from '../../../environments/environment';

// Components
import { ProductCard } from '@app/public/products/components';
import { Pagination } from '@app/shared/components/pagination';
import { IsErrorComponent, IsLoadingComponent } from '@app/shared/components/resource-status';

@Component({
    selector: 'app-cursos',
    standalone: true,
    imports: [
        CommonModule, 
        RouterModule, 
        FormsModule,
        ProductCard, 
        Pagination,
        IsErrorComponent, 
        IsLoadingComponent
    ],
    templateUrl: './cursos.html',
    styles: [],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CursosComponent implements OnInit {
    private seoService = inject(SeoService);
    private coursesService = inject(CoursesService);
    private categoryService = inject(CategoryService);
    private productService = inject(ProductService);
    public paginationService = inject(PaginationService);

    whatsappNumber = environment.contact.whatsappNumber;
    
    // Signals for State
    courses = signal<Course[]>([]);
    isLoadingCourses = signal(true);
    coursesError = signal<string | null>(null);

    // Filter Signals
    sort = signal('created_at');
    order = signal<'asc' | 'desc'>('desc');

    // Registration Modal
    isRegistrationOpen = signal(false);
    selectedCourse = signal<Course | null>(null);
    registrationForm = { full_name: '', email: '', phone: '' };
    isRegistering = signal(false);
    registrationSuccess = signal(false);
    registrationError = signal<string | null>(null);

    // Static Content
    benefits = signal([
        { 
            icon: 'fas fa-certificate', 
            title: 'Certificación Oficial', 
            description: 'Recibí un diploma avalado para validar tus conocimientos.',
            color: 'text-blue-500 bg-blue-50 dark:bg-blue-900/20'
        },
        { 
            icon: 'fas fa-tools', 
            title: '100% Práctico', 
            description: 'Aprende metiendo mano desde la primera clase en nuestros laboratorios.',
            color: 'text-green-500 bg-green-50 dark:bg-green-900/20'
        },
        { 
            icon: 'fas fa-users', 
            title: 'Grupos Reducidos', 
            description: 'Atención personalizada con cupos limitados por comisión.',
            color: 'text-purple-500 bg-purple-50 dark:bg-purple-900/20'
        },
        { 
            icon: 'fas fa-briefcase', 
            title: 'Salida Laboral', 
            description: 'Bolsa de trabajo exclusiva y asesoramiento para emprender.',
            color: 'text-orange-500 bg-orange-50 dark:bg-orange-900/20'
        }
    ]);

    // Resource for Related Products (Tools/Kits)
    productsRs = rxResource({
        stream: () => this.categoryService.getDataBySlug('cursos').pipe(
            switchMap(category => {
                if (!category.data?.[0]?.id) return of({ data: [], meta: { total: 0 } });
                
                return this.productService.getData({
                    category_id: category.data[0].id,
                    _page: this.paginationService.currentPage() || 1,
                    _sort: this.sort(),
                    _order: this.order()
                });
            })
        )
    });

    paginationData = computed<iPagination | null>(() => {
        const data = this.productsRs.value();
        if (!data || !('data' in data)) return null;
        
        // Helper to safely extract pagination info
        const { data: items, ...meta } = data as any; 
        return meta as iPagination;
    });

    ngOnInit() {
        this.setSEO();
        this.loadCourses();
    }

    setSEO() {
        this.seoService.setPageData({
            title: 'Cursos de Reparación de Celulares | Arecofix Academy',
            description: 'Convertite en técnico profesional. Cursos presenciales de reparación de celulares y tablets en Marcos Paz. Certificación y salida laboral.',
            imageUrl: 'https://arecofix.com.ar/assets/img/branding/og-academy.jpg'
        });
    }

    loadCourses() {
        this.isLoadingCourses.set(true);
        this.coursesService.getCourses().pipe(
            timeout(5000),
            catchError(err => {
                console.error('API Error:', err);
                return of({ error: err, data: null });
            })
        ).subscribe({
            next: (res) => {
                const coursesData = res.data || this.getMockCourses(); // Fallback to mock
                
                // Enhance data if needed
                const processedCourses = coursesData.map(c => ({
                    ...c,
                    rating: c.rating || 4.9,
                    students: c.students || 150,
                    duration: c.duration || 'Consultar',
                    schedule: c.schedule || 'A confirmar',
                    // Fix outdated image paths if any
                    image_url: this.fixImageUrl(c.image_url)
                }));

                this.courses.set(processedCourses);
                this.isLoadingCourses.set(false);
            },
            error: () => {
                this.courses.set(this.getMockCourses());
                this.isLoadingCourses.set(false);
            }
        });
    }

    private fixImageUrl(url?: string): string {
        if (!url) return 'assets/img/placeholder-course.jpg';
        if (url.includes('curso-reparacion-de-celulares.jpg')) return 'assets/img/cursos/academy/curso-reparacion-de-celulares.jpg';
        return url;
    }

    getMockCourses(): Course[] {
        return [
            {
                id: '1',
                title: 'Técnico en Reparación de Celulares',
                slug: 'reparacion-celulares-basico',
                description: 'Dominá el hardware y software de smartphones. Diagnóstico, cambio de módulos, baterías, pines de carga y solución de fallas comunes.',
                duration: '4 Meses',
                schedule: 'Sábados 10:00 - 13:00hs',
                price: 45000,
                image_url: 'assets/img/cursos/pro.webp',
                level: 'Inicial / Intermedio',
                students: 230,
                rating: 4.9
            },
            {
                id: '2',
                title: 'Microelectrónica Aplicada',
                slug: 'curso-avanzado-microelectronica',
                description: 'Especialización avanzada. Lectura de esquemáticos, soldadura microscópica, reballing y reparación de placas base (iPhone/Android).',
                duration: '3 Meses',
                schedule: 'Miércoles 18:00 - 21:00hs',
                price: 65000,
                image_url: 'assets/img/cursos/laboratorio.jpg',
                level: 'Avanzado',
                students: 85,
                rating: 5.0
            },
            {
                id: '3',
                title: 'Reparación de Notebooks y PC',
                slug: 'reparacion-pc',
                description: 'Aprendé a diagnosticar, reparar y optimizar computadoras. Hardware, instalación de sistemas, mantenimiento térmico y upgrades.',
                duration: '4 Meses',
                schedule: 'Martes 19:00 - 21:00hs',
                price: 42000,
                image_url: 'assets/img/cursos/pc-repair.jpg', // Ensure this asset exists or use a generic one
                level: 'Principiante',
                students: 60,
                rating: 4.8
            }
        ];
    }

    // Modal Logic
    openRegistration(course: Course) {
        this.selectedCourse.set(course);
        this.registrationForm = { full_name: '', email: '', phone: '' };
        this.registrationSuccess.set(false);
        this.registrationError.set(null);
        this.isRegistrationOpen.set(true);
    }

    closeRegistration() {
        this.isRegistrationOpen.set(false);
        this.selectedCourse.set(null);
    }

    async submitRegistration() {
        const form = this.registrationForm;
        if (!form.full_name || !form.email || !form.phone) {
            this.registrationError.set('Por favor completá todos los campos.');
            return;
        }

        this.isRegistering.set(true);
        this.registrationError.set(null);

        try {
            const response = await this.coursesService.registerStudent({
                course_id: this.selectedCourse()!.id,
                ...form
            });

            if (response.error) throw new Error(response.error);
            
            this.registrationSuccess.set(true);
        } catch (err) {
            console.error(err);
            this.registrationError.set('Hubo un error al procesar tu inscripción. Intenta nuevamente.');
        } finally {
            this.isRegistering.set(false);
        }
    }
}
