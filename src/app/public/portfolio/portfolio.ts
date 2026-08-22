import {
  Component,
  OnInit,
  OnDestroy,
  inject,
  PLATFORM_ID,
  ChangeDetectionStrategy,
} from '@angular/core';
import { SystemStatus } from './portfolio.data';
import { isPlatformBrowser } from '@angular/common';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PreferencesService } from '../../shared/services/preferences.service';
import { interval, Subscription } from 'rxjs';

import { PortfolioContent, portfolioContent } from './portfolio.data';

@Component({
  selector: 'app-portfolio',
  standalone: true,
  imports: [CommonModule, RouterLink, NgOptimizedImage],
  templateUrl: './portfolio.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ['./portfolio.css'],
})
export class PortfolioComponent implements OnInit, OnDestroy {
  public currentLanguage: 'es' | 'en' = 'es';
  private platformId = inject(PLATFORM_ID);
  isEmailVisible = false;

  get emailAddress(): string {
    return atob('RXplcXVpZWxlbnJpY28xNUBnbWFpbC5jb20=');
  }

  revealEmail() {
    this.isEmailVisible = true;
  }

  sendEmail() {
    if (!isPlatformBrowser(this.platformId)) return;
    window.location.href = 'mailto:' + this.emailAddress;
  }
  activeSnippetIndex = 0;
  terminalOutput: string[] = [];
  systemStatuses: SystemStatus[] = [
    {
      name: 'Nginx Gateway',
      status: 'operational',
      latency: 15,
      uptime: '99.99%',
    },
    {
      name: 'PostgreSQL DB (RLS)',
      status: 'operational',
      latency: 8,
      uptime: '99.95%',
    },
    {
      name: 'Docker Host',
      status: 'operational',
      latency: 18,
      uptime: '99.95%',
    },
    {
      name: 'Backup Daemon',
      status: 'operational',
      latency: 5,
      uptime: '99.99%',
    },
  ];

  private simulationSubscription?: Subscription;

  portfolioContent = portfolioContent;

  backgroundOptions = [
    { id: 'gradient-5', name: 'Dark Gray', class: 'bg-surface-dark' },
  ];

  isImageModalOpen = false;
  selectedImageUrl = '';
  zoomScale = 1.0;
  translateX = 0;
  translateY = 0;
  isDragging = false;
  startX = 0;
  startY = 0;

  constructor(public preferencesService: PreferencesService) {}

  get currentContent(): PortfolioContent {
    return this.portfolioContent[this.currentLanguage];
  }

  ngOnInit(): void {
    this.preferencesService.language$.subscribe((lang) => {
      this.currentLanguage = lang;
    });

    // Simulate realtime terminal updates
    if (isPlatformBrowser(this.platformId)) {
      this.simulationSubscription = interval(2000).subscribe(() => {
        this.simulateSystemActivity();
      });
    }

    this.terminalOutput = [
      '> Initializing system...',
      '> Connected to Supabase Engine v2.0',
      '> Loading modules...',
      '> System ready.',
    ];
  }

  ngOnDestroy(): void {
    if (this.simulationSubscription) {
      this.simulationSubscription.unsubscribe();
    }
  }

  simulateSystemActivity() {
    // Randomly update latencies
    this.systemStatuses.forEach((stat) => {
      const variation = Math.floor(Math.random() * 6) - 3;
      stat.latency = Math.max(1, stat.latency + variation);
    });

    // Add random log
    const logs = [
      '[SEC] Intrusion Detection System: 0 threats detected',
      '[SEC] JWT signature verification successful',
      '[OPS] Backup completed successfully in 0.35s',
      '[OPS] PostgreSQL RLS Policy cache reloaded',
      '[INFO] Nginx proxy request: /api/v1/health - 200 OK',
      '[SEC] HIBP API audit completed: 0 breached credentials found',
      '[OPS] Docker container heap health: OK',
    ];
    const randomLog = logs[Math.floor(Math.random() * logs.length)];
    this.terminalOutput.push(
      `> ${new Date().toLocaleTimeString()} ${randomLog}`,
    );
    if (this.terminalOutput.length > 8) this.terminalOutput.shift();
  }

  // Lightbox Modal Controls with Drag/Pan and Zoom
  openImageModal(imageUrl: string) {
    this.selectedImageUrl = imageUrl;
    this.isImageModalOpen = true;
    this.zoomScale = 1.0;
    this.translateX = 0;
    this.translateY = 0;
  }

  closeImageModal() {
    this.isImageModalOpen = false;
    this.selectedImageUrl = '';
  }

  zoomIn(event?: MouseEvent) {
    if (event) event.stopPropagation();
    if (this.zoomScale < 5.0) {
      this.zoomScale += 0.25;
    }
  }

  zoomOut(event?: MouseEvent) {
    if (event) event.stopPropagation();
    if (this.zoomScale > 0.5) {
      this.zoomScale -= 0.25;
    }
  }

