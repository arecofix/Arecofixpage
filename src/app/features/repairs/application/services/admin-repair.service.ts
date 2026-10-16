import { Injectable, inject } from '@angular/core';
import { RepairRepository } from '../../domain/repositories/repair.repository';
import { Repair, CreateRepairDto, UpdateRepairDto, RepairStatus, RepairPart } from '../../domain/entities/repair.entity';
import { Observable, firstValueFrom } from 'rxjs';
import { User } from '@supabase/supabase-js';
import { AuthService } from '@app/core/services/auth.service';
import { IEventBus } from '@app/core/events/event-bus.interface';
import {
    RepairOrderReadyForInvoicingEvent,
    RepairOrderCancelledEvent,
    RepairOrderRolledBackEvent,
    RepairOrderItemSnapshot,
} from '../../domain/events/repair-order-ready-for-invoicing.event';
import { RepairOrderReadyForInvoicingEvent as DomainRepairOrderReadyForInvoicingEvent } from '@app/domain/events/repair-order-ready-for-invoicing.event';
import { RepairOrderDeliveredEvent } from '@app/domain/events/repair-order-delivered.event';
import { PaymentMethod } from '@app/domain/events/types/payment-method';
import { CustomerSnapshot } from '@app/domain/events/types/customer-snapshot';
import { RepairItemSnapshot } from '@app/domain/events/types/repair-item-snapshot';
import { RepairTotalsSnapshot } from '@app/domain/events/types/repair-totals-snapshot';
import { CustomerService } from '@app/features/customers/application/services/customer.service';
import { BranchContextService } from '@app/core/services/branch-context.service';
import { BranchService } from '@app/core/services/branch.service';
import { WhatsappService } from '@app/core/services/whatsapp.service';
import { RepairWorkflowService } from './repair-workflow.service';
import { ICustomerDeviceRepository } from '@app/features/devices/domain/repositories/customer-device.repository';
import { environment } from '@env/environment';

@Injectable({
    providedIn: 'root'
})
export class AdminRepairService {
    private repository = inject(RepairRepository);
    private auth = inject(AuthService);
    private eventBus = inject(IEventBus);
    private branchContextService = inject(BranchContextService);
    private branchService = inject(BranchService);
    private customerService = inject(CustomerService);
    private whatsappService = inject(WhatsappService);
    private repairWorkflowService = inject(RepairWorkflowService);
    private customerDeviceRepository = inject(ICustomerDeviceRepository);

    // Status logic
    private readonly STATUS_DELIVERED = RepairStatus.DELIVERED;
    private readonly STATUS_CANCELLED = RepairStatus.CANCELLED;

    async getById(id: string): Promise<Repair | null> {
        return firstValueFrom(this.repository.getById(id));
    }

    private async resolveCurrentUser(): Promise<User | null> {
        let user = this.auth.getCurrentUser();
        if (!user && typeof this.auth.waitForAuth === 'function') {
            const authState = await this.auth.waitForAuth();
            user = authState?.user || null;
        }
        if (!user && typeof this.auth.getUser === 'function') {
            user = await this.auth.getUser();
        }
        return user;
    }

