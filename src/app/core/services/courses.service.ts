import { Injectable } from '@angular/core';
import { SupabaseClient, PostgrestSingleResponse, PostgrestResponse } from '@supabase/supabase-js';
import { from, Observable, of } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { AuthService } from './auth.service';

export interface Course {
    id: string;
    title: string;
    slug: string;
    description: string;
    duration: string;
    schedule: string;
    level: string;
    price: number;
    sale_price?: number;
    image_url: string;
    instructor_name?: string;
    rating?: number;
    students?: number;
    is_active?: boolean;
    created_at?: string;
}

export interface Module {
    id: string;
    course_id: string;
    title: string;
    description: string;
    order: number;
}

@Injectable({
    providedIn: 'root'
})
export class CoursesService {
    private supabase: SupabaseClient;

    // Centralized mock courses to be Single Source of Truth until DB is fully populated
    private readonly mockCourses: Course[] = [
        {
            id: '1',
            title: 'Reparación de Celulares - Nivel Básico',
            slug: 'reparacion-celulares-basico',
            description: 'Aprende los fundamentos de la reparación de smartphones. Incluye diagnóstico, cambio de pantallas y baterías. Ideal para quienes quieren iniciarse en el mundo de la tecnología móvil.',
            duration: '3 meses',
            schedule: 'Sábados 10:00-13:00',
            price: 45000,
            image_url: 'assets/img/cursos/alumno3.jpg',
            level: 'Básico',
            students: 120,
            rating: 4.8
        },
        {
            id: '2',
            title: 'Microelectrónica Avanzada',
            slug: 'curso-avanzado-microelectronica',
            description: 'Domina la reparación de placas de iPhone y Android. Aprende reballing, esquema eléctrico, solución de fallas de encendido, carga e imagen.',
            duration: '4 meses',
            schedule: 'Miércoles 18:00-21:00',
            price: 65000,
            image_url: 'assets/img/cursos/alumno2.jpg',
            level: 'Avanzado',
            students: 85,
            rating: 4.9
        },
        {
            id: '3',
            title: 'Electricidad Domiciliaria e Industrial',
            slug: 'curso-electricidad',
            description: 'Formación completa en instalaciones eléctricas. Aprende desde cero a realizar cableados, montaje de tableros, protecciones, iluminación y detección de fallas.',
            duration: '5 meses',
            schedule: 'Martes y Jueves 19:00-21:00',
            price: 40000,
            image_url: 'assets/img/cursos/electricity.jpg',
            level: 'Principiante',
            students: 40,
            rating: 4.7
        },
        {
            id: '4',
            title: 'Aprendizaje 100% Práctico',
            slug: 'aprendizaje-practico',
            description: 'Modalidad intensiva de práctica en taller. Sin teoría, directo a la mesa de trabajo. Ideal para quienes ya tienen conocimientos teóricos y necesitan horas de vuelo.',
            duration: 'A medida',
            schedule: 'Consultar horarios',
            price: 35000,
            image_url: 'assets/img/cursos/aprendizaje-practico.jpg', 
            level: 'Práctico',
            students: 50,
            rating: 5.0
        }
    ];