  resetZoom(event?: MouseEvent) {
    if (event) event.stopPropagation();
    this.zoomScale = 1.0;
    this.translateX = 0;
    this.translateY = 0;
  }

  // Mouse Drag Event Handlers for Panning
  onMouseDown(event: MouseEvent) {
    if (this.zoomScale <= 1.0) return;
    this.isDragging = true;
    this.startX = event.clientX - this.translateX;
    this.startY = event.clientY - this.translateY;
    event.preventDefault();
  }

  onMouseMove(event: MouseEvent) {
    if (!this.isDragging) return;
    this.translateX = event.clientX - this.startX;
    this.translateY = event.clientY - this.startY;
  }

  onMouseUp() {
    this.isDragging = false;
  }

  // Touch Event Handlers for Panning on Mobile
  onTouchStart(event: TouchEvent) {
    if (this.zoomScale <= 1.0 || event.touches.length !== 1) return;
    this.isDragging = true;
    this.startX = event.touches[0].clientX - this.translateX;
    this.startY = event.touches[0].clientY - this.translateY;
  }

  onTouchMove(event: TouchEvent) {
    if (!this.isDragging || event.touches.length !== 1) return;
    this.translateX = event.touches[0].clientX - this.startX;
    this.translateY = event.touches[0].clientY - this.startY;
  }

  onTouchEnd() {
    this.isDragging = false;
  }

  getTechIcon(tech: string): string {
    const t = tech.toLowerCase().trim();
    if (t.includes('java 21') || t === 'java')
      return 'fab fa-java text-[#ec2025]';
    if (t.includes('spring')) return 'fas fa-leaf text-[#6db33f]';
    if (t.includes('kafka')) return 'fas fa-exchange-alt text-[#3776ab]';
    if (
      t.includes('postgresql') ||
      t === 'postgres' ||
      t.includes('sql') ||
      t.includes('bases de datos') ||
      t.includes('database')
    )
      return 'fas fa-database text-[#336791]';
    if (t.includes('hibernate')) return 'fas fa-layer-group text-[#b58f55]';
    if (t.includes('node')) return 'fab fa-node-js text-[#68a063]';
    if (t.includes('angular')) return 'fab fa-angular text-[#dd0031]';
    if (t.includes('supabase')) return 'fas fa-bolt text-[#3cfcf8]';
    if (t.includes('redis')) return 'fas fa-server text-[#d82c20]';
    if (
      t.includes('docker') ||
      t.includes('contenedores') ||
      t.includes('virtualización')
    )
      return 'fab fa-docker text-[#2496ed]';
    if (t.includes('typescript')) return 'fas fa-code text-[#3178c6]';
    if (t.includes('tailwind')) return 'fab fa-css3-alt text-[#38bdf8]';
    if (t.includes('rxjs')) return 'fas fa-sync text-[#c2185b]';
    if (t.includes('python')) return 'fa-brands fa-python fa-fw text-[#3776ab]';
    if (t.includes('flask')) return 'fas fa-flask text-[#e5e5e5]';
    if (t.includes('django')) return 'fas fa-server text-[#092e20]';
    if (t.includes('sqlite')) return 'fas fa-database text-[#003b57]';
    if (
      t.includes('jwt') ||
      t.includes('autenticación') ||
      t.includes('auth') ||
      t.includes('accesos')
    )
      return 'fas fa-key text-[#d63aff]';
    if (t.includes('openai') || t.includes('gemini') || t.includes('ai'))
      return 'fas fa-robot text-[#10a37f]';
    if (t.includes('components')) return 'fas fa-cubes text-[#f16529]';
    if (t.includes('patterns') || t.includes('solid'))
      return 'fas fa-project-diagram text-[#ff5722]';
    if (t.includes('test')) return 'fas fa-vial text-[#9c27b0]';
    if (t.includes('jpa')) return 'fas fa-database text-[#e28743]';
    if (t.includes('oop')) return 'fas fa-cube text-[#ff9800]';
    if (t.includes('javascript') || t === 'js')
      return 'fab fa-js text-[#f7df1e]';
    if (
      t.includes('ciberseguridad') ||
      t.includes('seguridad') ||
      t.includes('security') ||
      t.includes('protección') ||
      t.includes('secops')
    )
      return 'fas fa-shield-alt text-[#38bdf8]';
    if (
      t.includes('bash') ||
      t.includes('linux') ||
      t.includes('scripting') ||
      t.includes('sysadmin') ||
      t.includes('terminal')
    )
      return 'fas fa-terminal text-[#4ebd4f]';
    if (t.includes('git') || t.includes('gitflow'))
      return 'fab fa-git-alt text-[#f05032]';
    if (t.includes('excel')) return 'fas fa-file-excel text-[#107c41]';
    return 'fas fa-cog text-cyan-400';
  }
}
