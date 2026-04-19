import { Injectable, inject } from '@angular/core';
import { RepairRepository } from '../../domain/repositories/repair.repository';
import { Repair, CreateRepairDto, UpdateRepairDto, RepairStatus, RepairPart } from '../../domain/entities/repair.entity';
import { Observable, firstValueFrom } from 'rxjs';
import { AuthService } from '@app/core/services/auth.service';
import { InvoiceService } from '@app/features/sales/application/invoice.service';
import { CustomerService } from '@app/features/customers/application/services/customer.service';
import { BranchContextService } from '@app/core/services/branch-context.service';
import { BranchService } from '@app/core/services/branch.service';
import { WhatsappService } from '@app/core/services/whatsapp.service';
import { RepairWorkflowService } from './repair-workflow.service';
import { environment } from '@env/environment';

@Injectable({
    providedIn: 'root'
})
export class AdminRepairService {
    private repository = inject(RepairRepository);
    private auth = inject(AuthService);
    private invoiceService = inject(InvoiceService);
    private branchContextService = inject(BranchContextService);
    private branchService = inject(BranchService);
    private customerService = inject(CustomerService);
    private whatsappService = inject(WhatsappService);
    private repairWorkflowService = inject(RepairWorkflowService);

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
 
        // Logic: If the selected branch is "Central", we also want to see repairs without branch_id (legacy)
        const isCentral = await this.isCentralBranch(branch_id);
 
