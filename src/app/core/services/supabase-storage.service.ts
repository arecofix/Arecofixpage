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
   * Set this to true if you upgrade your Supabase plan to Pro or purchase the
   * Storage Image Transformations add-on. Since transformations return 400 errors
   * on the Free Plan, we default this to false.
   */
  private readonly enableServerTransformations = false;

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

      // Convert File to ArrayBuffer to prevent fetch API hanging bugs with dynamically created Blobs in some browser engines
      const arrayBuffer = await fileToUpload.arrayBuffer();

      // We use native fetch to bypass any hanging issues in the Supabase JS SDK (cross-fetch)
      const { data: sessionData } = await this.supabase.auth.getSession();
      const token = sessionData?.session?.access_token || '';
      
      // We must get the supabase url from the client config
      // In Supabase v2, it's accessible via this.supabase.supabaseUrl
      const supabaseUrl = (this.supabase as any).supabaseUrl;
      const uploadUrl = `${supabaseUrl}/storage/v1/object/${bucket}/${filePath}`;
      
      const fetchHeaders: Record<string, string> = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': fileToUpload.type,
        'cache-control': cacheHeader,
        'x-upsert': options.upsert ? 'true' : 'false'
      };

      const uploadPromise = fetch(uploadUrl, {
        method: 'POST',
        body: arrayBuffer,
        headers: fetchHeaders
      }).then(async (res) => {
        if (!res.ok) {
          const errBody = await res.text();
          let errMsg = `HTTP ${res.status}`;
          try { errMsg = JSON.parse(errBody).message || errMsg; } catch(e) {}
          throw new Error(errMsg);
        }
        return res.json();
      });

      // 60s timeout safety for slow network connections
      let timeoutId: any;
      const timeoutPromise = new Promise<{ Key?: string; path?: string }>((_, reject) => {
          timeoutId = setTimeout(() => reject(new Error('Upload timeout (60s)')), 60000);
      });

      let data;
      try {
        data = await Promise.race([uploadPromise, timeoutPromise]);
      } finally {
        clearTimeout(timeoutId);
      }

      let finalPath = data.path;
      if (!finalPath && data.Key) {
         // REST API returns Key like "bucket/folder/file.ext"
         if (data.Key.startsWith(bucket + '/')) {
             finalPath = data.Key.substring(bucket.length + 1);
         } else {
             finalPath = data.Key;
         }
      }

      // Return public URL optimized with Supabase Image Transformations
      return this.getPublicUrl(finalPath || filePath, bucket);
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
   * Retrieves the public URL of a stored asset, applying Supabase Image Transformations 
   * (width: 800, quality: 80, format: webp) to optimize delivery and minimize egress bandwidth.
   * Can accept either a relative path or a full storage URL.
   */
  getPublicUrl(
    pathOrUrl: string, 
    bucket: string = this.DEFAULT_BUCKET,
    options: { width?: number; quality?: number; format?: string } = {}
  ): string {
    if (!pathOrUrl) return '';

    let finalPath = pathOrUrl;
    let finalBucket = bucket;

    // Parse full URL to extract relative path and bucket if a full URL is provided
    if (pathOrUrl.startsWith('http')) {
      const publicObjectPrefix = '/storage/v1/object/public/';
      const index = pathOrUrl.indexOf(publicObjectPrefix);
      if (index !== -1) {
        const pathAfterPublic = pathOrUrl.substring(index + publicObjectPrefix.length);
        const parts = pathAfterPublic.split('/');
        if (parts.length > 1) {
          finalBucket = parts[0];
          // Reconstruct path excluding the bucket name
          finalPath = parts.slice(1).join('/');
        }
      } else {
        // If it's an external HTTP URL and not from our Supabase storage, return it directly
        return pathOrUrl;
      }
    }

    // Determine if the resource is an image file to apply transformations
    const isImage = /\.(jpg|jpeg|png|webp|gif|avif|heic|tiff|bmp)$/i.test(finalPath);

    // Apply Supabase Image Transformations for images (only if enabled/supported by the plan)
    const transformOptions = (isImage && this.enableServerTransformations) ? {
      transform: {
        width: options.width ?? 800,
        quality: options.quality ?? 80,
        format: (options.format ?? 'webp') as any
      }
    } : undefined;

    const { data } = this.supabase.storage
      .from(finalBucket)
      .getPublicUrl(finalPath, transformOptions);

    return data.publicUrl;
  }
}
