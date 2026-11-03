import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, from, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { SUPABASE_CLIENT } from '@app/core/di/supabase-token';
import { SupabaseService } from './supabase.service';
import { AuthService } from './auth.service';
import { LoggerService } from './logger.service';
import {
  AcademyPlan,
  AcademySubscription,
  AcademySubscriptionStatus,
  MembershipCheckResult
} from '@app/features/courses/domain/entities/academy-subscription.entity';

@Injectable({
  providedIn: 'root'
})
export class AcademySubscriptionService {
  private readonly supabase = inject(SUPABASE_CLIENT);
  private readonly supabaseService = inject(SupabaseService);
  private readonly http = inject(HttpClient);
  private readonly authService = inject(AuthService);
  private readonly logger = inject(LoggerService);

  // Reactive State Signals
  readonly membershipStatus = signal<MembershipCheckResult>({
    has_subscription: false,
    status: 'none',
    is_allowed: false
  });
  readonly isCheckingStatus = signal<boolean>(false);
  readonly isSubscribing = signal<boolean>(false);

  readonly isAllowed = computed(() => this.membershipStatus().is_allowed);
  readonly isGracePeriod = computed(() => this.membershipStatus().status === 'grace_period');
  readonly isSuspendedOrExpired = computed(() => {
    const s = this.membershipStatus().status;
    return s === 'suspended' || s === 'expired';
  });

  /**
   * Evaluates current user's membership status against PostgreSQL RPC.
   * RPC uses database now() timestamp to prevent client-side time tampering.
   */
  checkMembershipStatus(userId?: string): Observable<MembershipCheckResult> {
    this.isCheckingStatus.set(true);

    return from(
      this.supabase.rpc('check_and_update_membership_status', {
        p_user_id: userId || null
      })
    ).pipe(
      map(({ data, error }) => {
        this.isCheckingStatus.set(false);
        if (error) {
          this.logger.error('Error checking membership status RPC:', error);
          const fallback: MembershipCheckResult = {
            has_subscription: false,
            status: 'none',
            is_allowed: false,
            error: error.message
          };
          this.membershipStatus.set(fallback);
          return fallback;
        }

        const res = (data || {
          has_subscription: false,
          status: 'none',
          is_allowed: false
        }) as MembershipCheckResult;

        this.membershipStatus.set(res);
        return res;
      }),
      catchError(err => {
        this.isCheckingStatus.set(false);
        this.logger.error('Exception calling check_and_update_membership_status:', err);
        const errResult: MembershipCheckResult = {
          has_subscription: false,
          status: 'none',
          is_allowed: false,
          error: (err as Error).message
        };
        this.membershipStatus.set(errResult);
        return of(errResult);
      })
    );
  }

  /**
   * Retrieves active subscription plans from academy_plans table.
   */
  getActivePlans(): Observable<AcademyPlan[]> {
    return from(
      this.supabase
        .from('academy_plans')
        .select('*')
        .eq('is_active', true)
        .order('price', { ascending: true })
    ).pipe(
      map(({ data, error }) => {
        if (error) {
          this.logger.error('Error fetching academy plans:', error);
          return [];
        }
        return (data || []) as AcademyPlan[];
      }),
      catchError(err => {
        this.logger.error('Failed to load academy plans:', err);
        return of([]);
      })
    );
  }

  /**
   * Initiates Checkout Pro preference via backend /api/academy/subscribe
   */
  createSubscriptionPreference(params: {
    planId?: string;
    backUrl?: string;
  }): Observable<{ success: boolean; init_point?: string; preference_id?: string; error?: string }> {
    this.isSubscribing.set(true);
    const user = this.authService.getCurrentUser();
    const profile = this.authService.getCurrentProfile();

    if (!user) {
      this.isSubscribing.set(false);
      return of({ success: false, error: 'Debe iniciar sesión para suscribirse.' });
    }

    const payload = {
      userId: user.id,
      planId: params.planId,
      payerEmail: user.email,
      payerName: profile ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() : undefined,
      backUrl: params.backUrl
    };

    return this.http.post<{ success: boolean; init_point?: string; preference_id?: string; error?: string }>(
      '/api/academy/subscribe',
      payload
    ).pipe(
      tap(() => this.isSubscribing.set(false)),
      catchError(err => {
        this.isSubscribing.set(false);
        this.logger.error('Error creating subscription preference:', err);
        return of({
          success: false,
          error: err?.error?.error || err.message || 'Error al conectar con Mercado Pago.'
        });
      })
    );
  }

  /**
   * Admin: List all subscriptions with user profiles and plans
   */
  getAllSubscriptions(statusFilter?: AcademySubscriptionStatus): Observable<AcademySubscription[]> {
    let query = this.supabase
      .from('academy_subscriptions')
      .select('*, plan:academy_plans(*), profile:profiles!user_id(id, email, first_name, last_name)')
      .order('created_at', { ascending: false });

    if (statusFilter && statusFilter !== 'none') {
      query = query.eq('status', statusFilter);
    }

    return from(query).pipe(
      map(({ data, error }) => {
        if (error) {
          this.logger.error('Error fetching admin subscriptions:', error);
          return [];
        }
        return (data || []) as AcademySubscription[];
      }),
      catchError(err => {
        this.logger.error('Failed to load admin subscriptions:', err);
        return of([]);
      })
    );
  }

  /**
   * Admin: Manually force renewal for a student (+30 days)
   */
  async forceRenewSubscription(subscriptionId: string, days = 30): Promise<{ error: unknown }> {
    const now = new Date();
    const expiresAt = new Date(now.getTime() + days * 86400000);
    const graceEndsAt = new Date(expiresAt.getTime() + 7 * 86400000);

    const { error } = await this.supabase
      .from('academy_subscriptions')
      .update({
        status: 'active',
        started_at: now.toISOString(),
        expires_at: expiresAt.toISOString(),
        grace_period_ends_at: graceEndsAt.toISOString(),
        updated_at: now.toISOString()
      })
      .eq('id', subscriptionId);

    this.supabaseService.clearCacheForTable('academy_subscriptions');
    return { error };
  }

  /**
   * Admin: Manually suspend access for a subscription
   */
  async suspendSubscription(subscriptionId: string): Promise<{ error: unknown }> {
    const { error } = await this.supabase
      .from('academy_subscriptions')
      .update({
        status: 'suspended',
        updated_at: new Date().toISOString()
      })
      .eq('id', subscriptionId);

    this.supabaseService.clearCacheForTable('academy_subscriptions');
    return { error };
  }
}
