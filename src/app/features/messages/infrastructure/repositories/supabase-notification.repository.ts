import { Injectable, inject } from '@angular/core';
import { SupabaseClient } from '@supabase/supabase-js';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SUPABASE_CLIENT } from '@app/core/di/supabase-token';
import { NotificationBaseRepository, NotificationPayload } from '../../domain/repositories/notification.repository';
import { BaseRepository } from '@app/core/repositories/base.repository';
import { LoggerService } from '@app/core/services/logger.service';

@Injectable({
  providedIn: 'root'
})
export class SupabaseNotificationRepository extends BaseRepository<any> implements NotificationBaseRepository {
  protected override tableName = 'notifications';

  constructor() {
    const supabase = inject(SUPABASE_CLIENT);
    const logger = inject(LoggerService);
    super(supabase, logger);
  }

  override create(notification: NotificationPayload): Observable<void> {
    const query = this.supabase.from(this.tableName)
      .insert(this.sanitizePayload(notification));
    return from(query).pipe(map(() => void 0));
  }

  async createMany(notifications: NotificationPayload[]): Promise<void> {
    const { error } = await this.supabase.from(this.tableName).insert(notifications);
    if (error) {
      this.logger.error('Error creating multiple notifications', error);
      throw error;
    }
  }

  markAsRead(id: string): Observable<void> {
    const query = this.applyTenantFilter(this.supabase.from(this.tableName).update({ is_read: true }))
      .eq('id', id);
    return from(query).pipe(map(() => void 0));
  }

  getByUserId(userId: string): Observable<any[]> {
    const query = this.applyTenantFilter(this.supabase.from(this.tableName).select('*'))
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    return from(query as any).pipe(map(({ data }: any) => data || []));
  }
}
