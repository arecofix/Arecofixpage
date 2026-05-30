import { Component, PLATFORM_ID, inject, OnInit } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { BugReportModalComponent } from '../bug-report-modal/bug-report-modal.component';

@Component({
  selector: 'app-ribbon-menu',
  standalone: true,
  imports: [CommonModule, BugReportModalComponent],
  template: `
    <div *ngIf="isTauri" class="custom-titlebar" data-tauri-drag-region>
      <div class="ribbon-menu">
        <button class="ribbon-btn" (click)="navigate('/admin/dashboard')">
          <span class="icon">🏠</span>
          <span class="text">Inicio</span>
        </button>
        <button class="ribbon-btn" (click)="navigate('/admin/company')">
          <span class="icon">⚙️</span>
          <span class="text">Ajustes</span>
        </button>
        <button class="ribbon-btn" (click)="showHelpModal = true">
          <span class="icon">🛟</span>
          <span class="text">Ayuda</span>
        </button>
      </div>
      
      <div class="window-controls">
        <button class="control-btn" (click)="minimize()">_</button>
        <button class="control-btn" (click)="toggleMaximize()">□</button>
        <button class="control-btn close-btn" (click)="close()">×</button>
      </div>
    </div>
    
    @if (showHelpModal) {
      <app-bug-report-modal (close)="showHelpModal = false"></app-bug-report-modal>
    }
  `,
  styles: [`
    .custom-titlebar {
      height: 65px;
      background-color: #1e1e1e;
      display: flex;
      align-items: center;
      justify-content: space-between;
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      user-select: none;
      z-index: 9999;
      border-bottom: 1px solid #333;
    }

    .ribbon-menu {
      display: flex;
      gap: 5px;
      padding-left: 15px;
      height: 100%;
      align-items: center;
    }

    .ribbon-btn {
      background: transparent;
      border: none;
      color: #e0e0e0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      width: 60px;
      height: 55px;
      border-radius: 6px;
      cursor: pointer;
      transition: background-color 0.2s ease;
    }

    .ribbon-btn:hover {
      background-color: rgba(255, 255, 255, 0.1);
    }

    .ribbon-btn .icon {
      font-size: 20px;
      margin-bottom: 4px;
    }

    .ribbon-btn .text {
      font-size: 11px;
      font-family: sans-serif;
    }

    .window-controls {
      display: flex;
      height: 100%;
      align-items: flex-start;
    }

    .control-btn {
      background: transparent;
      border: none;
      color: #e0e0e0;
      width: 45px;
      height: 30px;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      font-size: 16px;
    }

    .control-btn:hover {
      background-color: rgba(255, 255, 255, 0.1);
    }

    .close-btn:hover {
      background-color: #e81123;
      color: white;
    }
    
    /* Make body padding top if tauri */
    :host-context(body.is-tauri) {
      /* Padding applied globally */
    }
  `]
})
export class RibbonMenuComponent implements OnInit {
  isTauri = false;
  showHelpModal = false;
  private platformId = inject(PLATFORM_ID);
  private router = inject(Router);

  async ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      import('@tauri-apps/api/core').then(({ isTauri }) => {
        this.isTauri = isTauri();
      }).catch(() => {
        this.isTauri = false;
      });
      if (this.isTauri) {
        document.body.classList.add('is-tauri');
        // Add padding to body to avoid content overlapping with the fixed titlebar
        document.body.style.paddingTop = '65px';
      }
    }
  }

  navigate(path: string) {
    this.router.navigate([path]);
  }

  async minimize() {
    if (!this.isTauri) return;
    const { getCurrentWindow } = await import('@tauri-apps/api/window');
    getCurrentWindow().minimize();
  }

  async toggleMaximize() {
    if (!this.isTauri) return;
    const { getCurrentWindow } = await import('@tauri-apps/api/window');
    getCurrentWindow().toggleMaximize();
  }

  async close() {
    if (!this.isTauri) return;
    const { getCurrentWindow } = await import('@tauri-apps/api/window');
    getCurrentWindow().close();
  }
}
