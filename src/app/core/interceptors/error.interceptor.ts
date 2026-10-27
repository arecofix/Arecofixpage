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
      // Avoid showing global notification and error logs for silent fire-and-forget endpoints
      const silentEndpoints = ['/functions/v1/send-whatsapp', '/functions/v1/create-employee'];
      const isSilent = silentEndpoints.some(endpoint => req.url.includes(endpoint));

      if (!isSilent) {
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

        notification.showError(errorMsg);
      } else {
        logger.warn(`[SilentEndpoint] Error HTTP suprimido para ${req.url}: ${error.statusText || error.message}`);
      }

      // Relanzar para que lo atrape y registre el caller
      return throwError(() => error);
    })
  );
};
