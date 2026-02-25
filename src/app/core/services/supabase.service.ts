import { Injectable, inject } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '@env/environment';
import { LoggerService } from './logger.service';

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  private logger = inject(LoggerService);
  private client: SupabaseClient;

  constructor() {
    this.client = createClient(
      environment.supabaseUrl,
      environment.supabaseKey,
      {
        auth: {
          persistSession:
            typeof window !== 'undefined' && !!window.localStorage,
          autoRefreshToken:
            typeof window !== 'undefined' && !!window.localStorage,
          detectSessionInUrl: typeof window !== 'undefined',
          lock: async (name: string, acquireTimeout: number, acquire: () => Promise<any>) => {
            // Fix for "Acquiring an exclusive Navigator LockManager lock timed out"
            // specifically in Facebook in-app browser or aggressive SSR hydration
            if (typeof navigator !== 'undefined' && navigator.locks) {
              try {
                // Request the lock but force a quick bypass if it hangs
                return await navigator.locks.request(name, { mode: 'exclusive', ifAvailable: true }, async (lock) => {
                  if (lock) {
                    return await acquire();
                  } else {
                    // Lock wasn't instantly available, bypass gracefully
                    return await acquire();
                  }
                });
              } catch (e) {
                return await acquire();
              }
            } else {
              return await acquire();
            }
          },
        },
      },
    );
  }

  getClient(): SupabaseClient {
    return this.client;
  }

  async testConnection(): Promise<boolean> {
    try {
      const { error } = await this.client
        .from('profiles')
        .select('id')
        .limit(1);
      return !error;
    } catch (err) {
      this.logger.error('Supabase connection test failed', err);
      return false;
    }
  }
}
