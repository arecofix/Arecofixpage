import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminRepairFormPage } from './admin-repair-form-page';
import { ActivatedRoute, Router } from '@angular/router';
import { CompanyService } from '@app/core/services/company.service';
import { BranchService } from '@app/core/services/branch.service';
import { AdminRepairService } from '@app/features/repairs/application/services/admin-repair.service';
import { UpdateRepairUseCase } from '@app/features/repairs/application/use-cases/update-repair.use-case';
import { AdminProductService } from '@app/admin/products/services/admin-product.service';
import { AuthService } from '@app/core/services/auth.service';
import { PricingService } from '@app/core/services/pricing.service';
import { CustomerService } from '@app/features/customers/application/services/customer.service';
import { SupplierService } from '@app/features/customers/application/services/supplier.service';
import { NotificationService } from '@app/core/services/notification.service';
import { RepairPdfService } from '@app/features/repairs/application/services/repair-pdf.service';
import { TenantService } from '@app/core/services/tenant.service';
import { RepairWorkflowService } from '@app/features/repairs/application/services/repair-workflow.service';
import { RepairCalculatorService } from '@app/features/repairs/application/services/repair-calculator.service';
import { SupabaseService } from '@app/core/services/supabase.service';
import { OfflineSyncService } from '@app/core/services/offline-sync.service';
import { ICustomerDeviceRepository } from '@app/features/devices/domain/repositories/customer-device.repository';
import { of } from 'rxjs';
import { signal } from '@angular/core';

describe('AdminRepairFormPage', () => {
  let fixture: ComponentFixture<AdminRepairFormPage>;
  let component: AdminRepairFormPage;

  const createComponent = async (id: string | null = null, repairData: any = null) => {
    await TestBed.configureTestingModule({
      imports: [AdminRepairFormPage],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { paramMap: { get: () => id } },
            queryParams: of({}),
          },
        },
        {
          provide: Router,
          useValue: { navigate: jest.fn() },
        },
        {
          provide: CompanyService,
          useValue: { getSettings: jest.fn().mockResolvedValue({ name: 'Arecofix Test' }) },
        },
        {
          provide: BranchService,
          useValue: { getCurrentBranchId: () => 'b1', currentBranch: signal({ name: 'Central' }) },
        },
        {
          provide: AdminRepairService,
          useValue: {
            getById: jest.fn().mockResolvedValue(repairData),
          },
        },
        { provide: UpdateRepairUseCase, useValue: {} },
        { provide: AdminProductService, useValue: { getProducts: jest.fn().mockResolvedValue([]) } },
        { provide: AuthService, useValue: { getCurrentProfile: () => ({ role: 'admin' }), isSuperAdmin: () => true } },
        { provide: PricingService, useValue: {} },
        { provide: TenantService, useValue: { getTenantId: () => 't1' } },
        { provide: CustomerService, useValue: { getRecentClients: jest.fn().mockResolvedValue([]) } },
        { provide: SupplierService, useValue: { getSuppliers: jest.fn().mockResolvedValue([]), getAll: jest.fn().mockResolvedValue([]) } },
        { provide: NotificationService, useValue: { showSuccess: jest.fn(), showError: jest.fn() } },
        { provide: RepairPdfService, useValue: {} },
        { provide: RepairWorkflowService, useValue: {} },
        {
          provide: RepairCalculatorService,
          useValue: {
            calculateFinancials: jest.fn().mockImplementation((parts: any[]) => ({
              updatedParts: parts || [],
              partsTotal: 10000,
              partsCostTotal: 5000,
              calculatedFinalCost: 15000,
            })),
          },
        },
        {
          provide: SupabaseService,
          useValue: {
            getClient: () => ({
              from: () => ({ select: () => ({ order: jest.fn().mockResolvedValue({ data: [] }) }) }),
            }),
          },
        },
        { provide: OfflineSyncService, useValue: { pendingCount: signal(0) } },
        { provide: ICustomerDeviceRepository, useValue: {} },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminRepairFormPage);
    component = fixture.componentInstance;
  };

  it('should initialize cleanly without errors for new repair', async () => {
    await createComponent(null);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    expect(component).toBeTruthy();
    expect(component.repairForm).toBeDefined();
    expect(component.repairForm.get('customer_name')).toBeTruthy();
  });

  it('should initialize cleanly with parts without NgModel reactive form collisions', async () => {
    await createComponent('repair-1', {
      id: 'repair-1',
      customer_name: 'Cliente Con Repuestos',
      device_model: 'iPhone 13',
      current_status_id: 1,
      estimated_cost: 25000,
      final_cost: 25000,
      parts: [
        {
          id: 'part-1',
          product_id: 'prod-1',
          product_name: 'Pantalla OLED',
          quantity: 2,
          unit_price_at_time: 10000,
        },
      ],
    });

    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(component.parts().length).toBe(1);
    expect(component.parts()[0].product_name).toBe('Pantalla OLED');

    // Simulate quantity and price updates without throwing
    component.updatePartQuantity(0, 3);
    component.updatePartPrice(0, 12000);

    expect(component.parts()[0].quantity).toBe(3);
    expect(component.parts()[0].unit_price_at_time).toBe(12000);
  });
});
