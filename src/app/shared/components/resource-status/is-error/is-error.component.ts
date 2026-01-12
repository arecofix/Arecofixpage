import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'is-error',
  standalone: true,
  imports: [],
  template: `
    <div
      role="alert"
      class="alert alert-error alert-outline text-center p-10 m-10"
    >
      <span> {{ message }} </span>
    </div>
  `,

  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IsErrorComponent {
  @Input() message: string = 'Ups! Ocurrio Un Error Al Cargar Los Datos';
}
