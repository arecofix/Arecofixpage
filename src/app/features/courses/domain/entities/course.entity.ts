export enum CourseLevel {
  BASIC = 'basic',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
  ALL_LEVELS = 'all'
}

export type CourseUnlockStrategy = 'ALL_AT_ONCE' | 'SEQUENTIAL';

export type StudentMembershipStatus = 'active' | 'grace_period' | 'suspended' | 'expired';

export interface CourseExamMetadata {
  passing_score?: number;
  time_limit_minutes?: number;
  max_attempts?: number;
  questions?: CourseExamQuestion[];
  instructions?: string;
  [key: string]: unknown;
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
    syllabus?: unknown;
    benefits?: unknown;
    rating?: number;
    students?: number;
    
    // Customization & strategy fields
    unlock_strategy?: CourseUnlockStrategy;
    classes_count?: number;
    hours_content?: number;
    hours_practice?: number;
    hours_per_week?: string;
    instructor_role?: string;
    instructor_bio?: string;
    instructor_avatar?: string;
    audience_list?: string[];
    reviews_count?: number;

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
    unlock_date?: string | null;  // null = desbloqueado por estrategia pedagógica; ISO string = programado/activo
    tenant_id?: string;
    created_at?: string;
}

export type EnrollmentStatus = 'pending' | 'confirmed' | 'rejected' | 'in_progress' | 'completed' | 'cancelled';

export interface StudentEnrollment {
    id?: string;
    course_id: string;
    user_id?: string | null;
    full_name: string;
    email: string;
    phone?: string;
    status: EnrollmentStatus;
    tenant_id?: string;
    created_at?: string;
    course?: { 
      id?: string; 
      title: string; 
      slug?: string; 
      image_url?: string; 
      short_description?: string;
      unlock_strategy?: CourseUnlockStrategy;
      is_active?: boolean;
    };
    certificate?: {
      id?: string;
      pdf_url?: string;
      issued_at?: string;
    };
    progress?: number;
}

export interface CourseInstructor {
    course_id: string;
    instructor_id: string;
    tenant_id?: string;
    assigned_at?: string;
}

export interface CourseModuleContent {
    id: string;
    module_id: string; // References CourseModule.id
    tenant_id?: string;
    type: 'video' | 'image' | 'document' | 'link' | 'text' | 'exam';
    url: string;
    metadata?: CourseExamMetadata;
    title?: string;
    order_index: number;
    created_at?: string;
}

export interface CourseExamQuestion {
    id: string;
    content_id: string;
    question_text: string;
    options: string[];
    correct_option_index: number;
    order_index: number;
    tenant_id?: string;
}

export interface CourseExamSubmission {
    id?: string;
    content_id: string;
    email: string;
    answers: { question_id: string; selected_index: number }[];
    score: number;
    passed: boolean;
    tenant_id?: string;
    created_at?: string;
}

export interface CourseProgressRecord {
    id?: string;
    tenant_id: string;
    email: string;
    course_id: string;
    content_id: string;
    user_id?: string | null;
    completed_at?: string;
}
