import { TestBed } from '@angular/core/testing';
import { CreateEnrollmentUseCase } from './create-enrollment.usecase';
import { CourseRepository } from '../../domain/repositories/course.repository';
import { StudentEnrollment } from '../../domain/entities/course.entity';

describe('CreateEnrollmentUseCase', () => {
  let useCase: CreateEnrollmentUseCase;
  let mockCourseRepo: jest.Mocked<CourseRepository>;

  beforeEach(() => {
    mockCourseRepo = {
      enrollStudent: jest.fn(),
      getAll: jest.fn(),
      getBySlug: jest.fn(),
      getById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      getModules: jest.fn(),
      saveModules: jest.fn(),
      getEnrollments: jest.fn(),
      assignInstructors: jest.fn(),
      getCourseInstructors: jest.fn(),
      getModuleContents: jest.fn(),
      saveModuleContents: jest.fn()
    } as unknown as jest.Mocked<CourseRepository>;

    TestBed.configureTestingModule({
      providers: [
        CreateEnrollmentUseCase,
        { provide: CourseRepository, useValue: mockCourseRepo }
      ]
    });

    useCase = TestBed.inject(CreateEnrollmentUseCase);
  });

  it('debe crear una matrícula regular con 6 cuotas y pending_payment', async () => {
    const mockCreated: StudentEnrollment = {
      id: 'enr-1',
      course_id: 'c-1',
      full_name: 'Juan Perez',
      email: 'juan@gmail.com',
      status: 'confirmed',
      agreed_price: 120000,
      installments_count: 6,
      installment_amount: 20000,
      installments_paid: 0,
      payment_plan_status: 'pending_payment'
    };

    mockCourseRepo.enrollStudent.mockResolvedValueOnce(mockCreated);

    const res = await useCase.execute({
      studentName: 'Juan Perez',
      email: 'juan@gmail.com',
      courseId: 'c-1',
      agreedPrice: 120000,
      installmentsCount: 6,
      startDate: new Date('2026-11-05T00:00:00Z'),
      paymentDay: 10
    });

    expect(res.success).toBe(true);
    expect(res.enrollment).toEqual(mockCreated);
    expect(mockCourseRepo.enrollStudent).toHaveBeenCalledWith(expect.objectContaining({
      course_id: 'c-1',
      full_name: 'Juan Perez',
      email: 'juan@gmail.com',
      status: 'confirmed',
      agreed_price: 120000,
      installments_count: 6,
      installment_amount: 20000,
      installments_paid: 0,
      payment_plan_status: 'pending_payment'
    }));
  });

  it('debe crear una matrícula para un becado con agreed_price = 0 y status scholarship', async () => {
    const mockCreated: StudentEnrollment = {
      id: 'enr-beca',
      course_id: 'c-1',
      full_name: 'Ezequiel Enrico',
      email: 'ezequielenrico15@gmail.com',
      status: 'confirmed',
      agreed_price: 0,
      installments_count: 0,
      installment_amount: 0,
      installments_paid: 0,
      payment_plan_status: 'scholarship'
    };

    mockCourseRepo.enrollStudent.mockResolvedValueOnce(mockCreated);

    const res = await useCase.execute({
      studentName: 'Ezequiel Enrico',
      email: 'ezequielenrico15@gmail.com',
      courseId: 'c-1',
      isScholarship: true
    });

    expect(res.success).toBe(true);
    expect(res.enrollment?.payment_plan_status).toBe('scholarship');
    expect(mockCourseRepo.enrollStudent).toHaveBeenCalledWith(expect.objectContaining({
      agreed_price: 0,
      installments_count: 0,
      installment_amount: 0,
      payment_plan_status: 'scholarship',
      next_due_date: null
    }));
  });

  it('debe fallar si falta el nombre o email o curso', async () => {
    const resNoName = await useCase.execute({ studentName: '', email: 'a@a.com', courseId: 'c1' });
    expect(resNoName.success).toBe(false);
    expect(resNoName.error).toBe('El nombre del alumno es obligatorio');

    const resNoEmail = await useCase.execute({ studentName: 'A', email: '', courseId: 'c1' });
    expect(resNoEmail.success).toBe(false);
    expect(resNoEmail.error).toBe('El email del alumno es obligatorio');

    const resBadEmail = await useCase.execute({ studentName: 'A', email: 'no-email', courseId: 'c1' });
    expect(resBadEmail.success).toBe(false);
    expect(resBadEmail.error).toBe('El formato de email es inválido');

    const resNoCourse = await useCase.execute({ studentName: 'A', email: 'a@a.com', courseId: '' });
    expect(resNoCourse.success).toBe(false);
    expect(resNoCourse.error).toBe('El curso es obligatorio');
  });

  it('debe rechazar precio acordado negativo para no becados', async () => {
    const res = await useCase.execute({
      studentName: 'A',
      email: 'a@a.com',
      courseId: 'c1',
      agreedPrice: -500,
      isScholarship: false
    });
    expect(res.success).toBe(false);
    expect(res.error).toBe('El precio acordado no puede ser negativo');
  });
});

