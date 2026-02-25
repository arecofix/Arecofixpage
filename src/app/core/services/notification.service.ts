import { Injectable, signal, inject } from '@angular/core';
import { SUPABASE_CLIENT } from '../di/supabase-token';
import { AuthService } from './auth.service';
import { TenantService } from './tenant.service';

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: string;
  link?: string;
  is_read: boolean;
  created_at: string;
}

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface Notification {
    id: string;
    type: NotificationType;
    message: string;
    duration?: number;
}

/**
 * Notification Service
 * Provides user feedback for operations
 */
@Injectable({
    providedIn: 'root'
})
export class NotificationService {
    // ---- Toast Notifications (Existing) ----
    private notifications = signal<Notification[]>([]);
    public notifications$ = this.notifications.asReadonly();

    // ---- DB Bell Notifications (New) ----
    private supabase = inject(SUPABASE_CLIENT);
    private auth = inject(AuthService);
    private tenantService = inject(TenantService);

    private _dbNotifications = signal<AppNotification[]>([]);
    public dbNotifications = this._dbNotifications.asReadonly();

    private _unreadCount = signal<number>(0);
    public unreadCount = this._unreadCount.asReadonly();

    private realtimeChannel: any;

    /**
     * Show success notification
     */
    showSuccess(message: string, duration: number = 3000): void {
        this.show('success', message, duration);
    }

    /**
     * Show error notification
     */
    showError(message: string, duration: number = 5000): void {
        this.show('error', message, duration);
    }

    /**
     * Show warning notification
     */
    showWarning(message: string, duration: number = 4000): void {
        this.show('warning', message, duration);
    }

    /**
     * Show info notification
     */
    showInfo(message: string, duration: number = 3000): void {
        this.show('info', message, duration);
    }

    /**
     * Show notification
     */
    private show(type: NotificationType, message: string, duration: number): void {
        const notification: Notification = {
            id: this.generateId(),
            type,
            message,
            duration
        };

        this.notifications.update(notifications => [...notifications, notification]);

        // Auto-remove after duration
        if (duration > 0) {
            setTimeout(() => this.remove(notification.id), duration);
        }
    }

    /**
     * Remove notification by ID
     */
    remove(id: string): void {
        this.notifications.update(notifications =>
            notifications.filter(n => n.id !== id)
        );
    }

    /**
     * Clear all notifications
     */
    clearAll(): void {
        this.notifications.set([]);
    }

    /**
     * Generate unique ID
     */
    private generateId(): string {
        return `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }

    // ============================================
    //         DB BELL NOTIFICATIONS METHODS
    // ============================================
    async loadNotifications() {
        const user = this.auth.getCurrentUser();
        if (!user) return;

        const { data, error } = await this.supabase
            .from('notifications')
            .select('*')
            .eq('user_id', user.id)
            .eq('tenant_id', this.tenantService.getTenantId())
            .order('created_at', { ascending: false })
            .limit(50);

        if (!error && data) {
            this._dbNotifications.set(data as AppNotification[]);
            this._unreadCount.set(data.filter(n => !n.is_read).length);
        }
    }

    async markAsRead(notificationId: string) {
        const { error } = await this.supabase
            .from('notifications')
            .update({ is_read: true })
            .eq('id', notificationId);

        if (!error) {
            this._dbNotifications.update(nots => 
                nots.map(n => n.id === notificationId ? { ...n, is_read: true } : n)
            );
            this._unreadCount.update(count => Math.max(0, count - 1));
        }
    }

    async markAllAsRead() {
        const user = this.auth.getCurrentUser();
        if (!user) return;

        const { error } = await this.supabase
            .from('notifications')
            .update({ is_read: true })
            .eq('user_id', user.id)
            .eq('is_read', false);

        if (!error) {
            this._dbNotifications.update(nots => 
                nots.map(n => ({ ...n, is_read: true }))
            );
            this._unreadCount.set(0);
        }
    }

    subscribeToRealtime() {
        const user = this.auth.getCurrentUser();
        if (!user) return;

        this.realtimeChannel = this.supabase
            .channel('public:notifications')
            .on('postgres_changes', 
                { 
                    event: 'INSERT', 
                    schema: 'public', 
                    table: 'notifications',
                    filter: `user_id=eq.${user.id}`
                }, 
                (payload: any) => {
                    const newNotif = payload.new as AppNotification;
                    this._dbNotifications.update(nots => [newNotif, ...nots]);
                    this._unreadCount.update(count => count + 1);
                    
                    // Show a toast when a new DB notification triggers!
                    this.showInfo(newNotif.title + ' - ' + newNotif.message);
                }
            )
            .subscribe();
    }

    unsubscribe() {
        if (this.realtimeChannel) {
            this.supabase.removeChannel(this.realtimeChannel);
        }
    }
}
