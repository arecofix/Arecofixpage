/**
 * Utility for product search across the application.
 * Centralizes normalization, synonyms, and ranking logic.
 */
export class SearchUtils {
  public static readonly TECH_SYNONYMS: Record<string, string[]> = {
    'modulo': ['módulo', 'display', 'pantalla', 'tactil', 'touch', 'lcd', 'oled', 'amoled'],
    'modulos': ['módulo', 'display', 'pantalla', 'tactil', 'touch', 'lcd', 'oled', 'amoled'],
    'pantalla': ['módulo', 'display', 'modulo', 'lcd', 'touch'],
    'pantallas': ['módulo', 'display', 'modulo', 'lcd', 'touch'],
    'display': ['módulo', 'pantalla', 'modulo', 'lcd'],
    'visor': ['vidrio', 'glass', 'cristal'],
    'vidrio': ['visor', 'glass', 'cristal', 'templado'],
    'glass': ['visor', 'vidrio', 'cristal'],
    'bateria': ['batería', 'pila', 'battery'],
    'baterias': ['batería', 'pila', 'battery'],
    'pin': ['carga', 'conector', 'puerto', 'flex', 'zócalo', 'zocalo'],
    'pines': ['carga', 'conector', 'puerto', 'flex', 'zócalo', 'zocalo'],
    'cargador': ['fuente', 'trafo', 'transformador', 'cable'],
    'cable': ['usb', 'datos', 'cargador'],
    'repuesto': ['módulo', 'pantalla', 'bateria', 'pin', 'flex', 'placa', 'ic', 'chip', 'microfono', 'parlante'],
    'repuestos': ['módulo', 'pantalla', 'bateria', 'pin', 'flex', 'placa', 'ic', 'chip', 'microfono', 'parlante'],
    'placa': ['mother', 'logica', 'mainboard', 'subplaca', 'pba'],
    'flex': ['cinta', 'cable', 'fpc', 'flex', 'flexor'],
    'microfono': ['mic', 'micrófono'],
    'parlante': ['auricular', 'speaker', 'altavoz', 'buzzer', 'campana'],
    'camara': ['cámara', 'lente'],
    'herramienta': ['destornillador', 'pinza', 'estacion', 'soldador', 'microscopio', 'multimetro', 'tester'],
    'herramientas': ['destornillador', 'pinza', 'estacion', 'soldador', 'microscopio', 'multimetro', 'tester'],
    'estaño': ['soldadura', 'solder', 'pasta'],
    'pegamento': ['b7000', 't7000', 't8000', 'uv', 'cinta', 'adhesivo'],
  };

  /** Normalizes text by removing accents and converting to lowercase. */
  public static normalize(text: string): string {
    return (text || '')
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim();
  }

  /** Gets all keyword variations (original, normalized, and synonyms). */
  public static getEquivalents(term: string): string[] {
    const normalized = this.normalize(term);
    const synonyms = this.TECH_SYNONYMS[normalized] || [];
    return [...new Set([term.toLowerCase(), normalized, ...synonyms])];
  }

  /** 
   * Checks if a search term matches any part of the target text (with synonyms).
   * Used for client-side filtering.
   */
  public static matches(query: string, searchScope: string): boolean {
    const terms = this.normalize(query).split(/\s+/).filter(t => t.length > 0);
    const scope = this.normalize(searchScope);
    
    return terms.every(term => {
      const equivalents = this.getEquivalents(term);
      return equivalents.some(eq => scope.includes(eq));
    });
  }

  /**
   * Calculates a relevance score for a product based on the query.
   * Higher score = more relevant.
   */
  public static getRelevanceScore(productName: string, query: string): number {
    const nName = this.normalize(productName);
    const terms = this.normalize(query).split(/\s+/).filter(t => t.length > 1);
    
    if (terms.length === 0) return 0;
    
    let score = 0;
    
    // Exact match in name (highest priority)
    if (nName === this.normalize(query)) score += 1000;
    
    for (const term of terms) {
      const equivalents = this.getEquivalents(term);
      
      // Term itself matches start of name
      if (nName.startsWith(term)) score += 100;
      
      // Term matches part of name
      if (nName.includes(term)) score += 50;
      
      // Synonyms match name
      const matchingSynonyms = equivalents.filter(eq => eq !== term && nName.includes(eq));
      score += matchingSynonyms.length * 10;
    }
    
    return score;
  }
}
