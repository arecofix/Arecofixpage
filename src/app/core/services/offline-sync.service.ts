import { Injectable, inject } from '@angular/core';
import { LoggerService } from './logger.service';

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
  private dbName = 'ArecofixOfflineDB';
  private dbVersion = 1;
  private db: IDBDatabase | null = null;
  
  private cacheStoreName = 'requestsCache';
  private queueStoreName = 'syncQueue';

  public isReady = false;
  private initPromise: Promise<void> | null = null;

  constructor() {
    if (typeof window !== 'undefined' && 'indexedDB' in window) {
      this.initDB();
      this.setupNetworkListeners();
    }
  }

  private async initDB(): Promise<void> {
    if (this.initPromise) return this.initPromise;

    this.initPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onerror = (event) => {
        this.logger.error('Error opening IndexedDB', event);
        reject('Error opening IndexedDB');
      };

      request.onsuccess = (event: Event) => {
        const target = event.target as IDBOpenDBRequest;
        this.db = target.result;
        this.isReady = true;
        resolve();
        
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

      request.onsuccess = () => resolve(request.result as CachedRequest || null);
      request.onerror = () => reject(request.error);
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
}
