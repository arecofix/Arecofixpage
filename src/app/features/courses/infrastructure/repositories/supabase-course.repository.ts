import { Injectable, inject } from '@angular/core';
import { SUPABASE_CLIENT } from '@app/core/di/supabase-token';
import { CourseRepository } from '../../domain/repositories/course.repository';
import { Course, CourseModule, StudentEnrollment } from '../../domain/entities/course.entity';

@Injectable({
  providedIn: 'root'
})
export class SupabaseCourseRepository extends CourseRepository {
  private supabase = inject(SUPABASE_CLIENT);

  // Fallback Mocks (keeping them in infrastructure layer as temporary data source)
  private readonly mockCourses: Course[] = [
    {
        id: '1',
        title: 'Reparación de Celulares - Nivel Básico',
        slug: 'reparacion-celulares-basico',
        description: 'Aprende los fundamentos de la reparación de smartphones.',
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
        description: 'Domina la reparación de placas de iPhone y Android.',
        duration: '4 meses',
        schedule: 'Miércoles 18:00-21:00',
        price: 65000,
        image_url: 'assets/img/cursos/alumno2.jpg',
        level: 'Avanzado',
        students: 85,
        rating: 4.9
    }
  ];

  async getAll(): Promise<Course[]> {
    const { data, error } = await this.supabase
      .from('courses')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) return this.mockCourses;
    return data as Course[];
  }

  async getBySlug(slug: string): Promise<Course | null> {
    const { data, error } = await this.supabase
      .from('courses')
      .select('*')
      .eq('slug', slug)
      .maybeSingle();

    if (error || !data) {
        return this.mockCourses.find(c => c.slug === slug) || null;
    }
    return data as Course;
  }

  async getById(id: string): Promise<Course | null> {
    const { data, error } = await this.supabase
      .from('courses')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error || !data) return null;
    return data as Course;
  }

  async create(course: Partial<Course>): Promise<Course> {
    const { data, error } = await this.supabase
      .from('courses')
      .insert(course)
      .select()
      .single();

    if (error) throw error;
    return data as Course;
  }

  async update(id: string, course: Partial<Course>): Promise<Course> {
    const { data, error } = await this.supabase
      .from('courses')
      .update(course)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as Course;
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('courses')
      .delete()
      .eq('id', id);
    if (error) throw error;
  }

  async getModules(courseId: string): Promise<CourseModule[]> {
    const { data, error } = await this.supabase
      .from('course_modules')
      .select('*')
      .eq('course_id', courseId)
      .order('order_index', { ascending: true });

    if (error) throw error;
    return data || [];
  }

  async saveModules(courseId: string, modules: Partial<CourseModule>[], tenantId?: string): Promise<CourseModule[]> {
    // 1. Clean up old modules (or those not present in the new set)
    const existingIds = modules.filter(m => !!m.id && m.id.length > 10).map(m => m.id!);
    
    if (existingIds.length > 0) {
        await this.supabase.from('course_modules')
            .delete()
            .eq('course_id', courseId)
            .not('id', 'in', `(${existingIds.join(',')})`);
    } else {
        await this.supabase.from('course_modules').delete().eq('course_id', courseId);
    }

    // 2. Upsert
    const toUpsert = modules.map((m, idx) => ({
        ...m,
        course_id: courseId,
        order_index: idx + 1,
        tenant_id: tenantId,
        id: (m.id && m.id.length > 10) ? m.id : undefined
    }));

    const { data, error } = await this.supabase
        .from('course_modules')
        .upsert(toUpsert)
        .select();

    if (error) throw error;
    return data || [];
  }

  async enrollStudent(enrollment: StudentEnrollment): Promise<StudentEnrollment> {
    const { data, error } = await this.supabase
      .from('course_enrollments')
      .insert([enrollment])
      .select()
      .single();

    if (error) throw error;
    return data as StudentEnrollment;
  }
}
