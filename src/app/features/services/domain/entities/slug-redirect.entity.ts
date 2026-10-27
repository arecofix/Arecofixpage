export interface SlugRedirectProps {
  id: string;
  tenant_id?: string;
  entity_type: 'service' | 'post';
  entity_id: string;
  old_slug: string;
  new_slug: string;
  created_at?: string;
}

export class SlugRedirect {
  readonly id: string;
  readonly tenantId?: string;
  readonly entityType: 'service' | 'post';
  readonly entityId: string;
  readonly oldSlug: string;
  readonly newSlug: string;
  readonly createdAt: string;

  constructor(props: SlugRedirectProps) {
    this.id = props.id;
    this.tenantId = props.tenant_id;
    this.entityType = props.entity_type;
    this.entityId = props.entity_id;
    this.oldSlug = props.old_slug;
    this.newSlug = props.new_slug;
    this.createdAt = props.created_at || new Date().toISOString();
  }

  toObject(): SlugRedirectProps {
    return {
      id: this.id,
      tenant_id: this.tenantId,
      entity_type: this.entityType,
      entity_id: this.entityId,
      old_slug: this.oldSlug,
      new_slug: this.newSlug,
      created_at: this.createdAt,
    };
  }
}
