import { Injectable, inject } from '@angular/core';
import { from, Observable, of } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { Course, CourseModule, StudentEnrollment, CourseModuleContent, CourseExamQuestion, CourseExamSubmission } from '@app/features/courses/domain/entities/course.entity';
import { CourseRepository } from '@app/features/courses/domain/repositories/course.repository';
import { LoggerService } from './logger.service';
import { TenantService } from './tenant.service';
import { SUPABASE_CLIENT } from '@app/core/di/supabase-token';

export type { Course, CourseModule as Module, StudentEnrollment, CourseModuleContent, CourseExamQuestion, CourseExamSubmission };

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
                
                // 3. Create explicit Admin Notification
                await this.supabase.from('notifications').insert({
                    title: '🎓 Nueva Inscripción a Curso',
                    message: `${data.full_name} se ha inscripto al curso de ${data.course_title || 'N/A'}.`,
                    type: 'info',
                    scope: 'admin',
                    is_read: false,
                    tenant_id: this.tenantService.getTenantId()
                });
            } catch (msgErr) {
                this.logger.error('Failed to create secondary contact message or notification for enrollment', msgErr);
            }

            return { data: result, error: null };
        } catch (error) {
            this.logger.error('Error registering student', error);
            return { data: null, error };
        }
    }

    getEnrollments(): Observable<{ data: StudentEnrollment[], error: any }> {
        return from(this.repository.getEnrollments()).pipe(
            map(data => ({ data, error: null })),
            catchError(error => {
                this.logger.error('Failed to fetch enrollments', error);
                return of({ data: [], error });
            })
        );
    }

    getUserEnrolledCourses(email: string): Observable<{ data: StudentEnrollment[], error: any }> {
        const tenantId = this.tenantService.getTenantId();
        const trimmedEmail = (email || '').trim();
        let query = this.supabase.from('course_enrollments').select(`
            *,
            course:courses(id, title, slug, image_url, short_description)
        `)
        .ilike('email', trimmedEmail)
        .eq('status', 'confirmed')
        .order('created_at', { ascending: false });

        if (tenantId && tenantId !== '00000000-0000-0000-0000-000000000000') {
            query = query.or(`tenant_id.eq.${tenantId},tenant_id.is.null`);
        }

        return from(query).pipe(
            map(({ data, error }) => {
                if (error) throw error;
                return { data: (data || []) as any[], error: null };
            }),
            catchError(error => {
                this.logger.error('Failed to fetch user enrolled courses', error);
                return of({ data: [], error });
            })
        );
    }

    searchUsersByEmail(query: string): Observable<{ data: any[], error: any }> {
        const trimmed = (query || '').trim();
        // Search by email OR by first/last name — no tenant filter so admin can find any registered user
        const dbQuery = this.supabase.from('profiles')
            .select('id, email, first_name, last_name, full_name, phone, avatar_url, role')
            .or(`email.ilike.%${trimmed}%,first_name.ilike.%${trimmed}%,last_name.ilike.%${trimmed}%`)
            .limit(15);

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
     * Checks directly in course_enrollments if a confirmed enrollment exists
     * for the given email + courseId. This is the canonical way to gate campus access.
     */
    async checkEnrollment(courseId: string, email: string): Promise<{ enrolled: boolean, error: unknown }> {
        const trimmedEmail = (email || '').trim();
        console.log('[checkEnrollment] checking:', { courseId, email: trimmedEmail });
        const { data, error } = await this.supabase
            .from('course_enrollments')
            .select('id, status')
            .eq('course_id', courseId)
            .ilike('email', trimmedEmail)
            .eq('status', 'confirmed')
            .maybeSingle();
        console.log('[checkEnrollment] result:', { data, error });
        if (error) {
            this.logger.error('checkEnrollment failed', error);
            return { enrolled: false, error };
        }
        return { enrolled: !!data, error: null };
    }

    async enrollStudentManually(courseId: string, email: string, fullName: string, phone?: string): Promise<{ data: any, error: any }> {
        const enrollment: StudentEnrollment = {
            course_id: courseId,
            full_name: fullName,
            email: email,
            phone: phone || '',
            status: 'confirmed',
            tenant_id: this.tenantService.getTenantId()
        };
        try {
            const result = await this.repository.enrollStudent(enrollment);
            return { data: result, error: null };
        } catch (error) {
            this.logger.error('Failed to manually enroll student', error);
            return { data: null, error };
        }
    }

    assignInstructors(courseId: string, instructorIds: string[]): Observable<{ error: any }> {
        const tenantId = this.tenantService.getTenantId();
        return from(this.repository.assignInstructors(courseId, instructorIds, tenantId)).pipe(
            map(() => ({ error: null })),
            catchError(error => {
                this.logger.error(`Failed to assign instructors to course: ${courseId}`, error);
                return of({ error });
            })
        );
    }

    getCourseInstructors(courseId: string): Observable<{ data: any[], error: any }> {
        return from(this.repository.getCourseInstructors(courseId)).pipe(
            map(data => ({ data, error: null })),
            catchError(error => {
                this.logger.error(`Failed to fetch instructors for course: ${courseId}`, error);
                return of({ data: [], error });
            })
        );
    }

    getModuleContents(moduleId: string): Observable<{ data: any[], error: any }> {
        return from(this.repository.getModuleContents(moduleId)).pipe(
            map(data => ({ data, error: null })),
            catchError(error => {
                this.logger.error(`Failed to fetch contents for module: ${moduleId}`, error);
                return of({ data: [], error });
            })
        );
    }

    saveModuleContents(moduleId: string, contents: any[]): Observable<{ data: any[], error: any }> {
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
     * Loads all modules for a course AND their contents in parallel.
     * Returns modules with a `contents` array attached to each one.
     * Used by the public course detail page to render the real syllabus.
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
                return from(Promise.all(contentRequests.map(obs => obs.toPromise()))).pipe(
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
    
    getExamQuestions(contentId: string): Observable<{ data: any[], error: any }> {
        return from(this.supabase.rpc('get_exam_questions', { p_content_id: contentId })).pipe(
            map(res => ({ data: res.data || [], error: res.error })),
            catchError(error => {
                this.logger.error(`Failed to get exam questions for content: ${contentId}`, error);
                return of({ data: [], error });
            })
        );
    }

    saveExamQuestions(contentId: string, questions: Partial<CourseExamQuestion>[]): Observable<{ data: any[], error: any }> {
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
            map(res => ({ data: res.data || [], error: res.error })),
            catchError(error => {
                this.logger.error(`Failed to save exam questions for content: ${contentId}`, error);
                return of({ data: [], error });
            })
        );
    }

    submitExam(contentId: string, answers: { question_id: string, selected_index: number }[]): Observable<{ data: any, error: any }> {
        return from(this.supabase.rpc('submit_exam', { p_content_id: contentId, p_answers: answers })).pipe(
            map(res => ({ data: res.data, error: res.error })),
            catchError(error => {
                this.logger.error(`Failed to submit exam for content: ${contentId}`, error);
                return of({ data: null, error });
            })
        );
    }

    getCourseProgress(courseId: string): Observable<{ data: { progress: number, completed_contents: string[], certificate_id?: string } | null, error: any }> {
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
                        progress: 0, // Calculated on the frontend or backend
                        completed_contents: res.data.map((row: any) => row.content_id),
                        certificate_id: undefined // Checked separately if needed, or we fetch from course_certificates
                    },
                    error: null
                };
            }),
            switchMap(result => {
                if (result.error || !result.data) return of(result);
                // Also check if certificate exists
                return from(
                    this.supabase
                        .from('course_certificates')
                        .select('id')
                        .eq('course_id', courseId)
                        .maybeSingle()
                ).pipe(
                    map(certRes => {
                        if (certRes.data) {
                            result.data!.certificate_id = certRes.data.id;
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

    markContentCompleted(contentId: string): Observable<{ data: any, error: any }> {
        return from(this.supabase.rpc('mark_content_completed', { p_content_id: contentId })).pipe(
            map(res => ({ data: res.data, error: res.error })),
            catchError(error => {
                this.logger.error(`Failed to mark content completed: ${contentId}`, error);
                return of({ data: null, error });
            })
        );
    }

    getCertificate(certId: string): Observable<{ data: any, error: any }> {
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
