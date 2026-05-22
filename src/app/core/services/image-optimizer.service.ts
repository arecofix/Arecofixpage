import { Injectable } from '@angular/core';

export interface CompressionOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  format?: 'image/webp' | 'image/jpeg';
}

@Injectable({
  providedIn: 'root'
})
export class ImageOptimizerService {

  /**
   * Compresses an image file client-side using HTML5 Canvas.
   * Converts the image to WebP (or JPEG) and resizes it if it exceeds max dimensions.
   * 
   * This directly addresses the "Cached Egress" issue by ensuring that the files
   * uploaded to Supabase Storage are optimized (typically ~100KB instead of 3MB-10MB).
   * 
   * @param file The original image file from input[type="file"]
   * @param options Compression settings (dimensions, quality, format)
   * @returns A promise resolving to the compressed File object
   */
  compressImage(file: File, options: CompressionOptions = {}): Promise<File> {
    const {
      maxWidth = 1200,
      maxHeight = 1200,
      quality = 0.8,
      format = 'image/webp'
    } = options;

    // Skip compression if it's not an image
    if (!file.type.startsWith('image/')) {
      console.warn(`[ImageOptimizerService] File "${file.name}" is not an image. Skipping compression.`);
      return Promise.resolve(file);
    }

    return new Promise<File>((resolve, reject) => {
      const img = new Image();
      const objectUrl = URL.createObjectURL(file);

      img.onload = () => {
        // Clean up the object URL immediately after loading the image
        URL.revokeObjectURL(objectUrl);

        let width = img.naturalWidth || img.width;
        let height = img.naturalHeight || img.height;

        // Calculate aspect-ratio preserving dimensions
        if (width > maxWidth || height > maxHeight) {
          const aspectRatio = width / height;
          if (aspectRatio > 1) {
            width = maxWidth;
            height = Math.round(maxWidth / aspectRatio);
          } else {
            height = maxHeight;
            width = Math.round(maxHeight * aspectRatio);
          }
        }

        // Create canvas
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          return reject(new Error('Failed to get 2D context from canvas.'));
        }

        // Handle transparent PNGs/WebPs being converted to JPEG (fill background with white)
        if (format === 'image/jpeg') {
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, width, height);
        }

        // Draw image onto canvas
        ctx.drawImage(img, 0, 0, width, height);

        // Convert canvas content to blob
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              console.warn('[ImageOptimizerService] Canvas compression failed. Falling back to original file.');
              return resolve(file);
            }

            // Create new file name with correct extension
            const originalName = file.name;
            const lastDotIndex = originalName.lastIndexOf('.');
            const nameWithoutExtension = lastDotIndex !== -1 ? originalName.substring(0, lastDotIndex) : originalName;
            const extension = format === 'image/webp' ? 'webp' : 'jpg';
            const optimizedFileName = `${nameWithoutExtension}_optimized.${extension}`;

            const compressedFile = new File([blob], optimizedFileName, {
              type: format,
              lastModified: Date.now()
            });

            console.log(
              `[ImageOptimizerService] Optimized "${file.name}": ` +
              `Original: ${(file.size / 1024 / 1024).toFixed(2)} MB, ` +
              `Compressed: ${(compressedFile.size / 1024).toFixed(2)} KB ` +
              `(-${Math.round((1 - compressedFile.size / file.size) * 100)}%)`
            );

            resolve(compressedFile);
          },
          format,
          quality
        );
      };

      img.onerror = (error) => {
        URL.revokeObjectURL(objectUrl);
        console.error('[ImageOptimizerService] Failed to load image for compression:', error);
        reject(error);
      };

      // Set src to trigger loading
      img.src = objectUrl;
    });
  }
}
