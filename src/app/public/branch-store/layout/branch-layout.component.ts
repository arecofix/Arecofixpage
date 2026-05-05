import {
  Component, inject, OnInit, OnDestroy,
  ChangeDetectionStrategy, ViewEncapsulation
} from '@angular/core';
import { CommonModule, ViewportScroller } from '@angular/common';
import { RouterOutlet, ActivatedRoute } from '@angular/router';
import { Branch } from '@app/shared/interfaces/branch.interface';
import { BranchContextService } from '@app/core/services/branch-context.service';

@Component({
  selector: 'app-branch-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './branch-layout.component.html',
  styleUrls: ['./branch-layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class BranchLayoutComponent implements OnInit, OnDestroy {
  private route         = inject(ActivatedRoute);
  private scroller      = inject(ViewportScroller);
  private branchCtx     = inject(BranchContextService);

  branchData: Branch | null = null;
  primaryColor: string = '#3b82f6';
  logoUrl: string | null = null;
  menuOpen = false;

  // Delegamos al signal compartido seteado por BranchHomeComponent
  readonly resolvedConfig = this.branchCtx.resolvedLandingConfig;

  ngOnInit(): void {
    this.branchData = this.route.snapshot.data['branchData'];

    if (this.branchData) {
      this.primaryColor = this.branchData.branding_settings?.primary_color ?? '#3b82f6';
      this.logoUrl = this.branchData.branding_settings?.logo_url ?? null;
    }
  }

  ngOnDestroy(): void {
    this.branchCtx.clearConfig();
  }

  /** Desplazamiento suave hacia un anchor ID */
  scrollTo(anchorId: string): void {
    this.menuOpen = false;
    setTimeout(() => {
      const el = document.getElementById(anchorId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        this.scroller.scrollToAnchor(anchorId);
      }
    }, 50);
  }

  /** ¿Está activo el módulo de catálogo? — Leído del signal compartido */
  get hasCatalog(): boolean {
    return this.resolvedConfig()?.has_catalog ?? false;
  }

  /** ¿Está activa la sección Quiénes Somos? */
  get hasAbout(): boolean {
    return this.resolvedConfig()?.has_about ?? true;
  }

  /** ¿Está activa la sección de Servicios? */
  get hasServices(): boolean {
    return this.resolvedConfig()?.has_services ?? false;
  }

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }
}
