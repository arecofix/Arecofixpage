import { Injectable, signal, PLATFORM_ID, inject } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { Capacitor } from '@capacitor/core';
import { environment } from '../../../environments/environment';
import { StorageAdapter } from './storage.adapter';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class SyncService implements StorageAdapter {
  isOnline = signal(typeof navigator !== 'undefined' ? navigator.onLine : true);
  
  private tauriDb: any = null;
  private capDb: any = null;
  private dexieDb: any = null;
  
  private isCapacitor = false;
  private storageMode: 'TAURI' | 'CAPACITOR' | 'DEXIE' = 'DEXIE';
  private cloudflareD1Url = (environment as any).cloudflareD1Url || 'https://d1-sync-worker.your-username.workers.dev';
  
  private platformId = inject(PLATFORM_ID);

  constructor(private supabase: SupabaseService) {
    if (isPlatformBrowser(this.platformId)) {
      this.initDatabase();
      this.setupListeners();
    }
  }

  async initDatabase(): Promise<void> {
    try {
      this.isCapacitor = Capacitor.isNativePlatform();
      
      if (this.isCapacitor) {
        this.storageMode = 'CAPACITOR';
        const { CapacitorSQLite, SQLiteConnection } = await import('@capacitor-community/sqlite');
        const sqliteConnection = new SQLiteConnection(CapacitorSQLite);
        this.capDb = await sqliteConnection.createConnection('arecofix', false, 'no-encryption', 1, false);
        await this.capDb.open();
        await this.capDb.execute(`
          CREATE TABLE IF NOT EXISTS pending_sync (
            id INTEGER PRIMARY KEY AUTOINCREMENT, 
            payload TEXT, 
            table_name TEXT, 
            operation TEXT
          )
        `);
      } else if (typeof window !== 'undefined' && (window as any).__TAURI__) {
        this.storageMode = 'TAURI';
        const { default: Database } = await import('@tauri-apps/plugin-sql');
        this.tauriDb = await Database.load('sqlite:arecofix.db');
        await this.tauriDb.execute('CREATE TABLE IF NOT EXISTS pending_sync (id INTEGER PRIMARY KEY AUTOINCREMENT, payload TEXT, table_name TEXT, operation TEXT)');
      } else {
        this.storageMode = 'DEXIE';
        await this.initDexie();
      }
    } catch (e) {
      console.warn('Fallo inicializando DB nativa, recurriendo a Dexie...', e);
      this.storageMode = 'DEXIE';
      await this.initDexie();
    }
  }

  private async initDexie() {
    if (!this.dexieDb) {
      const { default: Dexie } = await import('dexie');
      this.dexieDb = new Dexie('ArecofixUnifiedDB');
      this.dexieDb.version(1).stores({
        pendingSync: '++id, table_name, operation, timestamp'
      });
      await this.dexieDb.open();
    }
  }

  private setupListeners() {
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => {
        this.isOnline.set(true);
        this.syncPendingData();
      });
      window.addEventListener('offline', () => {
        this.isOnline.set(false);
      });
    }
  }

  async saveData(tableName: string, payload: any): Promise<any> {
    if (this.isOnline()) {
      try {
        await this.syncToCloudflareD1(tableName, payload, 'INSERT');
        const result = await this.supabase.getClient().from(tableName).insert(payload);
        return result;
      } catch (e) {
         return this.saveToLocal(tableName, payload, 'INSERT');
      }
    } else {
      return this.saveToLocal(tableName, payload, 'INSERT');
    }
  }

  async saveToLocal(tableName: string, payload: any, operation: string): Promise<{ local: boolean, success: boolean }> {
    try {
      if (this.storageMode === 'CAPACITOR' && this.capDb) {
        await this.capDb.run(
          'INSERT INTO pending_sync (payload, table_name, operation) VALUES (?, ?, ?)',
          [JSON.stringify(payload), tableName, operation]
        );
      } else if (this.storageMode === 'TAURI' && this.tauriDb) {
        await this.tauriDb.execute(
          'INSERT INTO pending_sync (payload, table_name, operation) VALUES ($1, $2, $3)',
          [JSON.stringify(payload), tableName, operation]
        );
      } else if (this.storageMode === 'DEXIE' && this.dexieDb) {
        await this.dexieDb.table('pendingSync').add({
          payload: JSON.stringify(payload),
          table_name: tableName,
          operation,
          timestamp: Date.now()
        });
      } else {
        throw new Error('No storage available');
      }
      return { local: true, success: true };
    } catch (e) {
      throw new Error('Sin conexión a Internet y sin soporte de almacenamiento local. ' + e);
    }
  }

  async getPendingData(): Promise<any[]> {
    if (this.storageMode === 'CAPACITOR' && this.capDb) {
      const res = await this.capDb.query('SELECT * FROM pending_sync');
      return res.values || [];
    } else if (this.storageMode === 'TAURI' && this.tauriDb) {
      return await this.tauriDb.select('SELECT * FROM pending_sync');
    } else if (this.storageMode === 'DEXIE' && this.dexieDb) {
      return await this.dexieDb.table('pendingSync').toArray();
    }
    return [];
  }

  async deletePendingData(id: number): Promise<void> {
    if (this.storageMode === 'CAPACITOR' && this.capDb) {
      await this.capDb.run('DELETE FROM pending_sync WHERE id = ?', [id]);
    } else if (this.storageMode === 'TAURI' && this.tauriDb) {
      await this.tauriDb.execute('DELETE FROM pending_sync WHERE id = $1', [id]);
    } else if (this.storageMode === 'DEXIE' && this.dexieDb) {
      await this.dexieDb.table('pendingSync').delete(id);
    }
  }
  
  async clearAllPending(): Promise<void> {
    if (this.storageMode === 'CAPACITOR' && this.capDb) {
      await this.capDb.run('DELETE FROM pending_sync');
    } else if (this.storageMode === 'TAURI' && this.tauriDb) {
      await this.tauriDb.execute('DELETE FROM pending_sync');
    } else if (this.storageMode === 'DEXIE' && this.dexieDb) {
      await this.dexieDb.table('pendingSync').clear();
    }
  }

  private async syncToCloudflareD1(tableName: string, payload: any, operation: string) {
    try {
      await fetch(`${this.cloudflareD1Url}/sync`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tableName, payload, operation })
      });
    } catch(e) {
      console.error('Error al sincronizar con D1:', e);
      throw e; 
    }
  }

  public async syncPendingData() {
    try {
      const pending = await this.getPendingData();
      if (pending.length === 0) return;

      for (const item of pending) {
        if (item.operation === 'INSERT') {
          const payload = JSON.parse(item.payload);
          await this.syncToCloudflareD1(item.table_name, payload, 'INSERT');
          await this.supabase.getClient().from(item.table_name).insert(payload);
          await this.deletePendingData(item.id);
        }
      }
    } catch(e) {
      console.error('Error en sync remota:', e);
    }
  }
}
