import { TestBed } from '@angular/core/testing';
import { RepairWorkflowService } from './repair-workflow.service';
import { RepairRepository } from '../../domain/repositories/repair.repository';
import { StockManagementService } from '@app/features/products/application/services/stock-management.service';
import { TenantService } from '@app/core/services/tenant.service';
import { FinanceService } from '@app/features/finance/application/services/finance.service';
import { WhatsappService } from '@app/core/services/whatsapp.service';
import { CreateRepairDto, RepairStatus } from '../../domain/entities/repair.entity';
import { of } from 'rxjs';

describe('RepairWorkflowService', () => {
  let service: RepairWorkflowService;
  let mockRepairRepo: any;
  let mockStockService: any;
  let mockTenantService: any;
  let mockFinanceService: any;
  let mockWhatsappService: any;

  beforeEach(() => {
    mockRepairRepo = {
      create: jest.fn(),
      getById: jest.fn(),
      update: jest.fn(),
    };

    mockStockService = {
      deductStock: jest.fn().mockResolvedValue(undefined),
      updateStock: jest.fn().mockResolvedValue(undefined),
    };

    mockTenantService = {
      getTenantId: jest.fn().mockReturnValue('tenant-test-123'),
    };

    mockFinanceService = {
      recordMovement: jest.fn().mockResolvedValue({ id: 'cm-1' }),
      hasMovement: jest.fn().mockResolvedValue(false),
    };

    mockWhatsappService = {
      sendTemplateMessage: jest.fn().mockReturnValue(of({ success: true })),
    };

    TestBed.configureTestingModule({
      providers: [
        RepairWorkflowService,
        { provide: RepairRepository, useValue: mockRepairRepo },
        { provide: StockManagementService, useValue: mockStockService },
        { provide: TenantService, useValue: mockTenantService },
        { provide: FinanceService, useValue: mockFinanceService },
        { provide: WhatsappService, useValue: mockWhatsappService },
      ],
    });

    service = TestBed.inject(RepairWorkflowService);
  });

  describe('processNewRepair', () => {
    it('debe crear la reparación y registrar seña si depositAmount > 0', async () => {
      const mockSavedRepair = {
        id: 'rep-001',
        tracking_code: 'ARX-101',
        customer_phone: '1122334455',
        customer_name: 'Carlos Perez',
        device_model: 'Moto G52',
      };
      mockRepairRepo.create.mockReturnValue(of(mockSavedRepair));

      const dto: CreateRepairDto = {
        device_model: 'Moto G52',
        issue_description: 'Pantalla rota',
        customer_name: 'Carlos Perez',
        customer_phone: '1122334455',
        parts: [
          { product_id: 'prod-screen', name: 'Módulo Moto G52', cost_at_time: 15000, quantity: 1 }
        ],
      };

      const result = await service.processNewRepair(dto, 20000, 'branch-central');

      expect(result).toEqual(mockSavedRepair);
      expect(mockStockService.deductStock).toHaveBeenCalledWith('prod-screen', 'branch-central', 1);
      expect(mockFinanceService.recordMovement).toHaveBeenCalledWith(
        expect.objectContaining({
          amount: 20000,
          type: 'income',
          category: 'repair',
          reference_id: 'rep-001',
          notes: expect.stringContaining('Seña inicial en Ficha #ARX-101'),
        })
      );
    });

    it('no debe registrar movimiento financiero si depositAmount es 0', async () => {
      const mockSavedRepair = {
        id: 'rep-002',
        tracking_code: 'ARX-102',
      };
      mockRepairRepo.create.mockReturnValue(of(mockSavedRepair));

      const dto: CreateRepairDto = {
        device_model: 'iPhone 11',
        issue_description: 'Batería inflada',
      };

      await service.processNewRepair(dto, 0, 'branch-central');

      expect(mockFinanceService.recordMovement).not.toHaveBeenCalled();
    });
  });

  describe('processUpdateRepair (Reconciliación y Cancelación)', () => {
    it('debe registrar egreso de caja y devolver seña cuando la reparación pasa a CANCELADA (7)', async () => {
      const originalRepair = {
        id: 'rep-cancel-1',
        tracking_code: 'ARX-501',
        current_status_id: 1, // PENDING_DIAGNOSIS
        deposit_amount: 15000,
        branch_id: 'branch-central',
        parts: [
          { product_id: 'part-bateria', name: 'Batería Original', quantity: 1 }
        ],
      };
      mockRepairRepo.getById.mockReturnValue(of(originalRepair));
      mockRepairRepo.update.mockReturnValue(of(undefined));
      mockFinanceService.hasMovement.mockResolvedValue(false);

      await service.processUpdateRepair('rep-cancel-1', {
        current_status_id: RepairStatus.CANCELLED, // 7
      });

      // 1. Debe haber persistido la actualización
      expect(mockRepairRepo.update).toHaveBeenCalledWith('rep-cancel-1', expect.objectContaining({
        current_status_id: 7,
      }));

      // 2. Debe registrar un movimiento de egreso (expense) devolviendo la seña
      expect(mockFinanceService.recordMovement).toHaveBeenCalledWith(
        expect.objectContaining({
          amount: 15000,
          type: 'expense',
          category: 'repair',
          reference_id: 'rep-cancel-1',
          notes: expect.stringContaining('Devolución de seña por reparación cancelada #ARX-501'),
        })
      );

      // 3. Debe devolver los repuestos asignados al stock
      expect(mockStockService.deductStock).toHaveBeenCalledWith('part-bateria', 'branch-central', -1);
    });

    it('idempotencia: no debe duplicar el egreso de devolución si ya existía en caja', async () => {
      const originalRepair = {
        id: 'rep-cancel-dup',
        tracking_code: 'ARX-502',
        current_status_id: 1,
        deposit_amount: 25000,
        branch_id: 'branch-central',
      };
      mockRepairRepo.getById.mockReturnValue(of(originalRepair));
      mockRepairRepo.update.mockReturnValue(of(undefined));
      mockFinanceService.hasMovement.mockResolvedValue(true); // Ya existe egreso previo

      await service.processUpdateRepair('rep-cancel-dup', {
        current_status_id: 7,
      });

      expect(mockFinanceService.recordMovement).not.toHaveBeenCalled();
    });

    it('al cancelar una orden sin seña (deposit_amount = 0), no debe registrar egreso', async () => {
      const originalRepair = {
        id: 'rep-cancel-zero',
        tracking_code: 'ARX-503',
        current_status_id: 2,
        deposit_amount: 0,
        branch_id: 'branch-central',
      };
      mockRepairRepo.getById.mockReturnValue(of(originalRepair));
      mockRepairRepo.update.mockReturnValue(of(undefined));

      await service.processUpdateRepair('rep-cancel-zero', {
        current_status_id: 7,
      });

      expect(mockFinanceService.recordMovement).not.toHaveBeenCalled();
    });

    it('al pasar a ENTREGADO (6) debe registrar el saldo restante como ingreso', async () => {
      const originalRepair = {
        id: 'rep-delivered-1',
        tracking_code: 'ARX-601',
        current_status_id: 5, // READY_FOR_PICKUP
        final_cost: 50000,
        deposit_amount: 15000,
        branch_id: 'branch-central',
      };
      mockRepairRepo.getById.mockReturnValue(of(originalRepair));
      mockRepairRepo.update.mockReturnValue(of(undefined));

      await service.processUpdateRepair('rep-delivered-1', {
        current_status_id: 6, // DELIVERED
        final_cost: 50000,
      });

      // Saldo restante: 50000 - 15000 = 35000
      expect(mockFinanceService.recordMovement).toHaveBeenCalledWith(
        expect.objectContaining({
          amount: 35000,
          type: 'income',
          category: 'repair',
          reference_id: 'rep-delivered-1',
          notes: expect.stringContaining('Saldo final cobrado al entregar equipo #ARX-601'),
        })
      );
    });
  });
});
