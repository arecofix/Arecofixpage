import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'orderStatus',
  standalone: true
})
export class OrderStatusPipe implements PipeTransform {

  transform(value: string | undefined | null): string {
    if (!value) return '';
    
    const texts: Record<string, string> = {
        pending: 'A Pagar',
        processing: 'Abonado',
        completed: 'Completado',
        cancelled: 'Cancelado'
    };

    return texts[value] || value;
  }
}
