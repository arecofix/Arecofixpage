/**
 * Base Application Error
 * All custom errors should extend this class
 */
export class ApplicationError extends Error {
    constructor(
        message: string,
        public readonly code: string,
        public readonly statusCode: number = 500,
        public readonly details?: any
    ) {
        super(message);
        this.name = this.constructor.name;
        // Maintains proper stack trace for where our error was thrown (only available on V8)
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

/**
 * Validation Error
 * Thrown when input validation fails
 */
export class ValidationError extends ApplicationError {
    constructor(message: string, details?: any) {
        super(message, 'VALIDATION_ERROR', 400, details);
    }
}

/**
 * Authentication Error
 * Thrown when authentication fails
 */
export class AuthenticationError extends ApplicationError {
    constructor(message: string = 'Authentication failed', details?: any) {
        super(message, 'AUTHENTICATION_ERROR', 401, details);
    }
}

/**
 * Authorization Error
 * Thrown when user doesn't have permission
 */
export class AuthorizationError extends ApplicationError {
    constructor(message: string = 'Access denied', details?: any) {
        super(message, 'AUTHORIZATION_ERROR', 403, details);
    }
}

/**
 * Not Found Error
 * Thrown when a resource is not found
 */
export class NotFoundError extends ApplicationError {
    constructor(resource: string, identifier?: string) {
        const message = identifier
            ? `${resource} with identifier '${identifier}' not found`
            : `${resource} not found`;
        super(message, 'NOT_FOUND', 404);
    }
}

/**
 * Database Error
 * Thrown when database operations fail
 */
export class DatabaseError extends ApplicationError {
    constructor(message: string, details?: any) {
        super(message, 'DATABASE_ERROR', 500, details);
    }
}

/**
 * Network Error
 * Thrown when network requests fail
 */
export class NetworkError extends ApplicationError {
    constructor(message: string = 'Network request failed', details?: any) {
        super(message, 'NETWORK_ERROR', 503, details);
    }
}

/**
 * Business Logic Error
 * Thrown when business rules are violated
 */
export class BusinessLogicError extends ApplicationError {
    constructor(message: string, details?: any) {
        super(message, 'BUSINESS_LOGIC_ERROR', 422, details);
    }
}

/**
 * Configuration Error
 * Thrown when configuration is invalid
 */
export class ConfigurationError extends ApplicationError {
    constructor(message: string, details?: any) {
        super(message, 'CONFIGURATION_ERROR', 500, details);
    }
}
