import { TestBed } from '@angular/core/testing';
import { PublicBranchIdentityResolver } from './public-branch-identity.resolver';
import { AuthenticatedBranchIdentityResolver } from './authenticated-branch-identity.resolver';
import { SUPABASE_CLIENT } from '@app/core/di/supabase-token';
import { LoggerService } from '@app/core/services/logger.service';

describe('Branch Identity Resolvers (Public vs Authenticated)', () => {
  let publicResolver: PublicBranchIdentityResolver;
  let authResolver: AuthenticatedBranchIdentityResolver;
  let mockSupabase: any;

  beforeEach(() => {
    mockSupabase = {
      rpc: jest.fn(),
      from: jest.fn(),
    };

    const mockLogger = {
      error: jest.fn(),
      warn: jest.fn(),
      info: jest.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        PublicBranchIdentityResolver,
        AuthenticatedBranchIdentityResolver,
        { provide: SUPABASE_CLIENT, useValue: mockSupabase },
        { provide: LoggerService, useValue: mockLogger },
      ],
    });

    publicResolver = TestBed.inject(PublicBranchIdentityResolver);
    authResolver = TestBed.inject(AuthenticatedBranchIdentityResolver);
  });

  describe('PublicBranchIdentityResolver', () => {
    it('resolveBySlug calls get_public_branch RPC and returns sanitized public identity without taxId or bankInfo', async () => {
      const rpcData = {
        id: 'branch-100',
        name: 'Sucursal Centro',
        official_name: 'Sucursal Centro SRL',
        slug: 'centro',
        address: 'Calle Falsa 123',
        contact_phone: '1122334455',
        whatsapp_number: '5491122334455',
        contact_email: 'centro@empresa.com',
        branding_settings: { primary_color: '#3b82f6' },
        tenant_id: 'tenant-1',
        updated_at: '2026-11-04T12:00:00Z',
      };

      mockSupabase.rpc.mockReturnValue({
        maybeSingle: jest.fn().mockResolvedValue({ data: rpcData, error: null }),
      });

      const result = await publicResolver.resolveBySlug('centro');

      expect(mockSupabase.rpc).toHaveBeenCalledWith('get_public_branch', { p_slug: 'centro' });
      expect(result).toBeDefined();
      expect(result?.id).toBe('branch-100');
      expect(result?.slug).toBe('centro');
      expect((result as any).taxId).toBeUndefined();
      expect((result as any).tax_id).toBeUndefined();
      expect((result as any).bankInfo).toBeUndefined();
      expect((result as any).bank_info).toBeUndefined();
    });

    it('resolveById calls get_public_branch_by_id RPC and returns sanitized public identity without taxId or bankInfo', async () => {
      const rpcData = {
        id: 'branch-100',
        name: 'Sucursal Centro',
        official_name: 'Sucursal Centro SRL',
        slug: 'centro',
        address: 'Calle Falsa 123',
        contact_phone: '1122334455',
        whatsapp_number: '5491122334455',
        contact_email: 'centro@empresa.com',
        branding_settings: { primary_color: '#3b82f6' },
        tenant_id: 'tenant-1',
        updated_at: '2026-11-04T12:00:00Z',
      };

      mockSupabase.rpc.mockReturnValue({
        maybeSingle: jest.fn().mockResolvedValue({ data: rpcData, error: null }),
      });

      const result = await publicResolver.resolveById('branch-100');

      expect(mockSupabase.rpc).toHaveBeenCalledWith('get_public_branch_by_id', { p_id: 'branch-100' });
      expect(result).toBeDefined();
      expect(result?.id).toBe('branch-100');
      expect(result?.slug).toBe('centro');
      expect((result as any).taxId).toBeUndefined();
      expect((result as any).tax_id).toBeUndefined();
      expect((result as any).bankInfo).toBeUndefined();
      expect((result as any).bank_info).toBeUndefined();
    });

    it('returns null if slug does not exist or RPC returns null', async () => {
      mockSupabase.rpc.mockReturnValue({
        maybeSingle: jest.fn().mockResolvedValue({ data: null, error: null }),
      });

      const result = await publicResolver.resolveBySlug('nonexistent');
      expect(result).toBeNull();
    });
  });

  describe('AuthenticatedBranchIdentityResolver', () => {
    it('resolveById queries branches under authenticated RLS and preserves taxId and bankInfo', async () => {
      const fullBranchDb = {
        id: 'branch-100',
        name: 'Sucursal Centro',
        official_name: 'Sucursal Centro SRL',
        slug: 'centro',
        address: 'Calle Falsa 123',
        contact_phone: '1122334455',
        whatsapp_number: '5491122334455',
        contact_email: 'centro@empresa.com',
        branding_settings: { primary_color: '#3b82f6' },
        tenant_id: 'tenant-1',
        updated_at: '2026-11-04T12:00:00Z',
        tax_id: '30-71649281-9',
        bank_info: { cbu: '0170099220000012345678', alias: 'CENTRO.PAGOS' },
        modules_config: { repairs: true },
        global_markup_percentage: 15,
        is_active: true,
        created_at: '2026-01-01T00:00:00Z',
      };

      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            maybeSingle: jest.fn().mockResolvedValue({ data: fullBranchDb, error: null }),
          }),
        }),
      });

      const result = await authResolver.resolveById('branch-100');

      expect(mockSupabase.from).toHaveBeenCalledWith('branches');
      expect(result).toBeDefined();
      expect(result?.taxId).toBe('30-71649281-9');
      expect(result?.bankInfo?.cbu).toBe('0170099220000012345678');
      expect(result?.globalMarkupPercentage).toBe(15);
    });
  });
});
