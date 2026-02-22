import { Component, ChangeDetectionStrategy, signal, inject, model, output } from '@angular/core';

import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { ProductMediaService } from '../../services/product-media.service';

@Component({
  selector: 'app-product-images-manager',
  standalone: true,
  imports: [DragDropModule],
  templateUrl: './product-images-manager.component.html',
  styles: [`
    .cdk-drag-preview {
      box-shadow: 0 5px 5px -3px rgba(0, 0, 0, 0.2),
                  0 8px 10px 1px rgba(0, 0, 0, 0.14),
                  0 3px 14px 2px rgba(0, 0, 0, 0.12);
      opacity: 0.8;
      border-radius: 0.5rem;
    }
    .cdk-drag-placeholder {
      opacity: 0;
    }
    .cdk-drag-animating {
      transition: transform 250ms cubic-bezier(0, 0, 0.2, 1);
    }
    .image-list.cdk-drop-list-dragging .image-item:not(.cdk-drag-placeholder) {
      transition: transform 250ms cubic-bezier(0, 0, 0.2, 1);
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductImagesManagerComponent {
  private mediaService = inject(ProductMediaService);

  // Models
  images = model<string[]>([]);
  uploading = model<boolean>(false);
  
  // Outputs
  onError = output<string>();

  // State
  isCameraOpen = signal(false);
  stream = signal<MediaStream | null>(null);
  
  // Drag & Drop
  drop(event: CdkDragDrop<string[]>) {
    const currentImages = [...this.images()];
    moveItemInArray(currentImages, event.previousIndex, event.currentIndex);
    this.images.set(currentImages);
  }

  // File Upload
  async onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    this.uploading.set(true);
    const files = Array.from(input.files);
    
    try {
      const uploadPromises = files.map(file => this.mediaService.uploadImage(file));
      const urls = await Promise.all(uploadPromises);
      this.images.update(imgs => [...imgs, ...urls]);
    } catch (e: any) {
      this.onError.emit(e.message || 'Error al subir imagen');
    } finally {
      this.uploading.set(false);
      input.value = ''; // Reset input
    }
  }

  removeImage(index: number) {
    this.images.update(imgs => imgs.filter((_, i) => i !== index));
    // Optional: Call service to delete from cloud if desired, usually we wait for save or keep orphans until cleanup
  }

  // Camera Logic
  async toggleCamera() {
    if (this.isCameraOpen()) {
      this.stopCamera();
    } else {
      await this.startCamera();
    }
  }

  async startCamera() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      this.stream.set(stream);
      this.isCameraOpen.set(true);
      
      // Attach to video element in view
      setTimeout(() => {
        const video = document.querySelector('video');
        if (video) {
          video.srcObject = stream;
        }
      }, 100);
    } catch (err) {
      this.onError.emit('No se pudo acceder a la cámara');
    }
  }

  stopCamera() {
    const stream = this.stream();
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    this.stream.set(null);
    this.isCameraOpen.set(false);
  }

  async capturePhoto() {
    const video = document.querySelector('video');
    if (!video) return;

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(video, 0, 0);
    
    // Convert to blob and upload
    canvas.toBlob(async (blob) => {
      if (!blob) return;
      
      const file = new File([blob], `camera-capture-${Date.now()}.jpg`, { type: 'image/jpeg' });
      
      this.uploading.set(true);
      try {
        const url = await this.mediaService.uploadImage(file);
        this.images.update(imgs => [...imgs, url]);
        this.stopCamera(); // Convert logic: maybe keep open? For now close it.
      } catch (e: any) {
        this.onError.emit(e.message);
      } finally {
        this.uploading.set(false);
      }
    }, 'image/jpeg', 0.9);
  }
}
