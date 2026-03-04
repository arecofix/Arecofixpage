import { Injectable, inject } from '@angular/core';
import { environment } from '../../../../environments/environment';

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  FATAL = 4
}

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  category: string;
  message: string;
  data?: Record<string, unknown>;
  userId?: string;
  tenantId?: string;
  sessionId?: string;
}

@Injectable({
  providedIn: 'root'
})
export class StructuredLoggerService {
  private readonly isProduction = environment.production;
  private readonly sessionId = crypto.randomUUID();
  private currentUserId?: string;
  private currentTenantId?: string;

  // Context management
  setContext(userId?: string, tenantId?: string): void {
    this.currentUserId = userId;
    this.currentTenantId = tenantId;
  }

  // Logging methods
  debug(category: string, message: string, data?: Record<string, unknown>): void {
    this.log(LogLevel.DEBUG, category, message, data);
  }

  info(category: string, message: string, data?: Record<string, unknown>): void {
    this.log(LogLevel.INFO, category, message, data);
  }

  warn(category: string, message: string, data?: Record<string, unknown>): void {
    this.log(LogLevel.WARN, category, message, data);
  }

  error(category: string, message: string, error?: Error | Record<string, unknown>): void {
    const data = error instanceof Error 
      ? { name: error.name, message: error.message, stack: error.stack }
      : error;
    this.log(LogLevel.ERROR, category, message, data);
  }

  fatal(category: string, message: string, error?: Error | Record<string, unknown>): void {
    const data = error instanceof Error 
      ? { name: error.name, message: error.message, stack: error.stack }
      : error;
    this.log(LogLevel.FATAL, category, message, data);
  }

  // Core logging method
  private log(level: LogLevel, category: string, message: string, data?: Record<string, unknown>): void {
    const logEntry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      category,
      message,
      data,
      userId: this.currentUserId,
      tenantId: this.currentTenantId,
      sessionId: this.sessionId
    };

    // In production, only log WARN and above
    if (this.isProduction && level < LogLevel.WARN) {
      return;
    }

    // Format and output
    const formattedLog = this.formatLog(logEntry);
    
    switch (level) {
      case LogLevel.DEBUG:
        console.debug(formattedLog);
        break;
      case LogLevel.INFO:
        console.info(formattedLog);
        break;
      case LogLevel.WARN:
        console.warn(formattedLog);
        break;
      case LogLevel.ERROR:
      case LogLevel.FATAL:
        console.error(formattedLog);
        break;
    }

    // In production, send to external logging service
    if (this.isProduction && level >= LogLevel.ERROR) {
      this.sendToExternalService(logEntry);
    }
  }

  private formatLog(entry: LogEntry): string {
    const levelEmoji = this.getLevelEmoji(entry.level);
    const context = entry.userId ? `[${entry.userId.substring(0, 8)}]` : '';
    const dataStr = entry.data ? ` | Data: ${JSON.stringify(entry.data)}` : '';
    
    return `${levelEmoji} ${entry.timestamp} ${context} [${entry.category}] ${entry.message}${dataStr}`;
  }

  private getLevelEmoji(level: LogLevel): string {
    switch (level) {
      case LogLevel.DEBUG: return '🐛';
      case LogLevel.INFO: return 'ℹ️';
      case LogLevel.WARN: return '⚠️';
      case LogLevel.ERROR: return '❌';
      case LogLevel.FATAL: return '🔥';
      default: return '📝';
    }
  }

  private sendToExternalService(entry: LogEntry): void {
    // Implementation for external logging service (Sentry, LogRocket, etc.)
    // This would be implemented based on the chosen service
    if (navigator.sendBeacon) {
      navigator.sendBeacon('/api/logs', JSON.stringify(entry));
    }
  }

  // Performance logging
  startTimer(category: string, operation: string): () => void {
    const startTime = performance.now();
    return () => {
      const duration = performance.now() - startTime;
      this.debug(category, `${operation} completed`, { duration: `${duration.toFixed(2)}ms` });
    };
  }

  // Component lifecycle logging
  logComponentLifecycle(componentName: string, action: 'init' | 'destroy', data?: Record<string, unknown>): void {
    this.info('Component', `${componentName} ${action}ed`, data);
  }

  // API logging
  logApiCall(method: string, url: string, status: number, duration?: number): void {
    const level = status >= 400 ? LogLevel.ERROR : LogLevel.INFO;
    this.log(level, 'API', `${method} ${url}`, { 
      status, 
      duration: duration ? `${duration.toFixed(2)}ms` : undefined 
    });
  }

  // User action logging
  logUserAction(action: string, details?: Record<string, unknown>): void {
    this.info('UserAction', action, details);
  }
}
