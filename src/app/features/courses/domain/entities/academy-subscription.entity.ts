export type AcademySubscriptionStatus = 'active' | 'grace_period' | 'suspended' | 'expired' | 'none';

export interface AcademyPlan {
  id: string;
  tenant_id?: string;
  name: string;
  slug: string;
  description?: string;
  price: number;
  currency_id: string;
  interval_days: number;
  grace_days: number;
  features?: string[];
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface AcademySubscription {
  id: string;
  tenant_id?: string;
  user_id: string;
  plan_id?: string;
  status: 'active' | 'grace_period' | 'suspended' | 'expired';
  started_at: string;
  expires_at: string;
  grace_period_ends_at: string;
  mp_preapproval_id?: string;
  mp_preference_id?: string;
  metadata?: Record<string, unknown>;
  created_at: string;
  updated_at: string;
  plan?: AcademyPlan;
  profile?: {
    id?: string;
    email?: string;
    first_name?: string;
    last_name?: string;
  };
}

export interface AcademyPayment {
  id: string;
  tenant_id?: string;
  subscription_id: string;
  user_id: string;
  plan_id?: string;
  amount: number;
  currency_id: string;
  status: 'approved' | 'pending' | 'rejected' | 'cancelled' | 'refunded';
  status_detail?: string;
  mp_payment_id: string;
  payment_method_id?: string;
  payment_type_id?: string;
  paid_at: string;
  raw_payload?: Record<string, unknown>;
  created_at: string;
}

export interface MembershipCheckResult {
  has_subscription: boolean;
  subscription_id?: string;
  status: AcademySubscriptionStatus;
  expires_at?: string;
  grace_period_ends_at?: string;
  plan_name?: string;
  plan_price?: number;
  is_allowed: boolean;
  is_admin?: boolean;
  error?: string;
}
