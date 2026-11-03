import { Injectable, inject } from '@angular/core';
import { from, Observable, of, forkJoin } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { 
  Course, 
  CourseModule, 
  StudentEnrollment, 
  CourseModuleContent, 
  CourseExamQuestion, 
  CourseExamSubmission,
  EnrollmentStatus 
} from '@app/features/courses/domain/entities/course.entity';
import { CourseRepository } from '@app/features/courses/domain/repositories/course.repository';
import { LoggerService } from './logger.service';
import { TenantService } from './tenant.service';
import { SupabaseService } from './supabase.service';
import { SUPABASE_CLIENT } from '@app/core/di/supabase-token';
import { TENANT_CONSTANTS } from '@app/core/constants/tenant.constants';

export type { Course, CourseModule as Module, StudentEnrollment, CourseModuleContent, CourseExamQuestion, CourseExamSubmission, EnrollmentStatus };

@Injectable({
    providedIn: 'root'
})
export class CoursesService {
    private repository = inject(CourseRepository);
    private logger = inject(LoggerService);
    private tenantService = inject(TenantService);
    private supabaseService = inject(SupabaseService);
    private supabase = inject(SUPABASE_CLIENT);

    getCourses(): Observable<{ data: Course[], error: unknown }> {
        return from(this.repository.getAll()).pipe(
            map(data => ({ data, error: null })),
            catchError(error => {
                this.logger.error('Failed to fetch courses', error);
                return of({ data: [], error });
            })
        );
    }

    getCourseBySlug(slug: string): Observable<{ data: Course | null, error: unknown }> {
        return from(this.repository.getBySlug(slug)).pipe(
            map(data => ({ data, error: null })),
            catchError(error => {
                this.logger.error(`Failed to fetch course by slug: ${slug}`, error);
                return of({ data: null, error });
            })
        );
    }

    getCourseById(id: string): Observable<{ data: Course | null, error: unknown }> {
        return from(this.repository.getById(id)).pipe(
            map(data => ({ data, error: null })),
            catchError(error => {
                this.logger.error(`Failed to fetch course by id: ${id}`, error);
                return of({ data: null, error });
            })
        );
    }

    createCourse(course: Partial<Course>): Observable<{ data: Course | null, error: unknown }> {
        this.logger.debug('Creating new course', course);
        return from(this.repository.create(course)).pipe(
            map(data => ({ data, error: null })),
            catchError(error => {
                this.logger.error('Failed to create course', error);
                return of({ data: null, error });
            })
        );
    }

    updateCourse(id: string, course: Partial<Course>): Observable<{ data: Course | null, error: unknown }> {
        this.logger.debug(`Updating course: ${id}`, course);
        return from(this.repository.update(id, course)).pipe(
            map(data => ({ data, error: null })),
            catchError(error => {
                this.logger.error(`Failed to update course: ${id}`, error);
                return of({ data: null, error });
            })
        );
    }

    deleteCourse(id: string): Observable<{ error: unknown }> {
        this.logger.debug(`Deleting course: ${id}`);
        return from(this.repository.delete(id)).pipe(
            map(() => ({ error: null })),
            catchError(error => {
                this.logger.error(`Failed to delete course: ${id}`, error);
                return of({ error });
            })
        );
    }

    // --- Modules ---

    getModulesByCourseId(courseId: string): Observable<{ data: CourseModule[], error: unknown }> {
        return from(this.repository.getModules(courseId)).pipe(
            map(data => ({ data, error: null })),
            catchError(error => {
                this.logger.error(`Failed to fetch modules for course: ${courseId}`, error);
                return of({ data: [], error });
            })
        );
    }

    saveModules(courseId: string, modules: Partial<CourseModule>[]): Observable<{ data: CourseModule[], error: unknown }> {
        const tenantId = this.tenantService.getTenantId();
        return from(this.repository.saveModules(courseId, modules, tenantId)).pipe(
            map(data => ({ data, error: null })),
            catchError(error => {
                this.logger.error(`Failed to save modules for course: ${courseId}`, error);
                return of({ data: [], error });
            })
        );
    }

