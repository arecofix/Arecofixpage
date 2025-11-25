import { ErrorHandler, Injectable, inject } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { LoggerService } from '../services/logger.service';
import { NotificationService } from '../services/notification.service';
import {
    ApplicationError,
    ValidationError,
    AuthenticationError,
    AuthorizationError,
    NotFoundError,
    DatabaseError,
    NetworkError
} from './application.error';

/**
 * Global Error Handler
 * Catches all unhandled errors in the application
 */
@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
    private logger = inject(LoggerService);
    private notification = inject(NotificationService);

    handleError(error: Error | HttpErrorResponse): void {
        // Log the error
        this.logger.error('Unhandled error occurred', error);

        // Handle different error types
        if (error instanceof HttpErrorResponse) {
            this.handleHttpError(error);
        } else if (error instanceof ApplicationError) {
            this.handleApplicationError(error);
        } else {
            this.handleUnknownError(error);
        }
    }

    /**
     * Handle HTTP errors
     */
    private handleHttpError(error: HttpErrorResponse): void {
        let message: string;

        switch (error.status) {
            case 0:
                message = 'No se pudo conectar al servidor. Verifica tu conexión a internet.';
                break;
            case 400:
                message = 'Solicitud inválida. Por favor verifica los datos ingresados.';
                break;
            case 401:
                message = 'Sesión expirada. Por favor inicia sesión nuevamente.';
                break;
            case 403:
                message = 'No tienes permisos para realizar esta acción.';
                break;
            case 404:
                message = 'El recurso solicitado no fue encontrado.';
                break;
            case 500:
                message = 'Error del servidor. Por favor intenta nuevamente más tarde.';
                break;
            case 503:
                message = 'Servicio no disponible. Por favor intenta más tarde.';
                break;
            default:
                message = `Error inesperado (${error.status}). Por favor intenta nuevamente.`;
        }

        this.notification.showError(message);
    }

    /**
     * Handle application-specific errors
     */
    private handleApplicationError(error: ApplicationError): void {
        let message: string;

        if (error instanceof ValidationError) {
            message = error.message || 'Los datos ingresados no son válidos.';
        } else if (error instanceof AuthenticationError) {
            message = 'Error de autenticación. Por favor inicia sesión nuevamente.';
        } else if (error instanceof AuthorizationError) {
            message = 'No tienes permisos para realizar esta acción.';
        } else if (error instanceof NotFoundError) {
            message = error.message;
        } else if (error instanceof DatabaseError) {
            message = 'Error al acceder a la base de datos. Por favor intenta nuevamente.';
        } else if (error instanceof NetworkError) {
            message = 'Error de conexión. Verifica tu internet e intenta nuevamente.';
        } else {
            message = error.message || 'Ocurrió un error inesperado.';
        }

        this.notification.showError(message);
    }

    /**
     * Handle unknown errors
     */
    private handleUnknownError(error: Error): void {
        const message = 'Ocurrió un error inesperado. Por favor intenta nuevamente.';
        this.notification.showError(message);
    }
}
