/**
 * Repair Category & Issue Normalization Utilities
 * 
 * Provides centralized normalization (DRY) for repair issue descriptions,
 * mapping free-text variants to canonical categories for high-quality analytics.
 */

export interface RepairCommonIssue {
  issue: string;
  count: number;
}

export const CANONICAL_REPAIR_CATEGORIES = [
  'Cambio de módulo',
  'Cambio de batería',
  'Cambio de pin de carga',
  'Cambio de glass',
  'Reparación de cámara',
  'Reparación de audio / parlante',
  'Servicio de software',
  'Tratamiento por humedad',
  'Reparación de placa / microelectrónica',
  'Diagnóstico / Otro'
] as const;

export type CanonicalRepairCategory = typeof CANONICAL_REPAIR_CATEGORIES[number];

/**
 * Normalizes raw string: lowercase, strips diacritics/accents, removes extra whitespace.
 */
export function normalizeIssueText(text: string | null | undefined): string {
  if (!text) return '';
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove accents
    .replace(/[^\w\s]/g, ' ') // remove special punctuation
    .replace(/\s+/g, ' ')
    .trim();
}

interface CategoryRule {
  category: CanonicalRepairCategory;
  patterns: RegExp[];
}

const CATEGORY_RULES: CategoryRule[] = [
  {
    category: 'Cambio de glass',
    patterns: [
      /\bglass\b/,
      /\bvidrio\b/,
      /\bremanufactura\b/
    ]
  },
  {
    category: 'Cambio de módulo',
    patterns: [
      /\bmodulo\b/,
      /\bpantalla\b/,
      /\bdisplay\b/,
      /\btactil\b/,
      /\btouch\b/,
      /\blcd\b/,
      /\boled\b/,
      /\bamoled\b/
    ]
  },
  {
    category: 'Cambio de batería',
    patterns: [
      /\bbateria\b/,
      /\bbattery\b/,
      /\bpila\b/,
      /\bdegradada\b/,
      /\binflada\b/
    ]
  },
  {
    category: 'Cambio de pin de carga',
    patterns: [
      /\bpin de carga\b/,
      /\bpuerto de carga\b/,
      /\bconector de carga\b/,
      /\bpin carga\b/,
      /\bflex de carga\b/,
      /\bno carga\b/,
      /\bcarga falso\b/
    ]
  },
  {
    category: 'Reparación de cámara',
    patterns: [
      /\bcamara\b/,
      /\blente\b/,
      /\bfoco\b/,
      /\bcamera\b/
    ]
  },
  {
    category: 'Reparación de audio / parlante',
    patterns: [
      /\bparlante\b/,
      /\baltavoz\b/,
      /\bauricular\b/,
      /\bmicrofono\b/,
      /\baudio\b/,
      /\bbuzzer\b/,
      /\bno se escucha\b/,
      /\bsonido\b/
    ]
  },
  {
    category: 'Servicio de software',
    patterns: [
      /\bsoftware\b/,
      /\bflasheo\b/,
      /\bsistema operativo\b/,
      /\bcuenta google\b/,
      /\bfrp\b/,
      /\breinicio\b/,
      /\bbrick\b/,
      /\bbrickeado\b/,
      /\bactualizacion\b/,
      /\bpatron olvidado\b/,
      /\bbootloop\b/,
      /\bformateo\b/
    ]
  },
  {
    category: 'Tratamiento por humedad',
    patterns: [
      /\bmojado\b/,
      /\bhumedad\b/,
      /\bbano quimico\b/,
      /\bagua\b/,
      /\bsulfatado\b/,
      /\bcaida al agua\b/,
      /\bliquido\b/
    ]
  },
  {
    category: 'Reparación de placa / microelectrónica',
    patterns: [
      /\bplaca\b/,
      /\bcorto\b/,
      /\bcortocircuito\b/,
      /\bmicrosoldadura\b/,
      /\bmicroelectronica\b/,
      /\bic\b/,
      /\bpmic\b/,
      /\bconsumo\b/,
      /\bno enciende\b/
    ]
  }
];

/**
 * Maps any raw failure or issue text to its canonical category.
 */
export function getCanonicalRepairCategory(rawText: string | null | undefined): string {
  const normalized = normalizeIssueText(rawText);
  if (!normalized) {
    return 'Sin especificar';
  }

  for (const rule of CATEGORY_RULES) {
    for (const pattern of rule.patterns) {
      if (pattern.test(normalized)) {
        return rule.category;
      }
    }
  }

  // Capitalize first letter of raw cleaned text if no category rule matches
  const cleaned = rawText ? rawText.trim() : '';
  if (cleaned.length > 0) {
    return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
  }

  return 'Diagnóstico / Otro';
}

/**
 * Aggregates and groups common issues by canonical category.
 * Sums counts for entries that map to the same category and sorts by count descending.
 */
export function aggregateIssuesByCanonicalCategory(
  rawIssues: RepairCommonIssue[] | null | undefined,
  limit: number = 8
): RepairCommonIssue[] {
  if (!rawIssues || rawIssues.length === 0) {
    return [];
  }

  const categoryMap = new Map<string, number>();

  for (const item of rawIssues) {
    const rawName = item?.issue || '';
    const count = Number(item?.count || 0);
    if (!rawName || count <= 0) continue;

    const canonical = getCanonicalRepairCategory(rawName);
    categoryMap.set(canonical, (categoryMap.get(canonical) || 0) + count);
  }

  return Array.from(categoryMap.entries())
    .map(([issue, count]) => ({ issue, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}
