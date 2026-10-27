import { Pipe, PipeTransform } from '@angular/core';
import { formatPrice, FormatPriceOptions, SupportedCurrency } from '../utils/price-formatter.util';

@Pipe({
  name: 'formatPrice',
  standalone: true,
})
export class FormatPricePipe implements PipeTransform {
  transform(
    value: number | string | null | undefined,
    currency: SupportedCurrency | string = 'ARS',
    options?: FormatPriceOptions
  ): string {
    return formatPrice(value, currency, options);
  }
}
