import { Supplier, UpdateSupplierDto } from '../../domain/entities/supplier.entity';

export class SupplierMapper {
  private static readonly VALID_DB_COLUMNS = new Set<string>([
    'id',
    'tenant_id',
    'name',
    'contact_person',
    'email',
    'phone',
    'address',
    'city',
    'postal_code',
    'tax_id',
    'cuil',
    'rubro',
    'type',
    'notes',
    'is_active',
    'balance',
    'created_at',
    'updated_at'
  ]);

  /**
   * Safe Partial Update Mapper for Suppliers.
   * STRICT GUARANTEE: Never coerces missing/undefined fields to null.
   * Only includes fields explicitly provided in the partial DTO.
   */
  static mapUpdateToDb(dto: Partial<Supplier> | UpdateSupplierDto): Record<string, unknown> {
    const payload: Record<string, unknown> = {};
    const raw = dto as Record<string, unknown>;

    for (const key of Object.keys(raw)) {
      if (this.VALID_DB_COLUMNS.has(key) && raw[key] !== undefined) {
        payload[key] = raw[key];
      }
    }

    delete payload['id'];
    delete payload['tenant_id'];

    return payload;
  }
}
