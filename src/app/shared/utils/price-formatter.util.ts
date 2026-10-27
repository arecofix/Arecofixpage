export type SupportedCurrency = 'ARS' | 'USD';

export interface FormatPriceOptions {
  /** Cantidad fija o máxima de decimales (por defecto: 2 para USD, 0 para ARS si no tiene centavos) */
  decimals?: number;
  /** Prefijo visual opcional (ej: '⇄ ' para precios convertidos) */
  prefix?: string;
  /** Estilo de símbolo: 'standard' ('U$D' / 'AR$') o 'short' ('US$' / '$') */
  symbolStyle?: 'standard' | 'short';
  /** Valor de fallback en caso de recibir null, undefined o NaN */
  fallback?: string;
}

/**
 * Formatea un importe numérico según la moneda indicada con convención es-AR.
 * Previene la confusión visual entre dólares y pesos argentinos.
 *
 * @example
 * formatPrice(425, 'USD')                      // -> "U$D 425,00"
 * formatPrice(698798, 'ARS')                   // -> "AR$ 698.798"
 * formatPrice(698798, 'ARS', { prefix: '⇄ ' }) // -> "⇄ AR$ 698.798"
 */
export function formatPrice(
  value: number | string | null | undefined,
  currency: SupportedCurrency | string = 'ARS',
  options: FormatPriceOptions = {}
): string {
  const {
    prefix = '',
    symbolStyle = 'standard',
    fallback = '-'
  } = options;

  const num = typeof value === 'string' ? parseFloat(value) : value;

  if (num === null || num === undefined || isNaN(num)) {
    return fallback;
  }

  const isUSD = (currency || 'ARS').toUpperCase() === 'USD';

  // Determinación de decimales según la moneda
  const defaultDecimals = isUSD ? 2 : (num % 1 !== 0 ? 2 : 0);
  const decimals = options.decimals !== undefined ? options.decimals : defaultDecimals;

  // Formateador estándar según configuración regional de Argentina
  const formatter = new Intl.NumberFormat('es-AR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  const formattedNumber = formatter.format(num);

  // Símbolos inequívocos
  const currencySymbol = isUSD
    ? (symbolStyle === 'standard' ? 'U$D' : 'US$')
    : (symbolStyle === 'standard' ? 'AR$' : '$');

  return `${prefix}${currencySymbol} ${formattedNumber}`;
}
