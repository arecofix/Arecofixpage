import {
  Component,
  AfterViewInit,
  inject,
  PLATFORM_ID,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  ElementRef,
  viewChild,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { WawAccessibilityService } from '@app/core/services/waw-accessibility.service';

@Component({
  selector: 'app-waw-widget',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div #wawHost class="waw-host-wrapper" aria-hidden="true"></div>
  `,
  styleUrl: './waw-widget.css',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WawWidgetComponent implements AfterViewInit {
  private platformId = inject(PLATFORM_ID);
  public wawService = inject(WawAccessibilityService);
  wawHost = viewChild<ElementRef<HTMLDivElement>>('wawHost');

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      // Inicializar WAW en el navegador tras el renderizado de la vista
      this.wawService.init();
    }
  }
}