    /**
     * Updates unlock_date for drip content gating on a single module.
     * dateOrAction: ISO string, 'now' (sets to current timestamp), or null (locks).
     */
    updateModuleUnlockDate(
        moduleId: string,
        dateOrAction: string | 'now' | null,
    ): Observable<{ data: CourseModule | null; error: unknown }> {
        const unlock_date =
            dateOrAction === 'now'
                ? new Date().toISOString()
                : dateOrAction;

        return from(
            this.supabase
                .from('course_modules')
                .update({ unlock_date })
                .eq('id', moduleId)
                .select()
                .single(),
        ).pipe(
            map(({ data, error }) => {
                if (error) throw error;
                return { data: data as CourseModule, error: null };
            }),
            catchError((error) => {
                this.logger.error(`Failed to update unlock_date for module ${moduleId}`, error);
                return of({ data: null, error });
            }),
        );
    }

    // --- Student Enrollments ---

    async registerStudent(data: {
        course_id: string;
        full_name: string;
        email: string;
        phone?: string;
        user_id?: string;
        course_title?: string;
    }): Promise<{ data: StudentEnrollment | null, error: unknown }> {
        try {
            const trimmedEmail = (data.email || '').trim().toLowerCase();
            const enrollment: StudentEnrollment = {
                course_id: data.course_id,
                user_id: data.user_id || null,
                full_name: data.full_name,
                email: trimmedEmail,
                phone: data.phone || '',
                status: 'pending',
                tenant_id: this.tenantService.getTenantId(),
                created_at: new Date().toISOString()
            };
            
            // 1. Save to course_enrollments
            const result = await this.repository.enrollStudent(enrollment);

            // 2. Secondary notification to contact_messages
            try {
                await this.supabase.from('contact_messages').insert({
                    name: data.full_name,
                    email: trimmedEmail,
                    phone: data.phone || '',
                    subject: 'Nueva Inscripción a Curso',
                    message: `Se ha registrado una nueva inscripción.\nCurso: ${data.course_title || 'N/A'}\nEmail: ${trimmedEmail}\nTel: ${data.phone || ''}`,
                    is_read: false,
                    tenant_id: this.tenantService.getTenantId()
                });
                
                // 3. Admin notification
                await this.supabase.from('admin_notifications').insert({
                    title: '🎓 Nueva Inscripción a Curso',
                    message: `${data.full_name} se ha inscripto al curso de ${data.course_title || 'N/A'}.`,
                    type: 'info',
                    source: 'academy',
                    is_read: false,
                    tenant_id: this.tenantService.getTenantId()
                });
            } catch (msgErr) {
                this.logger.error('Failed to create secondary notification for enrollment', msgErr);
            }

            this.supabaseService.clearCacheForTable('course_enrollments');
            return { data: result, error: null };
        } catch (error) {
            this.logger.error('Error registering student', error);
            return { data: null, error };
        }
    }

    getEnrollments(): Observable<{ data: StudentEnrollment[], error: unknown }> {
        return from(this.repository.getEnrollments()).pipe(
            map(data => ({ data, error: null })),
            catchError(error => {
                this.logger.error('Failed to fetch enrollments', error);
                return of({ data: [], error });
            })
        );
    }

    /**
     * Resolves confirmed courses for the student using dual identity check:
     * lower(email) = :email OR user_id = :userId.
     */
    getUserEnrolledCourses(email?: string, userId?: string): Observable<{ data: StudentEnrollment[], error: unknown }> {
        const tenantId = this.tenantService.getTenantId();
        const trimmedEmail = (email || '').trim().toLowerCase();
        
        let query = this.supabase.from('course_enrollments').select(`
            *,
            course:courses(id, title, slug, image_url, short_description, unlock_strategy, is_active)
        `)
        .in('status', ['confirmed', 'in_progress', 'completed'])
        .order('created_at', { ascending: false });

        if (trimmedEmail && userId) {
            query = query.or(`email.ilike.${trimmedEmail},user_id.eq.${userId}`);
        } else if (userId) {
            query = query.eq('user_id', userId);
        } else if (trimmedEmail) {
            query = query.ilike('email', trimmedEmail);
        }

        if (tenantId && tenantId !== TENANT_CONSTANTS.FALLBACK_ID) {
            query = query.eq('tenant_id', tenantId);
        }

        return from(query).pipe(
            map(({ data, error }) => {
                if (error) throw error;
                return { data: (data || []) as StudentEnrollment[], error: null };
            }),
            catchError(error => {
                this.logger.error('Failed to fetch user enrolled courses', error);
                return of({ data: [], error });
            })
        );
    }

