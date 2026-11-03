import {
  normalizeIssueText,
  getCanonicalRepairCategory,
  aggregateIssuesByCanonicalCategory,
  CANONICAL_REPAIR_CATEGORIES,
  RepairCommonIssue
} from './repair-category.utils';

describe('RepairCategoryUtils', () => {
  describe('normalizeIssueText', () => {
    it('should convert to lowercase, remove accents and strip punctuation', () => {
      expect(normalizeIssueText('CAMBIO DE MÓDULO!!')).toBe('cambio de modulo');
      expect(normalizeIssueText('   Batería   degradada...  ')).toBe('bateria degradada');
      expect(normalizeIssueText('Pin de Carga (falso contacto)')).toBe('pin de carga falso contacto');
    });

    it('should return empty string for null, undefined or empty input', () => {
      expect(normalizeIssueText(null)).toBe('');
      expect(normalizeIssueText(undefined)).toBe('');
      expect(normalizeIssueText('   ')).toBe('');
    });
  });

  describe('getCanonicalRepairCategory', () => {
    it('should map module and screen variants to "Cambio de módulo"', () => {
      expect(getCanonicalRepairCategory('Modulo')).toBe('Cambio de módulo');
      expect(getCanonicalRepairCategory('Cambio de modulo')).toBe('Cambio de módulo');
      expect(getCanonicalRepairCategory('cambio de modulo')).toBe('Cambio de módulo');
      expect(getCanonicalRepairCategory('Pantalla rota')).toBe('Cambio de módulo');
      expect(getCanonicalRepairCategory('Display dañado')).toBe('Cambio de módulo');
      expect(getCanonicalRepairCategory('Touch no responde')).toBe('Cambio de módulo');
    });

    it('should map battery variants to "Cambio de batería"', () => {
      expect(getCanonicalRepairCategory('bateria')).toBe('Cambio de batería');
      expect(getCanonicalRepairCategory('Cambio de bateria')).toBe('Cambio de batería');
      expect(getCanonicalRepairCategory('BATERÍA INFLADA')).toBe('Cambio de batería');
    });

    it('should map charge pin variants to "Cambio de pin de carga"', () => {
      expect(getCanonicalRepairCategory('pin de carga')).toBe('Cambio de pin de carga');
      expect(getCanonicalRepairCategory('Cambio de pin de carga')).toBe('Cambio de pin de carga');
      expect(getCanonicalRepairCategory('puerto de carga suelto')).toBe('Cambio de pin de carga');
      expect(getCanonicalRepairCategory('no carga equipo')).toBe('Cambio de pin de carga');
    });

    it('should map glass variants to "Cambio de glass"', () => {
      expect(getCanonicalRepairCategory('glass roto')).toBe('Cambio de glass');
      expect(getCanonicalRepairCategory('Cambio de glass')).toBe('Cambio de glass');
      expect(getCanonicalRepairCategory('vidrio astillado')).toBe('Cambio de glass');
      expect(getCanonicalRepairCategory('remanufactura glass')).toBe('Cambio de glass');
    });

    it('should map camera variants to "Reparación de cámara"', () => {
      expect(getCanonicalRepairCategory('camara borrosa')).toBe('Reparación de cámara');
      expect(getCanonicalRepairCategory('lente de camara roto')).toBe('Reparación de cámara');
    });

    it('should map audio variants to "Reparación de audio / parlante"', () => {
      expect(getCanonicalRepairCategory('parlante no suena')).toBe('Reparación de audio / parlante');
      expect(getCanonicalRepairCategory('auricular bajo')).toBe('Reparación de audio / parlante');
      expect(getCanonicalRepairCategory('microfono no funciona')).toBe('Reparación de audio / parlante');
    });

    it('should map software variants to "Servicio de software"', () => {
      expect(getCanonicalRepairCategory('cuenta google')).toBe('Servicio de software');
      expect(getCanonicalRepairCategory('flasheo firmware')).toBe('Servicio de software');
      expect(getCanonicalRepairCategory('bootloop en logo')).toBe('Servicio de software');
    });

    it('should map humidity variants to "Tratamiento por humedad"', () => {
      expect(getCanonicalRepairCategory('mojado con agua')).toBe('Tratamiento por humedad');
      expect(getCanonicalRepairCategory('baño quimico urgente')).toBe('Tratamiento por humedad');
      expect(getCanonicalRepairCategory('sulfatado')).toBe('Tratamiento por humedad');
    });

    it('should map board variants to "Reparación de placa / microelectrónica"', () => {
      expect(getCanonicalRepairCategory('placa en corto')).toBe('Reparación de placa / microelectrónica');
      expect(getCanonicalRepairCategory('ic de carga dañado')).toBe('Reparación de placa / microelectrónica');
      expect(getCanonicalRepairCategory('no enciende placa')).toBe('Reparación de placa / microelectrónica');
    });

    it('should handle fallback for unknown strings and empty inputs', () => {
      expect(getCanonicalRepairCategory('')).toBe('Sin especificar');
      expect(getCanonicalRepairCategory(null)).toBe('Sin especificar');
      expect(getCanonicalRepairCategory('Antena wifi')).toBe('Antena wifi');
    });
  });

  describe('aggregateIssuesByCanonicalCategory', () => {
    it('should aggregate and sum counts of duplicate variants as described in the issue', () => {
      const rawIssues: RepairCommonIssue[] = [
        { issue: 'Modulo', count: 8 },
        { issue: 'Cambio de modulo', count: 5 },
        { issue: 'cambio de modulo', count: 2 },
        { issue: 'Cambio de bateria', count: 2 },
        { issue: 'Cambio de pin de carga', count: 2 }
      ];

      const aggregated = aggregateIssuesByCanonicalCategory(rawIssues);

      expect(aggregated).toEqual([
        { issue: 'Cambio de módulo', count: 15 }, // 8 + 5 + 2 = 15
        { issue: 'Cambio de batería', count: 2 },
        { issue: 'Cambio de pin de carga', count: 2 }
      ]);
    });

    it('should handle empty or null lists gracefully', () => {
      expect(aggregateIssuesByCanonicalCategory([])).toEqual([]);
      expect(aggregateIssuesByCanonicalCategory(null)).toEqual([]);
      expect(aggregateIssuesByCanonicalCategory(undefined)).toEqual([]);
    });

    it('should respect the limit parameter', () => {
      const rawIssues: RepairCommonIssue[] = [
        { issue: 'Modulo', count: 10 },
        { issue: 'Bateria', count: 8 },
        { issue: 'Pin de carga', count: 6 },
        { issue: 'Glass', count: 4 },
        { issue: 'Camara', count: 2 }
      ];

      const aggregated = aggregateIssuesByCanonicalCategory(rawIssues, 2);
      expect(aggregated.length).toBe(2);
      expect(aggregated[0].issue).toBe('Cambio de módulo');
      expect(aggregated[1].issue).toBe('Cambio de batería');
    });
  });
});
