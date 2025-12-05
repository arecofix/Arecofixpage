/**
 * User Role Enum
 */
export enum UserRole {
    USER = 'user',
    STAFF = 'staff',
    ADMIN = 'admin'
}

/**
 * User Entity
 * Represents an authenticated user
 */
export interface User {
    id: string;
    email: string;
    role: UserRole;
    created_at: string;
    updated_at: string;
}

/**
 * User Profile Entity
 * Extended user information
 */
export interface UserProfile {
    id: string;
    email: string;
    first_name?: string;
    last_name?: string;
    display_name?: string;
    full_name?: string;
    avatar_url?: string;
    bio?: string;
    phone?: string;
    dni?: string;
    address?: string;
    job_title?: string;
    created_at: string;
    updated_at: string;
    is_active: boolean;
    role: UserRole;
}

/**
 * User profile update DTO
 */
export interface UpdateUserProfileDto {
    first_name?: string;
    last_name?: string;
    display_name?: string;
    avatar_url?: string;
    bio?: string;
    phone?: string;
    dni?: string;
    address?: string;
}
