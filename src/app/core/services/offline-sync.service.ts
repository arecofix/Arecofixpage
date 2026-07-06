import { Injectable, inject, signal, Injector, NgZone } from '@angular/core';
import { LoggerService } from './logger.service';
import { firstValueFrom } from 'rxjs';
import { RepairRepository } from '../../features/repairs/domain/repositories/repair.repository';
import { NotificationService } from './notification.service';

export interface CachedRequest {
  url: string;
  data: string;
  headers: [string, string][];
  status: number;
  statusText: string;
  timestamp: number;
}

export interface QueuedMutation {
  id?: number; // Auto-incremented by IndexedDB
  url: string;
  method: string;
  headers: [string, string][];
  body: string | null;
  timestamp: number;
  retryCount: number;
}

@Injectable({
  providedIn: 'root'
})
export class OfflineSyncService {
  private logger = inject(LoggerService);
  private injector = inject(Injector);
  private ngZone = inject(NgZone);
  
  private get repairRepo(): RepairRepository { return this.injector.get(RepairRepository); }
  private get notification(): NotificationService { return this.injector.get(NotificationService); }
  
  public pendingCount = signal<number>(0);
  private dbName = 'ArecofixOfflineDB';
  private dbVersion = 2; // Incremented for masterData store
  private db: IDBDatabase | null = null;
  
  private cacheStoreName = 'requestsCache';
  private queueStoreName = 'syncQueue';
  private masterDataStoreName = 'masterData';

  public isReady = false;
  private initPromise: Promise<void> | null = null;

  constructor() {
    if (typeof window !== 'undefined' && 'indexedDB' in window) {
      this.initDB();
      this.setupNetworkListeners();
    }
    
    // Auto-sync when coming back online
    if (typeof window !== 'undefined') {
      this.pendingCount.set(this.getOfflineRepairs().length);
      window.addEventListener('online', () => {
        if (this.pendingCount() > 0) {
          this.notification.showInfo('Conexión restaurada. Procesando órdenes offline...');
          this.syncAll();
        }
      });
    }
  }

  private async initDB(): Promise<void> {
    if (this.initPromise) return this.initPromise;

    this.initPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);

      const timeout = setTimeout(() => {
          this.ngZone.run(() => reject('IndexedDB init timeout'));
      }, 2000);

      request.onerror = (event) => {
        clearTimeout(timeout);
        this.logger.error('Error opening IndexedDB', event);
        this.ngZone.run(() => reject('Error opening IndexedDB'));
      };

      request.onsuccess = (event: Event) => {
        clearTimeout(timeout);
        const target = event.target as IDBOpenDBRequest;
        this.db = target.result;
        this.isReady = true;
        this.ngZone.run(() => resolve());
        
        // Process queue immediately if we are online on startup
        if (typeof navigator !== 'undefined' && navigator.onLine) {
          setTimeout(() => this.processSyncQueue(), 2000);
        }
      };

      request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
        const target = event.target as IDBOpenDBRequest;
        const db = target.result;
        
        if (!db.objectStoreNames.contains(this.cacheStoreName)) {
          db.createObjectStore(this.cacheStoreName, { keyPath: 'url' });
        }
        
        if (!db.objectStoreNames.contains(this.queueStoreName)) {
          const queueStore = db.createObjectStore(this.queueStoreName, { keyPath: 'id', autoIncrement: true });
          queueStore.createIndex('timestamp', 'timestamp', { unique: false });
        }
        
