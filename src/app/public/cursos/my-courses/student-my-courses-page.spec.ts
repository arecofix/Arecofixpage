import { TestBed, ComponentFixture } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { StudentMyCoursesPage } from './student-my-courses-page';
import { CoursesService } from '@app/core/services/courses.service';
import { AuthService } from '@app/core/services/auth.service';
import { CourseRepository } from '@app/features/courses/domain/repositories/course.repository';
import { SeoService } from '@app/core/services/seo.service';
import { CertificatesService } from '@app/features/courses/application/services/certificates.service';
import { ToastService } from '@app/shared/services/toast.service';
import { SUPABASE_CLIENT } from '@app/core/di/supabase-token';
import { of } from 'rxjs';
import { StudentEnrollment } from '@app/features/courses/domain/entities/course.entity';

describe('StudentMyCoursesPage (Fase 5 Acceptance Tests)', () => {
  let component: StudentMyCoursesPage;
  let fixture: ComponentFixture<StudentMyCoursesPage>;

  const mockCoursesService = {
    getUserEnrolledCourses: jest.fn().mockReturnValue(of({ data: [], error: null }))
  };

  const mockAuthService = {
    getSession: jest.fn().mockResolvedValue({ user: { id: 'u1', email: 'alumno@arecofix.com' } }),
    getUser: jest.fn().mockResolvedValue({ id: 'u1', email: 'alumno@arecofix.com' }),
    getCurrentProfile: jest.fn().mockReturnValue({ id: 'u1', email: 'alumno@arecofix.com', role: 'student' })
  };

  const mockCourseRepo = {
    getAll: jest.fn().mockResolvedValue([])
  };

  const mockSeoService = {
    setPageData: jest.fn()
  };

  const mockCertificatesService = {
    getStudentCertificates: jest.fn().mockResolvedValue([])
  };

  const mockToastService = {
    show: jest.fn()
  };

  const mockSupabase = {
    from: jest.fn().mockReturnValue({
      insert: jest.fn().mockResolvedValue({ error: null })
    }),
    storage: {
      from: jest.fn().mockReturnValue({
        upload: jest.fn().mockResolvedValue({ data: { path: 'p1' }, error: null }),
        getPublicUrl: jest.fn().mockReturnValue({ data: { publicUrl: 'https://cdn/p1' } })
      })
    }
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentMyCoursesPage],
      providers: [
        provideRouter([]),
        { provide: CoursesService, useValue: mockCoursesService },
        { provide: AuthService, useValue: mockAuthService },
        { provide: CourseRepository, useValue: mockCourseRepo },
        { provide: SeoService, useValue: mockSeoService },
        { provide: CertificatesService, useValue: mockCertificatesService },
        { provide: ToastService, useValue: mockToastService },
        { provide: SUPABASE_CLIENT, useValue: mockSupabase }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(StudentMyCoursesPage);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('5.1 Estado de Matrícula y Badges', () => {
    it('should return correct badge class and label for active enrollment', () => {
      const enrollment: StudentEnrollment = {
        course_id: 'c1',
        full_name: 'Axel Chazarreta',
        email: 'axel@test.com',
        status: 'confirmed',
        effective_status: 'active',
        next_due_date: '2026-12-01T00:00:00Z',
        installments_paid: 2,
        installments_count: 6
      };

      const badgeClass = component.getBadgeClass(enrollment.effective_status);
      const label = component.getBadgeLabel(enrollment);

      expect(badgeClass).toContain('bg-emerald-500');
      expect(label).toContain('● Al día');
    });

    it('should return warning label and amber class for grace_period enrollment', () => {
      const futureDue = new Date(Date.now() - 2 * 86400000).toISOString();
      const enrollment: StudentEnrollment = {
        course_id: 'c1',
        full_name: 'Ludmila Perez',
        email: 'ludmila@test.com',
        status: 'confirmed',
        effective_status: 'grace_period',
        next_due_date: futureDue
      };

      const badgeClass = component.getBadgeClass(enrollment.effective_status);
      const label = component.getBadgeLabel(enrollment);

      expect(badgeClass).toContain('bg-amber-500');
      expect(label).toContain('⚠️ En gracia');
    });

    it('should return suspended label and rose class for suspended enrollment', () => {
      const enrollment: StudentEnrollment = {
        course_id: 'c1',
        full_name: 'Juan Topo',
        email: 'juan@test.com',
        status: 'confirmed',
        effective_status: 'suspended'
      };

      const badgeClass = component.getBadgeClass(enrollment.effective_status);
      const label = component.getBadgeLabel(enrollment);

      expect(badgeClass).toContain('bg-rose-600');
      expect(label).toContain('❌ Acceso suspendido');
    });

    it('should return pending_payment label and slate class for pending enrollment', () => {
      const enrollment: StudentEnrollment = {
        course_id: 'c1',
        full_name: 'Emmanuel Romano',
        email: 'emmanuel@test.com',
        status: 'confirmed',
        effective_status: 'pending_payment'
      };

      const badgeClass = component.getBadgeClass(enrollment.effective_status);
      const label = component.getBadgeLabel(enrollment);

      expect(badgeClass).toContain('bg-slate-600');
      expect(label).toContain('⏳ Pendiente de pago');
    });

    it('should return scholarship label and cyan class for scholarship enrollment', () => {
      const enrollment: StudentEnrollment = {
        course_id: 'c1',
        full_name: 'Ezequiel Enrico',
        email: 'ezequiel@arecofix.com',
        status: 'confirmed',
        effective_status: 'scholarship'
      };

      const badgeClass = component.getBadgeClass(enrollment.effective_status);
      const label = component.getBadgeLabel(enrollment);

      expect(badgeClass).toContain('bg-cyan-500');
      expect(label).toContain('🎓 Becado');
    });
  });

  describe('5.3 Modal de Pago de Cuota y Comprobante', () => {
    it('should open modal with suggested installment amount', () => {
      const enrollment: StudentEnrollment = {
        id: 'e-100',
        course_id: 'c1',
        full_name: 'Marcelo Fernández',
        email: 'marcelo@test.com',
        status: 'confirmed',
        agreed_price: 120000,
        installments_count: 6,
        installment_amount: 20000,
        installments_paid: 1
      };

      component.openPayModal(enrollment);

      expect(component.showPayModal()).toBe(true);
      expect(component.selectedEnrollmentForPay()).toEqual(enrollment);
      expect(component.proofAmount()).toBe(20000);
    });

    it('should validate file and amount before submitting proof', async () => {
      component.selectedEnrollmentForPay.set({
        id: 'e-100',
        course_id: 'c1',
        full_name: 'Marcelo Fernández',
        email: 'marcelo@test.com',
        status: 'confirmed'
      });
      component.selectedProofFile.set(null);

      await component.submitProof();

      expect(mockToastService.show).toHaveBeenCalledWith(
        'Seleccioná el archivo de comprobante',
        'error'
      );
    });

    it('should upload file to storage and insert record into academy_payment_proofs', async () => {
      const mockFile = new File(['dummy content'], 'comprobante_banco.pdf', { type: 'application/pdf' });
      component.selectedEnrollmentForPay.set({
        id: 'e-100',
        course_id: 'c1',
        full_name: 'Marcelo Fernández',
        email: 'marcelo@test.com',
        status: 'confirmed'
      });
      component.selectedProofFile.set(mockFile);
      component.proofAmount.set(20000);
      component.proofNotes.set('Transferencia N° 1234');

      await component.submitProof();

      expect(mockSupabase.storage.from).toHaveBeenCalledWith('comprobantes');
      expect(mockSupabase.from).toHaveBeenCalledWith('academy_payment_proofs');
      expect(mockToastService.show).toHaveBeenCalledWith(
        'Comprobante recibido correctamente. Lo verificaremos a la brevedad.',
        'success'
      );
      expect(component.showPayModal()).toBe(false);
    });
  });
});
