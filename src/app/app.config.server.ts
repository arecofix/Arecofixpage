import { provideServerRendering } from '@angular/ssr';
import { mergeApplicationConfig, ApplicationConfig, PendingTasks } from '@angular/core';
import { appConfig } from './app.config';
import { createClient } from '@supabase/supabase-js';
import { environment } from '../environments/environment';
import { SUPABASE_CLIENT } from './core/di/supabase-token';

// Creamos un WebSocket falso que cumple estrictamente con las reglas que exige Supabase
class ServerWebSocket {
  CONNECTING = 0; OPEN = 1; CLOSING = 2; CLOSED = 3;
  readyState = 3;
  url: string;

  constructor(url: string, protocols?: string | string[]) {
    this.url = url;
    // Disparamos onclose en el siguiente tick para que Supabase no se quede esperando eternamente
    Promise.resolve().then(() => {
      if (typeof (this as any).onclose === 'function') {
        (this as any).onclose({ code: 1000, reason: 'SSR does not support WebSockets' });
      }
    });
  }

  close() { }
  send() { }
  addEventListener(type: string, listener: any) {
    if (type === 'close' || type === 'error') {
      Promise.resolve().then(() => listener({ code: 1000 }));
    }
  }
  removeEventListener() { }
  dispatchEvent() { return true; }
}

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(),
    {
      provide: SUPABASE_CLIENT,
      deps: [PendingTasks],
      useFactory: (pendingTasks: PendingTasks) => {
        return createClient(environment.supabaseUrl, environment.supabaseKey, {
          auth: {
            persistSession: false,
            autoRefreshToken: false,
            detectSessionInUrl: false
          },
          realtime: {
            transport: ServerWebSocket as any, // Inyectamos nuestra clase segura
            params: { eventsPerSecond: 0 }
          },
          global: {
            fetch: (url, init) => {
              const release = pendingTasks.add();
              
              // Agregamos un timeout de 8 segundos para evitar que SSR se quede colgado eternamente
              const controller = new AbortController();
              const timeoutId = setTimeout(() => controller.abort(), 8000);
              
              const fetchInit = { ...init, signal: init?.signal || controller.signal } as RequestInit;

              return fetch(url, fetchInit).then(res => {
                clearTimeout(timeoutId);
                release();
                return res;
              }).catch(err => {
                clearTimeout(timeoutId);
                release();
                console.error(`[SSR Fetch Error] ${url}:`, err.message);
                throw err;
              });
            }
          }
        });
      }
    }
  ]
};

export const config = mergeApplicationConfig(appConfig, serverConfig);