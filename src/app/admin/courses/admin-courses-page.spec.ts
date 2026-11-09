import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AdminCoursesPage } from './admin-courses-page';
import { CoursesService } from '@app/core/services/courses.service';
import { CertificatesService } from '@app/features/courses/application/services/certificates.service';
import { ToastService } from '@app/shared/services/toast.service';
import { SUPABASE_CLIENT } from '@app/core/di/supabase-token';
import { of } from 'rxjs';

describe('AdminCoursesPage Template & Component Compilation', () => {
  const mockCoursesService = {
    getCourses: jest.fn().mockReturnValue(of({ data: [], error: null }))
  };

  const mockCertificatesService = {
    getAllCertificatesAdmin: jest.fn().mockResolvedValue([]),
    approveStudentAndGenerateCertificate: jest.fn(),
    revokeCertificate: jest.fn(),
    reactivateCertificate: jest.fn()
  };

  const mockToastService = {
    show: jest.fn()
  };

  const mockSupabase = {
    from: jest.fn().mockReturnValue({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          not: jest.fn().mockResolvedValue({ data: [], error: null })
        }),
        in: jest.fn().mockResolvedValue({ data: [], error: null })
      })
    })
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminCoursesPage],
      providers: [
        provideRouter([]),
        { provide: CoursesService, useValue: mockCoursesService },
        { provide: CertificatesService, useValue: mockCertificatesService },
        { provide: ToastService, useValue: mockToastService },
        { provide: SUPABASE_CLIENT, useValue: mockSupabase }
      ]
    }).compileComponents();
  });

  it('should compile template without errors and instantiate component', () => {
    const fixture = TestBed.createComponent(AdminCoursesPage);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
    fixture.detectChanges();
    expect(fixture.nativeElement).toBeTruthy();
  });
});

