import { Injectable, inject, signal } from '@angular/core';
import { Branch, BranchLandingConfig } from '@app/shared/interfaces/branch.interface';

/**
 * Servicio de contexto de la sucursal activa en la landing pública.
 * Actúa como puente entre BranchLayoutComponent (Navbar) y
 * BranchHomeComponent (contenido), compartiendo la config resuelta
 * sin duplicar la lógica de detección de tipo de sucursal.
 */
@Injectable({
  providedIn: 'root'
})
export class BranchContextService {
  private _currentBranchId = signal<string | null>(null);
  public currentBranchId = this._currentBranchId.asReadonly();

  /** Config de landing resuelta — seteada por BranchHomeComponent al inicializar */
  public readonly resolvedLandingConfig = signal<BranchLandingConfig | null>(null);

  setBranchId(id: string | null): void {
    this._currentBranchId.set(id);
  }

  getBranchId(): string | null {
    return this._currentBranchId();
  }

  /** Llamado por BranchHomeComponent después de resolver la config */
  setResolvedConfig(config: BranchLandingConfig): void {
    this.resolvedLandingConfig.set(config);
  }

  /** Limpiar al destruir la ruta */
  clearConfig(): void {
    this.resolvedLandingConfig.set(null);
  }
}