    async getAdminList(limit?: number, offset?: number, searchTerm?: string): Promise<Repair[]> {
        const user = await this.resolveCurrentUser();
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

    async getWorkshopSummary(month?: number, year?: number): Promise<any> {
        const user = await this.resolveCurrentUser();
        if (!user) {
            return {
                inWorkshop: 0,
                readyToPickup: 0,
                pendingParts: 0,
                thisMonthProfit: 0
            };
        }

        const profile = await this.auth.getUserProfile(user.id);
        const contextBranchId = this.branchContextService.getBranchId();
        const branch_id = contextBranchId || profile?.branch_id;

        const isCentral = await this.isCentralBranch(branch_id);

        return firstValueFrom(this.repository.getWorkshopSummary(branch_id, isCentral, month, year));
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
        const user = await this.resolveCurrentUser();
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
            
            // Try to find existing first
            const existing = await this.customerService.findByEmailOrPhone(
                dto.customer_email || undefined,
                dto.customer_phone || undefined
            );

            let shouldReuse = false;
            if (existing) {
                if (dto.customer_email && existing.email === dto.customer_email) {
                    shouldReuse = true;
                } else if (dto.customer_phone && existing.phone === dto.customer_phone) {
                    const newName = (dto.customer_name || '').toLowerCase().trim();
                    const existingName = `${existing.first_name || ''} ${existing.last_name || ''}`.toLowerCase().trim();
                    
                    const newParts = newName.split(' ').filter((p: string) => p.length > 2);
                    if (newParts.length === 0 || newParts.some((p: string) => existingName.includes(p))) {
                        shouldReuse = true;
                    }
                }
            }

            if (shouldReuse && existing) {
                customerId = existing.id;
                // Actualizar datos si se editó un cliente existente
                const updateData: Record<string, unknown> = {};
                if (dto.customer_dni !== undefined) updateData['dni'] = dto.customer_dni || null;
                if (dto.customer_phone !== undefined) updateData['phone'] = dto.customer_phone || null;
                if (dto.customer_email !== undefined) updateData['email'] = dto.customer_email || null;
                
                if (dto.customer_name) {
                    const nameParts = dto.customer_name.trim().split(' ');
                    updateData['first_name'] = nameParts[0] || '';
                    updateData['last_name'] = nameParts.slice(1).join(' ') || '';
                }

                try {
                    if (Object.keys(updateData).length > 0) {
                        await this.customerService.update(customerId, updateData);
                    }
                } catch (err) {
                    console.error('[AdminRepairService] Error updating existing customer data:', err);
                }
            } else {
                const nameParts = dto.customer_name.trim().split(' ');
                const fn = nameParts[0] || '';
                const ln = nameParts.slice(1).join(' ') || '';

                try {
                    // This calls the RPC which MUST create the user in auth.users
                    const client = await this.customerService.create({
                        first_name: fn,
                        last_name: ln,
                        email: dto.customer_email || null,
                        phone: dto.customer_phone || null,
                        address: null,
                        dni: dto.customer_dni || null,
                        tenant_id: profile.tenant_id,
                        branch_id: branchIdActual
                    });

                    if (client && client.id) {
                        customerId = client.id;
                    } else {
                        throw new Error('El servicio no devolvió un ID de perfil válido.');
                    }
                } catch (error: unknown) {
                    console.error('💥 [AdminRepairService] Error creando cliente:', error);
                    const err = error as any;
                    
                    // Detailed handling for the new standalone architecture
                    if (err.code === '23503' || (err.message && err.message.includes('23503'))) {
                        throw new Error('Error de Integridad (23503): No se pudo vincular la reparación. Asegúrate de haber ejecutado los scripts SQL para habilitar la tabla de "clients" independiente.');
                    }
                    
                    if (err.status === 409 || err.code === '23505') {
                        throw new Error('Conflicto: El teléfono ya está registrado en el sistema. Intenta buscarlo en el selector de clientes.');
                    }

                    // For the custom error thrown by CustomerService (Edge Function failures)
                    if (err.message && err.message.includes('servidor al crear cliente')) {
                        throw new Error(err.message);
                    }

                    throw new Error(`Error en Registro: ${err.message || 'Error de comunicación con la base de datos'}`);
                }
            }
        }

        if (!customerId) {
            throw new Error('Integridad de Datos: No se pudo determinar un ID de cliente válido para la ficha.');
        }

        // 2.5 Resolve/Create Device
        let finalDeviceId = dto.device_id;
        if (dto.device_model) {
            let modelId: string | null = null;
            const modelName = dto.device_model.trim();
            const generatedSlug = modelName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'model-' + Math.random().toString(36).substring(2, 9);
            
            // Ensure model exists
            modelId = await firstValueFrom(this.customerDeviceRepository.ensureModelExists(modelName, generatedSlug, dto.brand_id));
            
            // Upsert device
            const savedDeviceId = await firstValueFrom(
                this.customerDeviceRepository.upsertDevice({
                    deviceId: finalDeviceId || null,
                    userId: customerId,
                    modelId: modelId,
                    type: dto.device_type,
                    imei: dto.imei,
                    passcode: dto.device_passcode,
                })
            );
            if (savedDeviceId) {
                finalDeviceId = savedDeviceId;
            }
        }

        // 3. Prepare DTO with metadata
        const workflowDto: CreateRepairDto = {
            ...dto,
            customer_id: customerId,
            device_id: finalDeviceId,
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

        if (!originalRepair) throw new Error('Reparación no encontrada');

        // Logic: Update customer info if changed
        if (originalRepair.customer_id) {
            const updateData: Record<string, unknown> = {};
            if (dto.customer_dni !== undefined) updateData['dni'] = dto.customer_dni || null;
            if (dto.customer_phone !== undefined) updateData['phone'] = dto.customer_phone || null;
            if (dto.customer_email !== undefined) updateData['email'] = dto.customer_email || null;
            
            if (dto.customer_name) {
                const nameParts = dto.customer_name.trim().split(' ');
                updateData['first_name'] = nameParts[0] || '';
                updateData['last_name'] = nameParts.slice(1).join(' ') || '';
            }

            try {
                if (Object.keys(updateData).length > 0) {
                    await this.customerService.update(originalRepair.customer_id, updateData);
                }
            } catch (err) {
                console.error('[AdminRepairService] Error updating existing customer data during repair update:', err);
            }
        }

        // Logic: Update device info if changed
        if (originalRepair.customer_id && dto.device_model) {
            let modelId: string | null = null;
            const modelName = dto.device_model.trim();
            const generatedSlug = modelName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'model-' + Math.random().toString(36).substring(2, 9);
            
            modelId = await firstValueFrom(this.customerDeviceRepository.ensureModelExists(modelName, generatedSlug, dto.brand_id));
            
            const savedDeviceId = await firstValueFrom(
                this.customerDeviceRepository.upsertDevice({
                    deviceId: originalRepair.device_id || null,
                    userId: originalRepair.customer_id,
                    modelId: modelId,
                    type: dto.device_type,
                    imei: dto.imei,
                    passcode: dto.device_passcode,
                })
            );
            if (savedDeviceId) {
                payload.device_id = savedDeviceId;
            }
        }

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

        // [EVENT-DRIVEN] Domain events for Invoicing and Lifecycle
        if (payload.current_status_id && originalRepair && originalRepair.current_status_id !== payload.current_status_id) {
            // 1. Transition to READY_FOR_PICKUP (5) -> Emit RepairOrderReadyForInvoicing
            if (payload.current_status_id === RepairStatus.READY_FOR_PICKUP) {
                await this.publishReadyForInvoicingEvent(originalRepair, payload);
            }
            // 2. Transition to CANCELLED (7) -> Emit RepairOrderCancelled
            else if (payload.current_status_id === RepairStatus.CANCELLED) {
                this.eventBus.publish(new RepairOrderCancelledEvent({
                    repairOrderId: id,
                    cancelledAt: new Date().toISOString(),
                    reason: 'Orden cancelada desde administración',
                    tenantId: originalRepair.tenant_id,
                }));
            }
            // 3. Rollback from READY_FOR_PICKUP to an earlier state -> Emit RepairOrderRolledBack
            else if (originalRepair.current_status_id === RepairStatus.READY_FOR_PICKUP && payload.current_status_id < RepairStatus.READY_FOR_PICKUP) {
                this.eventBus.publish(new RepairOrderRolledBackEvent({
                    repairOrderId: id,
                    previousStatusId: originalRepair.current_status_id,
                    newStatusId: payload.current_status_id,
                    rolledBackAt: new Date().toISOString(),
                    tenantId: originalRepair.tenant_id,
                }));
            }
            // 4. Transition to DELIVERED (6) -> Emit RepairOrderDeliveredEvent
            else if (payload.current_status_id === RepairStatus.DELIVERED) {
                const customerSnapshot: CustomerSnapshot = {
                    id: originalRepair.customer_id,
                    name: payload.customer_name ?? originalRepair.customer_name ?? 'Cliente de Taller',
                    taxId: payload.customer_dni ?? originalRepair.customer_dni,
                    phone: payload.customer_phone ?? originalRepair.customer_phone,
                    email: payload.customer_email ?? originalRepair.customer_email,
                };
                const totalPaid = Number(payload.final_cost ?? originalRepair.final_cost ?? 0);
                const methodMap: Record<string, PaymentMethod> = {
                    efectivo: 'cash',
                    transferencia: 'transfer',
                    tarjeta: 'card',
                    cash: 'cash',
                    transfer: 'transfer',
                    card: 'card',
                };
                const paymentMethod: PaymentMethod = methodMap[payload.payment_method ?? originalRepair.payment_method ?? ''] ?? 'cash';

                this.eventBus.publish(
                    new RepairOrderDeliveredEvent(
                        id,
                        customerSnapshot,
                        totalPaid,
                        paymentMethod,
                        new Date(),
                    )
                );
            }
        }
    }

    /**
     * Contextual trigger for manual invoice draft generation from UI button
     */
    async triggerInvoicingDraft(repairId: string): Promise<void> {
        const repair = await this.getById(repairId);
        if (!repair) throw new Error('Reparación no encontrada');
        await this.publishReadyForInvoicingEvent(repair, {});
    }

    private async publishReadyForInvoicingEvent(originalRepair: Repair, updatePayload: Partial<Repair>): Promise<void> {
        const laborCost = updatePayload.technical_labor_cost ?? originalRepair.technical_labor_cost ?? 0;
        const parts = originalRepair.parts || [];
        const partsCost = parts.reduce((acc, p) => acc + ((p.quantity || 1) * (p.unit_price_at_time || p.cost_at_time || 0)), 0);
        const surchargePercentage = updatePayload.surcharge_percentage ?? originalRepair.surcharge_percentage ?? 0;
        const subtotalPreSurcharge = laborCost + partsCost;
        const surchargeAmount = surchargePercentage > 0 ? (subtotalPreSurcharge * surchargePercentage / 100) : 0;
        const depositAmount = updatePayload.deposit_amount ?? originalRepair.deposit_amount ?? 0;
        const totalAmount = updatePayload.final_cost ?? originalRepair.final_cost ?? (subtotalPreSurcharge + surchargeAmount);
        const balanceDue = Math.max(0, totalAmount - depositAmount);

        const itemsSnapshot: RepairOrderItemSnapshot[] = [
            {
                type: 'labor',
                description: `Servicio Técnico: ${originalRepair.device_model || 'Equipo'} - ${originalRepair.issue_description?.substring(0, 100) || 'Reparación'}`,
                quantity: 1,
                unitPrice: laborCost,
                taxRate: 0.21,
                subtotal: laborCost,
                isLabor: true,
            },
            ...parts.map((p): RepairOrderItemSnapshot => ({
                id: p.id,
                productId: p.product_id,
                type: 'part',
                description: p.name || p.product_name || 'Repuesto',
                quantity: p.quantity || 1,
                unitPrice: p.unit_price_at_time || p.cost_at_time || 0,
                taxRate: 0.21,
                subtotal: (p.quantity || 1) * (p.unit_price_at_time || p.cost_at_time || 0),
                isLabor: false,
            })),
        ];

        this.eventBus.publish(new RepairOrderReadyForInvoicingEvent({
            repairOrderId: originalRepair.id,
            trackingCode: originalRepair.tracking_code,
            customerSnapshot: {
                customerId: originalRepair.customer_id,
                name: updatePayload.customer_name ?? originalRepair.customer_name ?? 'Cliente de Taller',
                taxId: updatePayload.customer_dni ?? originalRepair.customer_dni,
                phone: updatePayload.customer_phone ?? originalRepair.customer_phone,
                email: updatePayload.customer_email ?? originalRepair.customer_email,
            },
            itemsSnapshot,
            totalsSnapshot: {
                technicalLaborCost: laborCost,
                sparePartsCost: partsCost,
                surchargePercentage,
                surchargeAmount,
                depositAmount,
                totalAmount,
                balanceDue,
            },
            issuedAt: new Date().toISOString(),
            warranty: originalRepair.warranty,
            paymentMethod: updatePayload.payment_method ?? originalRepair.payment_method,
            notes: originalRepair.notes,
            technicalReport: originalRepair.technical_report || originalRepair.technician_notes,
            tenantId: originalRepair.tenant_id,
        }));

        const domainCustomer: CustomerSnapshot = {
            id: originalRepair.customer_id,
            name: updatePayload.customer_name ?? originalRepair.customer_name ?? 'Cliente de Taller',
            taxId: updatePayload.customer_dni ?? originalRepair.customer_dni,
            phone: updatePayload.customer_phone ?? originalRepair.customer_phone,
            email: updatePayload.customer_email ?? originalRepair.customer_email,
        };
        const domainItems: RepairItemSnapshot[] = itemsSnapshot.map((item) => ({
            description: item.description,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            itemType: item.isLabor ? 'labor' : 'part',
        }));
        const domainTotals: RepairTotalsSnapshot = {
            subtotal: subtotalPreSurcharge,
            surcharge: surchargeAmount,
            advancePayment: depositAmount,
            total: totalAmount,
        };
        const methodMap: Record<string, PaymentMethod> = {
            efectivo: 'cash',
            transferencia: 'transfer',
            tarjeta: 'card',
            cash: 'cash',
            transfer: 'transfer',
            card: 'card',
        };
        const domainPaymentMethod: PaymentMethod =
            methodMap[updatePayload.payment_method ?? originalRepair.payment_method ?? ''] ?? 'cash';

        this.eventBus.publish(
            new DomainRepairOrderReadyForInvoicingEvent(
                originalRepair.id,
                domainCustomer,
                domainItems,
                domainTotals,
                domainPaymentMethod,
                new Date(),
            )
        );
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
        const trackingUrl = `${baseUrl}/tracking/${repair.tracking_code}`;
        let message = '';
        
        const deviceName = (repair.brand_name ? repair.brand_name + ' ' : '') + (repair.device_model || 'Equipo');

        switch (event) {
            case 'RECIBIDO':
                message = `*Arecofix - Equipo Recibido*\n\nHola ${repair.customer_name}, recibimos su ${deviceName}. Podes seguir el estado de tu reparación en tiempo real aquí:\n\n${trackingUrl}\n\n¡Gracias por elegirnos!`;
                break;
            case 'READY':
                message = `*Arecofix - Su equipo está LISTO*\n\nHola ${repair.customer_name}, le informamos que su ${deviceName} ya se encuentra reparado y listo para retirar.\n\nPodes pasar por nuestra sucursal. No olvides presentar tu código de seguimiento: *${repair.tracking_code}*`;
                break;
            case 'DELIVERED':
                const reviewUrl = environment.contact.socialMedia.googleMaps;
                message = `*Arecofix - ¡Reparación Finalizada!*\n\nHola ${repair.customer_name}, fue un gusto ayudarte con tu ${deviceName}. Si estás conforme con nuestro servicio, nos ayudaría mucho que nos dejes una reseña en Google:\n\n${reviewUrl}\n\n¡Muchas gracias!`;
                break;
        }

        // Fire-and-forget: CORS will fail in local dev (localhost not in Edge Function allowlist).
        // This must never throw — it's a best-effort notification only.
        this.whatsappService.sendTextMessage(phone, message).subscribe({
            next: () => { /* console.log(`[WhatsApp] ✅ Notification sent for event: ${event}`) */ },
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
