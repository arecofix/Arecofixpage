import { validateBlockContent } from './block-schemas';

describe('Block Schemas Zod Validators', () => {

  describe('Hero Block Schema', () => {
    it('should validate valid hero content', () => {
      const validHero = {
        title: 'Auditoría Técnica Profesional',
        subtitle: 'Diagnóstico integral de sitios web',
        ctaLabel: 'Pedir Presupuesto',
        ctaHref: '#contacto',
        align: 'left',
        imageUrl: 'https://arecofix.com.ar/img.jpg',
      };
      const result = validateBlockContent('hero', validHero);
      expect(result.success).toBe(true);
      expect(result.data.title).toBe(validHero.title);
    });

    it('should fail when hero title is missing or empty', () => {
      const invalidHero = {
        title: '',
        subtitle: 'Subtítulo',
      };
      const result = validateBlockContent('hero', invalidHero);
      expect(result.success).toBe(false);
      expect(result.error).toContain('El título del Hero es obligatorio');
    });
  });

  describe('Features Block Schema', () => {
    it('should validate features block with list of items', () => {
      const content = {
        title: 'Nuestras Ventajas',
        items: [
          { title: 'Velocidad', description: 'Carga ultrarrápida', icon: 'fa-bolt' },
          { title: 'Seguridad', description: 'Sin vulnerabilidades', icon: 'fa-shield' },
        ],
      };
      const result = validateBlockContent('features', content);
      expect(result.success).toBe(true);
      expect(result.data.items.length).toBe(2);
    });

    it('should fail when a feature item has no title', () => {
      const content = {
        items: [{ title: '', description: 'Sin título' }],
      };
      const result = validateBlockContent('features', content);
      expect(result.success).toBe(false);
    });
  });

  describe('Rich Text Block Schema', () => {
    it('should validate rich text with non-empty content', () => {
      const content = { content: '### Hola Mundo\n\nEste es un texto.' };
      const result = validateBlockContent('rich_text', content);
      expect(result.success).toBe(true);
    });

    it('should fail if content is empty', () => {
      const result = validateBlockContent('rich_text', { content: '' });
      expect(result.success).toBe(false);
    });
  });

  describe('Contact Block Schema', () => {
    it('should apply defaults for contact block', () => {
      const result = validateBlockContent('contact', {});
      expect(result.success).toBe(true);
      expect(result.data.showPhone).toBe(true);
      expect(result.data.showEmail).toBe(true);
    });
  });

  describe('Unknown Block Type', () => {
    it('should return error for unknown block type', () => {
      const result = validateBlockContent('unknown_type' as any, {});
      expect(result.success).toBe(false);
      expect(result.error).toContain('Tipo de bloque desconocido');
    });
  });

});
