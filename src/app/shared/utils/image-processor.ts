/**
 * Image Processing Utility
 * Provides client-side compression and resizing to optimize uploads.
 */
export class ImageProcessor {
  /**
   * Compresses an image file.
   * @param file The original image file.
   * @param maxWidth Max width in pixels.
   * @param maxHeight Max height in pixels.
   * @param quality Compression quality (0 to 1).
   * @returns A promise that resolves to the compressed Blob as a File.
   */
  static async compress(
    file: File,
    maxWidth: number = 1200,
    maxHeight: number = 1200,
    quality: number = 0.8
  ): Promise<File> {
    // Only compress images
    if (!file.type.startsWith('image/')) {
      return file;
    }

    // Don't compress small images or GIFs (to preserve animation)
    if (file.size < 200 * 1024 || file.type === 'image/gif') {
      return file;
    }

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          // Calculate new dimensions while maintaining aspect ratio
          if (width > height) {
            if (width > maxWidth) {
              height *= maxWidth / width;
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width *= maxHeight / height;
              height = maxHeight;
            }
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            return resolve(file); // Fallback to original
          }

          // Use better image smoothing
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          
          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              if (!blob) {
                return resolve(file);
              }
              const compressedFile = new File([blob], file.name, {
                type: 'image/jpeg',
                lastModified: Date.now(),
              });
              resolve(compressedFile);
            },
            'image/jpeg',
            quality
          );
        };
        img.onerror = (err) => reject(err);
      };
      reader.onerror = (err) => reject(err);
    });
  }
}
