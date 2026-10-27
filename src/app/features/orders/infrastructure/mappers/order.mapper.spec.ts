import { OrderMapper } from './order.mapper';
import { Order } from '../../domain/entities/order.entity';

describe('OrderMapper - Safe Partial Updates', () => {
  describe('mapUpdateToDb', () => {
    it('should return a payload with ONLY the single field when DTO has one field', () => {
      const dto: Partial<Order> = { status: 'paid' };
      const payload = OrderMapper.mapUpdateToDb(dto);

      expect(payload).toEqual({ status: 'paid' });
      expect(Object.keys(payload).length).toBe(1);
    });

    it('should return an empty payload when DTO is empty', () => {
      const dto: Partial<Order> = {};
      const payload = OrderMapper.mapUpdateToDb(dto);

      expect(payload).toEqual({});
      expect(Object.keys(payload).length).toBe(0);
    });

    it('should preserve explicit null when field is intentionally set to null', () => {
      const dto: Partial<Order> = {
        notes: null as unknown as string,
        tracking_code: null as unknown as string
      };
      const payload = OrderMapper.mapUpdateToDb(dto);

      expect(payload['notes']).toBeNull();
      expect(payload['tracking_code']).toBeNull();
      expect(Object.keys(payload).length).toBe(2);
    });

    it('should NOT include undefined fields in payload', () => {
      const dto: Partial<Order> = {
        status: 'shipped',
        customer_name: undefined,
        shipping_address: undefined,
        total: undefined
      };
      const payload = OrderMapper.mapUpdateToDb(dto);

      expect(payload).toEqual({ status: 'shipped' });
      expect('customer_name' in payload).toBe(false);
      expect('shipping_address' in payload).toBe(false);
      expect('total' in payload).toBe(false);
    });

    it('should include all provided fields when DTO contains multiple attributes', () => {
      const dto: Partial<Order> = {
        status: 'completed',
        subtotal: 1000,
        tax: 210,
        total: 1210,
        notes: 'Entregar por la tarde'
      };
      const payload = OrderMapper.mapUpdateToDb(dto);

      expect(payload['status']).toBe('completed');
      expect(payload['subtotal']).toBe(1000);
      expect(payload['tax']).toBe(210);
      expect(payload['total']).toBe(1210);
      expect(payload['total_amount']).toBe(1210);
      expect(payload['notes']).toBe('Entregar por la tarde');
    });

    it('should never coerce missing user_id or customer_id to null', () => {
      const dto: Partial<Order> = {
        status: 'processing'
      };
      const payload = OrderMapper.mapUpdateToDb(dto);

      expect('user_id' in payload).toBe(false);
      expect('customer_name' in payload).toBe(false);
      expect('customer_email' in payload).toBe(false);
      expect('shipping_address' in payload).toBe(false);
    });
  });
});
