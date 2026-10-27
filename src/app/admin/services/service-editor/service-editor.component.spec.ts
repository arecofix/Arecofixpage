import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ServiceEditorComponent } from './service-editor.component';
import { ServicesApplicationService } from '@app/features/services/application/services/services-application.service';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';

describe('ServiceEditorComponent', () => {
  let component: ServiceEditorComponent;
  let fixture: ComponentFixture<ServiceEditorComponent>;
  let mockServicesApp: any;
  let mockRouter: any;

  beforeEach(async () => {
    mockServicesApp = {
      getServiceById: jest.fn().mockResolvedValue({
        id: 'svc-1',
        name: 'Auditoría de Sitios Web',
        slug: 'auditoria-de-sitios-web',
        short_description: 'Análisis forense de performance y SEO',
        base_price: 69000,
        is_published: true,
        features: ['Velocidad', 'Seguridad'],
      }),
      getLeads: jest.fn().mockResolvedValue({ data: [], total: 0 }),
      getBlocks: jest.fn().mockResolvedValue([]),
      upsertBlocks: jest.fn().mockResolvedValue([]),
      createService: jest.fn(),
      updateService: jest.fn(),
      publishService: jest.fn().mockResolvedValue({ id: 'svc-1', is_published: true }),
      unpublishService: jest.fn().mockResolvedValue({ id: 'svc-1', is_published: false }),
    };

    mockRouter = {
      navigate: jest.fn().mockResolvedValue(true),
    };

    await TestBed.configureTestingModule({
      imports: [ServiceEditorComponent],
      providers: [
        { provide: ServicesApplicationService, useValue: mockServicesApp },
        { provide: Router, useValue: mockRouter },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { paramMap: { get: () => 'svc-1' } },
            params: of({ id: 'svc-1' }),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ServiceEditorComponent);
    component = fixture.componentInstance;
  });

  it('should load and populate service data in form', async () => {
    fixture.detectChanges();
    await component.loadService('svc-1');

    expect(mockServicesApp.getServiceById).toHaveBeenCalledWith('svc-1');
    expect(component.name()).toBe('Auditoría de Sitios Web');
    expect(component.slug()).toBe('auditoria-de-sitios-web');
    expect(component.basePrice()).toBe(69000);
    expect(component.isPublished()).toBe(true);
  });

  it('should toggle between editor tabs', () => {
    fixture.detectChanges();
    expect(component.activeTab()).toBe('content');

    component.activeTab.set('blocks');
    expect(component.activeTab()).toBe('blocks');

    component.activeTab.set('seo');
    expect(component.activeTab()).toBe('seo');
  });

  it('should compute Google SERP preview values', async () => {
    fixture.detectChanges();
    await component.loadService('svc-1');

    expect(component.googlePreviewTitle()).toBe('Auditoría de Sitios Web | Arecofix');
    expect(component.googlePreviewUrl()).toBe('https://arecofix.com.ar/servicios/auditoria-de-sitios-web');
    expect(component.googlePreviewDescription()).toContain('Análisis forense de performance');
  });
});
