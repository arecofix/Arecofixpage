import { CreateServiceUseCase } from './create-service.usecase';
import { PublishServiceUseCase } from './publish-service.usecase';
import { DuplicateServiceUseCase } from './duplicate-service.usecase';
import { CreateLeadUseCase } from './create-lead.usecase';
import { Service } from '../../domain/entities/service.entity';
import { ServiceBlock } from '../../domain/entities/service-block.entity';
import { ServiceFeature } from '../../domain/entities/service-feature.entity';
import { ServiceLead } from '../../domain/entities/service-lead.entity';

describe('Services Application Use Cases', () => {

  let mockServiceRepo: any;
  let mockBlockRepo: any;
  let mockLeadRepo: any;

  beforeEach(() => {
    mockServiceRepo = {
      getBySlug: jest.fn(),
      getById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      getFeatures: jest.fn().mockResolvedValue([]),
      setFeatures: jest.fn().mockResolvedValue([]),
      createRedirect: jest.fn().mockResolvedValue(undefined),
      findRedirect: jest.fn().mockResolvedValue(null),
    };

    mockBlockRepo = {
      getBlocks: jest.fn().mockResolvedValue([]),
      upsertBlocks: jest.fn().mockResolvedValue([]),
      deleteBlock: jest.fn().mockResolvedValue(undefined),
      reorderBlocks: jest.fn().mockResolvedValue(undefined),
    };

    mockLeadRepo = {
      create: jest.fn(),
      getRecentLeadCountByIp: jest.fn().mockResolvedValue(0),
    };
  });

  describe('CreateServiceUseCase', () => {
    it('should create a service with clean slug and default hero block', async () => {
      mockServiceRepo.getBySlug.mockResolvedValue(null);
      const createdService = new Service({
        id: 'svc-1',
        name: 'Recuperación de Datos',
        slug: 'recuperacion-de-datos',
        short_description: 'Recuperación profesional',
      });
      mockServiceRepo.create.mockResolvedValue(createdService);

      const useCase = new CreateServiceUseCase(mockServiceRepo, mockBlockRepo);
      const result = await useCase.execute({
        name: 'Recuperación de Datos',
        short_description: 'Recuperación profesional',
      });

      expect(mockServiceRepo.create).toHaveBeenCalled();
      expect(mockBlockRepo.upsertBlocks).toHaveBeenCalledWith(
        'service',
        'svc-1',
        expect.arrayContaining([
          expect.objectContaining({ block_type: 'hero' }),
        ])
      );
      expect(result.id).toBe('svc-1');
    });

    it('should throw an error if service name is too short', async () => {
      const useCase = new CreateServiceUseCase(mockServiceRepo, mockBlockRepo);
      await expect(useCase.execute({ name: 'AB' })).rejects.toThrow(
        'El nombre del servicio debe tener al menos 3 caracteres'
      );
    });
  });

  describe('PublishServiceUseCase', () => {
    it('should reject publishing if service has no hero block', async () => {
      const service = new Service({
        id: 'svc-1',
        name: 'Auditoría',
        slug: 'auditoria',
        short_description: 'Descripción válida de más de 10 caracteres',
      });
      mockServiceRepo.getById.mockResolvedValue(service);
      mockBlockRepo.getBlocks.mockResolvedValue([]); // No hero block

      const useCase = new PublishServiceUseCase(mockServiceRepo, mockBlockRepo);
      await expect(useCase.execute('svc-1')).rejects.toThrow(
        'Debe existir y estar habilitado al menos un bloque Hero para publicar'
      );
    });

    it('should reject publishing if short_description is missing or too short', async () => {
      const service = new Service({
        id: 'svc-1',
        name: 'Auditoría',
        slug: 'auditoria',
        short_description: 'Corta',
      });
      mockServiceRepo.getById.mockResolvedValue(service);
      mockBlockRepo.getBlocks.mockResolvedValue([
        new ServiceBlock({
          id: 'b-1',
          owner_type: 'service',
          owner_id: 'svc-1',
          block_type: 'hero',
          content: { title: 'Hero' },
          is_enabled: true,
        }),
      ]);

      const useCase = new PublishServiceUseCase(mockServiceRepo, mockBlockRepo);
      await expect(useCase.execute('svc-1')).rejects.toThrow(
        'La descripción corta es obligatoria para publicar'
      );
    });

    it('should publish successfully when all criteria are met', async () => {
      const service = new Service({
        id: 'svc-1',
        name: 'Auditoría Web',
        slug: 'auditoria-web',
        short_description: 'Descripción completa para publicación en producción',
      });
      mockServiceRepo.getById.mockResolvedValue(service);
      mockBlockRepo.getBlocks.mockResolvedValue([
        new ServiceBlock({
          id: 'b-1',
          owner_type: 'service',
          owner_id: 'svc-1',
          block_type: 'hero',
          content: { title: 'Hero' },
          is_enabled: true,
        }),
      ]);
      mockServiceRepo.update.mockResolvedValue(service);

      const useCase = new PublishServiceUseCase(mockServiceRepo, mockBlockRepo);
      await useCase.execute('svc-1');

      expect(mockServiceRepo.update).toHaveBeenCalledWith(
        'svc-1',
        expect.objectContaining({ is_published: true })
      );
    });
  });

  describe('DuplicateServiceUseCase', () => {
    it('should duplicate service in draft status and clone its blocks', async () => {
      const original = new Service({
        id: 'svc-orig',
        name: 'Servicio Original',
        slug: 'servicio-original',
        short_description: 'Descripción',
      });
      mockServiceRepo.getById.mockResolvedValue(original);
      mockServiceRepo.getFeatures.mockResolvedValue([
        new ServiceFeature({ id: 'f-1', service_id: 'svc-orig', label: 'Garantía' }),
      ]);

      const cloned = new Service({
        id: 'svc-cloned',
        name: 'Servicio Original (Copia)',
        slug: 'servicio-original-copia',
        short_description: 'Descripción',
      });
      mockServiceRepo.create.mockResolvedValue(cloned);

      mockBlockRepo.getBlocks.mockResolvedValue([
        new ServiceBlock({
          id: 'b-orig',
          owner_type: 'service',
          owner_id: 'svc-orig',
          block_type: 'hero',
          content: { title: 'Original Hero' },
          order_index: 0,
        }),
      ]);

      const useCase = new DuplicateServiceUseCase(mockServiceRepo, mockBlockRepo);
      const res = await useCase.execute('svc-orig');

      expect(mockServiceRepo.create).toHaveBeenCalledWith(
        expect.objectContaining({ is_published: false }),
        ['Garantía']
      );
      expect(mockBlockRepo.upsertBlocks).toHaveBeenCalledWith(
        'service',
        'svc-cloned',
        expect.arrayContaining([
          expect.objectContaining({ block_type: 'hero' }),
        ])
      );
      expect(res.id).toBe('svc-cloned');
    });
  });

  describe('CreateLeadUseCase', () => {
    it('should detect and reject spam bots filling honeypot', async () => {
      const useCase = new CreateLeadUseCase(mockLeadRepo);
      await expect(
        useCase.execute({
          name: 'Bot',
          email: 'bot@spam.com',
          message: 'Mensaje de spam',
          hp_field: 'valor-trampa',
        })
      ).rejects.toThrow('Bot detectado por trampa honeypot.');
    });

    it('should enforce rate limit when 5 leads submitted in the hour', async () => {
      mockLeadRepo.getRecentLeadCountByIp.mockResolvedValue(5);
      const useCase = new CreateLeadUseCase(mockLeadRepo);

      await expect(
        useCase.execute(
          {
            name: 'Cliente Real',
            email: 'cliente@gmail.com',
            message: 'Consulta de presupuesto para reparación',
          },
          '190.190.1.1'
        )
      ).rejects.toThrow('Has superado el límite de consultas permitidas por hora');
    });

    it('should require either phone or email', async () => {
      const useCase = new CreateLeadUseCase(mockLeadRepo);
      await expect(
        useCase.execute({
          name: 'Cliente',
          email: '',
          phone: '',
          message: 'Consulta',
        })
      ).rejects.toThrow('Debes proporcionar al menos un medio de contacto');
    });

    it('should save lead with hashed IP when valid', async () => {
      mockLeadRepo.getRecentLeadCountByIp.mockResolvedValue(0);
      const lead = new ServiceLead({
        id: 'lead-1',
        name: 'Martín',
        phone: '1125960900',
        message: 'Consulta válida de servicio',
      });
      mockLeadRepo.create.mockResolvedValue(lead);

      const useCase = new CreateLeadUseCase(mockLeadRepo);
      const result = await useCase.execute(
        {
          name: 'Martín',
          phone: '1125960900',
          message: 'Consulta válida de servicio',
        },
        '200.120.50.1'
      );

      expect(mockLeadRepo.create).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Martín',
          phone: '1125960900',
          ip_hash: expect.any(String),
          status: 'new',
        })
      );
      expect(result.id).toBe('lead-1');
    });
  });

});
