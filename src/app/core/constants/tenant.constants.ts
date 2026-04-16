/**
 * Tenant and Multi-tenancy Constants
 */

export const TENANT_CONSTANTS = {
    /**
     * Fallback Tenant ID used when no specific tenant is identified
     * and we want to rely on RLS server-side identification.
     */
    FALLBACK_ID: '00000000-0000-0000-0000-000000000000',
    
    /**
     * Default storage buckets
     */
    BUCKETS: {
        PRODUCT_IMAGES: 'public-assets',
        REPAIR_IMAGES: 'repair-images',
        BRANDING: 'branding'
    },

    /**
     * List of hardcoded super admins for emergency/initial access
     */
    SUPER_ADMIN_EMAILS: [
        'ezequielenrico15@gmail.com',
        'ezequielenrico1015@hotmail.com'
    ],

    /**
     * Default Branch ID (Central)
     */
    DEFAULT_BRANCH_ID: '00000000-0000-0000-0000-000000000000'
};
