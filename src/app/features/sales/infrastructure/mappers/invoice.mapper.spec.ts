import { InvoiceMapper } from './invoice.mapper';
import { Invoice } from '../../domain/entities/invoice.entity';

describe('InvoiceMapper - Safe Partial Updates', () => {
  describe('mapUpdateToDb', () => {
    it('should return a payload with ONLY the single field when DTO has one field', () => {
      const dto: Partial<Invoice> = { notes: 'Cliente pagó en efectivo' };
      const payload = InvoiceMapper.mapUpdateToDb(dto);

      expect(payload).toEqual({ notes: 'Cliente pagó en efectivo' });
      expect(Object.keys(payload).length).toBe(1);
    });

    it('should return an empty payload when DTO is empty', () => {
      const dto: Partial<Invoice> = {};
      const payload = InvoiceMapper.mapUpdateToDb(dto);

      expect(payload).toEqual({});
      expect(Object.keys(payload).length).toBe(0);
    });

    it('should preserve explicit null when field is intentionally set to null', () => {
      const dto: Partial<Invoice> = {
        notes: null as unknown as string,
        pdf_url: null as unknown as string
      };
      const payload = InvoiceMapper.mapUpdateToDb(dto);

      expect(payload['notes']).toBeNull();
      expect(payload['pdf_url']).toBeNull();
      expect(Object.keys(payload).length).toBe(2);
    });

    it('should NOT include undefined fields in payload', () => {
      const dto: Partial<Invoice> = {
        status: 'cancelled',
        customer_name: undefined,
        total_amount: undefined,
        items: undefined
      };
      const payload = InvoiceMapper.mapUpdateToDb(dto);

      expect(payload).toEqual({ status: 'cancelled' });
      expect('customer_name' in payload).toBe(false);
      expect('total_amount' in payload).toBe(false);
      expect('items' in payload).toBe(false);
    });

    it('should include all provided fields when DTO contains multiple attributes', () => {
      const dto: Partial<Invoice> = {
        status: 'paid',
        payment_method: 'transfer',
        balance_due: 0,
        advance_payment: 50000,
        internal_notes: 'Verificado por administración'
      };
      const payload = InvoiceMapper.mapUpdateToDb(dto);

      expect(payload['status']).toBe('paid');
      expect(payload['payment_method']).toBe('transfer');
      expect(payload['balance_due']).toBe(0);
      expect(payload['advance_payment']).toBe(50000);
      expect(payload['internal_notes']).toBe('Verificado por administración');
      expect(Object.keys(payload).length).toBe(5);
    });

    it('should strip primary keys (id, tenant_id) from update payload', () => {
      const dto: Partial<Invoice> = {
        id: 'inv-uuid-1',
        tenant_id: 'tenant-uuid-1',
        status: 'paid'
      };
      const payload = InvoiceMapper.mapUpdateToDb(dto);

      expect(payload).toEqual({ status: 'paid' });
      expect('id' in payload).toBe(false);
      expect('tenant_id' in payload).toBe(false);
    });
  });
});
