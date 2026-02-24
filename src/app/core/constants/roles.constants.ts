export const ROLES = {
    SUPER_ADMIN: 'super_admin',
    TENANT_OWNER: 'tenant_owner',
    TECHNICIAN: 'technician',
    STAFF: 'staff',
    USER: 'user',
    ADMIN: 'admin' // Deprecated, keeping for compatibility during migration
} as const;

export type Role = typeof ROLES[keyof typeof ROLES];
