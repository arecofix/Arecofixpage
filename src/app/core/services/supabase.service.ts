import { Injectable, inject, PendingTasks } from '@angular/core';
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

  private pendingTasks = inject(PendingTasks);

  constructor() {
    const dataBaseUrl = environment.supabaseDataUrl || environment.supabaseUrl;
    const authBaseUrl = environment.supabaseUrl;

    // Custom fetch with cache and retry logic to reduce egress and handle network drops
    const customFetch = async (url: RequestInfo | URL, options?: RequestInit): Promise<Response> => {
      const removeTask = this.pendingTasks.add();
      try {
        const urlStr = typeof url === 'string' ? url : (url as URL).toString();
        const parsedUrl = new URL(urlStr);
        const targetUrl = parsedUrl.pathname.includes('/rest/v1/')
          ? new URL(urlStr.replace(new URL(urlStr).origin, new URL(dataBaseUrl).origin))
          : new URL(urlStr);

        // Remove x-client-info header to avoid CORS issues with custom PostgREST
        if (options?.headers) {
          const headers = new Headers(options.headers);
          headers.delete('x-client-info');
          headers.delete('X-Client-Info');
          options.headers = headers;
        }

        const method = (options?.method || 'GET').toUpperCase();
      const isCacheable = method === 'GET' && targetUrl.toString().includes('/rest/v1/');
      const isMutation = ['POST', 'PATCH', 'PUT', 'DELETE'].includes(method) && targetUrl.toString().includes('/rest/v1/') && !targetUrl.toString().includes('/rpc/');
      
      // Fast in-memory cache check for GET requests
      const CACHE_TTL = 60000;
      const requestUrl = targetUrl.toString();

      if (isCacheable) {
        const cached = this.cacheMap.get(requestUrl);
        if (cached && cached.expiresAt > Date.now()) {
          this.logger.info(`[SupabaseCache] Serving from memory cache: ${requestUrl}`);
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
        let timeoutId: any;
        try {
          const controller = new AbortController();
          const fetchOptions = { ...options, signal: controller.signal };
          const fetchPromise = fetch(requestUrl, fetchOptions);
          const timeoutPromise = new Promise<Response>((_, reject) => {
              timeoutId = setTimeout(() => {
                  controller.abort();
                  reject(new Error(`Fetch timeout (${url})`));
              }, 15000);
          });
          
          const response = await Promise.race([fetchPromise, timeoutPromise]);
          clearTimeout(timeoutId);

          if (!response.ok && response.status >= 500) {
              const errorText = await response.text().catch(() => 'No error body');
              console.error(`[Supabase] 500 on ${requestUrl} - Details:`, errorText);
              throw new Error(`Server Error: ${response.status} - ${errorText}`);
          }
          
          if (!response.ok && (response.status === 402 || response.status === 429)) {
              const errorText = await response.text().catch(() => 'No error body');
              console.error(`[Supabase] ${response.status} on ${requestUrl} - Details:`, errorText);
              lastError = new Error(`Quota Exceeded: ${response.status} - ${errorText}`);
              break; // Skip retries, go straight to failover
          }

          // Intercept 401 JWT errors directly from PostgREST
          if (!response.ok && response.status === 401) {
             try {
                const clonedResponse = response.clone();
                const errorText = await clonedResponse.text();
                if (errorText.includes('JWSError') || errorText.includes('PGRST301') || errorText.includes('Invalid number of parts')) {
                   if (typeof window !== 'undefined') {
                      console.warn('[SupabaseCache] Detected 401 JWT error from DB, clearing corrupted storage immediately.');
                      localStorage.removeItem('supabase-auth-token');
                      sessionStorage.removeItem('supabase-auth-token');
                      Object.keys(localStorage).forEach(key => {
                        if (key.startsWith('sb-') && key.endsWith('-auth-token')) localStorage.removeItem(key);
                      });
                      Object.keys(sessionStorage).forEach(key => {
                        if (key.startsWith('sb-') && key.endsWith('-auth-token')) sessionStorage.removeItem(key);
                      });
                      // Only alert and reload if we haven't done it recently
                      if (!sessionStorage.getItem('reloaded_from_jwt_error')) {
                        sessionStorage.setItem('reloaded_from_jwt_error', 'true');
                        alert('Tu sesión antigua no es compatible y fue borrada. Por favor vuelve a ingresar o navega normalmente.');
                        window.location.reload();
                      }
                   }
                }
             } catch (e) {
                // Ignore clone errors
             }
          }

          if (isCacheable && response.ok) {
            const clonedResponse = response.clone();
            const textData = await clonedResponse.text();
            const headersArray: [string, string][] = [];
            clonedResponse.headers.forEach((val, key) => {
              headersArray.push([key, val]);
            });

            this.cacheMap.set(requestUrl, {
              data: textData,
              headers: headersArray,
              status: clonedResponse.status,
              statusText: clonedResponse.statusText,
              expiresAt: Date.now() + CACHE_TTL
            });
            
            // Persist to IndexedDB for offline support
            await this.syncService.cacheGetRequest(requestUrl, textData, clonedResponse.status, clonedResponse.statusText, headersArray);
          }

          if (isMutation && response.ok) {
            this.logger.info(`[SupabaseCache] Mutation detected: ${method} ${requestUrl}. Clearing cache.`);
            this.cacheMap.clear();
            await this.syncService.clearCache();
          }

          return response;
        } catch (error: any) {
          clearTimeout(timeoutId);
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
           const cachedDB = await this.syncService.getCachedRequest(requestUrl);
           if (cachedDB) {
             this.logger.warn(`[OfflineSync] Fallback to IndexedDB after fetch failure: ${requestUrl}`);
             return new Response(cachedDB.data, {
               status: cachedDB.status,
               statusText: cachedDB.statusText,
               headers: new Headers(cachedDB.headers)
             });
           }
         } catch (e) {}
         
         // D1 Failover si no hay cache en IndexedDB
         this.logger.warn(`[Failover] No IndexedDB cache found. Attempting D1 Failover for: ${requestUrl}`);
         try {
             const d1WorkerUrl = 'https://arecofix-d1-failover.ezequielenrico15.workers.dev';
             const urlObj = new URL(requestUrl);
             const pathAndQuery = urlObj.pathname.replace('/rest/v1/', '') + urlObj.search;
             
             const d1Response = await fetch(`${d1WorkerUrl}/${pathAndQuery}`, {
                 method: 'GET',
                 headers: {
                     'Accept': 'application/json',
                     'Origin': window.location.origin
                 }
             });
             
             if (d1Response.ok) {
                 const textData = await d1Response.text();
                 this.logger.info(`[Failover] Successfully fetched from D1: ${requestUrl}`);
                 return new Response(textData, {
                     status: 200,
                     statusText: 'OK',
                     headers: new Headers([['Content-Type', 'application/json']])
                 });
             } else {
                 this.logger.error(`[Failover] D1 responded with ${d1Response.status}`);
             }
         } catch (d1Error) {
             this.logger.error(`[Failover] D1 Worker fetch failed for ${requestUrl}`, d1Error);
         }
      } else if (isMutation) {
         // Si es mutación y falló por timeout o error de red, encolar en IndexedDB
         this.logger.warn(`[OfflineSync] Fallback to Queue after network failure: ${method} ${requestUrl}`);
         const headersArray: [string, string][] = [];
         if (options?.headers) {
           new Headers(options.headers).forEach((val, key) => headersArray.push([key, val]));
         }
         
         await this.syncService.enqueueMutation(urlStr, method, headersArray, typeof options?.body === 'string' ? options.body : null);
         
         let mockResponseData: any[] = [];
         if (options?.body && typeof options.body === 'string') {
            try {
              const parsed = JSON.parse(options.body);
              mockResponseData = Array.isArray(parsed) ? parsed : [parsed];
            } catch (e) {}
         }
         
         return new Response(JSON.stringify(mockResponseData), {
           status: method === 'POST' ? 201 : 200,
           statusText: 'OK (Offline Mock Fallback)',
           headers: new Headers([['Content-Type', 'application/json']])
         });
      }
      
      this.logger.error('Supabase fetch critically failed after retries', lastError);
      throw lastError;
      } finally {
        removeTask();
      }
    };

    const isBrowser = typeof window !== 'undefined';
    class DummyWebSocket {
      CONNECTING = 0; OPEN = 1; CLOSING = 2; CLOSED = 3;
      readyState = 3;
      constructor() {
        Promise.resolve().then(() => {
          if (typeof (this as any).onerror === 'function') (this as any).onerror(new Error('SSR'));
          if (typeof (this as any).onclose === 'function') (this as any).onclose({ code: 1000 });
        });
      }
      close() {}
      send() {}
      addEventListener(type: string, listener: any) {
        if (type === 'error' || type === 'close') {
          Promise.resolve().then(() => listener({ code: 1000 }));
        }
      }
      removeEventListener() {}
      dispatchEvent() { return true; }
    }

    this.client = createClient(
      authBaseUrl,
      environment.supabaseKey,
      {
        global: {
          fetch: customFetch
        },
        db: {
          schema: 'public'
        },
        realtime: {
          params: {
            eventsPerSecond: 2,
          },
          transport: isBrowser ? undefined : (DummyWebSocket as any)
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
        
        // Handle invalid refresh tokens and 4-part JWT errors from old sessions
        if (
            errorMessage.includes('Invalid Refresh Token') || 
            errorMessage.includes('Refresh Token Not Found') ||
            (errorMessage.includes('400') && errorMessage.includes('refresh_token')) ||
            errorMessage.includes('JWSError') ||
            errorMessage.includes('Invalid number of parts') ||
            errorMessage.includes('PGRST301')
        ) {
          this.logger.warn('Detected invalid token or session in unhandled rejection, cleaning storage');
          event.preventDefault();
          
          // Clear all potentially corrupted storage directly
          localStorage.removeItem('supabase-auth-token');
          sessionStorage.removeItem('supabase-auth-token');
          
          // Iterar sobre las claves para borrar los del proyecto específico (ej: sb-db.arecofix.com.ar-auth-token)
          Object.keys(localStorage).forEach(key => {
            if (key.startsWith('sb-') && key.endsWith('-auth-token')) {
              localStorage.removeItem(key);
            }
          });
          Object.keys(sessionStorage).forEach(key => {
            if (key.startsWith('sb-') && key.endsWith('-auth-token')) {
              sessionStorage.removeItem(key);
            }
          });
          
          alert('Tu sesión era inválida o ha expirado. Por favor, refresca la página y vuelve a ingresar.');
          this.client.auth.signOut().catch(err => {
            this.logger.error('Error signing out after invalid token detection', err);
          }).finally(() => {
            window.location.reload();
          });
        }
      });
    }
  }

  getClient(): SupabaseClient {
    return this.client;
  }

  async clearCache(): Promise<void> {
    this.logger.info('[SupabaseCache] Manually clearing cache.');
    this.cacheMap.clear();
    await this.syncService.clearCache();
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
