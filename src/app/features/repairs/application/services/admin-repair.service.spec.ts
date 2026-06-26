
import { TestBed } from '@angular/core/testing';
import { AdminRepairService } from './admin-repair.service';
import { RepairRepository } from '../../domain/repositories/repair.repository';
import { AuthService } from '@app/core/services/auth.service';
import { InvoiceService } from '@app/features/sales/application/invoice.service';
import { CustomerService } from '@app/features/customers/application/services/customer.service';
import { BranchContextService } from '@app/core/services/branch-context.service';
import { BranchService } from '@app/core/services/branch.service';
import { WhatsappService } from '@app/core/services/whatsapp.service';
import { RepairWorkflowService } from './repair-workflow.service';
import { of } from 'rxjs';

describe('AdminRepairService', () => {
    let service: AdminRepairService;
    let mockRepository: any;
    let mockAuthService: any;
    let mockBranchContextService: any;
    let mockBranchService: any;

    beforeEach(() => {
        mockRepository = {
            getById: jest.fn(),
            getAdminList: jest.fn(),
            delete: jest.fn()
        };

        mockAuthService = {
            getCurrentUser: jest.fn(),
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

        TestBed.configureTestingModule({
            providers: [
                AdminRepairService,
                { provide: RepairRepository, useValue: mockRepository },
                { provide: AuthService, useValue: mockAuthService },
                { provide: InvoiceService, useValue: {} },
                { provide: CustomerService, useValue: {} },
                { provide: BranchContextService, useValue: mockBranchContextService },
                { provide: BranchService, useValue: mockBranchService },
                { provide: WhatsappService, useValue: {} },
                { provide: RepairWorkflowService, useValue: {} }
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
});
