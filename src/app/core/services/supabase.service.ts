import { Injectable, inject } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '@env/environment';
import { LoggerService } from './logger.service';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private logger = inject(LoggerService);
  private client: SupabaseClient;

  constructor() {
    this.client = createClient(environment.supabaseUrl, environment.supabaseKey, {
      auth: {
        persistSession: typeof window !== 'undefined' && !!window.localStorage,
        autoRefreshToken: typeof window !== 'undefined' && !!window.localStorage,
        detectSessionInUrl: typeof window !== 'undefined'
      }
    });
  }

  getClient(): SupabaseClient {
    return this.client;
  }

  async testConnection(): Promise<boolean> {
    try {
      const { error } = await this.client.from('profiles').select('id').limit(1);
      return !error;
    } catch (err) {
      this.logger.error('Supabase connection test failed', err);
      return false;
    }
  }
}
