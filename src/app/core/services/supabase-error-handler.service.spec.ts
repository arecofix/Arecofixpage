import { TestBed } from '@angular/core/testing';
import { SupabaseErrorHandlerService } from './supabase-error-handler.service';
import { NotificationService } from './notification.service';
import { LoggerService } from './logger.service';
import { DatabaseError } from '../errors/application.error';

describe('SupabaseErrorHandlerService', () => {
  let service: SupabaseErrorHandlerService;
  let notificationMock: { showError: jest.Mock };
  let loggerMock: { error: jest.Mock; warn: jest.Mock };

  beforeEach(() => {
    notificationMock = { showError: jest.fn() };
    loggerMock = { error: jest.fn(), warn: jest.fn() };

    TestBed.configureTestingModule({
      providers: [
        SupabaseErrorHandlerService,
        { provide: NotificationService, useValue: notificationMock },
        { provide: LoggerService, useValue: loggerMock }
      ]
    });

    service = TestBed.inject(SupabaseErrorHandlerService);
  });

  it('should map PGRST204 to a schema column error message instead of generic message', () => {
    const error = {
      code: 'PGRST204',
      message: "Column 'garantia_meses' of relation 'products' does not exist",
      details: null
    };

    expect(() => {
      service.handleError(error, 'testContext');
    }).toThrow(DatabaseError);

    expect(notificationMock.showError).toHaveBeenCalledWith(
      expect.stringContaining("Error de esquema en la base de datos: columna inexistente")
    );
  });

  it('should map 23505 to unique violation message', () => {
    const error = { code: '23505', message: 'duplicate key value violates unique constraint' };

    expect(() => {
      service.handleError(error, 'testContext');
    }).toThrow(DatabaseError);

    expect(notificationMock.showError).toHaveBeenCalledWith(
      'Ya existe un registro con estos datos (código o valor duplicado).'
    );
  });

  it('should map 42501 to permission denied message', () => {
    const error = { code: '42501', message: 'permission denied for table products' };

    expect(() => {
      service.handleError(error, 'testContext');
    }).toThrow(DatabaseError);

    expect(notificationMock.showError).toHaveBeenCalledWith(
      'No tienes permisos para realizar esta acción.'
    );
  });

  it('should map 23502 to missing mandatory field message', () => {
    const error = { code: '23502', message: 'null value in column "name" violates not-null constraint' };

    expect(() => {
      service.handleError(error, 'testContext');
    }).toThrow(DatabaseError);

    expect(notificationMock.showError).toHaveBeenCalledWith(
      'Falta completar un campo obligatorio requerido por la base de datos.'
    );
  });

  it('should map 23514 to check constraint validation error', () => {
    const error = { code: '23514', message: 'new row violates check constraint "products_price_check"' };

    expect(() => {
      service.handleError(error, 'testContext');
    }).toThrow(DatabaseError);

    expect(notificationMock.showError).toHaveBeenCalledWith(
      'Uno de los valores ingresados no cumple las reglas de validación (ej: precio negativo).'
    );
  });

  it('should map network failure to connection error message', () => {
    const error = { message: 'TypeError: Failed to fetch' };

    expect(() => {
      service.handleError(error, 'testContext');
    }).toThrow(DatabaseError);

    expect(notificationMock.showError).toHaveBeenCalledWith(
      'Error de conexión. Verifica tu internet.'
    );
  });
});
