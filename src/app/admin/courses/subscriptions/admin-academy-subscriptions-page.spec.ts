import { TestBed, ComponentFixture } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AdminAcademySubscriptionsPage, StudentEnrollmentRow } from './admin-academy-subscriptions-page';
import { SUPABASE_CLIENT } from '@app/core/di/supabase-token';
import { AuthService } from '@app/core/services/auth.service';
import { ToastService } from '@app/shared/services/toast.service';
import { CoursesService } from '@app/core/services/courses.service';
import { RegisterAcademyPaymentUseCase } from '@app/features/courses/application/usecases/register-academy-payment.usecase';
import { CreateEnrollmentUseCase } from '@app/features/courses/application/usecases/create-enrollment.usecase';
import { AcademyPaymentRepository } from '@app/features/courses/domain/repositories/academy-payment.repository';
import { ReceiptPdfService } from '@app/features/courses/application/services/receipt-pdf.service';
import { of } from 'rxjs';

describe('AdminAcademySubscriptionsPage (Fase 4 Acceptance Tests)', () => {
  let component: AdminAcademySubscriptionsPage;
  let fixture: ComponentFixture<AdminAcademySubscriptionsPage>;

  const mockSupabase = {
    from: jest.fn().mockReturnValue({
      select: jest.fn().mockReturnValue({
        order: jest.fn().mockResolvedValue({
          data: [
            {
              id: 'e1',
              user_id: 'u1',
              full_name: 'Emmanuel Romano',
              email: 'emmanuel@test.com',
              status: 'confirmed',
              agreed_price: 270000,
              installments_count: 3,
              installment_amount: 90000,
              installments_paid: 0,
              next_due_date: new Date(Date.now() - 20 * 86400000).toISOString(),
              payment_plan_status: 'pending_payment',
              created_at: new Date().toISOString(),
              courses: { id: 'c1', title: 'Reparación de Celulares' }
            },
            {
              id: 'e2',
              user_id: 'u2',
              full_name: 'Axel Chazarreta',
              email: 'axel@test.com',
              status: 'confirmed',
              agreed_price: 720000,
              installments_count: 6,
              installment_amount: 120000,
              installments_paid: 1,
              next_due_date: new Date(Date.now() + 20 * 86400000).toISOString(),
              payment_plan_status: 'active',
              created_at: new Date().toISOString(),
              courses: { id: 'c1', title: 'Reparación de Celulares' }
            },
            {
              id: 'e3',
              user_id: 'u3',
              full_name: 'Ezequiel Enrico',
              email: 'ezequielenrico15@gmail.com',
              status: 'confirmed',
              agreed_price: 0,
              installments_count: 1,
              installment_amount: 0,
              installments_paid: 0,
              next_due_date: null,
              payment_plan_status: 'scholarship',
              created_at: new Date().toISOString(),
              courses: { id: 'c1', title: 'Reparación de Celulares' }
            },
            {
              id: 'e4',
              user_id: 'u4',
              full_name: 'Gabriel Bravo',
              email: 'anatolli@gmail.com',
              status: 'confirmed',
              agreed_price: 0,
              installments_count: 1,
              installment_amount: 0,
              installments_paid: 0,
              next_due_date: null,
              payment_plan_status: 'cancelled',
              created_at: new Date().toISOString(),
              courses: { id: 'c1', title: 'Reparación de Celulares' }
            }
          ],
          error: null
        }),
        in: jest.fn().mockResolvedValue({ data: [], error: null })
      })
    })
  };

  const mockAuthService = {
    getCurrentProfile: jest.fn().mockReturnValue({ id: 'admin-1', role: 'admin' }),
    getSession: jest.fn().mockResolvedValue({ user: { id: 'admin-1' } })
  };

  const mockToastService = {
    show: jest.fn()
  };

  const mockCoursesService = {
    getCourses: jest.fn().mockReturnValue(of({ data: [{ id: 'c1', title: 'Reparación de Celulares', price: 120000, sale_price: 90000 }] }))
  };

  const mockRegisterPaymentUseCase = {
    execute: jest.fn().mockResolvedValue({
      success: true,
      data: {
        paymentId: 'pay-1',
        receiptNumber: 'REC-2026-0001',
        nextDueDate: new Date()
      }
    })
  };

  const mockCreateEnrollmentUseCase = {
    execute: jest.fn().mockResolvedValue({
      success: true,
      enrollment: { id: 'new-e1' }
    })
  };

  const mockPaymentRepo = {
    getPaymentsByEnrollment: jest.fn().mockResolvedValue([]),
    voidPayment: jest.fn().mockResolvedValue({ success: true })
  };

  const mockReceiptPdfService = {
    generateReceiptPdf: jest.fn().mockResolvedValue({
      blob: new Blob(),
      doc: { save: jest.fn() }
    }),
    uploadReceiptToStorage: jest.fn().mockResolvedValue('https://storage/receipts/REC-2026-0001.pdf')
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminAcademySubscriptionsPage],
      providers: [
        provideRouter([]),
        { provide: SUPABASE_CLIENT, useValue: mockSupabase },
        { provide: AuthService, useValue: mockAuthService },
        { provide: ToastService, useValue: mockToastService },
        { provide: CoursesService, useValue: mockCoursesService },
        { provide: RegisterAcademyPaymentUseCase, useValue: mockRegisterPaymentUseCase },
        { provide: CreateEnrollmentUseCase, useValue: mockCreateEnrollmentUseCase },
        { provide: AcademyPaymentRepository, useValue: mockPaymentRepo },
        { provide: ReceiptPdfService, useValue: mockReceiptPdfService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AdminAcademySubscriptionsPage);
    component = fixture.componentInstance;
  });

  it('should create AdminAcademySubscriptionsPage', () => {
    expect(component).toBeTruthy();
  });

  describe('4.1 Listado de Alumnos y Métricas Honestos', () => {
    it('should compute stats correctly without counting cancelled', async () => {
      await component.loadEnrollments();

      const stats = component.stats();
      expect(stats.total).toBe(3);
      expect(stats.active).toBe(1);
      expect(stats.suspended).toBe(1);
      expect(stats.scholarship).toBe(1);

      // Emmanuel is overdue by 20 days -> suspended
      expect(component.enrollments().find(e => e.id === 'e1')?.effective_status).toBe('suspended');
      // Gabriel Bravo is cancelled
      expect(component.enrollments().find(e => e.id === 'e4')?.effective_status).toBe('cancelled');
    });

    it('should filter enrollments by search query', async () => {
      await component.loadEnrollments();

      component.searchQuery.set('Axel');
      expect(component.filteredEnrollments().length).toBe(1);
      expect(component.filteredEnrollments()[0].full_name).toBe('Axel Chazarreta');
    });

    it('should filter enrollments by status filter', async () => {
      await component.loadEnrollments();

      component.selectedFilter.set('scholarship');
      expect(component.filteredEnrollments().length).toBe(1);
      expect(component.filteredEnrollments()[0].full_name).toBe('Ezequiel Enrico');
    });
  });

  describe('4.2 Registrar Cobro Oficial y Generar Recibo PDF', () => {
    it('should open payment modal with preloaded installment amount', () => {
      const row: StudentEnrollmentRow = {
        id: 'e1',
        user_id: 'u1',
        full_name: 'Emmanuel Romano',
        email: 'emmanuel@test.com',
        phone: null,
        dni: null,
        course_id: 'c1',
        course_title: 'Reparación de Celulares',
        status: 'confirmed',
        agreed_price: 120000,
        installments_count: 6,
        installment_amount: 20000,
        installments_paid: 0,
        next_due_date: '2026-12-01',
        expires_at: null,
        payment_plan_status: 'pending_payment',
        effective_status: 'pending_payment',
        notes: null,
        created_at: new Date().toISOString()
      };

      component.openPaymentModal(row);

      expect(component.showPaymentModal()).toBe(true);
      expect(component.selectedEnrollmentForPayment()).toEqual(row);
      expect(component.paymentAmount()).toBe(20000);
    });

    it('should execute RegisterAcademyPaymentUseCase and trigger PDF generation', async () => {
      const row: StudentEnrollmentRow = {
        id: 'e1',
        user_id: 'u1',
        full_name: 'Emmanuel Romano',
        email: 'emmanuel@test.com',
        phone: null,
        dni: null,
        course_id: 'c1',
        course_title: 'Reparación de Celulares',
        status: 'confirmed',
        agreed_price: 120000,
        installments_count: 6,
        installment_amount: 20000,
        installments_paid: 0,
        next_due_date: '2026-12-01',
        expires_at: null,
        payment_plan_status: 'pending_payment',
        effective_status: 'pending_payment',
        notes: null,
        created_at: new Date().toISOString()
      };

      component.openPaymentModal(row);
      component.paymentAmount.set(20000);
      component.paymentMethod.set('cash');
      component.generatePdfCheckbox.set(true);

      await component.submitPayment();

      expect(mockRegisterPaymentUseCase.execute).toHaveBeenCalledWith(expect.objectContaining({
        enrollmentId: 'e1',
        amount: 20000,
        paymentMethod: 'cash',
        periodNumber: 1
      }));

      expect(mockReceiptPdfService.generateReceiptPdf).toHaveBeenCalled();
      expect(mockReceiptPdfService.uploadReceiptToStorage).toHaveBeenCalledWith('REC-2026-0001', expect.anything());
      expect(component.showPaymentModal()).toBe(false);
    });
  });

  describe('4.3 Historial de Pagos y Anulación', () => {
    it('should open history modal and fetch payments', async () => {
      const row: StudentEnrollmentRow = {
        id: 'e2',
        user_id: 'u2',
        full_name: 'Axel Chazarreta',
        email: 'axel@test.com',
        phone: null,
        dni: null,
        course_id: 'c1',
        course_title: 'Reparación de Celulares',
        status: 'confirmed',
        agreed_price: 120000,
        installments_count: 6,
        installment_amount: 20000,
        installments_paid: 1,
        next_due_date: '2026-12-01',
        expires_at: null,
        payment_plan_status: 'active',
        effective_status: 'active',
        notes: null,
        created_at: new Date().toISOString()
      };

      await component.openHistoryModal(row);

      expect(component.showHistoryModal()).toBe(true);
      expect(mockPaymentRepo.getPaymentsByEnrollment).toHaveBeenCalledWith('e2');
    });
  });

  describe('4.4 Matricular Alumno Manualmente', () => {
    it('should execute CreateEnrollmentUseCase when enrolling manually', async () => {
      component.openEnrollModal();
      component.enrollStudentName.set('Carlos Tevez');
      component.enrollEmail.set('tevez@boca.com');
      component.enrollCourseId.set('c1');
      component.enrollPrice.set(90000);
      component.enrollInstallments.set(6);

      await component.submitEnrollment();

      expect(mockCreateEnrollmentUseCase.execute).toHaveBeenCalledWith(expect.objectContaining({
        studentName: 'Carlos Tevez',
        email: 'tevez@boca.com',
        courseId: 'c1',
        agreedPrice: 90000,
        installmentsCount: 6
      }));

      expect(component.showEnrollModal()).toBe(false);
    });
  });
});
