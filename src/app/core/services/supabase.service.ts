import { Injectable, inject } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '@env/environment';
import { LoggerService } from './logger.service';
import { OfflineSyncService } from './offline-sync.service';

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  private logger = inject(LoggerService);
  private syncService = inject(OfflineSyncService);
  private client: SupabaseClient;

  private cacheMap = new Map<string, { data: string; headers: [string, string][]; status: number; statusText: string; expiresAt: number }>();

  constructor() {
    // Custom fetch with cache and retry logic to reduce egress and handle network drops
    const customFetch = async (url: RequestInfo | URL, options?: RequestInit): Promise<Response> => {
      const urlStr = typeof url === 'string' ? url : (url as URL).toString();
      const method = (options?.method || 'GET').toUpperCase();
      const isCacheable = method === 'GET' && urlStr.includes('/rest/v1/');
      const isMutation = ['POST', 'PATCH', 'PUT', 'DELETE'].includes(method) && urlStr.includes('/rest/v1/') && !urlStr.includes('/rpc/');
      
      // Fast in-memory cache check for GET requests
      const CACHE_TTL = 60000;
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
      const isOffline = typeof navigator !== 'undefined' && !navigator.onLine;

      if (isOffline) {
         if (isCacheable) {
           try {
             const cachedDB = await this.syncService.getCachedRequest(urlStr);
             if (cachedDB) {
               this.logger.info(`[OfflineSync] Serving from IndexedDB cache: ${urlStr}`);
               return new Response(cachedDB.data, {
                 status: cachedDB.status,
                 statusText: cachedDB.statusText,
                 headers: new Headers(cachedDB.headers)
               });
             }
           } catch (e) {}
           throw new Error('No internet connection and no offline cache available');
        } else if (isMutation) {
           this.logger.info(`[OfflineSync] Offline detected. Queueing mutation: ${method} ${urlStr}`);
           const headersArray: [string, string][] = [];
           if (options?.headers) {
             new Headers(options.headers).forEach((val, key) => headersArray.push([key, val]));
           }
           
           await this.syncService.enqueueMutation(urlStr, method, headersArray, typeof options?.body === 'string' ? options.body : null);
           
           // Mock successful response based on payload to keep UI functioning
           let mockResponseData: any[] = [];
           if (options?.body && typeof options.body === 'string') {
              try {
                const parsed = JSON.parse(options.body);
                mockResponseData = Array.isArray(parsed) ? parsed : [parsed];
              } catch (e) {}
           }
           
           return new Response(JSON.stringify(mockResponseData), {
             status: method === 'POST' ? 201 : 200,
             statusText: 'OK (Offline Mock)',
             headers: new Headers([['Content-Type', 'application/json']])
           });
        } else {
           throw new Error('No internet connection');
        }
      }

      const MAX_RETRIES = 3;
      const RETRY_DELAY = 1500;
      let lastError: any;

       for (let i = 0; i < MAX_RETRIES; i++) {
        try {
          const fetchPromise = fetch(url, options);
          const timeoutPromise = new Promise<Response>((_, reject) => {
              setTimeout(() => reject(new Error(`Fetch timeout (${url})`)), 15000);
          });
          
          const response = await Promise.race([fetchPromise, timeoutPromise]);
          
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
            
            // Persist to IndexedDB for offline support
            await this.syncService.cacheGetRequest(urlStr, textData, clonedResponse.status, clonedResponse.statusText, headersArray);
          }

          if (isMutation && response.ok) {
            this.logger.info(`[SupabaseCache] Mutation detected: ${method} ${urlStr}. Clearing cache.`);
            this.cacheMap.clear();
            await this.syncService.clearCache();
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
      // Try to read from IndexedDB as absolute fallback
      if (isCacheable) {
         try {
           const cachedDB = await this.syncService.getCachedRequest(urlStr);
           if (cachedDB) {
             this.logger.warn(`[OfflineSync] Fallback to IndexedDB after fetch failure: ${urlStr}`);
             return new Response(cachedDB.data, {
               status: cachedDB.status,
               statusText: cachedDB.statusText,
               headers: new Headers(cachedDB.headers)
             });
           }
         } catch (e) {}
      }
      
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
          detectSessionInUrl: typeof window !== 'undefined'
        }
      },
    );

    // Handle auth state changes and clean up invalid refresh tokens
    if (typeof window !== 'undefined') {
      this.client.auth.onAuthStateChange((event, session) => {
        this.logger.info(`Auth Event: ${event}`, session ? 'Session exists' : 'No session');
        
        // If initial session fails or refresh token is invalid, clean up storage
        if (event === 'INITIAL_SESSION') {
          // Check if we have a session but it might be invalid
          if (session) {
            // Session exists, let it proceed
            return;
          }
        }
        
        // If token refresh fails, sign out cleanly to allow public navigation
        if (event === 'TOKEN_REFRESHED') {
          if (!session) {
            this.logger.warn('Token refresh failed, signing out to allow public navigation');
            alert('Tu sesión ha expirado por seguridad. Por favor, refresca la página y vuelve a ingresar.');
            this.client.auth.signOut().catch(err => {
              this.logger.error('Error signing out after failed refresh', err);
            });
          }
        }
        
        // Handle SIGNED_OUT event to ensure clean state
        if (event === 'SIGNED_OUT') {
          this.logger.info('User signed out, storage cleaned');
        }
      });

      // Listen for unhandled promise rejections related to auth errors
      window.addEventListener('unhandledrejection', (event) => {
        const errorMessage = String(event.reason);
        if (errorMessage.includes('Invalid Refresh Token') || 
            errorMessage.includes('Refresh Token Not Found') ||
            errorMessage.includes('400') && errorMessage.includes('refresh_token')) {
          this.logger.warn('Detected invalid refresh token in unhandled rejection, cleaning storage');
          event.preventDefault();
          alert('Tu sesión ha expirado. Por favor, refresca la página y vuelve a ingresar.');
          this.client.auth.signOut().catch(err => {
            this.logger.error('Error signing out after invalid token detection', err);
          });
        }
      });
    }
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
