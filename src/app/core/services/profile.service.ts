import { Injectable, inject } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { UserProfile } from '@app/shared/interfaces/user.interface';
import { LoggerService } from './logger.service';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private supabase = inject(SupabaseService).getClient();
  private logger = inject(LoggerService);

  async getProfile(userId: string): Promise<UserProfile | null> {
    const { data, error } = await this.supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      this.logger.error('Error fetching profile', error);
      return null;
    }

    return data as UserProfile;
  }

  async updateProfile(userId: string, profile: Partial<UserProfile>): Promise<UserProfile | null> {
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
      .single();

    return !error && data !== null;
  }
}
