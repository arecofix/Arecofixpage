import { Injectable, inject } from '@angular/core';
import { CourseRepository } from '../../domain/repositories/course.repository';
import { Course, CourseModule, StudentEnrollment, CourseInstructor, CourseModuleContent } from '../../domain/entities/course.entity';
import { TenantScopedQueryService } from '@app/core/infrastructure/supabase/tenant-scoped-query.service';

const isUUID = (id?: string | null): boolean => {
  return !!id && /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(id);
};

@Injectable({ providedIn: 'root' })
export class SupabaseCourseRepository extends CourseRepository {
  private scoped = inject(TenantScopedQueryService);

  async getAll(): Promise<Course[]> {
    const { data, error } = await this.scoped.withTenantScope(
      this.scoped.from('courses').select('*')
    )
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []) as Course[];
  }

  async getBySlug(slug: string): Promise<Course | null> {
    const { data, error } = await this.scoped.withTenantScope(
      this.scoped.from('courses').select('*')
    )
      .eq('slug', slug)
      .eq('is_active', true)
      .maybeSingle();

    if (error) throw error;
    return data as Course | null;
  }

  async getById(id: string): Promise<Course | null> {
    const { data, error } = await this.scoped.withTenantScope(
      this.scoped.from('courses').select('*')
    )
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    return data as Course | null;
  }

  async create(course: Partial<Course>): Promise<Course> {
    const { data, error } = await this.scoped
      .from('courses')
      .insert(this.scoped.withTenant(course))
      .select()
      .single();

    if (error) throw error;
    return data as Course;
  }

  async update(id: string, course: Partial<Course>): Promise<Course> {
    const { data, error } = await this.scoped.withTenantScope(
      this.scoped.from('courses').update(course)
    )
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as Course;
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.scoped
      .withTenantScope(this.scoped.from('courses').delete())
      .eq('id', id);
    if (error) throw error;
  }

  async getModules(courseId: string): Promise<CourseModule[]> {
    const { data, error } = await this.scoped.withTenantScope(
      this.scoped.from('course_modules').select('*')
    )
      .eq('course_id', courseId)
      .order('order_index', { ascending: true });

    if (error) throw error;
    return data || [];
  }

  async saveModules(
    courseId: string,
    modules: Partial<CourseModule>[],
    tenantId?: string
  ): Promise<CourseModule[]> {
    const tid = tenantId ?? this.scoped.getTenantId();
    const existingIds = modules.filter((m) => isUUID(m.id)).map((m) => m.id!);

    if (existingIds.length > 0) {
      await this.scoped
        .withTenantScope(this.scoped.from('course_modules').delete())
        .eq('course_id', courseId)
        .not('id', 'in', `(${existingIds.join(',')})`);
    } else {
      await this.scoped
        .withTenantScope(this.scoped.from('course_modules').delete())
        .eq('course_id', courseId);
    }

    const toUpsert = modules.map((m, idx) => ({
      ...m,
      course_id: courseId,
      order_index: idx + 1,
      tenant_id: tid,
      id: isUUID(m.id) ? m.id : crypto.randomUUID(),
    }));

    const { data, error } = await this.scoped.from('course_modules').upsert(toUpsert).select();
    if (error) throw error;
    return data || [];
  }

  async enrollStudent(enrollment: StudentEnrollment): Promise<StudentEnrollment> {
    const { data, error } = await this.scoped
      .from('course_enrollments')
      .insert([this.scoped.withTenant({ ...enrollment })])
      .select()
      .single();

    if (error) throw error;
    return data as StudentEnrollment;
  }

  async getEnrollments(): Promise<StudentEnrollment[]> {
    const { data, error } = await this.scoped.withTenantScope(
      this.scoped.from('course_enrollments').select(`
        *,
        course:courses(id, title)
      `)
    ).order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []) as unknown as StudentEnrollment[];
  }

  async assignInstructors(courseId: string, instructorIds: string[], tenantId?: string): Promise<void> {
    const tid = tenantId ?? this.scoped.getTenantId();
    
    // Eliminar asignaciones previas
    await this.scoped
      .withTenantScope(this.scoped.from('course_instructors').delete())
      .eq('course_id', courseId);
      
    if (instructorIds.length === 0) return;

    // Crear nuevas asignaciones
    const toInsert = instructorIds.map(id => ({
      course_id: courseId,
      instructor_id: id,
      tenant_id: tid
    }));

    const { error } = await this.scoped.from('course_instructors').insert(toInsert);
    if (error) throw error;
  }

  async getCourseInstructors(courseId: string): Promise<CourseInstructor[]> {
    const { data, error } = await this.scoped.withTenantScope(
      this.scoped.from('course_instructors').select('*')
    ).eq('course_id', courseId);

    if (error) throw error;
    return (data || []) as CourseInstructor[];
  }

  async getModuleContents(moduleId: string): Promise<CourseModuleContent[]> {
    const { data, error } = await this.scoped.withTenantScope(
      this.scoped.from('course_lessons').select('*')
    ).eq('module_id', moduleId)
     .order('order_index', { ascending: true });

    if (error) throw error;
    return (data || []) as CourseModuleContent[];
  }

  async saveModuleContents(moduleId: string, contents: Partial<CourseModuleContent>[], tenantId?: string): Promise<CourseModuleContent[]> {
    const tid = tenantId ?? this.scoped.getTenantId();
    const existingIds = contents.filter((c) => isUUID(c.id)).map((c) => c.id!);

    if (existingIds.length > 0) {
      await this.scoped
        .withTenantScope(this.scoped.from('course_lessons').delete())
        .eq('module_id', moduleId)
        .not('id', 'in', `(${existingIds.join(',')})`);
    } else {
      await this.scoped
        .withTenantScope(this.scoped.from('course_lessons').delete())
        .eq('module_id', moduleId);
    }

    const toUpsert = contents.map((c, idx) => ({
      ...c,
      module_id: moduleId,
      order_index: idx + 1,
      tenant_id: tid,
      id: isUUID(c.id) ? c.id : crypto.randomUUID(),
    }));

    const { data, error } = await this.scoped.from('course_lessons').upsert(toUpsert).select();
    if (error) throw error;
    return data || [];
  }
}
