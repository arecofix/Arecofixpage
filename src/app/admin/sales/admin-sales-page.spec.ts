import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { AdminSalesPage } from './admin-sales-page';
import { OrderService } from '@app/features/orders/application/services/order.service';
import { InvoiceService } from '@app/features/sales/application/invoice.service';
import { ProductRepository } from '@app/features/products/domain/repositories/product.repository';
import { AdminProductService } from '@app/admin/products/services/admin-product.service';
import { LoggerService } from '@app/core/services/logger.service';
import { FinanceService } from '@app/features/finance/application/services/finance.service';
import { TenantService } from '@app/core/services/tenant.service';
import { NotificationService } from '@app/core/services/notification.service';
import { BranchContextService } from '@app/core/services/branch-context.service';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('AdminSalesPage', () => {
    let component: AdminSalesPage;
    let fixture: ComponentFixture<AdminSalesPage>;
    let mockAdminProductService: any;
    let mockRouter: any;

    beforeEach(async () => {
        mockAdminProductService = {
            getProductsPaginated: jest.fn().mockResolvedValue({ data: [], items: 0, pages: 1 })
        };

        mockRouter = {
            navigate: jest.fn()
        };

        await TestBed.configureTestingModule({
            imports: [AdminSalesPage],
            providers: [
                { provide: AdminProductService, useValue: mockAdminProductService },
                { provide: ProductRepository, useValue: {} },
                { provide: OrderService, useValue: {} },
                { provide: InvoiceService, useValue: {} },
                { provide: LoggerService, useValue: { error: jest.fn() } },
                { provide: FinanceService, useValue: {} },
                { provide: TenantService, useValue: { currentTenant: jest.fn().mockReturnValue({ usd_rate: 1000 }) } },
                { provide: NotificationService, useValue: {} },
                { provide: BranchContextService, useValue: { getBranchId: jest.fn().mockReturnValue('branch1') } },
                { provide: ActivatedRoute, useValue: { queryParams: of({}) } },
                { provide: Router, useValue: mockRouter }
            ],
            schemas: [NO_ERRORS_SCHEMA]
        }).compileComponents();

        fixture = TestBed.createComponent(AdminSalesPage);
        component = fixture.componentInstance;
    });

    it('should create the component', () => {
        expect(component).toBeTruthy();
    });

    it('should debounce search input and trigger server-side query', fakeAsync(() => {
        fixture.detectChanges();
        
        // Reset mock to ignore initial load
        mockAdminProductService.getProductsPaginated.mockClear();

        // Simulate typing quickly
        component.onSearchChange('i');
        component.onSearchChange('iph');
        component.onSearchChange('iphone');
        
        // Before 300ms, no query should be made
        tick(150);
        expect(mockAdminProductService.getProductsPaginated).not.toHaveBeenCalled();

        // After 300ms, exactly one query should be made with the final term
        tick(150);
        
        expect(mockAdminProductService.getProductsPaginated).toHaveBeenCalledTimes(1);
        expect(mockAdminProductService.getProductsPaginated).toHaveBeenCalledWith(
            expect.objectContaining({
                q: 'iphone',
                _page: 1,
                _per_page: 24
            })
        );
        
        // Verify UI states synced correctly
        expect(component.searchQuery()).toBe('iphone');
        expect(component.searchInputText()).toBe('iphone');
        expect(component.currentPage()).toBe(1);
    }));
});
