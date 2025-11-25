import { Injectable, signal } from '@angular/core';

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
    private notifications = signal<Notification[]>([]);
    public notifications$ = this.notifications.asReadonly();

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
}
