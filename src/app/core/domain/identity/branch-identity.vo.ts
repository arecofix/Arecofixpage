/**
 * Public branch identity exposed to storefront and anonymous users.
 * Whitelisted safe fields; strictly excludes fiscal (taxId) and sensitive banking (bankInfo) data.
 */
export interface PublicBranchIdentity {
  id: string;
  name: string;
  officialName: string | null;
  slug: string;
  address: string | null;
  contactPhone: string | null;
  whatsappNumber: string | null;
  contactEmail: string | null;
  brandingSettings: {
    logoUrl?: string;
    faviconUrl?: string;
    primaryColor?: string;
    ownerName?: string;
    [key: string]: unknown;
  } | null;
  tenantId: string;
  updatedAt: string;
}

/**
 * Full branch identity for authenticated operators and tenant admins under RLS.
 * Includes taxId and bankInfo for fiscal management and operations.
 */
export interface AuthenticatedBranchIdentity extends PublicBranchIdentity {
  taxId?: string | null;
  bankInfo?: {
    cbu?: string;
    alias?: string;
    bankName?: string;
    accountHolder?: string;
    [key: string]: unknown;
  } | null;
  modulesConfig?: Record<string, unknown> | null;
  globalMarkupPercentage?: number;
  isActive: boolean;
  createdAt?: string;
}
