import { Directive, ElementRef, HostListener, Input, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Directive({
  selector: 'img[appFallback]',
  standalone: true
})
export class ImgFallbackDirective {
  private el = inject(ElementRef<HTMLImageElement>);
  private platformId = inject(PLATFORM_ID);

  @Input() appFallback: string = '/assets/img/no-image.svg';

  private hasFailed = false;

  @HostListener('error')
  onError(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    // Evitar bucles infinitos si el fallback también falla
    if (!this.hasFailed) {
      this.hasFailed = true;
      const img = this.el.nativeElement;
      const fallbackSrc = this.appFallback || '/assets/img/no-image.svg';
      img.src = fallbackSrc;
      img.classList.add('img-fallback-applied');
    }
  }
}
