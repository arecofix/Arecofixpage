import { TestBed } from '@angular/core/testing';
import { RegisterAcademyPaymentUseCase } from './register-academy-payment.usecase';
import { AcademyPaymentRepository } from '../../domain/repositories/academy-payment.repository';

describe('RegisterAcademyPaymentUseCase', () => {
  let useCase: RegisterAcademyPaymentUseCase;
  let mockPaymentRepo: jest.Mocked<AcademyPaymentRepository>;

  beforeEach(() => {
    mockPaymentRepo = {
      registerPayment: jest.fn(),
      getPaymentsByEnrollment: jest.fn(),
      getAllPayments: jest.fn()
    } as jest.Mocked<AcademyPaymentRepository>;

    TestBed.configureTestingModule({
      providers: [
        RegisterAcademyPaymentUseCase,
        { provide: AcademyPaymentRepository, useValue: mockPaymentRepo }
      ]
    });

    useCase = TestBed.inject(RegisterAcademyPaymentUseCase);
  });

  it('debe registrar un pago exitosamente', async () => {
    const mockResult = {
      paymentId: 'pay-123',
      receiptNumber: 'REC-ACAD-20261105-ABCDEF',
      enrollmentId: 'enr-456',
      amount: 50000,
      periodNumber: 1,
      installmentsPaid: 1,
      installmentsCount: 3,
      nextDueDate: '2026-12-05T00:00:00Z',
      paymentPlanStatus: 'in_progress'
    };

    mockPaymentRepo.registerPayment.mockResolvedValueOnce(mockResult);

    const res = await useCase.execute({
      enrollmentId: 'enr-456',
      amount: 50000,
      paymentMethod: 'cash',
      createdBy: 'user-admin'
    });

    expect(res.success).toBe(true);
    expect(res.data).toEqual(mockResult);
    expect(mockPaymentRepo.registerPayment).toHaveBeenCalledWith(expect.objectContaining({
      enrollmentId: 'enr-456',
      amount: 50000,
      paymentMethod: 'cash',
      createdBy: 'user-admin'
    }));
  });

  it('debe fallar si el ID de matrícula está vacío', async () => {
    const res = await useCase.execute({
      enrollmentId: '',
      amount: 50000,
      paymentMethod: 'cash',
      createdBy: 'user-admin'
    });

    expect(res.success).toBe(false);
    expect(res.error).toBe('El ID de matrícula es obligatorio');
    expect(mockPaymentRepo.registerPayment).not.toHaveBeenCalled();
  });

  it('debe fallar si createdBy está vacío', async () => {
    const res = await useCase.execute({
      enrollmentId: 'enr-1',
      amount: 50000,
      paymentMethod: 'cash',
      createdBy: '   '
    });

    expect(res.success).toBe(false);
    expect(res.error).toBe('El usuario operador (createdBy) es obligatorio');
    expect(mockPaymentRepo.registerPayment).not.toHaveBeenCalled();
  });

  it('debe fallar si paymentMethod está vacío', async () => {
    const res = await useCase.execute({
      enrollmentId: 'enr-1',
      amount: 50000,
      paymentMethod: '',
      createdBy: 'admin'
    });

    expect(res.success).toBe(false);
    expect(res.error).toBe('El método de pago es obligatorio');
    expect(mockPaymentRepo.registerPayment).not.toHaveBeenCalled();
  });

  it('debe fallar si el monto es <= 0 o inválido', async () => {
    const resZero = await useCase.execute({
      enrollmentId: 'enr-1',
      amount: 0,
      paymentMethod: 'cash',
      createdBy: 'admin'
    });
    expect(resZero.success).toBe(false);
    expect(resZero.error).toBe('El monto a registrar debe ser estrictamente mayor a 0');

    const resNegative = await useCase.execute({
      enrollmentId: 'enr-1',
      amount: -100,
      paymentMethod: 'cash',
      createdBy: 'admin'
    });
    expect(resNegative.success).toBe(false);
    expect(resNegative.error).toBe('El monto no puede ser negativo');
  });

  it('debe capturar errores arrojados por el repositorio', async () => {
    mockPaymentRepo.registerPayment.mockRejectedValueOnce(new Error('La matrícula ya está completada'));

    const res = await useCase.execute({
      enrollmentId: 'enr-1',
      amount: 50000,
      paymentMethod: 'cash',
      createdBy: 'admin'
    });

    expect(res.success).toBe(false);
    expect(res.error).toBe('La matrícula ya está completada');
  });
});

