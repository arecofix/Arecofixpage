import { TestBed } from '@angular/core/testing';
import { PLATFORM_ID } from '@angular/core';
import { TenantService, Tenant } from './tenant.service';
import { LoggerService } from './logger.service';
import { SUPABASE_CLIENT } from '../di/supabase-token';
import { TENANT_CONSTANTS } from '../constants/tenant.constants';

describe('TenantService (Destructive & Adversarial QA Battery)', () => {
  let service: TenantService;
  let loggerMock: { debug: jest.Mock; info: jest.Mock; warn: jest.Mock; error: jest.Mock };
  let supabaseMock: any;

  const validMasterTenant: Tenant = {
    id: 'bba26ccd-59ce-471c-aac0-4c1f5513de3b',
    name: 'Arecofix Central',
    slug: 'arecofix',
    is_active: true,
    plan_type: 'enterprise',
    currency: 'ARS',
    usd_rate: 1240,
    tax_percentage: 21,
    branding_settings: {
      primary_color: '#0055ff',
      company_name: 'Arecofix IT'
    }
  };

  const validBranchTenant: Tenant = {
    id: '11111111-2222-3333-4444-555555555555',
    name: 'Sucursal Pilar',
    slug: 'pilar',
    is_active: true,
    plan_type: 'premium',
    currency: 'ARS',
    usd_rate: 1240,
    tax_percentage: 21,
    branding_settings: {
      primary_color: '#10b981'
    }
  };

  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();

    loggerMock = {
      debug: jest.fn(),
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn()
    };

    // Chainable Supabase Query Builder mock
    supabaseMock = {
      from: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({ data: validMasterTenant, error: null }),
      maybeSingle: jest.fn().mockResolvedValue({ data: null, error: null })
    };

    TestBed.configureTestingModule({
      providers: [
        TenantService,
        { provide: LoggerService, useValue: loggerMock },
        { provide: SUPABASE_CLIENT, useValue: supabaseMock },
        { provide: PLATFORM_ID, useValue: 'browser' }
      ]
    });

    service = TestBed.inject(TenantService);
  });

  afterEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    jest.clearAllMocks();
  });

  describe('Adversarial & Malformed Hostname Injections', () => {
    it('should withstand Path Traversal hostnames without crashing and fall back safely', async () => {
      supabaseMock.maybeSingle.mockResolvedValueOnce({ data: null, error: null }) // custom_domain
                            .mockResolvedValueOnce({ data: null, error: null }) // slug
                            .mockResolvedValueOnce({ data: validMasterTenant, error: null }); // fallback

      const maliciousHost = '../../../../etc/passwd';
      const resolved = await service.resolveTenantByHostname(maliciousHost);

      expect(resolved).toBeTruthy();
      expect(resolved?.id).toBe(validMasterTenant.id);
    });

    it('should neutralize XSS injection payloads in hostnames and prevent DOM script execution', async () => {
      supabaseMock.maybeSingle.mockResolvedValueOnce({ data: null, error: null })
                            .mockResolvedValueOnce({ data: null, error: null })
                            .mockResolvedValueOnce({ data: null, error: null });

      const xssHost = '<script>window.__pwned=true;alert(1)</script>.arecofix.com.ar';
      const resolved = await service.resolveTenantByHostname(xssHost);

      expect((window as any).__pwned).toBeUndefined();
      expect(resolved).toBeTruthy();
      expect(resolved?.id).toBe(TENANT_CONSTANTS.FALLBACK_ID);
    });

    it('should handle SQL injection vectors in hostname without unhandled rejections', async () => {
      supabaseMock.maybeSingle.mockResolvedValueOnce({
        data: null,
        error: { message: 'syntax error at or near "\'"', code: '42601' }
      }).mockResolvedValueOnce({ data: null, error: null })
        .mockResolvedValueOnce({ data: validMasterTenant, error: null });

      const sqlPayload = "' OR '1'='1'; DROP TABLE tenants; --";
      const resolved = await service.resolveTenantByHostname(sqlPayload);

      expect(loggerMock.error).toHaveBeenCalled();
      expect(resolved).toBeTruthy();
      expect(resolved?.id).toBe(validMasterTenant.id);
    });

    it('should withstand 10,000 character buffer overflow string as hostname', async () => {
      const bufferOverflowHost = 'a'.repeat(10000) + '.arecofix.com.ar';
      
      supabaseMock.maybeSingle.mockResolvedValueOnce({ data: null, error: null })
                            .mockResolvedValueOnce({ data: null, error: null })
                            .mockResolvedValueOnce({ data: validMasterTenant, error: null });

      const resolved = await service.resolveTenantByHostname(bufferOverflowHost);
      expect(resolved).toBeTruthy();
    });

    it('should gracefully handle empty, whitespace-only, and special character hostnames', async () => {
      supabaseMock.maybeSingle.mockResolvedValue({ data: null, error: null });

      const hosts = ['', '   ', '!!!@@@###$$$', ':::1', '127.0.0.1:9999'];
      for (const host of hosts) {
        const resolved = await service.resolveTenantByHostname(host);
        expect(resolved).toBeTruthy();
        expect(resolved?.id).toBe(TENANT_CONSTANTS.FALLBACK_ID);
      }
    });
  });

  describe('Extreme API Failures & Database Drop Simulation', () => {
    it('should intercept Network Abort/Drop ("Failed to fetch") and bail out to Mock Tenant instantly', async () => {
      supabaseMock.maybeSingle.mockResolvedValueOnce({
        data: null,
        error: new Error('Failed to fetch: network connection closed by peer')
      });

      const resolved = await service.resolveTenantByHostname('sucursal-norte.arecofix.com.ar');

      expect(loggerMock.warn).toHaveBeenCalledWith(
        expect.stringContaining('Network error detected')
      );
      expect(resolved).toBeTruthy();
      expect(resolved?.id).toBe(TENANT_CONSTANTS.FALLBACK_ID);
      expect(resolved?.slug).toBe('demo');
    });

    it('should survive Supabase throwing unhandled synchronous exceptions inside query execution', async () => {
      supabaseMock.from.mockImplementationOnce(() => {
        throw new Error('FATAL: PostgreSQL socket closed unexpectedly (SIGKILL)');
      });

      const resolved = await service.resolveTenantByHostname('sucursal.com.ar');

      expect(loggerMock.error).toHaveBeenCalledWith(
        'Critical failure in resolveTenantByHostname',
        expect.any(Error)
      );
      expect(resolved).toBeNull();
    });

    it('should safely normalize malformed tenant payloads with null or undefined branding_settings', () => {
      const malformedTenant: any = {
        id: '12345678-1234-1234-1234-123456789abc',
        name: 'Inquilino Roto',
        slug: 'roto',
        branding_settings: null // Intentionally null
      };

      expect(() => service.setTenant(malformedTenant)).not.toThrow();
      expect(service.currentTenant()?.id).toBe('12345678-1234-1234-1234-123456789abc');
      expect(service.isInitialized()).toBe(true);
    });
  });

  describe('State Corruption, LocalStorage Tampering & UUID Rigor', () => {
    it('should sanitize corrupted localStorage values like "null", "undefined", "[object Object]" and return fallback', () => {
      const corruptedValues = ['null', 'undefined', '[object Object]', 'NaN', '12345', 'SELECT * FROM users'];

      for (const val of corruptedValues) {
        localStorage.setItem('arecofix_tenant_id', val);
        const tenantId = service.getTenantId();

        expect(tenantId).toBe(TENANT_CONSTANTS.FALLBACK_ID);
        // Corrupted value must be pruned from storage
        expect(localStorage.getItem('arecofix_tenant_id')).toBeNull();
      }
    });

    it('should successfully return valid UUID stored in localStorage', () => {
      const validUuid = '11111111-2222-3333-4444-555555555555';
      localStorage.setItem('arecofix_tenant_id', validUuid);

      const tenantId = service.getTenantId();
      expect(tenantId).toBe(validUuid);
    });

    it('should handle rapid concurrent setCurrentTenant switches without state corruption', async () => {
      const tenantA = { ...validBranchTenant, id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', name: 'Branch A' };
      const tenantB = { ...validBranchTenant, id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', name: 'Branch B' };

      supabaseMock.maybeSingle
        .mockResolvedValueOnce({ data: tenantA, error: null })
        .mockResolvedValueOnce({ data: tenantB, error: null });

      const p1 = service.setCurrentTenant(tenantA.id);
      const p2 = service.setCurrentTenant(tenantB.id);

      await Promise.all([p1, p2]);

      const current = service.currentTenant();
      expect(current).toBeTruthy();
      expect([tenantA.id, tenantB.id]).toContain(current?.id);
    });

    it('should correctly evaluate isMainTenant and isBranch states', () => {
      service.setTenant(validMasterTenant);
      expect(service.isMainTenant()).toBe(true);
      expect(service.isBranch()).toBe(false);

      service.setTenant(validBranchTenant);
      expect(service.isMainTenant()).toBe(false);
      expect(service.isBranch()).toBe(true);
    });
  });
});
