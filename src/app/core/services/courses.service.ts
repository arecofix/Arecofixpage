import { Injectable } from '@angular/core';
import { SupabaseClient } from '@supabase/supabase-js';
import { from, Observable, of } from 'rxjs';
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

    constructor(private authService: AuthService) {
        this.supabase = this.authService.getSupabaseClient();
    }

    getCourses(): Observable<any> {
        return from(
            this.supabase
                .from('courses')
                .select('id, title, slug, price, sale_price, level, is_active, image_url, created_at')
                .order('created_at', { ascending: false })
        );
    }

    getCourseBySlug(slug: string): Observable<any> {
        return from(
            this.supabase
                .from('courses')
                .select('*')
                .eq('slug', slug)
                .single()
        );
    }

    getCourseById(id: string): Observable<any> {
        return from(
            this.supabase
                .from('courses')
                .select('*')
                .eq('id', id)
                .single()
        );
    }

    createCourse(course: Partial<Course>): Observable<any> {
        return from(
            this.supabase
                .from('courses')
                .insert(course)
                .select()
                .single()
        );
    }

    updateCourse(id: string, course: Partial<Course>): Observable<any> {
        return from(
            this.supabase
                .from('courses')
                .update(course)
                .eq('id', id)
                .select()
                .single()
        );
    }

    deleteCourse(id: string): Observable<any> {
        return from(
            this.supabase
                .from('courses')
                .delete()
                .eq('id', id)
        );
    }

    // Methods from the previous core service (placeholders/mocks for now)
    getModulesByCourseId(courseId: string): Observable<{ data: Module[], error: any }> {
        // TODO: Implement actual API call with Supabase
        return of({
            data: [],
            error: null
        });
    }

    registerStudent(data: any): Observable<{ data: any, error: any }> {
        // TODO: Implement actual API call with Supabase
        return of({
            data: { success: true },
            error: null
        });
    }
}
