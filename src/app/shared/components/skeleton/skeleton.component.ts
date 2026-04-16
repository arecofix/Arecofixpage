import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-skeleton',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div 
      [style.width]="width" 
      [style.height]="height" 
      [class]="'animate-pulse bg-gray-200 dark:bg-gray-800 ' + borderRadius"
      aria-hidden="true"
    ></div>
  `,
  styleUrl: './skeleton.component.scss'
})
export class SkeletonComponent {
  @Input() width: string = '100%';
  @Input() height: string = '1rem';
  @Input() borderRadius: string = 'rounded';
}
