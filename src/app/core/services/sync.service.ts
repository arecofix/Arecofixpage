import { Injectable, signal } from '@angular/core';
import Database from '@tauri-apps/plugin-sql';
import { SupabaseService } from './supabase.service';

@Injectable({
  providedIn: 'root'
})
export class SyncService {
  isOnline = signal(navigator.onLine);
  private db: any = null;

  constructor(private supabase: SupabaseService) {
    this.initDatabase();
    this.setupListeners();
  }

  private async initDatabase() {
    try {
      if ((window as any).__TAURI__) {
        this.db = await Database.load('sqlite:arecofix.db');
        await this.db.execute('CREATE TABLE IF NOT EXISTS pending_sync (id INTEGER PRIMARY KEY AUTOINCREMENT, payload TEXT, table_name TEXT, operation TEXT)');
      }
    } catch (e) {
      console.warn('Tauri SQL plugin no disponible o no estamos en Tauri', e);
    }
  }

  private setupListeners() {
    window.addEventListener('online', () => {
      this.isOnline.set(true);
      this.syncPendingData();
    });
    window.addEventListener('offline', () => {
      this.isOnline.set(false);
    });
  }

  async saveData(tableName: string, payload: any): Promise<any> {
    if (this.isOnline()) {
      try {
        const result = await this.supabase.getClient().from(tableName).insert(payload);
        return result;
      } catch (e) {
         // Si falla, fallback a local
         return this.saveToLocal(tableName, payload, 'INSERT');
      }
    } else {
      return this.saveToLocal(tableName, payload, 'INSERT');
    }
  }

  private async saveToLocal(tableName: string, payload: any, operation: string) {
    if (this.db) {
      await this.db.execute(
        'INSERT INTO pending_sync (payload, table_name, operation) VALUES ($1, $2, $3)',
        [JSON.stringify(payload), tableName, operation]
      );
      // console.log(`[Offline] Datos guardados localmente en SQLite para ${tableName}.`);
      return { local: true, success: true };
    }
    throw new Error('Sin conexión a Internet y sin soporte de SQLite local.');
  }

  private async syncPendingData() {
    if (!this.db) return;
    try {
      const pending: any[] = await this.db.select('SELECT * FROM pending_sync');
      if (pending.length > 0) {
        // console.log(`[Sync] Sincronizando ${pending.length} registros pendientes a Supabase...`);
      }
      for (const item of pending) {
        if (item.operation === 'INSERT') {
          const payload = JSON.parse(item.payload);
          await this.supabase.getClient().from(item.table_name).insert(payload);
          await this.db.execute('DELETE FROM pending_sync WHERE id = $1', [item.id]);
        }
      }
    } catch(e) {
      console.error('Error durante la sincronización a Supabase:', e);
    }
  }
}
