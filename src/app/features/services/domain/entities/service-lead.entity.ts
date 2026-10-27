export type LeadStatus = 'new' | 'contacted' | 'quoted' | 'won' | 'lost';

export interface ServiceLeadProps {
  id: string;
  tenant_id?: string;
  service_id?: string | null;
  service_name?: string | null;
  name: string;
  email?: string | null;
  phone?: string | null;
  message: string;
  source?: string;
  utm_source?: string | null;
  utm_medium?: string | null;
  utm_campaign?: string | null;
  status?: LeadStatus;
  ip_hash?: string | null;
  user_agent?: string | null;
  created_at?: string;
  contacted_at?: string | null;
}

export class ServiceLead {
  readonly id: string;
  readonly tenantId?: string;
  readonly serviceId: string | null;
  readonly serviceName: string | null;
  readonly name: string;
  readonly email: string | null;
  readonly phone: string | null;
  readonly message: string;
  readonly source: string;
  readonly utmSource: string | null;
  readonly utmMedium: string | null;
  readonly utmCampaign: string | null;
  status: LeadStatus;
  readonly ipHash: string | null;
  readonly userAgent: string | null;
  readonly createdAt: string;
  contactedAt: string | null;

  constructor(props: ServiceLeadProps) {
    this.id = props.id;
    this.tenantId = props.tenant_id;
    this.serviceId = props.service_id || null;
    this.serviceName = props.service_name || null;
    this.name = (props.name || '').trim();
    this.email = props.email ? props.email.trim() : null;
    this.phone = props.phone ? props.phone.trim() : null;
    this.message = (props.message || '').trim();
    this.source = props.source || 'landing_service';
    this.utmSource = props.utm_source || null;
    this.utmMedium = props.utm_medium || null;
    this.utmCampaign = props.utm_campaign || null;
    this.status = props.status || 'new';
    this.ipHash = props.ip_hash || null;
    this.userAgent = props.user_agent || null;
    this.createdAt = props.created_at || new Date().toISOString();
    this.contactedAt = props.contacted_at || null;
  }

  updateStatus(newStatus: LeadStatus): void {
    this.status = newStatus;
    if (newStatus !== 'new' && !this.contactedAt) {
      this.contactedAt = new Date().toISOString();
    }
  }

  toObject(): ServiceLeadProps {
    return {
      id: this.id,
      tenant_id: this.tenantId,
      service_id: this.serviceId,
      service_name: this.serviceName,
      name: this.name,
      email: this.email,
      phone: this.phone,
      message: this.message,
      source: this.source,
      utm_source: this.utmSource,
      utm_medium: this.utmMedium,
      utm_campaign: this.utmCampaign,
      status: this.status,
      ip_hash: this.ipHash,
      user_agent: this.userAgent,
      created_at: this.createdAt,
      contacted_at: this.contactedAt,
    };
  }
}
