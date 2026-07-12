import { Component, PLATFORM_ID, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { BugReportModalComponent } from '../bug-report-modal/bug-report-modal.component';
import { AuthService } from '@app/core/services/auth.service';
import { BranchService } from '@app/core/services/branch.service';

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
        <button class="ribbon-btn" (click)="navigateToSettings()">
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
      width: 45px;
      height: 45px;
      border-radius: 6px;
      cursor: pointer;
      transition: background-color 0.2s ease;
    }

    .ribbon-btn:hover {
      background-color: rgba(255, 255, 255, 0.1);
    }

    .ribbon-btn .icon {
      font-size: 13px;
      margin-bottom: 2px;
    }

    .ribbon-btn .text {
      font-size: 9px;
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
  private cdr = inject(ChangeDetectorRef);
  private authService = inject(AuthService);
  private branchService = inject(BranchService);

  async ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      import('@tauri-apps/api/core').then(({ isTauri }) => {
        this.isTauri = isTauri();
        if (this.isTauri) {
          document.body.classList.add('is-tauri');
          document.body.style.paddingTop = '65px';
        }
        this.cdr.detectChanges();
      }).catch(() => {
        this.isTauri = false;
        this.cdr.detectChanges();
      });
    }
  }


  navigate(path: string) {
    this.router.navigate([path]);
  }

  navigateToSettings() {
    // SuperAdmins go to company settings; branch admins go to their branch settings
    if (this.authService.isSuperAdmin()) {
      this.router.navigate(['/admin/company']);
    } else {
      const branch = this.branchService.currentBranch();
      if (branch?.slug) {
        this.router.navigate([`/${branch.slug}/admin/company`]);
      } else {
        this.router.navigate(['/admin/company']);
      }
    }
  }

  async minimize() {
    if (!this.isTauri) return;
    try {
      const { getCurrentWindow } = await import('@tauri-apps/api/window');
      await getCurrentWindow().minimize();
    } catch (e) {
      console.error('[RibbonMenu] minimize error:', e);
    }
  }

  async toggleMaximize() {
    if (!this.isTauri) return;
    try {
      const { getCurrentWindow } = await import('@tauri-apps/api/window');
      await getCurrentWindow().toggleMaximize();
    } catch (e) {
      console.error('[RibbonMenu] toggleMaximize error:', e);
    }
  }

  async close() {
    if (!this.isTauri) return;
    try {
      const { getCurrentWindow } = await import('@tauri-apps/api/window');
      await getCurrentWindow().close();
    } catch (e) {
      console.error('[RibbonMenu] close error:', e);
      // Fallback: destroy current window
      try {
        const { getCurrentWindow } = await import('@tauri-apps/api/window');
        await getCurrentWindow().destroy();
      } catch {
        console.error('[RibbonMenu] destroy also failed');
      }
    }
  }
}
