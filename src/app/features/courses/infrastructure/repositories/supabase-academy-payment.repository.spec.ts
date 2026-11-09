import { TestBed } from '@angular/core/testing';
import { SupabaseAcademyPaymentRepository } from './supabase-academy-payment.repository';
import { TenantScopedQueryService } from '@app/core/infrastructure/supabase/tenant-scoped-query.service';

describe('SupabaseAcademyPaymentRepository', () => {
  let repository: SupabaseAcademyPaymentRepository;
  let mockRpc: jest.Mock;
  let mockFrom: jest.Mock;

  beforeEach(() => {
    mockRpc = jest.fn();
    mockFrom = jest.fn();

    const mockTenantScopedQueryService = {
      client: {
        rpc: mockRpc
      },
      from: mockFrom
    };

    TestBed.configureTestingModule({
      providers: [
        SupabaseAcademyPaymentRepository,
        { provide: TenantScopedQueryService, useValue: mockTenantScopedQueryService }
      ]
    });

    repository = TestBed.inject(SupabaseAcademyPaymentRepository);
  });

  describe('registerPayment', () => {
    it('debe invocar la RPC register_academy_payment con los parámetros correctos y retornar el resultado mapeado', async () => {
      mockRpc.mockResolvedValueOnce({
        data: {
          payment_id: 'pay-uuid-1',
          receipt_number: 'REC-ACAD-20261105-001122',
          enrollment_id: 'enr-uuid-1',
          amount: '50000',
          period_number: 1,
          installments_paid: 1,
          installments_count: 3,
          next_due_date: '2026-12-05T00:00:00Z',
          payment_plan_status: 'in_progress'
        },
        error: null
      });

      const fixedDate = new Date('2026-11-05T10:00:00Z');
      const result = await repository.registerPayment({
        enrollmentId: 'enr-uuid-1',
        amount: 50000,
        paymentMethod: 'cash',
        paidAt: fixedDate,
        periodNumber: 1,
        notes: 'Pago cuota 1',
        createdBy: 'user-operator-1'
      });

      expect(mockRpc).toHaveBeenCalledWith('register_academy_payment', {
        p_enrollment_id: 'enr-uuid-1',
        p_amount: 50000,
        p_payment_method: 'cash',
        p_paid_at: fixedDate.toISOString(),
        p_period_number: 1,
        p_notes: 'Pago cuota 1',
        p_created_by: 'user-operator-1'
      });

      expect(result).toEqual({
        paymentId: 'pay-uuid-1',
        receiptNumber: 'REC-ACAD-20261105-001122',
        enrollmentId: 'enr-uuid-1',
        amount: 50000,
        periodNumber: 1,
        installmentsPaid: 1,
        installmentsCount: 3,
        nextDueDate: '2026-12-05T00:00:00Z',
        paymentPlanStatus: 'in_progress'
      });
    });

    it('debe lanzar excepción si la RPC retorna error', async () => {
      mockRpc.mockResolvedValueOnce({
        data: null,
        error: { message: 'La matrícula ya está completada' }
      });

      await expect(repository.registerPayment({
        enrollmentId: 'enr-1',
        amount: 1000,
        paymentMethod: 'cash',
        createdBy: 'admin'
      })).rejects.toThrow('La matrícula ya está completada');
    });
  });

  describe('getPaymentsByEnrollment', () => {
    it('debe consultar la tabla academy_payments filtrando por enrollment_id', async () => {
      const mockChain = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValueOnce({
          data: [{ id: 'p1', amount: 50000 }],
          error: null
        })
      };
      mockFrom.mockReturnValue(mockChain);

      const payments = await repository.getPaymentsByEnrollment('enr-1');
      expect(mockFrom).toHaveBeenCalledWith('academy_payments');
      expect(mockChain.eq).toHaveBeenCalledWith('enrollment_id', 'enr-1');
      expect(payments).toHaveLength(1);
      expect(payments[0].amount).toBe(50000);
    });
  });

  describe('getAllPayments', () => {
    it('debe consultar todos los pagos ordenados por paid_at descendente', async () => {
      const mockChain = {
        select: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValueOnce({
          data: [{ id: 'p1' }, { id: 'p2' }],
          error: null
        })
      };
      mockFrom.mockReturnValue(mockChain);

      const payments = await repository.getAllPayments();
      expect(mockFrom).toHaveBeenCalledWith('academy_payments');
      expect(payments).toHaveLength(2);
    });
  });

  describe('voidPayment', () => {
    it('debe invocar la RPC void_academy_payment y retornar el resultado', async () => {
      mockRpc.mockResolvedValueOnce({
        data: {
          payment_id: 'p-1',
          status: 'refunded',
          enrollment_id: 'e-1',
          installments_paid: 0,
          payment_plan_status: 'pending_payment',
          next_due_date: '2026-11-05T00:00:00Z',
          cash_movement_id: 'cm-1'
        },
        error: null
      });

      const res = await repository.voidPayment('p-1', 'admin-id', 'Error de tipeo');

      expect(mockRpc).toHaveBeenCalledWith('void_academy_payment', {
        p_payment_id: 'p-1',
        p_user_id_admin: 'admin-id',
        p_reason: 'Error de tipeo'
      });

      expect(res.status).toBe('refunded');
      expect(res.installmentsPaid).toBe(0);
    });

    it('debe propagar error si la anulación falla', async () => {
      mockRpc.mockResolvedValueOnce({
        data: null,
        error: { message: 'Solo se pueden anular pagos con estado approved' }
      });

      await expect(repository.voidPayment('p-1', 'admin-id', 'Error')).rejects.toThrow('Solo se pueden anular pagos con estado approved');
    });
  });
});

