/**
 * Number & Currency Utilities
 */
export class NumberUtils {
  /**
   * Formats a number as ARS currency (e.g. $ 1.234)
   * Centralized to ensure consistency across the app.
   */
  static formatCurrency(amount: number): string {
    return '$ ' + new Intl.NumberFormat('es-AR', { 
        maximumFractionDigits: 0,
        minimumFractionDigits: 0 
    }).format(amount);
  }

  /**
   * Calculates the profit margin percentage safely
   */
  static calculateMargin(gross: number, net: number): number {
    if (!gross || gross <= 0) return 0;
    return Math.round((net / gross) * 100);
  }
}
