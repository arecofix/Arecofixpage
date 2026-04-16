import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { NotificationService } from '../services/notification.service';
import { LoggerService } from '../services/logger.service';

/**
 * Global HTTP Interceptor (Funcional Angular 15+)
 * Captura y estandariza errores que pudiesen escapar a Supabase (ej: pagos, websockets, apis externas)
 */
export const globalErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const notification = inject(NotificationService);
  const logger = inject(LoggerService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      logger.error(`Error HTTP interceptado: ${req.url}`, error);
      
      // Manejo específico si el error viene con un payload estructurado
      let errorMsg = 'Error en el servidor o red.';
      if (error.error && error.error.message) {
        errorMsg = error.error.message;
      } else if (error.status === 401) {
        errorMsg = 'Tu sesión ha expirado.';
      } else if (error.status === 403) {
        errorMsg = 'No tienes permisos suficientes.';
      } else if (error.status >= 500) {
        errorMsg = 'Fallo crítico en el servidor de destino.';
      }

      // Notificación inmediata sin frenar el flujo del GlobalErrorHandler principal
      notification.showError(errorMsg);

      // Relanzar para que lo atrape y registre el GlobalErrorHandler final
      return throwError(() => error);
    })
  );
};
