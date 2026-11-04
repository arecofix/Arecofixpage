import { Injectable, inject } from '@angular/core';
import { SUPABASE_CLIENT } from '@app/core/di/supabase-token';
import { LoggerService } from '@app/core/services/logger.service';
import { PublicBranchIdentity } from '@app/core/domain/identity/branch-identity.vo';

@Injectable({
  providedIn: 'root'
})
export class PublicBranchIdentityResolver {
  private supabase = inject(SUPABASE_CLIENT);
  private logger = inject(LoggerService);
  private cache = new Map<string, PublicBranchIdentity>();

  /**
   * Resolves safe public branch identity via anti-enumeration RPC get_public_branch.
   * Strips all fiscal and banking credentials.
   */
  async resolveBySlug(slug: string): Promise<PublicBranchIdentity | null> {
    if (!slug) return null;
    const normalizedSlug = slug.toLowerCase().trim();

    if (this.cache.has(normalizedSlug)) {
      return this.cache.get(normalizedSlug)!;
    }

    try {
      const { data, error } = await this.supabase
        .rpc('get_public_branch', { p_slug: normalizedSlug })
        .maybeSingle();

      if (error) {
        this.logger.error('[PublicBranchIdentityResolver] RPC error:', error);
        return null;
      }

      if (!data) {
        return null;
      }

      const raw = data as Record<string, unknown>;
      const identity: PublicBranchIdentity = {
        id: raw['id'] as string,
        name: raw['name'] as string,
        officialName: (raw['official_name'] as string) || null,
        slug: raw['slug'] as string,
        address: (raw['address'] as string) || null,
        contactPhone: (raw['contact_phone'] as string) || null,
        whatsappNumber: (raw['whatsapp_number'] as string) || null,
        contactEmail: (raw['contact_email'] as string) || null,
        brandingSettings: (raw['branding_settings'] as PublicBranchIdentity['brandingSettings']) || null,
        tenantId: raw['tenant_id'] as string,
        updatedAt: raw['updated_at'] as string,
      };

      this.cache.set(normalizedSlug, identity);
      if (identity.id) {
        this.cache.set(identity.id, identity);
      }
      return identity;
    } catch (e) {
      this.logger.error('[PublicBranchIdentityResolver] Exception:', e);
      return null;
    }
  }

  /**
   * Resolves safe public branch identity via anti-enumeration RPC get_public_branch_by_id.
   * Strips all fiscal and banking credentials.
   */
  async resolveById(id: string): Promise<PublicBranchIdentity | null> {
    if (!id) return null;
    const cleanId = id.trim();

    if (this.cache.has(cleanId)) {
      return this.cache.get(cleanId)!;
    }

    try {
      const { data, error } = await this.supabase
        .rpc('get_public_branch_by_id', { p_id: cleanId })
        .maybeSingle();

      if (error) {
        this.logger.error('[PublicBranchIdentityResolver] RPC error:', error);
        return null;
      }

      if (!data) {
        return null;
      }

      const raw = data as Record<string, unknown>;
      const identity: PublicBranchIdentity = {
        id: raw['id'] as string,
        name: raw['name'] as string,
        officialName: (raw['official_name'] as string) || null,
        slug: raw['slug'] as string,
        address: (raw['address'] as string) || null,
        contactPhone: (raw['contact_phone'] as string) || null,
        whatsappNumber: (raw['whatsapp_number'] as string) || null,
        contactEmail: (raw['contact_email'] as string) || null,
        brandingSettings: (raw['branding_settings'] as PublicBranchIdentity['brandingSettings']) || null,
        tenantId: raw['tenant_id'] as string,
        updatedAt: raw['updated_at'] as string,
      };

      this.cache.set(cleanId, identity);
      if (identity.slug) {
        this.cache.set(identity.slug.toLowerCase().trim(), identity);
      }
      return identity;
    } catch (e) {
      this.logger.error('[PublicBranchIdentityResolver] Exception:', e);
      return null;
    }
  }

  clearCache(): void {
    this.cache.clear();
  }
}
