export type CourseLevel = 'Básico' | 'Intermedio' | 'Avanzado' | 'Todos los niveles';

export interface Course {
    id: string;
    title: string;
    slug: string;
    description: string;
    duration: string;
    schedule: string;
    level: CourseLevel;
    price: number;
    sale_price?: number;
    image_url: string;
    instructor_name?: string;
    rating?: number;
    students?: number;
    is_active?: boolean;
    tenant_id?: string;
    created_at?: string;
}

export interface CourseModule {
    id: string;
    course_id: string;
    title: string;
    description: string;
    order_index: number;
    tenant_id?: string;
    created_at?: string;
}

export interface StudentEnrollment {
    id?: string;
    course_id: string;
    full_name: string;
    email: string;
    phone: string;
    status: 'pending' | 'confirmed' | 'rejected';
    tenant_id?: string;
    created_at?: string;
}
