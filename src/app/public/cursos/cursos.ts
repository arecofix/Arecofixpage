import { Component, OnInit, computed, signal, inject, ChangeDetectionStrategy, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { rxResource, toObservable, takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { switchMap, timeout, catchError, of, combineLatest } from 'rxjs';

import { SeoService } from '@app/core/services/seo.service';
import { CoursesService, Course } from '@app/core/services/courses.service';
import { CourseLevel } from '@app/features/courses/domain/entities/course.entity';
import { CategoryService } from '@app/public/categories/services';
import { ProductService } from '@app/public/products/services';
import { PaginationService, iPagination } from '@app/shared/components/pagination';
import { environment } from '../../../environments/environment';
import { TenantService } from '@app/core/services/tenant.service';
import { AuthService } from '@app/core/services/auth.service';

// Components
import { ProductCard } from '@app/public/products/components';
import { Pagination } from '@app/shared/components/pagination';
import { IsErrorComponent } from '@app/shared/components/resource-status';

@Component({
    selector: 'app-cursos',
    standalone: true,
    imports: [
        CommonModule, 
        RouterModule, 
        FormsModule,
        ProductCard, 
        Pagination,
        IsErrorComponent
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
    private tenantService = inject(TenantService);
    private destroyRef = inject(DestroyRef);
    public paginationService = inject(PaginationService);
    public authService = inject(AuthService);
    private tenant$ = toObservable(this.tenantService.currentTenant);

    whatsappNumber = environment.contact.whatsappNumber;
    
    // Signals for State
    courses = signal<Course[]>([]);
    isLoadingCourses = signal(true);
    coursesError = signal<string | null>(null);

    // Filter Signals
    searchQuery = signal('');
    selectedLevel = signal<string>('');
    maxPrice = signal<number | null>(null);
    sort = signal('created_at');
    order = signal<'asc' | 'desc'>('desc');

    // Registration Modal
    isRegistrationOpen = signal(false);
    selectedCourse = signal<Course | null>(null);
    registrationForm = { full_name: '', email: '', phone: '' };
    isRegistering = signal(false);
    registrationSuccess = signal(false);
    registrationError = signal<string | null>(null);

    // Hero Slider State
    currentSlide = signal(0);
    featuredSlides = computed(() => {
        const courses = this.courses();
        if (courses.length === 0) {
            return [{
                title: 'Arecofix Academy',
                subtitle: 'Capacitación Profesional',
                description: 'Próximamente nuevos cursos disponibles.',
                highlight: false,
                isInstitutional: true,
                link: '#cursos-list',
                theme: 'from-slate-900 via-slate-800 to-[#0f172a]'
            }];
        }
        
        // Prioritize featured courses for the slider
        const featured = courses.filter(c => c.is_featured);
        const others = courses.filter(c => !c.is_featured);
        const sliderCourses = [...featured, ...others].slice(0, 3);
        
        return sliderCourses.map((c, i) => ({
            title: c.title,
            subtitle: c.level === 'basic' ? 'Nivel Inicial' : (c.level === 'advanced' ? 'Especialización Avanzada' : 'Formación Profesional'),
            description: c.short_description || (c.description ? c.description.substring(0, 150) + '...' : ''),
            highlight: c.is_featured || i === 0,
            isInstitutional: false,
            link: `/academy/${c.slug}`,
            theme: i === 0 ? 'from-blue-900 via-slate-900 to-[#0f172a]' : (i === 1 ? 'from-emerald-900 via-slate-900 to-[#0f172a]' : 'from-purple-900 via-slate-900 to-[#0f172a]')
        }));
    });

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
        stream: () => {
            const page = this.paginationService.currentPage() || 1;
            const sort = this.sort();
            const order = this.order();

            return combineLatest([
                this.tenant$,
            ]).pipe(
                switchMap(([tenant]) => {
                    if (!tenant) return of({ data: [], meta: { total: 0 } });
                    return this.categoryService.getDataBySlug('repuestos/tools');
                }),
                switchMap(category => {
                    if (!category || !('data' in category) || !category.data?.[0]?.id) {
                        return of({ data: [], meta: { total: 0 } });
                    }
                    
                    return this.productService.getData({
                        category_id: category.data[0].id,
                        _page: page,
                        _sort: sort,
                        _order: order
                    });
                })
            );
        }
    });

    paginationData = computed<iPagination | null>(() => {
        const data = this.productsRs.value();
        if (!data || typeof data !== 'object' || !('data' in data)) return null;
        
        // Helper to safely extract pagination info
        const { data: items, ...meta } = data as { data: unknown[], [key: string]: unknown }; 
        return meta as unknown as iPagination;
    });

    ngOnInit() {
        this.setSEO();
        this.tenant$
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(tenant => {
                if (tenant) {
                    this.loadCourses();
                }
            });

        // Auto-play slider
        const intervalId = setInterval(() => {
            this.nextSlide();
        }, 5000);

        this.destroyRef.onDestroy(() => {
            clearInterval(intervalId);
        });
    }

    // Combined Filtered List
    filteredCoursesList = computed(() => {
        let list = this.courses();
        const search = this.searchQuery().toLowerCase();
        const level = this.selectedLevel();
        const price = this.maxPrice();

        if (search) {
            list = list.filter(c => 
                c.title?.toLowerCase().includes(search) || 
                c.description?.toLowerCase().includes(search) ||
                c.duration?.toLowerCase().includes(search) ||
                c.schedule?.toLowerCase().includes(search)
            );
        }

        if (level) {
            list = list.filter(c => c.level === level);
        }

        if (price !== null) {
            list = list.filter(c => (c.price || 0) <= price);
        }

        return list;
    });

    setSEO() {
        
    }

    loadCourses() {
        this.isLoadingCourses.set(true);
        this.coursesService.getCourses().pipe(
            timeout(15000),
            catchError(err => {
                console.error('API Error:', err);
                return of({ data: null, error: err });
            })
        ).subscribe({
            next: (res: { data: Course[] | null, error: unknown }) => {
                const coursesData = res.data || [];
                
                // Enhance data if needed and filter out pending/inactive
                const processedCourses = coursesData
                    .filter((c: Course) => {
                        const titleLower = (c.title || '').toLowerCase();
                        // Hide drones course completely as requested
                        if (titleLower.includes('drone')) return false;
                        return c.is_active || c.status === 'PUBLISHED';
                    })
                    .map((c: Course) => {
                        const titleLower = (c.title || '').toLowerCase();
                        
                        // User preferences for featured content
                        const isRepairCourse = titleLower.includes('reparaci') || titleLower.includes('celular');
                        const isPythonCourse = titleLower.includes('python');
                        const isEnglishCourse = titleLower.includes('ingle') || titleLower.includes('inglé');
                        
                        let shouldBeFeatured = c.is_featured;
                        
                        // Force promote
                        if (isRepairCourse || isPythonCourse || isEnglishCourse) {
                            shouldBeFeatured = true;
                        }
                        
                        return {
                            ...c,
                            rating: c.rating || 4.9,
                            students: c.students || 150,
                            duration: c.duration || 'Consultar',
                            schedule: c.schedule || 'A confirmar',
                            is_featured: shouldBeFeatured,
                            // Fix outdated image paths if any
                            image_url: this.fixImageUrl(c.image_url)
                        };
                    })
                    .sort((a, b) => {
                        // Force Cell Phone Repair course to be strictly first
                        const aIsRepair = (a.title || '').toLowerCase().includes('reparaci') || (a.title || '').toLowerCase().includes('celular');
                        const bIsRepair = (b.title || '').toLowerCase().includes('reparaci') || (b.title || '').toLowerCase().includes('celular');
                        if (aIsRepair && !bIsRepair) return -1;
                        if (!aIsRepair && bIsRepair) return 1;
                        return 0; // keep original order for others
                    });

                this.courses.set(processedCourses);
                this.isLoadingCourses.set(false);
            },
            error: () => {
                this.courses.set([]);
                this.isLoadingCourses.set(false);
            }
        });
    }

    private fixImageUrl(url?: string): string {
        if (!url) return 'assets/img/placeholder-course.jpg';
        if (url.includes('curso-reparacion-de-celulares.jpg')) return 'assets/img/cursos/academy/curso-reparacion-de-celulares.jpg';
        return url;
    }

    // getMockCourses removed

    // Modal Logic
    openRegistration(course: Course) {
        this.selectedCourse.set(course);
        this.registrationForm = { full_name: '', email: '', phone: '' };
        this.registrationSuccess.set(false);
        this.registrationError.set(null);
        this.isRegistrationOpen.set(true);
    }

    // Slider Logic
    nextSlide() {
        this.currentSlide.update(i => (i + 1) % this.featuredSlides().length);
    }

    prevSlide() {
        this.currentSlide.update(i => (i - 1 + this.featuredSlides().length) % this.featuredSlides().length);
    }

    setSlide(index: number) {
        this.currentSlide.set(index);
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
                course_title: this.selectedCourse()!.title,
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
