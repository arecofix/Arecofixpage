import { Repair, CreateRepairDto, UpdateRepairDto, RepairPart, RepairChecklist } from '../../domain/entities/repair.entity';

/**
 * Mapper for Repair Orders / Workshop entities.
 * Decouples Supabase DB table structure (public.repairs) from domain entity (Repair).
 *
 * CRITICAL ARCHITECTURAL GUARANTEE:
 * 1. mapFromDb always extracts foreign keys (device_id, client_id) to prevent state loss on read.
 * 2. mapUpdateToDb only includes fields that are explicitly defined (!== undefined),
 *    preventing partial updates from overwriting untouched DB columns with null.
 */
export class RepairOrderMapper {
    /**
     * Set of columns strictly valid in public.repairs table.
     */
    public static readonly VALID_DB_COLUMNS = new Set<string>([
        'client_id',
        'device_id',
        'issue_description',
        'current_status_id',
        'estimated_cost',
        'final_cost',
        'deposit_amount',
        'technical_labor_cost',
        'technician_notes',
        'technical_report',
        'completed_at',
        'branch_id',
        'received_by',
        'assigned_technician_id',
        'checklist',
        'security_pin',
        'security_pattern',
        'glass_upsell',
        'spare_part_cost',
        'whatsapp_notifications',
        'supplier_id',
        'warranty'
    ]);

    /**
     * Maps database row with joined relations to Domain Repair entity.
     */
    public static mapFromDb(p: Record<string, unknown>): Repair {
        const client = p['client'] as Record<string, unknown> | null;
        const device = p['device'] as Record<string, unknown> | null;
        const model = device?.['model'] as Record<string, unknown> | null;
        const brand = model?.['brand'] as Record<string, unknown> | null;
        const rawImages = p['images'] as { image_url: string }[] | null;
        const rawParts = p['parts'] as (RepairPart & { product?: { name?: string }; name?: string; product_name?: string })[] | null;

        const resolvedDeviceId = (p['device_id'] as string) || (device?.['id'] as string) || undefined;
        const resolvedClientId = (p['client_id'] as string) || (client?.['id'] as string) || undefined;

        return {
            id: p['id'] as string,
            tracking_code: p['tracking_code'] as string,
            customer_id: resolvedClientId,
            client_id: resolvedClientId,
            device_id: resolvedDeviceId,
            customer_name: client ? `${client['first_name'] || ''} ${client['last_name'] || ''}`.trim() : (p['customer_name'] as string || ''),
            customer_phone: (client?.['phone'] as string) || (p['customer_phone'] as string),
            customer_dni: (client?.['dni'] as string) || (p['customer_dni'] as string) || undefined,
            device_type: (device?.['type'] as string) || (p['device_type'] as string) || 'smartphone',
            brand_id: (device?.['brand_id'] as string) || (model?.['brand_id'] as string) || (p['brand_id'] as string),
            brand_name: (brand?.['name'] as string) || ((p['brand'] as Record<string, unknown>)?.['name'] as string) || (p['device_brand'] as string) || undefined,
            device_model: (model?.['name'] as string) || (p['device_model'] as string) || '',
            imei: (device?.['imei'] as string) || (p['imei'] as string),
            repair_number: p['repair_number'] as number,
            issue_description: p['issue_description'] as string,
            current_status_id: Number(p['current_status_id'] || 1),
            estimated_cost: Number(p['estimated_cost'] || 0),
            final_cost: Number(p['final_cost'] || 0),
            deposit_amount: Number(p['deposit_amount'] || 0),
            technical_labor_cost: Number(p['technical_labor_cost'] || 0),
            notes: (p['technician_notes'] as string) || (p['notes'] as string) || '',
            technician_notes: (p['technician_notes'] as string) || '',
            technical_report: (p['technical_report'] as string) || '',
            received_at: p['received_at'] as string,
            created_at: p['created_at'] as string,
            updated_at: p['updated_at'] as string,
            completed_at: p['completed_at'] as string,
            images: rawImages?.map((img: { image_url: string }) => img.image_url) || [],
            parts: rawParts?.map((part) => ({
                ...part,
                name: part.product?.name || part.name || part.product_name || 'Repuesto (Sin nombre)',
                product_name: part.product?.name || part.name || part.product_name || 'Repuesto (Sin nombre)'
            })) || [],
            branch_id: p['branch_id'] as string,
            received_by: p['received_by'] as string,
            assigned_technician_id: p['assigned_technician_id'] as string,
            checklist: (p['checklist'] || {}) as RepairChecklist,
            security_pin: p['security_pin'] as string,
            security_pattern: p['security_pattern'] as string,
            device_passcode: (device?.['passcode'] as string) || (p['device_passcode'] as string),
            glass_upsell: Boolean(p['glass_upsell']),
            spare_part_cost: Number(p['spare_part_cost'] || 0),
            whatsapp_notifications: p['whatsapp_notifications'] !== false,
            supplier_id: (p['supplier_id'] as string) || undefined,
            warranty: (p['warranty'] as string) || undefined,
            tenant_id: p['tenant_id'] as string
        };
    }

