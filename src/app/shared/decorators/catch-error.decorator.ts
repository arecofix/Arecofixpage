import { inject } from '@angular/core';
import { NotificationService } from '@app/core/services/notification.service';
import { LoggerService } from '@app/core/services/logger.service';

/**
 * Decorador QA & Clean Architecture
 * Envuelve métodos asíncronos para capturar excepciones sin necesidad de escribir try/catch
 * y notifica automáticamente al NotificationService de Angular.
 * 
 * @example
 * \@CatchError('Error al crear reparación')
 * async createRepair() {
 *   await this.repairService.create(...);
 * }
 */
export function CatchAndNotify(friendlyMessage?: string) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      try {
        return await originalMethod.apply(this, args);
      } catch (error: any) {
        // En Angular, dado que los decoradores no tienen acceso al contexto del DI fácilmente
        // la mejor práctica para Service Locator temporal en métodos de UI es:
        try {
          const notification = (this as any).notificationService || (this as any).notification;
          const logger = (this as any).loggerService || (this as any).logger || console;
          
          if (logger && typeof logger.error === 'function') {
             logger.error(friendlyMessage || `Error in ${propertyKey}`, error);
          }
          if (notification && typeof notification.showError === 'function') {
             notification.showError(friendlyMessage || error.message || 'Ocurrió un problema inesperado.');
          } else {
             // Fallback si la clase no tiene inyectado el NotificationService
             console.error('[QA Boundary Fallback]', error);
             alert(friendlyMessage || 'Ha ocurrido un error (Ver consola)');
          }
        } catch (e) {
          console.error('Decorator failed to handle error boundary', e);
        }
        
        // Relanzar si se necesita atrapar externamente (poco común en UI bounds)
        throw error;
      }
    };
    return descriptor;
  };
}
