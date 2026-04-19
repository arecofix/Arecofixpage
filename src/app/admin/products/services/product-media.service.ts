import { Injectable, inject } from '@angular/core';
import { SupabaseStorageService } from '@app/core/services/supabase-storage.service';
import { ImageProcessor } from '@app/shared/utils/image-processor';

@Injectable({
  providedIn: 'root'
})
export class ProductMediaService {
  private storage = inject(SupabaseStorageService);
  private readonly FOLDER = 'products';

  async uploadImage(file: File): Promise<string> {
    const optimizedFile = await ImageProcessor.compress(file);
    return this.storage.uploadFile(optimizedFile, this.FOLDER, 'public-assets', { context: 'ProductImage' });
  }

  async uploadFile(file: File, folder: string): Promise<string> {
    const isImage = file.type.startsWith('image/');
    const processedFile = isImage ? await ImageProcessor.compress(file) : file;
    return this.storage.uploadFile(processedFile, folder, 'public-assets', { context: folder });
  }

  async deleteImage(url: string): Promise<void> {
    return this.storage.deleteFile(url, 'public-assets');
  }
}
