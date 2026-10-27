import { slugify } from './slug.util';

describe('slugify', () => {
  it('debe transformar espacios en guiones y convertir a minúsculas', () => {
    expect(slugify('Servicio Tecnico Especializado')).toBe('servicio-tecnico-especializado');
  });

  it('debe remover acentos y tildes correctamente', () => {
    expect(slugify('Reparación & Auditoría Móvil')).toBe('reparacion-auditoria-movil');
  });

  it('debe eliminar caracteres no permitidos y guiones repetidos', () => {
    expect(slugify('¡¡Arecofix -- Pro!!')).toBe('arecofix-pro');
  });

  it('debe manejar cadenas vacías o nulas', () => {
    expect(slugify('')).toBe('');
    expect(slugify(null as unknown as string)).toBe('');
  });
});
