import { Injectable, inject } from '@angular/core';
import { AuthService } from '@app/core/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ProductMediaService {
  private auth = inject(AuthService);
  private supabase = this.auth.getSupabaseClient();
  private readonly BUCKET = 'public-assets';
  private readonly FOLDER = 'products';

  async uploadImage(file: File): Promise<string> {
    // Sanitize filename to avoid weird character issues
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
    const filePath = `${this.FOLDER}/${fileName}`;

    const { data, error } = await this.supabase.storage
      .from(this.BUCKET)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) throw error;

    const { data: publicUrl } = this.supabase.storage
      .from(this.BUCKET)
      .getPublicUrl(data.path);

    return publicUrl.publicUrl;
  }

  async deleteImage(url: string): Promise<void> {
    // Extract path from URL
    // URL format: https://<project>.supabase.co/storage/v1/object/public/<bucket>/<path>
    const urlParts = url.split(`${this.BUCKET}/`);
    if (urlParts.length < 2) return; // Invalid or external URL
    
    const path = urlParts[1];
    
    const { error } = await this.supabase.storage
      .from(this.BUCKET)
      .remove([path]);

    if (error) {
      console.error('Error deleting image:', error);
      // We often don't want to block the UI for a cleanup error, but logging is good.
    }
  }
}