        if (!db.objectStoreNames.contains(this.masterDataStoreName)) {
          db.createObjectStore(this.masterDataStoreName, { keyPath: 'key' });
        }
      };
    });

    return this.initPromise;
  }

  private setupNetworkListeners() {
    window.addEventListener('online', () => {
      this.logger.info('[OfflineSync] Back online. Processing sync queue...');
      this.processSyncQueue();
    });
  }

  async cacheGetRequest(url: string, data: string, status: number, statusText: string, headers: [string, string][]): Promise<void> {
    if (!this.db) await this.initDB();
    if (!this.db) return;

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.cacheStoreName], 'readwrite');
      const store = transaction.objectStore(this.cacheStoreName);
      
      const cachedRequest: CachedRequest = {
        url,
        data,
        status,
        statusText,
        headers,
        timestamp: Date.now()
      };

      const request = store.put(cachedRequest);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getCachedRequest(url: string): Promise<CachedRequest | null> {
    if (!this.db) await this.initDB();
    if (!this.db) return null;

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.cacheStoreName], 'readonly');
      const store = transaction.objectStore(this.cacheStoreName);
      const request = store.get(url);
      
      const timeout = setTimeout(() => {
          this.ngZone.run(() => reject(new Error('IndexedDB get timeout')));
      }, 2000);

      request.onsuccess = () => {
        clearTimeout(timeout);
        this.ngZone.run(() => resolve(request.result as CachedRequest || null));
      };
      request.onerror = () => {
        clearTimeout(timeout);
        this.ngZone.run(() => reject(request.error));
      };
    });
  }

  async enqueueMutation(url: string, method: string, headers: [string, string][], body: string | null): Promise<void> {
    if (!this.db) await this.initDB();
    if (!this.db) return;

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.queueStoreName], 'readwrite');
      const store = transaction.objectStore(this.queueStoreName);
      
      const mutation: QueuedMutation = {
        url,
        method,
        headers,
        body,
        timestamp: Date.now(),
        retryCount: 0
      };

      const request = store.add(mutation);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async processSyncQueue(): Promise<void> {
    if (!this.db || !navigator.onLine) return;

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.queueStoreName], 'readwrite');
      const store = transaction.objectStore(this.queueStoreName);
      const request = store.getAll();

      request.onsuccess = async () => {
        const mutations: QueuedMutation[] = request.result;
        
        for (const mutation of mutations) {
          try {
            // Strip headers that might conflict or be stale
            const fetchHeaders = new Headers();
            mutation.headers.forEach(([key, value]) => {
              // Authorization header might need to be refreshed, but assuming it's valid for now
              fetchHeaders.append(key, value);
            });

            const response = await fetch(mutation.url, {
              method: mutation.method,
              headers: fetchHeaders,
              body: mutation.body
            });

            if (response.ok || (response.status >= 400 && response.status < 500)) {
              // Delete from queue if successful OR if it's a client error (e.g. 400 bad request)
              await this.deleteFromQueue(mutation.id!);
            } else {
              // Server error, keep in queue and increment retry count
              mutation.retryCount++;
              await this.updateInQueue(mutation);
            }
          } catch (e) {
            this.logger.error('[OfflineSync] Error syncing mutation', e);
          }
        }
        resolve();
      };
      
      request.onerror = () => reject(request.error);
    });
  }

  private async deleteFromQueue(id: number): Promise<void> {
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.queueStoreName], 'readwrite');
      const store = transaction.objectStore(this.queueStoreName);
      const request = store.delete(id);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  private async updateInQueue(mutation: QueuedMutation): Promise<void> {
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.queueStoreName], 'readwrite');
      const store = transaction.objectStore(this.queueStoreName);
      const request = store.put(mutation);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async clearCache(): Promise<void> {
    if (!this.db) await this.initDB();
    if (!this.db) return;
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.cacheStoreName], 'readwrite');
      const store = transaction.objectStore(this.cacheStoreName);
      const request = store.clear();
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async saveMasterData(key: string, data: any): Promise<void> {
    if (!this.db) await this.initDB();
    if (!this.db) return;

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.masterDataStoreName], 'readwrite');
      const store = transaction.objectStore(this.masterDataStoreName);
      const request = store.put({ key, data, timestamp: Date.now() });
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getMasterData<T>(key: string): Promise<T | null> {
    if (!this.db) await this.initDB();
    if (!this.db) return null;

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.masterDataStoreName], 'readonly');
      const store = transaction.objectStore(this.masterDataStoreName);
      const request = store.get(key);
      request.onsuccess = () => resolve(request.result ? request.result.data : null);
      request.onerror = () => reject(request.error);
    });
  }

  // --- REPAIR EXPLICIT OFFLINE QUEUE --- //
  private readonly REPAIR_STORAGE_KEY = 'arecofix_offline_repairs';

  saveOfflineRepair(payload: any): void {
    const repairs = this.getOfflineRepairs();
    repairs.push({
      id: crypto.randomUUID(),
      payload,
      timestamp: Date.now()
    });
    localStorage.setItem(this.REPAIR_STORAGE_KEY, JSON.stringify(repairs));
    this.pendingCount.set(repairs.length);
  }

  getOfflineRepairs(): any[] {
    if (typeof localStorage === 'undefined') return [];
    const data = localStorage.getItem(this.REPAIR_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }

  clearOfflineRepairs(): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(this.REPAIR_STORAGE_KEY);
      this.pendingCount.set(0);
    }
  }

  async syncAll(): Promise<void> {
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      this.notification.showWarning('No hay conexión a internet para sincronizar.');
      return;
    }

    const repairs = this.getOfflineRepairs();
    if (repairs.length === 0) return;

    this.notification.showInfo(`Sincronizando ${repairs.length} órdenes pendientes...`);
    let successCount = 0;
    let newRepairs: any[] = [];

    for (const item of repairs) {
      try {
        await firstValueFrom(this.repairRepo.create(item.payload));
        successCount++;
      } catch (err) {
        this.logger.error('Error syncing offline repair:', err);
        newRepairs.push(item); // Keep it if it failed
      }
    }

    localStorage.setItem(this.REPAIR_STORAGE_KEY, JSON.stringify(newRepairs));
    this.pendingCount.set(newRepairs.length);

    if (successCount > 0) {
      this.notification.showSuccess(`¡${successCount} órdenes sincronizadas con éxito!`);
    }
    if (newRepairs.length > 0) {
      this.notification.showError(`Fallo al sincronizar ${newRepairs.length} órdenes. Revise la conexión.`);
    }
  }
}
