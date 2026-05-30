import { Injectable, Inject, PLATFORM_ID, OnDestroy } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ScannerService implements OnDestroy {
  private barcodeSubject = new Subject<string>();
  
  // Expose observable for components to subscribe
  public barcodeScanned$: Observable<string> = this.barcodeSubject.asObservable();

  private buffer: string = '';
  private lastKeyTime: number = 0;
  private readonly TIMEOUT_MS = 50; // Max time between keystrokes to be considered a scan
  private keydownListener!: (e: KeyboardEvent) => void;
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
    if (this.isBrowser) {
      this.initScannerListener();
    }
  }

  private initScannerListener() {
    this.keydownListener = (e: KeyboardEvent) => {
      // Ignore keydowns originating from input/textarea fields if we want standard typing to work
      // But typically, a scanner types extremely fast, so even if focus is on an input, we might want to intercept it.
      const target = e.target as HTMLElement;
      
      const currentTime = new Date().getTime();
      
      if (this.buffer.length > 0 && (currentTime - this.lastKeyTime) > this.TIMEOUT_MS) {
        // Timeout exceeded, it's normal typing, clear buffer
        this.buffer = '';
      }

      this.lastKeyTime = currentTime;

      // Handle Enter key (end of scan)
      if (e.key === 'Enter') {
        if (this.buffer.length > 3) { // Minimum length for a barcode
          // We have a barcode!
          e.preventDefault();
          this.barcodeSubject.next(this.buffer);
          this.buffer = ''; // Reset
          return;
        }
        this.buffer = '';
        return;
      }

      // Allow only printable characters (alphanumeric for barcodes)
      if (e.key && e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
        this.buffer += e.key;
        
        // If we are building a fast buffer, prevent default to avoid typing into inputs
        // This can be tricky if they type fast manually, so we only prevent if buffer is getting large fast.
        if (this.buffer.length > 2) {
          e.preventDefault();
        }
      }
    };

    window.addEventListener('keydown', this.keydownListener, true); // useCapture to intercept before inputs
  }

  ngOnDestroy() {
    if (this.isBrowser && this.keydownListener) {
      window.removeEventListener('keydown', this.keydownListener, true);
    }
  }
}
