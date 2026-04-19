import { Injectable, inject } from '@angular/core';
import { SupabaseClient } from '@supabase/supabase-js';
import { SUPABASE_CLIENT } from '@app/core/di/supabase-token';
import { TenantService } from './tenant.service';
import { LoggerService } from './logger.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class SupabaseStorageService {
  private supabase = inject(SUPABASE_CLIENT);
  private tenantService = inject(TenantService);
  private logger = inject(LoggerService);
  private auth = inject(AuthService);

  private readonly DEFAULT_BUCKET = 'public-assets';

  /**
   * Uploads a file with automatic multi-tenant path isolation.
   * Path format: <tenant_id>/<folder>/<filename>
   */
  async uploadFile(
    file: File, 
    folder: string, 
    bucket: string = this.DEFAULT_BUCKET,
    options: { cacheControl?: string; upsert?: boolean; context?: string } = {}
  ): Promise<string> {
    try {
      // Only refresh session if it's about to expire (less than 5 mins) to optimize batch uploads
      const session = this.auth.getCurrentSession();
      if (session) {
        const expiresAt = session.expires_at || 0;
        const now = Math.floor(Date.now() / 1000);
        if (expiresAt - now < 300) { // 5 minutes
          await this.auth.refreshSession();
        }
      } else {
        await this.auth.refreshSession();
      }

      const tenantId = this.tenantService.getTenantId();
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
      const filePath = `${tenantId}/${folder}/${fileName}`;

      const uploadPromise = this.supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: options.cacheControl || '3600',
          upsert: options.upsert || false
        });

      // 30s timeout
      const timeoutPromise = new Promise<{ data: any; error: any }>((_, reject) => {
          setTimeout(() => reject(new Error('Upload timeout (30s)')), 30000);
      });

      const { data, error } = await Promise.race([uploadPromise, timeoutPromise]) as any;

      if (error) {
        this.logger.error(`Storage Upload Error [${options.context || 'General'}]:`, error);
        throw error;
      }

      const { data: { publicUrl } } = this.supabase.storage
        .from(bucket)
        .getPublicUrl(data.path);

      return publicUrl;
    } catch (error) {
      this.logger.error(`Unhandled error in SupabaseStorageService.uploadFile`, error);
      throw error;
    }
  }

  /**
   * Deletes a file from the bucket.
   */
  async deleteFile(url: string, bucket: string = this.DEFAULT_BUCKET): Promise<void> {
    try {
      const urlParts = url.split(`${bucket}/`);
      if (urlParts.length < 2) {
        this.logger.warn(`Could not parse storage path for deletion from URL: ${url}`);
        return;
      }
      
      const path = urlParts[1];
      const { error } = await this.supabase.storage
        .from(bucket)
        .remove([path]);

      if (error) {
        this.logger.error(`Storage Delete Error:`, error);
        throw error;
      }
    } catch (error) {
      this.logger.error(`Unhandled error in SupabaseStorageService.deleteFile`, error);
      // We often don't want to block UI for cleanup failures, but we log it.
    }
  }
}