    searchUsersByEmail(query: string): Observable<{ data: unknown[], error: unknown }> {
        const trimmed = (query || '').trim();
        let dbQuery = this.supabase.from('profiles')
            .select('id, email, first_name, last_name, phone, avatar_url, role')
            .limit(100);
            
        const tenantId = this.tenantService.getTenantId();
        if (tenantId && tenantId !== TENANT_CONSTANTS.FALLBACK_ID) {
            dbQuery = dbQuery.eq('tenant_id', tenantId);
        }

        if (trimmed) {
            dbQuery = dbQuery.or(`email.ilike.%${trimmed}%,first_name.ilike.%${trimmed}%,last_name.ilike.%${trimmed}%`);
        }

        return from(dbQuery).pipe(
            map(({ data, error }) => {
                if (error) throw error;
                return { data: data || [], error: null };
            }),
            catchError(error => {
                this.logger.error('Failed to search users', error);
                return of({ data: [], error });
            })
        );
    }

    /**
     * Checks in course_enrollments if a confirmed enrollment exists for the given course
     * via email OR user_id.
     */
    async checkEnrollment(courseId: string, email?: string, userId?: string): Promise<{ enrolled: boolean, error: unknown }> {
        const trimmedEmail = (email || '').trim().toLowerCase();
        let query = this.supabase
            .from('course_enrollments')
            .select('id, status')
            .eq('course_id', courseId)
            .in('status', ['confirmed', 'in_progress', 'completed']);

        if (trimmedEmail && userId) {
            query = query.or(`email.ilike.${trimmedEmail},user_id.eq.${userId}`);
        } else if (userId) {
            query = query.eq('user_id', userId);
        } else if (trimmedEmail) {
            query = query.ilike('email', trimmedEmail);
        } else {
            return { enrolled: false, error: 'No user identification provided' };
        }

        const { data, error } = await query.limit(1);
        if (error) {
            this.logger.error('checkEnrollment failed', error);
            return { enrolled: false, error };
        }
        return { enrolled: !!(data && data.length > 0), error: null };
    }

    /**
     * Enrolls a student manually with deduplication and dual identity linkage.
     */
    async enrollStudentManually(
        courseId: string, 
        email: string, 
        fullName: string, 
        phone?: string, 
        userId?: string
    ): Promise<{ data: StudentEnrollment | null, error: unknown }> {
        const trimmedEmail = (email || '').trim().toLowerCase();
        
        try {
            let query = this.supabase
                .from('course_enrollments')
                .select('id')
                .eq('course_id', courseId);

            if (trimmedEmail && userId) {
                query = query.or(`email.ilike.${trimmedEmail},user_id.eq.${userId}`);
            } else if (userId) {
                query = query.eq('user_id', userId);
            } else {
                query = query.ilike('email', trimmedEmail);
            }

            const { data: existing, error: findError } = await query.limit(1);
            if (findError) throw findError;

            if (existing && existing.length > 0) {
                // Update existing record
                const enrollmentUpdate: Record<string, unknown> = {
                    status: 'confirmed',
                    full_name: fullName,
                };
                if (userId) enrollmentUpdate['user_id'] = userId;
                if (trimmedEmail) enrollmentUpdate['email'] = trimmedEmail;
                if (phone !== undefined) enrollmentUpdate['phone'] = phone;

                const { data: updated, error: updateErr } = await this.supabase
                    .from('course_enrollments')
                    .update(enrollmentUpdate)
                    .eq('id', existing[0].id)
                    .select()
                    .single();

                this.supabaseService.clearCacheForTable('course_enrollments');
                return { data: updated as StudentEnrollment, error: updateErr };
            }

            // Insert new enrollment
            const enrollment: StudentEnrollment = {
                course_id: courseId,
                full_name: fullName,
                email: trimmedEmail,
                phone: phone || '',
                status: 'confirmed',
                tenant_id: this.tenantService.getTenantId(),
                created_at: new Date().toISOString()
            };
            if (userId) {
                enrollment.user_id = userId;
            }
            
            const result = await this.repository.enrollStudent(enrollment);
            this.supabaseService.clearCacheForTable('course_enrollments');
            return { data: result, error: null };
        } catch (error) {
            this.logger.error('Failed to manually enroll student', error);
            return { data: null, error };
        }
    }

