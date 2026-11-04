import { Injectable, inject } from '@angular/core';
import { SUPABASE_CLIENT } from '@app/core/di/supabase-token';
import { LoggerService } from '@app/core/services/logger.service';
import { AuthenticatedBranchIdentity } from '@app/core/domain/identity/branch-identity.vo';

@Injectable({
  providedIn: 'root'
})
export class AuthenticatedBranchIdentityResolver {
  private supabase = inject(SUPABASE_CLIENT);
  private logger = inject(LoggerService);

  /**
   * Resolves full branch identity under tenant-isolated authenticated RLS.
   * Includes taxId, bankInfo and configuration for authorized operators and admins.
   */
  async resolveById(branchId: string): Promise<AuthenticatedBranchIdentity | null> {
    if (!branchId) return null;

    try {
      const { data, error } = await this.supabase
        .from('branches')
        .select('*')
        .eq('id', branchId)
        .maybeSingle();

      if (error) {
        this.logger.error('[AuthenticatedBranchIdentityResolver] Query error:', error);
        return null;
      }

      if (!data) return null;

      const raw = data as Record<string, unknown>;
      return {
        id: raw['id'] as string,
        name: raw['name'] as string,
        officialName: (raw['official_name'] as string) || null,
        slug: raw['slug'] as string,
        address: (raw['address'] as string) || null,
        contactPhone: (raw['contact_phone'] as string) || null,
        whatsappNumber: (raw['whatsapp_number'] as string) || null,
        contactEmail: (raw['contact_email'] as string) || null,
        brandingSettings: (raw['branding_settings'] as AuthenticatedBranchIdentity['brandingSettings']) || null,
        tenantId: raw['tenant_id'] as string,
        updatedAt: raw['updated_at'] as string,
        taxId: (raw['tax_id'] as string) || null,
        bankInfo: (raw['bank_info'] as AuthenticatedBranchIdentity['bankInfo']) || null,
        modulesConfig: (raw['modules_config'] as Record<string, unknown>) || null,
        globalMarkupPercentage: Number(raw['global_markup_percentage']) || 0,
        isActive: Boolean(raw['is_active']),
        createdAt: raw['created_at'] as string,
      };
    } catch (e) {
      this.logger.error('[AuthenticatedBranchIdentityResolver] Exception:', e);
      return null;
    }
  }

  /**
   * Resolves full branch identity by slug for authenticated administrative routes.
   */
  async resolveBySlug(slug: string): Promise<AuthenticatedBranchIdentity | null> {
    if (!slug) return null;

    try {
      const { data, error } = await this.supabase
        .from('branches')
        .select('*')
        .eq('slug', slug)
        .maybeSingle();

      if (error) {
        this.logger.error('[AuthenticatedBranchIdentityResolver] Query error:', error);
        return null;
      }

      if (!data) return null;

      const raw = data as Record<string, unknown>;
      return {
        id: raw['id'] as string,
        name: raw['name'] as string,
        officialName: (raw['official_name'] as string) || null,
        slug: raw['slug'] as string,
        address: (raw['address'] as string) || null,
        contactPhone: (raw['contact_phone'] as string) || null,
        whatsappNumber: (raw['whatsapp_number'] as string) || null,
        contactEmail: (raw['contact_email'] as string) || null,
        brandingSettings: (raw['branding_settings'] as AuthenticatedBranchIdentity['brandingSettings']) || null,
        tenantId: raw['tenant_id'] as string,
        updatedAt: raw['updated_at'] as string,
        taxId: (raw['tax_id'] as string) || null,
        bankInfo: (raw['bank_info'] as AuthenticatedBranchIdentity['bankInfo']) || null,
        modulesConfig: (raw['modules_config'] as Record<string, unknown>) || null,
        globalMarkupPercentage: Number(raw['global_markup_percentage']) || 0,
        isActive: Boolean(raw['is_active']),
        createdAt: raw['created_at'] as string,
      };
    } catch (e) {
      this.logger.error('[AuthenticatedBranchIdentityResolver] Exception:', e);
      return null;
    }
  }

  /**
   * Resolves the primary default active branch for the authenticated tenant.
   */
  async fetchDefaultTenantBranch(tenantId: string): Promise<AuthenticatedBranchIdentity | null> {
    if (!tenantId) return null;

    try {
      const { data, error } = await this.supabase
        .from('branches')
        .select('*')
        .eq('tenant_id', tenantId)
        .eq('is_active', true)
        .order('created_at', { ascending: true })
        .limit(1)
        .maybeSingle();

      if (error || !data) return null;

      const raw = data as Record<string, unknown>;
      return {
        id: raw['id'] as string,
        name: raw['name'] as string,
        officialName: (raw['official_name'] as string) || null,
        slug: raw['slug'] as string,
        address: (raw['address'] as string) || null,
        contactPhone: (raw['contact_phone'] as string) || null,
        whatsappNumber: (raw['whatsapp_number'] as string) || null,
        contactEmail: (raw['contact_email'] as string) || null,
        brandingSettings: (raw['branding_settings'] as AuthenticatedBranchIdentity['brandingSettings']) || null,
        tenantId: raw['tenant_id'] as string,
        updatedAt: raw['updated_at'] as string,
        taxId: (raw['tax_id'] as string) || null,
        bankInfo: (raw['bank_info'] as AuthenticatedBranchIdentity['bankInfo']) || null,
        modulesConfig: (raw['modules_config'] as Record<string, unknown>) || null,
        globalMarkupPercentage: Number(raw['global_markup_percentage']) || 0,
        isActive: Boolean(raw['is_active']),
        createdAt: raw['created_at'] as string,
      };
    } catch (e) {
      this.logger.error('[AuthenticatedBranchIdentityResolver] Default branch error:', e);
      return null;
    }
  }
}
