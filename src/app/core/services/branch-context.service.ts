import { Injectable, inject } from '@angular/core';
import { BranchService } from './branch.service';

@Injectable({
  providedIn: 'root'
})
export class BranchContextService {
  private branchService = inject(BranchService);
  
  public currentBranchId = this.branchService.currentBranchId;

  setBranchId(id: string | null): void {
    this.branchService.setBranchById(id);
  }

  getBranchId(): string | null {
    return this.branchService.currentBranchId();
  }
}
