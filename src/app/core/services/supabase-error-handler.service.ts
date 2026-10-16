import { Injectable, inject } from '@angular/core';
import { PostgrestError } from '@supabase/supabase-js';
import { NotificationService } from './notification.service';
import { LoggerService } from './logger.service';
import { DatabaseError } from '../errors/application.error';

@Injectable({
  providedIn: 'root'
})
export class SupabaseErrorHandlerService {
  private notification = inject(NotificationService);
  private logger = inject(LoggerService);

  /**
   * Standardized handling for Supabase/Postgrest errors.
   * Logs the error, notifies the user, and throws a DatabaseError.
   */
  handleError(error: PostgrestError | Error | any, context: string, suppressNotification: boolean = false): never {
    const message = error?.message || 'Ocurrió un error inesperado en la base de datos.';
    const details = error?.details || '';
    const code = error?.code || '';

    // Log for developers
    if (suppressNotification) {
      this.logger.warn(`[SupabaseError][${context}] (Suppressed) ${message}`, { code, details });
    } else {
      this.logger.error(`[SupabaseError][${context}] ${message}`, { code, details, error });
    }

    // User-friendly message mapping
    let userMessage = 'No se pudo completar la operación.';
    
    if (code === '23505') {
      userMessage = 'Ya existe un registro con estos datos (código o valor duplicado).';
    } else if (code === '42501') {
      userMessage = 'No tienes permisos para realizar esta acción.';
    } else if (code === '23502') {
      userMessage = 'Falta completar un campo obligatorio requerido por la base de datos.';
    } else if (code === '23503') {
      userMessage = 'La categoría, marca o relación seleccionada no existe en la base de datos.';
    } else if (code === '23514') {
      userMessage = 'Uno de los valores ingresados no cumple las reglas de validación (ej: precio negativo).';
    } else if (code === '22P02') {
      userMessage = 'Formato de datos no válido para la base de datos.';
    } else if (code === 'PGRST204') {
      userMessage = `Error de esquema en la base de datos: columna inexistente (${message}).`;
    } else if (code === 'PGRST116') {
      userMessage = 'No se encontró el registro solicitado.';
    } else if (message.toLowerCase().includes('failed to fetch')) {
      userMessage = 'Error de conexión. Verifica tu internet.';
    } else if (message && message !== 'Ocurrió un error inesperado en la base de datos.') {
      userMessage = message;
    }

    // Notify user if not suppressed
    if (!suppressNotification) {
      this.notification.showError(userMessage);
    }

    // Throw standard application error
    throw new DatabaseError(userMessage, error);
  }

  /**
   * Helper to wrap a Supabase response and handle errors automatically.
   */
  async wrapResponse<T>(promise: Promise<{ data: T | null; error: PostgrestError | null }>, context: string): Promise<T> {
    const { data, error } = await promise;
    if (error) {
      this.handleError(error, context);
    }
    return data as T;
  }
}
