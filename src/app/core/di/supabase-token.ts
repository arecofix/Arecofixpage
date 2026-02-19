import { InjectionToken } from '@angular/core';
import { SupabaseClient } from '@supabase/supabase-js';

export const SUPABASE_CLIENT = new InjectionToken<SupabaseClient>('SUPABASE_CLIENT');
