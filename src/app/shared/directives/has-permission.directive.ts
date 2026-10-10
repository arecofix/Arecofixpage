import { Directive, Input, TemplateRef, ViewContainerRef, inject, effect, signal } from '@angular/core';
import { PermissionService } from '../../core/services/permission.service';

@Directive({
  selector: '[hasPermission]',
  standalone: true
})
export class HasPermissionDirective {
  private templateRef = inject(TemplateRef<any>);
  private viewContainer = inject(ViewContainerRef);
  private permissionService = inject(PermissionService);

  private permission = signal<string | string[]>('');
  private hasView = false;

  @Input() set hasPermission(permission: string | string[]) {
    this.permission.set(permission);
  }

  constructor() {
    effect(() => {
      // This effect runs whenever `isLoaded()` or `hasPermission()` (which depends on a signal inside) changes.
      // Wait, hasPermission is a method, not a signal getter. We need PermissionService to expose a signal.
      const isLoaded = this.permissionService.isLoadedSignal();
      if (!isLoaded) {
        this.clearView();
        return;
      }
      const currentPerm = this.permission();
      if (!currentPerm || (Array.isArray(currentPerm) && currentPerm.length === 0)) return;

      const hasPerm = Array.isArray(currentPerm) 
        ? currentPerm.some(p => this.permissionService.hasPermission(p))
        : this.permissionService.hasPermission(currentPerm);
        
      if (hasPerm && !this.hasView) {
        this.viewContainer.createEmbeddedView(this.templateRef);
        this.hasView = true;
      } else if (!hasPerm && this.hasView) {
        this.clearView();
      }
    });
  }

  private clearView() {
    this.viewContainer.clear();
    this.hasView = false;
  }
}
