export enum CourseLevel {
  BASIC = 'basic',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
  ALL_LEVELS = 'all'
}

export interface Course {
    id: string;
    title: string;
    slug: string;
    description: string;
    short_description?: string;
    duration: string;
    schedule: string;
    level: CourseLevel | string;
    price: number;
    sale_price?: number;
    image_url: string;
    instructor_name?: string;
    instructor_id?: string;
    start_date?: string;
    is_featured?: boolean;
    syllabus?: any;
    benefits?: any;
    rating?: number;
    students?: number;
    is_active?: boolean;
    status?: 'DRAFT' | 'PENDING' | 'APPROVED' | 'REJECTED' | 'PUBLISHED';
    admin_feedback?: string;
    preview_video_url?: string;
    author_id?: string;
    tenant_id?: string;
    created_at?: string;
    updated_at?: string;
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
    course?: { id?: string; title: string; };
}

export interface CourseInstructor {
    course_id: string;
    instructor_id: string;
    tenant_id?: string;
    assigned_at?: string;
}

export interface CourseModuleContent {
    id: string;
    lesson_id: string; // References CourseModule.id
    tenant_id?: string;
    type: 'video' | 'image' | 'document' | 'link' | 'text';
    url: string;
    metadata?: any;
    title?: string;
    order_index: number;
    created_at?: string;
}
