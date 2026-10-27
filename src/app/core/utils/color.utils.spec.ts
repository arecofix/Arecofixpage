import { sanitizeHexColor } from './color.utils';

describe('color.utils - sanitizeHexColor', () => {
  it('should return valid 6-digit hex color unchanged', () => {
    expect(sanitizeHexColor('#3b82f6')).toBe('#3b82f6');
    expect(sanitizeHexColor('#0D9488')).toBe('#0d9488');
  });

  it('should expand valid 3-digit shorthand hex', () => {
    expect(sanitizeHexColor('#fff')).toBe('#ffffff');
    expect(sanitizeHexColor('#123')).toBe('#112233');
  });

  it('should add leading # if missing from valid hex', () => {
    expect(sanitizeHexColor('3b82f6')).toBe('#3b82f6');
    expect(sanitizeHexColor('abc')).toBe('#aabbcc');
  });

  it('should return fallback when color is null, undefined or empty string', () => {
    expect(sanitizeHexColor(null, '#3b82f6')).toBe('#3b82f6');
    expect(sanitizeHexColor(undefined, '#0d9488')).toBe('#0d9488');
    expect(sanitizeHexColor('', '#10b981')).toBe('#10b981');
    expect(sanitizeHexColor('   ', '#10b981')).toBe('#10b981');
  });

  it('should return fallback when color is an invalid string', () => {
    expect(sanitizeHexColor('invalid-color', '#000000')).toBe('#000000');
    expect(sanitizeHexColor('rgb(255, 0, 0)', '#000000')).toBe('#000000');
    expect(sanitizeHexColor('#12345', '#000000')).toBe('#000000');
  });
});
