/**
 * Lifecycle Status Value Object for ARCA Invoices & Drafts
 */
export type InvoiceStatus =
  | 'draft'
  | 'pending_review'
  | 'confirmed'
  | 'issued'
  | 'voided'
  | 'stale';

export const INVOICE_STATUS = {
  DRAFT: 'draft' as const,
  PENDING_REVIEW: 'pending_review' as const,
  CONFIRMED: 'confirmed' as const,
  ISSUED: 'issued' as const,
  VOIDED: 'voided' as const,
  STALE: 'stale' as const,
} as const;
