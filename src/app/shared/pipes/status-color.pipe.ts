import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'statusColor',
  standalone: true
})
export class StatusColorPipe implements PipeTransform {

  transform(value: string | undefined | null): string {
    if (!value) return 'badge-ghost';
    
    // Maps status to daisyUI/Tailwind badge classes
    const classes: Record<string, string> = {
        pending: 'badge-error',      // Red for unpaid/pending
        processing: 'badge-success', // Green for paid/processing
        completed: 'badge-success',  // Green for completed
        cancelled: 'badge-error',    // Red for cancelled
        // Add more status mappings here if needed across the app
        deleted: 'badge-ghost'
    };

    return classes[value] || 'badge-ghost';
  }
}
