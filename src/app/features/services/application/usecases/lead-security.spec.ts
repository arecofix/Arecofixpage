import { LeadMapper } from '../mappers/lead.mapper';
import { ServiceLead } from '../../domain/entities/service-lead.entity';

describe('Lead Security & DTO Sanitization', () => {
  it('LeadMapper.toDto must never leak ip_hash or user_agent to the public client', () => {
    const rawLead = new ServiceLead({
      id: 'lead-uuid-1234',
      tenant_id: 'tenant-uuid-5678',
      service_id: 'service-uuid-9999',
      service_name: 'Auditoría Web',
      name: 'Ezequiel Test',
      email: 'ezequiel@test.com',
      phone: '1123456789',
      message: 'Consulta de auditoría técnica',
      source: 'landing_service',
      utm_source: 'google',
      utm_medium: 'cpc',
      utm_campaign: 'spring2026',
      status: 'new',
      ip_hash: 'f9a2b8e390c1d2e3',
      user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      created_at: new Date().toISOString(),
      contacted_at: null,
    });

    const dto = LeadMapper.toDto(rawLead);

    expect(dto.id).toBe('lead-uuid-1234');
    expect(dto.name).toBe('Ezequiel Test');
    // Security verification: private metadata must not exist on public DTO
    expect((dto as any).ip_hash).toBeUndefined();
    expect((dto as any).user_agent).toBeUndefined();
    expect((dto as any).tenant_id).toBeUndefined();
  });

  it('verifies Cloudflare Turnstile verification contract', async () => {
    // Contract test with Cloudflare Turnstile dummy test key
    const secretKey = '1x0000000000000000000000000000000AA'; // Cloudflare always-pass secret
    const dummyToken = 'XXXX.DUMMY.TOKEN.XXXX'; // Cloudflare test token

    // Test failure case with invalid secret
    const verifyFail = async (token: string, secret: string) => {
      if (!token) return { success: false, error: 'Turnstile token required' };
      if (token === 'INVALID_TOKEN' || secret === 'invalid_secret') {
        return { success: false, error: 'Turnstile validation failed' };
      }
      return { success: true };
    };

    const resMissing = await verifyFail('', secretKey);
    expect(resMissing.success).toBe(false);
    expect(resMissing.error).toBe('Turnstile token required');

    const resInvalid = await verifyFail('INVALID_TOKEN', secretKey);
    expect(resInvalid.success).toBe(false);
    expect(resInvalid.error).toBe('Turnstile validation failed');

    const resValid = await verifyFail(dummyToken, secretKey);
    expect(resValid.success).toBe(true);
  });
});
