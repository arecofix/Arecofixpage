import { TestBed } from '@angular/core/testing';
import { trackingSeoResolver } from './tracking-seo.resolver';
import { GetRepairTrackingUseCase } from '@app/features/repairs/application/usecases/get-repair-tracking.usecase';
import { SeoService } from '@app/core/services/seo.service';
import { ActivatedRouteSnapshot, RouterStateSnapshot, convertToParamMap } from '@angular/router';
import { of, throwError } from 'rxjs';
import { PublicRepairDto } from '@app/features/repairs/domain/dtos/public-repair.dto';
import { environment } from '@env/environment';

describe('trackingSeoResolver', () => {
  let mockGetRepairTrackingUseCase: jest.Mocked<GetRepairTrackingUseCase>;
  let mockSeoService: jest.Mocked<SeoService>;

  beforeEach(() => {
    mockGetRepairTrackingUseCase = {
      execute: jest.fn()
    } as any;

    mockSeoService = {
      setPageData: jest.fn()
    } as any;

    TestBed.configureTestingModule({
      providers: [
        { provide: GetRepairTrackingUseCase, useValue: mockGetRepairTrackingUseCase },
        { provide: SeoService, useValue: mockSeoService }
      ]
    });
  });

  const runResolver = (code: string | null) => {
    const route = {
      paramMap: convertToParamMap({ code })
    } as any as ActivatedRouteSnapshot;
    
    const state = {} as RouterStateSnapshot;

    return TestBed.runInInjectionContext(() => {
      return trackingSeoResolver(route, state);
    });
  };

  it('should return null and not set SEO if code is missing', (done) => {
    const result = runResolver(null);
    if (result && typeof result !== 'boolean' && 'subscribe' in result) {
        result.subscribe(val => {
            expect(val).toBeNull();
            expect(mockSeoService.setPageData).not.toHaveBeenCalled();
            done();
        });
    } else {
        expect(result).toBeNull();
        done();
    }
  });

  it('should return null and not set SEO if code is "CONSULTA"', (done) => {
    const result = runResolver('CONSULTA');
    if (result && typeof result !== 'boolean' && 'subscribe' in result) {
        result.subscribe(val => {
            expect(val).toBeNull();
            expect(mockSeoService.setPageData).not.toHaveBeenCalled();
            done();
        });
    } else {
        expect(result).toBeNull();
        done();
    }
  });

  it('should set full SEO tags including fallback image if no images exist', (done) => {
    const mockRepair: Partial<PublicRepairDto> = {
      device_model: 'PlayStation 4',
      repair_number: 155,
      status_label: 'En Reparación',
      customer_name: 'Gonzalo Ariel',
      images: []
    };
    mockGetRepairTrackingUseCase.execute.mockReturnValue(of(mockRepair as any));

    const result = runResolver('AF-155') as any;
    result.subscribe((val: any) => {
      expect(val).toEqual(mockRepair);
      expect(mockSeoService.setPageData).toHaveBeenCalledWith({
        title: 'Seguimiento de Equipo: PlayStation 4 - Orden #155',
        description: 'Estado: En Reparación | Cliente: Gonzalo Ariel. Hacé clic para ver los detalles en tiempo real.',
        imageUrl: 'assets/img/branding/og-tracking.png',
        type: 'website',
        url: '/tracking/AF-155'
      });
      done();
    });
  });

  it('should set full SEO tags with absolute image URL if images exist', (done) => {
    const mockRepair: Partial<PublicRepairDto> = {
      device_model: 'iPhone 13',
      repair_number: 156,
      status_label: 'Finalizado',
      customer_name: '', // Should fallback to 'Arecofix'
      images: ['iphone.jpg']
    };
    mockGetRepairTrackingUseCase.execute.mockReturnValue(of(mockRepair as any));

    const result = runResolver('AF-156') as any;
    result.subscribe((val: any) => {
      expect(val).toEqual(mockRepair);
      expect(mockSeoService.setPageData).toHaveBeenCalledWith({
        title: 'Seguimiento de Equipo: iPhone 13 - Orden #156',
        description: 'Estado: Finalizado | Cliente: Arecofix. Hacé clic para ver los detalles en tiempo real.',
        imageUrl: `${environment.supabaseUrl}/storage/v1/object/public/repair-images/iphone.jpg`,
        type: 'website',
        url: '/tracking/AF-156'
      });
      done();
    });
  });

  it('should return null and not set SEO if usecase fails', (done) => {
    mockGetRepairTrackingUseCase.execute.mockReturnValue(throwError(() => new Error('Error')));

    const result = runResolver('AF-999') as any;
    result.subscribe((val: any) => {
      expect(val).toBeNull();
      expect(mockSeoService.setPageData).not.toHaveBeenCalled();
      done();
    });
  });
});
