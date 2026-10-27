import { RepairOrderMapper } from './repair-order.mapper';
import { CreateRepairDto, UpdateRepairDto } from '../../domain/entities/repair.entity';

describe('RepairOrderMapper (Pure Unit Tests)', () => {
    describe('mapFromDb', () => {
        it('should map device_id and client_id from database row and relations', () => {
            const rawRow = {
                id: 'rep-uuid-1',
                tracking_code: 'AF-101',
                client_id: 'cust-uuid-1',
                device_id: 'dev-uuid-1',
                client: {
                    id: 'cust-uuid-1',
                    first_name: 'Juan',
                    last_name: 'Pérez',
                    phone: '1122334455',
                    email: 'juan@example.com',
                    dni: '30111222'
                },
                device: {
                    id: 'dev-uuid-1',
                    type: 'smartphone',
                    imei: '358765432109876',
                    passcode: '1234',
                    model: {
                        name: 'Samsung Galaxy S21',
                        brand_id: 'brand-samsung',
                        brand: { name: 'Samsung' }
                    }
                },
                repair_number: 101,
                issue_description: 'Pantalla rota',
                current_status_id: 1,
                estimated_cost: 45000,
                final_cost: 45000,
                deposit_amount: 10000,
                technical_labor_cost: 20000,
                technician_notes: 'Revisión en taller',
                technical_report: 'Cambio de módulo',
                received_at: '2026-10-10T10:00:00Z',
                created_at: '2026-10-10T10:00:00Z',
                updated_at: '2026-10-10T11:00:00Z',
                completed_at: null,
                images: [{ image_url: 'https://example.com/img1.jpg' }],
                parts: [],
                branch_id: 'branch-1',
                received_by: 'tech-1',
                assigned_technician_id: 'tech-2',
                checklist: { charger: true, battery: true, chip: false, sd: false, case: true },
                security_pin: '1234',
                glass_upsell: false,
                spare_part_cost: 25000,
                whatsapp_notifications: true,
                supplier_id: 'supp-1',
                warranty: '3 meses',
                tenant_id: 'tenant-1'
            };

            const domain = RepairOrderMapper.mapFromDb(rawRow);

            expect(domain.id).toBe('rep-uuid-1');
            expect(domain.device_id).toBe('dev-uuid-1');
            expect(domain.client_id).toBe('cust-uuid-1');
            expect(domain.customer_id).toBe('cust-uuid-1');
            expect(domain.device_model).toBe('Samsung Galaxy S21');
            expect(domain.customer_name).toBe('Juan Pérez');
            expect(domain.customer_phone).toBe('1122334455');
            expect(domain.technician_notes).toBe('Revisión en taller');
            expect(domain.warranty).toBe('3 meses');
            expect(domain.supplier_id).toBe('supp-1');
        });

        it('should fallback device_id and client_id if root columns are absent but joined objects exist', () => {
            const rawRow = {
                id: 'rep-uuid-2',
                tracking_code: 'AF-102',
                client: { id: 'cust-uuid-2', first_name: 'María' },
                device: {
                    id: 'dev-uuid-2',
                    model: { name: 'iPhone 13 Pro' }
                },
                current_status_id: 2
            };

            const domain = RepairOrderMapper.mapFromDb(rawRow as any);

            expect(domain.device_id).toBe('dev-uuid-2');
            expect(domain.client_id).toBe('cust-uuid-2');
            expect(domain.customer_id).toBe('cust-uuid-2');
            expect(domain.device_model).toBe('iPhone 13 Pro');
        });
    });

    describe('mapUpdateToDb (Defensive Partial Updates)', () => {
        it('CRITICAL: should NOT include device_id or other untouched fields when updating only status', () => {
            const partialUpdate: UpdateRepairDto = {
                current_status_id: 3
            };

            const dbPayload = RepairOrderMapper.mapUpdateToDb(partialUpdate);

            expect(dbPayload).toEqual({
                current_status_id: 3
            });

            // Must NOT contain device_id or client_id as null!
            expect('device_id' in dbPayload).toBe(false);
            expect('client_id' in dbPayload).toBe(false);
            expect('security_pin' in dbPayload).toBe(false);
            expect('warranty' in dbPayload).toBe(false);
            expect('supplier_id' in dbPayload).toBe(false);
            expect('glass_upsell' in dbPayload).toBe(false);
            expect('spare_part_cost' in dbPayload).toBe(false);
        });

        it('CRITICAL: should NOT overwrite device_id with null if device_id is undefined', () => {
            const partialUpdate: UpdateRepairDto = {
                current_status_id: 4,
                technician_notes: 'Pruebas de calidad superadas',
                final_cost: 50000
            };

            const dbPayload = RepairOrderMapper.mapUpdateToDb(partialUpdate);

            expect(dbPayload['device_id']).toBeUndefined();
            expect(dbPayload['current_status_id']).toBe(4);
            expect(dbPayload['technician_notes']).toBe('Pruebas de calidad superadas');
            expect(dbPayload['final_cost']).toBe(50000);
        });

        it('should correctly include device_id when explicitly updated', () => {
            const partialUpdate: UpdateRepairDto = {
                device_id: 'dev-new-uuid-999'
            };

            const dbPayload = RepairOrderMapper.mapUpdateToDb(partialUpdate);

            expect(dbPayload['device_id']).toBe('dev-new-uuid-999');
        });

        it('should map notes to technician_notes if technician_notes is not set', () => {
            const partialUpdate: Partial<CreateRepairDto> = {
                notes: 'Nota técnica heredada'
            };

            const dbPayload = RepairOrderMapper.mapUpdateToDb(partialUpdate);

            expect(dbPayload['technician_notes']).toBe('Nota técnica heredada');
        });

        it('should return empty payload when DTO is empty', () => {
            const dbPayload = RepairOrderMapper.mapUpdateToDb({});
            expect(dbPayload).toEqual({});
            expect(Object.keys(dbPayload).length).toBe(0);
        });

        it('should preserve explicit null when field is intentionally set to null', () => {
            const dbPayload = RepairOrderMapper.mapUpdateToDb({
                security_pin: null,
                supplier_id: null,
                warranty: null
            });

            expect(dbPayload['security_pin']).toBeNull();
            expect(dbPayload['supplier_id']).toBeNull();
            expect(dbPayload['warranty']).toBeNull();
            expect(Object.keys(dbPayload).length).toBe(3);
        });
    });

    describe('mapCreateToDb', () => {
        it('should map all fields with proper defaults for new repairs', () => {
            const createDto: CreateRepairDto = {
                customer_id: 'cust-1',
                device_id: 'dev-1',
                device_type: 'smartphone',
                device_model: 'iPhone 13',
                issue_description: 'Batería degradada',
                current_status_id: 1,
                estimated_cost: 30000
            };

            const dbPayload = RepairOrderMapper.mapCreateToDb(createDto);

            expect(dbPayload['client_id']).toBe('cust-1');
            expect(dbPayload['device_id']).toBe('dev-1');
            expect(dbPayload['issue_description']).toBe('Batería degradada');
            expect(dbPayload['current_status_id']).toBe(1);
            expect(dbPayload['estimated_cost']).toBe(30000);
            expect(dbPayload['final_cost']).toBe(0);
        });
    });
});
