import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideServerRendering } from '@angular/platform-server';
import { provideClientHydration } from '@angular/platform-browser'; // Hydration is usually client side, but server needs to render hydrated content. Ah, provideClientHydration is in client config.
import { appConfig } from './app.config';

import { createClient } from '@supabase/supabase-js';
import { environment } from '../environments/environment';
import { SUPABASE_CLIENT } from './core/di/supabase-token';

const serverSupabase = createClient(environment.supabaseUrl, environment.supabaseKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false
  }
});

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(),
    { provide: SUPABASE_CLIENT, useValue: serverSupabase }
  ]
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
