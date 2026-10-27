import { ServiceLead } from '../../domain/entities/service-lead.entity';
import { LeadDto } from '../../domain/dtos/service.dto';

export class LeadMapper {
  static toEntity(raw: any): ServiceLead {
    return new ServiceLead({
      id: raw.id,
      tenant_id: raw.tenant_id,
      service_id: raw.service_id,
      service_name: raw.services?.name || raw.service_name || null,
      name: raw.name,
      email: raw.email,
      phone: raw.phone,
      message: raw.message,
      source: raw.source || 'landing_service',
      utm_source: raw.utm_source,
      utm_medium: raw.utm_medium,
      utm_campaign: raw.utm_campaign,
      status: raw.status || 'new',
      ip_hash: raw.ip_hash,
      user_agent: raw.user_agent,
      created_at: raw.created_at,
      contacted_at: raw.contacted_at,
    });
  }

  static toDto(lead: ServiceLead): LeadDto {
    return {
      id: lead.id,
      service_id: lead.serviceId,
      service_name: lead.serviceName,
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      message: lead.message,
      source: lead.source,
      utm_source: lead.utmSource,
      utm_medium: lead.utmMedium,
      utm_campaign: lead.utmCampaign,
      status: lead.status,
      created_at: lead.createdAt,
      contacted_at: lead.contactedAt,
    };
  }
}