    /**
     * Maps full entity / DTO to DB format for creation.
     */
    public static mapCreateToDb(dto: CreateRepairDto | Record<string, unknown>): Record<string, unknown> {
        const r = dto as Record<string, unknown>;
        return {
            client_id: r['customer_id'] || r['client_id'] || null,
            customer_name: r['customer_name'] || null,
            customer_phone: r['customer_phone'] || null,
            customer_email: r['customer_email'] || null,
            customer_dni: r['customer_dni'] || null,
            device_id: r['device_id'] || null,
            device_model: r['device_model'] || null,
            device_type: r['device_type'] || null,
            brand_id: r['brand_id'] || null,
            imei: r['imei'] || null,
            issue_description: r['issue_description'],
            current_status_id: r['current_status_id'],
            estimated_cost: r['estimated_cost'] !== undefined ? Number(r['estimated_cost']) : 0,
            final_cost: r['final_cost'] !== undefined ? Number(r['final_cost']) : 0,
            deposit_amount: r['deposit_amount'] !== undefined ? Number(r['deposit_amount']) : 0,
            technical_labor_cost: r['technical_labor_cost'] !== undefined ? Number(r['technical_labor_cost']) : 0,
            technician_notes: r['technician_notes'] || r['notes'] || null,
            technical_report: r['technical_report'] || null,
            completed_at: r['completed_at'] || null,
            branch_id: r['branch_id'] || null,
            received_by: r['received_by'] || null,
            assigned_technician_id: r['assigned_technician_id'] || null,
            checklist: r['checklist'] || {},
            security_pin: r['security_pin'] || null,
            security_pattern: r['security_pattern'] || null,
            glass_upsell: r['glass_upsell'] || false,
            spare_part_cost: r['spare_part_cost'] !== undefined ? Number(r['spare_part_cost']) : 0,
            whatsapp_notifications: r['whatsapp_notifications'] ?? true,
            supplier_id: r['supplier_id'] || null,
            warranty: r['warranty'] || null
        };
    }

    /**
     * Maps partial update DTO to DB payload.
     * GUARANTEE: Does NOT default omitted properties to null. Only properties
     * explicitly provided (!== undefined) are included in the returned payload.
     */
    public static mapUpdateToDb(dto: Partial<Repair> | UpdateRepairDto | Record<string, unknown>): Record<string, unknown> {
        const r = dto as Record<string, unknown>;
        const dbPayload: Record<string, unknown> = {};

        // client_id
        if (r['customer_id'] !== undefined) {
            dbPayload['client_id'] = r['customer_id'];
        } else if (r['client_id'] !== undefined) {
            dbPayload['client_id'] = r['client_id'];
        }

        // device_id: CRITICAL - never coerce undefined to null
        if (r['device_id'] !== undefined) {
            dbPayload['device_id'] = r['device_id'];
        }

        if (r['issue_description'] !== undefined) {
            dbPayload['issue_description'] = r['issue_description'];
        }

        if (r['current_status_id'] !== undefined) {
            dbPayload['current_status_id'] = Number(r['current_status_id']);
        }

        if (r['estimated_cost'] !== undefined) {
            dbPayload['estimated_cost'] = Number(r['estimated_cost']);
        }

        if (r['final_cost'] !== undefined) {
            dbPayload['final_cost'] = Number(r['final_cost']);
        }

        if (r['deposit_amount'] !== undefined) {
            dbPayload['deposit_amount'] = Number(r['deposit_amount']);
        }

        if (r['technical_labor_cost'] !== undefined) {
            dbPayload['technical_labor_cost'] = Number(r['technical_labor_cost']);
        }

        if (r['technician_notes'] !== undefined) {
            dbPayload['technician_notes'] = r['technician_notes'];
        } else if (r['notes'] !== undefined) {
            dbPayload['technician_notes'] = r['notes'];
        }

        if (r['technical_report'] !== undefined) {
            dbPayload['technical_report'] = r['technical_report'];
        }

        if (r['completed_at'] !== undefined) {
            dbPayload['completed_at'] = r['completed_at'];
        }

        if (r['branch_id'] !== undefined) {
            dbPayload['branch_id'] = r['branch_id'];
        }

        if (r['received_by'] !== undefined) {
            dbPayload['received_by'] = r['received_by'];
        }

        if (r['assigned_technician_id'] !== undefined) {
            dbPayload['assigned_technician_id'] = r['assigned_technician_id'];
        }

        if (r['checklist'] !== undefined) {
            dbPayload['checklist'] = r['checklist'];
        }

        if (r['security_pin'] !== undefined) {
            dbPayload['security_pin'] = r['security_pin'];
        }

        if (r['security_pattern'] !== undefined) {
            dbPayload['security_pattern'] = r['security_pattern'];
        }

        if (r['glass_upsell'] !== undefined) {
            dbPayload['glass_upsell'] = Boolean(r['glass_upsell']);
        }

        if (r['spare_part_cost'] !== undefined) {
            dbPayload['spare_part_cost'] = Number(r['spare_part_cost']);
        }

        if (r['whatsapp_notifications'] !== undefined) {
            dbPayload['whatsapp_notifications'] = Boolean(r['whatsapp_notifications']);
        }

        if (r['supplier_id'] !== undefined) {
            dbPayload['supplier_id'] = r['supplier_id'];
        }

        if (r['warranty'] !== undefined) {
            dbPayload['warranty'] = r['warranty'];
        }

        return dbPayload;
    }
}
