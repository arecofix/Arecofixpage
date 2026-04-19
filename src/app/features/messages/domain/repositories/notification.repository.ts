import { Observable } from 'rxjs';

export interface NotificationPayload {
  tenant_id: string;
  user_id: string;
  title: string;
  message: string;
  type: string;
  link?: string;
  is_read?: boolean;
}

export abstract class NotificationBaseRepository {
  abstract create(notification: NotificationPayload): Observable<void>;
  abstract createMany(notifications: NotificationPayload[]): Promise<void>;
  abstract markAsRead(id: string): Observable<void>;
  abstract getByUserId(userId: string): Observable<any[]>;
}