    private readonly mockModules: Module[] = [
        // Curso 1: Basico
        { id: 'm1-1', course_id: '1', title: 'Módulo 1: Fundamentos y Herramientas', description: 'Introducción a la electrónica, multímetro, estación de calor.', order: 1 },
        { id: 'm1-2', course_id: '1', title: 'Módulo 2: Desarme y Reconocimiento', description: 'Técnicas de apertura, identificación de partes y buses.', order: 2 },
        { id: 'm1-3', course_id: '1', title: 'Módulo 3: Pantallas y Táctiles', description: 'Diferencias OLED/LCD, cambio de glass vs módulo completo.', order: 3 },
        { id: 'm1-4', course_id: '1', title: 'Módulo 4: Baterías y Carga', description: 'Diagnóstico de baterías, pines de carga y consumo.', order: 4 },
        { id: 'm1-5', course_id: '1', title: 'Módulo 5: Software Básico', description: 'Hard reset, flasheo y cuentas Google.', order: 5 },

        // Curso 2: Microelectronica
        { id: 'm2-1', course_id: '2', title: 'Módulo 1: Lectura de Planos', description: 'Schematics, boardview y seguimiento de líneas.', order: 1 },
        { id: 'm2-2', course_id: '2', title: 'Módulo 2: Soldadura SMD', description: 'Manejo de componentes 0201, conectores FPC y blindajes.', order: 2 },
        { id: 'm2-3', course_id: '2', title: 'Módulo 3: Reballing', description: 'Técnica de reballing para ICs de power, CPU y memoria.', order: 3 },
        { id: 'm2-4', course_id: '2', title: 'Módulo 4: Fallas de Encendido', description: 'Consumos iniciales, secundarios y diagnóstico con fuente.', order: 4 },

        // Curso 3: Electricidad
        { id: 'm3-1', course_id: '3', title: 'Módulo 1: Conceptos Básicos', description: 'Ley de Ohm, corriente AC/DC, potencia y seguridad.', order: 1 },
        { id: 'm3-2', course_id: '3', title: 'Módulo 2: Herramientas y Empalmes', description: 'Uso de pinzas, pelacables y tipos de uniones seguras.', order: 2 },
        { id: 'm3-3', course_id: '3', title: 'Módulo 3: Tableros y Protecciones', description: 'Disyuntores, térmicas y puesta a tierra.', order: 3 },
        { id: 'm3-4', course_id: '3', title: 'Módulo 4: Circuitos de Iluminación', description: 'Llaves combinadas, fotocélulas y sensores de movimiento.', order: 4 },
        { id: 'm3-5', course_id: '3', title: 'Módulo 5: Tomacorrientes y Fuerza', description: 'Cálculo de secciones de cables y distribución de cargas.', order: 5 }
    ];

    constructor(private authService: AuthService) {
        this.supabase = this.authService.getSupabaseClient();
    }

    getCourses(): Observable<PostgrestResponse<Course>> {
        return from(
            this.supabase
                .from('courses')
                .select('id, title, slug, price, sale_price, level, is_active, image_url, created_at, duration, schedule, instructor_name')
                .order('created_at', { ascending: false })
                .returns<Course[]>()
        );
    }

    getCourseBySlug(slug: string): Observable<PostgrestSingleResponse<Course | null>> {
        return from(
            this.supabase
                .from('courses')
                .select('*')
                .eq('slug', slug)
                .maybeSingle()
        ).pipe(
            map(({ data, error }) => {
                if (error || !data) {
                    // Fallback to mock data (Single Source of Truth)
                    const mock = this.mockCourses.find(c => c.slug === slug);
                    return { data: mock || null, error: null, count: null, status: 200, statusText: 'OK' } as PostgrestSingleResponse<Course | null>;
                }
                return { data, error, count: null, status: 200, statusText: 'OK' } as PostgrestSingleResponse<Course | null>;
            }),
            catchError(() => {
                 const mock = this.mockCourses.find(c => c.slug === slug);
                 return of({ data: mock || null, error: null, count: null, status: 200, statusText: 'OK' } as PostgrestSingleResponse<Course | null>);
            })
        );
    }

    getCourseById(id: string): Observable<PostgrestSingleResponse<Course | null>> {
        return from(
            this.supabase
                .from('courses')
                .select('*')
                .eq('id', id)
                .maybeSingle()
        ) as Observable<PostgrestSingleResponse<Course | null>>;
    }

    createCourse(course: Partial<Course>): Observable<PostgrestSingleResponse<Course | null>> {
        return from(
            this.supabase
                .from('courses')
                .insert(course)
                .select()
                .single()
        ) as Observable<PostgrestSingleResponse<Course | null>>;
    }

    updateCourse(id: string, course: Partial<Course>): Observable<PostgrestSingleResponse<Course | null>> {
        return from(
            this.supabase
                .from('courses')
                .update(course)
                .eq('id', id)
                .select()
                .single()
        ) as Observable<PostgrestSingleResponse<Course | null>>;
    }

    deleteCourse(id: string): Observable<any> {
        return from(
            this.supabase
                .from('courses')
                .delete()
                .eq('id', id)
        );
    }

