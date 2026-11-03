
import { TestBed } from '@angular/core/testing';
import { AdminRepairService } from './admin-repair.service';
import { RepairRepository } from '../../domain/repositories/repair.repository';
import { AuthService } from '@app/core/services/auth.service';
import { IEventBus } from '@app/core/events/event-bus.interface';
import { CustomerService } from '@app/features/customers/application/services/customer.service';
import { BranchContextService } from '@app/core/services/branch-context.service';
import { BranchService } from '@app/core/services/branch.service';
import { WhatsappService } from '@app/core/services/whatsapp.service';
import { RepairWorkflowService } from './repair-workflow.service';
import { ICustomerDeviceRepository } from '@app/features/devices/domain/repositories/customer-device.repository';
import { of } from 'rxjs';

describe('AdminRepairService', () => {
    let service: AdminRepairService;
    let mockRepository: any;
    let mockAuthService: any;
    let mockBranchContextService: any;
    let mockBranchService: any;
    let mockEventBus: any;

    beforeEach(() => {
        mockRepository = {
            getById: jest.fn(),
            getAdminList: jest.fn(),
            delete: jest.fn()
        };

        mockAuthService = {
            getCurrentUser: jest.fn(),
            waitForAuth: jest.fn().mockResolvedValue({ user: null, session: null, profile: null }),
            getUserProfile: jest.fn()
        };

        mockBranchContextService = {
            getBranchId: jest.fn()
        };

        mockBranchService = {
            currentBranch: jest.fn(),
            getAllAdminBranches: jest.fn(),
            resolveEffectiveBranchId: jest.fn()
        };

        mockEventBus = {
            publish: jest.fn(),
            on: jest.fn().mockReturnValue(of()),
        };

        TestBed.configureTestingModule({
            providers: [
                AdminRepairService,
                { provide: RepairRepository, useValue: mockRepository },
                { provide: AuthService, useValue: mockAuthService },
                { provide: IEventBus, useValue: mockEventBus },
                { provide: CustomerService, useValue: {} },
                { provide: BranchContextService, useValue: mockBranchContextService },
                { provide: BranchService, useValue: mockBranchService },
                { provide: WhatsappService, useValue: {} },
                { provide: RepairWorkflowService, useValue: {} },
                { provide: ICustomerDeviceRepository, useValue: {} }
            ]
        });

        service = TestBed.inject(AdminRepairService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should throw an error if trying to get admin list unauthenticated', async () => {
        mockAuthService.getCurrentUser.mockReturnValue(null);

        await expect(service.getAdminList()).rejects.toThrow('Usuario no autenticado');
    });

    it('should get a repair by id', async () => {
        const fakeRepair = { id: '123', device_model: 'iPhone 13' };
        mockRepository.getById.mockReturnValue(of(fakeRepair));

        const result = await service.getById('123');

        expect(result).toEqual(fakeRepair);
        expect(mockRepository.getById).toHaveBeenCalledWith('123');
    });

    it('CRITICAL: update() should preserve originalRepair.device_id when device_model is not changed', async () => {
        const originalRepair = {
            id: 'rep-1',
            device_id: 'dev-original-uuid',
            customer_id: 'cust-1',
            current_status_id: 1,
            device_model: 'iPhone 13'
        };
        mockRepository.getById.mockReturnValue(of(originalRepair));

        const mockWorkflowService = {
            processUpdateRepair: jest.fn().mockResolvedValue(undefined)
        };
        (service as any).repairWorkflowService = mockWorkflowService;

        // User updates only status
        await service.update('rep-1', { current_status_id: 3 });

        expect(mockWorkflowService.processUpdateRepair).toHaveBeenCalledWith(
            'rep-1',
            expect.objectContaining({
                current_status_id: 3,
                device_id: 'dev-original-uuid'
            })
        );
    });

    it('CRITICAL: update() should pass originalRepair.device_id to upsertDevice when device_model IS changed', async () => {
        const originalRepair = {
            id: 'rep-2',
            device_id: 'dev-existing-uuid',
            customer_id: 'cust-2',
            current_status_id: 1,
            device_model: 'iPhone 11'
        };
        mockRepository.getById.mockReturnValue(of(originalRepair));

        const mockDeviceRepo = {
            ensureModelExists: jest.fn().mockReturnValue(of('model-iphone13-id')),
            upsertDevice: jest.fn().mockReturnValue(of('dev-existing-uuid'))
        };
        const mockWorkflowService = {
            processUpdateRepair: jest.fn().mockResolvedValue(undefined)
        };
        (service as any).customerDeviceRepository = mockDeviceRepo;
        (service as any).repairWorkflowService = mockWorkflowService;

        await service.update('rep-2', { device_model: 'iPhone 13 Pro', brand_id: 'brand-apple' });

        expect(mockDeviceRepo.upsertDevice).toHaveBeenCalledWith({
            deviceId: 'dev-existing-uuid',
            userId: 'cust-2',
            modelId: 'model-iphone13-id',
            type: undefined,
            imei: undefined,
            passcode: undefined
        });

        expect(mockWorkflowService.processUpdateRepair).toHaveBeenCalledWith(
            'rep-2',
            expect.objectContaining({
                device_model: 'iPhone 13 Pro',
                device_id: 'dev-existing-uuid'
            })
        );
    });
});
