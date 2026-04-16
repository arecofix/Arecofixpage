import { Injectable, inject } from '@angular/core';
import { RepairRepository } from '../../domain/repositories/repair.repository';
import { Repair, CreateRepairDto, UpdateRepairDto, RepairStatus, RepairPart } from '../../domain/entities/repair.entity';
import { Observable, firstValueFrom } from 'rxjs';
import { AuthService } from '@app/core/services/auth.service';
import { InvoiceService } from '@app/features/sales/application/invoice.service';
import { CustomerService } from '@app/features/customers/application/services/customer.service';
import { BranchContextService } from '@app/core/services/branch-context.service';

@Injectable({
    providedIn: 'root'
})
export class AdminRepairService {
    private repository = inject(RepairRepository);
    private auth = inject(AuthService);
    private invoiceService = inject(InvoiceService);
    private branchContextService = inject(BranchContextService);
    private customerService = inject(CustomerService);

    // Status logic
    private readonly STATUS_DELIVERED = RepairStatus.DELIVERED;
    private readonly STATUS_CANCELLED = RepairStatus.CANCELLED;

    async getById(id: string): Promise<Repair | null> {
        return firstValueFrom(this.repository.getById(id));
    }

    async getAdminList(limit?: number, offset?: number, searchTerm?: string): Promise<Repair[]> {
        const user = this.auth.getCurrentUser();
        if (!user) throw new Error('Usuario no autenticado');
 
        const profile = await this.auth.getUserProfile(user.id);
        
        // Priority: 
        // 1. Global context from sidebar (SuperAdmins)
        // 2. Fixed branch from profile (Staff)
        const contextBranchId = this.branchContextService.getBranchId();
        const branch_id = contextBranchId || profile?.branch_id;
 
        return firstValueFrom(this.repository.getAdminList({ branch_id, limit, offset, searchTerm }));
    }

    async getWorkshopSummary(): Promise<any> {
        const user = this.auth.getCurrentUser();
        if (!user) throw new Error('Usuario no autenticado');

        const profile = await this.auth.getUserProfile(user.id);
        const contextBranchId = this.branchContextService.getBranchId();
        const branch_id = contextBranchId || profile?.branch_id;

        return firstValueFrom(this.repository.getWorkshopSummary(branch_id));
    }

    async delete(id: string): Promise<void> {
        await firstValueFrom(this.repository.delete(id));
    }

    async create(dto: CreateRepairDto): Promise<Repair> {
        const user = this.auth.getCurrentUser();
        if (!user) throw new Error('Usuario no autenticado');

        const profile = await this.auth.getUserProfile(user.id);
        if (!profile) throw new Error('Perfil no encontrado');

        let customerId = dto.customer_id;

        // [LOGIC] Silent Client Creation
        if (!customerId && dto.customer_name) {
            try {
                const nameParts = dto.customer_name.trim().split(' ');
                const fn = nameParts[0] || '';
                const ln = nameParts.slice(1).join(' ') || '';

                const newClient = await this.customerService.create({
                    first_name: fn,
                    last_name: ln,
                    email: (dto as any).customer_email || null,
                    phone: dto.customer_phone || null,
                    address: null,
                    dni: (dto as any).customer_dni || null
                });

                if (newClient && newClient.id) {
                    customerId = newClient.id;
                }
            } catch (clientErr) {
                console.warn('[AdminRepairService] Failed to create client automatically:', clientErr);
            }
        }

        const payload: any = {
            ...dto,
            customer_id: customerId,
            branch_id: profile.branch_id,
            received_by: user.id,
            assigned_technician_id: dto.assigned_technician_id || user.id,
            tracking_code: this.generateTrackingCode()
        };

        // Logic: Set completed_at if status is final
        if (payload.current_status_id && this.isFinalStatus(payload.current_status_id)) {
            payload.completed_at = new Date().toISOString();
        }

        return firstValueFrom(this.repository.create(payload));
    }

    async update(id: string, dto: UpdateRepairDto): Promise<void> {
        const payload = { ...dto };
        const originalRepair = await this.getById(id);

        // Logic: Set completed_at if status changes to final
        if (payload.current_status_id && this.isFinalStatus(payload.current_status_id)) {
            if (!payload.completed_at) {
                payload.completed_at = new Date().toISOString();
            }
        }

        await firstValueFrom(this.repository.update(id, payload));

        // [USER-REQ-5] AUTOMATIC INVOICING TRIGGER
        // If status changed to DELIVERED and there is a total balance to pay, generate invoice.
        if (payload.current_status_id === this.STATUS_DELIVERED && originalRepair) {
            const totalToInvoice = payload.final_cost ?? originalRepair.final_cost;
            
            if (totalToInvoice && totalToInvoice > 0) {
                try {
                    await this.invoiceService.generateInvoice({
                        customer_id: originalRepair.customer_id,
                        customer_name: originalRepair.customer_name || 'Cliente Taller',
                        type: 'B',
                        origin: 'repair',
                        repair_id: id as any,
                        subtotal: totalToInvoice,
                        tax_amount: 0,
                        discount: 0,
                        total_amount: totalToInvoice,
                        notes: `Liquidación de Reparación #${originalRepair.tracking_code}`,
                        items: [
                            {
                                description: `Servicio Técnico: ${originalRepair.device_model || 'Equipo'} - ${originalRepair.issue_description?.substring(0, 50)}...`,
                                quantity: 1,
                                unit_price: totalToInvoice,
                                tax_rate: 0,
                                subtotal: totalToInvoice,
                                total: totalToInvoice
                            }
                        ]
                    } as any);
                } catch (invoiceErr) {
                    // We don't block the repair update if invoice fails, but we log it.
                    console.error('Failed to generate automated invoice for repair', invoiceErr);
                }
            }
        }
    }

    async uploadImage(file: File): Promise<string> {
        return this.repository.uploadImage(file);
    }

    private generateTrackingCode(): string {
        return Math.random().toString(36).substring(2, 10).toUpperCase() + '-' + Date.now().toString(36).toUpperCase();
    }

    private isFinalStatus(statusId: number): boolean {
        return statusId === this.STATUS_DELIVERED || statusId === this.STATUS_CANCELLED;
    }
}