    getModulesByCourseId(courseId: string): Observable<{ data: Module[], error: any }> {
         return from(
             this.supabase
                .from('course_modules')
                .select('id, course_id, title, description, order:order_index')
                .eq('course_id', courseId)
                .order('order_index', { ascending: true })
                .returns<Module[]>()
         ).pipe(
             switchMap(({ data, error }) => {
                 if (!error && data && data.length > 0) {
                     return of({ data, error: null });
                 }
                 
                 // Fallback: If no modules found or table doesn't exist, we must provide the correct mock ones
                 // First, get the course to know its slug so we can map it to mock modules
                 return from((this.supabase.from('courses').select('slug').eq('id', courseId) as any).maybeSingle()).pipe(
                     map((res: any) => {
                         const slug = res.data?.slug;
                         let targetMockCourseId = courseId; // default to passed ID if it's already a mock ID
                         
                         // Map real DB courses to mock modules by their slug
                         if (slug === 'reparacion-celulares-basico') targetMockCourseId = '1';
                         else if (slug === 'curso-avanzado-microelectronica') targetMockCourseId = '2';
                         else if (slug === 'curso-electricidad') targetMockCourseId = '3';
                         else if (slug === 'aprendizaje-practico') targetMockCourseId = '4';

                         const filtered = this.mockModules.filter(m => m.course_id === targetMockCourseId);
                         return { data: filtered, error: null };
                     }),
                     catchError(() => {
                         // Extremely silent fallback
                         const filtered = this.mockModules.filter(m => m.course_id === courseId);
                         return of({ data: filtered, error: null });
                     })
                 );
             })
         );
    }

    saveModules(courseId: string, modules: Partial<Module>[]): Observable<any> {
        return from((async () => {
            // Check if mock IDs are involved, indicating the DB isn't ready or we are on mock fallbacks
            if (courseId.length < 5) {
                // Return success immediately to not break the UI while on mock mode
                return { success: true, warning: 'Mock mode active, modules not saved to DB.' };
            }

            // Real DB logic: Need to get the tenant_id from the course first (since course_modules requires it)
            const { data: courseRef } = await (this.supabase.from('courses').select('tenant_id').eq('id', courseId) as any).maybeSingle();
            const tenantId = courseRef?.tenant_id;

            // 1. Filter out valid existing IDs to keep
            const currentIds = modules.filter(m => m.id && m.id.length > 10).map(m => m.id);
            
            // 2. Delete modules for this course that are NOT in the newly saved list
            if (currentIds.length > 0) {
                await this.supabase.from('course_modules')
                    .delete()
                    .eq('course_id', courseId)
                    .not('id', 'in', `(${currentIds.join(',')})`);
            } else {
                // If the new list has no valid DB IDs, wipe all existing modules for the course
                await this.supabase.from('course_modules').delete().eq('course_id', courseId);
            }

            // 3. Upsert the new and existing ones
            const toUpsert = modules.map((m, idx) => {
                const payload: any = {
                    course_id: courseId,
                    title: m.title,
                    description: m.description,
                    order_index: idx + 1
                };
                if (tenantId) payload.tenant_id = tenantId;
                
                // Only include the ID if it looks like a real database UUID (length > 10)
                if (m.id && m.id.length > 10) {
                    payload.id = m.id;
                }
                return payload;
            });

            if (toUpsert.length > 0) {
                const { data, error } = await this.supabase.from('course_modules').upsert(toUpsert).select();
                if (error) {
                    console.error("Error saving modules:", error);
                    throw error;
                }
                return data;
            }
            return [];
        })());
    }

    async registerStudent(data: any): Promise<{ data: any, error: any }> {
        // Handle mock course registration
        if (data.course_id === '1') {
            await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
            return { 
                data: { ...data, id: 'mock-enrollment-id', status: 'pending' }, 
                error: null 
            };
        }

        try {
            const { data: enrollment, error } = await this.supabase
                .from('course_enrollments')
                .insert([{
                    course_id: data.course_id,
                    full_name: data.full_name,
                    email: data.email,
                    phone: data.phone,
                    status: 'pending', // Default status
                    created_at: new Date().toISOString()
                }])
                .select()
                .single();

            if (error) throw error;

            return { data: enrollment, error: null };
        } catch (error: any) {
            console.error('Error registering student:', error);
            return { data: null, error };
        }
    }
}
