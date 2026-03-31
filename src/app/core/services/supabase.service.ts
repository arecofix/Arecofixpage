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
    // Custom fetch with retry logic to handle ERR_NAME_NOT_RESOLVED and network drops
    const customFetch = async (url: RequestInfo | URL, options?: RequestInit): Promise<Response> => {
      const MAX_RETRIES = 3;
      const RETRY_DELAY = 1500;
      let lastError: any;

      for (let i = 0; i < MAX_RETRIES; i++) {
        try {
          // Si estamos offline, no intentamos
          if (typeof navigator !== 'undefined' && !navigator.onLine && i === 0) {
            throw new Error('No internet connection');
          }
          
          const response = await fetch(url, options);
          if (!response.ok && response.status >= 500) {
              throw new Error(`Server Error: ${response.status}`);
          }
          return response;
        } catch (error: any) {
          lastError = error;
          this.logger.warn(`Supabase fetch failed (attempt ${i + 1}/${MAX_RETRIES}):`, error.message);
          
          if (i < MAX_RETRIES - 1) {
            await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * (i + 1)));
          }
        }
      }
      
      // Error Boundary fallback
      this.logger.error('Supabase fetch critically failed after retries', lastError);
      throw lastError;
    };

    this.client = createClient(
      environment.supabaseUrl,
      environment.supabaseKey,
      {
        global: {
          fetch: customFetch
        },
        realtime: {
          params: {
            eventsPerSecond: 2,
          },
        },
        auth: {
          persistSession:
            typeof window !== 'undefined' && !!window.localStorage,
          autoRefreshToken:
            typeof window !== 'undefined' && !!window.localStorage,
          detectSessionInUrl: typeof window !== 'undefined',
          lock: async (name: string, acquireTimeout: number, acquire: () => Promise<any>) => {
            if (typeof navigator !== 'undefined' && navigator.locks) {
              try {
                return await navigator.locks.request(name, { mode: 'exclusive', ifAvailable: true }, async (lock) => {
                  if (lock) {
                    return await acquire();
                  } else {
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
