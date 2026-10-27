import { TestBed } from '@angular/core/testing';
import { ServicesApplicationService } from './services-application.service';
import { ServiceRepository } from '../../domain/repositories/service.repository';
import { ServiceBlockRepository } from '../../domain/repositories/service-block.repository';
import { ServiceLeadRepository } from '../../domain/repositories/service-lead.repository';
import { Service } from '../../domain/entities/service.entity';
import { ServiceBlock } from '../../domain/entities/service-block.entity';

describe('ServicesApplicationService', () => {
  let service: ServicesApplicationService;
  let serviceRepoMock: jest.Mocked<ServiceRepository>;
  let blockRepoMock: jest.Mocked<ServiceBlockRepository>;
  let leadRepoMock: jest.Mocked<ServiceLeadRepository>;

  const mockServiceStandard = new Service({
    id: 'srv-1',
    name: 'Reparación de Celulares',
    slug: 'reparacion-celulares',
    base_price: 15000,
    price_currency: 'ARS',
    is_quotable: false,
    is_bookable: true,
    is_published: true,
    duration_minutes: 45,
    short_description: 'Reparación integral de hardware.',
  });

  const mockServiceQuotable = new Service({
    id: 'srv-2',
    name: 'Otros Servicios Especializados',
    slug: 'otros-servicios',
    base_price: null,
    price_currency: 'ARS',
    is_quotable: true,
    is_bookable: false,
    is_published: true,
    duration_minutes: null,
    short_description: 'Presupuestos personalizados a medida.',
  });

  beforeEach(() => {
    serviceRepoMock = {
      getAll: jest.fn(),
      getPublicList: jest.fn(),
      getById: jest.fn(),
      getBySlug: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      getFeatures: jest.fn().mockResolvedValue([]),
      setFeatures: jest.fn(),
      findRedirect: jest.fn(),
      createRedirect: jest.fn(),
    } as unknown as jest.Mocked<ServiceRepository>;

    blockRepoMock = {
      getBlocks: jest.fn().mockResolvedValue([]),
      saveBlocks: jest.fn(),
      reorderBlocks: jest.fn(),
      deleteBlock: jest.fn(),
    } as unknown as jest.Mocked<ServiceBlockRepository>;

    leadRepoMock = {
      create: jest.fn(),
      getAll: jest.fn(),
      updateStatus: jest.fn(),
    } as unknown as jest.Mocked<ServiceLeadRepository>;

    TestBed.configureTestingModule({
      providers: [
        ServicesApplicationService,
        { provide: ServiceRepository, useValue: serviceRepoMock },
        { provide: ServiceBlockRepository, useValue: blockRepoMock },
        { provide: ServiceLeadRepository, useValue: leadRepoMock },
      ],
    });

    service = TestBed.inject(ServicesApplicationService);
  });

  describe('getPublicServices() (findAll)', () => {
    it('debe retornar lista de DTOs públicos mapeando correctamente is_quotable', async () => {
      serviceRepoMock.getPublicList.mockResolvedValue([mockServiceStandard, mockServiceQuotable]);

      const result = await service.getPublicServices();

      expect(serviceRepoMock.getPublicList).toHaveBeenCalledTimes(1);
      expect(result).toHaveLength(2);

      const standard = result.find(s => s.id === 'srv-1');
      expect(standard).toBeDefined();
      expect(standard?.is_quotable).toBe(false);
      expect(standard?.price_formatted).toContain('15.000');

      const quotable = result.find(s => s.id === 'srv-2');
      expect(quotable).toBeDefined();
      expect(quotable?.is_quotable).toBe(true);
      expect(quotable?.price_formatted).toBe('Consultar');
    });

    it('debe propagar errores cuando falla la red o el repositorio', async () => {
      serviceRepoMock.getPublicList.mockRejectedValue(new Error('Network connection failed'));

      await expect(service.getPublicServices()).rejects.toThrow('Network connection failed');
    });
  });

  describe('getPublicServiceBySlug()', () => {
    it('debe retornar { type: "found" } con features y blocks para un servicio publicado', async () => {
      serviceRepoMock.getBySlug.mockResolvedValue(mockServiceQuotable);
      serviceRepoMock.getFeatures.mockResolvedValue([
        { id: 'f1', serviceId: 'srv-2', label: 'Atención personalizada', icon: 'fa-check' } as any,
      ]);
      const mockBlock = new ServiceBlock({
        id: 'blk-1',
        owner_type: 'service',
        owner_id: 'srv-2',
        block_type: 'hero',
        content: { title: 'Presupuesto a Medida' },
        order_index: 0,
        is_enabled: true,
      });
      blockRepoMock.getBlocks.mockResolvedValue([mockBlock]);

      const result = await service.getPublicServiceBySlug('otros-servicios');

      expect(result.type).toBe('found');
      if (result.type === 'found') {
        expect(result.data.slug).toBe('otros-servicios');
        expect(result.data.is_quotable).toBe(true);
        expect(result.data.price_formatted).toBe('Consultar');
        expect(result.data.features).toHaveLength(1);
        expect(result.data.blocks).toHaveLength(1);
      }
    });

    it('debe retornar { type: "redirect" } si existe un registro de redirección 301', async () => {
      serviceRepoMock.getBySlug.mockResolvedValue(null);
      serviceRepoMock.findRedirect.mockResolvedValue('reparacion-celulares');

      const result = await service.getPublicServiceBySlug('celular-old');

      expect(result.type).toBe('redirect');
      if (result.type === 'redirect') {
        expect(result.targetSlug).toBe('reparacion-celulares');
      }
    });

    it('debe retornar { type: "not_found" } si el servicio no existe y no hay redirección', async () => {
      serviceRepoMock.getBySlug.mockResolvedValue(null);
      serviceRepoMock.findRedirect.mockResolvedValue(null);

      const result = await service.getPublicServiceBySlug('slug-inexistente');

      expect(result.type).toBe('not_found');
    });
  });
});
