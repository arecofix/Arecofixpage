import { Injectable, inject } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { UserProfile } from '@app/shared/interfaces/user.interface';
import { LoggerService } from './logger.service';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private supabase = inject(SupabaseService).getClient();
  private logger = inject(LoggerService);

  async getProfile(userId: string): Promise<UserProfile | null> {
    const { data, error } = await this.supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle(); // Use maybeSingle() to gracefully return null when no row exists (avoids 406/PGRST116)

    if (error) {
      this.logger.error('Error fetching profile', error);
      return null;
    }

    return data as UserProfile | null;
  }

  async updateProfile(
    userId: string,
    profile: Partial<UserProfile>,
  ): Promise<UserProfile | null> {
    const { data, error } = await this.supabase
      .from('profiles')
      .update(profile)
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      this.logger.error('Error updating profile', error);
      return null;
    }

    return data as UserProfile;
  }

  async checkEmailExists(email: string): Promise<boolean> {
    const { data, error } = await this.supabase
      .from('profiles')
      .select('id')
      .eq('email', email)
      .maybeSingle();

    return !error && data !== null;
  }
}
