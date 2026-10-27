import { SupplierMapper } from './supplier.mapper';
import { Supplier } from '../../domain/entities/supplier.entity';

describe('SupplierMapper - Safe Partial Updates', () => {
  describe('mapUpdateToDb', () => {
    it('should return a payload with ONLY the single field when DTO has one field', () => {
      const dto: Partial<Supplier> = { name: 'Distribuidora Central' };
      const payload = SupplierMapper.mapUpdateToDb(dto);

      expect(payload).toEqual({ name: 'Distribuidora Central' });
      expect(Object.keys(payload).length).toBe(1);
    });

    it('should return an empty payload when DTO is empty', () => {
      const dto: Partial<Supplier> = {};
      const payload = SupplierMapper.mapUpdateToDb(dto);

      expect(payload).toEqual({});
      expect(Object.keys(payload).length).toBe(0);
    });

    it('should preserve explicit null when field is intentionally set to null', () => {
      const dto: Partial<Supplier> = {
        email: null as unknown as string,
        phone: null as unknown as string
      };
      const payload = SupplierMapper.mapUpdateToDb(dto);

      expect(payload['email']).toBeNull();
      expect(payload['phone']).toBeNull();
      expect(Object.keys(payload).length).toBe(2);
    });

    it('should NOT include undefined fields in payload', () => {
      const dto: Partial<Supplier> = {
        name: 'Mayorista Sur',
        contact_person: undefined,
        address: undefined,
        balance: undefined
      };
      const payload = SupplierMapper.mapUpdateToDb(dto);

      expect(payload).toEqual({ name: 'Mayorista Sur' });
      expect('contact_person' in payload).toBe(false);
      expect('address' in payload).toBe(false);
      expect('balance' in payload).toBe(false);
    });

    it('should include all provided fields when DTO contains multiple attributes', () => {
      const dto: Partial<Supplier> = {
        name: 'Tech Parts SA',
        email: 'ventas@techparts.com',
        phone: '1122334455',
        tax_id: '30-12345678-9',
        is_active: true,
        balance: 150000
      };
      const payload = SupplierMapper.mapUpdateToDb(dto);

      expect(payload['name']).toBe('Tech Parts SA');
      expect(payload['email']).toBe('ventas@techparts.com');
      expect(payload['phone']).toBe('1122334455');
      expect(payload['tax_id']).toBe('30-12345678-9');
      expect(payload['is_active']).toBe(true);
      expect(payload['balance']).toBe(150000);
      expect(Object.keys(payload).length).toBe(6);
    });

    it('should strip primary keys (id, tenant_id) from update payload', () => {
      const dto: Partial<Supplier> = {
        id: 'supp-123',
        tenant_id: 'tenant-456',
        is_active: false
      };
      const payload = SupplierMapper.mapUpdateToDb(dto);

      expect(payload).toEqual({ is_active: false });
      expect('id' in payload).toBe(false);
      expect('tenant_id' in payload).toBe(false);
    });
  });
});
