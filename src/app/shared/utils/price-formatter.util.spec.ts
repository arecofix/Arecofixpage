import { formatPrice } from './price-formatter.util';

describe('formatPrice utility', () => {
  it('should format USD prices with U$D symbol and 2 decimals by default', () => {
    expect(formatPrice(425, 'USD')).toBe('U$D 425,00');
    expect(formatPrice(507, 'USD')).toBe('U$D 507,00');
    expect(formatPrice('1250.5', 'USD')).toBe('U$D 1.250,50');
  });

  it('should format ARS prices with AR$ symbol and no decimals when integer', () => {
    expect(formatPrice(698798, 'ARS')).toBe('AR$ 698.798');
    expect(formatPrice(833625, 'ARS')).toBe('AR$ 833.625');
  });

  it('should support prefix option (such as ⇄ for conversion)', () => {
    expect(formatPrice(698798, 'ARS', { prefix: '⇄ ' })).toBe('⇄ AR$ 698.798');
    expect(formatPrice(425, 'USD', { prefix: '⇄ ' })).toBe('⇄ U$D 425,00');
  });

  it('should handle null, undefined and invalid values with fallback', () => {
    expect(formatPrice(null, 'ARS')).toBe('-');
    expect(formatPrice(undefined, 'USD')).toBe('-');
    expect(formatPrice(NaN, 'USD')).toBe('-');
    expect(formatPrice(null, 'ARS', { fallback: 'Consultar' })).toBe('Consultar');
  });

  it('should support symbolStyle short', () => {
    expect(formatPrice(425, 'USD', { symbolStyle: 'short' })).toBe('US$ 425,00');
    expect(formatPrice(698798, 'ARS', { symbolStyle: 'short' })).toBe('$ 698.798');
  });
});
