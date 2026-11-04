import { Injectable, inject, signal, computed } from '@angular/core';
import { PublicBranchIdentity, AuthenticatedBranchIdentity } from '@app/core/domain/identity/branch-identity.vo';
import { PublicBranchIdentityResolver } from './public-branch-identity.resolver';
import { AuthenticatedBranchIdentityResolver } from './authenticated-branch-identity.resolver';

@Injectable({
  providedIn: 'root'
})
export class BranchIdentityFacade {
  private publicResolver = inject(PublicBranchIdentityResolver);
  private authResolver = inject(AuthenticatedBranchIdentityResolver);

  private publicBranchSignal = signal<PublicBranchIdentity | null>(null);
  private authBranchSignal = signal<AuthenticatedBranchIdentity | null>(null);

  readonly currentPublicBranch = computed(() => this.publicBranchSignal());
  readonly currentAuthBranch = computed(() => this.authBranchSignal());

  /**
   * Safe storefront loader: Populates public branch identity via get_public_branch RPC.
   */
  async loadStorefrontBranch(slug: string): Promise<PublicBranchIdentity | null> {
    const branch = await this.publicResolver.resolveBySlug(slug);
    this.publicBranchSignal.set(branch);
    return branch;
  }

  /**
   * Authenticated operator loader: Populates full branch identity under RLS.
   */
  async loadAuthenticatedBranch(branchId: string): Promise<AuthenticatedBranchIdentity | null> {
    const branch = await this.authResolver.resolveById(branchId);
    this.authBranchSignal.set(branch);
    return branch;
  }

  clear(): void {
    this.publicBranchSignal.set(null);
    this.authBranchSignal.set(null);
  }
}
