/**
 * Historical Repairs Issue Normalization Script
 *
 * Scans all existing repairs in Supabase, normalizes raw text entries (removing accents,
 * lowercasing, resolving synonyms), and optionally updates or audits the database.
 *
 * Usage:
 *   node scripts/normalize-historical-repairs.mjs [--dry-run]
 *   node scripts/normalize-historical-repairs.mjs --apply
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

dotenv.config();

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://db.arecofix.com.ar';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY;

if (!SUPABASE_KEY) {
  console.error('❌ Error: SUPABASE_KEY o SUPABASE_SERVICE_ROLE_KEY no encontrada en .env');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Canonical rules
const CATEGORY_RULES = [
  {
    category: 'Cambio de glass',
    patterns: [/\bglass\b/, /\bvidrio\b/, /\bremanufactura\b/]
  },
  {
    category: 'Cambio de módulo',
    patterns: [/\bmodulo\b/, /\bpantalla\b/, /\bdisplay\b/, /\btactil\b/, /\btouch\b/, /\blcd\b/, /\boled\b/, /\bamoled\b/]
  },
  {
    category: 'Cambio de batería',
    patterns: [/\bbateria\b/, /\bbattery\b/, /\bpila\b/, /\bdegradada\b/, /\binflada\b/]
  },
  {
    category: 'Cambio de pin de carga',
    patterns: [/\bpin de carga\b/, /\bpuerto de carga\b/, /\bconector de carga\b/, /\bpin carga\b/, /\bflex de carga\b/, /\bno carga\b/, /\bcarga falso\b/]
  },
  {
    category: 'Reparación de cámara',
    patterns: [/\bcamara\b/, /\blente\b/, /\bfoco\b/, /\bcamera\b/]
  },
  {
    category: 'Reparación de audio / parlante',
    patterns: [/\bparlante\b/, /\baltavoz\b/, /\bauricular\b/, /\bmicrofono\b/, /\baudio\b/, /\bbuzzer\b/, /\bno se escucha\b/, /\bsonido\b/]
  },
  {
    category: 'Servicio de software',
    patterns: [/\bsoftware\b/, /\bflasheo\b/, /\bsistema operativo\b/, /\bcuenta google\b/, /\bfrp\b/, /\breinicio\b/, /\bbrick\b/, /\bbrickeado\b/, /\bactualizacion\b/, /\bpatron olvidado\b/, /\bbootloop\b/, /\bformateo\b/]
  },
  {
    category: 'Tratamiento por humedad',
    patterns: [/\bmojado\b/, /\bhumedad\b/, /\bbano quimico\b/, /\bagua\b/, /\bsulfatado\b/, /\bcaida al agua\b/, /\bliquido\b/]
  },
  {
    category: 'Reparación de placa / microelectrónica',
    patterns: [/\bplaca\b/, /\bcorto\b/, /\bcortocircuito\b/, /\bmicrosoldadura\b/, /\bmicroelectronica\b/, /\bic\b/, /\bpmic\b/, /\bconsumo\b/, /\bno enciende\b/]
  }
];

function normalizeText(text) {
  if (!text) return '';
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function getCanonicalCategory(rawText) {
  const normalized = normalizeText(rawText);
  if (!normalized) return 'Sin especificar';
  for (const rule of CATEGORY_RULES) {
    for (const pattern of rule.patterns) {
      if (pattern.test(normalized)) return rule.category;
    }
  }
  const cleaned = rawText.trim();
  return cleaned ? cleaned.charAt(0).toUpperCase() + cleaned.slice(1) : 'Diagnóstico / Otro';
}

async function main() {
  const isApply = process.argv.includes('--apply');
  console.log(`\n======================================================`);
  console.log(`🔄 Auditar y Normalizar Fallas Históricas de Reparación`);
  console.log(`📡 URL: ${SUPABASE_URL}`);
  console.log(`⚙️ Modo: ${isApply ? 'APLICAR CAMBIOS (--apply)' : 'SIMULACIÓN (Dry Run)'}`);
  console.log(`======================================================\n`);

  const { data: repairs, error } = await supabase
    .from('repairs')
    .select('id, tracking_code, issue_description')
    .not('issue_description', 'is', null)
    .neq('issue_description', '');

  if (error) {
    console.error('❌ Error al consultar reparaciones:', error.message);
    process.exit(1);
  }

  console.log(`📊 Total de reparaciones con descripción encontradas: ${repairs?.length || 0}\n`);

  const categoryCounts = new Map();
  const sampleTransformations = [];

  for (const repair of (repairs || [])) {
    const raw = repair.issue_description || '';
    const canonical = getCanonicalCategory(raw);

    categoryCounts.set(canonical, (categoryCounts.get(canonical) || 0) + 1);

    if (sampleTransformations.length < 15 && raw !== canonical) {
      sampleTransformations.push({
        id: repair.id,
        tracking: repair.tracking_code,
        raw,
        canonical
      });
    }
  }

  console.log('📈 Distribución por Categoría Canónica Normalizada:');
  console.table(
    Array.from(categoryCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([categoria, total]) => ({ Categoria: categoria, Total: total }))
  );

  console.log('\n🔍 Muestra de Mapeos Realizados:');
  sampleTransformations.forEach((sample, idx) => {
    console.log(`  [${idx + 1}] "${sample.raw}" -> "${sample.canonical}" (${sample.tracking || sample.id})`);
  });

  if (isApply) {
    console.log('\n💾 Aplicando normalización a la base de datos...');
    let updatedCount = 0;
    for (const repair of repairs) {
      const canonical = getCanonicalCategory(repair.issue_description);
      // If issue description was exact lowercase or simple synonym, standardize
      if (repair.issue_description !== canonical) {
        const { error: updateError } = await supabase
          .from('repairs')
          .update({
            // Store canonical category prefix or standardized text
            issue_description: `${canonical} (${repair.issue_description})`
          })
          .eq('id', repair.id);

        if (!updateError) updatedCount++;
      }
    }
    console.log(`✅ ${updatedCount} reparaciones actualizadas con éxito.`);
  } else {
    console.log('\n💡 Para aplicar cambios definitivos en la base de datos, ejecuta con flag: --apply');
  }
}

main().catch(console.error);

