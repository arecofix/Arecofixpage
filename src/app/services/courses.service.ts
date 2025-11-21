import { Injectable } from '@angular/core';
import { SupabaseClient } from '@supabase/supabase-js';
import { from, Observable } from 'rxjs';
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
                .select('*')
            // .order('created_at', { ascending: false }) // Commented out to prevent issues if column is missing
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
}
