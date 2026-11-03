import { Slug } from './slug.vo';
import { Money } from './money.vo';
import { SeoMeta } from './seo-meta.vo';

describe('Services Domain Value Objects', () => {

  describe('Slug Value Object', () => {
    it('should generate a valid clean slug from text with accents and symbols', () => {
      const input = 'Auditoría de Sitios Web & Software!';
      const slug = Slug.create(input);
      expect(slug.getValue()).toBe('auditoria-de-sitios-web-and-software');
    });

    it('should throw an error for empty text', () => {
      expect(() => new Slug('')).toThrow('El slug no puede estar vacío');
    });

    it('should throw an error if slug exceeds 180 characters', () => {
      const longText = 'a'.repeat(181);
      expect(() => new Slug(longText)).toThrow('El slug no puede superar los 180 caracteres');
    });

    it('should sanitize double hyphens and trim boundaries', () => {
      const slug = Slug.slugify('---Servicio---Especializado---');
      expect(slug).toBe('servicio-especializado');
    });
  });

  describe('Money Value Object', () => {
    it('should format null or undefined amount as "Consultar"', () => {
      const money = Money.fromNullable(null);
      expect(money.isConsult()).toBe(true);
      expect(money.format()).toBe('Consultar');
    });

    it('should format positive amounts as ARS currency', () => {
      const money = Money.fromNullable(69000, 'ARS');
      expect(money.isConsult()).toBe(false);
      expect(money.getAmount()).toBe(69000);
      expect(money.format()).toContain('69.000');
    });

    it('should throw an error for negative amount', () => {
      expect(() => new Money(-50)).toThrow('El monto de Money debe ser un número positivo o null');
    });
  });

  describe('SeoMeta Value Object', () => {
    it('should truncate title to 70 characters and description to 160 characters', () => {
      const longTitle = 'Este es un título extremadamente largo que supera los setenta caracteres de longitud máxima permitida en Google';
      const longDesc = 'Esta es una descripción larguísima '.repeat(10);

      const seo = SeoMeta.create({
        title: longTitle,
        description: longDesc,
      });

      expect(seo.title.length).toBeLessThanOrEqual(70);
      expect(seo.description.length).toBeLessThanOrEqual(160);
    });

    it('should apply fallback name and description if empty', () => {
      const seo = SeoMeta.create({
        title: '',
        description: '',
        fallbackName: 'Reparación de Celulares',
        fallbackDescription: 'Arreglo de pantallas y módulos en Marcos Paz.',
      });

      expect(seo.title).toBe('Reparación de Celulares | Arecofix');
      expect(seo.description).toBe('Arreglo de pantallas y módulos en Marcos Paz.');
    });
  });

});
