import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminServicesPage } from './admin-services-page';
import { ServicesApplicationService } from '@app/features/services/application/services/services-application.service';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('AdminServicesPage', () => {
  let component: AdminServicesPage;
  let fixture: ComponentFixture<AdminServicesPage>;
  let mockServicesApp: any;

  beforeEach(async () => {
    mockServicesApp = {
      getPaginatedServices: jest.fn().mockResolvedValue({
        data: [
          {
            id: 'svc-1',
            name: 'Auditoría de Sitios web',
            slug: 'auditoria-de-sitios-web',
            price_formatted: '$ 69.000,00',
            duration_minutes: 60,
            is_published: true,
          },
        ],
        total: 1,
      }),
      deleteService: jest.fn().mockResolvedValue(undefined),
      duplicateService: jest.fn().mockResolvedValue({ id: 'svc-copy' }),
    };

    await TestBed.configureTestingModule({
      imports: [AdminServicesPage],
      providers: [
        { provide: ServicesApplicationService, useValue: mockServicesApp },
        { provide: ActivatedRoute, useValue: { queryParams: of({}) } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminServicesPage);
    component = fixture.componentInstance;
  });

  it('should load services on initialization', async () => {
    fixture.detectChanges();
    await component.loadServices();

    expect(mockServicesApp.getPaginatedServices).toHaveBeenCalled();
    expect(component.services().length).toBe(1);
    expect(component.services()[0].name).toBe('Auditoría de Sitios web');
  });

  it('should filter by publication status', async () => {
    fixture.detectChanges();
    component.onFilterStatusChange('published');

    expect(component.filterStatus()).toBe('published');
    expect(mockServicesApp.getPaginatedServices).toHaveBeenCalledWith(
      expect.objectContaining({ isPublished: true })
    );
  });
});
