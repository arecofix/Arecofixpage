import { Injectable, inject } from '@angular/core';
import { from, Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Course, CourseModule, StudentEnrollment } from '@app/features/courses/domain/entities/course.entity';
import { CourseRepository } from '@app/features/courses/domain/repositories/course.repository';
import { LoggerService } from './logger.service';
import { TenantService } from './tenant.service';
import { SUPABASE_CLIENT } from '@app/core/di/supabase-token';

export type { Course, CourseModule as Module, StudentEnrollment };

@Injectable({
    providedIn: 'root'
})
export class CoursesService {
    private repository = inject(CourseRepository);
    private logger = inject(LoggerService);
    private tenantService = inject(TenantService);
    private supabase = inject(SUPABASE_CLIENT);

    getCourses(): Observable<{ data: Course[], error: any }> {
        return from(this.repository.getAll()).pipe(
            map(data => ({ data, error: null })),
            catchError(error => {
                this.logger.error('Failed to fetch courses', error);
                return of({ data: [], error });
            })
        );
    }

    getCourseBySlug(slug: string): Observable<{ data: Course | null, error: any }> {
        return from(this.repository.getBySlug(slug)).pipe(
            map(data => ({ data, error: null })),
            catchError(error => {
                this.logger.error(`Failed to fetch course by slug: ${slug}`, error);
                return of({ data: null, error });
            })
        );
    }

    getCourseById(id: string): Observable<{ data: Course | null, error: any }> {
        return from(this.repository.getById(id)).pipe(
            map(data => ({ data, error: null })),
            catchError(error => {
                this.logger.error(`Failed to fetch course by id: ${id}`, error);
                return of({ data: null, error });
            })
        );
    }

    createCourse(course: Partial<Course>): Observable<{ data: Course | null, error: any }> {
        this.logger.debug('Creating new course', course);
        return from(this.repository.create(course)).pipe(
            map(data => ({ data, error: null })),
            catchError(error => {
                this.logger.error('Failed to create course', error);
                return of({ data: null, error });
            })
        );
    }

    updateCourse(id: string, course: Partial<Course>): Observable<{ data: Course | null, error: any }> {
        return from(this.repository.update(id, course)).pipe(
            map(data => ({ data, error: null })),
            catchError(error => {
                this.logger.error(`Failed to update course: ${id}`, error);
                return of({ data: null, error });
            })
        );
    }

    deleteCourse(id: string): Observable<any> {
        return from(this.repository.delete(id)).pipe(
            map(() => ({ error: null })),
            catchError(error => of({ error }))
        );
    }

    getModulesByCourseId(courseId: string): Observable<{ data: CourseModule[], error: any }> {
         return from(this.repository.getModules(courseId)).pipe(
             map(data => ({ data, error: null })),
             catchError(error => {
                 this.logger.error(`Failed to fetch modules for course: ${courseId}`, error);
                 return of({ data: [], error });
             })
         );
    }

    saveModules(courseId: string, modules: Partial<CourseModule>[]): Observable<any> {
        const tenantId = this.tenantService.getTenantId();
        this.logger.debug('Saving course modules', { courseId, count: modules.length });
        
        return from(this.repository.saveModules(courseId, modules, tenantId)).pipe(
            map(data => ({ data, error: null })),
            catchError(error => {
                this.logger.error('Failed to save modules', error);
                return of({ data: null, error });
            })
        );
    }

    async registerStudent(data: any): Promise<{ data: StudentEnrollment | null, error: any }> {
        try {
            const enrollment: StudentEnrollment = {
                course_id: data.course_id,
                full_name: data.full_name,
                email: data.email,
                phone: data.phone,
                status: 'pending',
                tenant_id: this.tenantService.getTenantId(),
                created_at: new Date().toISOString()
            };
            
            // 1. Save to technical enrollments table
            const result = await this.repository.enrollStudent(enrollment);

            // 2. Also send to contact_messages to show in Admin Message panel
            try {
                await this.supabase.from('contact_messages').insert({
                    name: data.full_name,
                    email: data.email,
                    phone: data.phone,
                    subject: 'Nueva Inscripción a Curso',
                    message: `Se ha registrado una nueva inscripción.\nCurso: ${data.course_title || 'N/A'}\nEmail: ${data.email}\nTel: ${data.phone}`,
                    is_read: false,
                    tenant_id: this.tenantService.getTenantId()
                });
            } catch (msgErr) {
                this.logger.error('Failed to create secondary contact message for enrollment', msgErr);
            }

            return { data: result, error: null };
        } catch (error) {
            this.logger.error('Error registering student', error);
            return { data: null, error };
        }
    }
}