    async deleteEnrollment(id: string): Promise<{ error: unknown }> {
        const { error } = await this.supabase
            .from('course_enrollments')
            .delete()
            .eq('id', id);

        this.supabaseService.clearCacheForTable('course_enrollments');
        return { error };
    }

    async updateEnrollmentStatus(id: string, status: EnrollmentStatus): Promise<{ error: unknown }> {
        const { error } = await this.supabase
            .from('course_enrollments')
            .update({ status })
            .eq('id', id);

        this.supabaseService.clearCacheForTable('course_enrollments');
        return { error };
    }

    assignInstructors(courseId: string, instructorIds: string[]): Observable<{ error: unknown }> {
        const tenantId = this.tenantService.getTenantId();
        return from(this.repository.assignInstructors(courseId, instructorIds, tenantId)).pipe(
            map(() => ({ error: null })),
            catchError(error => {
                this.logger.error(`Failed to assign instructors to course: ${courseId}`, error);
                return of({ error });
            })
        );
    }

    getCourseInstructors(courseId: string): Observable<{ data: unknown[], error: unknown }> {
        return from(this.repository.getCourseInstructors(courseId)).pipe(
            map(data => ({ data, error: null })),
            catchError(error => {
                this.logger.error(`Failed to fetch instructors for course: ${courseId}`, error);
                return of({ data: [], error });
            })
        );
    }

    getModuleContents(moduleId: string): Observable<{ data: CourseModuleContent[], error: unknown }> {
        return from(this.repository.getModuleContents(moduleId)).pipe(
            map(data => ({ data, error: null })),
            catchError(error => {
                this.logger.error(`Failed to fetch contents for module: ${moduleId}`, error);
                return of({ data: [], error });
            })
        );
    }

    saveModuleContents(moduleId: string, contents: Partial<CourseModuleContent>[]): Observable<{ data: CourseModuleContent[], error: unknown }> {
        const tenantId = this.tenantService.getTenantId();
        return from(this.repository.saveModuleContents(moduleId, contents, tenantId)).pipe(
            map(data => ({ data, error: null })),
            catchError(error => {
                this.logger.error(`Failed to save contents for module: ${moduleId}`, error);
                return of({ data: [], error });
            })
        );
    }

    /**
     * Loads all modules for a course AND their contents in parallel using forkJoin.
     */
    getModulesWithContents(courseId: string): Observable<{ data: (CourseModule & { contents: CourseModuleContent[] })[], error: unknown }> {
        return this.getModulesByCourseId(courseId).pipe(
            switchMap(modulesRes => {
                if (modulesRes.error || !modulesRes.data?.length) {
                    return of({ data: [], error: modulesRes.error });
                }
                const modules = modulesRes.data;
                const contentRequests = modules.map(mod =>
                    this.getModuleContents(mod.id)
                );
                return forkJoin(contentRequests).pipe(
                    map(allContents => ({
                        data: modules.map((mod, i) => ({
                            ...mod,
                            contents: (allContents[i]?.data || []) as CourseModuleContent[]
                        })),
                        error: null
                    })),
                    catchError(err => {
                        this.logger.error(`Failed to load module contents for course: ${courseId}`, err);
                        return of({ data: modules.map(m => ({ ...m, contents: [] as CourseModuleContent[] })), error: err });
                    })
                );
            }),
            catchError(error => {
                this.logger.error(`Failed to load modules with contents for course: ${courseId}`, error);
                return of({ data: [], error });
            })
        );
    }

    // --- Exams ---
    
