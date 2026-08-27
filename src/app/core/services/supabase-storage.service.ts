import { Injectable, inject } from '@angular/core';
import { SUPABASE_CLIENT } from '@app/core/di/supabase-token';
import { TenantService } from './tenant.service';
import { LoggerService } from './logger.service';
import { AuthService } from './auth.service';
import { ImageOptimizerService } from './image-optimizer.service';

@Injectable({
  providedIn: 'root'
})
export class SupabaseStorageService {
  private supabase = inject(SUPABASE_CLIENT);
  private tenantService = inject(TenantService);
  private logger = inject(LoggerService);
  private auth = inject(AuthService);
  private imageOptimizer = inject(ImageOptimizerService);

  private readonly DEFAULT_BUCKET = 'public-assets';

  /**
   * Cloudflare CDN Base URL
   */
  private readonly CDN_URL = 'https://cdn.arecofix.com.ar';
  
  /**
   * Cloudflare Worker API URL (For Presigned URLs)
   */
  private readonly WORKER_API_URL = 'https://api.arecofix.com.ar';

  /**
   * Uploads a file with automatic multi-tenant path isolation.
   * Path format: <tenant_id>/<folder>/<filename>
   * Forces a Cache-Control metadata of 1 year ('31536000') to maximize browser caching.
   */
  async uploadFile(
    file: File, 
    folder: string, 
    bucket: string = this.DEFAULT_BUCKET,
    options: { cacheControl?: string; upsert?: boolean; context?: string; skipCompression?: boolean } = {}
  ): Promise<string> {
    try {
      // Refresh session if near expiry (less than 5 mins) to keep batch uploads running
      const session = this.auth.getCurrentSession();
      if (session) {
        const expiresAt = session.expires_at || 0;
        const now = Math.floor(Date.now() / 1000);
        if (expiresAt - now < 300) {
          await this.auth.refreshSession();
        }
      }

      let fileToUpload = file;
      
      // Client-side auto-compression to WebP (fallback compression layer)
      if (file.type.startsWith('image/') && !file.type.includes('svg') && !options.skipCompression) {
        try {
          fileToUpload = await this.imageOptimizer.compressImage(file, {
            maxWidth: 1200,
            maxHeight: 1200,
            quality: 0.8,
            format: 'image/webp'
          });
        } catch (compressError) {
          this.logger.warn(`Failed to compress image client-side, uploading original instead.`, compressError);
        }
      }

      const tenantId = this.tenantService.getTenantId();
      const fileExt = fileToUpload.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
      const filePath = `${tenantId}/${folder}/${fileName}`;

      // Obligatory requirement: Set Cache-Control metadata to at least 1 year (31536000)
      const cacheHeader = options.cacheControl || '31536000';

      // 1. Get Presigned URL from Cloudflare Worker
      const presignedRes = await fetch(`${this.WORKER_API_URL}/api/get-upload-url`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileName: filePath,
          contentType: fileToUpload.type
        })
      });

      if (!presignedRes.ok) {
        throw new Error('Failed to get presigned URL from Cloudflare Worker');
      }

      const { uploadUrl } = await presignedRes.json();

      // 2. Upload directly to Cloudflare R2 using the Presigned URL
      const fetchHeaders: Record<string, string> = {
        'Content-Type': fileToUpload.type,
        'cache-control': cacheHeader
      };

      const uploadPromise = fetch(uploadUrl, {
        method: 'PUT', // R2 Presigned URLs usually expect PUT
        body: await fileToUpload.arrayBuffer(),
        headers: fetchHeaders
      }).then(async (res) => {
        if (!res.ok) {
          const errBody = await res.text();
          throw new Error(`Upload to R2 failed: HTTP ${res.status} - ${errBody}`);
        }
        return filePath;
      });

      // 60s timeout safety for slow network connections
      let timeoutId: any;
      const timeoutPromise = new Promise<string>((_, reject) => {
          timeoutId = setTimeout(() => reject(new Error('Upload timeout (60s)')), 60000);
      });

      let finalPath: string;
      try {
        finalPath = await Promise.race([uploadPromise, timeoutPromise]);
      } finally {
        clearTimeout(timeoutId);
      }

      // 3. Return the public CDN URL directly
      return `${this.CDN_URL}/${finalPath}`;
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
    }
  }

  /**
   * Retrieves the public URL of a stored asset from Cloudflare CDN.
   * Can accept either a relative path or a full storage URL.
   */
  getPublicUrl(
    pathOrUrl: string, 
    bucket: string = this.DEFAULT_BUCKET,
    options: { width?: number; quality?: number; format?: string } = {}
  ): string {
    if (!pathOrUrl) return '';

    // If it's already a full CDN URL, return it
    if (pathOrUrl.startsWith(this.CDN_URL)) {
      return pathOrUrl;
    }

    // If it's an old Supabase URL, extract the path and convert to CDN
    const publicObjectPrefix = '/storage/v1/object/public/';
    const index = pathOrUrl.indexOf(publicObjectPrefix);
    if (index !== -1) {
      const pathAfterPublic = pathOrUrl.substring(index + publicObjectPrefix.length);
      const parts = pathAfterPublic.split('/');
      if (parts.length > 1) {
        // Reconstruct path excluding the bucket name (since R2 bucket is the root of CDN)
        const finalPath = parts.slice(1).join('/');
        return `${this.CDN_URL}/${finalPath}`;
      }
    } else if (pathOrUrl.startsWith('http')) {
      // If it's an external HTTP URL and not from our storage, return it directly
      return pathOrUrl;
    }

    // If it's a relative path, append to CDN URL
    // (Assuming relative paths are already stripped of bucket name)
    return `${this.CDN_URL}/${pathOrUrl}`;
  }
}
