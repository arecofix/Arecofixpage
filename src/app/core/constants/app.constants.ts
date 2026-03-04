/**
 * Application Constants
 * Centralized location for all magic strings and configuration values
 */

// API Endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REGISTER: '/auth/register',
    REFRESH: '/auth/refresh',
    PROFILE: '/auth/profile'
  },
  USERS: {
    BASE: '/users',
    PROFILE: '/users/profile',
    SETTINGS: '/users/settings'
  },
  PRODUCTS: {
    BASE: '/products',
    SEARCH: '/products/search',
    CATEGORIES: '/products/categories',
    BRANDS: '/products/brands'
  },
  ORDERS: {
    BASE: '/orders',
    INVOICES: '/orders/invoices',
    STATUS: '/orders/status'
  },
  COURSES: {
    BASE: '/courses',
    MODULES: '/courses/modules',
    ENROLLMENTS: '/courses/enrollments'
  },
  TENANTS: {
    BASE: '/tenants',
    SWITCH: '/tenants/switch',
    SETTINGS: '/tenants/settings'
  }
} as const;

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503
} as const;

// User Roles
export const USER_ROLES = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
  BRANCH_ADMIN: 'branch_admin',
  EMPLOYEE: 'employee',
  USER: 'user'
} as const;

// Order Status
export const ORDER_STATUS = {
  PENDING: 'pending',
  PAID: 'paid',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
  REFUNDED: 'refunded'
} as const;

// Payment Methods
export const PAYMENT_METHODS = {
  CASH: 'efectivo',
  TRANSFER: 'transferencia',
  CREDIT_CARD: 'tarjeta',
  MERCADO_PAGO: 'mercadopago',
  OTHER: 'otro'
} as const;

// Course Levels
export const COURSE_LEVELS = {
  BASIC: 'basico',
  INTERMEDIATE: 'intermedio',
  ADVANCED: 'avanzado',
  EXPERT: 'experto'
} as const;

// File Upload Limits
export const UPLOAD_LIMITS = {
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
  ALLOWED_DOCUMENT_TYPES: ['application/pdf', 'text/plain'],
  MAX_IMAGES_PER_PRODUCT: 10
} as const;

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
  DEFAULT_PAGE: 1
} as const;

// Cache Keys
export const CACHE_KEYS = {
  USER_PROFILE: 'user_profile',
  CURRENT_TENANT: 'current_tenant',
  PRODUCT_CATALOG: 'product_catalog',
  COURSE_LIST: 'course_list',
  USER_PREFERENCES: 'user_preferences'
} as const;

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  REFRESH_TOKEN: 'refresh_token',
  CURRENT_TENANT: 'current_tenant',
  USER_PREFERENCES: 'user_preferences',
  CART_ITEMS: 'cart_items',
  RECENT_SEARCHES: 'recent_searches'
} as const;

// Validation Patterns
export const VALIDATION_PATTERNS = {
  EMAIL: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  PHONE: /^[+]?[\d\s\-\(\)]+$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  SLUG: /^[a-z0-9-]+$/,
  UUID: /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Error de conexión. Por favor, verifica tu internet.',
  UNAUTHORIZED: 'No tienes permisos para realizar esta acción.',
  NOT_FOUND: 'El recurso solicitado no fue encontrado.',
  VALIDATION_ERROR: 'Por favor, verifica los datos ingresados.',
  SERVER_ERROR: 'Error interno del servidor. Intenta nuevamente más tarde.',
  FILE_TOO_LARGE: 'El archivo es demasiado grande. Máximo 10MB.',
  INVALID_FILE_TYPE: 'Tipo de archivo no permitido.',
  SESSION_EXPIRED: 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.'
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  SAVED: 'Datos guardados correctamente.',
  DELETED: 'Elemento eliminado correctamente.',
  UPDATED: 'Datos actualizados correctamente.',
  UPLOADED: 'Archivo subido correctamente.',
  EMAIL_SENT: 'Email enviado correctamente.'
} as const;

// Animation Durations (ms)
export const ANIMATION_DURATIONS = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
  EXTRA_SLOW: 1000
} as const;

// Breakpoints
export const BREAKPOINTS = {
  XS: 0,
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  XXL: 1536
} as const;

// Theme
export const THEME = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system'
} as const;

// Environment-specific constants
export const ENVIRONMENT = {
  PRODUCTION: 'production',
  DEVELOPMENT: 'development',
  STAGING: 'staging'
} as const;
