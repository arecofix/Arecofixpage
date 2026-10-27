export class Slug {
  private readonly value: string;

  constructor(value: string) {
    const sanitized = Slug.slugify(value);
    if (!sanitized || sanitized.length === 0) {
      throw new Error('El slug no puede estar vacío');
    }
    if (sanitized.length > 180) {
      throw new Error('El slug no puede superar los 180 caracteres');
    }
    if (!/^[a-z0-9-]+$/.test(sanitized)) {
      throw new Error('El slug solo puede contener letras minúsculas, números y guiones');
    }
    this.value = sanitized;
  }

  getValue(): string {
    return this.value;
  }

  toString(): string {
    return this.value;
  }

  static slugify(text: string): string {
    if (!text) return '';
    return text
      .toString()
      .normalize('NFD') // Normalize diacritics
      .replace(/[\u0300-\u036f]/g, '') // Remove accents
      .toLowerCase()
      .trim()
      .replace(/&/g, '-and-')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/[\s_]+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  static create(text: string): Slug {
    return new Slug(text);
  }
}
