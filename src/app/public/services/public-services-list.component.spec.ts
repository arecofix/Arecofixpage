import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';
import { PublicServicesListComponent } from './public-services-list.component';
import { ServicesApplicationService } from '@app/features/services/application/services/services-application.service';
import { ServiceDto } from '@app/features/services/domain/dtos/service.dto';

describe('PublicServicesListComponent (Caracterización)', () => {
  let component: PublicServicesListComponent;
  let fixture: ComponentFixture<PublicServicesListComponent>;
  let servicesAppMock: { getPublicServices: jest.Mock };
  let titleService: Title;
  let metaService: Meta;

  const mockServices: ServiceDto[] = [
    {
      id: 'srv-1',
      name: 'Reparación de Celulares',
      slug: 'reparacion-celulares',
      price_formatted: '$15.000',
      price_currency: 'ARS',
      is_quotable: false,
      is_bookable: true,
      is_published: true,
      template_slug: 'default',
      duration_minutes: 60,
      short_description: 'Cambio de módulos y pines de carga.',
    },
    {
      id: 'srv-2',
      name: 'Otros Servicios Especializados',
      slug: 'otros-servicios',
      price_formatted: 'A convenir',
      price_currency: 'ARS',
      is_quotable: true,
      is_bookable: true,
      is_published: true,
      template_slug: 'default',
      duration_minutes: null,
      short_description: 'Presupuestos personalizados a medida.',
    },
  ];

  beforeEach(async () => {
    servicesAppMock = {
      getPublicServices: jest.fn().mockResolvedValue(mockServices),
    };

    await TestBed.configureTestingModule({
      imports: [PublicServicesListComponent],
      providers: [
        provideRouter([]),
        { provide: ServicesApplicationService, useValue: servicesAppMock },
      ],
    }).compileComponents();

    titleService = TestBed.inject(Title);
    metaService = TestBed.inject(Meta);
    fixture = TestBed.createComponent(PublicServicesListComponent);
    component = fixture.componentInstance;
  });

  it('debe crearse correctamente e inicializar en estado de carga', () => {
    expect(component).toBeTruthy();
    expect(component.loading()).toBe(true);
  });

  it('debe configurar los metadatos SEO y Title en ngOnInit', async () => {
    const titleSpy = jest.spyOn(titleService, 'setTitle');
    const metaSpy = jest.spyOn(metaService, 'updateTag');

    await component.ngOnInit();

    expect(titleSpy).toHaveBeenCalledWith(
      'Servicios Profesionales de Tecnología y Reparación | Arecofix'
    );
    expect(metaSpy).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'description' })
    );
    expect(metaSpy).toHaveBeenCalledWith(
      expect.objectContaining({ property: 'og:url', content: 'https://arecofix.com.ar/servicios' })
    );
  });

  it('debe cargar el catálogo de servicios vía ServicesApplicationService', async () => {
    await component.loadServices();

    expect(servicesAppMock.getPublicServices).toHaveBeenCalledTimes(1);
    expect(component.services()).toEqual(mockServices);
    expect(component.loading()).toBe(false);
    expect(component.error()).toBeNull();
  });

  it('debe manejar servicios cotizables (is_quotable = true) sin requerir IDs fijos', async () => {
    await component.loadServices();

    const quotableService = component.services().find(s => s.is_quotable);
    expect(quotableService).toBeDefined();
    expect(quotableService?.slug).toBe('otros-servicios');
    expect(quotableService?.price_formatted).toBe('A convenir');
  });

  it('debe manejar errores de carga y setear el mensaje correspondiente', async () => {
    servicesAppMock.getPublicServices.mockRejectedValueOnce(new Error('Network error'));

    await component.loadServices();

    expect(component.loading()).toBe(false);
    expect(component.error()).toBe('No se pudieron cargar los servicios en este momento.');
    expect(component.services()).toEqual([]);
  });
});
