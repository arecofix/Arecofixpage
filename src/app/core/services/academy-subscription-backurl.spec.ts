import { buildSubscriptionBackUrls } from '../../../../server/routes/academy-subscription.routes';

describe('Security H-12: buildSubscriptionBackUrls Open Redirect Prevention', () => {
  const trustedBaseUrl = 'https://arecofix.com.ar';

  it('debe descartar incondicionalmente backUrl=https://evil.com/phishing', () => {
    const urls = buildSubscriptionBackUrls(trustedBaseUrl, 'sub-test-123', 'https://evil.com/phishing');

    expect(urls.success).not.toContain('evil.com');
    expect(urls.failure).not.toContain('evil.com');
    expect(urls.pending).not.toContain('evil.com');

    expect(urls.success).toBe('https://arecofix.com.ar/academy?payment=approved&subscription_id=sub-test-123');
    expect(urls.failure).toBe('https://arecofix.com.ar/academy?payment=rejected&subscription_id=sub-test-123');
    expect(urls.pending).toBe('https://arecofix.com.ar/academy?payment=pending&subscription_id=sub-test-123');
  });

  it('debe manejar baseUrl con o sin barra final sin duplicaciones', () => {
    const urls = buildSubscriptionBackUrls('https://arecofix.com.ar///', 'sub-clean-456');
    expect(urls.success).toBe('https://arecofix.com.ar/academy?payment=approved&subscription_id=sub-clean-456');
  });

  it('no debe permitir javascript: o data: schemes en los back_urls', () => {
    const urls = buildSubscriptionBackUrls(trustedBaseUrl, 'sub-xss-789', 'javascript:alert(1)');
    expect(urls.success.startsWith('https://arecofix.com.ar/academy')).toBe(true);
    expect(urls.failure.startsWith('https://arecofix.com.ar/academy')).toBe(true);
    expect(urls.pending.startsWith('https://arecofix.com.ar/academy')).toBe(true);
  });
});
