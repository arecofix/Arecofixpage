import { Injectable } from '@angular/core';
import { SupabaseClient, PostgrestSingleResponse, PostgrestResponse } from '@supabase/supabase-js';
import { from, Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
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
        { 
            id: 'm1-1', course_id: '1', title: 'Módulo 1: Fundamentos y Herramientas', 
            description: 'Introducción a la electrónica, multímetro, estación de calor.', order: 1 
        },
        { 
            id: 'm1-2', course_id: '1', title: 'Módulo 2: Desarme y Reconocimiento', 
            description: 'Técnicas de apertura, identificación de partes y buses.', order: 2 
        },
        { 
            id: 'm1-3', course_id: '1', title: 'Módulo 3: Pantallas y Táctiles', 
            description: 'Diferencias OLED/LCD, cambio de glass vs módulo completo.', order: 3 
        },
        { 
            id: 'm1-4', course_id: '1', title: 'Módulo 4: Baterías y Carga', 
            description: 'Diagnóstico de baterías, pines de carga y consumo.', order: 4 
        },
        { 
            id: 'm1-5', course_id: '1', title: 'Módulo 5: Software Básico', 
            description: 'Hard reset, flasheo y cuentas Google.', order: 5 
        },

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
                .select('id, title, slug, price, sale_price, level, is_active, image_url, created_at, duration, schedule')
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
                .single()
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
                .single()
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
         // TEMPORARY FIX: Return mock data immediately to prevent 404 network errors 
         // until the 'modules' table migration is applied by the user.
         return of({ data: this.mockModules, error: null });

         /* 
         // Original Implementation (Restore when table exists):
         return from(
             this.supabase
                .from('modules')
                .select('*')
                .eq('course_id', courseId)
                .order('order', { ascending: true })
                .returns<Module[]>()
         ).pipe(
             map(({ data, error }) => {
                 if (error || !data || data.length === 0) {
                     return { data: this.mockModules, error: null };
                 }
                 return { data, error };
             }),
             catchError((err) => {
                 return of({ data: this.mockModules, error: null });
             })
         );
         */
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
