import { buildWhatsAppUrl } from './whatsapp-url.builder';

describe('buildWhatsAppUrl', () => {
  it('debe limpiar caracteres no numéricos del teléfono', () => {
    expect(buildWhatsAppUrl('+54 9 11 2596-0900')).toBe('https://wa.me/5491125960900');
  });

  it('debe codificar el mensaje en formato URL query param', () => {
    const url = buildWhatsAppUrl('5491125960900', 'Hola Arecofix! Consulta de prueba');
    expect(url).toBe('https://wa.me/5491125960900?text=Hola%20Arecofix!%20Consulta%20de%20prueba');
  });

  it('debe devolver wa.me base si el mensaje es vacío o whitespace', () => {
    expect(buildWhatsAppUrl('5491125960900', '   ')).toBe('https://wa.me/5491125960900');
  });
});
