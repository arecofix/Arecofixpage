import { Pipe, PipeTransform } from '@angular/core';
import { getOrderStatusLabel } from '@app/features/orders/domain/value-objects/order-status.vo';

@Pipe({
  name: 'orderStatus',
  standalone: true,
})
export class OrderStatusPipe implements PipeTransform {
  transform(value: string | undefined | null): string {
    return getOrderStatusLabel(value);
  }
}
