/**
 * Strict Types for Type Safety
 * Replaces all 'any' usage with proper interfaces
 */

// Domain Types
export interface Tenant {
  id: string;
  name: string;
  slug: string;
  database: {
    schema: string;
  };
  isMain: boolean;
  settings?: Record<string, unknown>;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: string;
  tenant_id?: string;
  branch_id?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CourseData {
  title: string;
  description: string;
  duration: string;
  schedule: string;
  level: string;
  price: number;
  sale_price?: number;
  image_url: string;
  instructor_name?: string;
  is_active?: boolean;
}

export interface ModuleData {
  id?: string;
  title: string;
  description: string;
  order: number;
  course_id?: string;
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  error?: {
    message: string;
    code?: string;
    details?: unknown;
  };
}

export interface PaginatedResponse<T> {
  data: T[];
  count: number;
  page: number;
  totalPages: number;
}

// Form Types
export interface ContactForm {
  name: string;
  email: string;
  phone?: string;
  message: string;
  subject?: string;
}

export interface ProjectData {
  id: string;
  title: string;
  description: string;
  images: string[];
  category: string;
  featured: boolean;
  order: number;
}

// Type Guards
export function isValidTenant(obj: unknown): obj is Tenant {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'id' in obj &&
    'name' in obj &&
    'slug' in obj &&
    'database' in obj &&
    'isMain' in obj &&
    typeof (obj as any).id === 'string' &&
    typeof (obj as any).name === 'string' &&
    typeof (obj as any).slug === 'string'
  );
}

export function isValidUserProfile(obj: unknown): obj is UserProfile {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'id' in obj &&
    'email' in obj &&
    'name' in obj &&
    'role' in obj &&
    typeof (obj as any).id === 'string' &&
    typeof (obj as any).email === 'string' &&
    typeof (obj as any).name === 'string' &&
    typeof (obj as any).role === 'string'
  );
}

export function isValidContactForm(obj: unknown): obj is ContactForm {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'name' in obj &&
    'email' in obj &&
    'message' in obj &&
    typeof (obj as any).name === 'string' &&
    typeof (obj as any).email === 'string' &&
    typeof (obj as any).message === 'string'
  );
}
