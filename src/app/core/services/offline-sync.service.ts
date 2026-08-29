import { Injectable, inject, signal, Injector, NgZone } from '@angular/core';
import { LoggerService } from './logger.service';
import { firstValueFrom } from 'rxjs';
import { RepairRepository } from '../../features/repairs/domain/repositories/repair.repository';
import { NotificationService } from './notification.service';
import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export interface CachedRequest {
  url: string;
  data: string;
  headers: [string, string][];
  status: number;
  statusText: string;
  timestamp: number;
}

export interface QueuedMutation {
  id?: number;
  url: string;
  method: string;
  headers: [string, string][];
  body: string | null;
  timestamp: number;
  retryCount: number;
}

export interface MasterData {
  key: string;
  data: any;
  timestamp: number;
}

export interface OfflineRepair {
  id: string;
  payload: any;
  timestamp: number;
}

// Dynamic Dexie wrapper instead of top-level class extension
export type ArecofixDatabase = any;

@Injectable({
  providedIn: 'root'
})
export class OfflineSyncService {
  private logger = inject(LoggerService);
  private injector = inject(Injector);
  
  private get repairRepo(): RepairRepository { return this.injector.get(RepairRepository); }
  private get notification(): NotificationService { return this.injector.get(NotificationService); }
  
  public pendingCount = signal<number>(0);
  private db!: ArecofixDatabase;
  
  public isReady = false;

  private platformId = inject(PLATFORM_ID);

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.initDB();
      this.setupNetworkListeners();
    }
  }

  private async initDB(): Promise<void> {
    try {
      const { default: Dexie } = await import('dexie');
      this.db = new Dexie('ArecofixOfflineDB');
      this.db.version(3).stores({
        requestsCache: 'url',
        syncQueue: '++id, timestamp',
        masterData: 'key',
        offlineRepairs: 'id, timestamp'
      });
      await this.db.open();
      this.isReady = true;
      
      const count = await this.db.offlineRepairs.count();
      this.pendingCount.set(count);

      // Process queue immediately if we are online on startup
      if (typeof navigator !== 'undefined' && navigator.onLine) {
        setTimeout(() => this.processSyncQueue(), 2000);
      }
    } catch (err) {
      this.logger.error('Error opening Dexie IndexedDB', err);
    }
  }

  private setupNetworkListeners() {
    window.addEventListener('online', async () => {
      if (this.pendingCount() > 0) {
        this.notification.showInfo('Conexión restaurada. Procesando órdenes offline...');
        await this.syncAll();
      }
      this.logger.info('[OfflineSync] Back online. Processing sync queue...');
      this.processSyncQueue();
    });
  }

  async cacheGetRequest(url: string, data: string, status: number, statusText: string, headers: [string, string][]): Promise<void> {
    if (!this.isReady) return;
    try {
      await this.db.requestsCache.put({
        url,
        data,
        status,
        statusText,
        headers,
        timestamp: Date.now()
      });
    } catch (err) {
      this.logger.error('[OfflineSync] cacheGetRequest error', err);
    }
  }

  async getCachedRequest(url: string): Promise<CachedRequest | null> {
    if (!this.isReady) return null;
    try {
      const cached = await this.db.requestsCache.get(url);
      return cached || null;
    } catch (err) {
      this.logger.error('[OfflineSync] getCachedRequest error', err);
      return null;
    }
  }

  async enqueueMutation(url: string, method: string, headers: [string, string][], body: string | null): Promise<void> {
    if (!this.isReady) return;
    try {
      await this.db.syncQueue.add({
        url,
        method,
        headers,
        body,
        timestamp: Date.now(),
        retryCount: 0
      });
    } catch (err) {
      this.logger.error('[OfflineSync] enqueueMutation error', err);
    }
  }

  async processSyncQueue(): Promise<void> {
    if (!this.isReady || !navigator.onLine) return;

    try {
      const mutations = await this.db.syncQueue.toArray();
      
      for (const mutation of mutations) {
        try {
          const fetchHeaders = new Headers();
          mutation.headers.forEach(([key, value]: [string, string]) => fetchHeaders.append(key, value));

          const response = await fetch(mutation.url, {
            method: mutation.method,
            headers: fetchHeaders,
            body: mutation.body
          });

          if (response.ok || (response.status >= 400 && response.status < 500)) {
            // Delete from queue if successful OR if it's a client error (e.g. 400 bad request)
            await this.db.syncQueue.delete(mutation.id!);
          } else {
            // Server error, keep in queue and increment retry count
            await this.db.syncQueue.update(mutation.id!, { retryCount: mutation.retryCount + 1 });
          }
        } catch (e) {
          this.logger.error('[OfflineSync] Error syncing mutation', e);
        }
      }
    } catch (err) {
      this.logger.error('[OfflineSync] processSyncQueue error', err);
    }
  }

  async clearCache(): Promise<void> {
    if (!this.isReady) return;
    await this.db.requestsCache.clear();
  }

  async saveMasterData(key: string, data: any): Promise<void> {
    if (!this.isReady) return;
    await this.db.masterData.put({ key, data, timestamp: Date.now() });
  }

  async getMasterData<T>(key: string): Promise<T | null> {
    if (!this.isReady) return null;
    const result = await this.db.masterData.get(key);
    return result ? result.data : null;
  }

  // --- REPAIR EXPLICIT OFFLINE QUEUE --- //
  
  async saveOfflineRepair(payload: any): Promise<void> {
    if (!this.isReady) return;
    await this.db.offlineRepairs.add({
      id: crypto.randomUUID(),
      payload,
      timestamp: Date.now()
    });
    const count = await this.db.offlineRepairs.count();
    this.pendingCount.set(count);
  }

  async getOfflineRepairs(): Promise<OfflineRepair[]> {
    if (!this.isReady) return [];
    return this.db.offlineRepairs.toArray();
  }

  async clearOfflineRepairs(): Promise<void> {
    if (!this.isReady) return;
    await this.db.offlineRepairs.clear();
    this.pendingCount.set(0);
  }

  async syncAll(): Promise<void> {
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      this.notification.showWarning('No hay conexión a internet para sincronizar.');
      return;
    }

    const repairs = await this.getOfflineRepairs();
    if (repairs.length === 0) return;

    this.notification.showInfo(`Sincronizando ${repairs.length} órdenes pendientes...`);
    let successCount = 0;
    let failedCount = 0;

    for (const item of repairs) {
      try {
        await firstValueFrom(this.repairRepo.create(item.payload));
        await this.db.offlineRepairs.delete(item.id);
        successCount++;
      } catch (err) {
        this.logger.error('Error syncing offline repair:', err);
        failedCount++;
      }
    }

    const newCount = await this.db.offlineRepairs.count();
    this.pendingCount.set(newCount);

    if (successCount > 0) {
      this.notification.showSuccess(`¡${successCount} órdenes sincronizadas con éxito!`);
    }
    if (failedCount > 0) {
      this.notification.showError(`Fallo al sincronizar ${failedCount} órdenes. Revise la conexión.`);
    }
  }
}
