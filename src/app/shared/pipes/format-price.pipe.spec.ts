import { FormatPricePipe } from './format-price.pipe';

describe('FormatPricePipe (REQ-F-02 Monetary Standardization)', () => {
  let pipe: FormatPricePipe;

  beforeEach(() => {
    pipe = new FormatPricePipe();
  });

  describe('Scenario 1: Producto en USD con conversión secundaria', () => {
    it('should format USD product price with U$D prefix and exactly 2 decimals in es-AR locale', () => {
      const formatted = pipe.transform(425, 'USD');
      expect(formatted).toBe('U$D 425,00');
    });

    it('should format secondary converted price with ⇄ prefix and AR$ standard formatting', () => {
      const exchangeRate = 1240;
      const usdPrice = 425;
      const convertedArs = usdPrice * exchangeRate; // 527000
      const formattedSecondary = pipe.transform(convertedArs, 'ARS', { prefix: '⇄ ' });
      
      expect(formattedSecondary).toBe('⇄ AR$ 527.000');
      expect(formattedSecondary).not.toContain('~');
      expect(formattedSecondary.startsWith('⇄ AR$')).toBe(true);
    });
  });

  describe('Scenario 2: Producto en ARS sin glifo $ aislado', () => {
    it('should format integer ARS product price with AR$ prefix, thousands dot, and no decimals', () => {
      const formatted = pipe.transform(698798, 'ARS');
      expect(formatted).toBe('AR$ 698.798');
      expect(formatted).not.toMatch(/^\$\s*\d/); // No isolated $
      expect(formatted.startsWith('AR$ ')).toBe(true);
    });

    it('should format ARS with decimals properly if it has decimal cents', () => {
      const formatted = pipe.transform(698798.5, 'ARS');
      expect(formatted).toBe('AR$ 698.798,50');
    });
  });

  describe('Scenario 3: Totalizador y líneas del Drawer del Carrito', () => {
    it('should format cart drawer USD item prices without truncating decimals', () => {
      expect(pipe.transform(425.5, 'USD')).toBe('U$D 425,50');
      expect(pipe.transform(1240.25, 'USD')).toBe('U$D 1.240,25');
      expect(pipe.transform(9.99, 'USD')).toBe('U$D 9,99');
    });

    it('should format cart subtotal in ARS cleanly without isolated $ symbol', () => {
      const subtotal = 1450200;
      const formatted = pipe.transform(subtotal, 'ARS');
      expect(formatted).toBe('AR$ 1.450.200');
      expect(formatted.startsWith('AR$ ')).toBe(true);
    });

    it('should handle null or undefined cart values gracefully with fallback', () => {
      expect(pipe.transform(null, 'ARS')).toBe('-');
      expect(pipe.transform(undefined, 'USD')).toBe('-');
    });
  });

  describe('Scenario 4: Casos Borde (REQ-F-02 Edge Cases)', () => {
    it('should handle zero correctly in USD and ARS', () => {
      expect(pipe.transform(0, 'USD')).toBe('U$D 0,00');
      expect(pipe.transform(0, 'ARS')).toBe('AR$ 0');
    });

    it('should handle negative numbers correctly (e.g. discounts or adjustments)', () => {
      expect(pipe.transform(-425, 'USD')).toBe('U$D -425,00');
      expect(pipe.transform(-698798, 'ARS')).toBe('AR$ -698.798');
    });

    it('should handle NaN and custom fallback values', () => {
      expect(pipe.transform(NaN, 'USD')).toBe('-');
      expect(pipe.transform(null, 'ARS', { fallback: 'A consultar' })).toBe('A consultar');
    });
  });
});
