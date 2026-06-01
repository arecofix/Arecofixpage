import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { throwError, TimeoutError } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';

const TIMEOUT_DURATION_MS = 8000; // 8 segundos de límite

export const timeoutInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    // 1. Límite de tiempo de espera
    timeout(TIMEOUT_DURATION_MS),
    
    // 2. Captura de errores (para transformar el TimeoutError)
    catchError((error) => {
      if (error instanceof TimeoutError) {
        const timeoutErrorResponse = new HttpErrorResponse({
          error: 'La petición tardó demasiado en responder.',
          status: 408,
          statusText: 'Request Timeout',
          url: req.url || ''
        });
        return throwError(() => timeoutErrorResponse);
      }
      return throwError(() => error);
    })
  );
};
