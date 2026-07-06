import { provideServerRendering } from '@angular/ssr';
import { mergeApplicationConfig, ApplicationConfig, PendingTasks } from '@angular/core';
import { appConfig } from './app.config';
import { createClient } from '@supabase/supabase-js';
import { environment } from '../environments/environment';
import { SUPABASE_CLIENT } from './core/di/supabase-token';

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
          global: {
            fetch: (url, init) => {
              const release = pendingTasks.add();
              return fetch(url, init).then(res => {
                  release();
                  return res;
              }).catch(err => {
                  release();
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