    getExamQuestions(contentId: string): Observable<{ data: CourseExamQuestion[], error: unknown }> {
        return from(this.supabase.rpc('get_exam_questions', { p_content_id: contentId })).pipe(
            map(res => ({ data: (res.data || []) as CourseExamQuestion[], error: res.error })),
            catchError(error => {
                this.logger.error(`Failed to get exam questions for content: ${contentId}`, error);
                return of({ data: [], error });
            })
        );
    }

    saveExamQuestions(contentId: string, questions: Partial<CourseExamQuestion>[]): Observable<{ data: CourseExamQuestion[], error: unknown }> {
        const tenantId = this.tenantService.getTenantId();
        const payload = questions.map(q => ({
            ...q,
            content_id: contentId,
            tenant_id: tenantId
        }));
        
        return from(
            this.supabase
                .from('course_exam_questions')
                .delete()
                .eq('content_id', contentId)
                .then(async () => {
                    if (payload.length === 0) return { data: [], error: null };
                    return this.supabase
                        .from('course_exam_questions')
                        .insert(payload)
                        .select();
                })
        ).pipe(
            map(res => ({ data: (res.data || []) as CourseExamQuestion[], error: res.error })),
            catchError(error => {
                this.logger.error(`Failed to save exam questions for content: ${contentId}`, error);
                return of({ data: [], error });
            })
        );
    }

    submitExam(
        contentId: string, 
        answers: { question_id: string, selected_index: number }[]
    ): Observable<{ data: { score: number; passed: boolean; correct_answers: number; total_questions: number; progress?: unknown } | null, error: unknown }> {
        return from(this.supabase.rpc('submit_exam', { p_content_id: contentId, p_answers: answers })).pipe(
            map(res => {
                this.supabaseService.clearCacheForTable('course_progress');
                return { data: res.data, error: res.error };
            }),
            catchError(error => {
                this.logger.error(`Failed to submit exam for content: ${contentId}`, error);
                return of({ data: null, error });
            })
        );
    }

    getCourseProgress(courseId: string, email?: string): Observable<{ data: { progress: number, completed_contents: string[], certificate_id?: string } | null, error: unknown }> {
        const trimmedEmail = (email || '').trim().toLowerCase();
        return from(
            this.supabase
                .from('course_progress')
                .select('content_id')
                .eq('course_id', courseId)
        ).pipe(
            map(res => {
                if (res.error) return { data: null, error: res.error };
                return {
                    data: {
                        progress: 0,
                        completed_contents: (res.data || []).map((row: { content_id: string }) => row.content_id),
                        certificate_id: undefined
                    },
                    error: null
                };
            }),
            switchMap(result => {
                if (result.error || !result.data) return of(result);
                
                let certQuery = this.supabase
                    .from('course_certificates')
                    .select('id')
                    .eq('course_id', courseId);

                if (trimmedEmail) {
                    certQuery = certQuery.eq('email', trimmedEmail);
                }

                return from(certQuery.maybeSingle()).pipe(
                    map(certRes => {
                        if (certRes.data) {
                            result.data!.certificate_id = certRes.data.id;
                            result.data!.progress = 100;
                        }
                        return result;
                    })
                );
            }),
            catchError(error => {
                this.logger.error(`Failed to get course progress for course: ${courseId}`, error);
                return of({ data: null, error });
            })
        );
    }

    markContentCompleted(contentId: string): Observable<{ data: { progress: number; completed: number; total: number; certificate_id?: string } | null, error: unknown }> {
        return from(this.supabase.rpc('mark_content_completed', { p_content_id: contentId })).pipe(
            map(res => {
                this.supabaseService.clearCacheForTable('course_progress');
                return { data: res.data, error: res.error };
            }),
            catchError(error => {
                this.logger.error(`Failed to mark content completed: ${contentId}`, error);
                return of({ data: null, error });
            })
        );
    }

    getCertificate(certId: string): Observable<{ data: unknown, error: unknown }> {
        return from(
            this.supabase
                .from('course_certificates')
                .select('*, courses(title)')
                .eq('id', certId)
                .single()
        ).pipe(
            map(res => ({ data: res.data, error: res.error })),
            catchError(error => {
                this.logger.error(`Failed to get certificate: ${certId}`, error);
                return of({ data: null, error });
            })
        );
    }
}
