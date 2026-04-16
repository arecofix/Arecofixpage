import { Injectable, inject } from '@angular/core';
import { AuthService } from './auth.service';
import { firstValueFrom } from 'rxjs';
import { TenantService } from './tenant.service';
import { TenantRepository } from '../repositories/tenant.repository';
import { BranchService } from './branch.service';
import { BranchRepository } from '../repositories/branch.repository';

export interface CompanySettings {
  id: string;
  name: string;
  subdomain?: string;
  contact_email?: string;
  contact_phone?: string;
  location?: string;
  tax_id?: string;
  tax_id_name?: string;
  owner_name?: string;
  tax_percentage?: number;
  tax_abbreviation?: string;
  currency?: string;
  usd_rate?: number;
  branding_settings?: {
    logo_url?: string;
    primary_color?: string;
    accent_color?: string;
  };
  // Backward compatibility properties
  address?: string;
  email?: string;
  phone?: string;
  logo_url?: string;
  contact_phone_whatsapp?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  private tenantService = inject(TenantService);
  private tenantRepo = inject(TenantRepository);
  private branchService = inject(BranchService);
  private branchRepo = inject(BranchRepository);

  async getSettings(branchId?: string): Promise<CompanySettings | null> {
    const tenantId = this.tenantService.getTenantId();
    const data = await firstValueFrom(this.tenantRepo.getById(tenantId));
    
    if (data) {
        let settings = {
            ...data,
            address: data.location || '',
            email: data.contact_email || '',
            phone: data.contact_phone || '',
            logo_url: data.branding_settings?.logo_url || ''
        } as CompanySettings;

        // Si tenemos un contexto de sucursal, sobreescribimos con los datos específicos
        if (branchId) {
            const branch = await firstValueFrom(this.branchRepo.getById(branchId));
            if (branch) {
                settings = {
                    ...settings,
                    name: (branch as any).official_name || branch.name,
                    location: branch.address || settings.location,
                    address: branch.address || settings.address,
                    contact_email: (branch as any).contact_email || settings.contact_email,
                    email: (branch as any).contact_email || settings.email,
                    contact_phone: (branch as any).contact_phone || settings.contact_phone,
                    phone: (branch as any).contact_phone || settings.phone,
                    tax_id: (branch as any).tax_id || settings.tax_id,
                    branding_settings: (branch as any).branding_settings || settings.branding_settings,
                    logo_url: (branch as any).branding_settings?.logo_url || settings.logo_url
                };
            }
        }
        return settings;
    }
    return data as CompanySettings | null;
  }

  async updateSettings(tenantId: string, updateData: Partial<CompanySettings>, branchId?: string): Promise<any> {
    if (branchId) {
        // Actualizamos la sucursal específica
        const branchPayload = {
            official_name: updateData.name,
            address: updateData.location,
            contact_email: updateData.contact_email,
            contact_phone: updateData.contact_phone,
            tax_id: updateData.tax_id,
            branding_settings: updateData.branding_settings
        };
        const updatedBranch = await firstValueFrom(this.branchRepo.update(branchId, branchPayload as any));
        
        // Sincronizar el estado del branchService si es la sucursal actual
        const currentBranch = this.branchService.currentBranch();
        if (currentBranch && currentBranch.id === branchId) {
            const freshBranch = await firstValueFrom(this.branchRepo.getById(branchId));
            if (freshBranch) {
                this.branchService.setCurrentBranch(freshBranch as any);
            }
        }
        return updatedBranch;
    }

    const updatedRows = await firstValueFrom(this.tenantRepo.update(tenantId, updateData as any));
    
    // Update the TenantService state so other components reflect the change
    const updatedTenant = await firstValueFrom(this.tenantRepo.getById(tenantId));
    
    if (updatedTenant) {
        this.tenantService.setTenant(updatedTenant as any);
    }
    
    return updatedRows;
  }
}
