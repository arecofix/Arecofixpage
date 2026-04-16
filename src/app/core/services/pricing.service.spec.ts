import { TestBed } from '@angular/core/testing';
import { PricingService } from './pricing.service';
import { TenantService } from './tenant.service';
import { signal } from '@angular/core';

describe('PricingService', () => {
    let service: PricingService;
    let tenantServiceMock: any;

    beforeEach(() => {
        // Mocking TenantService with a signal
        tenantServiceMock = {
            currentTenant: signal({
                usd_rate: 1000,
                tax_percentage: 21
            })
        };

        TestBed.configureTestingModule({
            providers: [
                PricingService,
                { provide: TenantService, useValue: tenantServiceMock }
            ]
        });
        service = TestBed.inject(PricingService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should convert USD to local currency correctly', () => {
        const usdAmount = 10;
        const expectedLocal = 10000; // 10 * 1000
        expect(service.convertToLocal(usdAmount)).toBe(expectedLocal);
    });

    it('should calculate final price with 21% tax and round it', () => {
        const subtotal = 100;
        const expectedTotal = 121; // 100 * 1.21
        expect(service.calculateFinalPrice(subtotal)).toBe(expectedTotal);
    });

    it('should calculate final price and round to nearest integer', () => {
        const subtotal = 100.45;
        // 100.45 * 1.21 = 121.5445 -> rounded 122
        expect(service.calculateFinalPrice(subtotal)).toBe(122);
    });

    it('should calculate tax amount correctly', () => {
        const subtotal = 200;
        const expectedTax = 42; // 200 * 0.21
        expect(service.calculateTaxAmount(subtotal)).toBe(expectedTax);
    });

    it('should update calculations when tenant settings change', () => {
        // Change tax to 10%
        tenantServiceMock.currentTenant.set({
            usd_rate: 500,
            tax_percentage: 10
        });

        expect(service.convertToLocal(10)).toBe(5000);
        expect(service.calculateFinalPrice(100)).toBe(110);
    });
});
