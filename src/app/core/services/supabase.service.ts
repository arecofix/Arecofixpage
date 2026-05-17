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

  private cacheMap = new Map<string, { data: string; headers: [string, string][]; status: number; statusText: string; expiresAt: number }>();

  constructor() {
    // Custom fetch with cache and retry logic to reduce egress and handle network drops
    const customFetch = async (url: RequestInfo | URL, options?: RequestInit): Promise<Response> => {
      const urlStr = typeof url === 'string' ? url : (url as URL).toString();
      const method = (options?.method || 'GET').toUpperCase();
      const isCacheable = method === 'GET' && urlStr.includes('/rest/v1/');
      const CACHE_TTL = 60000; // 1 minute cache in memory to prevent redundant queries

      if (isCacheable) {
        const cached = this.cacheMap.get(urlStr);
        if (cached && cached.expiresAt > Date.now()) {
          this.logger.info(`[SupabaseCache] Serving from memory cache: ${urlStr}`);
          return new Response(cached.data, {
            status: cached.status,
            statusText: cached.statusText,
            headers: new Headers(cached.headers)
          });
        }
      }

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

          if (isCacheable && response.ok) {
            const clonedResponse = response.clone();
            const textData = await clonedResponse.text();
            const headersArray: [string, string][] = [];
            clonedResponse.headers.forEach((val, key) => {
              headersArray.push([key, val]);
            });

            this.cacheMap.set(urlStr, {
              data: textData,
              headers: headersArray,
              status: clonedResponse.status,
              statusText: clonedResponse.statusText,
              expiresAt: Date.now() + CACHE_TTL
            });
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
          storage: {
            getItem: (key) => {
              if (typeof window === 'undefined') return null;
              const rememberMe = localStorage.getItem('supabase-remember-me') === 'true';
              if (rememberMe) return localStorage.getItem(key);
              // Fallback to local storage if it was previously set, but we prefer session
              return sessionStorage.getItem(key) || localStorage.getItem(key);
            },
            setItem: (key, value) => {
              if (typeof window === 'undefined') return;
              const rememberMe = localStorage.getItem('supabase-remember-me') === 'true';
              if (rememberMe) {
                 localStorage.setItem(key, value);
                 sessionStorage.removeItem(key);
              } else {
                 sessionStorage.setItem(key, value);
                 localStorage.removeItem(key);
              }
            },
            removeItem: (key) => {
              if (typeof window === 'undefined') return;
              localStorage.removeItem(key);
              sessionStorage.removeItem(key);
            }
          },
          persistSession: typeof window !== 'undefined',
          autoRefreshToken: typeof window !== 'undefined',
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
