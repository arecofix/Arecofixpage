import { ServiceLeadRepository } from '../../domain/repositories/service-lead.repository';
import { ServiceLead } from '../../domain/entities/service-lead.entity';
import { CreateLeadDto } from '../../domain/dtos/service.dto';
function portableHash(input: string): string {
  let h1 = 0xdeadbeef ^ 0;
  let h2 = 0x41c64e6d ^ 0;
  for (let i = 0; i < input.length; i++) {
    const ch = input.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(16);
}

export class CreateLeadUseCase {
  constructor(
    private leadRepo: ServiceLeadRepository,
    private salt = 'arecofix-leads-salt-2026'
  ) {}

  async execute(
    dto: CreateLeadDto,
    clientIp = '',
    userAgent = ''
  ): Promise<ServiceLead> {
    // 1. Honeypot check: If the hidden honeypot field has a value, it's a bot
    if (dto.hp_field && dto.hp_field.trim().length > 0) {
      throw new Error('Bot detectado por trampa honeypot.');
    }

    // 2. Validate essential fields
    const name = (dto.name || '').trim();
    if (name.length < 2) {
      throw new Error('El nombre debe tener al menos 2 caracteres.');
    }

    const email = (dto.email || '').trim();
    const phone = (dto.phone || '').trim();
    if (!email && !phone) {
      throw new Error('Debes proporcionar al menos un medio de contacto (teléfono o correo electrónico).');
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new Error('El formato del correo electrónico es inválido.');
    }

    const message = (dto.message || '').trim();
    if (message.length < 5) {
      throw new Error('El mensaje debe contener al menos 5 caracteres.');
    }

    // 3. Compute hashed IP for privacy and rate limiting
    const ipHash = clientIp
      ? portableHash(clientIp + this.salt)
      : null;

    // 4. Rate limiting: max 5 leads per hour per IP hash
    if (ipHash) {
      const recentCount = await this.leadRepo.getRecentLeadCountByIp(ipHash, 1);
      if (recentCount >= 5) {
        const rateLimitError = new Error('Has superado el límite de consultas permitidas por hora. Por favor reintentá más tarde.');
        (rateLimitError as any).statusCode = 429;
        throw rateLimitError;
      }
    }

    // 5. Persist lead
    return this.leadRepo.create({
      service_id: dto.service_id || null,
      name,
      email: email || null,
      phone: phone || null,
      message,
      source: dto.source || 'landing_service',
      utm_source: dto.utm_source || null,
      utm_medium: dto.utm_medium || null,
      utm_campaign: dto.utm_campaign || null,
      ip_hash: ipHash,
      user_agent: userAgent || null,
      status: 'new',
    });
  }
}
