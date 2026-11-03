export interface ServiceFeatureProps {
  id: string;
  service_id: string;
  label: string;
  icon?: string | null;
  order_index?: number;
  created_at?: string;
}

export class ServiceFeature {
  readonly id: string;
  readonly serviceId: string;
  label: string;
  icon: string | null;
  orderIndex: number;
  readonly createdAt: string;

  constructor(props: ServiceFeatureProps) {
    this.id = props.id;
    this.serviceId = props.service_id;
    this.label = (props.label || '').trim();
    this.icon = props.icon || 'fa-check';
    this.orderIndex = props.order_index ?? 0;
    this.createdAt = props.created_at || new Date().toISOString();
  }

  toObject(): ServiceFeatureProps {
    return {
      id: this.id,
      service_id: this.serviceId,
      label: this.label,
      icon: this.icon,
      order_index: this.orderIndex,
      created_at: this.createdAt,
    };
  }
}