        return firstValueFrom(this.repository.getAdminList({ branch_id, includeOrphans: isCentral, limit, offset, searchTerm }));
    }

    async getWorkshopSummary(): Promise<any> {
        const user = this.auth.getCurrentUser();
        if (!user) throw new Error('Usuario no autenticado');

        const profile = await this.auth.getUserProfile(user.id);
        const contextBranchId = this.branchContextService.getBranchId();
        const branch_id = contextBranchId || profile?.branch_id;

        const isCentral = await this.isCentralBranch(branch_id);

        return firstValueFrom(this.repository.getWorkshopSummary(branch_id, isCentral));
    }

    private async isCentralBranch(branchId: string | undefined | null): Promise<boolean> {
        if (!branchId || branchId === '') return true; // Global context is considered Central/Arecofix
        try {
            // Check current branch first for performance
            const current = this.branchService.currentBranch();
            if (current && current.id === branchId) {
                return current.name?.toLowerCase().includes('central') || false;
            }
            // Fallback: search all
            const branches = await this.branchService.getAllAdminBranches();
            const branch = branches.find(b => b.id === branchId);
            return branch?.name?.toLowerCase().includes('central') || false;
        } catch {
            return false;
        }
    }

    async delete(id: string): Promise<void> {
        await firstValueFrom(this.repository.delete(id));
    }

    async create(dto: CreateRepairDto): Promise<Repair> {
        const user = this.auth.getCurrentUser();
        if (!user) throw new Error('Usuario no autenticado');

        const profile = await this.auth.getUserProfile(user.id);
        if (!profile) throw new Error('Perfil no encontrado');

        // 1. Resolve Branch with fallback logic (passing profile for better resolution)
        const branchIdActual = await this.branchService.resolveEffectiveBranchId(profile);
 
        if (!branchIdActual) {
             throw new Error('No se pudo determinar la sucursal activa para crear la reparación. Por favor selecciona una en el panel superior.');
        }

        // 2. Resolve/Create Customer (STRICT AUTH-LINKED MODE)
        let customerId = dto.customer_id;
        
        if (!customerId && dto.customer_name) {
            console.log('🔍 [AdminRepairService] Resolviendo cliente por email/teléfono...');
            
            // Try to find existing first
            const existing = await this.customerService.findByEmailOrPhone(
                (dto as any).customer_email || undefined,
                dto.customer_phone || undefined
            );

            if (existing) {
                console.log('✅ [AdminRepairService] Cliente existente encontrado:', existing.id);
                customerId = existing.id;
            } else {
                console.log('🆕 [AdminRepairService] Creando nuevo cliente vía RPC...');
                const nameParts = dto.customer_name.trim().split(' ');
                const fn = nameParts[0] || '';
                const ln = nameParts.slice(1).join(' ') || '';

                try {
                    // This calls the RPC which MUST create the user in auth.users
                    const client = await this.customerService.create({
                        first_name: fn,
                        last_name: ln,
                        email: (dto as any).customer_email || null,
                        phone: dto.customer_phone || null,
                        address: null,
                        dni: (dto as any).customer_dni || null,
                        tenant_id: profile.tenant_id
                    });

                    if (client && client.id) {
                        customerId = client.id;
                    } else {
                        throw new Error('El servicio no devolvió un ID de perfil válido.');
                    }
                } catch (error: any) {
                    console.error('💥 [AdminRepairService] Error creando cliente:', error);
                    
                    // Detailed handling for the new standalone architecture
                    if (error.code === '23503' || (error.message && error.message.includes('23503'))) {
                        throw new Error('Error de Integridad (23503): No se pudo vincular la reparación. Asegúrate de haber ejecutado los scripts SQL para habilitar la tabla de "clients" independiente.');
                    }
                    
                    if (error.status === 409 || error.code === '23505') {
                        throw new Error('Conflicto: El teléfono ya está registrado en el sistema. Intenta buscarlo en el selector de clientes.');
                    }

                    throw new Error(`Error en Registro: ${error.message || 'Error de comunicación con la base de datos'}`);
                }
            }
        }

        if (!customerId) {
            throw new Error('Integridad de Datos: No se pudo determinar un ID de cliente válido para la ficha.');
        }

        // 3. Prepare DTO with metadata
        const workflowDto: CreateRepairDto = {
            ...dto,
            customer_id: customerId,
            received_by: user.id,
            assigned_technician_id: dto.assigned_technician_id || user.id
        };

        // 4. Delegate to workflow
        const savedRepair = await this.repairWorkflowService.processNewRepair(
            workflowDto, 
            dto.deposit_amount || 0, 
            branchIdActual
        );

        // 5. [AUTOMATED NOTIFICATION] Equipo Recibido
        if (savedRepair.customer_phone) {
            this.sendRepairStatusWhatsApp(savedRepair, 'RECIBIDO');
        }

        return savedRepair;
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

        // [REFAC] Delegate to workflow service to handle stock reconciliation
        await this.repairWorkflowService.processUpdateRepair(id, payload);

        // [AUTOMATED NOTIFICATION] Status Change
        if (originalRepair && payload.current_status_id && originalRepair.current_status_id !== payload.current_status_id) {
            const currentRepair = { ...originalRepair, ...payload };
            if (currentRepair.customer_phone) {
                if (payload.current_status_id === RepairStatus.READY_FOR_PICKUP) {
                    this.sendRepairStatusWhatsApp(currentRepair as Repair, 'READY');
                } else if (payload.current_status_id === RepairStatus.DELIVERED) {
                    this.sendRepairStatusWhatsApp(currentRepair as Repair, 'DELIVERED');
                }
            }
        }

        // [USER-REQ-5] AUTOMATIC INVOICING TRIGGER
        // If status changed to DELIVERED and there is a total balance to pay, generate invoice.
        // We check if it WASN'T delivered before to avoid duplicate invoices on repetitive saves.
        if (payload.current_status_id === this.STATUS_DELIVERED && 
            originalRepair && 
            originalRepair.current_status_id !== this.STATUS_DELIVERED) {
            
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
                    console.error('Error al generar factura automática para la reparación', invoiceErr);
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

    private sendRepairStatusWhatsApp(repair: Repair, event: 'RECIBIDO' | 'READY' | 'DELIVERED') {
        if (!repair.customer_phone) return;
        
        // Clean phone number (remove non-digits, ensuring it's not a dummy number)
        const phone = repair.customer_phone.replace(/\D/g, '');
        if (phone.length < 10) return;

        const baseUrl = window.location.origin;
        const trackingUrl = `${baseUrl}/#/tracking/${repair.tracking_code}`;
        let message = '';

        switch (event) {
            case 'RECIBIDO':
                message = `📦 *Arecofix - Equipo Recibido*\n\nHola ${repair.customer_name}, recibimos su ${repair.device_model}. Podes seguir el estado de tu reparación en tiempo real aquí:\n\n🔗 ${trackingUrl}\n\n¡Gracias por elegirnos!`;
                break;
            case 'READY':
                message = `✅ *Arecofix - Su equipo está LISTO*\n\nHola ${repair.customer_name}, le informamos que su ${repair.device_model} ya se encuentra reparado y listo para retirar.\n\n📍 Podes pasar por nuestra sucursal. No olvides presentar tu código de seguimiento: *${repair.tracking_code}*`;
                break;
            case 'DELIVERED':
                const reviewUrl = environment.contact.socialMedia.googleMaps;
                message = `🌟 *Arecofix - ¡Reparación Finalizada!*\n\nHola ${repair.customer_name}, fue un gusto ayudarte con tu ${repair.device_model}. Si estás conforme con nuestro servicio, nos ayudaría mucho que nos dejes una reseña en Google:\n\n⭐⭐⭐⭐⭐\n🔗 ${reviewUrl}\n\n¡Muchas gracias!`;
                break;
        }

        // Fire-and-forget: CORS will fail in local dev (localhost not in Edge Function allowlist).
        // This must never throw — it's a best-effort notification only.
        this.whatsappService.sendTextMessage(phone, message).subscribe({
            next: () => console.log(`[WhatsApp] ✅ Notification sent for event: ${event}`),
            error: (err) => {
                // Dev-only: CORS is expected on localhost. Suppress noise in prod too —
                // WhatsApp notification failure should never break the repair workflow.
                if (err?.status !== 0) {
                    console.warn(`[WhatsApp] Notification skipped (${event}):`, err?.message ?? err);
                }
            }
        });
    }
}
